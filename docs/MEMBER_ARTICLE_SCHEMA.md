# BimVerdi Member Article System - Database Schema

> **Opprettet:** 29. oktober 2025
> **Status:** Phase 0.4 - Schema Planning
> **Formål:** Definere database-struktur for `bv_member_article` CPT

---

## 📊 Custom Post Type: `bv_member_article`

### WP Post Table Fields
```php
post_type: 'bv_member_article'
post_status: 'pending' | 'publish' | 'draft' | 'admin_review' | 'rejected'
post_author: {user_id} // WordPress user som skrev artikkelen
post_title: string // Artikkeltittel
post_content: '' // TOM - vi bruker ikke denne
post_excerpt: string // Kort beskrivelse (maks 200 tegn)
post_date: datetime // Innsendelsesdato
post_modified: datetime // Sist endret
```

### Custom Post Statuses
```php
'admin_review' => 'Under gjennomgang' // Sendt til godkjenning
'publish'      => 'Publisert'         // Godkjent og synlig
'draft'        => 'Kladd'              // Brukerens utkast
'rejected'     => 'Avvist'             // Ikke godkjent
'pending'      => 'Venter'             // Første innsending
```

---

## 🔧 ACF Field Groups

### GROUP 1: Artikkelinnhold
**Group Key:** `group_bv_member_article_content`
**Location:** `post_type == 'bv_member_article'`

| Field Key | Field Name | Type | Required | Description |
|-----------|------------|------|----------|-------------|
| `field_article_content_html` | `article_content_html` | textarea | ✅ | HTML-innhold fra Tiptap (raw HTML) |
| `field_article_excerpt` | `article_excerpt` | textarea | ❌ | Kort beskrivelse (auto-generert fra HTML) |
| `field_article_featured_image` | `article_featured_image` | image | ❌ | Featured image (standard WP) |
| `field_article_word_count` | `article_word_count` | number | ❌ | Ordtelling (auto-beregnet) |

**Notes:**
- `article_content_html`: Lagres som RAW HTML fra Tiptap editor
- `article_excerpt`: Auto-genereres fra første 200 tegn i HTML (strip tags)
- `article_word_count`: Beregnes automatisk ved lagring

---

### GROUP 2: Forfatterinformasjon (Auto-Metadata)
**Group Key:** `group_bv_member_article_author`
**Location:** `post_type == 'bv_member_article'`
**Fields:** Read-only (auto-populated ved lagring)

| Field Key | Field Name | Type | Required | Description |
|-----------|------------|------|----------|-------------|
| `field_article_author_name` | `article_author_name` | text | ❌ | Fullt navn (fra WP user) |
| `field_article_author_email` | `article_author_email` | email | ❌ | E-post (fra WP user) |
| `field_article_company_id` | `article_company_id` | post_object | ❌ | Relasjon til deltaker CPT (fra user meta `associated_member`) |
| `field_article_company_name` | `article_company_name` | text | ❌ | Bedriftsnavn (cached fra deltaker CPT) |
| `field_article_submission_date` | `article_submission_date` | date_time_picker | ❌ | Første innsendelsesdato |

**Auto-population ved lagring:**
```php
// Ved første lagring (draft → pending)
$user = get_userdata($post->post_author);
update_field('article_author_name', $user->display_name, $post_id);
update_field('article_author_email', $user->user_email, $post_id);

// Hent brukerens tilknyttede bedrift
$member_id = get_field('associated_member', 'user_' . $user->ID);
if ($member_id) {
    update_field('article_company_id', $member_id, $post_id);
    $member_title = get_the_title($member_id);
    update_field('article_company_name', $member_title, $post_id);
}

update_field('article_submission_date', current_time('Y-m-d H:i:s'), $post_id);
```

---

### GROUP 3: Godkjenning (Kun Admin)
**Group Key:** `group_bv_member_article_review`
**Location:** `post_type == 'bv_member_article'`
**Conditional Logic:** Kun synlig for admin/editor

| Field Key | Field Name | Type | Required | Description |
|-----------|------------|------|----------|-------------|
| `field_article_review_status` | `article_review_status` | select | ❌ | Godkjenningsstatus |
| `field_article_reviewer_notes` | `article_reviewer_notes` | textarea | ❌ | Interne notater fra admin |
| `field_article_reviewed_by` | `article_reviewed_by` | user | ❌ | Admin som godkjente/avviste |
| `field_article_reviewed_date` | `article_reviewed_date` | date_time_picker | ❌ | Godkjenningsdato |
| `field_article_rejection_reason` | `article_rejection_reason` | textarea | ❌ | Årsak til avvisning (sendes til forfatter) |

**Review Status Options:**
```php
'pending'    => 'Venter på gjennomgang'
'approved'   => 'Godkjent'
'rejected'   => 'Avvist'
'published'  => 'Publisert'
```

---

## 🔗 Data Relationships

### User → Article
```
wp_users.ID = wp_posts.post_author
```

### User → Company
```
wp_usermeta.meta_key = 'associated_member'
wp_usermeta.meta_value = {deltaker_post_id}
```

### Article → Company
```
wp_postmeta.post_id = {article_post_id}
wp_postmeta.meta_key = 'article_company_id'
wp_postmeta.meta_value = {deltaker_post_id}
```

### Article → Company (via User)
```sql
SELECT
    p.ID as article_id,
    p.post_title as article_title,
    u.ID as author_id,
    u.display_name as author_name,
    um.meta_value as company_id,
    company.post_title as company_name
FROM wp_posts p
JOIN wp_users u ON p.post_author = u.ID
LEFT JOIN wp_usermeta um ON u.ID = um.user_id AND um.meta_key = 'associated_member'
LEFT JOIN wp_posts company ON um.meta_value = company.ID
WHERE p.post_type = 'bv_member_article'
AND p.post_status = 'publish'
ORDER BY p.post_date DESC
```

---

## 📋 WordPress Queries

### Get User's Articles
```php
$args = [
    'post_type' => 'bv_member_article',
    'author' => $user_id,
    'post_status' => ['draft', 'pending', 'publish', 'admin_review'],
    'orderby' => 'date',
    'order' => 'DESC',
    'posts_per_page' => -1,
];
$user_articles = new WP_Query($args);
```

### Get Company's Published Articles
```php
$args = [
    'post_type' => 'bv_member_article',
    'post_status' => 'publish',
    'meta_query' => [
        [
            'key' => 'article_company_id',
            'value' => $company_id,
            'compare' => '=',
        ],
    ],
    'orderby' => 'date',
    'order' => 'DESC',
    'posts_per_page' => 10,
];
$company_articles = new WP_Query($args);
```

### Get All Pending Review Articles (Admin)
```php
$args = [
    'post_type' => 'bv_member_article',
    'post_status' => 'pending',
    'orderby' => 'date',
    'order' => 'ASC', // Eldste først
    'posts_per_page' => -1,
];
$pending_articles = new WP_Query($args);
```

---

## 🔐 Capabilities & Permissions

### Custom Capabilities
```php
'edit_bv_member_article'           => Redigere egne artikler
'edit_bv_member_articles'          => Redigere alle artikler (admin)
'edit_others_bv_member_articles'   => Redigere andres artikler (admin)
'publish_bv_member_articles'       => Publisere artikler (admin)
'read_private_bv_member_articles'  => Lese private artikler (admin)
'delete_bv_member_article'         => Slette egne artikler
'delete_bv_member_articles'        => Slette alle artikler (admin)
```

### Role Mapping
```php
// bimverdi_customer (medlemmer)
'edit_bv_member_article' => true,           // Egne artikler
'delete_bv_member_article' => true,         // Egne utkast
'publish_bv_member_articles' => false,      // Kan IKKE publisere selv

// administrator
'edit_bv_member_articles' => true,          // Alle artikler
'publish_bv_member_articles' => true,       // Kan publisere
'delete_bv_member_articles' => true,        // Kan slette alt
```

---

## 🚀 REST API Endpoints

### `/wp-json/bimverdi/v1/member-articles`
**GET** - List user's articles
```json
Response:
{
  "articles": [
    {
      "id": 123,
      "title": "BIM og brannsikkerhet",
      "excerpt": "Hvordan vi brukte BIM for brannsimulering...",
      "status": "pending",
      "word_count": 1245,
      "submission_date": "2025-10-29T10:30:00",
      "company": {
        "id": 45,
        "name": "Konsulent Harstad AS"
      }
    }
  ],
  "total": 1
}
```

**POST** - Create new article
```json
Request:
{
  "title": "Min artikkel",
  "content_html": "<h2>Innledning</h2><p>Dette er...</p>",
  "excerpt": "Kort beskrivelse",
  "status": "draft"
}

Response:
{
  "success": true,
  "article_id": 124,
  "message": "Artikkel opprettet"
}
```

### `/wp-json/bimverdi/v1/member-articles/{id}`
**GET** - Get single article
**PUT** - Update article (owner only)
**DELETE** - Delete article (owner only, drafts only)

### `/wp-json/bimverdi/v1/member-articles/{id}/submit`
**POST** - Submit for review (draft → pending)
```json
Request: {}

Response:
{
  "success": true,
  "message": "Artikkel sendt til godkjenning",
  "new_status": "pending"
}
```

### `/wp-json/bimverdi/v1/member-articles/{id}/review` (Admin only)
**POST** - Approve or reject article
```json
Request:
{
  "action": "approve" | "reject",
  "reviewer_notes": "Bra skrevet, men mangler kilder",
  "rejection_reason": "Må sitere kildene" // Kun ved reject
}

Response:
{
  "success": true,
  "message": "Artikkel godkjent",
  "new_status": "publish"
}
```

### `/wp-json/bimverdi/v1/companies/{id}/articles`
**GET** - Get company's published articles
```json
Response:
{
  "company": {
    "id": 45,
    "name": "Konsulent Harstad AS",
    "slug": "konsulent-harstad"
  },
  "articles": [
    {
      "id": 125,
      "title": "BIM i praksis",
      "excerpt": "Våre erfaringer med...",
      "author": "Andreas Harstad",
      "published_date": "2025-10-28T14:00:00",
      "word_count": 980,
      "featured_image": "https://..."
    }
  ],
  "total": 5
}
```

---

## 📝 Implementation Checklist

### Phase 1: CPT Registration
- [ ] Register `bv_member_article` post type
- [ ] Register custom post statuses (`admin_review`, `rejected`)
- [ ] Add REST API support (`show_in_rest: true`)
- [ ] Set up capabilities and role mapping

### Phase 2: ACF Field Groups
- [ ] Create "Artikkelinnhold" field group
- [ ] Create "Forfatterinformasjon" field group (read-only)
- [ ] Create "Godkjenning" field group (admin only)
- [ ] Test field visibility and conditional logic

### Phase 3: Auto-Population Hooks
- [ ] Hook: `save_post_bv_member_article` - auto-populate author fields
- [ ] Hook: `transition_post_status` - handle status changes
- [ ] Function: `bv_calculate_word_count()` - count words in HTML
- [ ] Function: `bv_generate_excerpt()` - extract first 200 chars

### Phase 4: REST API Endpoints
- [ ] Endpoint: `GET /member-articles` (user's articles)
- [ ] Endpoint: `POST /member-articles` (create article)
- [ ] Endpoint: `PUT /member-articles/{id}` (update article)
- [ ] Endpoint: `POST /member-articles/{id}/submit` (submit for review)
- [ ] Endpoint: `POST /member-articles/{id}/review` (admin approve/reject)
- [ ] Endpoint: `GET /companies/{id}/articles` (company articles)

---

## 🔍 Database Indexes (Performance)

**Recommended indexes for faster queries:**
```sql
-- Index on post_type + post_status (for listing queries)
ALTER TABLE wp_posts
ADD INDEX idx_post_type_status (post_type, post_status, post_date);

-- Index on post_author (for user's articles)
ALTER TABLE wp_posts
ADD INDEX idx_author_type (post_author, post_type, post_status);

-- Index on company_id meta (for company articles)
ALTER TABLE wp_postmeta
ADD INDEX idx_company_articles (meta_key, meta_value, post_id);
```

**Note:** Disse kjøres automatisk via migration script i Phase 1.

---

## ✅ Phase 0.4 Complete

Schema er nå planlagt og klar for implementering i Phase 1.

**Neste steg:** Phase 1 - WordPress Backend Implementation
