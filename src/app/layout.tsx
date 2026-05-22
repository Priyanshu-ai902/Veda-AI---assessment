import type { Metadata } from "next";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { MobileTopbar } from "@/components/layout/mobile-topbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "VedaAI",
  description: "AI Teacher's Toolkit and Assignment Generator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <div className="flex h-screen overflow-hidden bg-background">
          <Sidebar />
          <div className="flex-1 flex flex-col h-full relative">
            <Topbar title="Assignment" />
            <MobileTopbar />
            <main className="flex-1 overflow-y-auto min-h-0 bg-background pt-20 pb-28 md:pt-0 md:pb-0">
              {children}
            </main>
            <MobileNav />
          </div>
        </div>
      </body>
    </html>
  );
}
