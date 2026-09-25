# Cabinet

Cabinet is a lean, self-hosted file locker. It focuses on a fast, mobile-friendly web experience, secure sharing, and high-speed uploads without the bloat of background sync engines.

## Screenshots

Cabinet is optimized for mobile screens and can be added to your home screen as a Progressive Web App (PWA):

### Mobile List View
![Cabinet Mobile List View](screenshots/screenshot-1.png)

### Mobile Grid View
![Cabinet Mobile Grid View](screenshots/screenshot-2.png)

## Features

* **Mobile-First UI**: Responsive React frontend with custom bottom-sheet action drawers.
* **Authenticated At-Rest Encryption**: New files use chunked AES-256-GCM so tampering is detected while range requests remain streamable. Existing legacy AES-CTR files remain readable for migration compatibility.
* **Smart Previews**: Auto-generated thumbnails for images, videos, and PDFs.
* **Public Sharing**: Generate short link hashes with optional password protection, download count limits, and expiration dates.
* **Single Container**: Frontend, modular Express backend, and SQLite database run together in one lightweight Docker image.

## Setup & Running

### Environment Variables

Cabinet requires a few security settings before it will start. Docker Compose reads these values from a file named `.env` in the same directory as `docker-compose.yml`.

The four settings every new installation should understand are:

* `JWT_SECRET`: **Required.** Used to sign login/session tokens. It must be at least 32 characters long. Generate a strong random value with:
  ```bash
  openssl rand -hex 32
  ```
  This produces a 64-character hexadecimal secret. Keep it private. Changing it later will invalidate existing login sessions, but it will not affect stored files.

* `ENCRYPTION_KEY`: **Required.** Used to encrypt files stored by Cabinet. It must be at least 32 characters long. For a new installation, generate a full 32-byte random key with:
  ```bash
  openssl rand -hex 32
  ```
  **Back this value up somewhere safe. Do not casually change or regenerate it after you begin storing files.** Cabinet needs the same key to decrypt existing files. Losing the encryption key can make stored files unreadable.

* `ADMIN_PASSWORD`: **Required.** Password for the bootstrap administrator account created on first startup. It must be at least 12 characters long. Use a strong password that you choose yourself. For example:
  ```dotenv
  ADMIN_PASSWORD=replace-this-with-a-long-unique-password
  ```
  Cabinet does not ship with a public default administrator password.

* `ADMIN_USERNAME`: Optional. Username for the bootstrap administrator account. If omitted, Cabinet uses `admin`.
  ```dotenv
  ADMIN_USERNAME=admin
  ```

Other supported settings are:

* `ALLOW_REGISTRATION`: Defaults to `false`. Set to `true` only if you intentionally want users to be able to register.
* `REGISTRATION_CODE`: Optional registration/invite code. When set, new registrations must provide the matching code.
* `STORAGE_PATH`: Storage path inside the container. The supplied Compose file uses `/app/users`; normally you should leave this unchanged.
* `CABINET_DATA_DIR`: Host directory mounted at `/app/users`. Defaults to `./user_data`. Use a stable absolute path for production if the Compose directory may move.
* `MAX_UPLOAD_SIZE`: Maximum completed file size in bytes. The supplied Compose file defaults to 50 GiB.
* `UPLOAD_CHUNK_SIZE`: Browser upload chunk size in bytes. Defaults to 8 MiB so large uploads work through proxies with relatively small request-body limits.
* `UPLOAD_REQUEST_TIMEOUT_MS`: Node request timeout in milliseconds. Defaults to `0` (disabled) so slow/large uploads are not killed by the application server.
* `TRUST_PROXY`: Defaults to `false`. Set to `true` when Cabinet is behind a trusted reverse proxy such as Traefik, Caddy, or Nginx and you want Cabinet to trust the forwarded client IP.
* `COOKIE_SECURE`: Defaults to `true` for production. Keep this enabled when Cabinet is accessed over HTTPS. Set it to `false` only for an intentional plain-HTTP local/LAN deployment.

#### Create your `.env` file

From the directory containing `docker-compose.yml`, copy the example file:

```bash
cp .env.example .env
```

Generate two independent random secrets:

```bash
openssl rand -hex 32
openssl rand -hex 32
```

Use one output for `JWT_SECRET` and the other for `ENCRYPTION_KEY`. Do **not** use the same value for both.

Then edit `.env` so it looks similar to this:

```dotenv
JWT_SECRET=put-the-first-generated-secret-here
ENCRYPTION_KEY=put-the-second-generated-secret-here
ADMIN_PASSWORD=choose-a-long-unique-admin-password
ADMIN_USERNAME=admin

ALLOW_REGISTRATION=false
REGISTRATION_CODE=
TRUST_PROXY=false
COOKIE_SECURE=true

CABINET_DATA_DIR=./user_data
MAX_UPLOAD_SIZE=53687091200
UPLOAD_REQUEST_TIMEOUT_MS=0
UPLOAD_CHUNK_SIZE=8388608
```

Do not commit your real `.env` file to Git. Cabinet's `.gitignore` excludes it by default.

#### First startup with Docker Compose

Once `.env` is configured:

```bash
docker compose pull
docker compose up -d
```

Watch the startup logs if you want to confirm initialization:

```bash
docker compose logs -f cabinet
```

On the first successful startup, Cabinet creates the administrator account using `ADMIN_USERNAME` and `ADMIN_PASSWORD`.

After Cabinet is running, open:

* Web UI: `http://localhost:4444`
* API documentation: `http://localhost:4444/api/docs`

For an internet-facing deployment, put Cabinet behind HTTPS before signing in and keep `COOKIE_SECURE=true`.

#### Persistent data and safe updates

Cabinet stores its SQLite database, encrypted files, thumbnails, logs, and in-progress chunked uploads under `/app/users` inside the container. Docker Compose bind-mounts that path from `CABINET_DATA_DIR` on the host.

The default is:

```dotenv
CABINET_DATA_DIR=./user_data
```

For a long-lived server, an absolute host path is safer because it does not depend on which directory you launch Compose from:

```dotenv
CABINET_DATA_DIR=/srv/cabinet/user_data
```

A normal image update may recreate the container without recreating Cabinet itself:

```bash
docker compose down
docker compose pull
docker compose up -d
```

That sequence does **not** delete the host data directory. Cabinet will reopen the same `database.sqlite`, users, files, and folders after the new container starts.

To preserve an existing installation:

* Keep the same `CABINET_DATA_DIR`.
* Keep the same `ENCRYPTION_KEY`; existing encrypted files require it.
* Keep the existing `.env` file.
* Do not delete or replace the host data directory when updating.

If you use the relative default `./user_data`, run Compose from the same project directory each time or switch `CABINET_DATA_DIR` to an absolute path.

#### Large browser uploads

Browser uploads use a chunked upload API instead of sending one enormous multipart request. The default chunk size is 8 MiB, so a 1 GiB file is transferred as many small requests and then finalized server-side. This makes uploads much more tolerant of reverse proxies, tunnels, and CDNs that enforce per-request body limits.

Relevant settings:

```dotenv
MAX_UPLOAD_SIZE=53687091200
UPLOAD_CHUNK_SIZE=8388608
UPLOAD_REQUEST_TIMEOUT_MS=0
```

The defaults allow files up to 50 GiB, send browser uploads in 8 MiB chunks, and disable Cabinet's own Node request timeout. Your reverse proxy may still have its own request-body or timeout settings, but each chunk only needs to fit through that limit.

Cabinet logs chunked-upload initialization/completion and aborted/failed HTTP requests. The web UI also displays the actual upload failure instead of silently leaving a stalled progress item.

#### Diagnostic logging

Cabinet supports configurable logging through `LOG_LEVEL`.

Normal operation:

```dotenv
LOG_LEVEL=info
```

For active troubleshooting:

```dotenv
LOG_LEVEL=debug
```

Then recreate the container:

```bash
docker compose down
docker compose pull
docker compose up -d
docker compose logs -f cabinet
```

At `debug` level Cabinet records additional diagnostic context including:

* request IDs, request start/completion, HTTP status, and request duration
* client IP plus forwarded IP/protocol information when present
* request content type and content length
* authentication acceptance/rejection reasons without logging tokens or passwords
* quota reservation and release decisions
* chunked-upload initialization, expected chunk count, every received chunk, byte counts, percentage, and per-chunk write timing
* upload status/finalization requests
* hash, thumbnail, encryption, and finalization timings
* aborted connections and HTTP client connection errors
* startup configuration such as upload limits, chunk size, timeout, proxy mode, cookie mode, storage path, and active log level

Cabinet deliberately does **not** log JWT values, cookies, passwords, registration codes, or the encryption key.

Every response also receives an `X-Request-ID` header. When investigating one failed browser request, that ID can be matched against the server log entries for the same request.

The structured log file is stored at:

```text
/app/users/cabinet.log
```

which means it is persisted inside `CABINET_DATA_DIR` alongside the database and user storage.

Useful commands:

```bash
# Follow container output
docker compose logs -f cabinet

# Last 300 lines
docker compose logs --tail=300 cabinet

# Search persisted structured logs for uploads/errors
grep -Ei 'upload|aborted|failed|error|quota' "${CABINET_DATA_DIR:-./user_data}/cabinet.log"

# Follow the persisted log directly
tail -f "${CABINET_DATA_DIR:-./user_data}/cabinet.log"
```

For routine operation, switch back to `LOG_LEVEL=info` once troubleshooting is finished so per-chunk/request debug messages do not generate unnecessary log volume.

#### Updating Cabinet later

The Compose file uses `ghcr.io/soltros/cabinet:latest` and `pull_policy: always`. To update to the newest published image:

```bash
docker compose down
docker compose pull
docker compose up -d
```

Keep the same `.env`, `CABINET_DATA_DIR`, and `ENCRYPTION_KEY` when updating.

### Quick Start

1. **Pull the published image**
   ```bash
   docker pull ghcr.io/soltros/cabinet:latest
   ```

2. **Run the container**
   ```bash
   docker run -d \
     --name cabinet \
     -p 4444:4444 \
     -e ENCRYPTION_KEY="$(openssl rand -hex 32)" \
     -e JWT_SECRET="$(openssl rand -hex 32)" \
     -e ADMIN_PASSWORD="replace-with-a-strong-password" \
     -v "$(pwd)/user_data:/app/users" \
     ghcr.io/soltros/cabinet:latest
   ```

3. **Access**
   * Web UI: `http://localhost:4444`
   * Swagger Docs: `http://localhost:4444/api/docs`

### Using Docker Compose

The Compose file deploys the published GHCR image rather than building locally:

```bash
docker compose pull
docker compose up -d
```

`docker-compose.yml` uses `ghcr.io/soltros/cabinet:latest` with `pull_policy: always` and bind-mounts `${CABINET_DATA_DIR:-./user_data}` at `/app/users`. Local source builds remain available for development and CI with `docker build`.

### Reverse Proxy & SSL

Cabinet is designed to run behind a reverse proxy (like Nginx, Traefik, or Caddy) for TLS termination. The container listens on port `4444`. Set `TRUST_PROXY=true` only when requests reach Cabinet through a trusted proxy.

---

## Backups

Because Cabinet packages all configurations and files under a single mapping directory, complete backups are easy. Simply archive the `./user_data` folder on the host:

```bash
tar -czf cabinet-backup-$(date +%F).tar.gz ./user_data
```

---

## Development

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run the Dev Environment**
   This launches the Express backend API and Vite server concurrently:
   ```bash
   npm run dev
   ```