# Engineering Audit: regent-cui

**Date:** 2026-04-18 | **Stack:** Nuxt 3.19 / Vue 3 / Pinia + Harlem / Tailwind / Firebase / SSE / Google Maps | **Scale:** 51 pages, 11 stores, 18 forms, 37 icons

---

## 1. Security Auditor

### MUST FIX

**1.1 Google Maps API key hardcoded in client (P0)**
- **File:** `composables/util/useGoogleMaps.ts:2`
- **Evidence:** `const apiKey: string = 'AIzaSyAfiZC3ThO1RVxsag0Dn2XzYu9oEux7VDI';`
- **Impact:** Publicly visible. Billing fraud, quota exhaustion.
- **Fix:** Move to server-side env variable. Proxy geocoding through Nuxt server API.

**1.2 AVA/Fraud Detection credentials hardcoded in client plugin (P0)**
- **File:** `plugins/ofetch.client.ts:19-34`
- **Evidence:** AVA password `'LiV1tKgaqEtwPn7'`, API key `'fe08ab023b8f...'`, and fraud detection password `'k8#F$j2!L9@qW7%zX5^pR3&vN6*'` all in client-side oFetch plugin. Visible in browser DevTools.
- **Fix:** Route ALL external API calls through Nuxt server middleware `/server/api/`. Never expose credentials to client.

**1.3 Hardcoded AES encryption keys (P0)**
- **File:** `utils/security-util.ts:10,111`
- **Evidence:** `SECRET_KEY = 'a7F9#kL3$pQ8!zR2@xY5%vU6&wT1*bN4'` and `ENCRYPTION_KEY = '7x!A%D*G-KaPdSgVkYp3s6v9y$B?E(H+'`. CryptoJS AES with predictable IV.
- **Fix:** Use server-side encryption only. Use proper key derivation (PBKDF2/Argon2). Key Management Service for production.

**1.4 Tracking auth cookie missing security flags (P1)**
- **File:** `composables/regent-tracking/useRegentTrackingAuth.ts:6-10`
- **Evidence:** `useCookie('tracking_auth_token', { expires: ... })` — no `httpOnly`, `secure`, or `sameSite` flags.
- **Fix:** Add `httpOnly: true, secure: true, sameSite: 'Strict'`. Reduce TTL from 14 days to 24-48 hours.

---

## 2. Memory Leak Expert

### MUST FIX

**2.1 SSE EventSource never cleaned up on navigation (P0)**
- **File:** `composables/regent-tracking/useRegentDeviceTracking.ts:19,144-177`
- **Evidence:** `AbortController` defined at composable level. `initializeFrequestUpdateSSE()` starts stream. No `onBeforeUnmount()` to abort. Navigating away and back creates duplicate streams.
- **Scenario:** 10 navigations = 10 concurrent SSE streams, all accumulating in memory.
- **Fix:** Add `onBeforeUnmount(() => { frequecyUpdatesAbortController.abort(); })`.

**2.2 Firebase RTDB listeners never unsubscribed (P0)**
- **File:** `composables/util/useFirebaseRTDB.ts:53-77,91-96`
- **Evidence:** `onChildAdded(recentDataQuery, callback)` — return value (unsubscribe function) never captured. `onAuthStateChanged()` listener never unsubscribed. No `onUnmounted()` cleanup.
- **Impact:** Unbounded Firebase connections. Listener count grows with every navigation.
- **Fix:** Capture unsubscribe functions. Call in `onUnmounted()`.

**2.3 Insurance Telematics SSE no unmount cleanup (P1)**
- **File:** `composables/insurance-telematics/useAnalyzeInsuranceMetrics.ts:64,151-250`
- **Evidence:** `watch()` aborts old stream on dependency change (partially mitigated) but no `onUnmounted()` for final stream.
- **Fix:** Add `onUnmounted(() => { analysisController.abort(); })`.

**2.4 9 Pinia stores not cleared on logout (P2)**
- **File:** `composables/util/useAuth.ts:76-93`
- **Evidence:** `attemptLogout()` cleans principal and tracking devices but NOT: ava-members, corporate-clients, roadside-incidents, roadside-assistance, collateral-verifications-tokens, traceability-reports, ai-chat, ai-report-chart stores.
- **Impact:** New user sees previous user's cached data momentarily.
- **Fix:** Clear ALL store state on logout.

---

## 3. Bottleneck Scrutinizer

### SHOULD FIX

**3.1 No virtual scrolling for large tables (P2)**
- **File:** `pages/console/vehicle-valuation/assessment/complete-reports.vue:100-227`
- **Evidence:** `v-for="(valuation, index) in corpValuations"` renders all rows as DOM nodes.
- **Fix:** Use `vue-virtual-scroller` for tables >20 rows.

**3.2 Vehicle filter recomputes status on every keystroke (P3)**
- **File:** `composables/regent-tracking/useRegentDeviceTracking.ts:60-106`
- **Evidence:** `computed` calls `deriveProperTrackerStatus()` in filter loop for every vehicle on every search input change.
- **Fix:** Pre-compute status when devices load. Memoize results.

---

## 4. Bug Hunter

### MUST FIX

**4.1 SSE reconnection logic missing (P1)**
- **File:** `composables/regent-tracking/useRegentDeviceTracking.ts:144-177`
- **Evidence:** No `onerror` handler. If backend closes stream or network glitch, user sees stale vehicle positions indefinitely with no indication. No retry logic.
- **Fix:** Add `onerror` handler with exponential backoff reconnection (max 3 retries).

### SHOULD FIX

**4.2 Pagination out-of-bounds after filter change (P2)**
- **File:** `composables/vehicle-valuation/useCorporateValuations.ts:36-88`
- **Evidence:** `page: Ref<number> = ref(0)`. If user is on page 5 and filter reduces results to 2 pages, page stays at 5 (out of bounds).
- **Fix:** Reset `page.value = 0` when filters change.

**4.3 Variable name typo (P3)**
- **Evidence:** `frequecyUpdatesAbortController` — misspelled "frequency".

---

## 5. Code Review Sentinel

### SHOULD FIX

**5.1 Dual state management — Pinia + Harlem (P2)**
- **Evidence:** 11 stores total. Some use Pinia `defineStore()`, others use Harlem `createStore()`. Different APIs, confusing patterns.
- **Why:** Historical artifact — Harlem was used first, Pinia added later.
- **Fix:** Migrate all Harlem stores to Pinia in single refactor.

**5.2 TypeScript not strict (P2)**
- **Evidence:** No `"strict": true` in tsconfig. Implicit `any` types slip through.
- **Fix:** Enable strict mode. Fix resulting type errors.

**5.3 No form validation library (P2)**
- **File:** `components/forms/IndividualMembershipReg.vue:14-36`
- **Evidence:** Only HTML5 `required` attribute. No regex, no custom error messages, no field-level feedback.
- **Fix:** Add VeeValidate or Valibot.

**5.4 Dead code — commented out sections (P3)**
- **Files:** Multiple — `useAuth.ts:18`, `security-util.ts:56-69`, `insurance-telematics.vue:21-32`.
- **Fix:** Remove all commented code. Use git history instead.

---

## 6. Quality Controller

### MUST FIX

**6.1 Zero tests (P1)**
- **Evidence:** No `.spec.ts`, `.test.ts`, or `__tests__` directories. 51 pages, 18 forms, 11 stores — all untested.
- **Fix:** Set up Vitest. Add tests for composables, stores, and forms.

### SHOULD FIX

**6.2 Inconsistent error handling (P2)**
- **Evidence:** Generic "Try Again!" toast vs specific messages. No distinction between 401/403/network errors.
- **Fix:** Create error utility with error type classification.

---

## 7. DevOps Analyst

### SHOULD FIX

**7.1 Docker image runs as root (P2)**
- **File:** `Dockerfile`
- **Evidence:** No `USER` directive.
- **Fix:** Add non-root user.

**7.2 GitHub Actions workflow missing quality gates (P2)**
- **File:** `.github/workflows/preview-build.yml`
- **Evidence:** No test, lint, or type-check steps.
- **Fix:** Add: `npx nuxi typecheck`, `npm run lint`, `npm test`, `npm audit`.

**7.3 No health check in Docker (P3)**
- **Fix:** Add HEALTHCHECK directive.

---

## Summary

| Category | P0 | P1 | P2 | P3 | Total |
|----------|-----|-----|-----|-----|-------|
| Security | 3 | 1 | 0 | 0 | 4 |
| Memory | 2 | 1 | 1 | 0 | 4 |
| Performance | 0 | 0 | 1 | 1 | 2 |
| Bugs | 0 | 1 | 1 | 1 | 3 |
| Code Quality | 0 | 0 | 3 | 1 | 4 |
| Quality/Testing | 0 | 1 | 1 | 0 | 2 |
| DevOps | 0 | 0 | 2 | 1 | 3 |
| **Total** | **5** | **4** | **9** | **4** | **22** |
