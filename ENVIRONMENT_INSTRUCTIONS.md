# BimVerdi - Miljø Setup Instruksjoner

En enkel guide for å komme i gang med BimVerdi utviklingsmiljøet.

---

## 🎯 Oversikt

BimVerdi består av to hoveddeler:
1. **WordPress Backend** - Headless CMS på `http://localhost:8888/bimverdi/wordpress`
2. **Next.js Frontend** - React applikasjon på `http://localhost:3000`

---

## 🚀 Quick Start (5 minutter)

### 1. Start MAMP
```bash
# Åpne MAMP applikasjonen
# Klikk "Start Servers"
# Vent til Apache og MySQL er grønne
```

### 2. Verifiser WordPress
```bash
# Åpne i browser:
open http://localhost:8888/bimverdi/wordpress/wp-admin

# Login med dine credentials
```

### 3. Start Frontend
```bash
cd /Applications/MAMP/htdocs/bimverdi/frontend
npm run dev
```

### 4. Åpne Nettside
```bash
# Automatisk åpne frontend:
open http://localhost:3000
```

✅ **Ferdig!** Du er nå klar til å utvikle.

---

## 📋 Detaljert Setup (første gang)

### Forutsetninger

**Installert programvare:**
- ✅ MAMP (Mac Apache MySQL PHP)
- ✅ Node.js (v18+)
- ✅ Git
- ✅ En kodeeditor (VS Code anbefales)

### Steg-for-steg Setup

#### 1. Klon Repository
```bash
# Hvis ikke allerede gjort:
cd /Applications/MAMP/htdocs
git clone <repository-url> bimverdi
cd bimverdi
```

#### 2. Setup Database
```bash
# Start MAMP først!

# Opprett database (hvis ikke eksisterer)
/Applications/MAMP/Library/bin/mysql80/bin/mysql -u root -proot -e "CREATE DATABASE IF NOT EXISTS bimverdi CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Importer initial data (hvis du har en dump)
# /Applications/MAMP/Library/bin/mysql80/bin/mysql -u root -proot bimverdi < database-dump.sql
```

#### 3. Konfigurer WordPress
```bash
cd wordpress

# Kopier config template (hvis wp-config.php ikke finnes)
# cp wp-config-template.php wp-config.php

# Rediger wp-config.php med dine innstillinger
# Database settings er allerede satt til MAMP defaults

# Installer WordPress (hvis første gang)
open http://localhost:8888/bimverdi/wordpress/wp-admin/install.php
```

#### 4. Setup Frontend
```bash
cd /Applications/MAMP/htdocs/bimverdi/frontend

# Installer dependencies
npm install

# Kopier environment variables
cp .env.local.example .env.local

# Rediger .env.local hvis nødvendig
# Defaults burde fungere for lokal utvikling
```

#### 5. Verifiser Setup
```bash
# Test WordPress API
curl http://localhost:8888/bimverdi/wordpress/index.php?rest_route=/wp/v2/posts

# Start frontend
npm run dev

# Test frontend
curl http://localhost:3000
```

---

## 🛠️ Daglig Utvikling

### Starte Miljøet

**Terminal 1 - MAMP:**
```bash
# Start MAMP GUI og klikk "Start Servers"
# Eller restart hvis allerede kjører
```

**Terminal 2 - Frontend:**
```bash
cd /Applications/MAMP/htdocs/bimverdi/frontend
npm run dev
```

### Stoppe Miljøet

**Frontend:**
```bash
# Trykk Ctrl+C i terminalen hvor npm run dev kjører
```

**MAMP:**
```bash
# Åpne MAMP GUI og klikk "Stop Servers"
```

---

## 🔧 Vanlige Oppgaver

### Installere nye NPM pakker
```bash
cd frontend
npm install <pakke-navn>
# eller for dev dependencies:
npm install -D <pakke-navn>
```

### Installere WordPress Plugins
```bash
# Via admin interface:
open http://localhost:8888/bimverdi/wordpress/wp-admin/plugin-install.php

# Eller manuelt:
cd wordpress/wp-content/plugins
# Last ned og pakk ut plugin
# Aktiver i admin interface
```

### Database Backup
```bash
# Backup hele databasen
/Applications/MAMP/Library/bin/mysql80/bin/mysqldump -u root -proot bimverdi > backup-$(date +%Y%m%d).sql

# Restore fra backup
/Applications/MAMP/Library/bin/mysql80/bin/mysql -u root -proot bimverdi < backup-20241022.sql
```

### Clear Cache
```bash
# Next.js cache
cd frontend
rm -rf .next
npm run dev

# WordPress cache (hvis caching plugin installert)
# Gjør via WP Admin interface
```

---

## 📂 Hvor Finner Jeg...?

### WordPress Filer
```bash
# Admin interface
/Applications/MAMP/htdocs/bimverdi/wordpress/wp-admin/

# Plugins
/Applications/MAMP/htdocs/bimverdi/wordpress/wp-content/plugins/

# Themes
/Applications/MAMP/htdocs/bimverdi/wordpress/wp-content/themes/

# Uploads (bilder, filer)
/Applications/MAMP/htdocs/bimverdi/wordpress/wp-content/uploads/

# Config
/Applications/MAMP/htdocs/bimverdi/wordpress/wp-config.php
```

### Frontend Filer
```bash
# Pages (App Router)
/Applications/MAMP/htdocs/bimverdi/frontend/src/app/

# Components
/Applications/MAMP/htdocs/bimverdi/frontend/src/components/

# TypeScript types
/Applications/MAMP/htdocs/bimverdi/frontend/src/types/

# Utilities
/Applications/MAMP/htdocs/bimverdi/frontend/src/lib/

# Static files
/Applications/MAMP/htdocs/bimverdi/frontend/public/

# Config
/Applications/MAMP/htdocs/bimverdi/frontend/next.config.ts
/Applications/MAMP/htdocs/bimverdi/frontend/.env.local
```

### Log Filer
```bash
# PHP error log
/Applications/MAMP/logs/php_error.log

# Apache error log
/Applications/MAMP/logs/apache_error.log

# MySQL log
/Applications/MAMP/logs/mysql_error.log

# Tail logs live
tail -f /Applications/MAMP/logs/php_error.log
```

---

## 🐛 Troubleshooting

### "Cannot connect to database"

**Løsning:**
```bash
# 1. Sjekk at MAMP MySQL kjører
ps aux | grep mysql

# 2. Verifiser database eksisterer
/Applications/MAMP/Library/bin/mysql80/bin/mysql -u root -proot -e "SHOW DATABASES;"

# 3. Sjekk wp-config.php innstillinger
cat wordpress/wp-config.php | grep DB_
```

### "Port 3000 already in use"

**Løsning:**
```bash
# Finn prosess
lsof -i :3000

# Kill prosess
kill -9 <PID>

# Eller bruk annen port
npm run dev -- -p 3001
```

### "Module not found" i Next.js

**Løsning:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### WordPress "404 Not Found" for pages

**Løsning:**
```bash
# 1. I WP Admin, gå til Settings → Permalinks
# 2. Klikk "Save Changes" uten å endre noe
# 3. Dette regenererer .htaccess rewrite rules
```

### "ERR_TOO_MANY_REDIRECTS"

**Løsning:**
```bash
# Sjekk WP siteurl i database
/Applications/MAMP/Library/bin/mysql80/bin/mysql -u root -proot bimverdi \
  -e "SELECT option_value FROM wp_options WHERE option_name IN ('siteurl', 'home');"

# Rett URL (hvis feil):
/Applications/MAMP/Library/bin/mysql80/bin/mysql -u root -proot bimverdi \
  -e "UPDATE wp_options SET option_value='http://localhost:8888/bimverdi/wordpress' WHERE option_name IN ('siteurl', 'home');"
```

---

## 🔄 Git Workflow

### Daglig Workflow
```bash
# 1. Pull nyeste endringer
git pull origin main

# 2. Opprett feature branch (valgfritt)
git checkout -b feature/ny-funksjon

# 3. Gjør endringer...

# 4. Stage endringer
git add .

# 5. Commit
git commit -m "Beskrivende melding"

# 6. Push
git push origin main
# eller for feature branch:
git push origin feature/ny-funksjon
```

### Viktige Git Kommandoer
```bash
# Status
git status

# Se endringer
git diff

# Se commit historikk
git log --oneline

# Reverter fil
git checkout -- filnavn.php

# Tilbakestill til forrige commit
git reset --hard HEAD~1
```

---

## 📊 Development Workflow

### 1. Backend Utvikling (WordPress)

```bash
# 1. Åpne WP Admin
open http://localhost:8888/bimverdi/wordpress/wp-admin

# 2. Opprett/rediger content
# - Posts
# - Pages
# - Custom fields (ACF)

# 3. Test API
curl http://localhost:8888/bimverdi/wordpress/index.php?rest_route=/wp/v2/posts | jq

# 4. Sjekk GraphQL (hvis brukt)
open http://localhost:8888/bimverdi/wordpress/graphql
```

### 2. Frontend Utvikling (Next.js)

```bash
# 1. Start dev server
cd frontend
npm run dev

# 2. Åpne i browser med hot reload
open http://localhost:3000

# 3. Rediger komponenter i:
# - src/app/ (pages)
# - src/components/ (reusable components)

# 4. TypeScript type checking
npm run type-check

# 5. Linting
npm run lint

# 6. Test production build
npm run build
npm run start
```

---

## 📞 Hjelp og Ressurser

### Dokumentasjon
- **BimVerdi Docs**: Se `README.md` og `TECH_AUDIT.md`
- **Next.js**: https://nextjs.org/docs
- **WordPress**: https://developer.wordpress.org/
- **React**: https://react.dev/

### Nyttige Kommandoer

```bash
# PHP versjon
/Applications/MAMP/bin/php/php8.3.10/bin/php -v

# Node versjon
node -v

# NPM versjon
npm -v

# MySQL versjon
/Applications/MAMP/Library/bin/mysql80/bin/mysql --version

# Sjekk porter i bruk
lsof -i :3000
lsof -i :8888

# Disk space
df -h

# Memory usage
top
```

---

## ✅ Checklist for Produksjon

Før du deployer til produksjon, sjekk:

### Sikkerhet
- [ ] Endre alle secret keys i wp-config.php
- [ ] Endre NEXTAUTH_SECRET i .env
- [ ] Oppdater database credentials
- [ ] Sett WP_DEBUG til false
- [ ] Fjern ALLOW_UNFILTERED_UPLOADS (eller begrens)
- [ ] Setup SSL sertifikat

### Performance
- [ ] Test production build: `npm run build`
- [ ] Installer caching plugin (WP)
- [ ] Optimaliser bilder
- [ ] Enable Gzip compression
- [ ] CDN for static assets

### Testing
- [ ] Test alle sider/routes
- [ ] Sjekk API connectivity
- [ ] Verifiser forms fungerer
- [ ] Test responsive design
- [ ] Cross-browser testing

### Backup
- [ ] Database backup
- [ ] File backup (wp-content/uploads)
- [ ] Dokumenter restore prosedyre

---

**Tips**: Legg denne filen til i favoritter og referer til den når du trenger hjelp!

For fullstendig teknisk dokumentasjon, se: `TECH_AUDIT.md`
