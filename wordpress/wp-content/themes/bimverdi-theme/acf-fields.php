<?php
/**
 * ACF Field Groups for BIMVerdi
 *
 * Register all field groups for Custom Post Types
 */

if( function_exists('acf_add_local_field_group') ):

// Field Group for Deltakere (tidligere Members/Medlemsbedrifter)
acf_add_local_field_group(array(
    'key' => 'group_deltakere',
    'title' => 'Deltakerinformasjon',
    'show_in_rest' => true,
    'fields' => array(
        array(
            'key' => 'field_company_name',
            'label' => 'Bedriftsnavn',
            'name' => 'company_name',
            'type' => 'text',
            'required' => 1,
        ),
        array(
            'key' => 'field_membership_level',
            'label' => 'Medlemsnivå',
            'name' => 'membership_level',
            'type' => 'select',
            'choices' => array(
                'deltaker' => 'Deltaker (D)',
                'partner' => 'Partner (P)',
                'prosjektdeltaker' => 'Prosjektdeltaker (PD)',
                'egen_avtale' => 'Egen avtale',
            ),
            'default_value' => 'deltaker',
            'required' => 1,
        ),
        array(
            'key' => 'field_logo',
            'label' => 'Logo',
            'name' => 'logo',
            'type' => 'image',
            'return_format' => 'array',
            'preview_size' => 'medium',
        ),
        array(
            'key' => 'field_description',
            'label' => 'Virksomhetsbeskrivelse',
            'name' => 'description',
            'type' => 'wysiwyg',
            'tabs' => 'all',
            'toolbar' => 'full',
            'media_upload' => 1,
        ),
        array(
            'key' => 'field_website',
            'label' => 'Nettside',
            'name' => 'website',
            'type' => 'url',
        ),
        array(
            'key' => 'field_org_number',
            'label' => 'Organisasjonsnummer',
            'name' => 'org_number',
            'type' => 'text',
            'instructions' => 'Organisasjonsnummer (9 siffer)',
            'maxlength' => 20,
        ),
        array(
            'key' => 'field_business_categories',
            'label' => 'Virksomhetskategorier',
            'name' => 'business_categories',
            'type' => 'checkbox',
            'choices' => array(
                'architect' => 'Arkitekt/rådgiver',
                'consultant' => 'Rådgivende ingeniør',
                'contractor' => 'Entreprenør/byggmester',
                'developer' => 'Boligutvikler',
                'client' => 'Bestiller/byggherre',
                'producer' => 'Byggevareprodusent',
                'retailer' => 'Byggevarehandel',
                'property' => 'Eiendom/drift',
                'tool_vendor' => 'Leverandør av digitale verktøy, innhold og løsninger',
                'service_provider' => 'Tjenesteleverandør',
                'organization' => 'Organisasjon, nettverk m.m.',
                'public' => 'Offentlig instans',
                'education' => 'Utdanningsinstitusjon',
                'research' => 'Forskningsinstitutt',
            ),
            'layout' => 'vertical',
        ),
        array(
            'key' => 'field_customer_types',
            'label' => 'Kundetyper',
            'name' => 'customer_types',
            'type' => 'checkbox',
            'choices' => array(
                'client' => 'Bestiller/byggherre',
                'architect' => 'Arkitekt/rådgiver',
                'contractor' => 'Entreprenør/byggmester',
                'producer' => 'Byggevareprodusent',
                'retailer' => 'Byggevarehandel',
                'property' => 'Eiendom/drift',
                'public' => 'Offentlig sektor',
            ),
            'layout' => 'vertical',
        ),
        array(
            'key' => 'field_main_contact_name',
            'label' => 'Hovedkontakt - Navn',
            'name' => 'main_contact_name',
            'type' => 'text',
        ),
        array(
            'key' => 'field_main_contact_title',
            'label' => 'Hovedkontakt - Stilling',
            'name' => 'main_contact_title',
            'type' => 'text',
        ),
        array(
            'key' => 'field_main_contact_linkedin',
            'label' => 'Hovedkontakt - LinkedIn-profil',
            'name' => 'main_contact_linkedin',
            'type' => 'url',
        ),
        array(
            'key' => 'field_contact_email',
            'label' => 'Kontakt e-post',
            'name' => 'contact_email',
            'type' => 'email',
        ),
        array(
            'key' => 'field_contact_phone',
            'label' => 'Telefon',
            'name' => 'contact_phone',
            'type' => 'text',
        ),
        array(
            'key' => 'field_address',
            'label' => 'Adresse',
            'name' => 'address',
            'type' => 'text',
        ),
        array(
            'key' => 'field_city',
            'label' => 'By',
            'name' => 'city',
            'type' => 'text',
        ),
        array(
            'key' => 'field_postal_code',
            'label' => 'Postnummer',
            'name' => 'postal_code',
            'type' => 'text',
        ),
        array(
            'key' => 'field_employees',
            'label' => 'Antall ansatte',
            'name' => 'employees',
            'type' => 'number',
        ),
        array(
            'key' => 'field_founded_year',
            'label' => 'Etablert år',
            'name' => 'founded_year',
            'type' => 'number',
        ),
        array(
            'key' => 'field_services',
            'label' => 'Tjenester',
            'name' => 'services',
            'type' => 'textarea',
            'rows' => 4,
        ),
        array(
            'key' => 'field_linkedin_company',
            'label' => 'LinkedIn bedriftsside',
            'name' => 'linkedin_company',
            'type' => 'url',
        ),
    ),
    'location' => array(
        array(
            array(
                'param' => 'post_type',
                'operator' => '==',
                'value' => 'deltakere',
            ),
        ),
    ),
));

// Field Group for Tools (Verktøy)
acf_add_local_field_group(array(
    'key' => 'group_tools',
    'title' => 'Verktøyinformasjon',
    'show_in_rest' => true,
    'fields' => array(
        array(
            'key' => 'field_tool_name',
            'label' => 'Verktøynavn',
            'name' => 'tool_name',
            'type' => 'text',
            'required' => 1,
        ),
        array(
            'key' => 'field_tool_logo',
            'label' => 'Logo/Ikon',
            'name' => 'tool_logo',
            'type' => 'image',
            'return_format' => 'array',
            'preview_size' => 'medium',
        ),
        array(
            'key' => 'field_tool_description',
            'label' => 'Beskrivelse',
            'name' => 'tool_description',
            'type' => 'wysiwyg',
        ),
        array(
            'key' => 'field_tool_category',
            'label' => 'Kategori',
            'name' => 'tool_category',
            'type' => 'select',
            'choices' => array(
                'modeling' => 'Modellering',
                'coordination' => 'Koordinering',
                'visualization' => 'Visualisering',
                'analysis' => 'Analyse',
                'documentation' => 'Dokumentasjon',
                'project_management' => 'Prosjektstyring',
            ),
        ),
        array(
            'key' => 'field_tool_vendor',
            'label' => 'Leverandør',
            'name' => 'tool_vendor',
            'type' => 'text',
        ),
        array(
            'key' => 'field_tool_website',
            'label' => 'Nettside',
            'name' => 'tool_website',
            'type' => 'url',
        ),
        array(
            'key' => 'field_tool_price_range',
            'label' => 'Prisklasse',
            'name' => 'tool_price_range',
            'type' => 'select',
            'choices' => array(
                'free' => 'Gratis',
                'low' => 'Lav (0-5000 kr/år)',
                'medium' => 'Medium (5000-20000 kr/år)',
                'high' => 'Høy (20000+ kr/år)',
            ),
        ),
        array(
            'key' => 'field_tool_platforms',
            'label' => 'Plattformer',
            'name' => 'tool_platforms',
            'type' => 'checkbox',
            'choices' => array(
                'windows' => 'Windows',
                'mac' => 'Mac',
                'linux' => 'Linux',
                'web' => 'Nettleser',
                'mobile' => 'Mobil',
            ),
        ),
        array(
            'key' => 'field_tool_features',
            'label' => 'Hovedfunksjoner',
            'name' => 'tool_features',
            'type' => 'textarea',
            'rows' => 5,
        ),
        array(
            'key' => 'field_tool_owner_member',
            'label' => 'Eier (Deltaker)',
            'name' => 'owner_member',
            'type' => 'post_object',
            'required' => 0,
            'post_type' => array('deltakere'),
            'taxonomy' => array(),
            'allow_null' => 1,
            'multiple' => 0,
            'return_format' => 'id',
            'ui' => 1,
            'instructions' => 'Hvilken deltaker eier/administrerer dette verktøyet?',
        ),
    ),
    'location' => array(
        array(
            array(
                'param' => 'post_type',
                'operator' => '==',
                'value' => 'tools',
            ),
        ),
    ),
));

// Field Group for Cases (Caser)
acf_add_local_field_group(array(
    'key' => 'group_cases',
    'title' => 'Case-informasjon',
    'fields' => array(
        array(
            'key' => 'field_project_name',
            'label' => 'Prosjektnavn',
            'name' => 'project_name',
            'type' => 'text',
            'required' => 1,
        ),
        array(
            'key' => 'field_client',
            'label' => 'Kunde/Oppdragsgiver',
            'name' => 'client',
            'type' => 'text',
        ),
        array(
            'key' => 'field_featured_image',
            'label' => 'Hovedbilde',
            'name' => 'featured_image',
            'type' => 'image',
            'return_format' => 'array',
            'preview_size' => 'large',
        ),
        array(
            'key' => 'field_gallery',
            'label' => 'Bildegalleri',
            'name' => 'gallery',
            'type' => 'gallery',
            'return_format' => 'array',
        ),
        array(
            'key' => 'field_case_description',
            'label' => 'Beskrivelse',
            'name' => 'case_description',
            'type' => 'wysiwyg',
        ),
        array(
            'key' => 'field_project_type',
            'label' => 'Prosjekttype',
            'name' => 'project_type',
            'type' => 'select',
            'choices' => array(
                'commercial' => 'Næring',
                'residential' => 'Bolig',
                'infrastructure' => 'Infrastruktur',
                'industrial' => 'Industri',
                'public' => 'Offentlig',
            ),
        ),
        array(
            'key' => 'field_location',
            'label' => 'Lokasjon',
            'name' => 'location',
            'type' => 'text',
        ),
        array(
            'key' => 'field_project_size',
            'label' => 'Prosjektstørrelse (m²)',
            'name' => 'project_size',
            'type' => 'number',
        ),
        array(
            'key' => 'field_completion_year',
            'label' => 'Ferdigstillelsesår',
            'name' => 'completion_year',
            'type' => 'number',
        ),
        array(
            'key' => 'field_bim_tools_used',
            'label' => 'BIM-verktøy brukt',
            'name' => 'bim_tools_used',
            'type' => 'textarea',
            'rows' => 3,
        ),
        array(
            'key' => 'field_challenges',
            'label' => 'Utfordringer',
            'name' => 'challenges',
            'type' => 'textarea',
            'rows' => 4,
        ),
        array(
            'key' => 'field_solutions',
            'label' => 'Løsninger',
            'name' => 'solutions',
            'type' => 'textarea',
            'rows' => 4,
        ),
        array(
            'key' => 'field_results',
            'label' => 'Resultater',
            'name' => 'results',
            'type' => 'textarea',
            'rows' => 4,
        ),
    ),
    'location' => array(
        array(
            array(
                'param' => 'post_type',
                'operator' => '==',
                'value' => 'cases',
            ),
        ),
    ),
));

// Field Group for Events (Arrangementer)
acf_add_local_field_group(array(
    'key' => 'group_events',
    'title' => 'Arrangementinformasjon',
    'fields' => array(
        array(
            'key' => 'field_event_name',
            'label' => 'Arrangementsnavn',
            'name' => 'event_name',
            'type' => 'text',
            'required' => 1,
        ),
        array(
            'key' => 'field_event_image',
            'label' => 'Arrangementsbilde',
            'name' => 'event_image',
            'type' => 'image',
            'return_format' => 'array',
            'preview_size' => 'large',
        ),
        array(
            'key' => 'field_event_description',
            'label' => 'Beskrivelse',
            'name' => 'event_description',
            'type' => 'wysiwyg',
        ),
        array(
            'key' => 'field_event_type',
            'label' => 'Type arrangement',
            'name' => 'event_type',
            'type' => 'select',
            'choices' => array(
                'conference' => 'Konferanse',
                'workshop' => 'Workshop',
                'webinar' => 'Webinar',
                'networking' => 'Nettverkstreff',
                'course' => 'Kurs',
            ),
        ),
        array(
            'key' => 'field_event_date',
            'label' => 'Dato',
            'name' => 'event_date',
            'type' => 'date_picker',
            'display_format' => 'd.m.Y',
            'return_format' => 'Y-m-d',
            'required' => 1,
        ),
        array(
            'key' => 'field_event_start_time',
            'label' => 'Starttid',
            'name' => 'event_start_time',
            'type' => 'time_picker',
            'display_format' => 'H:i',
            'return_format' => 'H:i',
        ),
        array(
            'key' => 'field_event_end_time',
            'label' => 'Sluttid',
            'name' => 'event_end_time',
            'type' => 'time_picker',
            'display_format' => 'H:i',
            'return_format' => 'H:i',
        ),
        array(
            'key' => 'field_event_location',
            'label' => 'Lokasjon',
            'name' => 'event_location',
            'type' => 'text',
        ),
        array(
            'key' => 'field_event_address',
            'label' => 'Adresse',
            'name' => 'event_address',
            'type' => 'textarea',
            'rows' => 3,
        ),
        array(
            'key' => 'field_event_online',
            'label' => 'Digitalt arrangement',
            'name' => 'event_online',
            'type' => 'true_false',
            'message' => 'Dette er et digitalt arrangement',
        ),
        array(
            'key' => 'field_event_url',
            'label' => 'Påmeldingslenke',
            'name' => 'event_url',
            'type' => 'url',
        ),
        array(
            'key' => 'field_event_capacity',
            'label' => 'Maks antall deltakere',
            'name' => 'event_capacity',
            'type' => 'number',
        ),
        array(
            'key' => 'field_event_price',
            'label' => 'Pris (NOK)',
            'name' => 'event_price',
            'type' => 'number',
        ),
        array(
            'key' => 'field_event_organizer',
            'label' => 'Arrangør',
            'name' => 'event_organizer',
            'type' => 'text',
        ),
        array(
            'key' => 'field_event_contact_email',
            'label' => 'Kontakt e-post',
            'name' => 'event_contact_email',
            'type' => 'email',
        ),
    ),
    'location' => array(
        array(
            array(
                'param' => 'post_type',
                'operator' => '==',
                'value' => 'events',
            ),
        ),
    ),
));

// Field Group for bv_arrangement (Arrangement MVP)
acf_add_local_field_group(array(
    'key' => 'group_bv_arrangement',
    'title' => 'Arrangementdetaljer',
    'show_in_rest' => true,
    'fields' => array(
        // Dato og tid
        array(
            'key' => 'field_arrangement_dato_start',
            'label' => 'Startdato',
            'name' => 'dato_start',
            'type' => 'date_picker',
            'instructions' => 'Dato for når arrangementet starter',
            'required' => 1,
            'display_format' => 'd.m.Y',
            'return_format' => 'Ymd',
            'first_day' => 1,
        ),
        array(
            'key' => 'field_arrangement_tidspunkt_start',
            'label' => 'Starttidspunkt',
            'name' => 'tidspunkt_start',
            'type' => 'time_picker',
            'instructions' => 'Klokkeslett for start (f.eks. 09:00)',
            'required' => 1,
            'display_format' => 'H:i',
            'return_format' => 'H:i',
        ),
        array(
            'key' => 'field_arrangement_pameldingsfrist',
            'label' => 'Påmeldingsfrist',
            'name' => 'pameldingsfrist',
            'type' => 'date_time_picker',
            'instructions' => 'Siste frist for påmelding',
            'required' => 1,
            'display_format' => 'd.m.Y H:i',
            'return_format' => 'Y-m-d H:i:s',
            'first_day' => 1,
        ),

        // Lokasjon
        array(
            'key' => 'field_arrangement_moteformat',
            'label' => 'Møteformat',
            'name' => 'moteformat',
            'type' => 'select',
            'instructions' => 'Velg om arrangementet er fysisk, digitalt eller hybrid',
            'required' => 1,
            'choices' => array(
                'fysisk' => 'Fysisk møte',
                'digitalt' => 'Digitalt møte',
                'hybrid' => 'Hybrid (både fysisk og digitalt)',
            ),
            'default_value' => 'fysisk',
        ),
        array(
            'key' => 'field_arrangement_adresse',
            'label' => 'Adresse',
            'name' => 'adresse',
            'type' => 'text',
            'instructions' => 'Gateadresse for fysisk møte',
            'conditional_logic' => array(
                array(
                    array(
                        'field' => 'field_arrangement_moteformat',
                        'operator' => '==',
                        'value' => 'fysisk',
                    ),
                ),
                array(
                    array(
                        'field' => 'field_arrangement_moteformat',
                        'operator' => '==',
                        'value' => 'hybrid',
                    ),
                ),
            ),
        ),
        array(
            'key' => 'field_arrangement_poststed',
            'label' => 'Poststed',
            'name' => 'poststed',
            'type' => 'text',
            'instructions' => 'By/sted for arrangementet',
            'conditional_logic' => array(
                array(
                    array(
                        'field' => 'field_arrangement_moteformat',
                        'operator' => '==',
                        'value' => 'fysisk',
                    ),
                ),
                array(
                    array(
                        'field' => 'field_arrangement_moteformat',
                        'operator' => '==',
                        'value' => 'hybrid',
                    ),
                ),
            ),
        ),
        array(
            'key' => 'field_arrangement_digital_link',
            'label' => 'Digital møtelenke',
            'name' => 'digital_link',
            'type' => 'url',
            'instructions' => 'Lenke til Teams, Zoom, etc.',
            'conditional_logic' => array(
                array(
                    array(
                        'field' => 'field_arrangement_moteformat',
                        'operator' => '==',
                        'value' => 'digitalt',
                    ),
                ),
                array(
                    array(
                        'field' => 'field_arrangement_moteformat',
                        'operator' => '==',
                        'value' => 'hybrid',
                    ),
                ),
            ),
        ),

        // Kapasitet og tilgang
        array(
            'key' => 'field_arrangement_maks_deltakere',
            'label' => 'Maks antall deltakere',
            'name' => 'maks_deltakere',
            'type' => 'number',
            'instructions' => 'Sett til 0 for ubegrenset antall',
            'default_value' => 0,
            'min' => 0,
        ),
        array(
            'key' => 'field_arrangement_kun_for_medlemmer',
            'label' => 'Kun for medlemmer',
            'name' => 'kun_for_medlemmer',
            'type' => 'true_false',
            'instructions' => 'Kun innloggede medlemmer kan melde seg på',
            'message' => 'Dette arrangementet er kun for BIMVerdi-medlemmer',
            'default_value' => 0,
            'ui' => 1,
        ),
        array(
            'key' => 'field_arrangement_status',
            'label' => 'Status',
            'name' => 'arrangement_status',
            'type' => 'select',
            'instructions' => 'Nåværende status for arrangementet',
            'required' => 1,
            'choices' => array(
                'kommende' => 'Kommende',
                'paamelding_aapen' => 'Påmelding åpen',
                'fullbooket' => 'Fullbooket',
                'avlyst' => 'Avlyst',
            ),
            'default_value' => 'kommende',
        ),

        // Gravity Forms integrasjon
        array(
            'key' => 'field_arrangement_gf_form_id',
            'label' => 'Gravity Forms ID',
            'name' => 'gf_form_id',
            'type' => 'number',
            'instructions' => 'ID for Gravity Forms påmeldingsskjema (opprett skjemaet først)',
            'min' => 1,
        ),
    ),
    'location' => array(
        array(
            array(
                'param' => 'post_type',
                'operator' => '==',
                'value' => 'bv_arrangement',
            ),
        ),
    ),
    'menu_order' => 0,
    'position' => 'normal',
    'style' => 'default',
    'label_placement' => 'top',
    'instruction_placement' => 'label',
));

endif;
