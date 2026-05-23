"use client";

import Link from "next/link";
import { Plus, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { AssignmentCard } from "@/components/assignment/assignment-card";

export default function Home() {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await fetch('/api/assignments');
        if (response.ok) {
          const data = await response.json();
          setAssignments(data);
        }
      } catch (error) {
        console.error('Failed to fetch assignments:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAssignments();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-160px)]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (assignments.length > 0) {
    return (
      <div className="p-6 md:p-10 max-w-[1400px] mx-auto">
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="h-3 w-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-200" />
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Dashboard</h1>
            </div>
            <p className="text-sm md:text-base text-muted-foreground font-medium opacity-80">Overview of your recent assignments and activity.</p>
          </div>
          
          <Link href="/assignments" className="text-sm font-bold text-brand hover:underline flex items-center gap-2 group transition-all">
            View All Assignments 
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assignments.slice(0, 6).map((item) => (
            <AssignmentCard
              key={item._id}
              id={item._id}
              title={item.title}
              status={item.status}
              assignedDate={new Date(item.createdAt).toLocaleDateString()}
              dueDate={item.dueDate ? new Date(item.dueDate).toLocaleDateString() : 'N/A'}
            />
          ))}
        </div>

        <div className="fixed bottom-[100px] md:bottom-10 right-4 md:right-10 z-40">
          <Link
            href="/assignments/create"
            className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-2xl shadow-primary/20 hover:opacity-90 active:scale-[0.95] transition-all"
          >
            <Plus className="h-7 w-7" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
      <div className="w-full max-w-lg rounded-[2.5rem] border border-border/60 bg-card flex flex-col items-center justify-center px-8 py-16 text-center shadow-[0_10px_40px_-15px_rgba(0,0,0,0.03)]">
        <div className="relative mb-10">
          <div className="h-40 w-40 md:h-52 md:w-52 rounded-full bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center border border-white shadow-inner">
            <div className="relative">
              <div className="h-20 w-16 md:h-28 md:w-24 rounded-xl bg-white border border-slate-200 shadow-xl flex flex-col gap-2 p-3 md:p-4 rotate-[-5deg] group-hover:rotate-0 transition-transform duration-500">
                <div className="h-2 w-10 md:h-2.5 md:w-14 rounded-full bg-slate-800" />
                <div className="h-1 w-full rounded-full bg-slate-100" />
                <div className="h-1 w-3/4 rounded-full bg-slate-100" />
                <div className="h-1 w-full rounded-full bg-slate-100" />
                <div className="h-1 w-1/2 rounded-full bg-slate-100" />
              </div>
              <div className="absolute -bottom-3 -right-4 md:-bottom-4 md:-right-6 h-10 w-10 md:h-14 md:w-14 rounded-2xl border-[3px] border-white bg-red-50 text-red-500 shadow-lg flex items-center justify-center rotate-[10deg]">
                <span className="text-xl md:text-2xl font-black">✕</span>
              </div>
            </div>
          </div>
          <span className="absolute -top-4 -left-6 text-brand text-2xl md:text-3xl animate-pulse">✦</span>
          <span className="absolute bottom-6 -right-4 text-brand/60 text-lg md:text-xl">✦</span>
        </div>
        
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-3">No assignments yet</h2>
        <p className="max-w-xs md:max-w-sm text-muted-foreground font-medium leading-relaxed mb-10">
          Create your first assignment to start collecting and grading student submissions with AI.
        </p>
        
        <Link
          href="/assignments/create"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-2xl bg-primary px-8 py-4 text-base font-bold text-primary-foreground shadow-xl shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all"
        >
          <Plus className="h-5 w-5" />
          Create First Assignment
        </Link>
      </div>
    </div>
  );
}