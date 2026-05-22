# 🚀 Vercel Full-Stack Deployment Guide

This guide provides a step-by-step walkthrough for deploying the **AI Question Paper Generator** as a unified full-stack application on **Vercel**, utilizing **MongoDB Atlas** and **Upstash Redis**.

---

## 🏗️ 1. Project Architecture

The application is designed to run in a **Serverless** environment:

-   **Frontend:** Next.js (App Router) deployed to Vercel's global Edge Network.
-   **Backend:** Express.js API integrated into Vercel via **Serverless Functions**.
-   **Database:** MongoDB Atlas (Cloud-managed NoSQL).
-   **Task Management:** Upstash Redis (Serverless Redis) for tracking generation state.
-   **AI Inference:** Groq and Google Gemini (Cloud APIs).

---

## 📂 2. Recommended Structure for Vercel

Vercel expects an `api/` directory for serverless functions if you are not using Next.js internal API routes.

```text
pixel-perfect-clone/
├── api/                # Backend entry point for Vercel
│   └── index.ts        # Exports the Express app
├── server/             # Source code for the backend
│   ├── src/...
│   └── tsconfig.json
├── src/                # Next.js frontend source
├── vercel.json         # Vercel configuration file
└── next.config.mjs
```

---

## 🛠️ 3. Prerequisites

-   [Vercel Account](https://vercel.com/)
-   [MongoDB Atlas Account](https://www.mongodb.com/cloud/atlas)
-   [Upstash Account](https://upstash.com/) (For Serverless Redis)
-   **API Keys:** Groq API Key and Google Gemini API Key.

---

## 🍃 4. MongoDB Atlas Setup

1.  **Create a Cluster:** Log in to Atlas and create a free Shared Cluster.
2.  **Network Access:** Go to "Network Access" -> "Add IP Address" -> **Allow Access From Anywhere (0.0.0.0/0)**. *Vercel functions use dynamic IPs.*
3.  **Database User:** Create a user with `readWrite` permissions.
4.  **Connection String:** Click "Connect" -> "Connect your application" and copy the string (e.g., `mongodb+srv://...`).

---

## 🏎️ 5. Upstash Redis Setup

1.  **Create Database:** Log in to Upstash and create a new Redis database.
2.  **Consistency:** Ensure "Eviction" is disabled (default).
3.  **Connection:** Copy the **Redis URL** (`rediss://...`).
4.  **Note:** For Vercel, use the standard Redis connection string for your `REDIS_URL` environment variable.

---

## ⚠️ 6. BullMQ & Worker Limitations on Vercel

**CRITICAL:** Vercel Serverless Functions are stateless and ephemeral. They **cannot** run persistent background workers like the standard BullMQ `Worker` loop.

### The Workaround
On Vercel, you should avoid the `generation-queue` worker loop. Instead:
1.  **Synchronous Processing:** Modify the `createAssignment` controller to call the `generateQuestionPaper` and `generatePDF` services **directly** within the request handler.
2.  **Function Timeout:** You **must** increase the Serverless Function timeout in `vercel.json` (max 10s on Free, 60s+ on Pro) to allow AI generation to finish.

---

## 📄 7. PDF Generation on Vercel (Puppeteer)

Standard `puppeteer` will not work on Vercel because the function size limit is too small to include Chromium.

1.  **Install Dependencies:**
    ```bash
    npm install @sparticuz/chromium puppeteer-core
    ```
2.  **Implementation Change:** Update `server/src/services/pdfService.ts` to use `@sparticuz/chromium` when `process.env.VERCEL` is present.

---

## ⚙️ 8. `vercel.json` Configuration

Create a `vercel.json` in the root directory to route `/api` calls to your Express backend:

```json
{
  "version": 2,
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/index.js"
    }
  ],
  "functions": {
    "api/index.js": {
      "maxDuration": 60,
      "memory": 1024
    }
  }
}
```

---

## 🌍 9. Environment Variables

Add these variables in the **Vercel Dashboard** (Project Settings -> Environment Variables):

### Backend Variables
| Variable | Description |
| :--- | :--- |
| `MONGODB_URI` | Your Atlas connection string |
| `REDIS_URL` | Upstash Redis connection string |
| `GROQ_API_KEY` | Groq inference key |
| `GEMINI_API_KEY` | Gemini fallback key |
| `CLIENT_URL` | Your production frontend URL |

### Frontend Variables
| Variable | Description |
| :--- | :--- |
| `NEXT_PUBLIC_API_URL` | `https://your-domain.com/api` |
| `NEXT_PUBLIC_SOCKET_URL` | `https://your-domain.com` |

---

## 🚀 10. Deployment Steps

1.  **Push to GitHub:** Push your entire project to a GitHub repository.
2.  **Import to Vercel:** 
    - Select your repository.
    - Set the **Framework Preset** to `Next.js`.
    - Leave the **Root Directory** as the project root.
3.  **Configure API Adapter:** Create `api/index.ts`:
    ```typescript
    import app from '../server/src/app';
    export default app;
    ```
4.  **Deploy:** Click "Deploy". Vercel will build the frontend and create serverless functions for the backend.

---

## ❓ 11. Common Errors & Troubleshooting

-   **504 Gateway Timeout:** The AI took too long to respond. Ensure you are on a **Vercel Pro** plan or optimize your prompt for speed (use Groq).
-   **CORS Error:** Ensure `CLIENT_URL` in environment variables matches your Vercel deployment URL exactly.
-   **Database Connection Failure:** Double-check that your MongoDB Atlas IP whitelist is set to `0.0.0.0/0`.
-   **Socket.io Issues:** Standard WebSockets don't work natively on Vercel Serverless. Use **Pusher** or **Ably** if real-time persistence is critical, or rely on polling.

---

## 🏁 12. Final Production Checklist

- [ ] Frontend loads and is responsive.
- [ ] MongoDB Atlas has the `assignments` and `generatedpapers` collections created.
- [ ] AI generation finishes within the function timeout limit.
- [ ] PDF downloads are visually identical to the preview.
- [ ] Mobile navigation (bottom tab bar) is functional.

**Engineering Note:** *Because Vercel functions freeze after a response is sent, the real-time progress updates via Socket.io may be inconsistent. For a high-scale production app, consider moving the Backend to Railway or AWS ECS while keeping the Frontend on Vercel.*
