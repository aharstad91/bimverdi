# BIMVerdi - Neste steg

## ✅ Ferdig
- [x] Git repository opprettet og koblet til GitHub
- [x] Next.js frontend oppsett med TypeScript og Tailwind CSS
- [x] Grunnleggende sidestruktur (Header, Footer, Homepage, Min Side)
- [x] WordPress API integrasjon bibliotek
- [x] TypeScript types for alle CPT-er
- [x] .gitignore og miljøvariabler
- [x] Initial commit pushed til GitHub

## 📋 Neste steg - WordPress Backend

### 1. Installer WordPress
```bash
# Last ned WordPress til wordpress/ mappen
# URL: https://wordpress.org/download/
```

1. Opprett database i MAMP phpMyAdmin:
   - Navn: `bimverdi`
   - Collation: `utf8mb4_unicode_ci`
2. Installer WordPress via: http://localhost:8888/bimverdi/wordpress
3. Følg `WORDPRESS_SETUP.md` for detaljert guide

### 2. Installer Required Plugins
- Advanced Custom Fields (ACF) Pro
- WPGraphQL (anbefalt)
- WPGraphQL for ACF
- JWT Authentication for WP REST API
- Custom Post Type UI (eller bruk custom code)

### 3. Sett opp Custom Post Types
- Medlemsbedrifter (`members`)
- Verktøy (`tools`)
- Caser (`cases`)
- Arrangementer (`events`)

Se `WORDPRESS_SETUP.md` for komplett kode.

### 4. Konfigurer ACF Field Groups
Se `WORDPRESS_SETUP.md` for alle felter per CPT.

### 5. Aktiver CORS
Legg til i `wp-config.php` og `functions.php` (se WORDPRESS_SETUP.md)

## 🚀 Neste steg - Frontend Utvikling

### 1. Start Next.js dev server
```bash
cd frontend
npm run dev
```

Frontend vil kjøre på: http://localhost:3000

### 2. Test WordPress-integrasjon
Etter at WordPress er satt opp med test-data:
1. Oppdater `.env.local` med riktig WordPress URL
2. Test API-endepunktene
3. Lag katalog-sider som henter data fra WordPress

### 3. Utvid funksjonalitet
- [ ] Autentisering (NextAuth.js)
- [ ] Min Side med ekte data
- [ ] Katalog-sider (medlemmer, verktøy, caser, arrangementer)
- [ ] Søkefunksjonalitet
- [ ] Innsendings-skjemaer (ACF Forms eller custom)
- [ ] Samtykke-system
- [ ] SEO-optimalisering (metadata, sitemaps)
- [ ] Analytics

## 🛠️ Foreslåtte tilleggspakker

```bash
cd frontend

# Autentisering
npm install next-auth

# Forms
npm install react-hook-form @hookform/resolvers zod

# GraphQL (hvis du bruker WPGraphQL)
npm install @apollo/client graphql

# Datoer
npm install date-fns

# Icons
npm install lucide-react
```

## 📁 Mappestruktur

```
bimverdi/
├── wordpress/                  # WordPress backend (installer her)
│   ├── wp-content/
│   │   ├── themes/
│   │   │   └── bimverdi-theme/ # Custom theme med CPT
│   │   └── plugins/            # ACF, WPGraphQL, etc.
│   └── wp-config.php
│
└── frontend/                   # Next.js frontend
    ├── src/
    │   ├── app/               # App Router pages
    │   │   ├── (public)/      # Offentlige sider
    │   │   ├── (auth)/        # Innloggede sider
    │   │   │   └── min-side/
    │   │   ├── medlemsbedrifter/
    │   │   ├── verktoy/
    │   │   ├── caser/
    │   │   └── arrangementer/
    │   ├── components/
    │   │   ├── layout/
    │   │   ├── members/
    │   │   ├── tools/
    │   │   ├── cases/
    │   │   └── events/
    │   ├── lib/               # Utilities og API
    │   └── types/             # TypeScript types
    └── public/                # Static assets
```

## 🔗 Nyttige lenker

- WordPress REST API: http://localhost:8888/bimverdi/wordpress/wp-json
- Next.js: http://localhost:3000
- GitHub: https://github.com/aharstad91/bimverdi
- phpMyAdmin: http://localhost:8888/phpMyAdmin

## 💡 Tips

1. **Utvikle lokalt først**: Få alt til å fungere i MAMP/localhost før deploy
2. **Test API-et**: Bruk Postman eller browser for å teste WordPress REST API
3. **SEO**: Next.js ISR/SSG er perfekt for SEO - bruk det!
4. **TypeScript**: All type-definisjonene er allerede på plass
5. **Git workflow**: Commit ofte, push til GitHub

## ❓ Spørsmål å diskutere

1. **Autentisering**: JWT tokens eller annen løsning?
2. **GraphQL vs REST**: Vil du bruke WPGraphQL eller REST API?
3. **Hosting**: Hvor skal løsningen hostes? (Vercel for Next.js, WP Engine for WordPress?)
4. **Analytics**: Google Analytics, Matomo, eller annet?
5. **Design system**: Egen design eller bruke Tailwind UI/shadcn?
