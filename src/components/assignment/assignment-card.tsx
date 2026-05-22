import { MoreVertical } from "lucide-react";
import Link from "next/link";

interface AssignmentCardProps {
  id: string;
  title: string;
  status: string;
  assignedDate: string;
  dueDate: string;
}

export function AssignmentCard({ id, title, status, assignedDate, dueDate }: AssignmentCardProps) {
  return (
    <Link 
      href={`/assignments/output?id=${id}`} 
      className="group rounded-3xl border border-border/60 bg-card p-6 shadow-[0_2px_10px_-1px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-brand/20 transition-all duration-300 active:scale-[0.99] block relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-1.5 h-full bg-transparent group-hover:bg-brand transition-all" />
      
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="font-bold text-base md:text-lg text-foreground group-hover:text-brand transition-colors truncate mb-3 leading-tight">{title}</h3>
          <div className="flex items-center gap-2">
            <span className={`text-[10px] px-2.5 py-1 rounded-lg font-bold uppercase tracking-wider border transition-colors ${
              status === 'completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
              status === 'failed' ? 'bg-red-50 text-red-700 border-red-100' :
              'bg-amber-50 text-amber-700 border-amber-100'
            }`}>
              {status}
            </span>
          </div>
        </div>
        <button className="rounded-xl p-2 hover:bg-secondary shrink-0 text-muted-foreground transition-colors" onClick={(e) => e.preventDefault()}>
          <MoreVertical className="h-5 w-5" />
        </button>
      </div>
      
      <div className="mt-10 pt-6 border-t border-border/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Assigned</span>
          <span className="text-xs text-foreground font-semibold">{assignedDate}</span>
        </div>
        <div className="flex flex-col sm:items-end gap-1">
          <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Due Date</span>
          <span className="text-xs text-brand font-bold">{dueDate}</span>
        </div>
      </div>
    </Link>
  );
}