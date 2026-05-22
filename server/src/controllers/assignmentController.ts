import { Request, Response } from 'express';
import { Assignment } from '../models/Assignment';
import { GeneratedPaper } from '../models/GeneratedPaper';
import { addGenerationJob } from '../queues/generationQueue';
import { generateQuestionPaper } from '../services/aiService';
import { generatePDF } from '../services/pdfService';
import path from 'path';
import fs from 'fs';

export const createAssignment = async (req: Request, res: Response) => {
  try {
    const { title, dueDate, questionTypes, instructions, totalMarks, totalQuestions } = req.body;
    
    const parsedQuestionTypes = typeof questionTypes === 'string' ? JSON.parse(questionTypes) : questionTypes;

    const assignment = new Assignment({
      title,
      dueDate,
      questionTypes: parsedQuestionTypes,
      instructions,
      totalMarks,
      totalQuestions,
      status: 'queued',
      uploadedFile: req.file ? req.file.path : undefined
    });

    await assignment.save();

    if (process.env.VERCEL) {
      // Synchronous generation for Vercel Serverless
      console.log(`[Vercel] Starting synchronous generation for: ${assignment._id}`);
      
      try {
        // AI Generation
        const generatedData = await generateQuestionPaper(assignment);

        // PDF Path
        const pdfDir = path.resolve(process.cwd(), 'uploads/pdfs');
        if (!fs.existsSync(pdfDir)) {
          fs.mkdirSync(pdfDir, { recursive: true });
        }
        const pdfFilename = `assignment_${assignment._id}_${Date.now()}.pdf`;
        const pdfPath = path.join(pdfDir, pdfFilename);

        // PDF Generation
        await generatePDF(assignment, pdfPath);

        // Save Paper
        const paper = new GeneratedPaper({
          assignmentId: assignment._id,
          title: generatedData.title,
          class: generatedData.class,
          subject: generatedData.subject,
          sections: generatedData.sections,
          generatedContent: generatedData,
          pdfUrl: `/uploads/pdfs/${pdfFilename}`
        });
        await paper.save();

        // Update Assignment
        assignment.status = 'completed';
        await assignment.save();
        
        console.log(`[Vercel] Sync generation successful for: ${assignment._id}`);
      } catch (genError) {
        console.error(`[Vercel] Sync generation failed:`, genError);
        assignment.status = 'failed';
        await assignment.save();
      }
    } else {
      // Async generation for local/dedicated servers
      await addGenerationJob(assignment._id.toString());
    }

    res.status(201).json({ message: 'Assignment created', assignmentId: assignment._id });
  } catch (error) {
    console.error('Create Assignment Error:', error);
    res.status(500).json({ error: 'Server error creating assignment' });
  }
};

export const getAssignments = async (req: Request, res: Response) => {
  try {
    const assignments = await Assignment.find().sort({ createdAt: -1 });
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching assignments' });
  }
};

export const getAssignmentById = async (req: Request, res: Response) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ error: 'Assignment not found' });
    res.json(assignment);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getOutputByAssignmentId = async (req: Request, res: Response) => {
  try {
    const paper = await GeneratedPaper.findOne({ assignmentId: req.params.id });
    if (!paper) return res.status(404).json({ error: 'Paper not generated yet' });
    res.json(paper);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching paper' });
  }
};

export const deleteAssignment = async (req: Request, res: Response) => {
  try {
    await Assignment.findByIdAndDelete(req.params.id);
    await GeneratedPaper.deleteMany({ assignmentId: req.params.id });
    res.json({ message: 'Assignment deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error deleting assignment' });
  }
};

export const downloadPDF = async (req: Request, res: Response) => {
  try {
    console.log(`[Download] Request for Paper ID: ${req.params.id}`);
    const paper = await GeneratedPaper.findById(req.params.id);
    
    if (!paper || !paper.pdfUrl) {
      console.warn(`[Download] Paper or PDF URL missing for ID: ${req.params.id}`);
      return res.status(404).json({ error: 'PDF not found' });
    }

    const fullPath = path.join(process.cwd(), paper.pdfUrl);
    
    if (!fs.existsSync(fullPath)) {
      console.error(`[Download] File does not exist on disk: ${fullPath}`);
      return res.status(404).json({ error: 'PDF file missing on server' });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="assignment_${paper._id}.pdf"`);
    
    res.download(fullPath, `assignment_${paper._id}.pdf`, (err) => {
      if (err) {
        console.error(`[Download] Error during file transmission:`, err);
        if (!res.headersSent) {
          res.status(500).send('Error downloading file');
        }
      }
    });
  } catch (error) {
    console.error(`[Download] Critical error:`, error);
    res.status(500).json({ error: 'Server error' });
  }
};
