import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { GeneratedPaper } from '@/models/GeneratedPaper';
import { generatePDF } from '@/services/pdfService';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const paper = await GeneratedPaper.findById(id);
    
    if (!paper) {
      return NextResponse.json({ error: 'PDF not found' }, { status: 404 });
    }

    // Generate PDF on the fly using Puppeteer inside the Next.js API Route
    const pdfBuffer = await generatePDF(paper);

    return new NextResponse(pdfBuffer as unknown as BodyInit, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="assignment_${paper._id}.pdf"`,
      },
    });

  } catch (error) {
    console.error(`[Download] Critical error:`, error);
    return NextResponse.json({ error: 'Server error generating PDF' }, { status: 500 });
  }
}
