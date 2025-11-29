# Eagle3d Products – Frontend

Frontend for a realtime product management dashboard built with Next.js, TypeScript, Redux Toolkit, RTK Query, Shadcn UI, and Firebase Firestore.

The UI updates instantly when Firestore data changes, without manual refresh or polling.

# Tech Stack

- **Next.js (App Router)**
- **TypeScript**
- **Redux Toolkit + RTK Query**
- **Shadcn UI**
- **TanStack React Table**
- **React Hook Form**
- **Firebase Firestore (client SDK for realtime updates)**

# Features

# Authentication
- Login via backend `/auth/login`
- JWT stored in HTTP-only cookie
- Protected routes for Products and Analytics pages

# Product Management
- Realtime product table sourced directly from Firestore (`onSnapshot`)
- CRUD operations through backend
- Handled forms with React Hook Form
- Status selector with Shadcn Select
- Reusable confirmation dialogs

# Analytics
- Charts built with `recharts`
- Metrics:
  - Products by status
  - Products by category
  - Products per month
