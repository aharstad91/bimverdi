# GitHub Copilot Instructions - BimVerdi Project

> **Purpose**: This file provides essential context for GitHub Copilot and other AI assistants working on the BimVerdi project.

---

## 🎯 Project Overview

**BimVerdi** is a headless WordPress CMS with Next.js frontend for Norwegian BIM (Building Information Modeling) value creation platform.

### Tech Stack
- **Backend**: WordPress 6.x (Headless) on MAMP (local) / Servebolt (production)
- **Frontend**: Next.js 16.0.0 + React 19.2.0 + TypeScript 5.x
- **Styling**: Tailwind CSS 4.x
- **Database**: MySQL 8.0
- **APIs**: WordPress REST API + WPGraphQL

### Architecture Pattern
```
┌─────────────┐         ┌──────────────┐         ┌──────────┐
│  Next.js    │ ◄─API─► │  WordPress   │ ◄────► │  MySQL   │
│  Frontend   │         │  (Headless)  │         │ Database │
│  :3000      │         │  :8888       │         │          │
└─────────────┘         └──────────────┘         └──────────┘
```

---

## 🚨 Critical Project Rules

### File Modifications
1. **NEVER edit WordPress core files** (`wordpress/wp-admin/`, `wordpress/wp-includes/`)
2. **DO NOT commit** `wp-config.php` or `.env` files (already in `.gitignore`)
3. **ALWAYS use TypeScript** for new frontend code
4. **Follow existing patterns** - check similar components before creating new ones

### WordPress Specifics
- Custom functionality goes in **plugins** (`wordpress/wp-content/plugins/`)
- Use **ACF (Advanced Custom Fields)** for custom data structures
- Leverage **WPGraphQL** for complex queries
- Use **JWT authentication** for API requests

### Next.js Specifics
- Use **App Router** (`src/app/`) - NOT Pages Router
- Implement **Server Components** by default, Client Components only when needed
- Use **TypeScript strict mode** - fix type errors before committing
- Follow **path aliases**: `@/components`, `@/lib`, `@/types`

---

## 🎨 Coding Standards

### TypeScript
```typescript
// ✅ GOOD - Explicit types, named exports
export interface Member {
  id: number;
  name: string;
  logo?: string;
}

export function formatMemberName(member: Member): string {
  return member.name.trim();
}

// ❌ BAD - Any types, default exports
export default function(data: any) {
  return data.name;
}
```

### React Components
```tsx
// ✅ GOOD - Server Component with proper typing
interface MemberCardProps {
  member: Member;
  showLogo?: boolean;
}

export function MemberCard({ member, showLogo = true }: MemberCardProps) {
  return (
    <div className="rounded-lg border p-4">
      {showLogo && member.logo && (
        <img src={member.logo} alt={member.name} />
      )}
      <h3>{member.name}</h3>
    </div>
  );
}

// ❌ BAD - Unclear props, inline styles
export default function Card({ data }) {
  return <div style={{padding: '10px'}}>{data}</div>;
}
```

### WordPress PHP
```php
// ✅ GOOD - Namespaced, documented
namespace BimVerdi\Members;

/**
 * Register custom post type for members
 */
function register_member_post_type(): void {
    register_post_type('member', [
        'labels' => [
            'name' => __('Members', 'bimverdi'),
            'singular_name' => __('Member', 'bimverdi'),
        ],
        'public' => true,
        'show_in_rest' => true, // Enable REST API
        'supports' => ['title', 'editor', 'thumbnail'],
    ]);
}
add_action('init', __NAMESPACE__ . '\\register_member_post_type');

// ❌ BAD - Global namespace, no documentation
function register_cpt() {
    register_post_type('member', [
        'public' => true,
    ]);
}
add_action('init', 'register_cpt');
```

### CSS/Tailwind
```tsx
// ✅ GOOD - Tailwind utilities, responsive
<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
  <Card className="rounded-lg border bg-white p-6 shadow-sm hover:shadow-md transition-shadow" />
</div>

// ❌ BAD - Custom CSS, arbitrary values
<div className="my-custom-grid" style={{display: 'grid'}}>
  <Card style={{padding: '23px'}} />
</div>
```

---

## 🏗️ Project Structure

### WordPress Backend (`wordpress/`)
```
wordpress/
├── wp-content/
│   ├── plugins/
│   │   ├── advanced-custom-fields/    # ACF for custom fields
│   │   ├── wp-graphql/                # GraphQL API
│   │   └── jwt-authentication-for-wp-rest-api/
│   ├── themes/                        # Custom theme (if needed)
│   └── uploads/                       # User uploads (not in git)
└── wp-config.php                      # Config (not in git)
```

### Next.js Frontend (`frontend/`)
```
frontend/
├── src/
│   ├── app/                           # App Router pages
│   │   ├── medlemmer/                 # Members listing
│   │   ├── verktoy/                   # Tools catalog
│   │   └── layout.tsx                 # Root layout
│   ├── components/                    # Reusable components
│   │   ├── ui/                        # Generic UI components
│   │   └── members/                   # Domain-specific components
│   ├── lib/                           # Utilities, API clients
│   │   ├── wordpress.ts               # WordPress API functions
│   │   └── utils.ts                   # Helper functions
│   └── types/                         # TypeScript type definitions
│       └── wordpress.ts               # WP data types
├── public/                            # Static assets
├── .env.local                         # Environment variables (not in git)
└── next.config.ts                     # Next.js config
```

---

## 🔧 Common Tasks & Commands

### Starting Development
```bash
# 1. Start MAMP servers (Apache + MySQL)
# Open MAMP app → Start Servers

# 2. Start Next.js dev server
cd frontend
npm run dev

# Development URLs:
# Frontend: http://localhost:3000
# WordPress: http://localhost:8888/bimverdi/wordpress
# WP Admin: http://localhost:8888/bimverdi/wordpress/wp-admin
```

### WordPress Development
```bash
# Navigate to WordPress directory
cd wordpress

# WP-CLI commands (if installed)
wp plugin list
wp post list --post_type=member
wp user list

# Check ACF field groups programmatically
wp eval "var_dump(acf_get_field_groups());"

# Access MySQL
/Applications/MAMP/Library/bin/mysql80/bin/mysql -u root -proot bimverdi
```

### Frontend Development
```bash
cd frontend

# Install dependencies
npm install

# Development
npm run dev

# Type checking
npx tsc --noEmit

# Linting
npm run lint

# Build for production
npm run build

# Start production server
npm run start
```

### Database Operations
```bash
# Backup database
/Applications/MAMP/Library/bin/mysql80/bin/mysqldump -u root -proot bimverdi > backup.sql

# Restore database
/Applications/MAMP/Library/bin/mysql80/bin/mysql -u root -proot bimverdi < backup.sql

# Access MySQL CLI
/Applications/MAMP/Library/bin/mysql80/bin/mysql -u root -proot

# Quick queries
mysql -u root -proot bimverdi -e "SELECT * FROM wp_posts WHERE post_type='member' LIMIT 5;"
```

---

## 🤖 AI Assistant Guidelines

### When Adding Features
1. **Check existing code** first - look for similar implementations
2. **Ask before major changes** - propose architecture before implementing
3. **Use existing patterns** - follow component structure, naming conventions
4. **Update types** - add TypeScript interfaces when creating new data structures
5. **Test locally** - verify code works in both dev and build mode

### Code Generation Preferences
- **Prefer functional components** over class components
- **Use Server Components** by default in Next.js App Router
- **Explicit typing** - avoid `any` type
- **Named exports** over default exports
- **Descriptive names** - `getMemberById` not `getData`
- **Error handling** - always handle API failures gracefully

### Common Patterns to Follow

#### Fetching WordPress Data
```typescript
// lib/wordpress.ts
export async function getMembers(): Promise<Member[]> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/wp/v2/member`,
      { next: { revalidate: 3600 } } // ISR with 1 hour cache
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch members: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching members:', error);
    return [];
  }
}
```

#### Creating Pages
```typescript
// app/medlemmer/page.tsx
import { getMembers } from '@/lib/wordpress';
import { MemberCard } from '@/components/members/MemberCard';

export default async function MembersPage() {
  const members = await getMembers();

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Medlemsbedrifter</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((member) => (
          <MemberCard key={member.id} member={member} />
        ))}
      </div>
    </main>
  );
}
```

#### Client Components (only when needed)
```typescript
// components/SearchBar.tsx
'use client';

import { useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('');

  return (
    <input
      type="search"
      value={query}
      onChange={(e) => {
        setQuery(e.target.value);
        onSearch(e.target.value);
      }}
      className="w-full rounded-lg border px-4 py-2"
      placeholder="Søk..."
    />
  );
}
```

---

## 🔒 Security Considerations

### Environment Variables
```bash
# frontend/.env.local (NEVER commit this file)
NEXT_PUBLIC_WORDPRESS_API_URL=http://localhost:8888/bimverdi/wordpress/index.php?rest_route=
NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://localhost:8888/bimverdi/wordpress/graphql
NEXTAUTH_SECRET=change-in-production
```

### WordPress Config
```php
// wordpress/wp-config.php (NEVER commit this file)

// Development
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
define('WP_DEBUG_DISPLAY', false);

// Production (change these!)
define('JWT_AUTH_SECRET_KEY', 'generate-secure-key-for-production');
define('NEXTAUTH_SECRET', 'generate-secure-key-for-production');
```

### API Security
- **Always validate** input data
- **Use JWT tokens** for authenticated requests
- **Rate limit** API calls in production
- **Sanitize** user-generated content
- **Implement CORS** properly for production domains

---

## 🧪 Testing

### Frontend Testing
```bash
# Type checking
npx tsc --noEmit

# Build test (catches many issues)
npm run build

# Lint
npm run lint
```

### WordPress Testing
```bash
# Check for PHP errors
tail -f /Applications/MAMP/logs/php_error.log

# Test REST API endpoints
curl http://localhost:8888/bimverdi/wordpress/index.php?rest_route=/wp/v2/posts

# Test GraphQL
curl -X POST http://localhost:8888/bimverdi/wordpress/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ posts { nodes { id title } } }"}'
```

---

## 📝 Custom Post Types

Current CPTs in the project:

### Members (`member`)
```typescript
interface Member {
  id: number;
  title: { rendered: string };
  acf: {
    company_logo?: string;
    website?: string;
    contact_email?: string;
    description?: string;
  };
}
```

### Tools (`tool`)
```typescript
interface Tool {
  id: number;
  title: { rendered: string };
  acf: {
    tool_category?: string;
    vendor?: string;
    website?: string;
  };
}
```

### Cases (`case`)
```typescript
interface Case {
  id: number;
  title: { rendered: string };
  content: { rendered: string };
  acf: {
    project_year?: number;
    client?: string;
    images?: Array<{
      url: string;
      alt: string;
    }>;
  };
}
```

---

## 🚫 Common Pitfalls to Avoid

### Don't Do This:
```typescript
// ❌ Using 'any' type
function processData(data: any) { }

// ❌ Mixing Server and Client Component features
'use client'
export default async function Page() { } // async not allowed in client components

// ❌ Not handling loading/error states
const data = await fetchData(); // What if this fails?

// ❌ Hardcoding URLs
const api = 'http://localhost:8888/...'; // Use environment variables

// ❌ Ignoring TypeScript errors
// @ts-ignore
const value = data.something;
```

### Do This Instead:
```typescript
// ✅ Proper typing
function processData(data: Member[]): ProcessedData { }

// ✅ Separate Server and Client Components
// ServerComponent.tsx (default)
export default async function Page() { }
// ClientComponent.tsx
'use client'
export default function InteractiveWidget() { }

// ✅ Error handling
try {
  const data = await fetchData();
  if (!data) throw new Error('No data');
} catch (error) {
  console.error('Failed to fetch:', error);
  return <ErrorMessage />;
}

// ✅ Environment variables
const api = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;

// ✅ Fix the type issue
const value = data?.something as ExpectedType;
```

---

## 📚 Reference Documentation

### Official Docs
- [Next.js 16 Documentation](https://nextjs.org/docs)
- [React 19 Documentation](https://react.dev)
- [WordPress REST API](https://developer.wordpress.org/rest-api/)
- [WPGraphQL](https://www.wpgraphql.com/docs/introduction)
- [Tailwind CSS](https://tailwindcss.com/docs)

### Project-Specific Docs
- `DEVELOPER_GUIDE.md` - Complete development guide
- `SETUP.md` - Initial setup instructions
- `README.md` - Project overview
- `DEPLOYMENT.md` - Deployment procedures

---

## 🎯 When in Doubt

1. **Check existing code** for similar implementations
2. **Follow TypeScript** - if it complains, there's probably a reason
3. **Test locally** before committing
4. **Ask the user** for clarification on business logic
5. **Prefer simple** over clever

---

**Remember**: This is a production application serving real users. Prioritize:
- ✅ Type safety
- ✅ Performance
- ✅ Accessibility
- ✅ SEO
- ✅ Security
- ✅ User experience

**Last Updated**: October 22, 2025
