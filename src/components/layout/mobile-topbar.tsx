"use client";

import { Bell, Menu } from "lucide-react";
import React from "react";

export function MobileTopbar() {
  return (
    <div className="md:hidden fixed top-0 left-0 right-0 z-40 p-4 pb-2">
      <div className="bg-background rounded-full shadow-sm border border-border px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-brand-foreground font-bold text-sm">V</div>
          <span className="font-semibold text-lg tracking-tight">VedaAI</span>
        </div>
        
        <div className="flex items-center gap-5">
          <button className="relative flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0.5 h-2 w-2 rounded-full bg-brand border-[1.5px] border-background" />
          </button>
          <div className="h-8 w-8 rounded-full bg-amber-300 border border-border flex items-center justify-center overflow-hidden">
            <span className="text-[10px] font-bold text-amber-800">JD</span>
          </div>
          <button className="flex items-center justify-center text-foreground hover:opacity-80 transition-opacity">
            <Menu className="h-6 w-6" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
