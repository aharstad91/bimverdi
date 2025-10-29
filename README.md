# BimVerdi

> **Headless WordPress CMS + Next.js** for Norwegian BIM (Building Information Modeling) value creation platform.

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![WordPress](https://img.shields.io/badge/WordPress-Latest-blue)](https://wordpress.org/)

---

## 🎯 Quick Start

```bash
# 1. Start MAMP (Apache + MySQL)
# Open MAMP app → Start Servers

# 2. Start Next.js frontend
cd frontend
npm run dev

# 3. Access:
# Frontend:  http://localhost:3000
# WordPress: http://localhost:8888/bimverdi/wordpress
# WP Admin:  http://localhost:8888/bimverdi/wordpress/wp-admin
```

---

## 📚 Documentation

### Getting Started
- **[docs/DEVELOPER_GUIDE.md](docs/DEVELOPER_GUIDE.md)** - Complete development workflow & reference
- **[.github/copilot-instructions.md](.github/copilot-instructions.md)** - AI assistant context & coding standards

### Deployment & Setup
- **[docs/DEPLOYMENT_QUICKREF.md](docs/DEPLOYMENT_QUICKREF.md)** - Quick deployment reference
- **[docs/SERVEBOLT_DEPLOYMENT.md](docs/SERVEBOLT_DEPLOYMENT.md)** - Servebolt-specific deployment
- **[docs/GRAVITY_FORMS_SETUP_GUIDE.md](docs/GRAVITY_FORMS_SETUP_GUIDE.md)** - Forms configuration
- **[docs/ARRANGEMENT_MVP_STATUS_TODO.md](docs/ARRANGEMENT_MVP_STATUS_TODO.md)** - Arrangement feature status

---

## 🏗️ Architecture

```
┌─────────────┐         ┌──────────────┐         ┌──────────┐
│  Next.js    │ ◄─API─► │  WordPress   │ ◄────► │  MySQL   │
│  Frontend   │         │  (Headless)  │         │ Database │
│  :3000      │         │  :8888       │         │          │
└─────────────┘         └──────────────┘         └──────────┘
```

### Tech Stack
- **Backend**: WordPress 6.x (Headless CMS)
  - PHP 8.3.10
  - Advanced Custom Fields (ACF)
  - WPGraphQL
  - JWT Authentication

- **Frontend**: Next.js 16.0 + React 19
  - TypeScript 5.x (strict mode)
  - Tailwind CSS 4.x
  - Server Components by default
  - App Router

- **Database**: MySQL 8.0
  - Character set: utf8mb4

- **Development**: MAMP (local) → Servebolt (production)

---

## 📂 Project Structure

```
bimverdi/
├── docs/                   # 📚 All documentation
│   ├── DEVELOPER_GUIDE.md
│   ├── DEPLOYMENT_QUICKREF.md
│   └── ...
│
├── wordpress/              # WordPress backend (CMS)
│   ├── wp-content/
│   │   ├── plugins/       # ACF, WPGraphQL, JWT
│   │   ├── themes/        # Custom theme
│   │   └── uploads/       # User uploads
│   └── wp-config.php      # Config (not in git)
│
├── frontend/               # Next.js frontend
│   ├── src/
│   │   ├── app/           # Pages (App Router)
│   │   ├── components/    # React components
│   │   ├── lib/           # Utils & API functions
│   │   └── types/         # TypeScript types
│   ├── public/            # Static assets
│   └── .env.local         # Environment vars (not in git)
│
└── .github/
    └── copilot-instructions.md  # AI assistant context
```

---

## 🎨 Features

### Public Website
- ✅ **Articles** - Blog posts with SEO optimization
- ✅ **Members Directory** - Company catalog with search
- ✅ **Tools Catalog** - BIM tools and resources
- ✅ **Case Studies** - Project showcases
- ✅ **Events** - Projects and arrangements calendar
- ✅ **SSG/ISR** - Static generation with incremental regeneration

### Member Portal (Coming Soon)
- 🔄 Self-service profile management
- 🔄 Content submission forms
- 🔄 Dashboard with analytics
- 🔄 Consent management

---

## 🛠️ Development

### Daily Workflow

```bash
# Morning
git pull origin main
# Start MAMP → Start frontend

# Work
npm run dev  # Auto-reload on changes

# Before commit
npm run lint
npx tsc --noEmit
npm run build

# Evening
git commit -m "feat: description"
git push origin main
```

### Custom Post Types

| Type | Slug | Description |
|------|------|-------------|
| **Members** | `member` | Company members with logos, descriptions |
| **Tools** | `tool` | BIM software and tools catalog |
| **Cases** | `case` | Project case studies with images |
| **Events** | `event` | Arrangements, webinars, conferences |
| **Posts** | `post` | Blog articles (standard WordPress) |

### API Endpoints

**REST API**: `http://localhost:8888/bimverdi/wordpress/index.php?rest_route=`

```bash
# Get all members
/wp/v2/member

# Get all tools
/wp/v2/tool

# Get all cases
/wp/v2/case

# Get all events
/wp/v2/event
```

**GraphQL**: `http://localhost:8888/bimverdi/wordpress/graphql`

---

## 🔒 Environment Variables

### Frontend (`frontend/.env.local`)
```bash
NEXT_PUBLIC_WORDPRESS_API_URL=http://localhost:8888/bimverdi/wordpress/index.php?rest_route=
NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://localhost:8888/bimverdi/wordpress/graphql
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=change-in-production
```

### Backend (`wordpress/wp-config.php`)
```php
define('DB_NAME', 'bimverdi');
define('DB_USER', 'root');
define('DB_PASSWORD', 'root');
define('JWT_AUTH_SECRET_KEY', 'change-in-production');
define('JWT_AUTH_CORS_ENABLE', true);
```

**⚠️ Note**: Never commit `.env.local` or `wp-config.php` to Git!

---

## 📊 Common Commands

```bash
# Frontend
cd frontend
npm install          # Install dependencies
npm run dev          # Start dev server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Lint code
npx tsc --noEmit     # Type check

# WordPress (via WP-CLI, if installed)
cd wordpress
wp plugin list       # List plugins
wp post list         # List posts
wp user list         # List users

# Database
/Applications/MAMP/Library/bin/mysql80/bin/mysql -u root -proot bimverdi

# Backup database
/Applications/MAMP/Library/bin/mysql80/bin/mysqldump -u root -proot bimverdi > backup.sql
```

---

## 🚀 Deployment

### Production Environment
- **WordPress**: Servebolt.com
- **Frontend**: Vercel (recommended) or Servebolt
- **Database**: Servebolt MySQL
- **CDN**: Servebolt Accelerated Domains

### Deploy Checklist
- [ ] Change all secret keys
- [ ] Update database credentials
- [ ] Set `WP_DEBUG` to `false`
- [ ] Configure production CORS
- [ ] Test production build
- [ ] Backup database
- [ ] Deploy WordPress to Servebolt
- [ ] Deploy Next.js to Vercel

**Full guide**: See [`docs/SERVEBOLT_DEPLOYMENT.md`](docs/SERVEBOLT_DEPLOYMENT.md)

---

## 🐛 Troubleshooting

### Common Issues

**Port 3000 in use:**
```bash
lsof -i :3000
kill -9 <PID>
```

**Database connection error:**
```bash
# Check MAMP MySQL is running
ps aux | grep mysql
```

**WordPress 404 errors:**
```
WP Admin → Settings → Permalinks → Save Changes
```

**More help**: See [docs/DEVELOPER_GUIDE.md](docs/DEVELOPER_GUIDE.md#troubleshooting)

---

## 🤝 Contributing

1. Read [`.github/copilot-instructions.md`](.github/copilot-instructions.md) for coding standards
2. Follow TypeScript strict mode
3. Use Server Components by default
4. Write semantic, accessible HTML
5. Test before committing

---

## 📞 Support

- **Documentation**: Start with [`docs/DEVELOPER_GUIDE.md`](docs/DEVELOPER_GUIDE.md)
- **AI Assistant**: Context in [`.github/copilot-instructions.md`](.github/copilot-instructions.md)
- **Issues**: Check troubleshooting section in developer guide

---

## 📝 License

Proprietary - BimVerdi Project

---

**Last Updated**: October 28, 2025
