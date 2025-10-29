<?php
define('WP_USE_THEMES', false);
require_once('./wp-load.php');

// Get user
$user = get_user_by('email', 'andreas@aharstad.no');
if (!$user) {
    echo '❌ User not found' . PHP_EOL;
    exit(1);
}

// Create test article
$post_data = [
    'post_title'   => 'Test Medlemsartikkel - BIM i praksis',
    'post_type'    => 'bv_member_article',
    'post_status'  => 'draft',
    'post_author'  => $user->ID,
];

$post_id = wp_insert_post($post_data);

if (is_wp_error($post_id)) {
    echo '❌ Error creating post: ' . $post_id->get_error_message() . PHP_EOL;
    exit(1);
}

// Add content
update_field('article_content_html', '<h2>Innledning</h2><p>Dette er en testartikkel om BIM i praksis. Vi har testet forskjellige metoder for å implementere BIM i små og mellomstore prosjekter.</p><p>Resultatene var svært positive.</p>', $post_id);

echo '✅ Test article created!' . PHP_EOL;
echo 'Article ID: ' . $post_id . PHP_EOL;
echo 'Status: ' . get_post_status($post_id) . PHP_EOL;
echo 'Author name: ' . get_field('article_author_name', $post_id) . PHP_EOL;
echo 'Company name: ' . get_field('article_company_name', $post_id) . PHP_EOL;
echo 'Word count: ' . get_field('article_word_count', $post_id) . PHP_EOL;
echo 'Excerpt: ' . get_field('article_excerpt', $post_id) . PHP_EOL;
