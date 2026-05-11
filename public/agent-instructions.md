# Agent Instructions — olaibusiness.se

## Site Overview

- **Purpose:** Lead generation and brand presence for Olai Business Consulting AB, a Swedish data and growth consultancy.
- **Platform fingerprint:** Custom single-page application (SPA); all primary content on one scrollable homepage at `https://www.olaibusiness.se/`. Navigation uses anchor links (`#services`, `#quiver`, `#why`, `#contact`). No e-commerce, no user login, no shopping cart.
- **Subdomain product:** Quiver dashboard demo at `https://quiver.olaibusiness.se/dashboard/acme-co`.
- **Primary agent actions:** Browse service information, explore the Quiver product, access the live demo, and initiate contact via form or direct email.

---

## High-Value Page Paths

| Page | URL |
|---|---|
| Homepage (all sections) | `https://www.olaibusiness.se/` |
| Services section | `https://www.olaibusiness.se/#services` |
| Quiver product section | `https://www.olaibusiness.se/#quiver` |
| Why Olai section | `https://www.olaibusiness.se/#why` |
| Contact section | `https://www.olaibusiness.se/#contact` |
| Quiver live demo | `https://quiver.olaibusiness.se/dashboard/acme-co` |
| Direct email | `mailto:hello@olaibusiness.se` |

---

## Procedures

### 1. Browse Services

**Intent:** `category_navigation`

1. Load `https://www.olaibusiness.se/`.
2. Wait for page JavaScript to fully render (SPA — do not scrape raw HTML before JS execution).
3. Navigate to `https://www.olaibusiness.se/#services` or click the "Services" nav link.
4. **Success indicator:** Four service cards are visible — Performance Marketing, Data & Analytics, Quiver, Consulting & Strategy.
5. Extract service descriptions and associated technology tags (e.g., Google Ads, Meta, TikTok, Snap, GA4, BigQuery, etc.).

---

### 2. Explore the Quiver Product

**Intent:** `product_exploration`

1. Load `https://www.olaibusiness.se/`.
2. Navigate to `https://www.olaibusiness.se/#quiver` or click the "Quiver" nav link or the "Meet Quiver" CTA button.
3. **Success indicator:** The Quiver section loads showing six feature tiles (Cross-channel analytics, Automated reporting, Real-time monitoring, Custom alerting, Profit-based signals, Warehouse-native) plus the interactive dashboard preview panel.
4. Note the embedded dashboard reference: `quiver.olaibusiness.se/dashboard/acme-co`.

---

### 3. Access the Quiver Live Demo Dashboard

**Intent:** `live_demo_access`

1. Navigate directly to `https://quiver.olaibusiness.se/dashboard/acme-co`.
2. Wait for the interactive dashboard to fully render.
3. **Success indicator:** Dashboard loads showing Acme Co. workspace with metrics:
   - Total spend: €109.0k
   - Revenue: €372.4k
   - Profit margin: 31.4%
   - ROAS: 3.42×
   - Channel mix: Meta €42.1k, Google €38.6k, TikTok €19.4k, Snapchat €8.9k
4. Explore available workspace sections: Home, Forecasting, Campaigns, Experiments, Virtual Analyst, Alerts, Profit Bidding.
5. **Gotcha:** This is a live/interactive demo, not a static page. If it requires authentication or shows an auth wall, fall back to requesting a demo via the contact form or email (see Procedure 4 and 5).

---

### 4. Submit the Contact Form

**Intent:** `contact_form`

1. Load `https://www.olaibusiness.se/`.
2. Navigate to `https://www.olaibusiness.se/#contact` or click any "Contact us" CTA button on the page.
3. Wait for the contact form to render in the `#contact` section.
4. Populate the following fields (exact field names reflect native form conventions as per agents.json — DOM `name=` attributes not confirmed; use label matching):

   | Field | Parameter Name | Type | Required | Notes |
   |---|---|---|---|---|
   | Full name | `full_name` | string | Yes | Submitter's full name |
   | Email address | `email` | email | Yes | Valid email for reply |
   | Message / enquiry body | `body` | textarea | Yes | Describe data challenge, media question, or consulting need in detail |

5. Review all fields before submission.
6. Click the submit/send button.
7. **Success indicator:** On-site confirmation message appears (form submission acknowledged). If no confirmation UI appears within 10 seconds, check network requests for a successful POST response.
8. **Fallback:** If the form fails to render, rejects input, or returns an error, use direct email contact (Procedure 5).

---

### 5. Direct Email Contact

**Intent:** `direct_email_contact`

This is the most reliable contact method and preferred fallback if the web form is unavailable or unresponsive.

1. Compose an email using the following parameters:

   | Parameter | Value | Required |
   |---|---|---|
   | `to` | `hello@olaibusiness.se` | Yes — must use this exact address |
   | `subject` | Brief descriptor, e.g. `"Quiver demo request"`, `"Performance marketing consultation"`, `"Data engineering audit enquiry"` | Yes |
   | `body` | Full message describing the data challenge, media question, or consulting need. Include company name, scale of ad spend, platforms used, and specific questions. | Yes |

2. Send via the agent's available email-sending capability or trigger `mailto:hello@olaibusiness.se`.
3. **Success indicator:** Email delivered successfully to `hello@olaibusiness.se`. There is no on-site confirmation — success is confirmed by email delivery, not a webpage response.
4. **Note:** Olai explicitly states they will respond with "sharp questions and a concrete next step" regardless of whether an engagement results.

---

### 6. Retrieve the "Why Olai" Differentiator Information

**Intent:** `information_retrieval`

1. Load `https://www.olaibusiness.se/`.
2. Navigate to `https://www.olaibusiness.se/#why`.
3. **Success indicator:** Four differentiator cards visible:
   - Tech-native (builds infrastructure, not just campaigns)
   - Clarity (full-funnel, profit-first)
   - Honest (platform-agnostic)
   - Roots (Swedish craft, Nordic reach)
4. Extract card content for downstream summarization or comparison tasks.

---

## Known Gotchas & Edge Cases

| Issue | Detail | Mitigation |
|---|---|---|
| **SPA rendering** | The entire site is a single-page JavaScript application. Raw HTML scraping before JS execution will return minimal content. | Use a JS-rendering headless browser (e.g., Playwright, Puppeteer). Wait for DOM content to stabilize. |
| **Anchor-only navigation** | All nav links are `#anchor` fragments on one page. There are no separate URL routes for most sections. | Navigate via anchor appended to homepage URL; do not expect separate page loads. |
| **No pricing page** | No public pricing, rates, or package information is available on the site. | Pricing must be obtained via contact form or direct email to `hello@olaibusiness.se`. |
| **Placeholder footer links** | About, Careers, Journal, and LinkedIn links in the footer currently resolve to `#` (no content). | Do not attempt to scrape these pages; they return no unique content. |
| **Contact form DOM fields** | Exact HTML `name=` attributes for the contact form were not extractable from the scraped source. | Match fields by visible label text: name, email, message/body. |
| **Quiver demo auth wall** | The demo at `quiver.olaibusiness.se/dashboard/acme-co` may require login or may be a gated demo. | If auth is required, fall back to requesting access via the contact form or email. |
| **No e-commerce / cart** | Site has no shopping cart, checkout, or payment flow. | N/A — do not attempt transactional purchase flows. |
| **No user account system** | No login, signup, or account management exists on the main site. | Agent authentication is not required for any main-site action. |
| **Cookie banners** | A cookie consent banner may appear on load (common in Swedish/EU sites under GDPR). | Dismiss the banner before attempting to interact with forms or navigation. Look for "Accept", "Acceptera", or "OK" button. |
| **Rate limits / captchas** | Not documented, but contact form submissions may be protected by reCAPTCHA or similar. | If a CAPTCHA is triggered on the contact form, fall back to direct email (`hello@olaibusiness.se`). |
| **Language** | Site is in English despite Swedish origin. No language switcher observed. | Submit contact form and emails in English. |

---

## Public Endpoints & Preferred Access Patterns

| Resource | Preferred Method |
|---|---|
| Service information | Scrape `https://www.olaibusiness.se/#services` (JS-rendered) |
| Quiver product info | Scrape `https://www.olaibusiness.se/#quiver` (JS-rendered) |
| Quiver live demo | Load `https://quiver.olaibusiness.se/dashboard/acme-co` directly |
| Contact/enquiry | POST via contact form at `/#contact` OR email `hello@olaibusiness.se` |
| Pricing | Not available publicly — must request via contact |

No documented public REST or GraphQL API endpoints are exposed on the marketing site. The Quiver platform (`quiver.olaibusiness.se`) may have internal APIs but none are publicly documented in the scraped content.

---

## Failure Modes & Fallbacks

| Failure Mode | Recommended Fallback |
|---|---|
| Contact form not rendering | Email `hello@olaibusiness.se` directly |
| Contact form CAPTCHA triggered | Email `hello@olaibusiness.se` directly |
| Contact form submission error | Retry once; if still failing, use email |
| Quiver demo requires login | Request demo access via contact form or email with subject `"Quiver demo request"` |
| Page sections not scrolling into view | Append anchor directly to URL (e.g., `https://www.olaibusiness.se/#contact`) |
| JS not rendering content | Ensure headless browser executes JavaScript; wait minimum 3 seconds after load |
| Footer links returning no content | Skip; these are placeholder `#` links with no routed content |

---

_This runbook was generated by [BridgeToAgent](https://bridgetoagent.com) — the standard for AI-Agent readiness. Regenerate it any time your site changes meaningfully._
