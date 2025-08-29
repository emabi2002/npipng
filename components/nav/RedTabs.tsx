"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { TABS } from "@/components/nav/menuConfig";

/** Renders sub-menu tabs for the current module + sub path */
export default function RedTabs({ module }: { module: string }) {
  const pathname = usePathname();

  // path parts: /dash/<module>/<sub>/...
  const parts = pathname.split("/").filter(Boolean);
  const dashIdx = parts.indexOf("dash");
  const sub = parts[dashIdx + 2]; // may be undefined (e.g., /dash/finance)

  const items = TABS[module]?.[sub ?? ""] ?? [];
  if (!items.length) return null;

  return (
    <div className="bg-slate-50 border-b border-slate-200">
      <div className="px-6">
        <div className="flex gap-1 py-2">
          {items.map((t) => {
            const active = pathname.startsWith(t.href);
            return (
              <Link
                key={t.href}
                href={t.href}
                className={`px-4 py-2 text-sm font-medium rounded-t-md border-b-2 transition-colors ${
                  active
                    ? "bg-orange-500 text-white border-orange-500"
                    : "bg-white text-slate-700 border-transparent hover:bg-slate-100 hover:border-slate-300"
                }`}
              >
                {t.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
