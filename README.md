# TrafficLens — South African Traffic Management Portal (Front-End Prototype)

## Why I built this

My aunt lost her purse — and with it, her physical driver’s licence. I knew the traffic department holds a national database of licence records, and I thought: *why can’t someone just query this to check if a licence is valid, without needing the physical card?*

I started exploring the idea as a **Python + SQLite backend proof-of-concept**, because that stack is perfect for a lightweight, pre-production validation of the concept. While researching the problem, I discovered something interesting: this actually sits inside a **national infrastructure project** — meaning the thing I was building independently lives in the exact same problem space as a real government initiative.

**This repository is the front-end simulation I built to explore what the user experience should look like.** It’s a fully clickable prototype that simulates every interaction — from licence verification to fine payment to live map-based enforcement — but all data is hardcoded, and there is no backend. The actual Python/SQLite backend is a separate work-in-progress. I built this frontend prototype to nail the UX, visual design, and state management before wiring up a real API.

---

## Overview

TrafficLens is a comprehensive traffic enforcement and citizen service platform concept built for South Africa. It provides a dual-purpose interface: a **Citizen Portal** for drivers to manage licenses, vehicles, and fines, and an **Admin Console** for law enforcement officers to monitor violations, verify documents, and manage roadblocks.

**Important:** This is a purely front-end project. All authentication, payments, licence data, fines, and map vehicles are simulated using static demo data and client-side state (Zustand + sessionStorage). No real user data is processed, and there is no live database or API.

Built with **React**, **Tailwind CSS**, **Framer Motion**, **Zustand**, and **Leaflet**, the application features a fully responsive design with mobile-first layouts, dark-themed admin interface, and real-time map simulations.

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| React 19 | UI framework |
| Vite | Build tool |
| Tailwind CSS 4 | Styling |
| React Router 6 | Routing |
| Zustand | State management (simulated backend state) |
| Framer Motion | Animations |
| Leaflet / React-Leaflet | Interactive maps with dark tiles |
| Lucide React | Icons |

---

## Features (all simulated)

### 🔐 Authentication

- **Landing Page** with three tabs: Citizen Login, Register, Admin Portal
- **Citizen Login**: Accepts any email (must contain @) and password (4+ characters)
- **Citizen Register**: Full registration form with ID number validation (13 digits), password confirmation
- **Admin Login**: Email/password with Province and City jurisdiction selection
- Session persistence via `sessionStorage`
- Logout available on both desktop sidebar and mobile header
- Protected routes with redirect for unauthenticated users

### 👤 Citizen Portal

#### Dashboard
- Welcome greeting with last login timestamp
- Stats cards: Outstanding fines (total amount), License expiry (days remaining), Registered vehicles
- Outstanding fines list with Pay Now buttons
- Digital driver's license card preview
- "Renew now" button opens license renewal modal

#### My License
- Full digital driver's license card with South African flag watermark
- Profile photo display
- License number, surname, first names, date of birth, ID number
- Issue/expiry dates, vehicle codes
- QR code for verification
- Place of issue (City, Province, Code)
- Vehicle categories & codes panel with active/inactive states
- Restrictions & administrative data panels

#### Vehicles
- Vehicle cards showing plate number, make, model, year
- Disc expiry status with color indicators (green = all clear, amber = expiring)
- Outstanding fines per vehicle
- Engine details
- "Renew disc" button (R120) opens payment modal
- "View details" opens full vehicle information modal
- "Add vehicle" modal with 2-step form:
  - Step 1: License plate, VIN number, make, model, year, engine, color, class, province
  - Step 2: Owner details, registration certificate upload (RC1), proof of ownership upload, declarations

#### Payments
- Payment modal with card details form
- Pre-filled demo account (Standard Bank, R12,500 balance)
- VISA card auto-detection
- Processing animation with masked card preview
- Success/error toasts
- Simulated payment processing with 90% success rate
- Fine status updates to "Paid" after successful payment

#### Documents
- List of all user documents (license, registrations, proof of residence, receipts)
- Download buttons for each document
- Status badges (Valid/Recorded)
- Document expiry tracking

#### Profile
- Profile picture with upload functionality
- Personal information display (name, DOB, ID, email, phone, address)
- Edit profile modal with save functionality
- Privacy & data permissions toggles:
  - Identity & license data (required)
  - Vehicle & fine records (required)
  - Payment processing (required)
  - Location sharing (optional, POPIA compliant)
  - Email & SMS notifications
- Toggle feedback with ON/OFF status display

#### Settings
- Account information (email, phone)
- Language selector (English, Afrikaans, isiZulu, isiXhosa)
- Timezone selector
- Notification preferences toggles
- Danger zone with account deletion

#### License Renewal
- 2-step renewal modal:
  - Step 1: Personal details + eye test results from optometrist
  - Step 2: Payment summary with R200 renewal fee
- Eye test certificate upload
- Optometrist name and practice details
- Success confirmation with reference number and 4-6 week collection estimate

#### Notifications
- Notification bell with unread count badge
- Notifications modal with filter tabs (All, Unread, Read)
- Types: Fine due, license expiry, disc expiring, payment confirmed, roadblock alerts
- Action buttons: "Pay now" for fine notifications opens payment modal
- "View details" for license/vehicle alerts
- Mark as read / Mark all read

#### Vehicle Registration
- Add vehicle modal with full form
- VIN number, plate number, make, model, year
- Registration certificate upload
- Proof of ownership upload
- Legal declarations (roadworthy, truth confirmation)

---

### 🛡️ Admin Console

#### Layout
- Dark theme with `bg-adm` (#0B1520) background
- Desktop sidebar with Operations and Analytics navigation groups
- Mobile slide-out hamburger menu
- Mobile bottom navigation bar (Map, Verify, Offenders, Reports, Blocks)
- Top bar with dynamic page title and Live pulse indicator
- Logout button on desktop sidebar and mobile header

#### Live Map
- Interactive Leaflet map centered on Gauteng
- Dark tile layer (CartoDB dark_all)
- **27 moving vehicles** on 11 predefined routes across Gauteng
- **3 police patrol units** with blue pulsing icons
- Smooth vehicle animation at 50ms intervals
- Vehicles reverse direction at route endpoints
- **Fine badges** follow vehicles (red "R1500" or amber "EXP DISC")
- **8 transparent hotspot circles** with pulsing glow animation
- Hotspot popups showing ticket count and revenue
- **3 filter toggles**: Hotspots, Vehicles, Roadblocks
- Stats overlay: Active violations (147), Expired discs (38), Roadblocks, Revenue (R2.9M)
- Zoom controls (+/−/reset/locate)
- Legend with color indicators
- **Plan Roadblock** modal with 3-step form:
  - Step 1: Select location from predefined hotspots with risk levels
  - Step 2: Suggested blocking positions with effectiveness scores, officer count
  - Step 3: Review and confirm
- Right panel: Recent activity feed
- Mobile responsive with compact overlays

#### Verify
- Search bar with ID/License/Plate number options
- Quick search hints for demo
- **Valid result**: Full LicenseCard display with outstanding fines
- **Forged result**: Red alert card with Escalate & Detain/Dismiss buttons
- Action buttons: Flag Driver, Release Driver, Issue Fine
- Flag/Release state changes with toast feedback
- Issue Fine opens payment modal

#### Offenders
- Offender database with 8 registered offenders
- Stats overview: High risk count, total fines, active warrants
- Search and filter (by level: All/High/Medium/Low)
- Sort options (by fines, violations, recent)
- Expandable offender cards showing:
  - Fines amount, violation count, plate numbers
  - Last violation, license status, address, warrants
- **Issue Warrant** modal with reason, priority selector (Standard/High/Urgent)
- **View Full Record** modal with vehicle details, violation history, area activity

#### Roadblocks
- Active/Past tabs with counts
- Stats: Active roadblocks, officers deployed, total fines issued, total arrests
- Roadblock cards with expandable details
- Vehicles stopped, fines issued, arrests metrics
- End Roadblock and Request Backup buttons for active roadblocks
- Plan Roadblock integration

#### Reports
- Stats row: Revenue collected (R482K), Active violations (147), Expired discs (38), Payment rate (94%)
- Working timeframe selector (Week/Month/Quarter/Year) that updates all data
- Animated bar chart for violations by period
- Donut chart for violation types (Speeding 40%, Expired Disc 26%, Parking 16%, Other 18%)
- 15-item recent activity feed with SVG icons
- All charts and labels update dynamically with timeframe changes

#### Activity Log
- 20 activity entries with search and filter
- Type filters: All, Fines Issued, Payments, Roadblocks, Verifications, Alerts
- SVG icons for each action type
- Action badges with color coding
- Relative timestamps (2m ago, 5h ago, Yesterday)
- Officer attribution on each entry

---

## 📱 Responsive Design

- **Mobile-first** approach throughout
- **Bottom navigation bars** on mobile for both citizen and admin
- **Slide-out menus** for admin on mobile
- **Compact overlays** on map for mobile
- Safe area padding for notched phones
- **pb-24** padding on main content to clear bottom nav
- Stats and filters rearrange from vertical to horizontal on mobile

---

## 🎨 Design System

### Colors
| Variable | Hex | Usage |
|----------|-----|-------|
| `--ca` | #1B6CA8 | Primary blue |
| `--ca-light` | #E8F3FB | Light blue background |
| `--ca-dark` | #0F4A7A | Dark blue hover |
| `--adm` | #0B1520 | Admin background |
| `--adm2` | #112030 | Admin sidebar |
| `--adm-acc` | #00C9A7 | Admin accent |
| `--adm-red` | #FF5A5A | Violations/alerts |
| `--adm-amb` | #FFB020 | Warnings |
| `--brand-neon` | #10B981 | Success/valid |

### Typography
- **Space Grotesk**: Headings and display text
- **DM Sans**: Body text
- **Inter**: License card details

---


## 📦 Project Structure

```

src/
├── components/
│   ├── admin/
│   │   └── PlanRoadblockModal.jsx
│   ├── citizen/
│   │   ├── FinesList.jsx
│   │   ├── LicenseCard.jsx
│   │   ├── NotificationsModal.jsx
│   │   ├── PaymentModal.jsx
│   │   ├── RenewalModal.jsx
│   │   └── StatsCards.jsx
│   └── layout/
│       ├── AdminLayout.jsx
│       └── CitizenLayout.jsx
├── data/
│   ├── adminData.js
│   ├── demoUser.js
│   └── notifications.js
├── pages/
│   ├── admin/
│   │   ├── ActivityLog.jsx
│   │   ├── LiveMap.jsx
│   │   ├── Offenders.jsx
│   │   ├── Reports.jsx
│   │   ├── Roadblocks.jsx
│   │   └── Verify.jsx
│   ├── citizen/
│   │   ├── Dashboard.jsx
│   │   ├── Documents.jsx
│   │   ├── License.jsx
│   │   ├── Profile.jsx
│   │   ├── Settings.jsx
│   │   └── Vehicles.jsx
│   └── Landing.jsx
├── store/
│   ├── authStore.js
│   └── paymentStore.js
├── App.jsx
├── main.jsx
└── index.css
```
---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

