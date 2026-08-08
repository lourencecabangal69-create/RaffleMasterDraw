# Changelog — RaffleMasterDraw

All fixes below were made to `guest.html` and `index.html` in a single session, fixing guest-mode screen sharing, cleaning up dead code, and wiring up live feedback for guests.

---

## 2026-07-31

### Fixed — Guest screen share showing black screen (`guest.html`)

Three separate bugs were stacked on top of each other, any one of which alone would have caused a black screen:

1. **Firebase was never initialized.**
   `guest.html` loaded the Firebase *compat* SDK scripts (`firebase-app-compat.js`, etc.) but never called `firebase.initializeApp(firebaseConfig)`. This meant `firebase.firestore()` threw an error the instant the page ran, killing the entire guest session before it could even listen for the host's offer.
   - **Fix:** added the missing `firebaseConfig` object (matching the one already used in `index.html`) and `firebase.initializeApp(firebaseConfig)`, guarded with `if (!firebase.apps.length)` so it's safe if called twice.

2. **Video element ID mismatch.**
   The JS looked for `document.getElementById('remoteVideo')`, but the actual `<video>` tag in the page is `id="guestVideo"`. `remoteVideo` was always `null`, so even a perfectly working WebRTC stream had nowhere to attach — the video's `srcObject` was simply never set.
   - **Fix:** changed the lookup to `document.getElementById('guestVideo')`.

3. **Status elements never updated.**
   `updateStatus()` looked for `document.getElementById('status')`, which doesn't exist on the page (the real elements are `#statusText` / `#statusDot`). It silently fell back to a detached, invisible `<div>`, so connection state and error messages were never actually shown to the guest.
   - **Fix:** wired `updateStatus()` to the real `#statusText` and `#statusDot` elements, and hid the "waiting for host" overlay (`#waitingMessage`) once a video track arrives.

### Fixed — Host ICE candidates could be silently dropped (`index.html`)

The host wrote ICE candidates to `rooms/{roomId}/hostIceCandidates` **without** a `timestamp` field, but the guest queries that same collection with `.orderBy('timestamp', 'asc')`. Firestore excludes documents missing the order-by field from such queries — so any host ICE candidate generated after the initial offer (e.g. if gathering took longer than the 5s fallback) would never reach the guest.
- **Fix:** added `timestamp: serverTimestamp()` to the host's ICE candidate writes.

---

## Removed — Dead/legacy WebRTC guest code (`index.html`)

Tracing the black-screen bug turned up an entire second, broken implementation of guest screen sharing left over from an earlier architecture. It was fully removed:

- **`window.joinAsGuest`** — an old PeerJS + Firebase *Realtime Database* implementation. It listened at `sessions/{id}/offer` in the Realtime Database, while the host's actual `startScreenShare` writes offers to `rooms/{roomId}` in **Firestore** — a completely different database and path. This function could never have worked. It also called `get(offerRef)` from the Realtime Database SDK, a function that was never even imported — it would have thrown immediately if it had ever run.
- **The retry/connect block** that called `joinAsGuest` and pushed the stream into `#guestVideo` / `#liveIndicator` / `#connectionStatus` inside the page's own `role=guest` handler.
- **The `guestScreenShareContainer` markup** (video box, LIVE badge, and its `@keyframes pulse` CSS) — dead once nothing populated it anymore.
- **The dynamic PeerJS import** and the `Peer` variable — no longer referenced anywhere.
- **Unused Realtime Database imports** (`push`, `remove`, `set`) — only the deleted code ever called them. Kept `ref` / `onValue` / `getDatabase`, which are still used for the `.info/connected` health check.

---

## Changed — `?role=guest` now redirects to `guest.html` (`index.html`)

Previously, opening `index.html?session=X&role=guest` just hid some host buttons and showed a read-only version of the *same* page — it never actually loaded `guest.html`, which is why the Vercel deployment kept showing "the old design."

- **Added an immediate redirect in `<head>`**, before the page body renders: any visit with `?role=guest&session=X` is sent straight to `guest.html?room=X`. This runs before the old dashboard paints, so there's no flash of stale UI.
- **Removed the now-unreachable in-body `role === 'guest'` branch** that used to build the old inline dashboard, since guests never reach it anymore.
- **Updated the "Generate Guest Link" button** so newly generated links point directly to `guest.html?room=...` instead of the old `?role=guest` URL.

> **Known tradeoff:** the old `role=guest` dashboard also mirrored the live winners/draw list for guests (via `listenToSessionState`), separate from the screen share. `guest.html` currently shows only the video and the feedback feed — it does not show that winners list. Flagged for a follow-up if that view is still wanted for guests.

---

## Fixed — Live feedback & shoutouts not working in guest mode (`guest.html`)

`guest.html` already had the full feedback **HTML** (nickname field, message box, send button, message list) — but zero JavaScript behind it. No listener on the send button, no query populating the message list. It was inert markup.

- **Fix:** wired up `#sendFeedbackBtn`, `#feedbackNickname`, `#feedbackText`, and `#feedbackList` to Firestore, reading from and writing to `rooms/{roomId}/comments` — the exact same collection the host page (`index.html`) already uses for its own feedback panel, keyed by the same room ID.
- Matches the host's existing behavior: 10-second send cooldown, auto-generated `Anonymous-N` nickname if left blank, and HTML-escaping of nickname/text before rendering (so one guest's message can't break the page for others).
- No Firestore rules changes were needed — rule #4 in the existing ruleset (`rooms/{roomId}/{collectionId}/{documentId}` → open read/write) already covers the `comments` subcollection.
- **Note on scope:** this makes feedback shared *within a room* (host + all of that room's guests see the same live feed) — not a single feed shared across every room on the site. The host's own comment box is also room-scoped in practice (it only falls back to the separate global `raffle_comments` collection when there's no room ID at all, which doesn't happen for the host). Let me know if you actually want one feed shared across all rooms instead.

---

## Files changed
- `guest.html`
- `index.html`

## Files unchanged
- `firestore.rules` — no changes were needed for any of the above fixes.
