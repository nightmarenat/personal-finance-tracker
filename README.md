# Personal Finance Tracker

A mobile-first PWA built with React + TypeScript + Vite, using Google Sheets as the database and Google OAuth 2.0 for authentication. Optimised for iPhone (safe-area, native feel).

## Features

- **Summary Tab** — monthly income/expense totals, expandable category breakdown, recent transactions
- **Add Tab** — native-feel expense entry with custom numpad, category tiles, and subcategory pills
- **Breakdown Tab** — donut chart by category group + horizontal bar chart + ranked subcategory list
- **PWA** — installable via "Add to Home Screen" on iPhone

---

## Setup

### 1. Clone and install

```bash
git clone <your-repo>
cd personal-finance-tracker
npm install
```

### 2. Create environment file

```bash
cp .env.example .env.local
```

Fill in the values (see sections below).

### 3. Run development server

```bash
npm run dev
```

Open `http://localhost:5173` in Safari on your iPhone (same network) or use a tunnel like `ngrok`.

---

## Google Cloud Setup

### Create a project and OAuth Client ID

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project (e.g. "Personal Finance")
3. Navigate to **APIs & Services → Library**
4. Search for **Google Sheets API** and click **Enable**
5. Navigate to **APIs & Services → OAuth consent screen**
   - Choose **External** (or Internal if you have a Workspace account)
   - Fill in App name, support email, and developer email
   - Add scope: `https://www.googleapis.com/auth/spreadsheets`
   - Add your email as a test user
6. Navigate to **APIs & Services → Credentials**
7. Click **Create Credentials → OAuth client ID**
   - Application type: **Web application**
   - Name: e.g. "Finance Tracker Web"
   - Authorised JavaScript origins:
     - `http://localhost:5173` (for local dev)
     - `https://your-app.vercel.app` (for production)
   - Authorised redirect URIs: *(leave empty for implicit flow)*
8. Copy the **Client ID** → paste as `VITE_GOOGLE_CLIENT_ID` in `.env.local`

### Google Sheets IDs

The Sheet ID is the long string in the URL:
```
https://docs.google.com/spreadsheets/d/THIS_IS_THE_ID/edit
```

Your sheets are already configured in `.env.example`.

---

## Google Sheets Format

### Transactions Sheet
Row 1 must be headers. Data starts from row 2.

| Date | Type | Amount | CategoryGroup | Subcategory | PaymentMethod | ValueAlignment | Note |
|------|------|--------|---------------|-------------|---------------|----------------|------|
| 4/6/2026 | Expense | 150 | Fulfillment | Drink & Cafe | Cash | Worth It | Morning latte |

- **Date format**: `M/D/YYYY` (e.g. `4/6/2026`)
- **Type**: `Expense` or `Income`
- **PaymentMethod**: `Cash`, `Credit Card`, or `Transfer`
- **ValueAlignment**: `Worth It`, `Neutral`, `Not Worth It`, or blank

### Categories Sheet
| Type | CategoryGroup | Subcategory |
|------|---------------|-------------|
| Expense | Fulfillment | Drink & Cafe |

---

## Generating PWA Icons

Open `public/generate-icons.html` in a browser. Right-click each canvas and save:
- 192×192 → `public/icons/icon-192.png`
- 512×512 → `public/icons/icon-512.png`

---

## Deploy to Vercel

1. Push your repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → import your repo
3. In **Environment Variables**, add:
   - `VITE_GOOGLE_CLIENT_ID`
   - `VITE_TRANSACTIONS_SHEET_ID`
   - `VITE_CATEGORIES_SHEET_ID`
4. Click **Deploy**
5. After deployment, add your Vercel URL (`https://your-app.vercel.app`) to the **Authorised JavaScript origins** in Google Cloud Console

### Add to iPhone Home Screen

1. Open your Vercel URL in **Safari** on iPhone
2. Tap the **Share** button → **Add to Home Screen**
3. The app will launch fullscreen like a native app

---

## Build

```bash
npm run build      # TypeScript check + Vite build
npm run preview    # Preview the production build locally
```
