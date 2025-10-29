# Member Article System - API Documentation

**Last Updated:** October 29, 2025
**Version:** 1.0.0
**Status:** Production Ready ✅

## Overview

The BimVerdi Member Article System provides a complete REST API for managing articles created by member companies. The system supports article creation, editing, submission for review, and admin approval workflows.

### Key Features
- Complete article lifecycle management (draft → submit → admin_review → publish/reject)
- WYSIWYG editor with Tiptap integration
- ACF (Advanced Custom Fields) for metadata storage
- Email notifications for approval/rejection
- Company-based article management
- Role-based access control (admin approval required)

---

## Architecture

### Base URL
```
http://localhost:8888/bimverdi/wordpress/index.php?rest_route=/bimverdi/v1/
```

### Authentication Pattern
- Frontend: Next.js API route extracts `user_id` from iron-session
- Backend: `user_id` sent as query parameter to WordPress
- Validation: `bv_get_authenticated_user_id()` verifies user exists

### Authorization Levels
- **Any User:** Can create/edit own articles
- **Admin Only:** Can approve/reject articles

---

## API Endpoints

### 1. Create Article
**POST** `/member-articles`

Create a new article in draft status.

**Query Parameters:**
```
user_id (required) - Integer, current user ID
```

**Request Body:**
```json
{
  "title": "Article Title",
  "content_html": "<p>HTML content here</p>",
  "excerpt": "Brief summary",
  "status": "draft"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Article created",
  "article": {
    "id": 28,
    "title": "Article Title",
    "slug": "article-title",
    "status": "draft",
    "author_id": 4,
    "company_id": 15,
    "created_at": "2025-10-29 14:22:30",
    "content": "<p>HTML content here</p>",
    "excerpt": "Brief summary",
    "word_count": 45
  }
}
```

**Errors:**
- `400` - Missing required fields or invalid data
- `401` - User not authenticated
- `500` - Server error

---

### 2. Get User's Articles
**GET** `/member-articles`

Retrieve all articles created by the current user.

**Query Parameters:**
```
user_id (required) - Integer, current user ID
status (optional) - draft|pending|admin_review|publish|rejected
limit (optional) - Integer, default 20
```

**Response (200):**
```json
{
  "success": true,
  "articles": [
    {
      "id": 28,
      "title": "BIM Automation - Fra teori til praksis",
      "status": "draft",
      "created_at": "2025-10-29 14:22:30",
      "updated_at": "2025-10-29 14:25:00",
      "author": {
        "id": 4,
        "name": "Ulrik Storleer"
      },
      "company": {
        "id": 15,
        "name": "Storleer AS"
      }
    }
  ],
  "total": 1
}
```

---

### 3. Get Single Article
**GET** `/member-articles/{id}`

Retrieve a specific article with full details.

**Query Parameters:**
```
user_id (required) - Integer, current user ID
id (required) - Integer, article ID
```

**Response (200):**
```json
{
  "success": true,
  "article": {
    "id": 28,
    "title": "BIM Automation - Fra teori til praksis",
    "slug": "bim-automation-fra-teori-til-praksis",
    "status": "draft",
    "content": "<h2>Introduksjon</h2><p>...</p>",
    "excerpt": "En dybdeanalyse av BIM automation...",
    "word_count": 1250,
    "author": {
      "id": 4,
      "name": "Ulrik Storleer",
      "email": "ulrik@storleer.no"
    },
    "company": {
      "id": 15,
      "name": "Storleer AS",
      "logo": "https://..."
    },
    "meta": {
      "internal_notes": "",
      "seo_keywords": "",
      "featured_image": null
    },
    "created_at": "2025-10-29 14:22:30",
    "updated_at": "2025-10-29 14:25:00",
    "submitted_at": null,
    "review": {
      "status": null,
      "notes": "",
      "rejection_reason": "",
      "reviewed_by": null,
      "reviewed_date": null
    }
  }
}
```

**Errors:**
- `401` - Unauthorized
- `403` - Forbidden (user doesn't own this article)
- `404` - Article not found

---

### 4. Update Article
**PUT** `/member-articles/{id}`

Update an article (only by author or admin).

**Query Parameters:**
```
user_id (required) - Integer, current user ID
id (required) - Integer, article ID
```

**Request Body (any of these fields):**
```json
{
  "title": "Updated Title",
  "content_html": "<p>Updated content</p>",
  "excerpt": "Updated excerpt",
  "status": "draft"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Article updated",
  "article": {
    "id": 28,
    "title": "Updated Title",
    "status": "draft",
    "updated_at": "2025-10-29 14:30:00"
  }
}
```

---

### 5. Delete Article
**DELETE** `/member-articles/{id}`

Delete an article (only by author or admin). Only draft articles can be deleted.

**Query Parameters:**
```
user_id (required) - Integer, current user ID
id (required) - Integer, article ID
```

**Response (200):**
```json
{
  "success": true,
  "message": "Article deleted"
}
```

**Errors:**
- `403` - Cannot delete published articles
- `409` - Article already submitted for review

---

### 6. Submit for Review
**POST** `/member-articles/{id}/submit`

Submit a draft article for admin review.

**Query Parameters:**
```
user_id (required) - Integer, current user ID
id (required) - Integer, article ID
```

**Request Body:** (optional)
```json
{
  "notes": "Author notes for reviewers"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Article submitted for review",
  "new_status": "admin_review",
  "submitted_at": "2025-10-29 14:35:00"
}
```

**Side Effects:**
- Article status changes to `admin_review`
- Admin receives email notification with review link
- Author receives confirmation email

---

### 7. Admin Review/Approve
**POST** `/member-articles/{id}/review`

Approve or reject an article (admin only).

**Query Parameters:**
```
user_id (required) - Integer, admin user ID
id (required) - Integer, article ID
```

**Request Body:**
```json
{
  "action": "approve",
  "reviewer_notes": "Nice article!"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Artikkel godkjent og publisert",
  "new_status": "publish"
}
```

**Actions:**

**Approve:**
- Status: `admin_review` → `publish`
- Article becomes visible to public
- Author receives approval email

**Reject:**
```json
{
  "action": "reject",
  "rejection_reason": "Missing citations",
  "reviewer_notes": "Please add sources and resubmit"
}
```
- Status: `admin_review` → `rejected`
- Article remains private
- Author receives rejection email with reason
- Author can resubmit after editing

---

### 8. Get Company Articles
**GET** `/companies/{id}/articles`

Get all published articles from a specific company (public endpoint).

**Query Parameters:**
```
id (required) - Integer, company/deltaker post ID
limit (optional) - Integer, default 10
```

**Response (200):**
```json
{
  "company": {
    "id": 15,
    "name": "Storleer AS",
    "slug": "storleer-as"
  },
  "articles": [
    {
      "id": 28,
      "title": "BIM Automation - Fra teori til praksis",
      "excerpt": "En dybdeanalyse...",
      "created_at": "2025-10-29",
      "author": {
        "id": 4,
        "name": "Ulrik Storleer"
      }
    }
  ],
  "total": 1
}
```

---

## Article Statuses

| Status | Description | Visibility | Can Edit | Can Delete |
|--------|-------------|-----------|----------|-----------|
| `draft` | Work in progress | Private (author only) | ✅ | ✅ |
| `admin_review` | Waiting for approval | Private (admin + author) | ❌ | ❌ |
| `publish` | Published and public | Public | ❌ | ❌ |
| `rejected` | Rejected by admin | Private (admin + author) | ✅ | ❌ |

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Missing required field: title"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Unauthorized"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Unauthorized - Admin access required"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Artikkel ikke funnet"
}
```

### 409 Conflict
```json
{
  "success": false,
  "message": "Article cannot be deleted - already submitted for review"
}
```

---

## Advanced Features

### ACF Fields

All article metadata is stored via ACF with these field groups:

**Grunninfo (Basic Info):**
- `article_title` - Article title
- `article_content` - HTML content
- `article_excerpt` - Summary text
- `article_company_id` - Reference to company/deltaker post

**Metadata:**
- `article_internal_notes` - Internal notes for reviewers
- `article_seo_keywords` - SEO keywords
- `article_featured_image` - Feature image

**Godkjenning (Review/Approval):**
- `article_review_status` - approved/rejected/pending
- `article_reviewed_by` - Admin user who reviewed
- `article_reviewed_date` - Timestamp of review
- `article_reviewer_notes` - Notes from reviewer
- `article_rejection_reason` - Why article was rejected

### Email Notifications

**Author gets email when:**
- Article submitted → "Your article has been submitted for review"
- Article approved → "Your article has been approved and published"
- Article rejected → "Your article was rejected - see notes"

**Admin gets email when:**
- New article submitted → "New article pending review"
- Includes direct review link in wp-admin

---

## Rate Limiting

No rate limiting on local development. In production:
- 50 requests per hour per user (general)
- 10 requests per hour per user (admin review)

---

## CORS

Currently configured for:
```
Origin: http://localhost:3000
Origin: http://localhost:8888
```

Update `wp-config.php` for production domains.

---

## Testing

### Test User
- Email: `andreas@aharstad.no`
- Password: `IMhj*92QRYZfqWNapDk%6m^e`
- Role: Administrator

### Test Commands

**Create Article:**
```bash
curl -X POST http://localhost:8888/bimverdi/wordpress/index.php?rest_route=/bimverdi/v1/member-articles?user_id=4 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Article",
    "content_html": "<p>Test content</p>",
    "excerpt": "Test"
  }'
```

**List Articles:**
```bash
curl http://localhost:8888/bimverdi/wordpress/index.php?rest_route=/bimverdi/v1/member-articles?user_id=4
```

**Submit for Review:**
```bash
curl -X POST http://localhost:8888/bimverdi/wordpress/index.php?rest_route=/bimverdi/v1/member-articles/28/submit?user_id=4 \
  -H "Content-Type: application/json" \
  -d '{"notes": ""}'
```

**Approve Article (Admin):**
```bash
curl -X POST http://localhost:8888/bimverdi/wordpress/index.php?rest_route=/bimverdi/v1/member-articles/28/review?user_id=1 \
  -H "Content-Type: application/json" \
  -d '{
    "action": "approve",
    "reviewer_notes": "Great article!"
  }'
```

---

## Troubleshooting

See `MEMBER_ARTICLE_TROUBLESHOOTING.md` for common issues and solutions.

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Oct 29, 2025 | Initial release with 8 endpoints |
