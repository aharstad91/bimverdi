<?php
/**
 * ACF Field Groups for BIMVerdi
 * 
 * Register all field groups for Custom Post Types
 */

if( function_exists('acf_add_local_field_group') ):

// Field Group for Members (Medlemsbedrifter)
acf_add_local_field_group(array(
    'key' => 'group_members',
    'title' => 'Medlemsinformasjon',
    'fields' => array(
        array(
            'key' => 'field_company_name',
            'label' => 'Bedriftsnavn',
            'name' => 'company_name',
            'type' => 'text',
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
            'label' => 'Beskrivelse',
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
    ),
    'location' => array(
        array(
            array(
                'param' => 'post_type',
                'operator' => '==',
                'value' => 'members',
            ),
        ),
    ),
));

// Field Group for Tools (Verktøy)
acf_add_local_field_group(array(
    'key' => 'group_tools',
    'title' => 'Verktøyinformasjon',
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

endif;
