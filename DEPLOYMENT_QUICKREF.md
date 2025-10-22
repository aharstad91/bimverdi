# Quick Reference - BIMVerdi Deployment

## 🚀 Når du skal deployere til Servebolt:

### 1. WordPress til Servebolt (Backend)

**Option A: Via SFTP**
```bash
# Koble til Servebolt med SFTP klient (FileZilla, Cyberduck, etc)
Host: sftp.servebolt.com
User: [fra Servebolt]
Password: [fra Servebolt]

# Last opp:
wordpress/ → /public_html/
```

**Option B: Via Git**
```bash
# Legg til Servebolt remote (én gang)
git remote add servebolt ssh://user@servebolt.com/path/to/repo

# Deploy
git push servebolt main
```

### 2. Database til Servebolt

```bash
# Eksporter lokal database
wp db export bimverdi-local.sql

# Søk/erstatt URLs (bruk WP-CLI eller plugin)
wp search-replace 'http://localhost:8888/bimverdi/wordpress' 'https://bimverdi.no'

# Importer til Servebolt (via phpMyAdmin eller SSH)
```

### 3. Oppdater wp-config.php på Servebolt

Bruk `wp-config-template.php` som base og oppdater med Servebolt credentials:
- DB_NAME
- DB_USER  
- DB_PASSWORD
- DB_HOST
- JWT_AUTH_SECRET_KEY

### 4. Next.js til Vercel (Frontend)

```bash
cd frontend

# Install Vercel CLI (én gang)
npm i -g vercel

# Deploy
vercel

# Eller koble GitHub repo til Vercel for auto-deploy
```

**Legg til environment variables i Vercel:**
- `NEXT_PUBLIC_WORDPRESS_API_URL=https://bimverdi.no/wp-json`
- `NEXT_PUBLIC_GRAPHQL_ENDPOINT=https://bimverdi.no/graphql`
- `NEXT_PUBLIC_SITE_URL=https://frontend.bimverdi.no`
- `NEXTAUTH_URL=https://frontend.bimverdi.no`
- `NEXTAUTH_SECRET=[generer sterk nøkkel]`

---

## 📋 Pre-deployment Checklist

- [ ] Test alt lokalt først
- [ ] Backup lokal database
- [ ] Eksporter og søk/erstatt URLs i database
- [ ] Oppdater wp-config.php med prod credentials
- [ ] Test API-endepunkter på Servebolt
- [ ] Deploy frontend til Vercel
- [ ] Oppdater DNS records
- [ ] Test CORS mellom frontend og backend
- [ ] Verifiser SSL fungerer
- [ ] Test alle CPT-er og ACF-felt
- [ ] Kjør Lighthouse test

---

## 🔗 Viktige Lenker

**Lokal Utvikling:**
- WordPress: http://localhost:8888/bimverdi/wordpress
- Frontend: http://localhost:3000

**Produksjon:**
- WordPress Admin: https://bimverdi.no/wp-admin
- WordPress API: https://bimverdi.no/wp-json
- Frontend: https://frontend.bimverdi.no
- Servebolt Panel: https://admin.servebolt.com
- Vercel Dashboard: https://vercel.com/dashboard

**Dokumentasjon:**
- Full deployment guide: `SERVEBOLT_DEPLOYMENT.md`
- WordPress setup: `INSTALL_WORDPRESS.md`
- Next steps: `NEXT_STEPS.md`

---

## 🆘 Troubleshooting

**Problem: CORS errors**
→ Sjekk at frontend URL er i $allowed_origins i wp-config.php

**Problem: API returnerer 404**
→ Gå til Innstillinger → Permalenker og klikk "Lagre"

**Problem: Database connection error**
→ Verifiser wp-config.php har riktige Servebolt credentials

**Problem: ACF fields ikke i API**
→ Sjekk at "Show in REST API" er aktivert i ACF field groups

**Problem: Images ikke vises**
→ Verifiser uploads-mappen er lastet opp og har riktige permissions

---

## 📞 Support

- **Servebolt**: support@servebolt.com / +47 22 99 66 99
- **Vercel**: https://vercel.com/support
- **GitHub**: https://github.com/aharstad91/bimverdi

---

**💡 Tips**: Bruk alltid staging environment før produksjon!
