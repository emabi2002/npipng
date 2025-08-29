'use client';

import { useState } from "react";
import TopNav from "@/components/nav/TopNav";
import SideNav from "@/components/nav/SideNav";
import { Sheet, SheetContent } from "@/components/ui/sheet";

export default function ClientShell({
  children,
}: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Top bar */}
      <TopNav onOpenSide={() => setOpen(true)} />

      {/* Mobile drawer */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="p-0 w-64">
          <SideNav />
        </SheetContent>
      </Sheet>

      {/* Desktop layout */}
      <div className="flex min-h-screen">
        <aside className="hidden md:block">
          <SideNav />
        </aside>

        <main className="flex-1 bg-slate-100">
          {children}
        </main>
      </div>
    </>
  );
}
