'use client';
import { ReactNode } from 'react';
import { useMyModules } from '@/lib/useMyModules';

export default function ModuleGuard({ need, children }: { need: string; children: ReactNode }) {
  const { can, loading } = useMyModules();
  if (loading) return <div className="p-6">Loading…</div>;
  if (!can(need)) return <div className="p-6 text-red-600">Access denied (module: {need}).</div>;
  return <>{children}</>;
}
