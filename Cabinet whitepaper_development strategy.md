# Cabinet: Technical Specification & Roadmap

**Project Vision:** A lean, high-performance "File Locker" that prioritizes the web experience over background syncing. Simple, fast, and modern.

## 1\. Product Overview

* **The Problem:** Existing solutions like Nextcloud are bloated with syncing engines and third-party apps.
* **The Goal:** A self-hosted solution focused purely on web-based uploads from mobile browsers, sharing, and high-speed file management.
* **Core Philosophy:** Fast, lean, responsive, and easy to use across both desktop and mobile platforms.

## 2\. Technical Stack

* **Backend:** Node.js (Express or Fastify)
* **Frontend:** React (Vite-based) with Tailwind CSS for a modern UI.
* **Database:** NeDB or Lowdb (JSON-based, local persistence within a single container).
* **Processing:** `sharp` (Image thumbnails) and `fluent-ffmpeg` (Video transcoding/previews).
* **Deployment:** Single Docker container using a multi-stage build.

## 3\. System Design Specs

### File Storage Logic

* **Path:** `/app/users/[user_id]/user_data` (Mapped via a Docker volume).
* **Metadata:** A structured contract between physical disk files and the UI.
* **Organization:** A flat-storage model on disk; the database handles "virtual" folder organization in the UI.

### Sharing Engine

* **Public Links:** Unique hashes (e.g., `cabinet.com/s/[hash]`) mapping to specific files.
* **Security Features:** Expiration dates, password protection (bcrypt), and download limits (e.g., one-time downloads).

### Robust API (Extensibility Layer)

* **Headless Design:** The official React UI uses the same standard REST API available to developers.
* **Discovery:** OpenAPI/Swagger documentation hosted at `/api/docs`.
* **Integrity:** SHA-256 hashing for all uploads to allow future sync engines to verify files.
* **API Auth:** JWT for web sessions and Personal Access Tokens (PATs) for 3rd-party extensions.

## 4\. Data Schema \(JSON Document Store\)

### File Metadata (`files.json`)

`{`
`  "id": "uuid-v4-string",`
`  "ownerId": "user-uuid",`
`  "name": "project_report.pdf",`
`  "extension": "pdf",`
`  "mimeType": "application/pdf",`
`  "size": 1048576,`
`  "hash": "sha256-hash-of-file",`
`  "path": "/app/users/[user_id]/user_data/[id]",`
`  "thumbnail": "/app/users/[user_id]/thumbnails/[id].webp",`
`  "createdAt": "2026-01-15T10:00:00Z",`
`  "updatedAt": "2026-01-15T10:00:00Z"`
`}`

### Share Link Metadata (`shares.json`)

`{`
`  "id": "short-hash-id",`
`  "fileId": "uuid-v4-string",`
`  "creatorId": "user-uuid",`
`  "isPasswordProtected": true,`
`  "passwordHash": "bcrypt-hash",`
`  "expiresAt": "2026-02-15T00:00:00Z",`
`  "maxDownloads": 10,`
`  "currentDownloads": 0,`
`  "active": true`
`}`

## 5\. Development Roadmap

*Note: Milestones are granular and distinct.*

### Phase 1: The Skeleton

* [ ] **Task 1.1:** Initialize Node.js backend and Dockerfile.
* [ ] **Task 1.2:** Implement local filesystem storage logic (user sandbox creation).
* [ ] **Task 1.3:** Create basic `POST /upload` and `GET /files` API endpoints.

### Phase 2: Data & Security

* [ ] **Task 2.1:** Integrate JSON database (Lowdb/NeDB) for metadata tracking.
* [ ] **Task 2.2:** Build JWT-based auth and Personal Access Token (PAT) management.
* [ ] **Task 2.3:** Add `last_modified` and `hash` fields to the file metadata store.

### Phase 3: Modern Mobile-First UI

* [ ] **Task 3.1:** Setup React with Tailwind CSS.
* [ ] **Task 3.2:** Build responsive "File Grid" with mobile cards and bottom-sheet action drawers.
* [ ] **Task 3.3:** Implement Drag-and-Drop upload with real-time progress bars.

### Phase 4: The "Locker" Features

* [ ] **Task 4.1:** Image thumbnail generation service (using `sharp`).
* [ ] **Task 4.2:** Public Link Generation logic (Hashing and DB entries).
* [ ] **Task 4.3:** Password protection and expiration timers for links.

### Phase 5: Media Optimization & Dev Polish

* [ ] **Task 5.1:** Video playback integration (HTML5 Video + FFmpeg posters).
* [ ] **Task 5.2:** PDF previewer/viewer integration.
* [ ] **Task 5.3:** Integrate Swagger UI (OpenAPI 3.0) for API documentation.