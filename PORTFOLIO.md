# Regent CUI - Project Documentation

## Overview

Nuxt 3 + Vue 3 admin/commercial dashboard for Regent Auto Valuers. Unified web platform covering vehicle valuation, roadside assistance, GPS vehicle tracking, insurance telematics, and collateral verification services across Kenya and Rwanda.

## Tech Stack

- **Nuxt 3.19.2** (Vue 3 meta-framework)
- **Pinia 3.0.4** + Harlem for state management
- **Tailwind CSS 4.1.13** + Flowbite UI
- **Chart.js 4.5.0** + vue-chartjs for data visualization
- **Firebase 12.3.0** (Realtime DB & Auth)
- **Google Maps** via vue3-google-map
- **ExcelJS 4.4.0** for Excel export
- **Server-Sent Events** for real-time tracking updates
- **Port**: 8000 (dev), 3000 (production)

## Project Structure

```
├── pages/                               # 50+ pages
│   ├── index.vue                        # Login (exterior-layout)
│   ├── report-validator.vue
│   └── console/
│       ├── index.vue                    # Dashboard home (51 total page files)
│       ├── vehicle-valuation/
│       │   ├── assessment/              # Reports (ongoing, complete, tampered)
│       │   ├── authorization-letter/    # Create, previous letters
│       │   ├── fleet-reports/           # Fleet reporting + explore
│       │   └── report/[valuation_id].vue
│       ├── ava-roadside-assistance/
│       │   ├── index.vue                # RA dashboard
│       │   ├── membership-types.vue
│       │   ├── onboard/[type].vue       # Member registration
│       │   ├── request-roadside-assistance/  # 4 service request types
│       │   ├── roadside-assistance.vue  # Active requests
│       │   ├── report/[...]/           # Service reports
│       │   └── visualizer.vue           # Service map
│       ├── regent-track/
│       │   ├── index.vue                # Tracking auth
│       │   ├── device-tracking/         # Dashboard, traceability, history
│       │   └── insurance-telematics/    # Vehicles, analytics, alerts, accidents
│       ├── collateral-verification/
│       │   ├── index.vue, onboard.vue, bulk-onboard.vue
│       │   ├── manage-list.vue, query-collateral.vue
│       │   ├── iprs-check.vue
│       │   └── payments/               # Invoices, regular
│       └── settings/                    # Account, users, branches, integrations
├── components/
│   ├── charts/                          # Doughnut, bar charts
│   ├── forms/                           # 18 form components
│   │   ├── AddCorporateBranch.vue, AddMemberVehicle.vue
│   │   ├── BulkMembershipReg.vue, IndividualMembershipReg.vue
│   │   ├── ExportAuthorityLetter.vue
│   │   ├── collateral-verification/     # Search, edit, top-up forms
│   │   ├── vehicle-valuation/           # Authority letter forms
│   │   └── regent-tracking/             # Traceability, driving behaviour
│   ├── icons/                           # 37 SVG icon wrappers
│   ├── AIChatHelper.vue, ImageCarousel.vue, ParentModal.vue
│   └── ...misc components
├── composables/
│   ├── util/                            # Auth, Firebase, API, Google Maps, Toast, AI Chat
│   ├── vehicle-valuation/               # Valuations, letters, exports, fleets, reports
│   ├── ava-roadside-assistance/         # Members, types, charts, requests, incidents
│   ├── regent-tracking/                 # Auth, device tracking, events, history, utils
│   ├── insurance-telematics/            # Driver behaviour, accident analysis via SSE
│   └── collateral-ver/                  # Verification, fraud detection, management
├── stores/                              # 11 Pinia/Harlem stores
│   ├── valuation-principal-store.ts     # Auth session
│   ├── ava-members-store.ts, ava-ai-chat-store.ts
│   ├── regent-tracking-devices-store.ts # Tracked vehicles + real-time location
│   ├── corporate-clients-store.ts, ai-report-chart-store.ts
│   ├── roadside-assistance-store.ts, roadside-incidents-store.ts
│   ├── collateral-verifications-tokens-store.ts
│   └── sidebar-collapsed-state.ts
├── server/api/                          # Nuxt server proxy endpoints
│   ├── app-security/                    # Login, load principal
│   ├── vehicle-valuation/               # Valuations, letters, reports, exports
│   ├── regent-tracking/                 # Vehicles, SSE, device events, telematics
│   ├── ava-chat/, ai-reports-chat/      # AI chat sessions
│   ├── roadside-assistance/             # Members, fleets
│   └── shared/                          # Real-time notifications SSE
├── middleware/
│   ├── 01.initial_auth_check.global.ts  # JWT token validation
│   └── 02-regent_tracking-auth_check.global.ts  # Tracking auth
├── layouts/                             # exterior, interior, console, report-validator
├── plugins/                             # Chart.js, Flowbite, geolocation, ofetch
├── types/                               # TypeScript interfaces
│   ├── app-security/, corporate-valuations/, ava-roadside-assistance/
│   ├── regent-tracking/, insurance-telematics/
│   └── ai-reports-chat-types.ts, ava-ai-chat-types.ts
└── utils/                               # Date/time, security, tracking, string utils
```

## Major Feature Areas

### 1. Vehicle Valuation
- Browse valuations (paginated, filterable by reg#, date, payment status, tampered)
- Generate and manage authority letters
- Export reports as PDF/Excel
- AI chat with reports (ask questions, get summaries)
- Fleet reporting with explore view

### 2. Roadside Assistance (AVA)
- Register members individually or bulk (Excel import)
- Manage member vehicles
- Request 4 service types: towing, fuel delivery, tire change, jump starting
- Map visualization of active requests
- Analytics (service type distribution, member status doughnut charts)

### 3. Regent Tracking (GPS)
- Real-time vehicle GPS tracking with SSE updates
- Trip history and playback
- Geofence detection
- Device management, comments, commands
- Separate authentication system

### 4. Insurance Telematics
- Driver behavior scoring (harsh braking, acceleration)
- Risk classification (Low/Medium/High)
- Accident severity analysis (Minor/Moderate/Severe)
- Real-time analytics via SSE stream

### 5. Collateral Verification
- Vehicle registration database search
- National ID, alien ID, driving license, KRA PIN, business reg checks
- Fraud/default list management
- Token-based API usage tracking with top-up payments

## Authentication

1. Email/password → POST `/api/app-security/login-valuation-principal`
2. JWT stored in cookie: `valuation_auth_token`
3. Global middleware validates on every route
4. Principal roles: `ROLE_CORP_ADMIN`, `ROLE_CORP_NORM`
5. Corporate classes: BANK, MICRO_FINANCE, SACCO, INSURANCE, COURT, GOVT_INST, OTHERS
6. Regent Tracking has separate login (tracking_auth_token cookie)

## External Service Integrations

| Service | Purpose |
|---------|---------|
| VALUATION_BASE_URL | Vehicle valuation backend |
| AVA_BASE_URL | Roadside assistance service |
| REGENT_TRACK_BASE_URL | GPS tracking service |
| AI_CHAT_BASE_URL | AI report analysis |
| FRAUD_DETECTION_BASE_URL | Collateral verification DB |
| REPORT_GENERATOR_BASE_URL | PDF/Excel export |
| Google Maps API | Geocoding, maps |
| Firebase Realtime DB | Real-time notifications |

## Nuxt Config Highlights

```ts
compatibilityDate: '2025-07-15'
devServer: { port: 8000 }
modules: ['@nuxtjs/harlem', 'nuxt3-notifications', '@nuxt/fonts', '@pinia/nuxt']
// Runtime config holds all API keys and base URLs
```

## Docker

- Multi-stage: node:20.19.2 build → node:20.19-slim runtime
- Serves on port 3000: `node .output/server/index.mjs`

## CI/CD

GitHub Actions workflow (`preview-build.yml`) on `preview-build` branch: npm install → npm run build → npm run generate
