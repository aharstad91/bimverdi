<?php
/**
 * Template Name: Single Arrangement
 * Description: Viser enkelt arrangement med påmeldingsskjema
 */

get_header();

while (have_posts()) : the_post();
    $post_id = get_the_ID();
    
    // Hent ACF-felt
    $dato_start = get_field('dato_start');
    $tidspunkt = get_field('tidspunkt_start');
    $pameldingsfrist = get_field('pameldingsfrist');
    $moteformat = get_field('moteformat');
    $adresse = get_field('adresse');
    $poststed = get_field('poststed');
    $digital_link = get_field('digital_link');
    $maks_deltakere = get_field('maks_deltakere');
    $kun_for_medlemmer = get_field('kun_for_medlemmer');
    $status = get_field('arrangement_status');
    $gf_form_id = get_field('gf_form_id');
    
    // Hent arrangement-typer
    $types = get_the_terms($post_id, 'arrangement_type');
    $type_name = $types && !is_wp_error($types) ? $types[0]->name : '';
    
    // Sjekk tilgangskontroll
    $is_user_logged_in = is_user_logged_in();
    $is_member = bv_user_is_medlem();
    $is_registered = bv_user_is_registered($post_id);
    $is_full = bv_is_arrangement_full($post_id);
    $is_registration_closed = bv_is_registration_closed($post_id);
    $pameldte_count = bv_get_pameldte_count($post_id);
    
    // Format icon
    $format_icon = bv_get_format_icon($moteformat);
    $formatted_date = bv_format_date($dato_start);
    
    // Kan brukeren melde seg på?
    $can_register = true;
    $register_message = '';
    
    if ($status === 'avlyst') {
        $can_register = false;
        $register_message = '⚠️ Dette arrangementet er avlyst.';
    } elseif ($is_registration_closed) {
        $can_register = false;
        $register_message = '⏰ Påmeldingsfristen har passert.';
    } elseif ($is_full) {
        $can_register = false;
        $register_message = '🚫 Dette arrangementet er fullbooket.';
    } elseif ($is_registered) {
        $can_register = false;
        $register_message = '✅ Du er allerede påmeldt dette arrangementet.';
    } elseif ($kun_for_medlemmer && !$is_member) {
        $can_register = false;
        $register_message = '🔒 Dette arrangementet er kun for BIMVerdi-medlemmer. <a href="' . wp_login_url(get_permalink()) . '">Logg inn</a> for å melde deg på.';
    }
    ?>

    <article id="post-<?php the_ID(); ?>" <?php post_class('single-arrangement'); ?>>
        <div class="container">
            <div class="arrangement-layout">
                <!-- Main Content -->
                <div class="arrangement-main">
                    <?php if (has_post_thumbnail()) : ?>
                        <div class="arrangement-featured-image">
                            <?php the_post_thumbnail('large'); ?>
                        </div>
                    <?php endif; ?>

                    <header class="arrangement-header">
                        <?php if ($type_name) : ?>
                            <span class="arrangement-type-badge"><?php echo esc_html($type_name); ?></span>
                        <?php endif; ?>
                        
                        <h1 class="arrangement-title"><?php the_title(); ?></h1>
                        
                        <div class="arrangement-status-bar">
                            <span class="status-badge status-<?php echo esc_attr($status); ?>">
                                <?php echo esc_html(bv_get_status_label($status)); ?>
                            </span>
                            <span class="format-badge">
                                <?php echo $format_icon; ?> <?php echo esc_html(ucfirst($moteformat)); ?>
                            </span>
                        </div>
                    </header>

                    <div class="arrangement-content-area">
                        <?php the_content(); ?>
                    </div>
                </div>

                <!-- Sidebar with Info and Registration -->
                <aside class="arrangement-sidebar">
                    <div class="sidebar-widget praktisk-info">
                        <h3>Praktisk informasjon</h3>
                        
                        <div class="info-item">
                            <strong>📅 Dato:</strong>
                            <span><?php echo esc_html($formatted_date); ?></span>
                        </div>
                        
                        <?php if ($tidspunkt) : ?>
                            <div class="info-item">
                                <strong>🕐 Tid:</strong>
                                <span><?php echo esc_html($tidspunkt); ?></span>
                            </div>
                        <?php endif; ?>
                        
                        <?php if ($moteformat === 'fysisk' || $moteformat === 'hybrid') : ?>
                            <?php if ($adresse) : ?>
                                <div class="info-item">
                                    <strong>📍 Adresse:</strong>
                                    <span><?php echo esc_html($adresse); ?></span>
                                </div>
                            <?php endif; ?>
                            <?php if ($poststed) : ?>
                                <div class="info-item">
                                    <strong>Sted:</strong>
                                    <span><?php echo esc_html($poststed); ?></span>
                                </div>
                            <?php endif; ?>
                        <?php endif; ?>
                        
                        <?php if (($moteformat === 'digitalt' || $moteformat === 'hybrid') && $digital_link && $is_registered) : ?>
                            <div class="info-item">
                                <strong>💻 Digital lenke:</strong>
                                <a href="<?php echo esc_url($digital_link); ?>" target="_blank" rel="noopener">
                                    Åpne møtelenke
                                </a>
                            </div>
                        <?php endif; ?>
                        
                        <?php if ($pameldingsfrist) : ?>
                            <div class="info-item">
                                <strong>⏰ Påmeldingsfrist:</strong>
                                <span><?php echo date('d.m.Y H:i', strtotime($pameldingsfrist)); ?></span>
                            </div>
                        <?php endif; ?>
                        
                        <?php if ($maks_deltakere > 0) : ?>
                            <div class="info-item capacity-info">
                                <strong>👥 Kapasitet:</strong>
                                <span><?php echo $pameldte_count; ?> / <?php echo $maks_deltakere; ?> påmeldt</span>
                            </div>
                        <?php endif; ?>
                    </div>

                    <!-- Registration Form -->
                    <div class="sidebar-widget pamelding-widget">
                        <h3>Påmelding</h3>
                        
                        <?php if (!$can_register) : ?>
                            <div class="register-message">
                                <?php echo $register_message; ?>
                            </div>
                        <?php else : ?>
                            <?php if ($gf_form_id && function_exists('gravity_form')) : ?>
                                <div class="gravity-form-wrapper">
                                    <?php
                                    gravity_form(
                                        $gf_form_id,
                                        false, // display_title
                                        false, // display_description
                                        false, // display_inactive
                                        array('arrangement_id' => $post_id), // field_values
                                        true, // ajax
                                        '', // tabindex
                                        true // echo
                                    );
                                    ?>
                                </div>
                            <?php else : ?>
                                <p class="no-form-message">Påmeldingsskjema er ikke konfigurert ennå. Kontakt admin.</p>
                            <?php endif; ?>
                        <?php endif; ?>
                    </div>
                </aside>
            </div>
        </div>
    </article>

<?php endwhile;

get_footer();
?>
