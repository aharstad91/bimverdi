# Arrangement MVP - Status og TODO for Gravity Forms Frontend Integration

**Dato:** 28. oktober 2025
**Branch:** `feature/arrangement-mvp`
**Status:** Fase 1-3 fullført, Gravity Forms frontend-integrasjon gjenstår

---

## ✅ FULLFØRT

### Fase 1: WordPress Backend (100% ✅)
- ✅ `bv_arrangement` Custom Post Type opprettet
- ✅ `arrangement_type` taxonomy med 5 typer (BIMtech-møte, Seminar, Workshop, Konferanse, Nettverksmøte)
- ✅ 10 ACF-felt implementert:
  - `dato_start`, `tidspunkt_start`, `pameldingsfrist`
  - `moteformat`, `adresse`, `poststed`, `digital_link`
  - `maks_deltakere`, `kun_for_medlemmer`, `arrangement_status`, `gf_form_id`
- ✅ 8 helper-funksjoner i `inc/arrangement-functions.php`:
  - `bv_user_is_medlem()`, `bv_get_pameldte_count()`, `bv_is_arrangement_full()`
  - `bv_user_is_registered()`, `bv_get_status_label()`, `bv_get_format_icon()`
  - `bv_format_date()`, `bv_is_registration_closed()`

### Fase 2: Gravity Forms Setup (✅ Manuelt)
- ✅ Gravity Forms skjema opprettet i WordPress Admin
- ✅ 7 felt konfigurert (arrangement_id, navn, e-post, telefon, bedrift, kommentarer, vilkår)
- ✅ Notifikasjoner til deltaker og admin
- ✅ Dynamic population for innloggede brukere
- ✅ Fungerer på WordPress-siden (localhost:8888)

### Fase 3: WordPress Templates & Styling (100% ✅)
- ✅ `archive-bv_arrangement.php` - Grid med 3 kolonner
- ✅ `single-bv_arrangement.php` - To-kolonne layout med sidebar
- ✅ `template-parts/content-arrangement-card.php` - Card komponent
- ✅ `assets/css/arrangement.css` - Komplett styling (400+ linjer)
- ✅ Responsive design (mobil, tablet, desktop)
- ✅ Status badges, hover effects, pagination

### Fase 4: Next.js Frontend (90% ✅)
- ✅ `/arrangement` archive-side på localhost:3000
- ✅ `/arrangement/[slug]` dynamic route for enkelt-arrangement
- ✅ Arrangement TypeScript interface
- ✅ `wordpress.ts` oppdatert med arrangement-støtte
- ✅ Responsivt design med Tailwind CSS
- ⚠️ **MANGLER:** Påmeldingsskjema (viser kun lenke til WordPress)

### Test Data
- ✅ Test-arrangement opprettet (ID: 26)
- ✅ Titel: "BIMtech-møte: Digital tvilling i praksis"
- ✅ Dato: 15. januar 2025
- ✅ Alle ACF-felt populert
- ✅ REST API fungerer: `/wp/v2/arrangement`

### Dokumentasjon
- ✅ `GRAVITY_FORMS_SETUP_GUIDE.md` - Steg-for-steg guide
- ✅ `insert-test-arrangement.sql` - SQL for test-data
- ✅ `flush-rewrite-rules.php` - Permalink-fix

---

## 🚨 GJENSTÅR: Gravity Forms Frontend Integration

**Problem:** Gravity Forms-skjemaet vises kun på WordPress-siden (localhost:8888), ikke på Next.js frontend (localhost:3000).

**Løsning:** Implementere sømløs påmeldingsfunksjonalitet i Next.js ved å lage:

1. **WordPress REST API endpoint** som mottar påmeldinger
2. **React-skjema** i Next.js som sender data til endpointet
3. **Full validering** og feilhåndtering
4. **Bekreftelsesmeldinger** direkte i frontend

---

## 📋 TODO - Gravity Forms Frontend Integration

### Steg 1: WordPress REST API Endpoint (30-45 min)

**Fil å opprette:** `wordpress/wp-content/themes/bimverdi-theme/inc/arrangement-api.php`

**Funksjonalitet:**
```php
// POST /wp-json/bimverdi/v1/arrangement/{post_id}/register
- Motta påmeldingsdata fra Next.js
- Validere alle felt (navn, e-post, telefon, etc.)
- Sjekke tilgangskontroll (innlogget, fullbooket, frist, etc.)
- Bruke GFAPI::submit_form() til å opprette Gravity Forms entry
- Sende notifikasjoner automatisk
- Returnere success/error til frontend
```

**Valideringer som må implementeres:**
- ✅ Arrangement eksisterer
- ✅ Påmeldingsfrist ikke passert
- ✅ Ikke fullbooket
- ✅ Bruker ikke allerede påmeldt
- ✅ Kun medlemmer (hvis `kun_for_medlemmer = true`)
- ✅ E-post validering
- ✅ Påkrevde felt

**Response format:**
```json
{
  "success": true,
  "message": "Du er påmeldt!",
  "entry_id": 123
}
```

### Steg 2: Next.js Påmeldingsskjema Komponent (45-60 min)

**Fil å opprette:** `frontend/src/components/arrangement/RegistrationForm.tsx`

**Funksjonalitet:**
- React-skjema med state management
- Client-side validering
- Fetch-call til WordPress API
- Loading states og error handling
- Success-melding med animasjon
- Håndtere tilgangskontroll (vise riktige meldinger)

**Felt:**
1. Navn (required, pre-filled hvis innlogget)
2. E-post (required, validert, pre-filled)
3. Telefon (required, format-validering)
4. Bedrift (optional)
5. Kommentarer (optional, textarea)
6. Vilkår checkbox (required)

**States:**
```typescript
- formData: { navn, epost, telefon, bedrift, kommentarer, vilkar }
- isSubmitting: boolean
- isSuccess: boolean
- errors: { [field]: string }
- serverError: string | null
```

### Steg 3: Integrere i Arrangement-side (15-20 min)

**Fil å oppdatere:** `frontend/src/app/arrangement/[slug]/page.tsx`

**Endringer:**
- Erstatt lenke-boks med `<RegistrationForm />` komponent
- Send arrangement-data som props (post_id, status, maks_deltakere, etc.)
- Håndter conditional rendering:
  - Vis skjema hvis bruker kan melde seg på
  - Vis melding hvis fullbooket/frist passert/avlyst
  - Vis "Allerede påmeldt" hvis bruker er registrert

### Steg 4: Server Actions (Optional, 20-30 min)

**Fil å opprette:** `frontend/src/app/actions/arrangement-actions.ts`

**Fordeler:**
- Server-side validation
- Tryggere håndtering av sensitive data
- Bedre error handling

**Funksjon:**
```typescript
export async function registerForArrangement(
  postId: number,
  formData: FormData
) {
  'use server';

  // Validate
  // Call WordPress API
  // Return result
}
```

### Steg 5: Testing (30 min)

**Test-scenarioer:**
1. ✅ Påmelding fungerer (ikke innlogget)
2. ✅ Påmelding fungerer (innlogget, pre-filled data)
3. ✅ Validering fungerer (tomme felt, ugyldig e-post)
4. ✅ Fullbooket-logikk (når maks_deltakere nås)
5. ✅ Frist passert (viser feilmelding)
6. ✅ Kun for medlemmer (krever innlogging)
7. ✅ Dobbel-påmelding blokkeres
8. ✅ E-poster sendes korrekt
9. ✅ Entries vises i Gravity Forms admin
10. ✅ Helper-funksjoner oppdateres (påmeldte count)

---

## 🗂️ Filstruktur for implementering

```
wordpress/wp-content/themes/bimverdi-theme/
├── inc/
│   ├── arrangement-api.php          ← NY FIL (REST API endpoint)
│   └── ...
└── functions.php                     ← OPPDATER (require api.php)

frontend/src/
├── app/
│   ├── arrangement/[slug]/
│   │   └── page.tsx                  ← OPPDATER (bruk RegistrationForm)
│   └── actions/
│       └── arrangement-actions.ts    ← NY FIL (optional, server actions)
├── components/
│   └── arrangement/
│       └── RegistrationForm.tsx      ← NY FIL (React-skjema)
└── lib/
    └── wordpress.ts                  ← OPPDATER (legg til registerForArrangement())
```

---

## 🔧 Teknisk Implementering - Detaljer

### WordPress REST API Endpoint Struktur

```php
<?php
// inc/arrangement-api.php

add_action('rest_api_init', function () {
    register_rest_route('bimverdi/v1', '/arrangement/(?P<id>\d+)/register', [
        'methods' => 'POST',
        'callback' => 'bv_handle_arrangement_registration',
        'permission_callback' => '__return_true', // Public endpoint
        'args' => [
            'id' => [
                'validate_callback' => function($param) {
                    return is_numeric($param);
                }
            ],
        ],
    ]);
});

function bv_handle_arrangement_registration($request) {
    $post_id = $request->get_param('id');
    $data = $request->get_json_params();

    // 1. Validate arrangement exists
    // 2. Check registration deadline
    // 3. Check if full
    // 4. Check if already registered
    // 5. Check member-only restriction
    // 6. Validate form data
    // 7. Submit to Gravity Forms via GFAPI
    // 8. Return response

    return new WP_REST_Response([
        'success' => true,
        'message' => 'Påmelding vellykket!',
        'entry_id' => $entry_id
    ], 200);
}
```

### Next.js RegistrationForm Struktur

```typescript
// components/arrangement/RegistrationForm.tsx
'use client';

import { useState } from 'react';

interface RegistrationFormProps {
  arrangementId: number;
  isLoggedIn: boolean;
  userEmail?: string;
  userName?: string;
  isFull: boolean;
  isDeadlinePassed: boolean;
  membersOnly: boolean;
}

export function RegistrationForm({ arrangementId, ...props }: RegistrationFormProps) {
  const [formData, setFormData] = useState({
    navn: props.userName || '',
    epost: props.userEmail || '',
    telefon: '',
    bedrift: '',
    kommentarer: '',
    vilkar: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate
    // Submit to WordPress API
    // Handle response
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
}
```

---

## 🎯 Estimert tid for fullføring

- **Steg 1 (WordPress API):** 30-45 min
- **Steg 2 (React Form):** 45-60 min
- **Steg 3 (Integrasjon):** 15-20 min
- **Steg 4 (Server Actions):** 20-30 min (optional)
- **Steg 5 (Testing):** 30 min

**Totalt:** 2-3 timer

---

## 📚 Nyttig referanse

### WordPress GFAPI Dokumentasjon
```php
GFAPI::submit_form(
    $form_id,       // Gravity Forms ID
    $entry_data,    // Array med feltdata
    $field_values   // Initial field values
);
```

### WordPress Helper-funksjoner som skal brukes
```php
bv_is_arrangement_full($post_id)
bv_user_is_registered($post_id)
bv_is_registration_closed($post_id)
bv_user_is_medlem()
```

### Next.js Fetch til WordPress
```typescript
const response = await fetch(
  `${WP_API_URL}/bimverdi/v1/arrangement/${postId}/register`,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  }
);
```

---

## 🚀 Start her i neste chat

**Anbefalt rekkefølge:**

1. Start med WordPress REST API endpoint (mest kritisk)
2. Test endpointet med curl/Postman
3. Lag React-skjema med mock data først
4. Koble sammen skjema med API
5. Test grundig alle scenarioer
6. Commit og merge til main

**Kommando for neste chat:**
```bash
cd /Applications/MAMP/htdocs/bimverdi
git checkout feature/arrangement-mvp
code wordpress/wp-content/themes/bimverdi-theme/inc/arrangement-api.php
```

---

## 📞 Kontekst for AI i neste chat

**Brukeren ønsker:**
- Sømløs håndtering av arrangement-påmeldinger i Next.js frontend
- Gravity Forms-funksjonalitet uten å være avhengig av WordPress-siden
- Full validering og feilhåndtering
- Professional UX med loading states og bekreftelser

**Teknisk stack:**
- WordPress 6.x (backend) med Gravity Forms
- Next.js 16 + React 19 (frontend)
- REST API for kommunikasjon
- TypeScript strict mode

**Branchen er:** `feature/arrangement-mvp`
**Test-arrangement:** ID 26, slug: `bimtech-mote-digital-tvilling-i-praksis`

---

**🎉 Lykke til med implementeringen!**
