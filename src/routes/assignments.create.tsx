import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { UploadCloud, Calendar, Plus, Minus, X, Mic, ChevronDown } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/assignments/create")({ component: Create });

type Q = { type: string; count: number; marks: number };

function Create() {
  const [rows, setRows] = useState<Q[]>([
    { type: "Multiple Choice Questions", count: 4, marks: 1 },
    { type: "Short Questions", count: 3, marks: 2 },
    { type: "Diagram/Graph-Based Questions", count: 5, marks: 5 },
    { type: "Numerical Problems", count: 5, marks: 5 },
  ]);

  const update = (i: number, patch: Partial<Q>) =>
    setRows((r) => r.map((row, idx) => (idx === i ? { ...row, ...patch } : row)));
  const total = rows.reduce((a, r) => a + r.count, 0);
  const totalMarks = rows.reduce((a, r) => a + r.count * r.marks, 0);

  return (
    <AppShell title="Assignment">
      <div className="px-8 py-6">
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <h1 className="text-xl font-semibold">Create Assignment</h1>
          </div>
          <p className="mt-1 ml-5 text-sm text-muted-foreground">Set up a new assignment for your students</p>
        </div>

        {/* Stepper */}
        <div className="mx-auto mb-6 flex max-w-3xl items-center gap-2">
          <div className="h-1 flex-1 rounded-full bg-primary" />
          <div className="h-1 flex-1 rounded-full bg-border" />
          <div className="h-1 flex-1 rounded-full bg-border" />
        </div>

        <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-card p-8 shadow-sm">
          <h2 className="text-lg font-semibold">Assignment Details</h2>
          <p className="text-sm text-muted-foreground">Basic information about your assignment</p>

          <div className="mt-6 rounded-xl border-2 border-dashed border-border bg-secondary/40 p-10 text-center">
            <UploadCloud className="mx-auto h-7 w-7 text-muted-foreground" />
            <p className="mt-3 text-sm font-medium">Choose a file or drag & drop it here</p>
            <p className="text-xs text-muted-foreground">JPEG, PNG, upto 10MB</p>
            <button className="mt-4 rounded-full border border-border bg-card px-5 py-2 text-sm font-medium hover:bg-secondary">Browse Files</button>
          </div>
          <p className="mt-2 text-center text-xs text-muted-foreground">Upload images of your preferred document/image</p>

          <div className="mt-6">
            <label className="text-sm font-medium">Due Date</label>
            <div className="mt-2 flex items-center justify-between rounded-lg border border-border px-4 py-2.5">
              <input placeholder="DD-MM-YYYY" className="flex-1 bg-transparent text-sm outline-none" />
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          <div className="mt-6">
            <div className="mb-2 grid grid-cols-12 text-sm font-medium">
              <div className="col-span-6">Question Type</div>
              <div className="col-span-4 text-center">No. of Questions</div>
              <div className="col-span-2 text-center">Marks</div>
            </div>
            <div className="flex flex-col gap-3">
              {rows.map((r, i) => (
                <div key={i} className="grid grid-cols-12 items-center gap-3">
                  <div className="col-span-6 flex items-center justify-between rounded-lg border border-border px-3 py-2.5 text-sm">
                    <span>{r.type}</span>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <ChevronDown className="h-4 w-4" />
                      <button onClick={() => setRows(rows.filter((_, idx) => idx !== i))}><X className="h-4 w-4" /></button>
                    </div>
                  </div>
                  <Counter className="col-span-4" value={r.count} onChange={(v) => update(i, { count: v })} />
                  <Counter className="col-span-2" value={r.marks} onChange={(v) => update(i, { marks: v })} />
                </div>
              ))}
            </div>
            <button
              onClick={() => setRows([...rows, { type: "New Question Type", count: 1, marks: 1 }])}
              className="mt-4 flex items-center gap-2 text-sm font-medium"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground"><Plus className="h-4 w-4" /></span>
              Add Question Type
            </button>
            <div className="mt-4 text-right text-sm">
              <div>Total Questions : {total}</div>
              <div>Total Marks : {totalMarks}</div>
            </div>
          </div>

          <div className="mt-6">
            <label className="text-sm font-medium">Additional Information (For better output)</label>
            <div className="mt-2 flex items-end gap-2 rounded-lg border border-border p-3">
              <textarea
                rows={2}
                placeholder="e.g Generate a question paper for 3 hour exam duration..."
                className="flex-1 resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
              <button className="p-1 text-muted-foreground"><Mic className="h-4 w-4" /></button>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-6 flex max-w-3xl items-center justify-between">
          <button className="rounded-full border border-border bg-card px-6 py-2.5 text-sm">← Previous</button>
          <Link to="/assignments/output" className="rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground">Next →</Link>
        </div>
      </div>
    </AppShell>
  );
}

function Counter({ value, onChange, className = "" }: { value: number; onChange: (v: number) => void; className?: string }) {
  return (
    <div className={`flex items-center justify-between rounded-full border border-border px-3 py-1.5 text-sm ${className}`}>
      <button onClick={() => onChange(Math.max(0, value - 1))} className="text-muted-foreground hover:text-foreground"><Minus className="h-3.5 w-3.5" /></button>
      <span className="font-medium">{value}</span>
      <button onClick={() => onChange(value + 1)} className="text-muted-foreground hover:text-foreground"><Plus className="h-3.5 w-3.5" /></button>
    </div>
  );
}
