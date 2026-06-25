# Deployment Guide

Follow these steps to deploy OxyCare Labs to production.

## 1. Hosting Options
- **Recommended**: Vercel or Netlify (Zero configuration for Vite apps).
- **Alternative**: Host on any VPS (AWS, DigitalOcean) using Nginx to serve the `dist` folder.

## 2. Environment Variables
When deploying, you MUST add these variables in your hosting provider's dashboard (e.g., Vercel Project Settings > Environment Variables):

| Variable | Value |
| :--- | :--- |
| `VITE_GOOGLE_CLIENT_ID` | Your Production Client ID |
| `VITE_PHONEPE_CLIENT_ID` | `SU2511181220319851721641` |
| `VITE_PHONEPE_CLIENT_SECRET` | `0d8da8dd-d2ec-42d0-8be5-161478efba66` |
| `VITE_PHONEPE_CLIENT_VERSION` | `1` |
| `VITE_PHONEPE_ENV` | `PRODUCTION` |

## 3. Build Command
Run this command to generate the production-ready files:
```bash
npm run build
```
The output will be in the `dist/` folder.

## 4. PhonePe Production Note
To make payments live, you need to point `src/services/phonepeService.js` to your backend signature endpoint (see `payment-backend-example.js`). This is to ensure your `Client Secret` is never exposed to the users.

## 5. Security Checklist
- [ ] NO secrets are hardcoded in the codebase.
- [ ] Google Auth Authorized Origins include your production domain.
- [ ] SSL (HTTPS) is enabled on your production domain.
