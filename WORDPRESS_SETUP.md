# WordPress Backend Setup for BIMVerdi

## 1. Installer WordPress i MAMP

1. Last ned WordPress fra [wordpress.org](https://wordpress.org/download/)
2. Pakk ut til: `/Applications/MAMP/htdocs/bimverdi/wordpress/`
3. Opprett database i phpMyAdmin (http://localhost:8888/phpMyAdmin)
   - Database navn: `bimverdi`
   - Collation: `utf8mb4_unicode_ci`
4. Gå til http://localhost:8888/bimverdi/wordpress og følg installasjonen

## 2. Installer Required Plugins

### Må ha:
- **Advanced Custom Fields (ACF) Pro** - For custom fields
- **Custom Post Type UI** - For å lage CPT (eller bruk custom code)
- **WPGraphQL** - For GraphQL API (anbefalt)
- **WPGraphQL for ACF** - For å eksponere ACF-felt via GraphQL
- **JWT Authentication for WP REST API** - For autentisering

### Nyttige plugins:
- **Yoast SEO** - SEO
- **Contact Form 7** eller **ACF Forms** - For front-end forms
- **Enable CORS** - For å tillate requests fra Next.js

## 3. Aktiver REST API CORS

Legg til i `wp-config.php` (over "That's all, stop editing!"):

```php
// Enable CORS for headless setup
define('JWT_AUTH_SECRET_KEY', 'din-sikre-nøkkel-her');
define('JWT_AUTH_CORS_ENABLE', true);
```

Legg til i `functions.php` i theme:

```php
// Enable CORS
add_action('rest_api_init', function() {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function($value) {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Allow-Headers: Authorization, Content-Type');
        return $value;
    });
}, 15);
```

## 4. Opprett Custom Post Types

Legg til i `functions.php`:

```php
// Register Custom Post Types
function bimverdi_register_post_types() {
    // Medlemsbedrifter
    register_post_type('members', [
        'labels' => [
            'name' => 'Medlemsbedrifter',
            'singular_name' => 'Medlemsbedrift'
        ],
        'public' => true,
        'has_archive' => true,
        'show_in_rest' => true,
        'supports' => ['title', 'editor', 'thumbnail', 'custom-fields'],
        'menu_icon' => 'dashicons-building',
    ]);

    // Verktøy
    register_post_type('tools', [
        'labels' => [
            'name' => 'Verktøy',
            'singular_name' => 'Verktøy'
        ],
        'public' => true,
        'has_archive' => true,
        'show_in_rest' => true,
        'supports' => ['title', 'editor', 'thumbnail', 'custom-fields'],
        'menu_icon' => 'dashicons-admin-tools',
    ]);

    // Caser
    register_post_type('cases', [
        'labels' => [
            'name' => 'Caser',
            'singular_name' => 'Case'
        ],
        'public' => true,
        'has_archive' => true,
        'show_in_rest' => true,
        'supports' => ['title', 'editor', 'thumbnail', 'custom-fields'],
        'menu_icon' => 'dashicons-chart-bar',
    ]);

    // Arrangementer
    register_post_type('events', [
        'labels' => [
            'name' => 'Arrangementer',
            'singular_name' => 'Arrangement'
        ],
        'public' => true,
        'has_archive' => true,
        'show_in_rest' => true,
        'supports' => ['title', 'editor', 'thumbnail', 'custom-fields'],
        'menu_icon' => 'dashicons-calendar-alt',
    ]);
}
add_action('init', 'bimverdi_register_post_types');
```

## 5. Sett opp ACF Field Groups

### For Medlemsbedrifter (members):
- Bedriftsnavn (Text)
- Logo (Image)
- Beskrivelse (Textarea)
- Nettside (URL)
- Kontakt e-post (Email)
- Kontakt telefon (Text)
- Adresse (Text)
- Medlemsnivå (Select: basic, premium, enterprise)
- Tjenester (Repeater)

### For Verktøy (tools):
- Verktøynavn (Text)
- Type (Select)
- Beskrivelse (Textarea)
- Nedlastingslenke (URL)
- Dokumentasjonslenke (URL)
- Versjon (Text)
- Forfatter (Text)
- Kompatibilitet (Checkbox)

### For Caser (cases):
- Prosjektnavn (Text)
- Klient (Text)
- År (Number)
- Utfordring (Textarea)
- Løsning (Textarea)
- Resultater (Textarea)
- Teknologier (Repeater)
- Bilder (Gallery)
- Relaterte medlemmer (Relationship → members)
- Relaterte verktøy (Relationship → tools)

### For Arrangementer (events):
- Arrangementsnavn (Text)
- Type (Select: project, arrangement, webinar, conference)
- Startdato (Date Picker)
- Sluttdato (Date Picker)
- Sted (Text)
- Er online (True/False)
- Påmeldingslenke (URL)
- Arrangør (Text)
- Maks deltakere (Number)
- Nåværende deltakere (Number)

## 6. Test REST API

Etter setup, test disse URL-ene:

- Posts: http://localhost:8888/bimverdi/wordpress/wp-json/wp/v2/posts
- Medlemmer: http://localhost:8888/bimverdi/wordpress/wp-json/wp/v2/members
- Verktøy: http://localhost:8888/bimverdi/wordpress/wp-json/wp/v2/tools
- Caser: http://localhost:8888/bimverdi/wordpress/wp-json/wp/v2/cases
- Arrangementer: http://localhost:8888/bimverdi/wordpress/wp-json/wp/v2/events

## 7. GraphQL (hvis du bruker WPGraphQL)

Test GraphQL playground:
http://localhost:8888/bimverdi/wordpress/graphql

Eksempel query:
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
}
```

## Neste steg

Etter WordPress er satt opp:
1. Opprett noe test-innhold i hver CPT
2. Test at REST API returnerer data
3. Start Next.js frontend og test integrasjonen
