# Servebolt Deployment Guide for BIMVerdi

## 🚀 Produksjonsmiljø: Servebolt.com

Dette prosjektet er satt opp for å enkelt kunne deployes til Servebolt når det går live.

## Lokal Utvikling vs Produksjon

### Lokal (MAMP)
- WordPress: `http://localhost:8888/bimverdi/wordpress`
- Database: `bimverdi` (MySQL)
- User/Pass: `root/root`

### Produksjon (Servebolt)
- WordPress: `https://bimverdi.no` (eller staging subdomain)
- Database: Gitt av Servebolt
- User/Pass: Gitt av Servebolt

## 📋 Pre-deployment Sjekkliste

### 1. Database
- [ ] Eksporter database fra lokal MAMP
- [ ] Søk/erstatt URLer: `localhost:8888/bimverdi/wordpress` → `bimverdi.no`
- [ ] Importer til Servebolt database

### 2. WordPress Filer
- [ ] Last opp `wordpress/` mappen til Servebolt via SFTP/Git
- [ ] Oppdater `wp-config.php` med Servebolt database credentials
- [ ] Sett riktige fil-permissions (Servebolt gjør dette automatisk)

### 3. Next.js Frontend
**Anbefalt hosting for Next.js: Vercel**
- [ ] Deploy Next.js til Vercel (gratis, optimalisert for Next.js)
- [ ] Eller: Deploy til Servebolt med Node.js support
- [ ] Oppdater `.env.local` med produksjons-URL

### 4. Miljøvariabler
Oppdater i Next.js (Vercel):
```env
NEXT_PUBLIC_WORDPRESS_API_URL=https://bimverdi.no/wp-json
NEXT_PUBLIC_GRAPHQL_ENDPOINT=https://bimverdi.no/graphql
NEXT_PUBLIC_SITE_URL=https://frontend.bimverdi.no
NEXTAUTH_URL=https://frontend.bimverdi.no
NEXTAUTH_SECRET=produksjons-secret-nøkkel-her
```

## 🔧 Servebolt-Spesifikke Innstillinger

### wp-config.php for Servebolt

Servebolt gir deg disse variablene automatisk. Oppdater `wp-config.php`:

```php
// Servebolt Database (erstatt med faktiske verdier fra Servebolt)
define( 'DB_NAME', 'servebolt_database_name' );
define( 'DB_USER', 'servebolt_database_user' );
define( 'DB_PASSWORD', 'servebolt_database_password' );
define( 'DB_HOST', 'servebolt_database_host' );

// Servebolt Cache (Accelerated Domains)
define('SERVEBOLT_CDN_URL', 'https://cdn.bimverdi.no');

// Multisite (hvis aktuelt)
// define('WP_ALLOW_MULTISITE', true);

// SSL (Servebolt håndterer dette automatisk)
if (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https') {
    $_SERVER['HTTPS'] = 'on';
}

// Headless WordPress settings
define('JWT_AUTH_SECRET_KEY', 'endre-til-sterk-produksjonsnøkkel');
define('JWT_AUTH_CORS_ENABLE', true);

// Tillat frontend å aksessere WordPress
// Oppdater til faktisk frontend URL
$allowed_origins = array(
    'https://frontend.bimverdi.no',
    'https://www.bimverdi.no'
);

if (isset($_SERVER['HTTP_ORIGIN']) && in_array($_SERVER['HTTP_ORIGIN'], $allowed_origins)) {
    header('Access-Control-Allow-Origin: ' . $_SERVER['HTTP_ORIGIN']);
    header('Access-Control-Allow-Credentials: true');
}

// Servebolt Performance
define('WP_CACHE', true);
define('DISABLE_WP_CRON', true); // Servebolt bruker system cron
```

### Servebolt Plugins

Servebolt har egne optimaliseringsplugins:
- [ ] **Servebolt Optimizer** - Installeres automatisk
- [ ] **Accelerated Domains (CDN)** - Aktiveres i Servebolt kontrollpanel
- [ ] **Full Page Cache** - Konfigureres i Servebolt

## 🚢 Deployment Prosess

### Alternativ 1: SFTP/FTP (Enklest)
1. Koble til Servebolt via SFTP (FileZilla, Cyberduck)
2. Last opp `wordpress/` mappen til webroot
3. Last opp database via phpMyAdmin på Servebolt
4. Oppdater `wp-config.php` med Servebolt credentials

### Alternativ 2: Git Deployment (Anbefalt)
Servebolt støtter Git deployment:

```bash
# Legg til Servebolt som remote
git remote add servebolt ssh://user@servebolt.com/path/to/repo

# Push til Servebolt
git push servebolt main
```

**Viktig**: Ekskluder sensitive filer fra Git (allerede i `.gitignore`):
- `wp-config.php` (lag separat for produksjon)
- `.env.local`
- `wp-content/uploads/`

### Alternativ 3: WP Migrate DB Pro
1. Installer WP Migrate DB Pro lokalt og på Servebolt
2. Push/Pull database og filer direkte fra WP Admin

## 📊 Database Migrering

### Metode 1: WP-CLI (Anbefalt for Servebolt)
```bash
# Eksporter lokal database
wp db export bimverdi-local.sql

# Søk og erstatt URLer
wp search-replace 'http://localhost:8888/bimverdi/wordpress' 'https://bimverdi.no' --export=bimverdi-prod.sql

# Importer på Servebolt (via SSH)
wp db import bimverdi-prod.sql
```

### Metode 2: phpMyAdmin
1. Eksporter fra MAMP phpMyAdmin
2. Bruk "Search and Replace DB" script
3. Importer til Servebolt phpMyAdmin

### Metode 3: Plugin
Bruk plugin som:
- All-in-One WP Migration
- Duplicator
- WP Migrate DB

## 🔐 Sikkerhet og Ytelse

### Servebolt Best Practices
- [ ] Bruk Servebolt sitt CDN (Accelerated Domains)
- [ ] Aktiver Full Page Cache
- [ ] Sett opp automatiske backups i Servebolt kontrollpanel
- [ ] Bruk sterke passord og 2FA
- [ ] Oppdater plugins og WordPress regelmessig

### WordPress Security
```php
// I wp-config.php
define('DISALLOW_FILE_EDIT', true); // Disable theme/plugin editor
define('WP_AUTO_UPDATE_CORE', 'minor'); // Auto-update minor versions
```

## 🌐 Domain og DNS

### DNS Oppsett (hos domain registrar)
```
A Record:
@ → Servebolt IP (gitt av Servebolt)

CNAME:
www → bimverdi.no
frontend → vercel-deployment.vercel.app (hvis Next.js på Vercel)
```

### SSL Sertifikat
- Servebolt installerer automatisk Let's Encrypt SSL
- Eller last opp eget sertifikat i Servebolt kontrollpanel

## 📱 Testing før Launch

### Staging Environment
Anbefalt å bruke staging subdomain:
```
staging.bimverdi.no → Test WordPress backend
staging-frontend.bimverdi.no → Test Next.js frontend
```

### Sjekkliste før Go-Live
- [ ] Test alle API-endepunkter
- [ ] Verifiser CORS fungerer mellom frontend og backend
- [ ] Test alle CPT-er (medlemmer, verktøy, caser, arrangementer)
- [ ] Verifiser ACF-felt vises i REST API
- [ ] Test innlogging/autentisering
- [ ] Test bildeopplasting og CDN
- [ ] Kjør Lighthouse/PageSpeed test
- [ ] Test på mobil/tablet
- [ ] Sjekk at SSL fungerer (HTTPS)

## 🚀 Next.js Deployment til Vercel

```bash
# Fra frontend-mappen
cd frontend

# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Legg til miljøvariabler i Vercel dashboard
# Eller via CLI:
vercel env add NEXT_PUBLIC_WORDPRESS_API_URL
```

## 📝 Vedlikehold

### Backup Strategi
- **Servebolt**: Daglige automatiske backups (30 dager)
- **Manuell backup**: Ukentlig via WP Migrate DB eller phpMyAdmin
- **Git**: Kode (ikke uploads) i GitHub

### Oppdateringer
1. Test oppdateringer i staging først
2. Oppdater plugins via WP Admin
3. Oppdater WordPress core (minor updates auto)
4. Test alle funksjoner etter oppdatering

## 🔄 Deployment Workflow

### For hver deployment:
```bash
# 1. Test lokalt
npm run dev (i frontend)
# Test WordPress på localhost:8888

# 2. Commit og push til GitHub
git add .
git commit -m "Feature: beskrivelse"
git push origin main

# 3. Deploy Next.js til Vercel (automatisk fra GitHub)
# Vercel deployer automatisk når du pusher til main

# 4. Deploy WordPress til Servebolt
# Via Git, SFTP eller WP Migrate DB
```

## 📞 Support

### Servebolt Support
- Dokumentasjon: https://servebolt.com/help
- Support: support@servebolt.com
- Telefon: +47 22 99 66 99

### Viktige Lenker
- Servebolt Kontrollpanel: https://admin.servebolt.com
- GitHub Repo: https://github.com/aharstad91/bimverdi
- Vercel Dashboard: https://vercel.com/dashboard

## ⚠️ Husk

1. **Ikke commit wp-config.php med produksjons-credentials til Git**
2. **Bruk environment-specific config filer**
3. **Test alltid i staging før produksjon**
4. **Ta backup før store endringer**
5. **Monitorer ytelse og feil etter deployment**

## 🎯 Estimert Deployment Tid
- **Første gang**: 2-4 timer
- **Senere deployments**: 15-30 minutter

---

**Klar til deployment?** Følg stegene over, og ta kontakt hvis du trenger hjelp! 🚀
