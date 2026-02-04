VaultString SME Loan Platform – Frontend

Project Name: vs-sme-frontend  
Purpose: User-facing web application for SME and Payroll loan applications, dashboard management, and admin workflows.

Built with Next.js (App Router), TypeScript, Tailwind CSS, and Axios.

Prerequisites

Before you begin, ensure you have the following installed:
- Node.js v18+ (LTS recommended)
- pnpm (package manager) — install via: npm install -g pnpm
- A running instance of the backend API (vs-sme-backend) on http://localhost:3000 (or update .env.local accordingly)

Local Setup

1. Clone the repository
   git clone https://github.com/vaultstring-web/vs-sme-frontend.git
   cd vs-sme-frontend

2. Install dependencies
   pnpm install

3. Set up environment variables
   Create a .env.local file in the project root:
   cp .env.example .env.local

   Then edit .env.local:
   NEXT_PUBLIC_API_BASE_URL=http://localhost:3000

   Note: Only variables prefixed with NEXT_PUBLIC_ are exposed to the browser.

4. Start the development server
   pnpm dev

   The app will be available at:
   http://localhost:3000

Project Structure

src/
├── app/                 # App Router pages and layouts
│   ├── login/           # Public route
│   ├── register/        # Public route
│   ├── dashboard/       # Protected applicant routes
│   └── admin/           # Admin-only routes
├── components/          # Reusable UI components (buttons, forms, cards)
├── lib/                 # Core utilities (API client, constants)
├── services/            # API service wrappers (e.g., authService, applicationService)
├── utils/               # Helper functions (formatters, validators)
├── contexts/            # React Context providers (e.g., AuthContext)
└── ...

Available Scripts

| Command             | pnpm                     | npm                      | yarn                     |
|---------------------|--------------------------|--------------------------|--------------------------|
| Development server  | pnpm dev                 | npm run dev              | yarn dev                 |
| Build for production| pnpm build               | npm run build            | yarn build               |
| Start production    | pnpm start               | npm run start            | yarn start               |
| Lint code           | pnpm lint                | npm run lint             | yarn lint                |

Note: Never commit .env.local – it’s already in .gitignore.

Routing Structure

- Public routes: /login, /register, /forgot-password
- Applicant dashboard: /dashboard (protected)
- Admin routes: /admin/* (role-based access, protected)

All routing uses Next.js App Router (folder-based).

API Integration

The frontend communicates with the backend via an Axios client configured in:
src/lib/apiClient.ts

It uses the base URL from NEXT_PUBLIC_API_BASE_URL. Interceptors are set up for:
- Request: (future) attaching auth tokens
- Response: global error logging

Team Conventions

- Use App Router (not Pages Router)
- All components go in src/components (organized by feature if needed)
- API calls should be abstracted into services (e.g., src/services/authService.ts)
- Environment variables must be prefixed with NEXT_PUBLIC_ to be usable in the browser
- Branching: Feature branches → PR to develop
- Commit messages: Use conventional commits (feat:, fix:, chore:, etc.)

Troubleshooting

Blank page or 404?
- Ensure backend is running on the URL specified in .env.local
- Check browser console for CORS or network errors

Tailwind classes not working?
- Restart dev server after installing new dependencies
- Ensure @tailwind directives are in src/app/globals.css

TypeScript errors?
- Run pnpm install to sync types
- Verify Node.js version (v18+ required)

Support

Contact the tech lead or open an issue in the repository for setup problems.

Tip: Use Next.js DevTools browser extension for debugging routing and state!

You’re all set! Happy coding!