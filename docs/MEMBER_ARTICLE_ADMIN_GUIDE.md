# Member Article System - Admin Guide

**Last Updated:** October 29, 2025
**For:** WordPress Administrators

## Overview

This guide explains how to manage and approve member articles as an administrator. The system helps manage content submissions from member companies before publication.

---

## Accessing the Admin Interface

### Step 1: Login to WordPress Admin
1. Go to `http://localhost:8888/bimverdi/wordpress/wp-admin`
2. Enter your admin credentials
3. Click "Log in"

### Step 2: Navigate to Member Articles
1. Look for "Medlemsartikler" (Member Articles) in the left sidebar
2. Click it to open the article management panel
3. You should see two tabs: "Avventer godkjenning" and "Avviste artikler"

---

## Article Review Workflow

### Understanding Article Statuses

| Status | Meaning | What to Do |
|--------|---------|-----------|
| 🟡 **Avventer godkjenning** (Pending Review) | Author submitted article for approval | Review content and approve or reject |
| 🟢 **Godkjent** (Approved) | Published on website | Monitor for issues |
| 🔴 **Avvist** (Rejected) | Author was asked to revise | Can approve after author updates it |
| 📝 **Draft** | Not submitted yet | Author still editing (not in admin panel) |

### Workflow Diagram

```
Author Creates     Author Submits     Admin Reviews     Article Live
 (Draft)  ────────→ (Pending)    ─────→  (Approved)  ────→ (Published)
                         ↓ (if changes needed)
                      Admin Rejects
                      (Rejected)
                         ↓
                   Author Revises
                      & Resubmits
```

---

## Reviewing Articles

### Step 1: View Pending Articles

1. Go to "Medlemsartikler" menu
2. You're on the "Avventer godkjenning" tab
3. See list of articles submitted for review:
   - **Tittel** - Article title
   - **Forfatter** - Author name
   - **Bedrift** - Member company
   - **Dato** - Submission date
   - **Handlinger** - Action buttons

### Step 2: Review Article Content

**Option A: Quick Review**
- Click **"Vis"** (View) button to read in WordPress editor
- Scroll down to see full content

**Option B: Full Preview**
- Articles show:
  - Title
  - Author & company name
  - Submission date
  - Excerpt (first 15 words)

### Step 3: Make Decision

#### ✅ APPROVE Article

1. Click **"✓ Godkjenn"** (Approve) button
2. Popup appears with optional notes field
3. (Optional) Add notes for author like:
   - "Great article!"
   - "Minor edits made"
   - "Excellent research"
4. Click **"Godkjenn"** button in popup
5. Article immediately published to website
6. Author receives approval email

**What happens after approval:**
- Article status: `Pending` → `Published`
- Article visible on website
- Author notified via email
- Article appears in company's article listing

#### ❌ REJECT Article

1. Click **"✕ Avvis"** (Reject) button
2. Popup appears with two fields:

   **Avvisningsgrunn** (Rejection Reason) - *Required*
   - Explain why article is rejected
   - Examples:
     - "Missing citations/sources"
     - "Contains promotional content"
     - "Off-topic for BimVerdi"
     - "Plagiarism detected"

   **Notater til forfatter** (Notes for Author) - *Optional*
   - Constructive feedback for improvement
   - Examples:
     - "Please add at least 3 credible sources"
     - "Rewrite introduction - too promotional"
     - "This seems more suitable for product marketing"

3. Click **"Avvis"** button
4. Article rejected
5. Author receives rejection email with your feedback

**What happens after rejection:**
- Article status: `Pending` → `Rejected`
- Article not published
- Author notified via email with rejection reason
- Author can edit and resubmit article
- Article reappears in "Avviste artikler" tab

---

## Working with Rejected Articles

### Tab: "Avviste artikler" (Rejected Articles)

Shows articles you (or other admins) have rejected.

### Author Resubmits After Revision

When author resubmits a rejected article:
1. Article appears back in "Avventer godkjenning" tab
2. Review the revised content
3. Approve if improvements made
4. Or reject again if more work needed

### Tips for Feedback

**Constructive Feedback Examples:**
- ✅ "Please add references to BIM standards"
- ✅ "Remove comparison to competitor products"
- ✅ "Include more technical details about methodology"
- ❌ "This is bad" (not helpful)
- ❌ "Fix it" (too vague)

---

## Article Details

### What to Check When Reviewing

#### 1. **Topic Relevance**
- Is article relevant to BIM and construction?
- Fits BimVerdi's mission?
- Appropriate for member audience?

#### 2. **Quality**
- Professional writing
- Proper grammar and spelling (Norwegian)
- Logical structure and flow

#### 3. **Credibility**
- References/citations included?
- Facts verifiable?
- Not primarily promotional?

#### 4. **Length**
- Adequate depth (not too short)
- Not excessively long
- Typical good article: 800-2000 words

#### 5. **Content Type**
- Original article (not copied)
- Not just company advertisement
- Provides value to readers

### Red Flags

🚩 Reject if you see:
- Spam or off-topic content
- Plagiarized content
- Direct advertisement without educational value
- Hate speech or inappropriate language
- Copyright infringement
- Broken images/formatting

---

## Working with Authors

### Email Communication

When you approve/reject, author automatically receives email with:
- Your approval/rejection message
- Any notes you added
- Link to edit (if rejected)

### Following Up

**If author doesn't revise after rejection:**
- Wait 1-2 weeks for resubmission
- Optionally reach out to author directly
- Can approve similar articles from other authors

**If author submits frequently:**
- Good sign of engaged member
- Consider developing closer relationship
- Suggest article topics

---

## Best Practices

### ✅ DO:

- **Be consistent** - Apply same standards to all authors
- **Be timely** - Review articles within 1-2 days
- **Be constructive** - Help authors improve
- **Be clear** - Explain reasons for rejection
- **Document** - Keep notes on why you rejected

### ❌ DON'T:

- **Don't be vague** - "Not good enough" isn't helpful
- **Don't be rude** - Remember these are members
- **Don't play favorites** - Same standards for all
- **Don't take weeks** - Authors want quick feedback
- **Don't approve low quality** - Maintain website standards

---

## Keyboard Shortcuts

In the admin interface:

| Action | Shortcut |
|--------|----------|
| Approve article | Click green ✓ button |
| Reject article | Click red ✕ button |
| View full article | Click "Vis" button |
| Switch tabs | Click tab name |
| Scroll table | Scroll down |

---

## Reporting & Analytics

### View Statistics

**How many articles to approve this week?**
- Go to "Avventer godkjenning" tab
- See count: "Avventer godkjenning (X)"

**How many rejected articles?**
- Go to "Avviste artikler" tab
- See count in tab name

### Track Performance

*Currently not automated - manual tracking:*
- Track articles approved per week
- Note which companies submit most articles
- Monitor average review time

---

## Troubleshooting Admin Tasks

### Approve Button Not Working

**Problem:** Click "Godkjenn" but nothing happens

**Solution:**
1. Check browser console (F12 → Console tab)
2. Look for red error messages
3. Try refreshing page
4. Try different browser
5. Check you're logged in as admin

### Can't Find Article Menu

**Problem:** "Medlemsartikler" not in sidebar

**Solution:**
1. Check you're logged in as administrator
2. Try refreshing page (Cmd+R)
3. Log out and log back in
4. Check with WordPress admin (might need to reactivate plugin)

### Email Not Sent to Author

**Problem:** Author didn't receive approval/rejection email

**Solution:**
1. Article was definitely approved/rejected? (Check status)
2. Author's email in their profile? (Admin > Users)
3. Spam folder? (Author should check)
4. Contact WordPress admin to check email logs

### Wrong Article Published

**Problem:** Article was published by mistake

**Solution:**
1. Go to Posts > Member Articles
2. Find article
3. Click "Edit"
4. Scroll to "Status" dropdown
5. Change from "Publish" to "Draft"
6. Click "Update"
7. Notify author if needed

---

## Advanced Features

### Filter by Author/Company

*Future enhancement - currently not implemented*

To manually find articles by specific author:
1. Click "Vis" (View) on any article
2. Note author name in top
3. Visually scan other articles for same author

### Bulk Actions

*Future enhancement - currently not implemented*

Currently must approve/reject one article at a time.

---

## Monthly Checklist

- [ ] Review all pending articles (target: within 24 hours)
- [ ] Check for rejected articles authors haven't revised
- [ ] Verify published articles still appear on website
- [ ] Note top-performing/most active authors
- [ ] Review any support tickets about article system

---

## Key Contacts

**Issues with:**
- Plugin functionality → WordPress admin
- Article content questions → Article author email
- Website appearance → Development team
- Database issues → WordPress admin / Hosting provider

---

## Approval Guidelines

### Article Topics

**Good topics:**
- BIM methodology and best practices
- Construction case studies
- Technology implementation guides
- Industry trends and analysis
- Tutorial/how-to articles
- Research findings

**Problematic topics:**
- Pure product advertising
- Competitor bashing
- Off-topic subjects
- Extremely controversial (unless well-reasoned)

### Article Length & Format

**Ideal article:**
- 800-2000 words
- Clear headline
- Introduction paragraph
- 3-5 main sections
- Conclusion
- Images/diagrams if relevant
- Professional tone

**Too short:**
- Under 300 words (feels like advertisement)
- Approve if high quality, otherwise suggest revision

**Too long:**
- Over 4000 words (gets hard to read)
- Approve if necessary, or suggest splitting into series

---

## Questions?

For issues with:
1. **Approval process** - See "Troubleshooting" section above
2. **Content questions** - Contact the article author directly
3. **Plugin issues** - Contact WordPress administrator
4. **Technical issues** - Contact support team

---

**Remember:** Your role is to maintain website quality while supporting member engagement. Balance being thorough with being encouraging!

---

**Last Updated:** October 29, 2025
