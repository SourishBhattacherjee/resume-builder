# Docker (local) — quick start

Build images and start all services (AI helper, backend, frontend):

```bash
docker-compose build --parallel
docker-compose up -d
```

View logs:

```bash
docker-compose logs -f frontend
docker-compose logs -f backend
docker-compose logs -f ai-helper
```

Stop and remove containers:

```bash
docker-compose down
```

Notes:
- Frontend is served by nginx on host port `5173` (mapped to container port 80).
- Backend listens on host port `5000`.
- FastAPI AI helper listens on host port `9000`.
- The compose mounts `./helper/latex_files` into containers so generated LaTeX persists on the host.
