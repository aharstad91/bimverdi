# BimVerdi - Developer Guide

> **Complete reference** for daily development with BimVerdi. This guide consolidates technical details, workflows, and best practices.

---

## 📋 Table of Contents

- [Quick Start](#-quick-start)
- [System Architecture](#-system-architecture)
- [Tech Stack Details](#-tech-stack-details)
- [Daily Development Workflow](#-daily-development-workflow)
- [File Structure](#-file-structure)
- [Common Development Tasks](#-common-development-tasks)
- [API Integration](#-api-integration)
- [Database Operations](#-database-operations)
- [Testing & Debugging](#-testing--debugging)
- [Performance & Optimization](#-performance--optimization)
- [Security Best Practices](#-security-best-practices)
- [Troubleshooting](#-troubleshooting)
- [Deployment](#-deployment)

---

## 🚀 Quick Start

### Starting Development (Every Day)

```bash
# Terminal 1: MAMP
# Open MAMP app → Click "Start Servers"

# Terminal 2: Frontend
cd /Applications/MAMP/htdocs/bimverdi/frontend
npm run dev

# Access:
# Frontend: http://localhost:3000
# WordPress: http://localhost:8888/bimverdi/wordpress
# WP Admin: http://localhost:8888/bimverdi/wordpress/wp-admin
```

### Stopping Development

```bash
# Frontend: Ctrl+C in terminal
# MAMP: Open MAMP app → Click "Stop Servers"
```

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    BimVerdi Architecture                 │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────┐         ┌──────────────────────────┐ │
│  │   Frontend   │◄────────┤   WordPress Backend      │ │
│  │   Next.js    │  API    │   REST API / GraphQL     │ │
│  │   :3000      │         │   :8888/bimverdi         │ │
│  └──────────────┘         └───────────┬──────────────┘ │
│       │                               │                 │
│       │                    ┌──────────▼──────────┐     │
│       │                    │   MySQL Database    │     │
│       │                    │   (bimverdi)        │     │
│       │                    └─────────────────────┘     │
│       │                                                 │
│       └─────────► Static Assets (images, CSS, JS)      │
└─────────────────────────────────────────────────────────┘
```

### Request Flow

1. **User visits** → http://localhost:3000
2. **Next.js** fetches data from WordPress REST API/GraphQL
3. **WordPress** queries MySQL database
4. **Data returned** as JSON
5. **Next.js** renders React components with data
6. **HTML sent** to user's browser

---

## 🛠️ Tech Stack Details

### Backend: WordPress (Headless CMS)

**Version**: Latest WordPress 6.x  
**Location**: `/Applications/MAMP/htdocs/bimverdi/wordpress/`  
**URL**: `http://localhost:8888/bimverdi/wordpress`

**PHP Configuration:**
- **Version**: 8.3.10
- **Path**: `/Applications/MAMP/bin/php/php8.3.10/`
- **Modules**: mysqli, pdo_mysql, curl, gd, mbstring, json, openssl

**Installed Plugins:**
- **Advanced Custom Fields (ACF)** - Custom content fields
- **WPGraphQL** - GraphQL API
- **JWT Authentication** - Token-based auth
- **Akismet** - Spam protection

**WordPress Configuration:**
```php
// wp-config.php essentials
DB_NAME: bimverdi
DB_USER: root
DB_PASSWORD: root
DB_HOST: localhost:/Applications/MAMP/tmp/mysql/mysql.sock
DB_CHARSET: utf8mb4

// Headless settings
JWT_AUTH_SECRET_KEY: bimverdi-jwt-secret-key-change-in-production
JWT_AUTH_CORS_ENABLE: true
WP_DEBUG: false
```

### Frontend: Next.js + React

**Versions:**
- Next.js: 16.0.0
- React: 19.2.0
- TypeScript: 5.x
- Tailwind CSS: 4.x

**Location**: `/Applications/MAMP/htdocs/bimverdi/frontend/`  
**URL**: `http://localhost:3000`

**Key Features:**
- ✅ App Router (not Pages Router)
- ✅ Server Components by default
- ✅ TypeScript strict mode
- ✅ React Compiler enabled
- ✅ Path aliases (`@/components`, `@/lib`, `@/types`)

**Environment Variables:**
```bash
# frontend/.env.local
NEXT_PUBLIC_WORDPRESS_API_URL=http://localhost:8888/bimverdi/wordpress/index.php?rest_route=
NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://localhost:8888/bimverdi/wordpress/graphql
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=change-in-production
```

### Database: MySQL 8.0

**Location**: `/Applications/MAMP/Library/bin/mysql80/`  
**Database**: `bimverdi`  
**Charset**: `utf8mb4_unicode_ci`

**Standard WordPress Tables:**
```
wp_commentmeta, wp_comments, wp_links, wp_options,
wp_postmeta, wp_posts, wp_term_relationships, 
wp_term_taxonomy, wp_termmeta, wp_terms, 
wp_usermeta, wp_users
```

---

## 💼 Daily Development Workflow

### Morning Routine

```bash
# 1. Pull latest changes
cd /Applications/MAMP/htdocs/bimverdi
git pull origin main

# 2. Start MAMP (if not running)
# Open MAMP app → Start Servers

# 3. Start frontend
cd frontend
npm run dev

# 4. Open in browser
open http://localhost:3000
```

### Making Changes

#### Backend (WordPress) Changes

```bash
# 1. Make changes in WordPress admin
open http://localhost:8888/bimverdi/wordpress/wp-admin

# 2. Test API immediately
curl http://localhost:8888/bimverdi/wordpress/index.php?rest_route=/wp/v2/posts | jq

# 3. Check PHP errors
tail -f /Applications/MAMP/logs/php_error.log
```

#### Frontend (Next.js) Changes

```bash
# 1. Edit files in src/
# Changes auto-reload with Fast Refresh

# 2. Type check
npx tsc --noEmit

# 3. Lint
npm run lint

# 4. Test build
npm run build
```

### Evening Routine

```bash
# 1. Commit changes
git add .
git commit -m "Descriptive message"
git push origin main

# 2. Stop servers
# Ctrl+C in frontend terminal
# MAMP app → Stop Servers

# Optional: Backup database
/Applications/MAMP/Library/bin/mysql80/bin/mysqldump -u root -proot bimverdi > backup-$(date +%Y%m%d).sql
```

---

## 📁 File Structure

### Complete Project Structure

```
/Applications/MAMP/htdocs/bimverdi/
│
├── .git/                       # Git repository
├── .github/
│   └── copilot-instructions.md # AI assistant context
├── .gitignore                  # Git ignore rules
│
├── wordpress/                  # WordPress backend
│   ├── wp-admin/              # Admin interface (DO NOT EDIT)
│   ├── wp-includes/           # Core files (DO NOT EDIT)
│   ├── wp-content/
│   │   ├── plugins/
│   │   │   ├── advanced-custom-fields/
│   │   │   ├── wp-graphql/
│   │   │   └── jwt-authentication-for-wp-rest-api/
│   │   ├── themes/
│   │   │   └── bimverdi/     # Custom theme (edit here)
│   │   └── uploads/          # User uploads (not in git)
│   ├── wp-config.php          # Config (NOT in git)
│   └── .htaccess             # Apache config
│
├── frontend/                   # Next.js frontend
│   ├── src/
│   │   ├── app/               # Pages (App Router)
│   │   │   ├── page.tsx      # Homepage
│   │   │   ├── layout.tsx    # Root layout
│   │   │   ├── medlemmer/    # Members page
│   │   │   ├── verktoy/      # Tools page
│   │   │   └── caser/        # Cases page
│   │   ├── components/        # React components
│   │   │   ├── ui/           # Generic UI (buttons, cards)
│   │   │   ├── members/      # Member-specific
│   │   │   ├── tools/        # Tool-specific
│   │   │   └── layout/       # Layout components
│   │   ├── lib/               # Utilities
│   │   │   ├── wordpress.ts  # WP API functions
│   │   │   └── utils.ts      # Helper functions
│   │   └── types/             # TypeScript types
│   │       └── wordpress.ts  # WP data types
│   ├── public/                # Static files
│   │   ├── images/
│   │   └── fonts/
│   ├── .env.local             # Env vars (NOT in git)
│   ├── .env.local.example     # Env template
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.ts
│   ├── tailwind.config.js
│   └── eslint.config.mjs
│
└── Documentation/
    ├── README.md
    ├── SETUP.md
    ├── DEVELOPER_GUIDE.md (this file)
    ├── DEPLOYMENT_QUICKREF.md
    └── SERVEBOLT_DEPLOYMENT.md
```

### Where to Find Things

| What you need | Location |
|--------------|----------|
| **WordPress plugins** | `wordpress/wp-content/plugins/` |
| **WordPress theme** | `wordpress/wp-content/themes/bimverdi/` |
| **Uploaded images** | `wordpress/wp-content/uploads/` |
| **WordPress config** | `wordpress/wp-config.php` |
| **Next.js pages** | `frontend/src/app/` |
| **React components** | `frontend/src/components/` |
| **API functions** | `frontend/src/lib/wordpress.ts` |
| **TypeScript types** | `frontend/src/types/` |
| **Environment variables** | `frontend/.env.local` |
| **PHP error log** | `/Applications/MAMP/logs/php_error.log` |
| **Apache error log** | `/Applications/MAMP/logs/apache_error.log` |
| **MySQL log** | `/Applications/MAMP/logs/mysql_error.log` |

---

## 🔨 Common Development Tasks

### Creating a New Page

```typescript
// frontend/src/app/my-page/page.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Page | BimVerdi',
  description: 'Description for SEO',
};

export default function MyPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">My Page</h1>
      <p>Content here</p>
    </main>
  );
}
```

### Fetching WordPress Data

```typescript
// frontend/src/lib/wordpress.ts
export async function getMembers(): Promise<Member[]> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/wp/v2/member`,
      {
        next: { revalidate: 3600 }, // ISR: Revalidate every hour
      }
    );
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching members:', error);
    return []; // Return empty array on error
  }
}
```

### Using Data in a Page

```typescript
// frontend/src/app/medlemmer/page.tsx
import { getMembers } from '@/lib/wordpress';
import { MemberCard } from '@/components/members/MemberCard';

export default async function MembersPage() {
  const members = await getMembers();
  
  if (members.length === 0) {
    return <p>No members found</p>;
  }
  
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Medlemsbedrifter</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {members.map((member) => (
          <MemberCard key={member.id} member={member} />
        ))}
      </div>
    </main>
  );
}
```

### Creating a Component

```typescript
// frontend/src/components/members/MemberCard.tsx
import { Member } from '@/types/wordpress';
import Image from 'next/image';

interface MemberCardProps {
  member: Member;
}

export function MemberCard({ member }: MemberCardProps) {
  return (
    <article className="rounded-lg border bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      {member.acf?.company_logo && (
        <Image
          src={member.acf.company_logo}
          alt={member.title.rendered}
          width={200}
          height={100}
          className="mb-4 h-20 w-auto object-contain"
        />
      )}
      <h3 className="mb-2 text-xl font-semibold">
        {member.title.rendered}
      </h3>
      {member.acf?.description && (
        <p className="text-gray-600">{member.acf.description}</p>
      )}
    </article>
  );
}
```

### Adding a WordPress Custom Post Type

```php
// wordpress/wp-content/themes/bimverdi/functions.php
namespace BimVerdi\CPT;

/**
 * Register custom post type for projects
 */
function register_projects_cpt(): void {
    register_post_type('project', [
        'labels' => [
            'name' => __('Projects', 'bimverdi'),
            'singular_name' => __('Project', 'bimverdi'),
        ],
        'public' => true,
        'show_in_rest' => true, // Enable REST API
        'supports' => ['title', 'editor', 'thumbnail', 'custom-fields'],
        'has_archive' => true,
        'menu_icon' => 'dashicons-portfolio',
    ]);
}
add_action('init', __NAMESPACE__ . '\\register_projects_cpt');
```

---

## 🌐 API Integration

### REST API Endpoints

**Base URL**: `http://localhost:8888/bimverdi/wordpress/index.php?rest_route=`

| Resource | Endpoint | Example |
|----------|----------|---------|
| **Posts** | `/wp/v2/posts` | Get all blog posts |
| **Members** | `/wp/v2/member` | Get all members |
| **Tools** | `/wp/v2/tool` | Get all tools |
| **Cases** | `/wp/v2/case` | Get all cases |
| **Events** | `/wp/v2/event` | Get all events |
| **Single Post** | `/wp/v2/posts/{id}` | Get post by ID |
| **Categories** | `/wp/v2/categories` | Get all categories |
| **Media** | `/wp/v2/media` | Get media files |

### Testing API Endpoints

```bash
# List all members
curl http://localhost:8888/bimverdi/wordpress/index.php?rest_route=/wp/v2/member

# Get single member (ID 123)
curl http://localhost:8888/bimverdi/wordpress/index.php?rest_route=/wp/v2/member/123

# Pretty print with jq
curl http://localhost:8888/bimverdi/wordpress/index.php?rest_route=/wp/v2/posts | jq
```

### GraphQL Queries (if using WPGraphQL)

**Endpoint**: `http://localhost:8888/bimverdi/wordpress/graphql`

```graphql
# Get all posts with featured image
query GetPosts {
  posts(first: 10) {
    nodes {
      id
      title
      excerpt
      date
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
    }
  }
}

# Get members with ACF fields
query GetMembers {
  members(first: 20) {
    nodes {
      id
      title
      acf {
        companyLogo
        website
        contactEmail
      }
    }
  }
}
```

---

## 🗄️ Database Operations

### Accessing MySQL CLI

```bash
# Connect to MySQL
/Applications/MAMP/Library/bin/mysql80/bin/mysql -u root -proot

# Use bimverdi database
USE bimverdi;

# Show all tables
SHOW TABLES;

# Quick exit
EXIT;
```

### Common Database Queries

```sql
-- Count published posts
SELECT COUNT(*) FROM wp_posts 
WHERE post_status='publish' AND post_type='post';

-- List all members
SELECT ID, post_title, post_date 
FROM wp_posts 
WHERE post_type='member' AND post_status='publish'
ORDER BY post_date DESC
LIMIT 10;

-- Get site URL
SELECT option_value FROM wp_options 
WHERE option_name='siteurl';

-- List all users
SELECT ID, user_login, user_email, user_registered 
FROM wp_users;

-- Count posts by type
SELECT post_type, COUNT(*) as count 
FROM wp_posts 
WHERE post_status='publish' 
GROUP BY post_type;
```

### Database Backup & Restore

```bash
# Backup database
/Applications/MAMP/Library/bin/mysql80/bin/mysqldump -u root -proot bimverdi > backup-$(date +%Y%m%d-%H%M%S).sql

# Restore from backup
/Applications/MAMP/Library/bin/mysql80/bin/mysql -u root -proot bimverdi < backup-20241022-153000.sql

# Backup to organized location
mkdir -p ~/backups/bimverdi
/Applications/MAMP/Library/bin/mysql80/bin/mysqldump -u root -proot bimverdi > ~/backups/bimverdi/backup-$(date +%Y%m%d).sql
```

---

## 🧪 Testing & Debugging

### Frontend Testing

```bash
cd frontend

# Type checking
npx tsc --noEmit

# Linting
npm run lint

# Build test (catches many issues)
npm run build

# Production preview
npm run build && npm run start
```

### WordPress Debugging

```bash
# Watch PHP error log
tail -f /Applications/MAMP/logs/php_error.log

# Enable WordPress debug mode
# Edit wp-config.php:
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
define('WP_DEBUG_DISPLAY', false); # Don't show errors in browser

# View WordPress debug log
tail -f wordpress/wp-content/debug.log
```

### API Testing

```bash
# Test REST API
curl -I http://localhost:8888/bimverdi/wordpress/index.php?rest_route=/wp/v2/posts

# Test with authentication (if JWT configured)
TOKEN="your-jwt-token-here"
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8888/bimverdi/wordpress/index.php?rest_route=/wp/v2/posts

# Test GraphQL
curl -X POST http://localhost:8888/bimverdi/wordpress/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ posts { nodes { id title } } }"}'
```

### Browser DevTools

```javascript
// In browser console, test fetch
fetch('http://localhost:3000/api/members')
  .then(r => r.json())
  .then(console.log);

// Check environment variables (NEXT_PUBLIC_ only)
console.log(process.env.NEXT_PUBLIC_WORDPRESS_API_URL);
```

---

## ⚡ Performance & Optimization

### Next.js Optimization

```typescript
// Use ISR (Incremental Static Regeneration)
export async function getMembers() {
  const response = await fetch(url, {
    next: { revalidate: 3600 } // Revalidate every hour
  });
}

// Use dynamic imports for heavy components
import dynamic from 'next/dynamic';
const HeavyComponent = dynamic(() => import('@/components/HeavyComponent'));

// Optimize images
import Image from 'next/image';
<Image 
  src="/image.jpg" 
  width={500} 
  height={300} 
  alt="Description"
  priority={false} // true for above-the-fold images
/>
```

### WordPress Optimization

```bash
# Install caching plugin (via WP Admin)
# Recommended: WP Super Cache or W3 Total Cache

# Optimize database
# Via phpMyAdmin or WP-CLI:
wp db optimize
```

### Database Optimization

```sql
-- Analyze tables
ANALYZE TABLE wp_posts, wp_postmeta;

-- Optimize tables
OPTIMIZE TABLE wp_posts, wp_postmeta;

-- Check table sizes
SELECT 
  table_name AS 'Table',
  ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'Size (MB)'
FROM information_schema.TABLES
WHERE table_schema = 'bimverdi'
ORDER BY (data_length + index_length) DESC;
```

---

## 🔒 Security Best Practices

### Environment Variables

```bash
# ✅ GOOD - Use environment variables
const apiUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;

# ❌ BAD - Hardcoded URLs
const apiUrl = 'http://localhost:8888/...';
```

### Authentication

```typescript
// ✅ GOOD - Check authentication
export async function getPrivateData(token: string) {
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (response.status === 401) {
    throw new Error('Unauthorized');
  }
  
  return response.json();
}
```

### Input Validation

```typescript
// ✅ GOOD - Validate and sanitize
function searchPosts(query: string): string {
  if (typeof query !== 'string') {
    throw new Error('Invalid query');
  }
  
  // Sanitize
  return query.trim().slice(0, 100);
}
```

### Production Checklist

- [ ] Change all secret keys (`JWT_AUTH_SECRET_KEY`, `NEXTAUTH_SECRET`)
- [ ] Set `WP_DEBUG` to `false`
- [ ] Update database credentials (not root/root)
- [ ] Configure CORS for production domain only
- [ ] Enable HTTPS/SSL
- [ ] Remove `ALLOW_UNFILTERED_UPLOADS` or restrict
- [ ] Set up automatic backups
- [ ] Configure rate limiting

---

## 🐛 Troubleshooting

### Port Issues

```bash
# Port 3000 in use
lsof -i :3000
kill -9 <PID>

# Or use different port
npm run dev -- -p 3001

# Port 8888 in use (MAMP)
# Restart MAMP via GUI
```

### MySQL Connection Errors

```bash
# Check MySQL is running
ps aux | grep mysql

# Verify database exists
/Applications/MAMP/Library/bin/mysql80/bin/mysql -u root -proot -e "SHOW DATABASES;" | grep bimverdi

# Check wp-config.php
cat wordpress/wp-config.php | grep DB_
```

### WordPress 404 Errors

```bash
# Flush rewrite rules
# In WP Admin: Settings → Permalinks → Save Changes

# Or via WP-CLI (if installed)
wp rewrite flush
```

### Next.js Build Errors

```bash
cd frontend

# Clear caches
rm -rf .next
rm -rf node_modules
npm install

# Check TypeScript errors
npx tsc --noEmit

# Rebuild
npm run build
```

### CORS Errors

```php
// In wp-config.php, add:
define('JWT_AUTH_CORS_ENABLE', true);

// In functions.php, add:
add_filter('rest_pre_serve_request', function($value) {
    header('Access-Control-Allow-Origin: http://localhost:3000');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Credentials: true');
    return $value;
}, 15);
```

---

## 🚢 Deployment

See complete deployment guides:
- `DEPLOYMENT_QUICKREF.md` - Quick reference
- `SERVEBOLT_DEPLOYMENT.md` - Servebolt-specific guide

### Pre-Deployment Checklist

**Security:**
- [ ] Change all secret keys
- [ ] Update database credentials
- [ ] Disable debug mode (`WP_DEBUG = false`)
- [ ] Configure production CORS

**Performance:**
- [ ] Test production build (`npm run build`)
- [ ] Optimize images
- [ ] Enable caching plugins
- [ ] Configure CDN

**Testing:**
- [ ] All pages load correctly
- [ ] API connectivity works
- [ ] Forms submit properly
- [ ] Mobile responsive
- [ ] Cross-browser tested

**Backup:**
- [ ] Database backup created
- [ ] Files backup created
- [ ] Restore procedure documented

### Quick Deploy Commands

```bash
# Frontend (Vercel)
cd frontend
npm run build
vercel --prod

# WordPress (via FTP/SFTP to Servebolt)
# Use deployment guide for complete process
```

---

## 📞 Support & Resources

### Official Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [WordPress REST API](https://developer.wordpress.org/rest-api/)
- [WPGraphQL](https://www.wpgraphql.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript](https://www.typescriptlang.org/docs)

### Project Documentation
- `README.md` - Project overview
- `SETUP.md` - Initial setup
- `DEVELOPER_GUIDE.md` - This file
- `.github/copilot-instructions.md` - AI assistant context
- `DEPLOYMENT_QUICKREF.md` - Deployment guide

### Useful Commands Reference

```bash
# PHP version
/Applications/MAMP/bin/php/php8.3.10/bin/php -v

# MySQL CLI
/Applications/MAMP/Library/bin/mysql80/bin/mysql -u root -proot bimverdi

# Node/NPM version
node -v && npm -v

# Git status
git status

# WP-CLI (if installed)
cd wordpress
wp plugin list
wp post list
wp user list

# Next.js
cd frontend
npm run dev      # Development
npm run build    # Build
npm run start    # Production
npm run lint     # Lint
```

---

## 🎯 Next Steps

1. **Explore the codebase**
   - Read existing components
   - Understand data flow
   - Check API functions

2. **Start building features**
   - Create new pages
   - Add components
   - Integrate WordPress data

3. **Learn best practices**
   - Follow `.github/copilot-instructions.md`
   - Use TypeScript types
   - Write clean, testable code

4. **Stay updated**
   - Monitor Next.js updates
   - Keep WordPress plugins updated
   - Review security advisories

---

**Happy coding!** 🚀

For questions or issues, refer to:
- This guide for technical details
- `.github/copilot-instructions.md` for coding standards
- `README.md` for project overview

**Last Updated**: October 22, 2025
