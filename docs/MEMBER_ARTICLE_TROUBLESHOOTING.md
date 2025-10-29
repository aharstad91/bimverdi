# Member Article System - Troubleshooting Guide

**Last Updated:** October 29, 2025
**Version:** 1.0.0

## Quick Diagnostic

### Step 1: Check Plugin Status

```bash
# Is plugin activated?
wp plugin list | grep bimverdi-member-articles

# Expected output:
# bimverdi-member-articles     BimVerdi Member Articles       1.0.0       active
```

### Step 2: Test REST API

```bash
# Test endpoint
curl http://localhost:8888/bimverdi/wordpress/index.php?rest_route=/bimverdi/v1/member-articles?user_id=4

# Expected: Array of articles or empty array (status 200)
# NOT 404 or 500
```

### Step 3: Check Error Logs

```bash
# WordPress error log
tail -50 /Applications/MAMP/htdocs/bimverdi/wordpress/wp-content/debug.log

# MAMP PHP error log
tail -50 /Applications/MAMP/logs/php_error.log
```

---

## Common Issues & Solutions

### Issue 1: "404 Not Found" on API Endpoint

**Symptoms:**
```
curl: (22) The requested URL returned error: 404 Not Found
```

**Causes:**
1. Plugin not activated
2. Rewrite rules not flushed
3. REST route not registered

**Solutions:**

```bash
# 1. Check plugin is active
wp plugin activate bimverdi-member-articles

# 2. Flush rewrite rules
wp rewrite flush --hard

# 3. Verify route registered
wp eval 'var_dump(get_rest_url(0, "bimverdi/v1/member-articles"));'

# 4. Check PHP error log
tail -20 /Applications/MAMP/logs/php_error.log
```

**If still failing:**
```bash
# Restart MAMP services
# Open MAMP app → Stop Servers → Start Servers
# Wait 5 seconds
# Test again
```

---

### Issue 2: "401 Unauthorized"

**Symptoms:**
```json
{
  "success": false,
  "message": "Unauthorized"
}
```

**Causes:**
1. `user_id` parameter missing from URL
2. `user_id` parameter not numeric
3. User doesn't exist in WordPress

**Solutions:**

```bash
# Verify user exists in WordPress
mysql -u root -proot bimverdi -e "SELECT ID, user_login FROM wp_users WHERE ID=4;"

# Expected output:
# | ID | user_login |
# | 4  | ulrik      |

# Test with correct user_id parameter
curl "http://localhost:8888/bimverdi/wordpress/index.php?rest_route=/bimverdi/v1/member-articles?user_id=4"

# List all users
wp user list
```

---

### Issue 3: Admin Interface Not Showing

**Symptoms:**
- No "Medlemsartikler" menu in wp-admin sidebar
- Menu appears but page is blank

**Causes:**
1. `article-admin-page.php` not loaded
2. User doesn't have `manage_options` capability
3. PHP error in admin file

**Solutions:**

```bash
# Verify file exists
ls -la /Applications/MAMP/htdocs/bimverdi/wordpress/wp-content/plugins/bimverdi-member-articles/inc/article-admin-page.php

# Verify include in main plugin file
grep -n "article-admin-page" /Applications/MAMP/htdocs/bimverdi/wordpress/wp-content/plugins/bimverdi-member-articles/bimverdi-member-articles.php

# Check current user has admin capability
wp eval 'var_dump(current_user_can("manage_options"));'

# Check error log
tail -20 /Applications/MAMP/logs/php_error.log
```

**Re-register admin menu:**
```php
// Via WordPress admin console
wp plugin deactivate bimverdi-member-articles
wp plugin activate bimverdi-member-articles

// Then reload wp-admin
```

---

### Issue 4: Article Created But Not Visible

**Symptoms:**
- POST to `/member-articles` returns success
- Article not showing in list/admin panel
- Database check shows post exists

**Causes:**
1. Article status not set correctly
2. Post type mismatch (bv_member_article vs custom)
3. CPT not registered properly

**Solutions:**

```bash
# Check database directly
mysql -u root -proot bimverdi -e "SELECT ID, post_title, post_status, post_type FROM wp_posts WHERE post_type='bv_member_article' LIMIT 5;"

# Expected post_type: bv_member_article
# Expected post_status: draft, admin_review, publish, rejected

# Re-register CPT
wp eval 'do_action("init");'

# Flush rewrite rules
wp rewrite flush --hard
```

**If CPT not registered:**
```bash
# Check article-cpt.php for errors
php -l /Applications/MAMP/htdocs/bimverdi/wordpress/wp-content/plugins/bimverdi-member-articles/inc/article-cpt.php

# Should output: "No syntax errors detected"
```

---

### Issue 5: Email Notifications Not Sent

**Symptoms:**
- Article approved but author doesn't receive email
- No email in error log
- Admin notification missing

**Causes:**
1. Email/SMTP not configured
2. `wp_mail()` failing silently
3. Email address not found on user

**Solutions:**

```bash
# Test WordPress email function
wp eval 'wp_mail("test@example.com", "Test", "Testing email");'

# Check for SMTP errors
tail -30 /Applications/MAMP/logs/php_error.log

# Verify SMTP settings
wp config get SMTP_HOST
wp config get SMTP_PORT

# Check user has email
wp user get 4 --field=user_email
```

**Configure SMTP locally (MAMP):**
```bash
# MAMP uses local mail function by default
# To test, use mailhog or similar local SMTP service

# Or configure in wp-config.php:
define('SMTPHOST', 'localhost');
define('SMTPPORT', 1025); // mailhog default
```

---

### Issue 6: Approve/Reject Not Working in Admin

**Symptoms:**
- Buttons appear in admin interface
- Clicking approve/reject does nothing
- No JavaScript errors in console

**Causes:**
1. REST endpoint failing
2. User not admin
3. JavaScript fetch issue

**Solutions:**

```bash
# Test approve endpoint directly
curl -X POST "http://localhost:8888/bimverdi/wordpress/index.php?rest_route=/bimverdi/v1/member-articles/28/review?user_id=1" \
  -H "Content-Type: application/json" \
  -d '{"action": "approve", "reviewer_notes": "test"}'

# Check error
# Should return: {"success": true, "message": "Artikkel godkjent og publisert"}

# If 403 error: user is not admin
wp user list --role=administrator

# Check browser console for JavaScript errors
# Open wp-admin in browser → F12 → Console tab
```

**Re-register admin menu:**
```bash
wp plugin deactivate bimverdi-member-articles
wp plugin activate bimverdi-member-articles
```

---

### Issue 7: "Undefined function" Errors

**Symptoms:**
```
Fatal error: Call to undefined function bv_get_authenticated_user_id()
```

**Causes:**
1. Plugin files not loading in correct order
2. Function defined in file that didn't load
3. Missing include statement

**Solutions:**

```bash
# Check all plugin files load
wp eval 'var_dump(function_exists("bv_register_member_article_cpt"));'

# Should output: true

# Check include order in main plugin file
cat /Applications/MAMP/htdocs/bimverdi/wordpress/wp-content/plugins/bimverdi-member-articles/bimverdi-member-articles.php | grep "require_once"

# Verify function exists in file
grep -n "function bv_get_authenticated_user_id" /Applications/MAMP/htdocs/bimverdi/wordpress/wp-content/plugins/bimverdi-member-articles/inc/article-rest-api.php
```

**If function not found:**
- Check `article-rest-api.php` exists and contains function
- Verify file permissions: `chmod 644`
- Check for syntax errors: `php -l article-rest-api.php`

---

### Issue 8: Database Migration Issues

**Symptoms:**
- Articles visible in one environment but not another
- "Table not found" errors
- Post type changes after migration

**Causes:**
1. Database not fully backed up
2. Table prefix mismatch
3. Post type registration failed

**Solutions:**

```bash
# Check WordPress table prefix
grep "\$table_prefix" /Applications/MAMP/htdocs/bimverdi/wordpress/wp-config.php

# List all custom tables
mysql -u root -proot bimverdi -e "SHOW TABLES LIKE 'wp_%';" | grep article

# Verify post types
mysql -u root -proot bimverdi -e "SELECT DISTINCT post_type FROM wp_posts ORDER BY post_type;"

# Re-register CPT after migration
wp rewrite flush --hard
```

---

### Issue 9: ACF Fields Missing

**Symptoms:**
- Article created but custom fields empty
- "Field not found" errors when updating
- Review status not saving

**Causes:**
1. ACF not activated
2. Field groups not registered
3. ACF Pro license expired

**Solutions:**

```bash
# Check ACF plugin status
wp plugin list | grep advanced-custom-fields

# Should show: "active"

# Check field groups registered
wp eval 'var_dump(acf_get_field_groups());' | head -20

# Verify article field group
mysql -u root -proot bimverdi -e "SELECT * FROM wp_posts WHERE post_type='acf-field-group' AND post_title LIKE '%Article%';"
```

**Re-register ACF field groups:**
1. Go to wp-admin: Custom Fields > Field Groups
2. Find "Member Article" field groups
3. Click "Export JSON" on each
4. Verify they export correctly

---

### Issue 10: Frontend Not Connecting to API

**Symptoms:**
- Next.js page shows "Error loading articles"
- Console shows `fetch` 404 errors
- API URL in browser Network tab is wrong

**Causes:**
1. `NEXT_PUBLIC_WORDPRESS_API_URL` not set
2. WordPress API URL incorrect
3. CORS issue

**Solutions:**

**Check Next.js environment:**
```bash
# Check .env.local has correct URL
cat /Applications/MAMP/htdocs/bimverdi/frontend/.env.local | grep WORDPRESS_API_URL

# Should show:
# NEXT_PUBLIC_WORDPRESS_API_URL=http://localhost:8888/bimverdi/wordpress/index.php?rest_route=

# Restart Next.js dev server
cd /Applications/MAMP/htdocs/bimverdi/frontend
npm run dev
```

**Check CORS in browser:**
```javascript
// Open browser console (F12) and run:
fetch('http://localhost:8888/bimverdi/wordpress/index.php?rest_route=/bimverdi/v1/member-articles?user_id=4')
  .then(r => r.json())
  .then(d => console.log(d))
  .catch(e => console.error(e))
```

**Add CORS header to WordPress:**
```php
// In wp-config.php or plugin
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
```

---

## Performance Issues

### Slow Article Load

**Symptoms:**
- API response takes >2 seconds
- Admin page takes long time to load
- Database queries slow

**Diagnosis:**
```bash
# Enable query logging in wp-config.php
define('SAVEQUERIES', true);

# Then check the queries
wp eval 'global $wpdb; var_dump($wpdb->queries);'

# Identify slow queries (>0.5s)
```

**Optimization:**

```sql
-- Add indexes to speed up queries
ALTER TABLE wp_posts ADD INDEX post_type_status (post_type, post_status);
ALTER TABLE wp_postmeta ADD INDEX meta_key_value (meta_key, meta_value(50));

-- Check indexes created
SHOW INDEXES FROM wp_posts;
```

### High Memory Usage

**Symptoms:**
- "Allowed memory size" errors
- PHP crashes when loading admin page

**Solutions:**

```php
// In wp-config.php, increase memory limit
define('WP_MEMORY_LIMIT', '256M');
define('WP_MAX_MEMORY_LIMIT', '512M');
```

---

## Debug Mode

### Enable Full Debugging

```php
// In wp-config.php
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
define('WP_DEBUG_DISPLAY', false);
define('SCRIPT_DEBUG', true);

// Check logs
tail -50 /Applications/MAMP/htdocs/bimverdi/wordpress/wp-content/debug.log
```

### Test Mode

```bash
# Enable development mode
wp option update siteurl 'http://localhost:8888/bimverdi/wordpress'
wp option update home 'http://localhost:8888/bimverdi/wordpress'

# Disable caching
wp config set WP_CACHE false

# Clear any caches
wp cache flush
```

---

## Getting Help

### Gather Information

```bash
# System info
wp --info

# Plugin info
wp plugin list --field=name,status,version

# User with admin role
wp user list --role=administrator

# Last 50 errors
tail -50 /Applications/MAMP/logs/php_error.log

# Database size
mysql -u root -proot -e "SELECT table_name, ROUND(((data_length + index_length) / 1024 / 1024), 2) AS size_mb FROM information_schema.tables WHERE table_schema = 'bimverdi' ORDER BY size_mb DESC;"
```

### Contact Support

Include:
1. Error log output (last 50 lines)
2. `wp --info` output
3. Exact steps to reproduce
4. Expected vs actual behavior
5. Screenshots of error (if UI related)

---

## Quick Reference

| Problem | Quick Fix |
|---------|----------|
| No "Medlemsartikler" menu | `wp plugin deactivate/activate bimverdi-member-articles` |
| 404 on API | `wp rewrite flush --hard` |
| 401 Unauthorized | Add `?user_id=4` to URL |
| Emails not sending | Check `/Applications/MAMP/logs/php_error.log` |
| Article not visible | Check database: `SELECT * FROM wp_posts WHERE post_type='bv_member_article'` |
| ACF fields missing | Activate ACF Pro + re-export field groups |
| Frontend can't connect | Check `NEXT_PUBLIC_WORDPRESS_API_URL` in `.env.local` |
| Approve button not working | Check user is admin: `wp user get 1 --field=roles` |

---

## Further Reading

- API Documentation: `docs/MEMBER_ARTICLE_API.md`
- Deployment Guide: `docs/MEMBER_ARTICLE_DEPLOYMENT.md`
- Admin Guide: Next section

---

**Last Updated:** October 29, 2025
