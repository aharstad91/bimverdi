# Gravity Forms Setup Guide - Arrangement-påmelding

> **Guide for å sette opp Gravity Forms påmeldingsskjema for BIMVerdi Arrangement MVP**

---

## 📋 Forutsetninger

- ✅ Gravity Forms plugin er installert og aktivert
- ✅ Du har admin-tilgang til WordPress
- ✅ Test-arrangement (ID: 26) er opprettet

---

## 🎯 Steg 1: Opprett nytt skjema

1. Gå til: **WordPress Admin → Forms → New Form**
2. Fyll inn:
   - **Form Name:** `Arrangement-påmelding`
   - **Description:** `Påmeldingsskjema for BIMVerdi-arrangementer`
3. Klikk **Create Form**

---

## 🔧 Steg 2: Legg til skjemafelt

### Felt 1: Arrangement ID (Hidden)

1. **Dra inn:** Hidden field
2. **Konfigurer:**
   - **Label:** `Arrangement ID`
   - **Field Label Visibility:** Hide
   - **Allow field to be populated dynamically:** ✅ Checked
   - **Parameter Name:** `arrangement_id`
   - **Default Value:** (la stå tom)

---

### Felt 2: Fullt navn (Text)

1. **Dra inn:** Single Line Text
2. **Konfigurer:**
   - **Field Label:** `Fullt navn`
   - **Description:** `Ditt fulle navn`
   - **Required:** ✅ Checked
   - **Allow field to be populated dynamically:** ✅ Checked
   - **Parameter Name:** `navn`
   - **Default Value:** `{user:display_name}`

> **Viktig:** Default Value må være nøyaktig som vist over (med krøllparenteser)

---

### Felt 3: E-postadresse (Email)

1. **Dra inn:** Email field
2. **Konfigurer:**
   - **Field Label:** `E-postadresse`
   - **Description:** `Din e-postadresse for bekreftelse`
   - **Required:** ✅ Checked
   - **Allow field to be populated dynamically:** ✅ Checked
   - **Parameter Name:** `epost`
   - **Default Value:** `{user:user_email}`
   - **Enable Email Confirmation:** ⬜ Unchecked (ikke nødvendig for MVP)

---

### Felt 4: Telefonnummer (Phone)

1. **Dra inn:** Phone field
2. **Konfigurer:**
   - **Field Label:** `Telefonnummer`
   - **Description:** `Ditt mobilnummer`
   - **Phone Format:** International
   - **Required:** ✅ Checked

---

### Felt 5: Bedrift (Text)

1. **Dra inn:** Single Line Text
2. **Konfigurer:**
   - **Field Label:** `Bedrift`
   - **Description:** `Navn på din bedrift/organisasjon`
   - **Required:** ⬜ Unchecked (valgfritt)
   - **Allow field to be populated dynamically:** ✅ Checked
   - **Parameter Name:** `bedrift`

---

### Felt 6: Kommentarer (Textarea)

1. **Dra inn:** Paragraph Text
2. **Konfigurer:**
   - **Field Label:** `Kommentarer eller spørsmål`
   - **Description:** `Evt. matallergier, spesielle behov, eller spørsmål`
   - **Required:** ⬜ Unchecked
   - **Default Rows:** `4`

---

### Felt 7: Godta vilkår (Checkbox)

1. **Dra inn:** Checkboxes
2. **Konfigurer:**
   - **Field Label:** `Vilkår`
   - **Choices:**
     - **Checkbox 1:** `Jeg godtar vilkårene og personvernerklæringen`
   - **Required:** ✅ Checked

> **Tips:** Du kan legge til en lenke i teksten:
> ```
> Jeg godtar <a href="/vilkar" target="_blank">vilkårene</a> og <a href="/personvern" target="_blank">personvernerklæringen</a>
> ```

---

## ⚙️ Steg 3: Form Settings

### 3.1 Form Settings → General

1. Klikk på **Form Settings** (tannhjul-ikon øverst til høyre)
2. Under **Form Layout:**
   - **Form Title:** ⬜ Hide
   - **Form Description:** ⬜ Hide

### 3.2 Form Settings → Restrictions

1. **Limit number of entries:** ⬜ Unchecked
2. **Schedule form:** ⬜ Unchecked

### 3.3 Form Settings → Advanced

1. **Enable Ajax:** ✅ Checked (viktig for bedre UX!)
2. **Enable Honeypot:** ✅ Checked (spam-beskyttelse)

---

## 📧 Steg 4: Notifikasjoner (Notifications)

### Notifikasjon 1: Til deltaker (Bekreftelse)

1. Gå til **Settings → Notifications**
2. Hover over "Admin Notification" → **Duplicate**
3. Klikk på den nye notifikasjonen → **Rediger**

**Konfigurer:**

- **Name:** `Bekreftelse til deltaker`
- **Send To:** `{E-postadresse:3}` (feltID for e-post, vanligvis 3)
- **From Name:** `BIMVerdi`
- **From Email:** `post@bimverdi.no`
- **Reply To:** `post@bimverdi.no`
- **Subject:** `Påmelding bekreftet: {Arrangement-tittel}`
- **Message:**

```
Hei {Fullt navn:2}!

Takk for din påmelding til arrangementet.

ARRANGEMENT-DETALJER:
• Tittel: [Se arrangementside for detaljer]
• Dato og tid: [Hentet fra arrangement]
• Format: [Fysisk/Digital/Hybrid]
• Lokasjon: [Adresse]

Vi gleder oss til å se deg!

Ved spørsmål, kontakt oss på post@bimverdi.no

Med vennlig hilsen,
BIMVerdi-teamet

---
Dette er en automatisk bekreftelse. Ikke svar på denne e-posten.
```

> **Merk:** Feltene `{Fullt navn:2}` må tilpasses til faktiske feltID-er i ditt skjema

---

### Notifikasjon 2: Til admin

1. Klikk på **Admin Notification** (den opprinnelige)
2. **Rediger:**

**Konfigurer:**

- **Name:** `Ny påmelding til admin`
- **Send To:** `post@bimverdi.no`
- **From Name:** `BIMVerdi Påmelding`
- **From Email:** `{E-postadresse:3}`
- **Subject:** `Ny påmelding: {Fullt navn:2} - Arrangement ID {Arrangement ID:1}`
- **Message:**

```
Ny påmelding mottatt!

DELTAKER-INFO:
• Navn: {Fullt navn:2}
• E-post: {E-postadresse:3}
• Telefon: {Telefonnummer:4}
• Bedrift: {Bedrift:5}
• Kommentarer: {Kommentarer:6}

ARRANGEMENT:
• Arrangement ID: {Arrangement ID:1}

Se alle påmeldinger i Gravity Forms admin.
```

---

## ✅ Steg 5: Confirmation (Bekreftelse)

1. Gå til **Settings → Confirmations**
2. Klikk på **Default Confirmation** → **Rediger**

**Konfigurer:**

- **Confirmation Name:** `Påmelding fullført`
- **Confirmation Type:** **Text**
- **Confirmation Message:**

```html
<div style="padding: 20px; background: #e8f5e9; border-left: 4px solid #4CAF50; border-radius: 4px;">
    <h3 style="color: #2e7d32; margin-top: 0;">✅ Du er påmeldt!</h3>
    <p>Takk for din påmelding. Du vil motta en bekreftelse på e-post.</p>
    <p>Vi gleder oss til å se deg!</p>
</div>
```

**ELLER** velg **Page redirect** og send til en egen "Takk for påmelding"-side.

---

## 🔗 Steg 6: Knytt skjema til arrangement

### 6.1 Notér Form ID

1. Gå til **Forms → Forms**
2. Du ser nå skjemaet "Arrangement-påmelding" med et ID-nummer (f.eks. **ID: 1**)
3. **Notér dette ID-nummeret!**

### 6.2 Oppdater arrangement med Form ID

**Alternativ A - Via WordPress Admin:**

1. Gå til **Arrangementer → All Arrangementer**
2. Klikk på "BIMtech-møte: Digital tvilling i praksis"
3. Scroll ned til **Arrangementdetaljer**
4. Finn feltet **Gravity Forms ID**
5. Skriv inn Form ID (f.eks. `1`)
6. Klikk **Update**

**Alternativ B - Via SQL:**

```sql
-- Oppdater gf_form_id for test-arrangement
UPDATE wp_postmeta
SET meta_value = '1'
WHERE post_id = 26
AND meta_key = 'gf_form_id';
```

Kjør SQL:
```bash
echo "UPDATE wp_postmeta SET meta_value = '1' WHERE post_id = 26 AND meta_key = 'gf_form_id';" | \
/Applications/MAMP/Library/bin/mysql80/bin/mysql -u root -proot bimverdi
```

---

## 🧪 Steg 7: Test skjemaet

### Test 1: Skjemaet vises på arrangement-siden

1. Gå til: `http://localhost:8888/bimverdi/wordpress/arrangement/bimtech-mote-digital-tvilling-i-praksis/`
2. Scroll ned til "Påmelding" i sidebar
3. **Forventet resultat:** Skjemaet vises

### Test 2: Påmelding fungerer

1. Fyll ut skjemaet med testdata:
   - Navn: `Test Bruker`
   - E-post: `test@example.com`
   - Telefon: `12345678`
   - Bedrift: `Test AS`
   - Kommentarer: `Dette er en test`
   - ✅ Godta vilkår
2. Klikk **Send inn**
3. **Forventet resultat:**
   - ✅ Bekreftelsesmelding vises
   - 📧 E-post sendes til `test@example.com` og `post@bimverdi.no`

### Test 3: Dynamic population fungerer

1. **Logg inn** som en WordPress-bruker
2. Gå til arrangement-siden igjen
3. **Forventet resultat:**
   - Navn-feltet er forhåndsutfylt med brukerens navn
   - E-post-feltet er forhåndsutfylt med brukerens e-post

### Test 4: Sjekk entries i admin

1. Gå til **Forms → Entries**
2. Velg "Arrangement-påmelding"
3. **Forventet resultat:** Din test-påmelding vises
4. Klikk på entry for å se alle detaljer

---

## 🔍 Steg 8: Verifiser helper-funksjoner

Test at helper-funksjonene fungerer:

```bash
# Test bv_get_pameldte_count()
curl -s "http://localhost:8888/bimverdi/wordpress/arrangement/bimtech-mote-digital-tvilling-i-praksis/"
```

**Se etter:**
- Riktig antall påmeldte vises (f.eks. "1 / 30 påmeldt")
- Hvis fullbooket: "Fullbooket"-badge og skjema skjules

---

## 🎨 Steg 9: (Valgfritt) Custom styling

Hvis du vil style Gravity Forms bedre:

**Legg til i `assets/css/arrangement.css`:**

```css
/* Allerede lagt til i arrangement.css, men sjekk at det ser bra ut */
.gravity-form-wrapper .gform_wrapper input[type="text"],
.gravity-form-wrapper .gform_wrapper input[type="email"],
.gravity-form-wrapper .gform_wrapper input[type="tel"],
.gravity-form-wrapper .gform_wrapper textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
}

.gravity-form-wrapper .gform_wrapper .gform_button {
    background: #0066cc;
    color: #fff;
    border: none;
    padding: 12px 30px;
    border-radius: 4px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
}
```

---

## 🐛 Feilsøking

### Problem: Skjemaet vises ikke

**Løsning:**
1. Sjekk at `gf_form_id` er satt i ACF
2. Verifiser at Gravity Forms er aktivert
3. Sjekk konsollen for JavaScript-feil

### Problem: E-post sendes ikke

**Løsning:**
1. Sjekk **Forms → Settings → Email**
2. Test med WP Mail SMTP plugin
3. Sjekk spam-mappe

### Problem: Dynamic population fungerer ikke

**Løsning:**
1. Sjekk at "Allow field to be populated dynamically" er ✅
2. Verifiser Parameter Name er riktig
3. Sjekk at Default Value har riktig merge tag (`{user:display_name}`)

### Problem: Helper-funksjoner returnerer 0

**Løsning:**
1. Sjekk at GFAPI er tilgjengelig: `class_exists('GFAPI')`
2. Verifiser at `arrangement_id` hidden field sendes med i entries

---

## ✅ Sjekkliste

Før du går videre, sjekk at:

- [ ] Skjema opprettet med 7 felt
- [ ] Ajax aktivert
- [ ] Honeypot aktivert
- [ ] 2 notifikasjoner konfigurert
- [ ] Confirmation message satt
- [ ] Form ID notert og lagt inn i arrangement
- [ ] Test-påmelding gjennomført
- [ ] E-poster mottatt
- [ ] Entry synlig i Gravity Forms admin
- [ ] Helper-funksjoner fungerer (påmeldte count)

---

## 🚀 Neste steg

Når Gravity Forms er satt opp:

1. **Fase 4 - Testing:** Test alle scenarioer (fullbooket, frist passert, etc.)
2. **Fase 5 - Lansering:** Flytt til produksjon
3. **Fase 6 - Videreutvikling:** Zapier, kalendereksport, etc.

---

## 📞 Hjelp

Hvis du støter på problemer:

1. Sjekk Gravity Forms dokumentasjon: https://docs.gravityforms.com/
2. Se WordPress debug log: `/wordpress/wp-content/debug.log`
3. Test med en annen browser (private mode)

---

**Sist oppdatert:** 28. oktober 2025
**Versjon:** 1.0 (MVP)
