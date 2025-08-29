'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/browser';
import Link from 'next/link';

export default function LoginPage() {
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) setError(error.message);
    else setSent(true);
  };

  return (
    <div className="min-h-screen grid place-items-center p-4">
      <div className="panel p-6 w-full max-w-md">
        <h1 className="text-xl font-semibold mb-4">Sign in to NPIPNG ERP</h1>

        {sent ? (
          <p>Check <b>{email}</b> for a magic-link.</p>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="you@npi.ac.pg"
              className="w-full border rounded-md h-10 px-3"
            />
            <button className="btn-primary rounded-md h-10 px-4" type="submit">
              Send magic link
            </button>
            {error && <p className="text-red-600 text-sm">{error}</p>}
          </form>
        )}

        <div className="mt-6 text-sm">
          <Link href="/" className="text-[var(--erp-link)] hover:underline">Back home</Link>
        </div>
      </div>
    </div>
  );
}
