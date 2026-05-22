import { Worker } from 'bullmq';
import { redisConnection } from '../config/redis';
import { Assignment } from '../models/Assignment';
import { GeneratedPaper } from '../models/GeneratedPaper';
import { generateQuestionPaper } from '../services/aiService';
import { generatePDF } from '../services/pdfService';
import { notifyAssignmentProgress } from '../sockets/socketManager';
import path from 'path';
import fs from 'fs';

export const startGenerationWorker = () => {
  const worker = new Worker('generation-queue', async job => {
    const { assignmentId } = job.data;
    
    try {
      console.log(`[Worker] Starting job for Assignment: ${assignmentId}`);
      
      const assignment = await Assignment.findById(assignmentId);
      if (!assignment) {
        throw new Error(`Assignment not found: ${assignmentId}`);
      }

      // 1. Initial Processing
      assignment.status = 'processing';
      await assignment.save();
      notifyAssignmentProgress(assignmentId, 'generation:progress', { 
        status: 'processing', 
        progress: 10, 
        message: 'Parsing requirements and initializing AI pipeline...' 
      });

      // 2. AI Structured Generation
      notifyAssignmentProgress(assignmentId, 'generation:progress', { 
        status: 'generating', 
        progress: 40, 
        message: 'AI is generating questions (Groq/Gemini)...' 
      });
      
      const generatedData = await generateQuestionPaper(assignment);

      // 3. Asset Directories - Consistent path logic
      const pdfDir = path.resolve(process.cwd(), 'uploads/pdfs');
      if (!fs.existsSync(pdfDir)) {
        fs.mkdirSync(pdfDir, { recursive: true });
      }
      
      const pdfFilename = `assignment_${assignmentId}_${Date.now()}.pdf`;
      const pdfPath = path.join(pdfDir, pdfFilename);
      
      // 4. PDF Layout & Compilation
      notifyAssignmentProgress(assignmentId, 'generation:progress', { 
        status: 'pdf-generation', 
        progress: 80, 
        message: 'Compiling PDF with professional layout...' 
      });
      
      console.log(`[Worker] Generating PDF at: ${pdfPath}`);
      await generatePDF(assignment, pdfPath);
      console.log(`[Worker] PDF successfully generated at: ${pdfPath}`);

      // 5. Persistence - Use relative path for storage
      const relativePdfUrl = `/uploads/pdfs/${pdfFilename}`;
      const paper = new GeneratedPaper({
        assignmentId: assignment._id,
        title: generatedData.title,
        class: generatedData.class,
        subject: generatedData.subject,
        sections: generatedData.sections,
        generatedContent: generatedData,
        pdfUrl: relativePdfUrl
      });
      await paper.save();

      // 6. Success State
      assignment.status = 'completed';
      await assignment.save();
      
      console.log(`[Worker] Job completed for Assignment: ${assignmentId}. Saved at ${relativePdfUrl}`);
      notifyAssignmentProgress(assignmentId, 'generation:completed', { 
        status: 'completed', 
        progress: 100, 
        paperId: paper._id, 
        message: 'Generation successful!' 
      });

    } catch (error) {
      const errorMessage = (error as Error).message;
      console.error(`[Worker] Job Critical Failure (${assignmentId}):`, errorMessage);
      
      try {
        await Assignment.findByIdAndUpdate(assignmentId, { status: 'failed' });
        notifyAssignmentProgress(assignmentId, 'generation:failed', { 
          status: 'failed', 
          error: errorMessage,
          message: 'Generation failed after multiple retries.'
        });
      } catch (innerError) {
        console.error('[Worker] Failed to update failure state in DB:', innerError);
      }
      
      throw error;
    }
  }, { 
    connection: redisConnection,
    removeOnComplete: { count: 100 },
    removeOnFail: { count: 500 }
  });

  worker.on('failed', (job, err) => {
    console.error(`[Worker] Job ${job?.id} failed permanently: ${err.message}`);
  });

  return worker;
};
