'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

export default function NavLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link
      href={href}
      className={clsx(
        'block px-3 py-2 rounded hover:bg-gray-100',
        active && 'bg-gray-100 font-semibold text-blue-600',
        className
      )}
    >
      {children}
    </Link>
  );
}
