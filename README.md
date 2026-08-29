# Botmartz Community & Events Platform 🚀

The official open-source developer hub, builder community, and event management platform for **Botmartz AI Solutions**.

* **Live Subdomain Target**: `https://community.botmartz.com`
* **Enterprise Main Site**: `https://www.botmartz.com`

---

## 🌟 Key Features

### 1. Developer Community & Interactive Forum (`/discussions`)
* Multi-channel discussion rooms (`#ai-agents`, `#enterprise-rag`, `#show-your-build`, `#prompts-and-evals`, `#events-and-meetups`).
* Interactive upvotes, code snippet previews, and inline discussion starter modal.

### 2. Builder Showcase & Demo Arena (`/showcase`)
* Community showcase for production AI agents, RAG evaluators, and MCP plugins.
* GitHub links, live demo redirects, and peer upvoting.

### 3. Hackathons & AI Engineering Challenges (`/challenges`)
* 48-hour sprints and weekly prompt battles with cash prizes and cloud credits.
* Real-time participant counters and submission criteria checklists.

### 4. Hall of Fame Leaderboard (`/leaderboard`)
* Gamified XP/karma ranking for top open-source contributors, hackathon winners, and discussion leaders.

### 5. Flagship Conferences & Summits (`/events/ai-frontier-2026`)
* Full summit agenda, featured keynote speakers, and 3-tier pass checkout (Student, Builder, VIP Founder).
* Dual checkout support: Instant **Razorpay** checkout + Manual **UPI / Bank Transfer UTR submission**.

### 6. Hands-on AI Bootcamps (`/workshops`)
* Practical live coding cohorts on LangGraph agent state machines and hybrid dense/sparse RAG indexing.

### 7. Official Verifiable Credentials & PDF Generator (`/certificates`)
* Public certificate lookup by Certificate ID or Email (`/api/certificate/verify`).
* Dynamic, vector-bordered A4 landscape PDF certificate generator powered by `pdf-lib` (`/api/certificate/generate`).

### 8. Dedicated Community Admin CMS & Multi-Tier RBAC (`/admin`)
* **`super-admin`**: Full financial ledger reconciliations, promo coupon generation, event deletion, and user permissions.
* **`event-manager`**: Create & edit summits, manage workshop rosters, and issue credentials.
* **`volunteer`**: Fast QR code scanner check-in portal (`/admin/scanner` & `/event-desk`).

---

## 🛠️ Tech Stack & Architecture

* **Framework**: Next.js 16 (App Router), React 19, TypeScript
* **Styling**: Tailwind CSS v4, Lucide React Icons
* **Database & Auth**: Google Cloud Firebase Firestore + Firebase Admin SDK
* **Payments**: Razorpay Node SDK + Manual UPI UTR Ledger
* **PDF Engine**: `pdf-lib`
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

## 🚢 Deployment to Vercel / Hostinger

1. Import this repository `https://github.com/soham2710/botmartz-community.git` on your hosting provider.
2. Set Root Directory to `./`.
3. Add your environment variables.
4. Assign the domain **`community.botmartz.com`**.

---

## 📄 License
© Botmartz AI Solution Pvt Ltd. All rights reserved.
