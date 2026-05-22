import { create } from 'zustand';

export type QuestionRow = {
  id: string;
  type: string;
  count: number;
  marks: number;
};

interface AssignmentState {
  rows: QuestionRow[];
  updateRow: (id: string, patch: Partial<QuestionRow>) => void;
  addRow: (type: string, count: number, marks: number) => void;
  removeRow: (id: string) => void;
  totalQuestions: () => number;
  totalMarks: () => number;
  
  // Realtime Generation State
  currentAssignmentId: string | null;
  setCurrentAssignmentId: (id: string | null) => void;
  generationStatus: string;
  generationProgress: number;
  setGenerationStatus: (status: string, progress: number) => void;
  resetGenerationState: () => void;
}

export const useAssignmentStore = create<AssignmentState>((set, get) => ({
  rows: [
    { id: '1', type: "Multiple Choice Questions", count: 4, marks: 1 },
    { id: '2', type: "Short Questions", count: 3, marks: 2 },
    { id: '3', type: "Diagram/Graph-Based Questions", count: 5, marks: 5 },
    { id: '4', type: "Numerical Problems", count: 5, marks: 5 },
  ],
  updateRow: (id, patch) =>
    set((state) => ({
      rows: state.rows.map((r) => (r.id === id ? { ...r, ...patch } : r)),
    })),
  addRow: (type, count, marks) =>
    set((state) => ({
      rows: [...state.rows, { id: Date.now().toString(), type, count, marks }],
    })),
  removeRow: (id) =>
    set((state) => ({
      rows: state.rows.filter((r) => r.id !== id),
    })),
  totalQuestions: () => get().rows.reduce((acc, r) => acc + r.count, 0),
  totalMarks: () => get().rows.reduce((acc, r) => acc + (r.count * r.marks), 0),

  currentAssignmentId: null,
  setCurrentAssignmentId: (id) => set({ currentAssignmentId: id }),
  generationStatus: 'idle',
  generationProgress: 0,
  setGenerationStatus: (status, progress) => set({ generationStatus: status, generationProgress: progress }),
  resetGenerationState: () => set({ generationStatus: 'idle', generationProgress: 0, currentAssignmentId: null }),
}));
