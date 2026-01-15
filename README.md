# Cabinet

Cabinet is a lean, high-performance "File Locker" designed for self-hosting. It prioritizes a fast web experience, mobile-first design, and simple file management without the bloat of complex syncing engines.

## Features

*   **Mobile-First UI**: Responsive React frontend with Tailwind CSS.
*   **Drag & Drop Uploads**: Fast uploads with real-time progress bars.
*   **Media Previews**: Auto-generated thumbnails for images and videos, plus PDF previews.
*   **Secure Sharing**: Generate public links with password protection, expiration dates, and download limits.
*   **Single Container**: Entire stack (Frontend + Backend + DB) runs in one Docker container.
*   **Configurable Limits**: Set maximum file upload size via environment variables.

## Quick Start

### Prerequisites
*   Docker

### Build & Run

1.  **Build the Image**
    ```bash
    docker build -t cabinet .
    ```

2.  **Run the Container**
    ```bash
    docker run -d -p 4444:4444 -v $(pwd)/user_data:/app/users cabinet
    ```

3.  **Access Cabinet**
    *   Open `http://localhost:4444` in your browser.
    *   API Documentation: `http://localhost:4444/api/docs`

### Using Docker Compose

1.  **Run with Compose**
    ```bash
    docker-compose up -d --build
    ```

2.  **Clean Rebuild (No Cache)**
    To ensure a completely fresh build without using cached layers:
    ```bash
    docker-compose build --no-cache && docker-compose up -d
    ```

### Reverse Proxy & SSL

Cabinet is designed to work behind a reverse proxy (like Traefik, Nginx, or Caddy) for SSL termination. The application listens on HTTP port `4444` inside the container. HSTS and strict HTTPS enforcement are disabled in the application to allow the proxy to handle security headers.

## Development

*   **Backend**: Located in `backend/`. Run `npm run dev` inside.
*   **Frontend**: Located in `frontend/`. Run `npm run dev` inside.