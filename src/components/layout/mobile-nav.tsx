"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Users,
  FileText,
  Sparkles,
  Clock,
} from "lucide-react";

const nav = [
  { href: "/", label: "Home", icon: LayoutGrid },
  { href: "/groups", label: "Groups", icon: Users },
  { href: "/assignments", label: "Work", icon: FileText },
  { href: "/toolkit", label: "Toolkit", icon: Sparkles },
  { href: "/library", label: "Library", icon: Clock },
];

export function MobileNav() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/assignments"
      ? pathname.startsWith("/assignments") || pathname === "/"
      : pathname === href;

  return (
    <div className="md:hidden fixed bottom-4 left-4 right-4 z-50">
      <nav className="bg-zinc-950 rounded-[2rem] shadow-2xl flex items-center justify-between px-2 py-3">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-1.5 flex-1 transition-colors ${
                active ? "text-white" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <div className="relative">
                <Icon className={`h-[22px] w-[22px] ${active ? "text-brand" : ""}`} strokeWidth={active ? 2.5 : 2} />
              </div>
              <span className={`text-[10px] tracking-wide ${active ? "font-semibold" : "font-medium"}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
