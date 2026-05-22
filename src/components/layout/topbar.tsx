"use client";

import { Bell, ChevronDown, FileText } from "lucide-react";
import React from "react";

export function Topbar({ title, breadcrumbIcon: Icon = FileText }: { title: string; breadcrumbIcon?: React.ElementType }) {
  return (
    <div className="hidden md:flex items-center justify-between border-b border-border bg-card px-10 py-5 sticky top-0 z-40 shadow-sm shadow-black/[0.01]">
      <div className="flex items-center gap-4 text-sm text-muted-foreground font-medium">
        <button className="hover:text-foreground transition-colors p-1 rounded-md hover:bg-secondary/80">
          <Icon className="h-[18px] w-[18px]" />
        </button>
        <span className="text-border">/</span>
        <span className="text-foreground font-bold tracking-tight text-base">{title}</span>
      </div>
      
      <div className="flex items-center gap-6">
        <button className="relative p-2.5 rounded-xl hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-all">
          <Bell className="h-[22px] w-[22px]" />
          <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-brand border-2 border-card" />
        </button>
        
        <div className="h-10 w-px bg-border/60 mx-1" />
        
        <button className="flex items-center gap-3 rounded-2xl bg-secondary/50 pl-2 pr-4 py-1.5 border border-border/40 hover:border-border transition-all active:scale-[0.98]">
          <div className="h-8 w-8 rounded-xl bg-amber-400 flex items-center justify-center font-bold text-amber-900 text-xs shadow-sm">JD</div>
          <div className="flex flex-col items-start leading-none gap-1">
            <span className="text-sm font-bold text-foreground">John Doe</span>
            <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Teacher</span>
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground ml-1" />
        </button>
      </div>
    </div>
  );
}
