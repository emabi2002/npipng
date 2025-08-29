"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export default function TopNav({ onOpenSide }: { onOpenSide: () => void }) {
  return (
    <header className="h-16 bg-slate-100 border-b border-slate-200">
      <div className="h-full px-6 flex items-center">
        {/* mobile drawer button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden mr-3"
          onClick={onOpenSide}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* brand */}
        <Link href="/dash" className="text-xl font-bold text-blue-600">
          NPIPNG ERP
        </Link>

        {/* spacer */}
        <div className="flex-1" />
      </div>
    </header>
  );
}
