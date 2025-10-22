# WordPress Installasjonsveiledning for BIMVerdi

## ✅ Allerede gjort:
- [x] WordPress lastet ned og pakket ut til `wordpress/` mappen
- [x] `wp-config.php` konfigurert med database-innstillinger
- [x] Security keys generert og lagt inn
- [x] Custom theme opprettet med alle CPT-ene
- [x] CORS aktivert for headless setup

## 🚀 Neste steg - Opprett database og installer:

### 1. Opprett database i phpMyAdmin

**Åpne phpMyAdmin:**
```
http://localhost:8888/phpMyAdmin
```

**Database innstillinger:**
- Database navn: `bimverdi`
- Username: `root`
- Password: `root`
- Collation: `utf8mb4_unicode_ci`

**Metode 1 - Via phpMyAdmin GUI:**
1. Gå til http://localhost:8888/phpMyAdmin
2. Klikk "New" i venstre sidebar
3. Database navn: `bimverdi`
4. Collation: `utf8mb4_unicode_ci`
5. Klikk "Create"

**Metode 2 - Via SQL:**
1. Gå til http://localhost:8888/phpMyAdmin
2. Klikk "SQL" tab
3. Lim inn og kjør:
```sql
CREATE DATABASE IF NOT EXISTS bimverdi 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;
```

### 2. Installer WordPress

**Åpne installasjonen:**
```
http://localhost:8888/bimverdi/wordpress/
```

**Installasjonsinfo:**
- Site Title: `BIMVerdi`
- Username: `admin` (eller ditt valg)
- Password: (velg et sterkt passord)
- Email: din epost
- Language: Norsk (Bokmål)

### 3. Aktiver BIMVerdi Theme

1. Logg inn på WordPress admin: http://localhost:8888/bimverdi/wordpress/wp-admin
2. Gå til **Utseende → Temaer**
3. Aktiver **BIMVerdi Theme**

### 4. Installer Required Plugins

Gå til **Tillegg → Legg til nytt** og installer:

**Må ha:**
- [ ] **Advanced Custom Fields (ACF) Pro** 
  - Kjøp lisens eller bruk gratis versjon fra wordpress.org
  - Nødvendig for custom fields
  
- [ ] **WPGraphQL** (anbefalt)
  - For GraphQL API
  - Søk etter "WPGraphQL" i plugin-katalogen
  
- [ ] **WPGraphQL for Advanced Custom Fields**
  - Eksponerer ACF-felt via GraphQL
  
**Valgfrie men nyttige:**
- [ ] **Yoast SEO** - For SEO-optimalisering
- [ ] **JWT Authentication for WP REST API** - For sikker autentisering
- [ ] **Contact Form 7** - For kontaktskjemaer

### 5. Verifiser at Custom Post Types er registrert

Etter å ha aktivert theme, sjekk at du ser disse i venstremenyen:
- 📝 Innlegg (standard WordPress)
- 🏢 Medlemsbedrifter
- 🛠️ Verktøy
- 📊 Caser
- 📅 Arrangementer

### 6. Opprett ACF Field Groups

Gå til **ACF → Field Groups → Add New** og opprett field groups for:

#### Medlemsbedrifter (members)
**Location rule:** Post Type is equal to members

Felt:
- `company_name` (Text)
- `logo` (Image)
- `description` (Textarea)
- `website` (URL)
- `contact_email` (Email)
- `contact_phone` (Text)
- `address` (Text)
- `membership_level` (Select: basic, premium, enterprise)
- `services` (Repeater med Text subfield)

#### Verktøy (tools)
**Location rule:** Post Type is equal to tools

Felt:
- `tool_name` (Text)
- `tool_type` (Select)
- `description` (Textarea)
- `download_link` (URL)
- `documentation_link` (URL)
- `version` (Text)
- `author` (Text)
- `compatibility` (Checkbox)

#### Caser (cases)
**Location rule:** Post Type is equal to cases

Felt:
- `project_name` (Text)
- `client` (Text)
- `year` (Number)
- `challenge` (Textarea)
- `solution` (Textarea)
- `results` (Textarea)
- `technologies` (Repeater)
- `images` (Gallery)
- `related_members` (Relationship → members)
- `related_tools` (Relationship → tools)

#### Arrangementer (events)
**Location rule:** Post Type is equal to events

Felt:
- `event_name` (Text)
- `event_type` (Select: project, arrangement, webinar, conference)
- `start_date` (Date Picker)
- `end_date` (Date Picker)
- `location` (Text)
- `is_online` (True/False)
- `registration_link` (URL)
- `organizer` (Text)
- `max_participants` (Number)
- `current_participants` (Number)

### 7. Opprett test-innhold

Opprett minst 2-3 entries i hver CPT for å teste API-et:
- 3 medlemsbedrifter
- 3 verktøy
- 3 caser
- 3 arrangementer
- 3 artikler (standard posts)

### 8. Test REST API

Åpne disse URL-ene i browseren for å verifisere at API-et fungerer:

**Standard posts:**
```
http://localhost:8888/bimverdi/wordpress/wp-json/wp/v2/posts
```

**Medlemsbedrifter:**
```
http://localhost:8888/bimverdi/wordpress/wp-json/wp/v2/members
```

**Verktøy:**
```
http://localhost:8888/bimverdi/wordpress/wp-json/wp/v2/tools
```

**Caser:**
```
http://localhost:8888/bimverdi/wordpress/wp-json/wp/v2/cases
```

**Arrangementer:**
```
http://localhost:8888/bimverdi/wordpress/wp-json/wp/v2/events
```

Du skal se JSON-data for hvert endepunkt! ✅

### 9. Test GraphQL (hvis du installerte WPGraphQL)

**GraphQL Playground:**
```
http://localhost:8888/bimverdi/wordpress/graphql
```

**Test query:**
```graphql
query GetPosts {
  posts {
    nodes {
      id
      title
      excerpt
      date
    }
  }
  members {
    nodes {
      id
      title
      acf {
        companyName
        website
      }
    }
  }
}
```

### 10. Koble til Next.js frontend

Etter at WordPress er ferdig satt opp:

1. Sjekk at `.env.local` i frontend-mappen har riktig URL:
```
NEXT_PUBLIC_WORDPRESS_API_URL=http://localhost:8888/bimverdi/wordpress/wp-json
```

2. Frontend kjører allerede på: http://localhost:3000

3. Data skal nå flyte fra WordPress til Next.js!

## ✅ Ferdig!

Når alt er satt opp har du:
- ✅ WordPress backend med CPT og ACF
- ✅ REST API / GraphQL eksponert
- ✅ Next.js frontend klar til å konsumere data
- ✅ CORS konfigurert for headless setup

## 🚨 Troubleshooting

**Problem: Database connection error**
- Sjekk at MAMP kjører
- Verifiser database `bimverdi` eksisterer i phpMyAdmin
- Sjekk at username/password er `root/root`

**Problem: REST API returnerer 404**
- Gå til **Innstillinger → Permalenker** og klikk "Lagre endringer"
- Dette refresher rewrite rules

**Problem: ACF fields vises ikke i API**
- Installer "WPGraphQL for Advanced Custom Fields" plugin
- Sjekk at ACF field groups har riktig location rules

**Problem: CORS errors fra Next.js**
- Sjekk at `functions.php` i theme har CORS headers
- Sjekk at `wp-config.php` har JWT settings
