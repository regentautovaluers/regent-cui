# Regent CUI (Commercial User Interface)

Nuxt 3 + Vue 3 web application for corporate clients and admin users. Comprehensive platform covering vehicle valuation, roadside assistance, GPS tracking, insurance telematics, and collateral verification across Kenya and Rwanda.

## Tech Stack

- **Nuxt 3.19.2** (Vue 3.5.21, Vue Router 4.5.1)
- **Pinia 3.0.4** + Harlem (legacy) for state management
- **Tailwind CSS 4.1.13** + Flowbite
- **TypeScript**
- **Firebase 12.3.0** (Realtime Database & Auth)
- **Chart.js 4.5.0** + chartjs-plugin-datalabels + annotation
- **ExcelJS 4.4.0** for Excel export
- **vue3-google-map 0.24.1** for maps
- **@microsoft/fetch-event-source** for SSE streams
- **crypto-js** for AES encryption

## Build & Run

```bash
npm install
npm run dev          # Dev server on port 8000
npm run build        # Production build (pre-rendered)
npm run generate     # Static site generation
npm run preview      # Preview production build
```

**Docker**: Multi-stage Node 20.19.2 build. Runtime: node:20.19-slim. Serves `.output/server/index.mjs` on port 3000.

## Configuration (nuxt.config.ts)

**Runtime Config Variables** (set via environment):
- `GOOGLE_MAPS_API_KEY` - Maps integration
- `REGENT_TRACK_CERTS_BASE_URL`, `TRACKING_CERTS_API_KEY` - GPS tracking
- `AI_CHAT_BASE_URL`, `AI_CHAT_API_KEY` - AI report analysis
- `VALUATION_BASE_URL` - Vehicle valuation backend
- `AVA_BASE_URL` - Roadside assistance service
- `REPORT_GENERATOR_BASE_URL` - PDF/Excel export
- `FRAUD_DETECTION_BASE_URL`, `FRAUD_DETECTION_*` - Collateral verification
- Firebase config (API key, auth domain, DB URL, etc.)

## Authentication

### Dual Auth System
1. **Valuation Auth**: Email/password -> JWT token stored in `valuation_auth_token` cookie
2. **Tracking Auth**: Separate login for GPS tracking -> `tracking_auth_token` cookie

### Roles
- `ROLE_CORP_ADMIN` - Full corporate access
- `ROLE_CORP_NORM` - Standard corporate user

### Corporate Classes
BANK | MICRO_FINANCE | SACCO | INSURANCE | COURT | GOVT_INST | OTHERS

### Middleware
- `01.initial_auth_check.global.ts` - Validates valuation token on every route
- `02-regent_tracking-auth_check.global.ts` - Validates tracking token for tracking routes

## Pages & Routing

### Login & Dashboard
- `/` - Login page (exterior-layout)
- `/console` - Dashboard home (console-layout)
- `/report-validator` - Report validation

### Vehicle Valuation (`/console/vehicle-valuation/`)
- `/assessment` - View reports (tabs: ongoing, complete, tampered)
- `/authorization-letter` - Authority letters (sub: /create, /previous)
- `/fleet-reports` - Fleet reporting (sub: /explore/[fleet_id])
- `/report/[valuation_id]` - Individual valuation report

### Roadside Assistance (`/console/ava-roadside-assistance/`)
- `/` - Main dashboard
- `/membership-types` - Browse membership tiers
- `/onboard/[membership_type]` - Register members
- `/request-roadside-assistance` - Request services (tyre, fuel, jumpstart, towing)
- `/roadside-assistance` - View active requests
- `/report/[service_type]/[format]/[id]` - Service reports
- `/visualizer` - Service map visualization

### Regent Tracking (`/console/regent-track/`)
- `/` - Tracking auth page
- `/device-tracking/` - Device dashboard (sub: traceability-report, vehicle-history)
- `/insurance-telematics/` - Driver analytics (sub: all-vehicles, analytics, panic-alerts, accidents)

### Collateral Verification (`/console/collateral-verification/`)
- `/` - Dashboard
- `/onboard` - Single asset registration
- `/bulk-onboard` - Bulk registration
- `/manage-list` - Fraud list management
- `/query-collateral` - Search collateral
- `/iprs-check` - IPRS document checks (national ID, alien ID, driving license, KRA PIN, business reg)
- `/payments` - Payment management (sub: invoices, regular)

### Settings (`/console/settings/`)
- `/my-account`, `/manage-users`, `/add-user`, `/corp-branches`, `/integrations`

### Placeholder Routes (not yet implemented)
`/ava-chat`, `/accident-management`, `/garage`, `/parts`, `/emergency-evacuation`

## State Management

### Pinia Stores (newer)
| Store | Purpose |
|-------|---------|
| `valuation-principal-store` | Authenticated user session, isAdmin/isBroker |
| `corporate-clients-store` | Corporate client list cache |
| `ai-report-chart-store` | AI chat sessions for valuation reports |
| `ava-ai-chat-store` | AVA assistant chat sessions |
| `sidebar-collapsed-state` | UI sidebar toggle |

### Harlem Stores (legacy)
| Store | Purpose |
|-------|---------|
| `ava-members-store` | Roadside assistance members cache |
| `regent-tracking-devices-store` | Tracked vehicles, active location, analytics progress |
| `roadside-assistance-store` | RA analytics (jumpstarting, fuel, towing, tyre counts) |
| `collateral-verifications-tokens-store` | API token balance |
| `roadside-incidents-store` | Incident data cache |
| `regent-tracking-traceability-reports` | Traceability report cache |

## Composables (Business Logic)

### Utility
`useAuth`, `useFirebaseRTDB`, `useStandardizedApi`, `useApiData`, `useGoogleMaps`, `useNavigationRoutes`, `useToast`, `useCorporateClients`, `useAIChat`, `useAVAAIChat`

### Vehicle Valuation
`useCorporateValuations`, `useAuthorityLetters`, `useExportValuationAssets`, `useValuationFleets`, `useValuationReportDownloader`, `useCorporateBranch`, `useUserAccounts`, `useRegentBranches`

### Roadside Assistance
`useAVAMemberships`, `useAVAMembershipTypes`, `useAVAMembershipCharts`, `useFleets`, `useBulkMembershipRegistration`, `useIndividualMembershipRegistration`, `useAVARequests`, `useRoadsideIncidents`, `useRACharts`

### Regent Tracking
`useRegentTrackingAuth`, `useRegentDeviceTracking` (SSE updates, geocoding), `useRegentTrackingDeviceEvents`, `useRegentTrackingDeviceHistory`, `useDeviceTraceabilityReport`, `useRegentTrackingDeviceUtils`

### Insurance Telematics
`useAnalyzeInsuranceMetrics` (driver behavior + accident analysis via SSE stream)

### Collateral Verification
`useCollateralVerification`, `useCollateralVerificationManagement`, `useFraudDetection`

## Server API Proxies (`/server/api/`)

All endpoints proxy to backend services using centralized `makeProxyRequest()` utility.

- **App Security**: login, load principal
- **Vehicle Valuation**: valuations, authority letters, reports, exports, corporate clients
- **Regent Tracking**: vehicles (SSE), device events/history, commands, telematics
- **AVA Chat**: sessions, messages, answers
- **AI Reports Chat**: initialize, status, ask, history, drop session
- **Roadside Assistance**: membership types, registration (individual/bulk), fleets
- **Shared**: realtime-notifications-sse

## Plugins
- `chartjs.client.ts` - Chart.js registration
- `flowbite.client.ts` - Flowbite initialization
- `location.client.ts` - Browser geolocation (@vueuse/core)
- `ofetch.client.ts` - Global HTTP client with dynamic auth headers per service

## External Service Integrations
1. Valuation API - Vehicle valuation backend
2. AVA API - Roadside assistance
3. Regent Track API - GPS tracking (SSE real-time)
4. AI Chat API - Report analysis chatbot
5. Fraud Detection API - Collateral verification
6. Report Generator - PDF/Excel export
7. Google Maps - Geocoding, map display
8. Firebase Realtime DB - Notifications

## CI/CD
GitHub Actions (`.github/workflows/preview-build.yml`): Triggers on `preview-build` branch push. Builds with Node 20.x. Deploy stage commented out.
