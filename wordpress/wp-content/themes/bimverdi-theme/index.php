<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
    <div style="max-width: 1200px; margin: 0 auto; padding: 40px 20px;">
        <h1>BIMVerdi - Headless WordPress Backend</h1>
        <p>Dette er backend-en for BIMVerdi. Frontend kjører på Next.js.</p>
        <ul>
            <li><a href="<?php echo admin_url(); ?>">Gå til WordPress Admin</a></li>
            <li><a href="<?php echo rest_url(); ?>">REST API</a></li>
            <li><a href="http://localhost:3000">Frontend (Next.js)</a></li>
        </ul>
    </div>
    <?php wp_footer(); ?>
</body>
</html>
