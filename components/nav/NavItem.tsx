'use client';
import Link from 'next/link';
import { cn } from '@/lib/cn';
import { usePathname } from 'next/navigation';

export default function NavItem({ href, label }: { href: string; label: string }) {
  const path = usePathname();
  const active = path === href || (href !== '/' && path.startsWith(href));
  return (
    <Link
      href={href}
      className={cn('px-3 py-2 rounded-md text-sm hover:bg-muted transition-colors', active && 'bg-muted font-medium')}
    >
      {label}
    </Link>
  );
}
