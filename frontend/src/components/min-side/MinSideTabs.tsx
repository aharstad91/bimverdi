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
    <div className="border-b border-gray-200 bg-white rounded-t-lg">
      <nav className="-mb-px flex space-x-1 px-4 overflow-x-auto" aria-label="Tabs">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          const baseClasses = 'group inline-flex items-center gap-2 border-b-2 px-4 py-4 text-sm font-medium whitespace-nowrap transition-colors';
          const activeClasses = isActive
            ? 'border-blue-600 text-blue-600'
            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700';

          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={`${baseClasses} ${activeClasses}`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span>{tab.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
