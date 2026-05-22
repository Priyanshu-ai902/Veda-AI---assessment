import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Search, SlidersHorizontal, MoreVertical, Plus } from "lucide-react";

export const Route = createFileRoute("/assignments")({ component: List });

const items = Array.from({ length: 8 });

function List() {
  return (
    <AppShell title="Assignment">
      <div className="p-8">
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <h1 className="text-xl font-semibold">Assignments</h1>
          </div>
          <p className="mt-1 ml-5 text-sm text-muted-foreground">Manage and create assignments for your classes.</p>
        </div>

        <div className="mb-5 flex items-center justify-between">
          <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <SlidersHorizontal className="h-4 w-4" />
            Filter By
          </button>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Search Assignment"
              className="h-10 w-80 rounded-full border border-border bg-card pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {items.map((_, i) => (
            <div key={i} className="group rounded-2xl border border-border bg-card p-5 hover:shadow-sm">
              <div className="flex items-start justify-between">
                <h3 className="font-semibold underline-offset-4 group-hover:underline">Quiz on Electricity</h3>
                <button className="rounded p-1 hover:bg-secondary"><MoreVertical className="h-4 w-4 text-muted-foreground" /></button>
              </div>
              <div className="mt-8 flex items-center justify-between text-xs text-muted-foreground">
                <span>Assigned on : <span className="text-foreground">20-06-2025</span></span>
                <span>Due : <span className="text-foreground">21-06-2025</span></span>
              </div>
            </div>
          ))}
        </div>

        <div className="sticky bottom-6 mt-8 flex justify-center">
          <Link to="/assignments/create" className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-lg hover:opacity-90">
            <Plus className="h-4 w-4" />
            Create Assignment
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
