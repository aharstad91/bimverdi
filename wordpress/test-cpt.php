<?php
require 'wp-load.php';

// Get ALL post types
$post_types = get_post_types([], 'objects');

if (isset($post_types['bv_member_article'])) {
    echo "✅ CPT 'bv_member_article' IS REGISTERED!\n";
    $cpt = $post_types['bv_member_article'];
    echo "Label: " . $cpt->label . "\n";
    echo "Public: " . ($cpt->public ? 'Yes' : 'No') . "\n";
    echo "Show in REST: " . ($cpt->show_in_rest ? 'Yes' : 'No') . "\n";
    echo "REST Base: " . $cpt->rest_base . "\n";
} else {
    echo "❌ CPT 'bv_member_article' NOT found\n";
    echo "Available CPTs: " . implode(', ', array_keys($post_types)) . "\n";
}
