# PROJECT_EVENTS.md — Botmartz Community Analytics Event Catalog

This document defines the exact project-specific event taxonomy implemented across Botmartz Community.

| Event Name | Trigger Location | Key Parameters | Destinations | Purpose |
|---|---|---|---|---|
| `page_view` | `AnalyticsProvider.tsx` on route change | `page_path`, `page_title`, `referrer`, `anonymous_id` | GTM, GA4, Firebase, Telemetry API | Measures page traffic and SPA navigation |
| `signup_completed` | User registration submission | `method`, `user_type`, `user_id` | GTM, GA4, Firebase, Telemetry API | Conversion tracking for new developer onboardings |
| `login_completed` | User sign in | `method`, `user_id`, `first_login` | GTM, GA4, Telemetry API | Active user retention and session start |
| `arena_prd_viewed` | Opening an Arena System PRD page (`/arena/[id]`) | `project_id`, `project_title`, `difficulty` | GTM, GA4, Firebase, Telemetry API | Feature engagement with Virtual AI Internship blueprints |
| `daily_log_submitted` | Submitting daily proof-of-work standup (`/arena/daily-log`) | `project_id`, `milestone_day`, `github_commit` | GTM, GA4, Telemetry API | Core proof-of-work retention metric |
| `bootcamp_registered` | Submitting bootcamp enrollment | `bootcamp_id`, `bootcamp_name`, `coupon_used` | GTM, GA4, Firebase, Telemetry API | Lead conversion for flagship AI series |
| `workshop_pass_purchased` | Completing Razorpay payment for workshop | `amount_paid`, `pass_tier`, `ticket_id` | GTM, GA4, Telemetry API | Revenue and pass purchase tracking |
| `newsletter_subscribed` | Submitting footer newsletter form | `source`, `email_domain` | GTM, GA4, Telemetry API | Newsletter dispatch subscriber acquisition |
| `certificate_verified` | Viewing verified certificate page (`/certificates/[id]`) | `certificate_id`, `student_name` | GA4, Telemetry API | Trust & verification activity |
| `search_performed` | Performing search on Arena or Roadmaps | `search_query`, `results_count` | GTM, GA4, Telemetry API | User intent and discovery behavior |
| `application_error` | Caught client or API exception | `error_type`, `error_message`, `route` | Telemetry API | System stability & error monitoring |
