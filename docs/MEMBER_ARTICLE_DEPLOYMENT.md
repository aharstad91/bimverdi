# Member Article System - Deployment Guide

**Last Updated:** October 29, 2025
**Version:** 1.0.0

## Overview

This guide covers deploying the BimVerdi Member Article System from development (MAMP) to production (Servebolt).

---

## Pre-Deployment Checklist

- [ ] All tests passing locally
- [ ] No PHP warnings/errors in error logs
- [ ] Database backups created
- [ ] Email configuration verified
- [ ] Admin interface tested
- [ ] Front-end article editor tested
- [ ] API endpoints verified with curl

---

## Database Migration

### Export from Development

```bash
# Export MySQL database from MAMP
/Applications/MAMP/Library/bin/mysql80/bin/mysqldump -u root -proot bimverdi > bimverdi_backup_2025-10-29.sql

# Verify export includes article tables
grep -E "bv_member_article|article_" bimverdi_backup_2025-10-29.sql | head -20
```

### Import to Production

1. **Via Servebolt Dashboard:**
   - SSH into Servebolt server
   - Navigate to database backup section
   - Create new database if needed

2. **Via SSH:**
```bash
# SSH into Servebolt
ssh user@servebolt-domain.com

# Navigate to WordPress root
cd /path/to/wordpress

# Import database
mysql -u database_user -p database_name < bimverdi_backup_2025-10-29.sql

# Verify import
mysql -u database_user -p database_name -e "SELECT COUNT(*) FROM wp_posts WHERE post_type='bv_member_article';"
```

### Post-Import

1. Update WordPress configuration:
```bash
# Update database name/user in wp-config.php
# Update WP_HOME and WP_SITEURL for production URL
```

2. Update API URLs in frontend `.env.production`:
```bash
NEXT_PUBLIC_WORDPRESS_API_URL=https://your-domain.com/wordpress/index.php?rest_route=
NEXT_PUBLIC_GRAPHQL_ENDPOINT=https://your-domain.com/wordpress/graphql
```

3. Flush WordPress rewrite rules:
```php
// Via SSH or wp-cli
wp rewrite flush --hard
```

---

## Plugin Deployment

### Step 1: Prepare Plugin Files

```bash
# On local development
cd /Applications/MAMP/htdocs/bimverdi/wordpress/wp-content/plugins/bimverdi-member-articles

# Verify all files present
ls -la
# Should show:
# - bimverdi-member-articles.php (main plugin file)
# - inc/article-cpt.php
# - inc/article-acf-fields.php
# - inc/article-auto-populate.php
# - inc/article-rest-api.php
# - inc/article-admin-page.php
```

### Step 2: Upload to Production

**Option A: Via SFTP**
```bash
# From local machine
sftp user@servebolt-domain.com

# Navigate to plugins directory
cd /path/to/wordpress/wp-content/plugins/

# Upload plugin directory
put -r /Applications/MAMP/htdocs/bimverdi/wordpress/wp-content/plugins/bimverdi-member-articles
```

**Option B: Via SSH & Git**
```bash
# If using Git on production
ssh user@servebolt-domain.com
cd /path/to/wordpress/wp-content/plugins/
git clone https://your-repo.git bimverdi-member-articles
cd bimverdi-member-articles
git checkout main
```

### Step 3: Activate Plugin

1. **Via WordPress Admin:**
   - Go to wp-admin/plugins.php
   - Find "BimVerdi Member Articles"
   - Click "Activate"

2. **Via WP-CLI:**
```bash
wp plugin activate bimverdi-member-articles
```

### Step 4: Verify Installation

```bash
# Check plugin loads without errors
wp plugin list | grep bimverdi

# Verify REST API endpoints
curl https://your-domain.com/wordpress/index.php?rest_route=/bimverdi/v1/member-articles?user_id=1

# Check database tables created
mysql -u user -p database -e "SHOW TABLES LIKE 'wp_posts';" \
  | grep bv_member_article
```

---

## Environment Configuration

### WordPress Configuration

**wp-config.php additions:**

```php
// Email settings for article notifications
define('SMTPPORT', 587);
define('SMTPHOST', 'your-smtp-server.com');
define('SMTPUSERNAME', 'your-email@example.com');
define('SMTPPASSWORD', 'your-smtp-password');

// JWT Authentication (for API)
define('JWT_AUTH_SECRET_KEY', 'your-production-jwt-secret-key-here');

// Article system debug mode (disable in production)
define('BV_ARTICLES_DEBUG', false);
```

### Next.js Frontend Configuration

**.env.production:**

```bash
# WordPress API endpoints
NEXT_PUBLIC_WORDPRESS_API_URL=https://your-domain.com/wordpress/index.php?rest_route=
NEXT_PUBLIC_GRAPHQL_ENDPOINT=https://your-domain.com/wordpress/graphql

# Session security
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-production-nextauth-secret

# Analytics (optional)
NEXT_PUBLIC_GA_ID=your-google-analytics-id
```

---

## ACF Pro Configuration

### License Verification

1. **Activate ACF Pro:**
   - Go to ACF settings in WordPress admin
   - Enter your ACF Pro license key
   - Verify: should show "License Active"

2. **Sync Field Groups:**
```php
// In WordPress admin console or via PHP
// Export field group JSON from development
// Import to production for consistency
```

### Custom Post Type Registration

The plugin automatically registers:
- CPT: `bv_member_article`
- Statuses: `admin_review`, `rejected`

Verify in wp-admin: Posts > Member Articles

---

## Email Notification Setup

### Test Email Configuration

```bash
# Via WP-CLI
wp eval 'wp_mail("test@example.com", "Test Email", "This is a test");'

# Check WordPress error log
tail -f /path/to/wordpress/wp-content/debug.log
```

### Email Templates

Articles in production will send emails to:
- **Author:** When article approved/rejected
- **Admin:** When article submitted for review

Email templates are in:
```
wp-content/plugins/bimverdi-member-articles/inc/article-rest-api.php
```

Search for `wp_mail()` calls to customize.

---

## Performance Optimization

### Database Optimization

```sql
-- After importing database
OPTIMIZE TABLE wp_posts;
OPTIMIZE TABLE wp_postmeta;

-- Check article count
SELECT COUNT(*) FROM wp_posts WHERE post_type='bv_member_article';
```

### Cache Configuration

Add to `wp-config.php`:
```php
// Redis cache (if available on host)
define('WP_REDIS_DISABLED', false);
define('WP_CACHE', true);
```

### API Caching Headers

The Next.js frontend should cache API responses:
```typescript
// In Next.js API routes
const response = await fetch(wordPressUrl, {
  next: { revalidate: 3600 } // ISR: revalidate every hour
});
```

---

## Monitoring & Maintenance

### Health Check

```bash
# Test API endpoint
curl -I https://your-domain.com/wordpress/index.php?rest_route=/bimverdi/v1/member-articles

# Should return: HTTP 200 or 401 (if auth required)
# NOT 404 or 500
```

### Log Monitoring

```bash
# Watch WordPress error log in real-time
tail -f /path/to/wordpress/wp-content/debug.log

# Search for article-related errors
grep -i "article\|bimverdi" /path/to/wordpress/wp-content/debug.log
```

### Database Backups

**Automatic backups:**
- Servebolt provides automatic daily backups
- Configure retention in Servebolt dashboard
- Test restore process monthly

**Manual backup:**
```bash
mysqldump -u user -p database_name > backup_$(date +%Y%m%d_%H%M%S).sql
```

---

## Rollback Procedure

If deployment fails:

### 1. Revert Plugin

```bash
# Deactivate plugin
wp plugin deactivate bimverdi-member-articles

# Delete plugin files
rm -rf /path/to/wordpress/wp-content/plugins/bimverdi-member-articles

# OR revert to previous version via Git
cd /path/to/wordpress/wp-content/plugins/bimverdi-member-articles
git checkout HEAD~1
wp plugin activate bimverdi-member-articles
```

### 2. Restore Database

```bash
# Stop WordPress
wp plugin deactivate --all

# Restore from backup
mysql -u user -p database_name < backup_previous.sql

# Reactivate plugins
wp plugin activate --all
```

### 3. Verify

```bash
# Test API
curl https://your-domain.com/wordpress/index.php?rest_route=/bimverdi/v1/member-articles

# Check error logs
tail -f /path/to/wordpress/wp-content/debug.log
```

---

## Production Hardening

### Security Headers

Add to `.htaccess` or web server config:
```apache
# X-Frame-Options: Prevent clickjacking
Header always set X-Frame-Options "SAMEORIGIN"

# X-Content-Type-Options: Prevent MIME sniffing
Header always set X-Content-Type-Options "nosniff"

# X-XSS-Protection: Enable XSS filter
Header always set X-XSS-Protection "1; mode=block"

# Content-Security-Policy: Restrict content
Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
```

### Rate Limiting

Configure in web server or via plugin:
```nginx
# Nginx example
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;

location /bimverdi/wordpress/index.php?rest_route=/bimverdi/v1/ {
    limit_req zone=api_limit burst=20 nodelay;
}
```

### File Permissions

```bash
# Set proper permissions
find /path/to/wordpress/wp-content/plugins/bimverdi-member-articles -type f -exec chmod 644 {} \;
find /path/to/wordpress/wp-content/plugins/bimverdi-member-articles -type d -exec chmod 755 {} \;

# Protect wp-config.php
chmod 600 /path/to/wordpress/wp-config.php
```

---

## Troubleshooting Deployment Issues

See `MEMBER_ARTICLE_TROUBLESHOOTING.md` for:
- Plugin activation errors
- Database migration issues
- Email notification failures
- API endpoint errors

---

## Support & Escalation

1. **Check error logs first:** `/path/to/wordpress/wp-content/debug.log`
2. **Test API endpoint:** Use curl to verify endpoints
3. **Database integrity:** Run SQL checks
4. **Contact Servebolt support:** For server/hosting issues

---

## Version Management

Track deployed version:
```bash
# Add to wp-admin dashboard or custom page
echo "Deployed: bimverdi-member-articles v1.0.0 on $(date)"
```

Update when deploying new versions:
```php
// In bimverdi-member-articles.php
define('BV_ARTICLES_VERSION', '1.1.0');
```

---

## Post-Deployment Testing

### Admin Interface
- [ ] Login to wp-admin
- [ ] Navigate to "Medlemsartikler" menu
- [ ] Verify pending articles display
- [ ] Test approve/reject workflow

### API Endpoints
- [ ] Test `/member-articles` GET
- [ ] Test `/member-articles` POST (create)
- [ ] Test `/member-articles/{id}` PUT (update)
- [ ] Test `/member-articles/{id}/submit` POST
- [ ] Test `/member-articles/{id}/review` POST (admin)

### Frontend
- [ ] Create new article
- [ ] Submit for review
- [ ] Verify email notification sent
- [ ] Admin approves article
- [ ] Verify article published

---

**Estimated Deployment Time:** 30-45 minutes

**Next:** See `MEMBER_ARTICLE_API.md` for detailed API documentation
