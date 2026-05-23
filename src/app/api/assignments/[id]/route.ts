import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Assignment } from '@/models/Assignment';
import { GeneratedPaper } from '@/models/GeneratedPaper';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const assignment = await Assignment.findById(id);
    if (!assignment) return NextResponse.json({ error: 'Assignment not found' }, { status: 404 });
    return NextResponse.json(assignment);
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    await Assignment.findByIdAndDelete(id);
    await GeneratedPaper.deleteMany({ assignmentId: id });
    return NextResponse.json({ message: 'Assignment deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Server error deleting assignment' }, { status: 500 });
  }
}
