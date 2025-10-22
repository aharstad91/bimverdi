<?php
/**
 * BIMVerdi wp-config.php
 * Supports both local (MAMP) and production (Servebolt) environments
 */

// ** Environment Detection ** //
// Detects if we're on Servebolt or local MAMP
$is_servebolt = (strpos($_SERVER['HTTP_HOST'], 'servebolt') !== false || 
                 strpos($_SERVER['HTTP_HOST'], 'bimverdi.no') !== false);

if ($is_servebolt) {
    // ** PRODUCTION - Servebolt Configuration ** //
    // TODO: Replace these with actual Servebolt database credentials
    define( 'DB_NAME', 'REPLACE_WITH_SERVEBOLT_DB_NAME' );
    define( 'DB_USER', 'REPLACE_WITH_SERVEBOLT_DB_USER' );
    define( 'DB_PASSWORD', 'REPLACE_WITH_SERVEBOLT_DB_PASSWORD' );
    define( 'DB_HOST', 'REPLACE_WITH_SERVEBOLT_DB_HOST' );
    
    // Servebolt SSL handling
    if (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https') {
        $_SERVER['HTTPS'] = 'on';
    }
    
    // Production URLs
    define('WP_HOME', 'https://bimverdi.no');
    define('WP_SITEURL', 'https://bimverdi.no');
    
    // Servebolt Cache
    define('WP_CACHE', true);
    define('DISABLE_WP_CRON', true); // Use system cron
    
    // Security
    define('DISALLOW_FILE_EDIT', true);
    define('AUTOMATIC_UPDATER_DISABLED', false);
    
    // Production JWT key
    define('JWT_AUTH_SECRET_KEY', 'REPLACE_WITH_STRONG_PRODUCTION_KEY');
    
} else {
    // ** LOCAL - MAMP Configuration ** //
    define( 'DB_NAME', 'bimverdi' );
    define( 'DB_USER', 'root' );
    define( 'DB_PASSWORD', 'root' );
    define( 'DB_HOST', 'localhost' );
    
    // Local URLs
    define('WP_HOME', 'http://localhost:8888/bimverdi/wordpress');
    define('WP_SITEURL', 'http://localhost:8888/bimverdi/wordpress');
    
    // Development settings
    define('WP_DEBUG', true);
    define('WP_DEBUG_LOG', true);
    define('WP_DEBUG_DISPLAY', false);
    
    // Local JWT key
    define('JWT_AUTH_SECRET_KEY', 'bimverdi-local-jwt-secret-key');
}

// ** Database Settings (Common) ** //
define( 'DB_CHARSET', 'utf8mb4' );
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication Unique Keys and Salts.
 */
define('AUTH_KEY',         'w/?#lS;0VD+k6/+pJR)3^#+{R(d2FF|[}$CY[8NM.w6Qaok.CPpP7aL|4Usg<^ei');
define('SECURE_AUTH_KEY',  '4+QA_.Q_qVhOnl?HFlsVu 6.|R8pU9Tl$k8aaNXhA1boIw((LMh5J9hD7|X&O>K|');
define('LOGGED_IN_KEY',    'r:u9=u5sDDvCXZ(0c{|_xZZyfP]b>L#8jxjMO>ON6=?Ib+Tf`GO+M0TGQ0Wxgiy{');
define('NONCE_KEY',        'PSVP;4lW^v!f*~-E0P1M.A 2x@M1kg=)`i+JP-nf)eXl$-[-!5x{$nZ*q_/A553e');
define('AUTH_SALT',        'e2) ewG0iEh{%LYB=.z~0B)HjM$d.q4s6at50<QZ&]Ij)Cx&`N<VX1eH/DjC4qp!');
define('SECURE_AUTH_SALT', 'tA~4<UoZc;TnMu? (>N-DW>2dyMo=FnZ`Woi2&X7=MKEDU2$|$sAJMG U-:;HWUh');
define('LOGGED_IN_SALT',   'XO~[-EY|-_TOd+TeA(+UoFqZ~-c5w/Ifx$IQ]Z-jo+T:RM;oZ2LwI#NQWpK13DmL');
define('NONCE_SALT',       'R|8fRs!{:a7D&`MY-rCbL_([wN|k{3z!d&d tL(%Ic2QG$>#d1Nh$;ULL@njxE^N');

/**#@-*/

/**
 * WordPress Database Table prefix.
 */
$table_prefix = 'wp_';

/**
 * Headless WordPress Settings (Common)
 */
define('JWT_AUTH_CORS_ENABLE', true);

// CORS for Next.js frontend
$allowed_origins = array(
    'http://localhost:3000', // Local development
    'https://frontend.bimverdi.no', // Production frontend
    'https://www.bimverdi.no',
    'https://bimverdi.no'
);

if (isset($_SERVER['HTTP_ORIGIN']) && in_array($_SERVER['HTTP_ORIGIN'], $allowed_origins)) {
    header('Access-Control-Allow-Origin: ' . $_SERVER['HTTP_ORIGIN']);
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Authorization, Content-Type, X-WP-Nonce');
}

/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
