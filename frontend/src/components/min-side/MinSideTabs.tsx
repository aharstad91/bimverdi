'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface Tab {
  name: string;
  href: string;
  icon: string;
}

const tabs: Tab[] = [
  {
    name: 'Oversikt',
    href: '/min-side',
    icon: '🏠',
  },
  {
    name: 'Rediger profil',
    href: '/min-side/profil',
    icon: '👤',
  },
  {
    name: 'Passord',
    href: '/min-side/passord',
    icon: '🔐',
  },
  {
    name: 'Mitt innhold',
    href: '/min-side/innhold',
    icon: '📄',
  },
  {
    name: 'Arrangementer',
    href: '/min-side/arrangementer',
    icon: '📅',
  },
  {
    name: 'Samtykker',
    href: '/min-side/samtykker',
    icon: '⚙️',
  },
  {
    name: 'Medlemskap',
    href: '/min-side/medlemskap',
    icon: '⭐',
  },
];

export function MinSideTabs() {
  const pathname = usePathname();

  return (
    <div className="border-t">
      <nav className="flex space-x-8 px-6 overflow-x-auto" aria-label="Tabs">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;

          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={`
                group inline-flex items-center gap-2 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors
                ${
                  isActive
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
                }
              `}
            >
              <span className="text-base">{tab.icon}</span>
              <span>{tab.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
