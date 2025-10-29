# BimVerdi Member Article System - TODO Plan (OPPDATERT)
## Tilnærming: REST API + React-Quill WYSIWYG

**Status:** Planning phase - Phase 0 beslutninger tatt
**Estimated Total Time:** 24-28 hours over 3-4 days
**Priority:** High (arrangement system fullført)
**Last Updated:** Oktober 29, 2025

---

## 🎯 PHASE 0 DECISIONS (Tatt: 29. oktober 2025)

### ✅ Decision 1: WYSIWYG Editor = **React-Quill**
**Begrunnelse:** Lightweight (~50KB), enkel implementering, opprettholder funksjonalitet
- **Valg:** React-Quill
- **Forkastet:** Plate.js (for kompleks), Tiptap (middels kompleks)
- **Features:** Bold, Italic, Underline, Headers, Lists, Links, Images, Quotes
- **Plugins:** `react-quill` + `quill-image-uploader` for media library

### ❓ Decision 2: Autentisering
**Status:** MÅ UNDERSØKES
- **Spørsmål:** Hvordan fungerer iron-session med WordPress REST API?
- **Action:** Test custom endpoint med session-autentisering
- **Fallback:** JWT token via cookie hvis iron-session ikke fungerer

### ✅ Decision 3: Arkitektur = **Egen CPT (ikke konverter til post)**
**Begrunnelse:** Enklere, ingen duplisering, bedre separasjon
- **CPT:** `bv_member_article` (egen post type)
- **Publishing:** Admin godkjenner → endre `post_status` fra 'draft' til 'publish'
- **IKKE:** Konverter til regular `post` - behold som `bv_member_article`
- **Fordel:** Original submission beholdes, all metadata intakt, enklere queries

### ❓ Decision 4: User Meta for Company Linking
**Status:** MÅ UNDERSØKES
- **Spørsmål:** Eksisterer `_bimverdi_company` user meta i nåværende system?
- **Action:** Sjekk database, verifiser relasjon bruker → bedrift
- **Hvis mangler:** Opprett user meta-felt i bimverdi-user-management plugin

---

## FASE 0: Prerequisites & Verification (2-3 hours) ⭐ STARTER HER

### 0.1 React-Quill Setup Test
- [ ] `cd frontend && npm install react-quill quill-image-uploader`
- [ ] Test bundle size impact: `npm run build` (mål: <100KB økning)
- [ ] Opprett test-komponent: `components/TestQuillEditor.tsx`
- [ ] Verifiser: Bold, italic, headers, lists, links fungerer
- [ ] Test image upload til WordPress media library
- [ ] Test på mobil (iPhone Safari + Android Chrome)
- [ ] **Decision checkpoint:** Er React-Quill OK? (Hvis nei → vurder React-Draft-Wysiwyg)

### 0.2 Authentication Verification
- [ ] Opprett test REST endpoint: `/wp-json/bimverdi/v1/test-auth`
- [ ] Test 1: Call endpoint fra Next.js med iron-session cookie
- [ ] Test 2: Verifiser at WordPress kan lese session data
- [ ] Test 3: Sjekk user_id fra session
- [ ] **If SUCCESS:** Implementer `verify_bimverdi_session()` helper i plugin
- [ ] **If FAIL:** Implementer JWT token fallback via cookie
- [ ] Dokumenter løsning i `docs/AUTH_STRATEGY.md`

### 0.3 User Meta & Company Linking Check
- [ ] Query database: `SELECT user_id, meta_key, meta_value FROM wp_usermeta WHERE meta_key LIKE '%company%'`
- [ ] Verifiser: Finnes `_bimverdi_company` eller lignende?
- [ ] Test query: Hent bedrift for test-bruker `andreas@aharstad.no`
- [ ] **If MISSING:**
  - [ ] Opprett ACF user field: `company_id` (relationship til `deltaker` CPT)
  - [ ] Oppdater registrerings-flow for å sette company
  - [ ] Backfill existing users (hvis nødvendig)
- [ ] Dokumenter user meta structure i `docs/USER_META_SCHEMA.md`

### 0.4 Database Schema Planning
- [ ] Design `bv_member_article` post type schema
- [ ] Plan ACF field groups (se FASE 1.2)
- [ ] Plan taxonomy structure
- [ ] **Decision:** Trenger vi egen tabell for article metadata? (Sannsynligvis NEI - ACF holder)

---

## FASE 1: Database & WordPress Backend Setup (4-5 hours)

### 1.1 Custom Post Type og Taxonomy
**Fil:** `/wp-content/plugins/bimverdi-article/inc/article-cpt.php`

```php
// bv_member_article CPT
- [ ] Opprett CPT `bv_member_article`
  - [ ] Slug: `member-article`
  - [ ] Labels: 'Medlemsartikler', 'Medlemsartikkel'
  - [ ] Supports: title, editor, thumbnail, excerpt, author
  - [ ] Hierarchical: false
  - [ ] Public: true (men kun vises for members)
  - [ ] Publicly queryable: true
  - [ ] Show in REST: true
  - [ ] REST base: 'member-articles'
  - [ ] Menu icon: 'dashicons-edit-large'
  - [ ] Menu position: 5 (under Posts)
  - [ ] Capabilities: Custom (kun bimverdi_customer kan create)

// Taxonomies
- [ ] `article_status` (hierarkisk)
  - [ ] Terms: 'pending', 'approved', 'rejected', 'published', 'archived'
  - [ ] Non-public (kun admin ser)

- [ ] `article_category` (ikke-hierarkisk, tags)
  - [ ] Terms: 'Case Study', 'Best Practice', 'Nyhet', 'Tutorial', 'Teknologi'
  - [ ] Public, vises i REST
  - [ ] Knyttet til både `bv_member_article` og `post`
```

### 1.2 ACF Field Groups
**Fil:** Via WP Admin eller `inc/acf-fields.php`

```php
// GROUP 1: Grunninfo (bv_member_article)
- [ ] article_content_html (wysiwyg/textarea) - HTML fra React-Quill
- [ ] article_excerpt (textarea, max 200 char)
- [ ] article_featured_image (image) - Featured image

// GROUP 2: Metadata (automatisk)
- [ ] article_author_name (text, read-only) - Fra user display_name
- [ ] article_author_company (text, read-only) - Fra company user meta
- [ ] article_submission_date (date, auto) - Submission timestamp
- [ ] article_word_count (number, auto) - Word count fra HTML

// GROUP 3: Godkjenning (kun admin)
- [ ] review_status (select) - pending/approved/rejected/published
- [ ] reviewer_id (user) - Admin som godkjente
- [ ] reviewer_notes (textarea) - Feedback til forfatter
- [ ] review_date (date, auto) - Godkjennings-tidspunkt
- [ ] published_date (date, auto) - Når den ble published

// GROUP 4: Rate Limiting (hidden)
- [ ] user_submission_count_month (number) - Cached count
- [ ] last_submission_date (date) - For rate limit check
```

### 1.3 Helper Functions
**Fil:** `/inc/article-functions.php`

```php
// Verification & Validation
- [ ] bv_verify_user_can_submit()
  - Sjekk: User logged in?
  - Sjekk: User role = bimverdi_customer?
  - Sjekk: Rate limit OK? (max 5 per month)
  - Return: true/false + error message

- [ ] bv_check_duplicate_title($title, $user_id)
  - Query: Samme tittel eksisterer for bruker?
  - Return: true hvis duplikat

- [ ] bv_get_user_submission_count($user_id, $period = 'month')
  - Count posts av type bv_member_article for user
  - Filter: Siste 30 dager
  - Return: integer

// Article CRUD
- [ ] bv_create_member_article($data)
  - Input: ['title', 'excerpt', 'content_html', 'category', 'user_id']
  - Create post: post_type='bv_member_article', post_status='draft'
  - Set ACF fields: author_name, company, submission_date
  - Set taxonomy: article_status='pending'
  - Send email: Til member (confirmation) + admin (ny submission)
  - Return: post_id eller WP_Error

- [ ] bv_get_member_articles_by_user($user_id, $status = 'all')
  - Query: posts by user_id, optionally filter by status
  - Return: Array of post objects with meta

- [ ] bv_approve_article($article_id, $reviewer_id)
  - Update: review_status='approved'
  - Update: reviewer_id, review_date
  - Update: post_status='publish' (🎯 endring fra original plan)
  - Update: published_date=now()
  - Send email: Til forfatter (gratulerer)
  - Return: true/false

- [ ] bv_reject_article($article_id, $reviewer_id, $notes)
  - Update: review_status='rejected'
  - Update: reviewer_notes=$notes
  - Send email: Til forfatter (feedback)
  - Return: true/false

// Company Linking
- [ ] bv_get_company_id_by_user($user_id)
  - Get user meta: _bimverdi_company eller company_id
  - Return: company post_id eller null

- [ ] bv_get_company_articles($company_id)
  - Query: bv_member_article posts med post_status='publish'
  - Meta query: company_id = $company_id
  - Order: DESC by published_date
  - Return: Array av artikler

// Image Security
- [ ] bv_enforce_image_restrictions()
  - Hook: upload_mimes filter
  - Allowed: jpg, jpeg, png, webp, gif
  - Max size: 5MB
  - Max dimensions: 2000x2000px
  - Return: Restricted mime types
```

### 1.4 Custom REST API Endpoints
**Fil:** `/inc/article-rest-api.php`

```php
// Register routes
register_rest_route('bimverdi/v1', '/member-articles', [
  'methods' => 'POST',
  'callback' => 'bv_rest_submit_article',
  'permission_callback' => 'bv_rest_check_auth'
]);

// Endpoints:
- [ ] POST /wp-json/bimverdi/v1/member-articles
  - Auth: verify_bimverdi_session() (fra FASE 0.2)
  - Validate: bv_verify_user_can_submit()
  - Check: bv_check_duplicate_title()
  - Create: bv_create_member_article()
  - Return: { success, article_id, message }

- [ ] GET /wp-json/bimverdi/v1/member-articles/my-articles
  - Auth: Required
  - Get: bv_get_member_articles_by_user(current_user_id)
  - Return: [{ id, title, status, submission_date, review_notes }]

- [ ] GET /wp-json/bimverdi/v1/member-articles/{id}
  - Auth: Required (kun forfatter eller admin)
  - Get: Full article med ACF fields
  - Return: { id, title, excerpt, content_html, status, category, dates }

- [ ] PUT /wp-json/bimverdi/v1/member-articles/{id}
  - Auth: Required (kun forfatter, kun hvis status != 'published')
  - Update: title, excerpt, content_html, category
  - Return: { success, message }

- [ ] DELETE /wp-json/bimverdi/v1/member-articles/{id}
  - Auth: Required (kun forfatter, kun hvis status = 'draft')
  - Delete: wp_delete_post()
  - Return: { success, message }

- [ ] GET /wp-json/bimverdi/v1/companies/{company_id}/articles
  - Auth: None (public articles)
  - Get: bv_get_company_articles($company_id)
  - Return: [{ id, title, excerpt, featured_image, published_date }]

// Auth middleware
- [ ] bv_rest_check_auth($request)
  - Implementasjon basert på FASE 0.2 beslutning
  - Check: iron-session ELLER JWT token
  - Return: true hvis OK, WP_Error hvis ikke
```

---

## FASE 2: Frontend - Min Side Artikkel-Komponent (6-8 hours)

### 2.1 React-Quill WYSIWYG Setup
**Fil:** `frontend/components/articles/ArticleEditor.tsx`

```tsx
'use client';
import dynamic from 'next/dynamic';
import { useState } from 'react';

// Dynamic import for SSR compatibility
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

- [ ] Install: `npm install react-quill quill-image-uploader`
- [ ] Konfigurer toolbar:
  - Bold, Italic, Underline
  - H2, H3 (header dropdown)
  - Bullet list, Numbered list
  - Link, Image
  - Blockquote
  - Clean formatting

- [ ] Modules:
  - [ ] `quill-image-uploader` for image upload til WordPress
  - [ ] Character counter (max 10000 plain text)
  - [ ] Word counter (display only)

- [ ] Auto-save:
  - [ ] localStorage backup hver 30 sek
  - [ ] Toast melding: "Kladd lagret"

- [ ] Styling:
  - [ ] Custom CSS for Tailwind integration
  - [ ] Mobile-optimized (touch-friendly buttons)
  - [ ] Dark mode support? (vurder)

- [ ] Props:
  interface ArticleEditorProps {
    value: string;
    onChange: (html: string) => void;
    placeholder?: string;
    maxLength?: number;
  }
```

### 2.2 ArticleForm Component
**Fil:** `frontend/components/articles/ArticleForm.tsx`

```tsx
'use client';
import { useState, useEffect } from 'react';
import { ArticleEditor } from './ArticleEditor';
import { useSession } from '@/lib/session'; // Bruker iron-session

- [ ] State management:
  - title, excerpt, content, category, featuredImage
  - isSubmitting, errors, successMessage
  - draftSaved, wordCount, charCount

- [ ] Form fields:
  - [ ] Input: Title (required, max 100 char)
    - Blur handler: Check duplicate title
    - Error: "En artikkel med denne tittelen eksisterer allerede"

  - [ ] Textarea: Excerpt (required, max 200 char, 2-3 setninger)
    - Character counter
    - Help text: "Kort oppsummering som vises i lister"

  - [ ] ArticleEditor: Content (required, max 10000 words)
    - Word counter
    - Auto-save to localStorage

  - [ ] Select: Category
    - Options: Case Study, Best Practice, Nyhet, Tutorial, Teknologi

  - [ ] Image upload: Featured image (optional)
    - Preview
    - Max 5MB, jpg/png/webp

- [ ] Preview Toggle:
  - [ ] Button: "Forhåndsvisning"
  - [ ] Modal: Vis som publisert artikkel
  - [ ] Safe HTML rendering: DOMPurify

- [ ] Validation:
  - [ ] Check rate limit BEFORE submit (client-side warning)
  - [ ] Check all required fields
  - [ ] Check duplicate title

- [ ] Buttons:
  - [ ] "Lagre kladd" (grå) - POST med status='draft'
  - [ ] "Send inn til godkjenning" (blå) - POST med status='pending'
  - [ ] "Avbryt" (hvit) - Confirmation hvis har innhold

- [ ] Error handling:
  - [ ] API errors display
  - [ ] Network error: "Kunne ikke nå server, kladd lagret lokalt"
  - [ ] Validation errors inline

- [ ] Success:
  - [ ] Toast: "Artikkel sendt til godkjenning!"
  - [ ] Clear form
  - [ ] Redirect til "Mine artikler"
```

### 2.3 ArticlesList Component
**Fil:** `frontend/components/articles/ArticlesList.tsx`

```tsx
- [ ] Fetch: GET /api/articles/my-articles
- [ ] Display: Table eller card layout
  - [ ] Kolonne: Tittel (link til edit)
  - [ ] Kolonne: Status (badge med farge)
    - Draft: Grå
    - Pending: Gul
    - Approved: Grønn
    - Rejected: Rød
    - Published: Blå
  - [ ] Kolonne: Sendt inn (dato)
  - [ ] Kolonne: Handlinger
    - [ ] [Rediger] (kun draft/rejected)
    - [ ] [Slett] (kun draft)
    - [ ] [Vis publisert] (kun published)

- [ ] Reviewer notes:
  - [ ] Collapsible hvis rejected
  - [ ] Styled som feedback-boks

- [ ] Empty state:
  - Icon + tekst: "Du har ikke sendt inn noen artikler ennå"
  - CTA: Link til "Skriv ny artikkel"

- [ ] Loading state:
  - Skeleton cards

- [ ] Error state:
  - Retry button
```

### 2.4 Min Side Integration
**Fil:** `frontend/app/(authenticated)/minside/page.tsx`

```tsx
- [ ] Ny section: "Mine Artikler" (tabs eller accordion)

- [ ] Tab 1: "Mine innsendte artikler"
  - [ ] <ArticlesList />
  - [ ] Summary stats:
    - "Sendt inn: X"
    - "Publisert: X"
    - "Avventer godkjenning: X"
    - "Gjenværende denne måneden: X av 5"

- [ ] Tab 2: "Skriv ny artikkel"
  - [ ] <ArticleForm />
  - [ ] Info-box: "Artikler gjennomgås av redaksjonen innen 2-3 virkedager"
```

### 2.5 Article Detail Page (public)
**Fil:** `frontend/app/artikler/[slug]/page.tsx`

```tsx
- [ ] Dynamic route for published articles
- [ ] Fetch: GET /wp-json/wp/v2/member-articles/{slug}
- [ ] Display:
  - [ ] Hero image (featured)
  - [ ] Title (H1)
  - [ ] Meta: Author, Company (link), Published date
  - [ ] Content (rendered HTML, sanitized)
  - [ ] Author box:
    - Company logo
    - "Skrevet av [navn] fra [bedrift]"
    - Link til bedriftsprofil

- [ ] SEO:
  - [ ] Meta description fra excerpt
  - [ ] og:image fra featured image
  - [ ] Canonical URL
```

### 2.6 TypeScript Types
**Fil:** `frontend/types/articles.ts`

```ts
export interface MemberArticle {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string; // HTML
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'published';
  category: string;
  featuredImage?: {
    url: string;
    alt: string;
  };
  author: {
    id: number;
    name: string;
    company: string;
    companyId: number;
  };
  dates: {
    submitted?: string;
    reviewed?: string;
    published?: string;
  };
  reviewer?: {
    id: number;
    notes?: string;
  };
  wordCount: number;
}

export interface ArticleSubmission {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  featuredImageId?: number;
}

export interface ArticleResponse {
  success: boolean;
  articleId?: number;
  message: string;
  error?: string;
}
```

---

## FASE 3: Godkjennings-Workflow & Admin (4-5 hours)

### 3.1 WordPress Admin Interface
**Fil:** `/inc/article-admin.php`

```php
- [ ] Custom admin page: "Godkjenn Medlemsartikler"
  - Menu: Under "Medlemsartikler" CPT
  - Capability: edit_others_posts

- [ ] Admin page content:
  - [ ] Filter: Status dropdown (pending/approved/rejected/all)
  - [ ] Table columns:
    - Forfatter
    - Bedrift (link)
    - Tittel (link til preview)
    - Kategori
    - Sendt inn (dato)
    - Handling (dropdown)

- [ ] Inline actions:
  - [ ] "Forhåndsvis" - Modal med article preview
  - [ ] "Godkjenn" - Quick approve (1 click)
  - [ ] "Avvis" - Modal for reviewer notes
  - [ ] "Rediger" - WP editor for minor changes

- [ ] Bulk actions:
  - [ ] "Godkjenn valgte"
  - [ ] "Avvis valgte"

- [ ] "Godkjenn"-button flow:
  - [ ] Confirmation: "Sikker? Artikkel publiseres."
  - [ ] Call: bv_approve_article($id, $current_user_id)
  - [ ] Trigger: Email til forfatter
  - [ ] Redirect: Back to list eller next pending
  - [ ] Notice: "Artikkel godkjent og publisert!"

- [ ] "Avvis"-modal:
  - [ ] Textarea: Reviewer notes (required, min 20 char)
  - [ ] Checkbox options (optional):
    - [ ] "Mangler kilder"
    - [ ] "For kort innhold"
    - [ ] "Ikke relevant for målgruppe"
    - [ ] "Grammatikk/stavefeil"
  - [ ] Submit: Call bv_reject_article()
```

### 3.2 Email Notifications
**Fil:** `/inc/article-emails.php`

```php
// Email infrastructure
- [ ] Check: WP Mail SMTP plugin aktivert?
- [ ] Test: Send test email til post@bimverdi.no
- [ ] Consider: Transactional email service (SendGrid API?)

// Template 1: Submission confirmation (til medlem)
- [ ] Trigger: bv_create_member_article()
- [ ] To: Forfatter email
- [ ] Subject: "Din artikkel er mottatt - BimVerdi"
- [ ] Body:
  - Takk for innsendelse
  - Tittel: [article_title]
  - Status: Under vurdering
  - Estimert tid: 2-3 virkedager
  - Link til "Mine artikler"

// Template 2: Approval (til medlem)
- [ ] Trigger: bv_approve_article()
- [ ] To: Forfatter email
- [ ] Subject: "Din artikkel er publisert! 🎉"
- [ ] Body:
  - Gratulerer!
  - Link til publisert artikkel
  - "Del på LinkedIn/Facebook"
  - Takk for bidrag

// Template 3: Rejection (til medlem)
- [ ] Trigger: bv_reject_article()
- [ ] To: Forfatter email
- [ ] Subject: "Din artikkel trenger revisjon - BimVerdi"
- [ ] Body:
  - Takk for innsendelse
  - Tilbakemelding fra redaksjonen: [reviewer_notes]
  - "Du kan redigere og sende inn på nytt"
  - Link til edit-siden

// Template 4: New submission (til admin)
- [ ] Trigger: bv_create_member_article()
- [ ] To: post@bimverdi.no
- [ ] Subject: "Ny medlemsartikkel venter godkjenning"
- [ ] Body:
  - Forfatter: [name] fra [company]
  - Tittel: [title]
  - Kategori: [category]
  - Ordtelling: [word_count]
  - Link til admin godkjennings-side

// Email preview function
- [ ] bv_preview_email($template, $data)
  - For testing i wp-admin
  - Vis HTML-preview uten å sende
```

---

## FASE 4: Automatisk Linking til Bedriftsprofil (2-3 hours)

### 4.1 Article-to-Company Metadata
**Fil:** `/inc/article-company-linking.php`

```php
// Hook: Når artikkel publiseres
- [ ] add_action('publish_bv_member_article', 'bv_link_article_to_company')
- [ ] function bv_link_article_to_company($post_id)
  - Get post_author (user_id)
  - Get company_id: bv_get_company_id_by_user($user_id)
  - Set post meta: _bimverdi_company_id = $company_id
  - Set post meta: _bimverdi_original_author_id = $user_id

// Query helper
- [ ] bv_get_company_articles($company_id, $limit = 10)
  - WP_Query:
    - post_type: 'bv_member_article'
    - post_status: 'publish'
    - meta_query: _bimverdi_company_id = $company_id
    - orderby: published_date DESC
    - posts_per_page: $limit
  - Return: Array of posts
```

### 4.2 REST Endpoint for Company Articles
**Fil:** `/inc/article-rest-api.php` (add to existing)

```php
- [ ] GET /wp-json/bimverdi/v1/companies/{company_id}/articles
  - No auth required (public)
  - Call: bv_get_company_articles($company_id, 10)
  - Return: [{
      id,
      title,
      excerpt,
      featured_image,
      author_name,
      published_date,
      slug (for link)
    }]
```

### 4.3 Bedriftsprofil Frontend Update
**Fil:** `frontend/app/deltakere/[slug]/page.tsx`

```tsx
- [ ] Fetch: GET /api/companies/{id}/articles
- [ ] Ny section: "Artikler fra denne bedriften"
  - [ ] If no articles: Vis ingenting (ikke tom section)
  - [ ] If articles:
    - [ ] Heading: "Artikler fra [bedriftsnavn]"
    - [ ] Card layout (max 3 artikler):
      - Featured image
      - Tittel (H3, link)
      - Excerpt (2 linjer)
      - Publisert dato
      - "Les mer →"
    - [ ] Link: "Se alle artikler" (hvis flere enn 3)
      - Goes to: /artikler?company={id}
```

### 4.4 Article Archive Page
**Fil:** `frontend/app/artikler/page.tsx`

```tsx
- [ ] Public page: List all published member articles
- [ ] Query params: ?company={id}, ?category={slug}
- [ ] Fetch: GET /wp-json/wp/v2/member-articles?status=publish
- [ ] Grid layout: 3 kolonner desktop, 1 kolonne mobil
- [ ] Filters:
  - [ ] Dropdown: Kategori
  - [ ] Dropdown: Bedrift (hvis ?company)
  - [ ] Search: Tittel/innhold

- [ ] Pagination: 12 artikler per side
- [ ] SEO: Meta title, description
```

---

## FASE 5: Redigering & Sletting (2-3 hours)

### 5.1 Edit Article Flow
**Fil:** `frontend/components/articles/EditArticleForm.tsx`

```tsx
- [ ] Load existing: GET /api/articles/my-articles/{id}
- [ ] Pre-fill: All form fields (title, excerpt, content, category, image)
- [ ] Permission check:
  - [ ] Kun forfatter kan redigere
  - [ ] Kun hvis status = 'draft' ELLER 'rejected'
  - [ ] Hvis published: Vis "Kan ikke redigere publiserte artikler"

- [ ] Changes tracking:
  - [ ] Track dirty state
  - [ ] Warning hvis forlater side med usaved changes

- [ ] Submit:
  - [ ] PUT /api/articles/my-articles/{id}
  - [ ] If draft → Kan "lagre" eller "send inn"
  - [ ] If rejected → Kun "send inn på nytt" (endrer til pending)

- [ ] Success: Redirect to "Mine artikler"
```

### 5.2 Delete Article Flow
**Fil:** `frontend/components/articles/ArticlesList.tsx` (add action)

```tsx
- [ ] Delete button: Kun synlig hvis status = 'draft'
- [ ] Confirmation modal:
  - "Er du sikker? Dette kan ikke angres."
  - Input: Skriv "SLETT" for å bekrefte

- [ ] API call: DELETE /api/articles/my-articles/{id}
- [ ] Success:
  - Remove from list (optimistic update)
  - Toast: "Artikkel slettet"
```

### 5.3 Re-review Request (ny feature)
**Fil:** Add to EditArticleForm

```tsx
- [ ] If status = 'rejected':
  - [ ] Button: "Send inn på nytt"
  - [ ] Disabled hvis ingen endringer gjort
  - [ ] On submit:
    - PUT med updated content
    - Backend: Endrer status til 'pending'
    - Trigger: Email til admin (ny innsendelse etter revisjon)
  - [ ] Success: "Sendt til ny vurdering"
```

---

## FASE 6: Testing & Dokumentasjon (3-4 hours)

### 6.1 Manual Testing Checklist

**Scenario 1: Submit Article (Happy Path)**
- [ ] Login som medlem (andreas@aharstad.no)
- [ ] Go to Min Side → Mine Artikler → Skriv ny
- [ ] Fill form:
  - Title: "Test-artikkel: BIM i praksis"
  - Excerpt: "En kort beskrivelse av hvordan vi bruker BIM"
  - Content: 500 ord med formatting, bilder
  - Category: Case Study
  - Image: Upload featured image
- [ ] Click "Send inn til godkjenning"
- [ ] Verify:
  - ✅ Success message
  - ✅ Email mottatt (confirmation)
  - ✅ Email til admin (post@bimverdi.no)
  - ✅ Article vises i "Mine artikler" med status "Pending"

**Scenario 2: Admin Approval**
- [ ] Login som admin
- [ ] Go to WP Admin → Godkjenn Medlemsartikler
- [ ] Verify: Test-artikkel vises i lista
- [ ] Click "Forhåndsvis" → Verify formatering OK
- [ ] Click "Godkjenn"
- [ ] Verify:
  - ✅ Article status endres til "Published"
  - ✅ Email sendt til forfatter (approval)
  - ✅ Article vises på /artikler
  - ✅ Article vises på bedriftsprofil

**Scenario 3: Rejection & Re-submit**
- [ ] Submit ny artikkel
- [ ] Admin avviser med notes: "Mangler kilder"
- [ ] Verify:
  - ✅ Email mottatt (rejection)
  - ✅ Status = "Rejected" i "Mine artikler"
  - ✅ Reviewer notes synlige
- [ ] Click "Rediger"
- [ ] Add sources, make changes
- [ ] Click "Send inn på nytt"
- [ ] Verify:
  - ✅ Status endres til "Pending"
  - ✅ Email til admin (re-submission)

**Scenario 4: Rate Limiting**
- [ ] Submit 5 articles in quick succession
- [ ] Try submitting 6th article
- [ ] Verify:
  - ✅ Error message: "Du har nådd grensen for denne måneden (5 artikler)"
  - ✅ Counter viser "0 av 5 gjenværende"

**Scenario 5: Mobile Experience**
- [ ] Test på iPhone Safari:
  - [ ] React-Quill editor fungerer
  - [ ] Toolbar buttons er touch-friendly
  - [ ] Image upload fungerer
  - [ ] Preview fungerer
- [ ] Test på Android Chrome:
  - [ ] Same checks as iPhone

**Scenario 6: Image Upload Security**
- [ ] Try upload .exe file → Verify rejected
- [ ] Try upload 10MB image → Verify rejected (max 5MB)
- [ ] Upload 3000x3000px image → Verify resized eller rejected
- [ ] Upload valid image → Verify OK

**Scenario 7: Duplicate Title**
- [ ] Submit article: "Min første artikkel"
- [ ] Try submit another: "Min første artikkel"
- [ ] Verify:
  - ✅ Warning message on blur: "En artikkel med denne tittelen eksisterer"
  - ✅ Submit button disabled

### 6.2 Performance Testing

**Bundle Size**
- [ ] Run: `cd frontend && npm run build`
- [ ] Check: React-Quill impact på bundle
- [ ] Target: <100KB increase
- [ ] If >100KB: Consider code splitting

**Page Load Times**
- [ ] /minside (with ArticleForm): Target <2s
- [ ] /artikler (archive): Target <1.5s
- [ ] /artikler/[slug] (single): Target <1s

**Form Submission**
- [ ] Submit with 5000 words + 3 images
- [ ] Target: <3s total time
- [ ] Monitor: Network tab, payloads

**Image Upload**
- [ ] Upload 5MB image
- [ ] Target: <5s with progress indicator
- [ ] Verify: Image optimized on server

### 6.3 Security Testing

**XSS Prevention**
- [ ] In React-Quill: Try inject `<script>alert('xss')</script>`
- [ ] Verify: Stripped eller escaped
- [ ] In excerpt: Try inject `<img src=x onerror=alert('xss')>`
- [ ] Verify: Stripped

**Authentication Bypass**
- [ ] Logout
- [ ] Try: POST /wp-json/bimverdi/v1/member-articles
- [ ] Verify: 401 Unauthorized

**Role Escalation**
- [ ] Login som subscriber (ikke bimverdi_customer)
- [ ] Try submit article
- [ ] Verify: Error "Du må være medlem for å sende inn artikler"

**CSRF Protection**
- [ ] Verify: All REST endpoints use WP nonce eller JWT
- [ ] Test: Call endpoint med missing/invalid nonce
- [ ] Verify: 403 Forbidden

### 6.4 Email Delivery Testing

**SMTP Configuration**
- [ ] Verify: WP Mail SMTP plugin configured
- [ ] Test send: To post@bimverdi.no
- [ ] Verify: Email arrives in inbox (not spam)

**Email Templates**
- [ ] Test all 4 templates:
  - Submission confirmation
  - Approval
  - Rejection
  - Admin notification
- [ ] Check: Links work, formatting OK
- [ ] Test: Gmail, Outlook, Apple Mail clients

### 6.5 Documentation

**Fil:** `docs/MEMBER_ARTICLE_SYSTEM.md`
- [ ] System overview
- [ ] Architecture diagram
- [ ] User flow (medlem perspective)
- [ ] Admin flow (godkjenning)
- [ ] API documentation
- [ ] Troubleshooting guide

**Fil:** `docs/USER_GUIDE_ARTICLES.md` (for medlemmer)
- [ ] How to write an article
- [ ] Formatting tips
- [ ] Image guidelines
- [ ] What gets approved vs rejected
- [ ] FAQ

**Fil:** `docs/ADMIN_GUIDE_ARTICLES.md` (for redaksjon)
- [ ] How to review articles
- [ ] Approval criteria
- [ ] How to give feedback
- [ ] Email notifications
- [ ] Troubleshooting

---

## FASE 7: Videreutvikling (Backlog - Future)

### 7.1 Analytics & Reporting
- [ ] Track: Articles submitted per month
- [ ] Track: Approval rate (%)
- [ ] Track: Average review time (hours)
- [ ] Track: Most active companies (by article count)
- [ ] Dashboard widget: "Pending reviews: X"

### 7.2 Notification Improvements
- [ ] In-app notification på Min Side (ved godkjenning)
- [ ] Browser push notifications (opt-in)
- [ ] SMS varsling til admin (Twilio) ved submission
- [ ] Slack webhook til #redaksjon kanal

### 7.3 SEO & Metadata
- [ ] Auto-generate meta description fra excerpt
- [ ] og:image for social sharing (featured image)
- [ ] Schema.org markup (Article, BlogPosting)
- [ ] Sitemap: Include member-articles
- [ ] Canonical URLs

### 7.4 Content Enhancements
- [ ] Co-authors: Flere forfattere per artikkel
- [ ] Series/Collections: Gruppere relaterte artikler
- [ ] Related articles: Basert på kategori/company
- [ ] Article revisions: Full versjon-historikk (WP native)

### 7.5 Member Recognition
- [ ] "Contributors" page: Vis alle bedrifter som har publisert
- [ ] Badge på bedriftsprofil: "Aktiv bidragsyter" (hvis >3 artikler)
- [ ] Leaderboard: Top 10 mest aktive bedrifter
- [ ] "Article of the Month" feature

### 7.6 Advanced WYSIWYG
- [ ] Embed YouTube/Vimeo videos
- [ ] Tables
- [ ] Code blocks (syntax highlighting)
- [ ] File attachments (PDF downloads)

---

## 🛠️ Implementation Notes

### Technology Stack
- **Frontend:** Next.js 16, React 19, TypeScript 5, Tailwind CSS
- **WYSIWYG:** React-Quill (~50KB)
- **Backend:** WordPress 6.x, PHP 8.3, ACF Pro
- **API:** WordPress REST API, custom endpoints
- **Auth:** iron-session (verification in Phase 0)
- **Emails:** wp_mail() via WP Mail SMTP plugin

### Database Schema
- **CPT:** `bv_member_article` (not converted to regular post)
- **Taxonomies:** `article_status`, `article_category`
- **Post Meta:** `_bimverdi_company_id`, `_bimverdi_original_author_id`
- **User Meta:** `_bimverdi_company` or `company_id` (verify in Phase 0)
- **ACF Fields:** Attached to `bv_member_article` CPT

### Key Architectural Decisions
1. ✅ **React-Quill** over Plate.js (lightweight, simple)
2. ✅ **Separate CPT** - NOT converted to regular post (simpler, no duplication)
3. ❓ **Auth strategy** - iron-session vs JWT (decide in Phase 0)
4. ❓ **User-Company linking** - verify user meta structure (Phase 0)

### File Structure
```
/wp-content/plugins/bimverdi-article/
├── bimverdi-article.php (main plugin file)
├── inc/
│   ├── article-cpt.php (CPT & taxonomy registration)
│   ├── article-functions.php (helpers)
│   ├── article-rest-api.php (custom endpoints)
│   ├── article-admin.php (wp-admin interface)
│   ├── article-emails.php (email templates)
│   └── article-company-linking.php (bedrift-relasjon)
└── assets/
    └── css/article-admin.css (admin styling)

frontend/
├── components/articles/
│   ├── ArticleEditor.tsx (React-Quill wrapper)
│   ├── ArticleForm.tsx (submission form)
│   ├── ArticlesList.tsx (mine artikler list)
│   ├── EditArticleForm.tsx (edit flow)
│   └── ArticlePreview.tsx (preview modal)
├── app/
│   ├── (authenticated)/minside/page.tsx (Min Side integration)
│   ├── artikler/
│   │   ├── page.tsx (archive)
│   │   └── [slug]/page.tsx (single article)
│   └── api/articles/ (Next.js API routes → WordPress)
└── types/articles.ts (TypeScript types)
```

---

## ⏱️ Time Estimates Summary

| Phase | Tasks | Estimated Time |
|-------|-------|----------------|
| 0. Prerequisites | Tech decisions, auth verification, user meta check | 2-3 hours |
| 1. Backend Setup | CPT, ACF, helpers, REST API | 4-5 hours |
| 2. Frontend Components | React-Quill, forms, lists, Min Side integration | 6-8 hours |
| 3. Approval Workflow | Admin interface, email notifications | 4-5 hours |
| 4. Company Linking | Metadata, REST endpoint, profile display | 2-3 hours |
| 5. Edit & Delete | Edit form, delete flow, re-review | 2-3 hours |
| 6. Testing & Docs | Manual testing, security, performance, docs | 3-4 hours |
| **TOTAL** | | **24-28 hours** |

---

## 🚀 Next Steps

1. **START WITH PHASE 0** (2-3 timer)
   - Test React-Quill integration
   - Verify iron-session auth with REST API
   - Check user-company meta structure
   - Make final architectural decisions

2. **Create Git Branch**
   ```bash
   git checkout -b feature/member-article-system
   ```

3. **Install Dependencies**
   ```bash
   cd frontend
   npm install react-quill quill-image-uploader
   ```

4. **Create Plugin Structure**
   ```bash
   mkdir -p wordpress/wp-content/plugins/bimverdi-article/inc
   mkdir -p wordpress/wp-content/plugins/bimverdi-article/assets/css
   ```

5. **Begin Implementation** according to Phase 0 checklist

---

## 📋 Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| React-Quill HTML output unexpected | Medium | Sanitize via DOMPurify client + wp_kses_post() server |
| iron-session not working with REST API | High | Have JWT fallback ready (Phase 0 test) |
| Image upload security issues | High | Strict mime type check, max size, max dimensions |
| Member spam/abuse | Medium | Rate limiting (5/month), review process |
| Email delivery failures | Low | Use transactional service, fallback to in-app notification |
| Performance on large articles | Low | Max 10000 words enforced, lazy load images |
| Mobile WYSIWYG issues | Medium | Test early (Phase 0), fallback to simpler editor if needed |

---

**Status:** Ready for implementation
**Priority:** High (arrangement system complete)
**Next Action:** Begin Phase 0 - Prerequisites & Verification
**Estimated Completion:** 3-4 days of focused work (24-28 hours)

**Last Updated:** 29. oktober 2025
