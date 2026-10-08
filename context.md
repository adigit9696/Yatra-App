# Yatra — Project Architecture & Technical Context

> **Document Version:** 1.0.0  
> **Target Application:** Yatra — Offline-First PWA Trip Companion  
> **Root Directory:** `c:\Users\Aditya Jaiswal\Downloads\yatra-pwa`  
> **Last Updated:** October 2026  

---

## 1. Executive Summary & Project Purpose

**Yatra** ("यात्रा") is an offline-first, mobile-optimized Progressive Web App (PWA) engineered as an all-in-one companion for domestic Indian travel. It consolidates trip itinerary planning, categorized packing checklists, budget and expense tracking with split mathematics, secure ticket/ID vaulting, and a photo journal into a single, cohesive user experience.

### Key Value Propositions
- **Zero-Dependency Architecture:** Built exclusively with vanilla HTML5, CSS3, and JavaScript. No external runtime frameworks (no React, Vue, Angular, or Tailwind) are required.
- **True Offline Capability:** Operates reliably in intermittent connectivity or airplane mode (e.g., on Indian Railways Konkan routes) via a dedicated Service Worker and Cache Storage API.
- **Local-First Data Ownership:** All data is stored in the browser's `localStorage` and `IndexedDB` (for compressed photos). Users can export, share, and restore trips via standalone `.json` backup files.
- **Culturally Grounded UX:** Designed specifically for Indian travelers with Hindi/Hinglish copy, INR (`₹`) formatting (with Lakhs/Thousands abbreviations), time-of-day greetings (*Suprabhat*, *Namaste*, *Shubh sandhya*, *Shubh ratri*), and automatic identification of Indian transit entities (PNR numbers, UPI IDs, railway stations, temples, forts, dargahs, and beaches).

---

## 2. Repository File Structure & Roles

```
yatra-pwa/
│
├── index.html              # Complete application (UI markup, CSS design system, and client JS logic)
├── sw.js                   # Service Worker handling offline caching, asset versioning, and cache busting
├── manifest.webmanifest    # W3C Web App Manifest (PWA metadata, icons, standalone display mode, shortcuts)
├── icons/                  # High-DPI icons for Android, iOS, and desktop PWA installation
│   ├── icon-192.png        # Standard 192x192 icon
│   ├── icon-512.png        # Standard 512x512 icon
│   ├── maskable-512.png    # Android adaptive maskable icon
│   ├── apple-touch-icon.png# iOS Safari home screen icon (180x180)
│   └── favicon-32.png      # Desktop browser favicon (32x32)
├── vercel.json             # Vercel CDN cache configuration (disables caching on sw.js and app shell)
├── _headers                # Netlify HTTP response headers matching vercel.json policies
├── README.txt              # Deployment, installation, and usage documentation
└── context.md              # Comprehensive technical specifications, schemas, and architecture guide
```

### Detailed File Responsibilities

| File | Size | Purpose | Key Details |
|---|---|---|---|
| `index.html` | ~238 KB | Single-page application shell | Contains CSS design system (lines 19–773), HTML structure (lines 775–1131), and full JavaScript logic (lines 1132–3708). |
| `sw.js` | ~3.8 KB | Service Worker engine | Implements `networkFirstPage` for navigation, `cacheFirst` for local assets, and `staleWhileRevalidate` for Google Fonts. Inter-client broadcast via `SW_ACTIVATED`. |
| `manifest.webmanifest` | ~1.8 KB | PWA Manifest | Standalone display mode, portrait orientation lock, background `#0e2730`, theme `#0b2730`, 4 deep shortcuts (`?tab=itin`, `?tab=check`, `?tab=budget`, `?tab=vault`). |
| `vercel.json` & `_headers` | ~1.1 KB | Deployment cache policies | Forces `Cache-Control: no-cache` for `sw.js`, `index.html`, and `manifest.webmanifest`; allows 24h caching for `/icons/*`. |

---

## 3. UI System & Screen Architecture

The visual presentation adheres to a curated "Warm Paper & Night Journey" aesthetic:
- **Design Tokens:** `--paper: #f2ead4`, `--ink: #1c2b2e`, `--brand: #163842`, `--brand2: #20515e`, `--saffron: #d98e2b`, `--rust: #8a3324`, `--line: #c7bb96`, `--mute: #5e6f6a`.
- **Dark Mode ("Night Journey"):** Automatically reacts to OS preference or manual toggle, transforming tokens to deep nocturnal tones (`--paper: #0b1822`, `--ink: #f0e9d7`, etc.).
- **Typography:** Google Fonts *Fraunces* (editorial serif headings) and *IBM Plex Sans* (high-legibility UI body).

```
+-------------------------------------------------------------------------+
| [Brandmark: YATRA]             [Offline Pill]            [Theme Switch] |
+-------------------------------------------------------------------------+
|                                                                         |
|  [Screen 1: Setup / Home]                                               |
|  ├── Dynamic Hero (Analog Clock / Flip Compass, Greeting, Countdown)   |
|  ├── Nudge Banner (Overspend / Imminent Trip Packing Alerts)             |
|  ├── Multi-Trip Selector Carousel (Trip cards with SVG thumbnails)      |
|  ├── Today's Plan Card (Current day highlights & check-offs)            |
|  ├── Quick Stat Tiles (Itinerary count, packing %, remaining budget)    |
|  ├── Route Map (Animated SVG curve with moving vehicle icon)            |
|  ├── Trip Setup Form (Origin, Destination chips, Dates, Travelers)      |
|  ├── Trip Report Generator (Formatted text download/copy)               |
|  ├── PWA Install Card (Android prompt button / iOS Safari guide)         |
|  └── Backup & Restore Engine (JSON download, manual paste, upload)      |
|                                                                         |
|  [Screen 2: Itinerary]                                                  |
|  ├── Day Strip (Horizontal date chip navigation)                        |
|  ├── View Segmented Toggle (Cards View vs. Timeline View)               |
|  ├── Day Cards / Timeline items with progress rings                     |
|  ├── Day Sheet Modal (Activity editor, reorder, time sort, map links)   |
|  └── Day & Full Itinerary Sharing (WhatsApp, Canvas PNG, Custom PDF)    |
|                                                                         |
|  [Screen 3: Checklist]                                                  |
|  ├── Packing Progress Track & Done/Pending Counters                     |
|  ├── Category Accordions (Documents, Kapde, Toiletries, Custom items)   |
|  └── Milestone Celebrations (Stamp & confetti at 50% and 100%)          |
|                                                                         |
|  [Screen 4: Budget]                                                     |
|  ├── Metric Counters (Total Budget, Total Spent, Remaining Balance)     |
|  ├── Overspend Alert Banner (Category and total overrun alerts)         |
|  ├── SVG Donut Chart (Category expenditure distribution)                |
|  ├── Day-wise Stacked Column Graph (Daily expenses against dates)       |
|  ├── Category Budget Allocator & Custom Category Palette Manager        |
|  └── Expense Add Form & Inline-Editable Expense History List            |
|                                                                         |
|  [Screen 5: Vault]                                                      |
|  ├── Search Bar with Substring Highlighting (<mark>) & Clear Button     |
|  ├── Type Filter Chips (Sab, Ticket, ID, Booking, Contact)             |
|  ├── Auto-Extracted Code Chips (PNRs, phones, emails with tap-to-copy)  |
|  └── Vault Item Cards with One-Touch Copy and Undo Deletion             |
|                                                                         |
|  [Screen 6: Journal]                                                    |
|  ├── Camera / Photo Upload Form with Caption Input                      |
|  ├── Polaroid Grid Layout with Randomized Aesthetic Tilt Angles         |
|  └── In-Memory Canvas Resizer & IndexedDB Blob Persistence              |
|                                                                         |
+-------------------------------------------------------------------------+
| [Floating Bottom Navbar: Home | Itinerary | Packing | Budget | Vault | Journal] |
+-------------------------------------------------------------------------+
```

---

## 4. Data Architecture & Storage Specifications

Data storage in Yatra is partitioned across **LocalStorage** (for structured JSON text metadata) and **IndexedDB** (for binary image blobs).

### 4.1 LocalStorage Keys & Data Models

| Key | Type | Description |
|---|---|---|
| `yatra_theme` | `string` | `"auto" \| "light" \| "dark"` |
| `yatra_itin_view` | `string` | `"cards" \| "timeline"` |
| `yatra_active_id` | `string` | Currently active trip ID (e.g., `"t1728381200000"`) |
| `yatra_trips_index` | `string` (JSON) | Array of trip descriptor stubs: `Array<{ id: string, label: string }>` |
| `yatra_trip_<id>` | `string` (JSON) | Complete data object for trip `<id>` (see schema below) |
| `yatra_last_backup`| `string` (ISO) | ISO timestamp of the last successful backup generation |
| `yatra_pre_restore`| `string` (JSON) | Snapshot of all trips immediately prior to executing a restore |

### 4.2 Complete Trip Data Object Schema (`yatra_trip_<id>`)

```json
{
  "setup": {
    "from": "Prayagraj",
    "dest": ["Mumbai", "Goa"],
    "start": "2026-10-20",
    "end": "2026-11-01",
    "travelers": 2,
    "stay": "family",
    "budget": "balanced",
    "pace": "balanced"
  },
  "days": [
    {
      "label": "Elephanta + Mahalaxmi + Haji Ali",
      "note": "Optional day logistics advice",
      "items": [
        {
          "text": "Gateway of India, ferry ticket",
          "done": true,
          "time": "08:30",
          "place": "Gateway of India",
          "note": "Ferry round-trip: ₹260"
        },
        {
          "text": "Elephanta Caves",
          "done": false
        }
      ]
    }
  ],
  "checklist": {
    "state": {
      "0:Train tickets": true,
      "1:Cotton tees": true
    },
    "custom": [
      { "id": "c0", "text": "Goa sunscreen SPF 50" }
    ],
    "hidden": {
      "0:Cash / UPI": true
    },
    "rename": {
      "0:Train tickets": "IRCTC e-Tickets printout"
    }
  },
  "budgetData": {
    "catBudget": {
      "Travel": 15000,
      "Stay": 8000,
      "Food": 6000,
      "Shopping": 4000,
      "Activities": 3000
    },
    "expenses": [
      {
        "desc": "Tejas Express 2AC tickets",
        "amt": 4200,
        "cat": "Travel",
        "date": "2026-10-20"
      }
    ],
    "cats": [
      { "name": "Travel", "color": "p1" },
      { "name": "Stay", "color": "p2" },
      { "name": "Food", "color": "p3" },
      { "name": "Shopping", "color": "p4" },
      { "name": "Activities", "color": "p5" }
    ]
  },
  "vault": [
    {
      "title": "Mumbai to Goa Train Ticket",
      "type": "Ticket",
      "note": "Train 12051 Jan Shatabdi. PNR: 2458910245, Coach B2, Berth 34 (MB)"
    }
  ],
  "journal": [
    {
      "id": "p_1728381200000",
      "caption": "Gateway of India sunrise",
      "date": "2026-10-21"
    }
  ]
}
```

### 4.3 IndexedDB Binary Photo Schema
- **Database Name:** `yatra_photos` (Version `1`)
- **Object Store:** `photos` (key: string `id`, value: `Blob`)
- **Compression Workflow:** Uploaded images are intercepted by `shrinkImage()`, drawn onto an offscreen `<canvas>`, scaled to a maximum dimension of 1280px with JPEG quality 0.82, and stored as an unbloated `Blob`. When rendered, `URL.createObjectURL(blob)` is assigned to Polaroid `<img loading="lazy">` tags.

---

## 5. Exhaustive Subsystem & Function Inventory

Below is an itemized breakdown of the functional modules in `index.html`:

### 5.1 Tab Switching & App Shell Navigation
- `switchScreen(name)`: Handles animated sliding transitions between the 6 screens, scroll resets, and nav indicator alignment.
- `positionNavIndicator(instant)`: Positions the floating pill indicator beneath the active navbar button.
- `applyTheme(mode, animate)`: Toggles light, dark, and auto modes, updates `meta[name="theme-color"]`, and manages CSS classes.

### 5.2 Multi-Trip Model & Persistence
- `tripKey(id)` / `loadTripData(id)` / `saveTripData(id, data)`: LocalStorage read/write wrappers.
- `saveActive(silent)`: Serializes all active memory states (`dest`, `days`, `checklist`, `budgetData`, `vault`, `journal`) into LocalStorage and updates the trip carousel.
- `switchTrip(id)`: Loads target trip state into memory and triggers a full DOM render cycle across all modules.
- `migrateLegacy()`: Migrates version 1 standalone keys (`yatra_trip_v1`, `yatra_itin_v1`, etc.) into the multi-trip data model.
- `deleteActiveTrip()`: Deletes current trip with an 8-second Toast undo restoration handler.

### 5.3 Home Screen & Hero Logic
- `renderHome()`: Computes trip phase (`before`, `during`, `after`), sets dynamic greeting, renders countdown, evaluates budget overspends for nudge banners, and populates today's card.
- `renderRouteMap(stops)`: Uses SVG path trigonometry and `requestAnimationFrame` to draw an animated route line with a moving vehicle and pulsing station nodes.
- `clockInit()` / `clockDraw()` / `clockFrame()`: High-performance analog clock with real-time solar/lunar astronomical positioning and flip-to-compass 3D rotation.

### 5.4 Itinerary Engine
- `renderDays()`: Dispatches rendering to either `renderCards()` or `renderTimeline()`.
- `buildDayTicket(d, di)`: Builds the full ticket card with completion rings, destination-derived SVG artwork, activity lists, and drag-down sheet modal controls.
- `parseItinerary(text)`: Regular expression parser that converts raw text into structured days, items, times, and Google Maps query strings.
- `sortByTime(d)`: Chronologically orders activities possessing valid time attributes.
- `drawDayImage(ctx, di, W, dry)` / `dayImageBlob(di)`: Generates a high-resolution 1080px branded PNG ticket directly on an HTML5 `<canvas>` for image sharing.
- `buildItineraryPdf()`: Lightweight vector PDF generator written from scratch without dependencies, writing raw PDF dictionary streams (`/Type /Page`, `/MediaBox`, fonts) into an uncompressed binary Blob.

### 5.5 Packing Checklist
- `buildChecklist()` / `updateChecklist()`: Groups items into default and custom sets, computes completion percentage, and tracks hidden/renamed defaults.
- `celebrate(level)`: Triggers full-screen SVG stamp animations and 46 random CSS confetti particles upon reaching 50% and 100% packing milestones.

### 5.6 Budget & Expense Analytics
- `overStatus()` / `renderOverAlert()`: Analyzes category and aggregate spending against allocated thresholds, triggering alert banners and warning toasts.
- `renderDonut(force)`: Generates interactive SVG donut chart with hover/tap segment filtering.
- `renderDayGraph(force)`: Calculates date-based expenditure distributions and renders stacked column bar graphs categorized by expense types.
- `deleteCategory(i)`: Deletes a budget category and automatically migrates orphan expenses to "Other" with undo capability.

### 5.7 Vault System
- `renderVault()`: Displays categorized security items, supporting query search with `<mark>` substring highlighting and category filtering.
- `extractCodes(note)`: Automatically extracts PNR codes, phone numbers, and emails using RegEx, rendering one-tap copy chips.

### 5.8 Photo Journal
- `photoDB()` / `photoPut()` / `photoGet()` / `photoDel()`: Promise-based IndexedDB transaction helpers.
- `shrinkImage(file, maxDim, quality)`: Offscreen Canvas resizer converting camera captures to lightweight JPEG blobs.
- `renderJournal()`: Displays photos in responsive Polaroid frames with deterministic angle offsets.

### 5.9 Backup, Restore & Confirmations
- `makeBackup()`: Compiles all trips and metadata into a standardized JSON payload.
- `doRestore(text)`: Validates and unpacks JSON backups with safety rollback snapshots in `yatra_pre_restore`.
- `askConfirm(options)`: Modal dialog with optional strict confirmation word typing ("Sure") and accessible focus trapping.

### 5.10 PWA & Service Worker
- `sw.js` lifecycle: Pre-caches critical app assets (`index.html`, icons, manifest) and Google Fonts; notifies clients of version updates via `SW_ACTIVATED`.
- Install Prompts: Intercepts `beforeinstallprompt` on Chromium and provides a dedicated instructional modal for iOS Safari users.

---

## 6. Verification & Rigorous Testing Audit

During deep inspection of the current code, the following architectural behaviors, edge cases, and strengths were identified:

### Verified Strengths
1. **Quota Safety:** Large images are strictly isolated in IndexedDB (`yatra_photos`), preventing LocalStorage `QuotaExceededError` crashes.
2. **Defensive Storage Operations:** All `localStorage` calls are wrapped in `try/catch` blocks. If private browsing or strict security blocks storage, `flashSaved(false)` triggers an alert.
3. **Data Loss Prevention:** Deletions across all modules (Trips, Days, Activities, Check items, Expenses, Vault entries) have non-blocking Toast undo actions.
4. **Accessible Animations:** Complete support for `prefers-reduced-motion: reduce`, disabling heavy transforms, clock intervals, and canvas animations.
5. **Zero External CSS/JS Dependencies at Runtime:** The entire app runs offline immediately after initial page fetch.

### Edge Cases & Vulnerabilities to Keep in Mind
1. **Device Isolation:** Data is strictly locked to the local device browser. If Aditya modifies a plan on his phone, his companion's phone cannot see it unless a JSON backup file is manually shared and imported.
2. **No Realtime Conflict Resolution:** If two users import and edit backups concurrently, the last imported file clobbers the previous state.
3. **Claude Container Fallbacks:** The AI itinerary and weather generation buttons (`#genItin`, `#genTips`) expect `window.claude.use()`. In standalone browser mode, they gracefully hide, relying instead on the built-in manual plain-text importer.
4. **Photos Not in Backup:** Exported `.json` backups only contain photo captions and metadata to keep file sizes manageable; image binaries stay in IndexedDB.

---

## 7. Firebase Integration Architecture (Multi-Screen Sync)

To address the user's requirement (**"integrate a database so that the app can display data stored in Firebase across multiple mobile screens"**), the following architecture is designed:

### 7.1 Architecture Goals
1. **Realtime Multi-Screen Sync:** When an item is ticked or added on Phone A, Phone B updates in real-time without requiring a page refresh.
2. **Zero-Login Friction (Trip Code / Room ID):** Travel companions should not be forced through cumbersome multi-factor authentication while on the road. Users can generate a 6-character Trip Code (e.g., `YAT-782`) or share a direct link (`?trip=YAT-782`).
3. **Preserve Offline-First Capability:** The app must continue to function seamlessly when connectivity drops, queuing changes locally and syncing when back online.
4. **Preserve Existing UI & Aesthetics:** The existing retro-warm design, analog clock, and snappy responsive components must remain completely intact.

### 7.2 Database Model: Cloud Firestore
Cloud Firestore is recommended over Realtime Database (RTDB) due to its superior offline persistence support, structured queries, and native Web SDK caching.

```
firestore/
│
└── trips/ (collection)
    │
    └── {tripCode}/ (document, e.g., "YAT-782")
        ├── meta: { createdAt, updatedAt, createdBy, tripCode }
        ├── setup: { from, dest, start, end, travelers, stay, budget, pace }
        ├── days: [ { label, note, items: [ { text, done, time, place, note } ] } ]
        ├── checklist: { state, custom, hidden, rename }
        ├── budgetData: { catBudget, expenses, cats }
        ├── vault: [ { title, type, note } ]
        └── journal: [ { id, caption, date } ]
```

### 7.3 Synchronization Data Flow

```
[Phone A: User Action]
       │
       ▼
[Update Local Memory & UI]
       │
       ├──► [Persist to LocalStorage (Immediate local cache)]
       │
       └──► [Push to Firestore doc `trips/{tripCode}`]
                 │
                 ▼ (Cloud Realtime WebSocket/SSE)
          [Firebase Cloud Firestore]
                 │
                 ▼ (`onSnapshot` Listener)
       [Phone B: Realtime Event]
                 │
                 ▼
          [Update Memory State] ──► [Trigger Targeted Render Functions]
```

---

## 8. Implementation & Verification Status

### Status: Complete & Verified ✅
The Firebase Multi-Screen Live Sync system has been implemented directly into [`index.html`](file:///c:/Users/Aditya%20Jaiswal/Downloads/yatra-pwa/index.html) and [`sw.js`](file:///c:/Users/Aditya%20Jaiswal/Downloads/yatra-pwa/sw.js).

### Implemented Features:
1. **Firebase SDK & Offline Cache:** Loaded Firebase App & Firestore Compat v10 via CDN, cached by Service Worker (`sw.js`). Enabled Firestore IndexedDB offline persistence with `synchronizeTabs: true`.
2. **Configuration Management:**
   - Active project credentials attached: `yatra-app-e6fd2` in `window.YATRA_FIREBASE_CONFIG` ([`index.html`](file:///c:/Users/Aditya%20Jaiswal/Downloads/yatra-pwa/index.html), lines 1209–1217).
   - In-app fallback: Interactive paste modal storing config in `localStorage.getItem("yatra_firebase_config")` for quick override.
3. **Trip Code Sharing & Cloud Sync:**
   - **Host:** Click "Live Sync" in header $\rightarrow$ "Live Trip Code Generate Karo" (generates destination-aware code e.g. `MUM-812`).
   - **Join:** Enter 6-character code or open direct link `?trip=MUM-812`.
   - **WhatsApp & Link Sharing:** One-touch copy and direct WhatsApp sharing button.
   - **Realtime Sync:** Debounced cloud push on every local edit (`saveActive`), with `onSnapshot` listener updating companion screens reactively.
4. **Live Browser Testing & Audit:**
   - Verified active project initialization, live trip code generation, and UI state transition.
   - **Zero console errors** logged throughout the verification session.

