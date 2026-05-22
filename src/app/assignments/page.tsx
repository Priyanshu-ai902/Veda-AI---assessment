"use client";

import Link from "next/link";
import { Search, SlidersHorizontal, Plus, Loader2, FileText } from "lucide-react";
import { AssignmentCard } from "@/components/assignment/assignment-card";
import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/assignments`);
        setAssignments(data);
      } catch (error) {
        console.error('Failed to fetch assignments:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAssignments();
  }, []);

  return (
    <div className="p-6 md:p-10 max-w-[1400px] mx-auto">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="h-3 w-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-200" />
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Assignments</h1>
          </div>
          <p className="text-sm md:text-base text-muted-foreground font-medium opacity-80">Manage and create assignments for your classes.</p>
        </div>
        
        <Link href="/assignments/create" className="hidden md:flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/10 hover:opacity-90 active:scale-[0.98] transition-all">
          <Plus className="h-4 w-4" />
          Create New Assignment
        </Link>
      </div>

      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-card p-4 rounded-2xl border border-border/50 shadow-sm shadow-black/[0.01]">
        <button className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-secondary/80 text-sm font-bold text-muted-foreground hover:bg-secondary hover:text-foreground transition-all border border-border/40 w-fit">
          <SlidersHorizontal className="h-4 w-4" />
          Filter By
        </button>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground opacity-60" />
          <input
            placeholder="Search assignments by title..."
            className="h-11 w-full rounded-xl border border-border/60 bg-secondary/30 pl-11 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand/40 transition-all placeholder:font-medium placeholder:opacity-50"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-80 gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-brand" />
          <span className="text-sm font-bold text-muted-foreground animate-pulse uppercase tracking-widest">Loading Assignments...</span>
        </div>
      ) : assignments.length === 0 ? (
        <div className="text-center mt-20 p-10 bg-card rounded-3xl border border-dashed border-border/60 flex flex-col items-center">
          <div className="h-20 w-20 rounded-full bg-secondary flex items-center justify-center mb-6">
            <FileText className="h-8 w-8 text-muted-foreground opacity-40" />
          </div>
          <h3 className="text-lg font-bold mb-2">No assignments found</h3>
          <p className="text-sm text-muted-foreground max-w-xs mb-8">You haven't created any assignments yet. Start by creating one to see it here.</p>
          <Link href="/assignments/create" className="rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/10 hover:opacity-90">
            Create First Assignment
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assignments.map((item) => (
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
      )}

      <div className="fixed bottom-[100px] md:hidden right-4 z-40">
        <Link href="/assignments/create" className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-2xl hover:opacity-90">
          <Plus className="h-7 w-7" />
        </Link>
      </div>
    </div>
  );
}