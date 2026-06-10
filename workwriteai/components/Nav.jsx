'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LINKS = [
  ['/', 'Write'],
  ['/history', 'History'],
  ['/progress', 'My Progress'],
  ['/settings', 'Settings'],
];

export default function Nav() {
  const path = usePathname();
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-bold text-slate-900">
          WorkWrite <span className="text-brand">AI</span>
        </Link>
        <nav className="flex gap-1 text-sm">
          {LINKS.map(([href, label]) => {
            const active = path === href;
            return (
              <Link
                key={href}
                href={href}
                className={`rounded-md px-3 py-1.5 transition-colors ${
                  active
                    ? 'bg-brand text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
