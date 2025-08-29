// components/nav/SideNav.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MAJOR_MODULES } from "./menuConfig";

export default function SideNav() {
  const path = usePathname();

  // Extract the main module from the path (e.g., /dash/academic -> academic)
  const currentModule = path.split('/')[2];

  return (
    <nav className="w-48 bg-slate-50 border-r border-slate-200 min-h-screen">
      <div className="p-4">
        <div className="text-xs font-semibold text-slate-600 mb-3 uppercase tracking-wide">Menu</div>
        <ul className="space-y-1">
          {MAJOR_MODULES.map(m => {
            const active = currentModule === m.key;
            return (
              <li key={m.key}>
                <Link
                  href={m.href}
                  className={`block rounded-md px-3 py-2.5 text-sm transition-colors ${
                    active
                      ? "bg-blue-500 text-white font-medium shadow-sm"
                      : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  {m.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
