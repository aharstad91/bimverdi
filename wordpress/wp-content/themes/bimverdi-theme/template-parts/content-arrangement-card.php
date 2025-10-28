<?php
/**
 * Template Part: Arrangement Card
 * Viser et enkelt arrangement-kort i grid
 */

$post_id = get_the_ID();

// Hent ACF-felt
$dato_start = get_field('dato_start');
$tidspunkt = get_field('tidspunkt_start');
$moteformat = get_field('moteformat');
$poststed = get_field('poststed');
$status = get_field('arrangement_status');
$maks_deltakere = get_field('maks_deltakere');

// Hent arrangement-typer
$types = get_the_terms($post_id, 'arrangement_type');
$type_name = $types && !is_wp_error($types) ? $types[0]->name : '';

// Beregn påmeldte og fullbooket-status
$pameldte_count = bv_get_pameldte_count($post_id);
$is_full = bv_is_arrangement_full($post_id);

// Status badge
$status_class = 'status-' . $status;
if ($is_full) {
    $status_class = 'status-fullbooket';
    $status = 'fullbooket';
}

// Format icon
$format_icon = bv_get_format_icon($moteformat);

// Formatted date
$formatted_date = bv_format_date($dato_start);
?>

<article id="post-<?php the_ID(); ?>" <?php post_class('arrangement-card'); ?>>
    <?php if (has_post_thumbnail()) : ?>
        <div class="arrangement-thumbnail">
            <a href="<?php the_permalink(); ?>">
                <?php the_post_thumbnail('medium_large'); ?>
            </a>
            <span class="status-badge <?php echo esc_attr($status_class); ?>">
                <?php echo esc_html(bv_get_status_label($status)); ?>
            </span>
        </div>
    <?php endif; ?>

    <div class="arrangement-content">
        <div class="arrangement-meta">
            <?php if ($type_name) : ?>
                <span class="arrangement-type"><?php echo esc_html($type_name); ?></span>
            <?php endif; ?>
            <span class="arrangement-format"><?php echo $format_icon; ?> <?php echo esc_html(ucfirst($moteformat)); ?></span>
        </div>

        <h2 class="arrangement-title">
            <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
        </h2>

        <div class="arrangement-date-time">
            <span class="date">📅 <?php echo esc_html($formatted_date); ?></span>
            <?php if ($tidspunkt) : ?>
                <span class="time">🕐 <?php echo esc_html($tidspunkt); ?></span>
            <?php endif; ?>
        </div>

        <?php if ($poststed && in_array($moteformat, ['fysisk', 'hybrid'])) : ?>
            <div class="arrangement-location">
                <span>📍 <?php echo esc_html($poststed); ?></span>
            </div>
        <?php endif; ?>

        <?php if (has_excerpt()) : ?>
            <div class="arrangement-excerpt">
                <?php the_excerpt(); ?>
            </div>
        <?php endif; ?>

        <div class="arrangement-footer">
            <?php if ($maks_deltakere > 0) : ?>
                <div class="arrangement-capacity">
                    <span class="capacity-count"><?php echo $pameldte_count; ?> / <?php echo $maks_deltakere; ?> påmeldt</span>
                </div>
            <?php endif; ?>

            <a href="<?php the_permalink(); ?>" class="btn-more">
                Les mer →
            </a>
        </div>
    </div>
</article>
