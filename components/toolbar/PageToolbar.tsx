"use client";

import { Button } from "@/components/ui/button";

type Action = { label: string; onClick?: () => void; variant?: "default" | "secondary" | "outline" };

export default function PageToolbar({ actions = [] as Action[] }) {
  return (
    <div className="panel flex items-center justify-between p-3">
      <div className="text-sm font-medium">Actions</div>
      <div className="flex items-center gap-2">
        {actions.map((a) => (
          <Button key={a.label} variant={a.variant ?? "secondary"} onClick={a.onClick}>
            {a.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
