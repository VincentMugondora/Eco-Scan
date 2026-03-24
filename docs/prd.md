## 📄 Product Requirements Document (PRD): Eco-Scan

**Project Vision:** Eco-Scan is a $0-budget, mobile-first sustainability companion designed for the 2026 EcoHack. It empowers users to reduce food waste by scanning items, tracking expiry dates, and generating AI-powered "Zero-Waste" recipes.

### Core Features (MVP)
1.  **Smart Scanner:** Multimodal input (Barcode via Open Food Facts API + Image OCR via Gemini 2.0 Flash) to identify products and extract expiry dates.
2.  **Pantry Dashboard:** A real-time inventory with color-coded "Urgency Badges" (Red: Expired, Yellow: <48hrs, Green: Fresh).
3.  **AI Zero-Waste Chef:** Integration with Gemini to suggest recipes specifically using items nearest to expiration.
4.  **Environmental Impact Tracker:** A dashboard calculating total $\text{CO}_2$ saved using the formula:
    $$C_{saved} = \text{weight (kg)} \times 2.5 \text{ (kg CO}_2e\text{/kg)}$$

### Technical Stack
* **Frontend:** React (Vite), Tailwind CSS, Framer Motion, Lucide-react.
* **Backend:** FastAPI (Python).
* **Database/Auth:** Supabase (PostgreSQL + RLS).
* **AI:** Google AI Studio (Gemini 2.0 Flash).

---

## 🛠️ Antigravity Rule: Clean Code Standards
> **Agent Instruction:** Follow these rules for every file generated or refactored.

* **Component Architecture:** Use functional components with **TypeScript**. Break UI into atomic components (e.g., `Button.tsx`, `PantryCard.tsx`) stored in `/components/ui`.
* **Naming Conventions:** * Variables/Functions: `camelCase`.
    * Components/Interfaces: `PascalCase`.
    * Constants: `SNAKE_UPPERCASE`.
* **Tailwind Best Practices:** Use the `clsx` or `tailwind-merge` utility to handle dynamic classes. Avoid "div soup"—use semantic HTML tags (`<main>`, `<article>`, `<nav>`).
* **State Management:** Use `React Context` for global UI state (like the current user's pantry) and `React Query` (or Supabase hooks) for server-state synchronization to ensure **Optimistic UI** updates.
* **DRY Principle:** Abstract repetitive logic (like date formatting or carbon calculations) into `/hooks` or `/utils`.

---

## 🛡️ Antigravity Rule: Security-First Protocol
> **Agent Instruction:** Hard-stop any mission that violates these security constraints.

* **Environment Variables:** Never hardcode API keys (Supabase, Gemini, etc.). Always use `.env.local` and ensure `.gitignore` is properly configured.
* **Supabase RLS (Row Level Security):** Every database query must respect RLS. Users should only be able to `SELECT`, `INSERT`, or `UPDATE` rows where `auth.uid() == user_id`.
* **Input Sanitization:** All user-generated content (manual food entries, notes) must be sanitized before being rendered to prevent XSS. 
* **API Security:** FastAPI endpoints must validate the Supabase JWT in the header before processing requests.
* **Dependency Auditing:** Before adding a new NPM package, the agent must verify its size and security status. Prefer lightweight, well-maintained libraries.

