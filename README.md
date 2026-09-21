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
* `MAX_UPLOAD_SIZE`: Maximum upload size in bytes. The supplied Compose file defaults to 500 MiB.
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

#### Updating Cabinet later

The Compose file uses `ghcr.io/soltros/cabinet:latest` and `pull_policy: always`. To update to the newest published image:

```bash
docker compose pull
docker compose up -d
```

Keep your existing `.env` file and `user_data` directory when updating. In particular, keep the same `ENCRYPTION_KEY`.

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

`docker-compose.yml` uses `ghcr.io/soltros/cabinet:latest` with `pull_policy: always`. Local source builds remain available for development and CI with `docker build`.

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