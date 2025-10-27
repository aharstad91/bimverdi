'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
    <Card className="shadow-md">
      <nav className="flex space-x-1 px-2 py-2 overflow-x-auto" aria-label="Tabs">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;

          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={`
                group inline-flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap rounded-lg transition-all
                ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                }
              `}
            >
              <span className="text-lg">{tab.icon}</span>
              <span>{tab.name}</span>
              {isActive && (
                <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-primary-foreground/20 text-primary-foreground">
                  ✓
                </Badge>
              )}
            </Link>
          );
        })}
      </nav>
    </Card>
  );
}
