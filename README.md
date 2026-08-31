# Botmartz Community & AI Engineering Arena 🚀

The official open-source developer hub, builder community, and virtual AI internship operating system for **Botmartz AI Solutions**.

* **Live Platform**: [community.botmartz.com](https://community.botmartz.com)
* **Enterprise Main Site**: [botmartz.com](https://www.botmartz.com)
* **Official Payment Handle**: `botmartz-5@oksbi`

---

## 🌟 Core Platform Ecosystem

```
                               ┌────────────────────────────────────────┐
                               │       BOTMARTZ AI COMMUNITY OS         │
                               └──────────────────┬─────────────────────┘
                                                  │
         ┌───────────────────────────┬────────────┴───────────────┬───────────────────────────┐
         ▼                           ▼                            ▼                           ▼
┌──────────────────┐       ┌────────────────────┐       ┌───────────────────┐       ┌──────────────────┐
│  VIRTUAL AI      │       │  BUILDER ARENA &   │       │  COMMUNITY &      │       │  ADMIN CMS &     │
│  INTERNSHIP      │       │  PROJECT WORKSPACE │       │  DISCUSSIONS      │       │  GOVERNANCE      │
│  (/virtual-      │       │  (/arena/[id]/     │       │  (/discussions,   │       │  (/admin/wallets │
│   ai-internship) │       │   workspace)       │       │   /calendar)      │       │   /activity)     │
└──────────────────┘       └────────────────────┘       └───────────────────┘       └──────────────────┘
```

---

## 🏛️ Platform Features & Capabilities

### 1. 45-Day Project-Based Virtual AI Internship (`/virtual-ai-internship`)
* **Rolling 45-Day Architecture**: No static cohorts. Every student's personal 45-day sprint clock begins automatically upon enrollment.
* **50 Production AI Systems across 10 Domains**: Defence & Aerospace AI, Autonomous Agents, Enterprise RAG, FinTech, HealthTech, CyberSecurity, Edge AI, LegalTech, Robotics, and DevTooling.
* **4-Tier Difficulty Progression**:
  * *Baby / Kickstarter* (Foundational confidence builders)
  * *Easy* (Microservices & API gateways)
  * *Hard / Insane* (Complex state machines & distributed embeddings)
  * *Go To Hell / Expert* (Enterprise kernel optimizations, zero-downtime checkpoints, and SLA guarantees)
* **Full SDLC Specs**: PRD, Extension PRD, HLD, LLD, and automated SLA assertion test suites.
* **15 Partner Company Direct Referrals**: Unlocked automatically upon completing 45 days of verified daily Git commits and passing QA assertions.
* **Hint Economy**: Unlock project hints using Karma Coins (300 coins for standard hints, 1,000 coins for advanced architecture hints).

### 2. Builder Agile Kanban Workspace & QA Suite (`/arena/[projectId]/workspace`)
* **Agile Kanban Board**: 5 dynamic status swimlanes (*Backlog*, *Architecture & PRD*, *In Progress*, *In Review / QA*, *Shipped*).
* **Real-Time Squad Chat**: Dedicated team channel for peer debugging and standups.
* **Interactive SDLC Testing Suite**: Build custom test cases, assertions, latency benchmarks, and bug telemetry.
* **Proof-of-Work Commit Logger**: Log Git commit hashes and diff URLs to verify daily progress.
* **Project Unenroll Flow**: Safe project leave mechanism with confirmation modals.

### 3. Student Profile & Email Notification Preferences (`/profile`)
* **Personal 45-Day Sprint Countdown**: Live indicator (`Day X of 45`, days remaining, 4-phase milestone progress bar, and 15-day / 7-day milestone warning banners).
* **Email Notification Preferences Center** (`/api/profile/notifications`):
  * 45-Day Milestone & Deadline Warnings
  * Daily Standup PoW Reminder (8:00 PM IST)
  * Karma Coins & Wallet Alerts
  * Discussion Mentions & Peer Replies
  * Saturday Indore AI Lab & Wednesday Review Meetups
  * Recruiter & Partner Company Referral Dispatches
* **Profile Customization**: Persona classification (Student, Working Professional, Founder/Builder, Researcher), GitHub, LinkedIn, Discord, and primary tech stack tags.

### 4. Student Karma Wallet & Ledger (`/arena/wallet`)
* **Karma Coin Balances & Ledger**: Full tracking of credits earned from daily standups (+20 to +70 coins), discussion threads (+5 coins), comments (+3 coins), and upvotes (+1 coin).
* **Peer-to-Peer Transfers**: Send coins to teammates with custom notes and payment reasons.
* **Razorpay Instant Top-Ups**:
  * *Starter Sprint Pack* (500 Coins for ₹99)
  * *Builder Pro Pack* (2,000 Coins for ₹299)
  * *Founder Placement Pack* (5,000 Coins for ₹599)
* **Official Payment Gateway Handle**: Standardized to `botmartz-5@oksbi` across manual and direct payment options.

### 5. Zero-Trust Auth Gating (`AuthGate.tsx`)
* Reusable zero-trust auth guard protecting internal builder tools from unauthorized public access:
  * `/arena/[projectId]/workspace` (Agile Kanban & QA Suite)
  * `/arena/daily-log` (45-Day Commit & Streak Logger)
  * `/arena/wallet` (Student Karma Wallet & Ledger)
  * `/arena/collaborate` (Squad Matchmaker & Team Finder)
  * `/arena/custom-project` (Custom Blueprint Proposal)
  * `/arena/career-checklist` (Career OS & Recruiter Outreach)
  * `/arena/roadmaps` (50 Progressive Role Roadmaps)
  * `/arena/calendar` (Community & Milestone Calendar)
  * `/challenges` (Hackathons & Bounties)
  * `/discussions` (Technical Q&A Forum)

### 6. Indian Community & Milestone Calendar (`/arena/calendar`)
* **Indian Gazetted Holidays & Tech Days**: Republic Day, Independence Day, National Science Day, National Technology Day, National Engineers' Day, Diwali, National Mathematics Day.
* **Weekly IST Community Rituals**:
  * *Showcase Thursdays* (8:00 PM IST)
  * *Wednesday Resume & Portfolio Reviews* (7:00 PM IST)
  * *3rd Saturday AMA with Founders* (5:00 PM IST)
  * *Indore In-Person AI Lab Sessions*
* **Personal Milestone Overlay**: Live calculation of the student's personal Day 1, Day 10, Day 25, Day 35, and Day 45 deadlines mapped directly onto the calendar.
* **Indore 50+ In-Person RSVP Tracker**: Activation gauge requiring 50+ RSVPs to activate physical office co-working in Indore (defaulting to Discord stage otherwise).

### 7. Interactive Platform Tour (`/product-tour`)
* Dedicated 14-module interactive walkthrough of the entire platform with search & category filtering, 4-step student lifecycle, and clear **What / Why / How** breakdowns for every tool on the platform.

### 8. Technical Discussions & Engineering Forum (`/discussions`)
* Multi-channel technical Q&A forum with instant upvoting, live threaded comments, and topic creation.
* Robust Firestore sanitization, defensive null handling, and Suspense encapsulation.

### 9. Dedicated Community Admin CMS & Multi-Tier RBAC (`/admin`)
* **Admin Wallets & Karma Ledger (`/admin/wallets`)**: Student wallet search, manual credit/debit with payment receipts (`botmartz-5@oksbi`, cash, grants), and platform-wide ledger.
* **Activity Audit Stream (`/admin/activity`)**: Real-time event feed for daily logs, hint unlocks, project enrollments, and custom proposals.
* **Custom Roles & RBAC (`/admin/team`)**: Create custom roles with granular checkboxes for Wallets, Logs, Certificates, Moderation, Events, and Analytics.
* **Security**: Removed public Admin Portal link from the footer.

---

## 🛠️ Tech Stack & Architecture

* **Framework**: Next.js 16 (App Router), React 19, TypeScript
* **Styling**: Tailwind CSS v4, Lucide React Icons
* **Database & Auth**: Google Cloud Firebase Firestore + Firebase Admin SDK
* **Payments**: Razorpay Node SDK + Manual UPI UTR Ledger (`botmartz-5@oksbi`)
* **PDF Engine**: `pdf-lib` for dynamic verifiable certificate generation
* **Real-time Architecture**: Firebase Firestore native live listeners (`onSnapshot`) + SWR

---

## 🚀 Getting Started

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/soham2710/botmartz-community.git
cd botmartz-community
npm install
```

### 2. Environment Configuration
Create a `.env.local` file:
```env
NEXT_PUBLIC_FIREBASE_API_KEY="your_api_key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="botmartz-main.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="botmartz-main"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="botmartz-main.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your_sender_id"
NEXT_PUBLIC_FIREBASE_APP_ID="your_app_id"

NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_live_..."
RAZORPAY_KEY_SECRET="your_razorpay_secret"

SMTP_HOST="smtp.gmail.com"
SMTP_PORT="465"
SMTP_USER="botmartz@gmail.com"
SMTP_PASS="your_app_password"
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the community platform.

### 4. Build for Production
```bash
npm run build
```

---

## 🚢 Deployment to Vercel / Production

1. Import this repository `https://github.com/soham2710/botmartz-community.git` on your hosting provider.
2. Set Root Directory to `./`.
3. Add your environment variables.
4. Assign the domain **`community.botmartz.com`**.

---

## 📄 License
© 2026 Botmartz AI Solution Pvt Ltd. All rights reserved.
