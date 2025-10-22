# BimVerdi - Complete Setup Guide

> **Complete guide** for setting up BimVerdi development environment from scratch.

---

## 🎯 Prerequisites

Before you begin, ensure you have:

- ✅ **MAMP** (Mac Apache MySQL PHP) installed
- ✅ **Node.js** v18+ and npm
- ✅ **Git** for version control
- ✅ **VS Code** or preferred code editor
- ✅ Basic knowledge of WordPress, React, and TypeScript

---

## 📦 Part 1: Initial Project Setup

### 1.1 Clone Repository

```bash
cd /Applications/MAMP/htdocs
git clone <repository-url> bimverdi
cd bimverdi
```

### 1.2 Verify Directory Structure

```bash
ls -la
# Should see:
# - wordpress/
# - frontend/
# - README.md
# - .gitignore
```

---

## 🗄️ Part 2: Database Setup

### 2.1 Start MAMP

```bash
# Open MAMP application
# Click "Start Servers"
# Verify Apache (port 8888) and MySQL (port 8889) are running
```

### 2.2 Create Database

**Option A - Via phpMyAdmin (Recommended):**

1. Open: http://localhost:8888/phpMyAdmin
2. Click "New" in left sidebar
3. Database name: `bimverdi`
4. Collation: `utf8mb4_unicode_ci`
5. Click "Create"

**Option B - Via MySQL CLI:**

```bash
/Applications/MAMP/Library/bin/mysql80/bin/mysql -u root -proot -e "CREATE DATABASE IF NOT EXISTS bimverdi CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

### 2.3 Verify Database

```bash
# List databases
/Applications/MAMP/Library/bin/mysql80/bin/mysql -u root -proot -e "SHOW DATABASES;" | grep bimverdi

# Should output: bimverdi
```

---

## 🔧 Part 3: WordPress Backend Setup

### 3.1 Configure WordPress

**A) If wp-config.php doesn't exist:**

```bash
cd wordpress
cp wp-config-sample.php wp-config.php
```

**B) Edit wp-config.php:**

The file should already have these settings, verify them:

```php
// Database settings
define('DB_NAME', 'bimverdi');
define('DB_USER', 'root');
define('DB_PASSWORD', 'root');
define('DB_HOST', 'localhost:/Applications/MAMP/tmp/mysql/mysql.sock');
define('DB_CHARSET', 'utf8mb4');
define('DB_COLLATE', '');

// Headless WordPress settings
define('JWT_AUTH_SECRET_KEY', 'bimverdi-jwt-secret-key-change-in-production');
define('JWT_AUTH_CORS_ENABLE', true);
define('ALLOW_UNFILTERED_UPLOADS', true);

// Debug (set to false in production)
define('WP_DEBUG', false);
```

### 3.2 Install WordPress

1. Open: http://localhost:8888/bimverdi/wordpress/wp-admin/install.php
2. Fill in installation form:
   - **Site Title**: BIMVerdi
   - **Username**: admin (or your choice)
   - **Password**: Choose a strong password
   - **Email**: Your email
   - **Language**: Norsk (Bokmål) or English
3. Click "Install WordPress"
4. Login with your credentials

### 3.3 Install Required Plugins

Navigate to: **Plugins → Add New**

**Essential Plugins:**

1. **Advanced Custom Fields (ACF)**
   - Search for "Advanced Custom Fields"
   - Click "Install Now" → "Activate"
   - (For ACF Pro: Purchase license from advancedcustomfields.com)

2. **WPGraphQL**
   - Search for "WPGraphQL"
   - Click "Install Now" → "Activate"

3. **JWT Authentication for WP REST API**
   - Search for "JWT Authentication for WP REST API"
   - Click "Install Now" → "Activate"

**Optional but Recommended:**

4. **WPGraphQL for Advanced Custom Fields**
   - Exposes ACF fields via GraphQL

5. **Yoast SEO**
   - SEO optimization

### 3.4 Verify Custom Post Types

After activating plugins, check that you see these in the WordPress admin sidebar:

- 📝 **Posts** (standard WordPress)
- 🏢 **Medlemsbedrifter** (Members)
- 🛠️ **Verktøy** (Tools)
- 📊 **Caser** (Cases)
- 📅 **Arrangementer** (Events)

**If CPTs don't appear**, they may need to be registered. Check theme's `functions.php` or create a custom plugin.

### 3.5 Configure ACF Field Groups

Navigate to: **ACF → Field Groups → Add New**

#### Field Group 1: Members
**Location Rule:** Post Type is equal to `member`

**Fields:**
- `company_name` - Text Field
- `logo` - Image Upload
- `description` - Textarea
- `website` - URL
- `contact_email` - Email
- `contact_phone` - Text
- `address` - Text
- `membership_level` - Select (Options: basic, premium, enterprise)
- `services` - Repeater
  - Sub-field: `service_name` - Text

#### Field Group 2: Tools
**Location Rule:** Post Type is equal to `tool`

**Fields:**
- `tool_name` - Text
- `tool_type` - Select (Options: software, plugin, library, framework)
- `description` - Textarea
- `download_link` - URL
- `documentation_link` - URL
- `version` - Text
- `author` - Text
- `compatibility` - Checkbox

#### Field Group 3: Cases
**Location Rule:** Post Type is equal to `case`

**Fields:**
- `project_name` - Text
- `client` - Text
- `year` - Number
- `challenge` - Textarea
- `solution` - Textarea
- `results` - Textarea
- `technologies` - Repeater
  - Sub-field: `technology_name` - Text
- `images` - Gallery
- `related_members` - Relationship (Filter by Post Type: member)
- `related_tools` - Relationship (Filter by Post Type: tool)

#### Field Group 4: Events
**Location Rule:** Post Type is equal to `event`

**Fields:**
- `event_name` - Text
- `event_type` - Select (Options: project, arrangement, webinar, conference)
- `start_date` - Date Picker
- `end_date` - Date Picker
- `location` - Text
- `is_online` - True/False
- `registration_link` - URL
- `organizer` - Text
- `max_participants` - Number
- `current_participants` - Number

### 3.6 Create Test Content

Create sample content to test the API:

1. **Members**: Create 2-3 sample companies
2. **Tools**: Create 2-3 sample tools
3. **Cases**: Create 2-3 sample case studies
4. **Events**: Create 2-3 sample events
5. **Posts**: Create 2-3 sample blog posts

### 3.7 Test REST API

Open these URLs in your browser to verify the API works:

```bash
# Standard posts
http://localhost:8888/bimverdi/wordpress/index.php?rest_route=/wp/v2/posts

# Members
http://localhost:8888/bimverdi/wordpress/index.php?rest_route=/wp/v2/member

# Tools
http://localhost:8888/bimverdi/wordpress/index.php?rest_route=/wp/v2/tool

# Cases
http://localhost:8888/bimverdi/wordpress/index.php?rest_route=/wp/v2/case

# Events
http://localhost:8888/bimverdi/wordpress/index.php?rest_route=/wp/v2/event
```

You should see JSON responses with your content! ✅

### 3.8 Test GraphQL (Optional)

1. Open: http://localhost:8888/bimverdi/wordpress/graphql
2. Try this test query:

```graphql
query GetPosts {
  posts {
    nodes {
      id
      title
      excerpt
      date
    }
  }
}
```

---

## ⚛️ Part 4: Next.js Frontend Setup

### 4.1 Install Dependencies

```bash
cd /Applications/MAMP/htdocs/bimverdi/frontend
npm install
```

### 4.2 Configure Environment Variables

```bash
# Copy example file
cp .env.local.example .env.local

# The .env.local should contain:
cat .env.local
```

Verify these values:

```bash
NEXT_PUBLIC_WORDPRESS_API_URL=http://localhost:8888/bimverdi/wordpress/index.php?rest_route=
NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://localhost:8888/bimverdi/wordpress/graphql
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=change-this-to-a-random-string-in-production
```

### 4.3 Start Development Server

```bash
npm run dev
```

Expected output:
```
  ▲ Next.js 16.0.0
  - Local:        http://localhost:3000
  - Environments: .env.local

 ✓ Ready in 2.5s
```

### 4.4 Test Frontend

Open: http://localhost:3000

You should see the BimVerdi homepage! ✅

---

## ✅ Part 5: Verification Checklist

### WordPress Backend
- [ ] MAMP servers running (Apache + MySQL)
- [ ] Database `bimverdi` exists
- [ ] WordPress installed and accessible
- [ ] Plugins activated (ACF, WPGraphQL, JWT)
- [ ] Custom Post Types visible
- [ ] ACF Field Groups created
- [ ] Test content created
- [ ] REST API returning data
- [ ] GraphQL endpoint accessible (if used)

### Next.js Frontend
- [ ] Dependencies installed (`node_modules/` exists)
- [ ] `.env.local` configured with correct URLs
- [ ] Dev server starts without errors
- [ ] Homepage loads at http://localhost:3000
- [ ] Can fetch data from WordPress API

---

## 🐛 Troubleshooting

### Problem: "Error establishing database connection"

**Solution:**
```bash
# 1. Verify MAMP MySQL is running
ps aux | grep mysql

# 2. Check database exists
/Applications/MAMP/Library/bin/mysql80/bin/mysql -u root -proot -e "SHOW DATABASES;" | grep bimverdi

# 3. Verify wp-config.php has correct credentials
cat wordpress/wp-config.php | grep DB_
```

### Problem: "Cannot find module" in Next.js

**Solution:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Problem: REST API returns 404

**Solution:**
```bash
# In WordPress admin, go to Settings → Permalinks
# Click "Save Changes" without changing anything
# This regenerates .htaccess rewrite rules
```

### Problem: Port 3000 already in use

**Solution:**
```bash
# Find process using port 3000
lsof -i :3000

# Kill it
kill -9 <PID>

# Or use different port
npm run dev -- -p 3001
```

### Problem: CORS errors in browser console

**Solution:**

Verify `wp-config.php` has:
```php
define('JWT_AUTH_CORS_ENABLE', true);
```

And check theme's `functions.php` has CORS headers (see DEVELOPER_GUIDE.md).

### Problem: ACF fields not showing in API

**Solution:**
1. Verify ACF plugin is activated
2. Check field groups have correct location rules
3. Install "WPGraphQL for Advanced Custom Fields" plugin
4. Refresh permalinks (Settings → Permalinks → Save)

---

## 🎉 Success!

If all checklist items are completed, you now have:

✅ **Fully functional WordPress backend** with:
   - Custom Post Types for Members, Tools, Cases, Events
   - ACF fields for rich content
   - REST API and GraphQL endpoints

✅ **Next.js frontend** with:
   - TypeScript and Tailwind CSS
   - Environment configuration
   - API integration ready

✅ **Complete development environment** ready for building features!

---

## 📚 Next Steps

1. **Read the documentation**:
   - `DEVELOPER_GUIDE.md` - Daily development workflow
   - `.github/copilot-instructions.md` - AI assistant context
   - `README.md` - Project overview

2. **Start developing**:
   - Create frontend pages in `frontend/src/app/`
   - Add API functions in `frontend/src/lib/wordpress.ts`
   - Build components in `frontend/src/components/`

3. **Learn the stack**:
   - [Next.js Documentation](https://nextjs.org/docs)
   - [WordPress REST API](https://developer.wordpress.org/rest-api/)
   - [ACF Documentation](https://www.advancedcustomfields.com/resources/)

---

**Setup complete!** 🚀 Happy coding!

For questions or issues, refer to:
- `DEVELOPER_GUIDE.md` for troubleshooting
- `.github/copilot-instructions.md` for coding standards
