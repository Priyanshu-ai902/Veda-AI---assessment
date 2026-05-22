"use client";

import { ChevronDown, X, Plus, Minus } from "lucide-react";
import { QuestionRow as QuestionRowType, useAssignmentStore } from "@/store/use-assignment-store";

function Counter({ value, onChange, className = "" }: { value: number; onChange: (v: number) => void; className?: string }) {
  return (
    <div className={`flex items-center justify-between rounded-full border border-border px-3 py-1.5 text-sm ${className}`}>
      <button onClick={() => onChange(Math.max(0, value - 1))} className="text-muted-foreground hover:text-foreground">
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span className="font-medium">{value}</span>
      <button onClick={() => onChange(value + 1)} className="text-muted-foreground hover:text-foreground">
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export function QuestionRowItem({ row }: { row: QuestionRowType }) {
  const { updateRow, removeRow } = useAssignmentStore();

  return (
    <div className="grid grid-cols-12 items-center gap-3 md:gap-6 bg-secondary/20 md:bg-transparent p-3 md:p-0 rounded-2xl md:rounded-none border border-border/40 md:border-none">
      <div className="col-span-12 md:col-span-6 flex items-center justify-between rounded-xl border border-border/60 px-4 py-3 text-sm bg-card hover:border-brand/40 transition-all shadow-sm md:shadow-none">
        <span className="truncate font-bold text-foreground/80">{row.type}</span>
        <div className="flex items-center gap-2 text-muted-foreground shrink-0 ml-4">
          <ChevronDown className="h-4 w-4 hidden md:block opacity-40" />
          <button 
            onClick={() => removeRow(row.id)} 
            className="p-1 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="col-span-7 md:col-span-4">
        <Counter value={row.count} onChange={(v) => updateRow(row.id, { count: v })} />
      </div>
      <div className="col-span-5 md:col-span-2">
        <Counter value={row.marks} onChange={(v) => updateRow(row.id, { marks: v })} />
      </div>
    </div>
  );
}