<?php
/**
 * Template Name: Arrangement Archive
 * Description: Viser liste over alle arrangementer
 */

get_header(); ?>

<div class="bv-arrangement-archive">
    <div class="container">
        <header class="page-header">
            <h1 class="page-title">Arrangementer</h1>
            <?php if (have_posts()) : ?>
                <p class="archive-description">Kommende BIM-arrangementer, workshops og nettverkstreff</p>
            <?php endif; ?>
        </header>

        <?php if (have_posts()) : ?>
            <div class="arrangement-grid">
                <?php
                while (have_posts()) : the_post();
                    get_template_part('template-parts/content', 'arrangement-card');
                endwhile;
                ?>
            </div>

            <?php
            // Pagination
            the_posts_pagination(array(
                'mid_size' => 2,
                'prev_text' => __('« Forrige', 'bimverdi'),
                'next_text' => __('Neste »', 'bimverdi'),
            ));
            ?>

        <?php else : ?>
            <div class="no-arrangements">
                <p>Ingen arrangementer funnet for øyeblikket.</p>
                <p><a href="<?php echo home_url(); ?>">Tilbake til forsiden</a></p>
            </div>
        <?php endif; ?>
    </div>
</div>

<?php get_footer(); ?>
