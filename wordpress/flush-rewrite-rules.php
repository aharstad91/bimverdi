<?php
/**
 * Flush WordPress rewrite rules
 * Kjør denne filen én gang for å regenerere permalinks
 */

// Load WordPress
require_once(__DIR__ . '/wp-load.php');

// Flush rewrite rules
flush_rewrite_rules();

echo "✅ Rewrite rules flushed!\n";
echo "📍 Test arrangementet nå:\n";
echo "   http://localhost:8888/bimverdi/wordpress/arrangement/bimtech-mote-digital-tvilling-i-praksis/\n";
