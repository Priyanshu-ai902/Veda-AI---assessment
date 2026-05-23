import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { GeneratedPaper } from '@/models/GeneratedPaper';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const paper = await GeneratedPaper.findOne({ assignmentId: id });
    if (!paper) return NextResponse.json({ error: 'Paper not generated yet' }, { status: 404 });
    return NextResponse.json(paper);
  } catch (error) {
    return NextResponse.json({ error: 'Server error fetching paper' }, { status: 500 });
  }
}
