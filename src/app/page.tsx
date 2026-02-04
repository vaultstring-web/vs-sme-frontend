// src/app/page.tsx
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-4">VaultString SME Loan Platform</h1>
      <nav className="space-x-4">
        <Link href="/login" className="text-blue-600 hover:underline">
          Login
        </Link>
        <Link href="/register" className="text-blue-600 hover:underline">
          Register
        </Link>
        <Link href="/dashboard" className="text-blue-600 hover:underline">
          Dashboard (protected)
        </Link>
      </nav>
    </div>
  );
}