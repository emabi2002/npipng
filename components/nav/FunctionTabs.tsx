// components/nav/FunctionTabs.tsx
"use client";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import clsx from "clsx";

export type TabItem = { key: string; label: string };

export default function FunctionTabs({
  items, defaultKey,
}:{ items: TabItem[]; defaultKey: string }) {
  const path = usePathname();
  const sp = useSearchParams();
  const current = sp.get("tab") ?? defaultKey;

  return (
    <div className="flex gap-2">
      {items.map((t) => {
        const href = `${path}?tab=${t.key}`;
        const active = current === t.key;
        return (
          <Link
            key={t.key}
            href={href}
            className={clsx(
              "rounded px-3 py-1.5 text-sm border",
              active
                ? "bg-white border-red-500 text-red-600"
                : "bg-white hover:bg-red-50 border-red-200 text-red-500"
            )}
          >
            {t.label}
          </Link>
        );
      })}
    </div>
  );
}
