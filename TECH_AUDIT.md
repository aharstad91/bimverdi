# BimVerdi - Teknisk Audit og Miljødokumentasjon

**Dato**: 22. oktober 2025
**Versjon**: 1.0
**Prosjekt**: BimVerdi Headless WordPress med Next.js

---

## 📊 Executive Summary

BimVerdi er et moderne headless CMS-oppsett som kombinerer:
- **Backend**: WordPress med REST API & GraphQL
- **Frontend**: Next.js 16 med React 19, TypeScript og Tailwind CSS 4
- **Database**: MySQL 8.0 (MAMP)
- **Utviklingsmiljø**: macOS med MAMP lokalt

### Status: ✅ Miljøet er funksjonelt

---

## 🏗️ Systemarkitektur

```
┌─────────────────────────────────────────────────────────┐
│                    BimVerdi Arkitektur                   │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────┐         ┌──────────────────────────┐ │
│  │   Frontend   │◄────────┤   WordPress Backend      │ │
│  │   Next.js    │  API    │   REST API / GraphQL     │ │
│  │   :3000      │         │   :8888/bimverdi         │ │
│  └──────────────┘         └───────────┬──────────────┘ │
│                                       │                  │
│                             ┌─────────▼──────────┐      │
│                             │   MySQL Database   │      │
│                             │   (bimverdi)       │      │
│                             └────────────────────┘      │
└─────────────────────────────────────────────────────────┘
```

---

## 🛠️ Teknisk Stack

### Backend (WordPress)
- **Plattform**: WordPress (latest)
- **Lokasjon**: `/Applications/MAMP/htdocs/bimverdi/wordpress/`
- **PHP Versjon**: 8.3.10
- **Web Server**: Apache (MAMP)
- **URL**: `http://localhost:8888/bimverdi/wordpress`

#### Installerte Plugins
- **Advanced Custom Fields (ACF)** - Custom content fields
- **WPGraphQL** - GraphQL API for WordPress
- **JWT Authentication for WP REST API** - Token-based authentication
- **Akismet** - Spam protection

#### WordPress Konfigurasjon
```php
// Database
DB_NAME: bimverdi
DB_USER: root
DB_PASSWORD: root
DB_HOST: localhost:/Applications/MAMP/tmp/mysql/mysql.sock
DB_CHARSET: utf8mb4

// Headless Settings
JWT_AUTH_SECRET_KEY: bimverdi-jwt-secret-key-change-in-production
JWT_AUTH_CORS_ENABLE: true
ALLOW_UNFILTERED_UPLOADS: true
WP_DEBUG: false
```

### Frontend (Next.js)
- **Framework**: Next.js 16.0.0
- **React**: 19.2.0
- **TypeScript**: 5.x
- **Styling**: Tailwind CSS 4.x
- **Lokasjon**: `/Applications/MAMP/htdocs/bimverdi/frontend/`
- **Dev URL**: `http://localhost:3000`

#### Frontend Dependencies
```json
{
  "react": "19.2.0",
  "react-dom": "19.2.0",
  "next": "16.0.0",
  "typescript": "^5",
  "tailwindcss": "^4",
  "babel-plugin-react-compiler": "1.0.0"
}
```

#### Next.js Features
- ✅ React Compiler aktivert
- ✅ TypeScript med strict mode
- ✅ App Router (src/app/)
- ✅ Path aliases (@/*)
- ✅ ESLint konfigurert

### Database
- **Type**: MySQL 8.0
- **Lokasjon**: `/Applications/MAMP/Library/bin/mysql80/`
- **Database Navn**: `bimverdi`
- **Character Set**: utf8mb4
- **Tabeller**: 12 standard WordPress tabeller

#### Database Tabeller
```
wp_commentmeta
wp_comments
wp_links
wp_options
wp_postmeta
wp_posts
wp_term_relationships
wp_term_taxonomy
wp_termmeta
wp_terms
wp_usermeta
wp_users
```

---

## 🔧 PHP Konfigurasjon

### PHP Versjon og Moduler
```
PHP 8.3.10 (cli) (built: Aug 5 2024 15:58:55) (NTS)
Zend Engine v4.3.10
```

### Viktige PHP Moduler
- ✅ mysqli / pdo_mysql - Database tilkobling
- ✅ curl - HTTP requests
- ✅ gd - Bildehåndtering
- ✅ mbstring - Multibyte string support
- ✅ json - JSON parsing
- ✅ openssl - Kryptering
- ✅ fileinfo - Filtype deteksjon
- ✅ intl - Internasjonalisering

---

## 📁 Prosjektstruktur

```
/Applications/MAMP/htdocs/bimverdi/
├── .git/                       # Git repository
├── .gitignore                  # Git ignore rules
├── create-database.sql         # Database setup SQL
│
├── wordpress/                  # WordPress backend
│   ├── wp-admin/              # Admin interface
│   ├── wp-content/            # Themes, plugins, uploads
│   │   ├── plugins/
│   │   │   ├── advanced-custom-fields/
│   │   │   ├── wp-graphql/
│   │   │   └── jwt-authentication-for-wp-rest-api/
│   │   ├── themes/
│   │   └── uploads/
│   ├── wp-includes/           # WordPress core
│   └── wp-config.php          # WordPress config (NOT in Git ✅)
│
├── frontend/                   # Next.js frontend
│   ├── src/
│   │   ├── app/               # App Router pages
│   │   ├── components/        # React components
│   │   ├── lib/               # Utility functions
│   │   └── types/             # TypeScript types
│   ├── public/                # Static assets
│   ├── .env.local             # Environment variables (NOT in Git ✅)
│   ├── .env.local.example     # Environment template
│   ├── package.json           # NPM dependencies
│   ├── tsconfig.json          # TypeScript config
│   ├── next.config.ts         # Next.js config
│   ├── tailwind.config.js     # Tailwind CSS config
│   └── eslint.config.mjs      # ESLint config
│
└── Documentation/
    ├── README.md
    ├── INSTALL_WORDPRESS.md
    ├── WORDPRESS_SETUP.md
    ├── NEXT_STEPS.md
    ├── DEPLOYMENT_QUICKREF.md
    ├── SERVEBOLT_DEPLOYMENT.md
    └── TECH_AUDIT.md (this file)
```

---

## 🔒 Sikkerhet

### ✅ Sikkerhetsstatus

#### Positive punkter:
- ✅ `.env` filer er ikke versjonskontrollert
- ✅ `wp-config.php` er ikke i Git
- ✅ `.gitignore` er riktig konfigurert
- ✅ JWT autentisering implementert
- ✅ CORS aktivert for frontend

#### ⚠️ Sikkerhetsvarsler (for produksjon):

1. **JWT Secret Key** er hardkodet i wp-config.php
   ```php
   // ENDRE DETTE FØR PRODUKSJON:
   define('JWT_AUTH_SECRET_KEY', 'bimverdi-jwt-secret-key-change-in-production');
   ```

2. **NEXTAUTH_SECRET** må endres
   ```bash
   # I frontend/.env.local:
   NEXTAUTH_SECRET=change-this-to-a-random-string-in-production
   ```

3. **Database credentials** er standard MAMP
   - User: root
   - Password: root
   - ⚠️ ALDRI bruk dette i produksjon

4. **WP_DEBUG** bør være `false` i produksjon (✅ allerede satt)

5. **ALLOW_UNFILTERED_UPLOADS** kan være en sikkerhetsrisiko
   - Vurder å deaktivere i produksjon

---

## 🚀 Hvordan Kjøre Miljøet

### 1. Start MAMP
```bash
# Åpne MAMP applikasjonen
# Klikk "Start Servers"
# Verifiser at Apache og MySQL kjører på:
# - Apache: Port 8888
# - MySQL: Port 8889
```

### 2. Verifiser Database
```bash
# Test MySQL tilkobling
/Applications/MAMP/Library/bin/mysql80/bin/mysql -u root -proot

# Bruk bimverdi database
USE bimverdi;

# List tabeller
SHOW TABLES;
```

### 3. Start WordPress
```bash
# WordPress er tilgjengelig på:
open http://localhost:8888/bimverdi/wordpress

# Admin panel:
open http://localhost:8888/bimverdi/wordpress/wp-admin
```

### 4. Start Next.js Frontend
```bash
cd /Applications/MAMP/htdocs/bimverdi/frontend

# Installer dependencies (første gang)
npm install

# Start development server
npm run dev

# Frontend kjører nå på:
# http://localhost:3000
```

### 5. Test API Endpoints
```bash
# REST API
curl http://localhost:8888/bimverdi/wordpress/index.php?rest_route=/wp/v2/posts

# GraphQL (hvis konfigurert)
curl -X POST http://localhost:8888/bimverdi/wordpress/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ posts { nodes { id title } } }"}'
```

---

## 🧪 Testing og Debugging

### WordPress Debugging
```bash
# Tail WordPress error log
tail -f /Applications/MAMP/logs/php_error.log

# WordPress debug mode
# I wp-config.php:
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
define('WP_DEBUG_DISPLAY', false);
```

### Next.js Debugging
```bash
# Development mode med verbose logging
npm run dev -- --verbose

# Build for production test
npm run build
npm run start

# Type checking
npm run type-check

# Linting
npm run lint
```

### Database Queries
```bash
# Check WordPress site URL
/Applications/MAMP/Library/bin/mysql80/bin/mysql -u root -proot bimverdi \
  -e "SELECT option_value FROM wp_options WHERE option_name='siteurl';"

# Count posts
/Applications/MAMP/Library/bin/mysql80/bin/mysql -u root -proot bimverdi \
  -e "SELECT COUNT(*) FROM wp_posts WHERE post_status='publish' AND post_type='post';"
```

---

## 📦 Dependencies Management

### Frontend (NPM)
```bash
cd frontend

# Installer alle dependencies
npm install

# Oppdater dependencies
npm update

# Check for outdated packages
npm outdated

# Audit for sikkerhetsproblemer
npm audit
npm audit fix
```

### Backend (WordPress)
WordPress plugins håndteres via WP Admin interface:
- http://localhost:8888/bimverdi/wordpress/wp-admin/plugins.php

---

## 🔄 Git Workflow

### Current Branch
```bash
# Main branch
git branch
# * main
```

### Staging og Commit
```bash
# Status
git status

# Add endringer
git add .

# Commit
git commit -m "Descriptive message"

# Push
git push origin main
```

---

## 📈 Performance Considerations

### WordPress Optimalisering
- [ ] Installer caching plugin (WP Super Cache, W3 Total Cache)
- [ ] Optimaliser bilder (WebP format)
- [ ] Enable Gzip compression
- [ ] Minify CSS/JS
- [ ] Database optimalisering (wp-optimize plugin)

### Next.js Optimalisering
- ✅ React Compiler aktivert (automatisk optimalisering)
- [ ] Image optimization (next/image)
- [ ] Dynamic imports for code splitting
- [ ] Static generation hvor mulig
- [ ] API route caching

---

## 🐛 Troubleshooting

### Problem: Port 3000 allerede i bruk
```bash
# Finn prosess på port 3000
lsof -i :3000

# Kill prosess
kill -9 <PID>

# Eller bruk alternativ port
npm run dev -- -p 3001
```

### Problem: MySQL Connection Error
```bash
# Sjekk om MySQL kjører
ps aux | grep mysql

# Restart MAMP servers
# Via MAMP GUI: Stop Servers → Start Servers

# Test connection
/Applications/MAMP/Library/bin/mysql80/bin/mysql -u root -proot
```

### Problem: WordPress 404 Errors
```bash
# I wp-admin, gå til Settings → Permalinks
# Lagre permalink settings på nytt
# Dette regenererer .htaccess rewrite rules
```

### Problem: CORS Errors
```php
// I wp-config.php, legg til:
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Credentials: true');
```

### Problem: Next.js Build Errors
```bash
cd frontend

# Clear cache
rm -rf .next
rm -rf node_modules
npm install

# Rebuild
npm run build
```

---

## 📝 Maintenance Checklist

### Daglig
- [ ] Sjekk at MAMP servers kjører
- [ ] Test frontend og backend connectivity
- [ ] Monitor error logs

### Ukentlig
- [ ] Database backup
- [ ] Update WordPress plugins
- [ ] Review npm security audits
- [ ] Check git commits

### Månedlig
- [ ] WordPress core update
- [ ] PHP version check
- [ ] Dependencies update (npm update)
- [ ] Performance audit
- [ ] Security review

---

## 🌐 Environment Variables

### Frontend (.env.local)
```bash
# WordPress Backend
NEXT_PUBLIC_WORDPRESS_API_URL=http://localhost:8888/bimverdi/wordpress/index.php?rest_route=
NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://localhost:8888/bimverdi/wordpress/graphql
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=change-this-to-a-random-string-in-production
```

### Backend (wp-config.php)
```php
// Database
define('DB_NAME', 'bimverdi');
define('DB_USER', 'root');
define('DB_PASSWORD', 'root');
define('DB_HOST', 'localhost:/Applications/MAMP/tmp/mysql/mysql.sock');

// JWT
define('JWT_AUTH_SECRET_KEY', 'bimverdi-jwt-secret-key-change-in-production');
define('JWT_AUTH_CORS_ENABLE', true);
```

---

## 🚢 Deployment Checklist

Se også: `SERVEBOLT_DEPLOYMENT.md` og `DEPLOYMENT_QUICKREF.md`

### Pre-deployment
- [ ] Change all secret keys
- [ ] Update database credentials
- [ ] Set WP_DEBUG to false
- [ ] Configure CORS for production domain
- [ ] Update NEXTAUTH_URL to production URL
- [ ] Test build locally: `npm run build`
- [ ] Database backup
- [ ] Code review

### Post-deployment
- [ ] Verify frontend loads
- [ ] Test API connectivity
- [ ] Check SSL certificate
- [ ] Monitor error logs
- [ ] Performance testing
- [ ] SEO verification

---

## 📞 Support og Ressurser

### Dokumentasjon
- [Next.js Documentation](https://nextjs.org/docs)
- [WordPress REST API Handbook](https://developer.wordpress.org/rest-api/)
- [WPGraphQL Documentation](https://www.wpgraphql.com/docs/introduction)
- [Advanced Custom Fields](https://www.advancedcustomfields.com/resources/)

### Useful Commands Reference
```bash
# PHP version
/Applications/MAMP/bin/php/php8.3.10/bin/php -v

# MySQL CLI
/Applications/MAMP/Library/bin/mysql80/bin/mysql -u root -proot

# WordPress CLI (if installed)
cd wordpress
wp plugin list
wp user list

# Next.js
cd frontend
npm run dev      # Development
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Lint code
```

---

## 🎯 Neste Steg

1. **Sikkerhet**:
   - [ ] Generer sikre secret keys for produksjon
   - [ ] Implementer proper authentication flow
   - [ ] Setup SSL for lokal utvikling (mkcert)

2. **Features**:
   - [ ] Implementer member management system
   - [ ] ACF field groups for custom post types
   - [ ] Frontend komponenter for content display
   - [ ] Search functionality

3. **DevOps**:
   - [ ] Setup CI/CD pipeline
   - [ ] Automated testing
   - [ ] Staging environment
   - [ ] Monitoring og logging

4. **Dokumentasjon**:
   - [ ] API documentation
   - [ ] Component library
   - [ ] User guide
   - [ ] Deployment runbook

---

**Sist oppdatert**: 22. oktober 2025
**Vedlikeholdt av**: Andreas Harstad
**Repository**: https://github.com/aharstad91/bimverdi
