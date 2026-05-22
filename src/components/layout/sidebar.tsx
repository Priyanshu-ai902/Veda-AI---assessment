"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Users,
  FileText,
  Sparkles,
  Clock,
  Settings,
  Plus,
} from "lucide-react";

const nav = [
  { href: "/", label: "Home", icon: LayoutGrid },
  { href: "/groups", label: "My Groups", icon: Users },
  { href: "/assignments", label: "Assignments", icon: FileText, badge: "10" },
  { href: "/toolkit", label: "AI Teacher's Toolkit", icon: Sparkles },
  { href: "/library", label: "My Library", icon: Clock },
];

export function Sidebar() {
  const pathname = usePathname();
  
  const active = (href: string) =>
    href === "/assignments"
      ? pathname.startsWith("/assignments") || pathname === "/"
      : pathname === href;

  return (
    <aside className="hidden md:flex h-screen w-[260px] flex-col bg-card border-r border-border px-5 py-8">
      <div className="flex items-center gap-2 px-2 mb-10">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-brand-foreground font-bold shadow-sm shadow-brand/20">V</div>
        <span className="font-bold text-xl tracking-tight">VedaAI</span>
      </div>

      <Link
        href="/assignments/create"
        className="flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground py-3 text-sm font-semibold hover:opacity-90 shadow-md shadow-primary/10 transition-all active:scale-[0.98] mb-10"
      >
        <Plus className="h-4 w-4" />
        Create Assignment
      </Link>

      <nav className="flex flex-col gap-1.5">
        {nav.map(({ href, label, icon: Icon, badge }) => {
          const isActive = active(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                isActive 
                  ? "bg-secondary text-foreground shadow-sm" 
                  : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
              }`}
            >
              <span className="flex items-center gap-3">
                <Icon className={`h-4 w-4 ${isActive ? "text-brand" : ""}`} />
                {label}
              </span>
              {badge && (
                <span className="rounded-full bg-brand px-2 py-0.5 text-[10px] font-bold text-brand-foreground shadow-sm shadow-brand/20">
                  {badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto flex flex-col gap-4">
        <Link href="/settings" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-all">
          <Settings className="h-4 w-4" />
          Settings
        </Link>
        <div className="flex items-center gap-3 rounded-2xl bg-secondary/40 p-4 border border-border/50">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm shadow-sm">🏫</div>
          <div className="leading-tight overflow-hidden">
            <div className="text-sm font-bold truncate">Delhi Public School</div>
            <div className="text-[10px] text-muted-foreground font-medium truncate uppercase tracking-wider">Bokaro Steel City</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
