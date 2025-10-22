# BIMVerdi.no

Headless WordPress løsning for BIMVerdi - Norsk plattform for BIM-verdiskapning.

**Produksjon**: Hosted på Servebolt.com

## Arkitektur

- **Backend**: WordPress (Servebolt i prod, MAMP lokalt) med ACF + Custom Post Types
- **Frontend**: Next.js (React) med TypeScript (Vercel anbefalt)
- **API**: WordPress REST API / WPGraphQL

## Struktur

```
bimverdi/
├── wordpress/     # WordPress backend (CMS)
└── frontend/      # Next.js frontend (SSR/SSG)
```

## Funksjonalitet

### Offentlig side
- Artikler
- Medlemsbedrifter (katalog)
- Verktøy (katalog)
- Caser (katalog)
- Prosjekter/Arrangementer
- SEO-optimalisert (ISR/SSG)

### Min Side (innlogget)
- Selvbetjening
- Profilstyring
- Samtykker
- Innsendings-/redigeringsskjema
- Oversikt over eget innhold

## Setup

### WordPress Backend
1. Installer WordPress i `wordpress/` mappen via MAMP
2. Installer plugins:
   - Advanced Custom Fields (ACF) Pro
   - WPGraphQL (anbefalt)
   - Custom Post Type UI (eller custom code)
   - JWT Authentication

### Next.js Frontend
```bash
cd frontend
npm install
npm run dev
```

## Custom Post Types (CPT)

- **Medlemsbedrifter** (members)
- **Verktøy** (tools)
- **Caser** (cases)
- **Prosjekter/Arrangementer** (events)
- **Artikler** (posts - standard WP)

## Miljøvariabler

Se `.env.example` i hver mappe for påkrevde variabler.

## Utvikling

- WordPress lokal: http://localhost:8888/bimverdi/wordpress
- Next.js lokal: http://localhost:3000

## Produksjon

Se **SERVEBOLT_DEPLOYMENT.md** for detaljert deployment guide.

### Hosting
- **WordPress**: Servebolt.com
- **Next.js**: Vercel (anbefalt) eller Servebolt
- **Database**: Servebolt MySQL
- **CDN**: Servebolt Accelerated Domains
