import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/")({ component: Empty });

function Empty() {
  return (
    <AppShell title="Assignment">
      <div className="p-8">
        <div className="rounded-2xl border-2 border-blue-300/60 bg-card min-h-[calc(100vh-160px)] flex flex-col items-center justify-center px-6 text-center">
          <div className="relative mb-8">
            <div className="h-44 w-44 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
              <div className="relative">
                <div className="h-24 w-20 rounded-md bg-white border border-slate-300 shadow-sm flex flex-col gap-2 p-3">
                  <div className="h-1.5 w-12 rounded bg-slate-700" />
                  <div className="h-1 w-full rounded bg-slate-200" />
                  <div className="h-1 w-3/4 rounded bg-slate-200" />
                  <div className="h-1 w-full rounded bg-slate-200" />
                </div>
                <div className="absolute -bottom-3 -right-5 h-12 w-12 rounded-full border-[3px] border-purple-400 bg-white/80 flex items-center justify-center">
                  <span className="text-red-500 text-xl font-bold">✕</span>
                </div>
              </div>
            </div>
            <span className="absolute -top-2 -left-4 text-blue-400 text-xl">✦</span>
            <span className="absolute bottom-4 -right-2 text-blue-400 text-lg">✦</span>
          </div>
          <h2 className="text-lg font-semibold">No assignments yet</h2>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Create your first assignment to start collecting and grading student submissions. You can set up rubrics, define marking criteria, and let AI assist with grading.
          </p>
          <Link
            to="/assignments/create"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            Create Your First Assignment
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
