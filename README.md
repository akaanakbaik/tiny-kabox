# short url by kabox

## Tech
- Vite + React + TypeScript (ESM)
- Vercel Serverless Functions (Node 20)
- PostgreSQL (Aiven)

## Run local
1) Install deps
npm i

2) Create .env (local)
Create `.env` and fill:
VITE_APP_NAME
VITE_PUBLIC_BASE_URL
VITE_LOGO_URL
VITE_TELEGRAM_URL

3) Start dev
npm run dev

Frontend runs on:
http://localhost:5173

API routes in dev:
http://localhost:5173/api/shorten
http://localhost:5173/api/health
http://localhost:5173/api/url/{code}
Redirect:
http://localhost:5173/{code}

## Deploy to Vercel
1) Import repo to Vercel
2) Set Environment Variables on Vercel:
DATABASE_URL
PG_CA_CERT
BASE_URL
CODE_MIN_PARTS
CODE_MAX_PARTS
CUSTOM_CODE_MIN_LEN
CUSTOM_CODE_MAX_LEN
VITE_APP_NAME
VITE_PUBLIC_BASE_URL
VITE_LOGO_URL
VITE_TELEGRAM_URL

3) Deploy
4) Add custom domain: tiny.kabox.my.id
5) Ensure VITE_PUBLIC_BASE_URL and BASE_URL are https://tiny.kabox.my.id

## API
POST /api/shorten
Body:
{ "url": "https://example.com", "code": "ptfaka" }

GET /{code}
Redirect to the original URL

GET /api/url/{code}
Return JSON details for a code

GET /api/health
Healthcheck DB connectivity

## Notes
- Custom code: 3-10 chars, allowed: a-z A-Z 0-9 _ -
- Random code: generated if code is omitted