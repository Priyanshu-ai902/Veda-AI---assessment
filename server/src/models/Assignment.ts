import mongoose, { Document, Schema } from 'mongoose';

export interface IQuestionType {
  type: string;
  count: number;
  marks: number;
}

export interface IAssignment extends Document {
  title: string;
  uploadedFile?: string;
  dueDate?: Date;
  questionTypes: IQuestionType[];
  instructions?: string;
  status: 'pending' | 'queued' | 'processing' | 'completed' | 'failed';
  totalMarks: number;
  totalQuestions: number;
  createdAt: Date;
  updatedAt: Date;
}

const QuestionTypeSchema = new Schema<IQuestionType>({
  type: { type: String, required: true },
  count: { type: Number, required: true },
  marks: { type: Number, required: true }
});

const AssignmentSchema = new Schema<IAssignment>({
  title: { type: String, required: true },
  uploadedFile: { type: String },
  dueDate: { type: Date },
  questionTypes: [QuestionTypeSchema],
  instructions: { type: String },
  status: { type: String, enum: ['pending', 'queued', 'processing', 'completed', 'failed'], default: 'pending' },
  totalMarks: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
}, { timestamps: true });

export const Assignment = mongoose.model<IAssignment>('Assignment', AssignmentSchema);
