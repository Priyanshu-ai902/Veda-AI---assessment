"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud, Calendar, Plus, Mic, Loader2 } from "lucide-react";
import { useAssignmentStore } from "@/store/use-assignment-store";
import { QuestionRowItem } from "@/components/assignment/question-row";

export default function CreateAssignmentPage() {
  const router = useRouter();
  const { rows, addRow, totalQuestions, totalMarks, setCurrentAssignmentId } = useAssignmentStore();
  
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [instructions, setInstructions] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!title) {
      alert("Please provide an assignment title");
      return;
    }

    try {
      setIsSubmitting(true);
      
      const payload = {
        title,
        dueDate,
        instructions,
        totalQuestions: totalQuestions(),
        totalMarks: totalMarks(),
        questionTypes: rows
      };

      const response = await fetch('/api/assignments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Failed to create assignment');
      }

      const data = await response.json();

      setCurrentAssignmentId(data.assignmentId);
      router.push(`/assignments/output?id=${data.assignmentId}`);
    } catch (error) {
      console.error("Submission failed", error);
      alert("Failed to create assignment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="px-6 md:px-10 py-10 max-w-[1200px] mx-auto">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <span className="h-3 w-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-200" />
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Create Assignment</h1>
        </div>
        <p className="text-sm md:text-base text-muted-foreground font-medium opacity-80 ml-6">Set up a new assignment for your students.</p>
      </div>

      {/* Stepper */}
      <div className="mx-auto mb-12 flex max-w-2xl items-center gap-3">
        <div className="h-1.5 flex-1 rounded-full bg-primary shadow-sm" />
        <div className="h-1.5 flex-1 rounded-full bg-border/50" />
        <div className="h-1.5 flex-1 rounded-full bg-border/50" />
      </div>

      <div className="mx-auto max-w-3xl rounded-[2.5rem] border border-border/60 bg-card p-6 md:p-12 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.02)] mb-20 md:mb-0">
        <div className="mb-10">
          <h2 className="text-xl font-bold tracking-tight mb-1">Assignment Details</h2>
          <p className="text-sm text-muted-foreground font-medium opacity-70">Basic information about your assignment</p>
        </div>

        <div className="space-y-8">
          <div>
            <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground ml-1 mb-2.5 block">Assignment Title *</label>
            <div className="flex items-center justify-between rounded-2xl border border-border/60 px-5 py-4 bg-secondary/20 focus-within:border-brand/40 focus-within:ring-4 focus-within:ring-brand/5 transition-all">
              <input 
                placeholder="e.g. Science Chapter 4 Quiz" 
                className="flex-1 bg-transparent text-sm font-semibold outline-none w-full placeholder:font-medium placeholder:opacity-50" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
          </div>

          <div className="rounded-3xl border-2 border-dashed border-border/60 bg-secondary/10 p-8 md:p-12 text-center relative group hover:bg-secondary/20 hover:border-brand/30 transition-all">
            <input 
              type="file" 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <div className="relative z-0">
              <div className="mx-auto h-16 w-16 rounded-2xl bg-card flex items-center justify-center shadow-sm border border-border/40 group-hover:scale-110 transition-transform mb-4">
                <UploadCloud className="h-8 w-8 text-brand" />
              </div>
              <p className="text-base font-bold text-foreground">
                {file ? file.name : "Upload material (Not Supported in Demo)"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground font-medium">
                {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : "JPEG, PNG, PDF up to 10MB"}
              </p>
              {!file && (
                <button className="mt-6 rounded-xl bg-card border border-border/60 px-6 py-2.5 text-xs font-bold hover:bg-secondary transition-all shadow-sm">
                  Browse Files
                </button>
              )}
            </div>
          </div>

          <div>
            <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground ml-1 mb-2.5 block">Due Date</label>
            <div className="flex items-center justify-between rounded-2xl border border-border/60 px-5 py-4 bg-secondary/20 focus-within:border-brand/40 transition-all">
              <input 
                type="date" 
                className="flex-1 bg-transparent text-sm font-semibold outline-none w-full appearance-none" 
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
              <Calendar className="h-5 w-5 text-muted-foreground/60 shrink-0" />
            </div>
          </div>

          <div className="pt-4">
            <div className="mb-6 grid grid-cols-12 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 px-2">
              <div className="col-span-6">Question Type</div>
              <div className="col-span-4 text-center">Questions</div>
              <div className="col-span-2 text-center">Marks</div>
            </div>
            <div className="flex flex-col gap-4">
              {rows.map((row) => (
                <QuestionRowItem key={row.id} row={row} />
              ))}
            </div>
            <button
              onClick={() => addRow("New Question Type", 1, 1)}
              className="mt-8 flex items-center gap-3 text-sm font-bold text-brand hover:opacity-80 transition-all group"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand/10 text-brand group-hover:scale-110 transition-transform">
                <Plus className="h-4 w-4" />
              </span>
              Add New Question Type
            </button>
            
            <div className="mt-10 pt-10 border-t border-border/40 flex flex-col items-end gap-2">
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-4">
                Total Questions 
                <span className="text-lg text-foreground font-black min-w-[2rem] text-right">{totalQuestions()}</span>
              </div>
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-4">
                Total Marks 
                <span className="text-lg text-brand font-black min-w-[2rem] text-right">{totalMarks()}</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-border/40">
            <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground ml-1 mb-3 block">Additional Instructions</label>
            <div className="flex items-end gap-3 rounded-2xl border border-border/60 p-4 bg-secondary/10 focus-within:border-brand/40 transition-all">
              <textarea
                rows={4}
                placeholder="e.g. Generate a question paper for a 3-hour exam duration..."
                className="flex-1 resize-none bg-transparent text-sm font-medium outline-none placeholder:opacity-50"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
              />
              <button className="p-2 text-muted-foreground hover:bg-secondary rounded-xl transition-all shrink-0 border border-transparent hover:border-border/40">
                <Mic className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-12 flex max-w-3xl items-center justify-between gap-6 pb-24 md:pb-12">
        <button className="flex-1 md:flex-none rounded-2xl border border-border/60 bg-card px-10 py-4 text-sm font-bold hover:bg-secondary transition-all active:scale-[0.98]" onClick={() => router.back()}>
          ← Previous
        </button>
        <button 
          onClick={handleSubmit} 
          disabled={isSubmitting}
          className="flex-1 md:flex-none rounded-2xl bg-primary px-12 py-4 text-sm font-bold text-primary-foreground flex items-center justify-center gap-3 disabled:opacity-50 shadow-xl shadow-primary/20 active:scale-[0.95] transition-all"
        >
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Generate Assignment →
        </button>
      </div>
    </div>
  );
}
