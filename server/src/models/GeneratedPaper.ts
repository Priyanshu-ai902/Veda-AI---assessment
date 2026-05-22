import mongoose, { Document, Schema } from 'mongoose';

export interface IQuestion {
  question: string;
  difficulty: string;
  marks: number;
}

export interface ISection {
  title: string;
  instruction: string;
  questions: IQuestion[];
}

export interface IGeneratedPaper extends Document {
  assignmentId: mongoose.Types.ObjectId;
  title: string;
  class?: string;
  subject?: string;
  sections: ISection[];
  generatedContent: any;
  pdfUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema = new Schema<IQuestion>({
  question: { type: String, required: true },
  difficulty: { type: String, required: true },
  marks: { type: Number, required: true }
});

const SectionSchema = new Schema<ISection>({
  title: { type: String, required: true },
  instruction: { type: String, required: true },
  questions: [QuestionSchema]
});

const GeneratedPaperSchema = new Schema<IGeneratedPaper>({
  assignmentId: { type: Schema.Types.ObjectId, ref: 'Assignment', required: true },
  title: { type: String, required: true },
  class: { type: String },
  subject: { type: String },
  sections: [SectionSchema],
  generatedContent: { type: Schema.Types.Mixed },
  pdfUrl: { type: String },
}, { timestamps: true });

export const GeneratedPaper = mongoose.model<IGeneratedPaper>('GeneratedPaper', GeneratedPaperSchema);
