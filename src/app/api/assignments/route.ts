import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Assignment } from '@/models/Assignment';
import { GeneratedPaper } from '@/models/GeneratedPaper';
import { generateQuestionPaper } from '@/services/aiService';

export async function GET() {
  try {
    await dbConnect();
    const assignments = await Assignment.find().sort({ createdAt: -1 });
    return NextResponse.json(assignments);
  } catch (error) {
    console.error('Fetch Assignments Error:', error);
    return NextResponse.json({ error: 'Server error fetching assignments' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const { title, dueDate, questionTypes, instructions, totalMarks, totalQuestions } = body;
    
    const parsedQuestionTypes = typeof questionTypes === 'string' ? JSON.parse(questionTypes) : questionTypes;

    const assignment = new Assignment({
      title,
      dueDate,
      questionTypes: parsedQuestionTypes,
      instructions,
      totalMarks,
      totalQuestions,
      status: 'processing', // Since we do this synchronously now
    });

    await assignment.save();

    console.log(`[Vercel Serverless] Starting synchronous generation for: ${assignment._id}`);
      
    try {
      // AI Generation
      const generatedData = await generateQuestionPaper(assignment);

      // Save Paper (without PDF generation during this step to save time and avoid Vercel timeout limits)
      const paper = new GeneratedPaper({
        assignmentId: assignment._id,
        title: generatedData.title,
        class: generatedData.class,
        subject: generatedData.subject,
        sections: generatedData.sections,
        generatedContent: generatedData,
      });
      await paper.save();

      // Update Assignment
      assignment.status = 'completed';
      await assignment.save();
      
      console.log(`[Vercel Serverless] Sync generation successful for: ${assignment._id}`);
    } catch (genError) {
      console.error(`[Vercel Serverless] Sync generation failed:`, genError);
      assignment.status = 'failed';
      await assignment.save();
    }

    return NextResponse.json({ message: 'Assignment created', assignmentId: assignment._id }, { status: 201 });
  } catch (error) {
    console.error('Create Assignment Error:', error);
    return NextResponse.json({ error: 'Server error creating assignment' }, { status: 500 });
  }
}
