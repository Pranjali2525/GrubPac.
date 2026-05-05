# 📡 EduBroadcast — Content Broadcasting System

A full-featured frontend for an educational content broadcasting system built with **Next.js 15**, **Tailwind CSS**, **React Hook Form**, and **Zod**.

---

## 🚀 Quick Start

### Prerequisites
- Node.js **v18+** (check with `node -v`)
- npm **v8+** (check with `npm -v`)

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/content-broadcast.git
cd content-broadcast
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run development server
```bash
npm run dev
```

Open **http://localhost:3000** in your browser.

---

## 📋 All Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server at http://localhost:3000 |
| `npm run build` | Build for production |
| `npm run start` | Start production server (after build) |
| `npm run lint` | Run ESLint |

---

## 🔑 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Teacher | teacher@school.com | teacher123 |
| Principal | principal@school.com | principal123 |

Live page (no login): http://localhost:3000/live/t1

---

## 🏗 Project Structure

```
services/     ← ALL API calls live here (never in components)
components/ui ← Reusable primitives
hooks/        ← useData, usePolling
context/      ← AuthContext
lib/          ← mockData, httpClient
```

See Frontend-notes.txt for full architecture details.
