import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutGrid,
  Users,
  FileText,
  Sparkles,
  Clock,
  Settings,
  Plus,
  Bell,
  ChevronDown,
} from "lucide-react";

const nav = [
  { to: "/", label: "Home", icon: LayoutGrid },
  { to: "/groups", label: "My Groups", icon: Users },
  { to: "/assignments", label: "Assignments", icon: FileText, badge: "10" },
  { to: "/toolkit", label: "AI Teacher's Toolkit", icon: Sparkles },
  { to: "/library", label: "My Library", icon: Clock },
];

export function Sidebar() {
  const { location } = useRouterState();
  const active = (to: string) =>
    to === "/assignments"
      ? location.pathname.startsWith("/assignments") || location.pathname === "/"
      : location.pathname === to;

  return (
    <aside className="flex h-screen w-[260px] flex-col bg-card border-r border-border px-5 py-6">
      <div className="flex items-center gap-2 px-2 mb-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-brand text-brand-foreground font-bold">V</div>
        <span className="font-semibold text-lg">VedaAI</span>
      </div>

      <Link
        to="/assignments/create"
        className="flex items-center justify-center gap-2 rounded-full border-2 border-brand bg-primary text-primary-foreground py-2.5 text-sm font-medium hover:opacity-95"
      >
        <Plus className="h-4 w-4 text-brand" />
        Create Assignment
      </Link>

      <nav className="mt-8 flex flex-col gap-1">
        {nav.map(({ to, label, icon: Icon, badge }) => {
          const isActive = active(to);
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm transition ${
                isActive ? "bg-secondary font-semibold text-foreground" : "text-muted-foreground hover:bg-secondary/60"
              }`}
            >
              <span className="flex items-center gap-3">
                <Icon className="h-4 w-4" />
                {label}
              </span>
              {badge && (
                <span className="rounded-full bg-brand px-2 py-0.5 text-[10px] font-semibold text-brand-foreground">
                  {badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto flex flex-col gap-3">
        <Link to="/settings" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-secondary/60">
          <Settings className="h-4 w-4" />
          Settings
        </Link>
        <div className="flex items-center gap-3 rounded-xl bg-secondary p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-200 text-sm">🏫</div>
          <div className="leading-tight">
            <div className="text-sm font-semibold">Delhi Public School</div>
            <div className="text-xs text-muted-foreground">Bokaro Steel City</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

export function Topbar({ title, breadcrumbIcon: Icon = FileText }: { title: string; breadcrumbIcon?: any }) {
  return (
    <div className="flex items-center justify-between border-b border-border bg-background px-8 py-4">
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <button className="hover:text-foreground">←</button>
        <Icon className="h-4 w-4" />
        <span>{title}</span>
      </div>
      <div className="flex items-center gap-4">
        <button className="relative rounded-full p-2 hover:bg-secondary">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-brand" />
        </button>
        <button className="flex items-center gap-2 rounded-full bg-secondary px-2 py-1 pr-3">
          <div className="h-7 w-7 rounded-full bg-amber-300" />
          <span className="text-sm font-medium">John Doe</span>
          <ChevronDown className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export function AppShell({ children, title, icon }: { children: React.ReactNode; title: string; icon?: any }) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar title={title} breadcrumbIcon={icon} />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
