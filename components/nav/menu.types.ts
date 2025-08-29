import type { LucideIcon } from "lucide-react";

export type NavItem = { label: string; href: string };

export type NavModule = {
  key: string;
  label: string;
  icon?: LucideIcon;
  items?: NavItem[];   // <-- optional
};
