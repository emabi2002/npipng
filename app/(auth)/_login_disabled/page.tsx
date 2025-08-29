// app/(auth)/login/page.tsx
'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabaseClient';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setMsg(null);

    const value = email.trim();

    // OPTIONAL: very tolerant check (accepts multi-level TLDs like .ac.pg)
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(value);
    if (!ok) {
      setErr('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email: value,
      options: {
        // adjust if you use a specific callback route
        emailRedirectTo:
          typeof window !== 'undefined'
            ? `${window.location.origin}/auth/callback`
            : undefined,
      },
    });
    setLoading(false);

    if (error) {
      setErr(error.message);
    } else {
      setMsg('Magic link sent. Check your inbox.');
    }
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <form onSubmit={onSubmit} className="panel w-full max-w-md p-6 space-y-4">
        <h1 className="text-2xl font-semibold">Sign in to NPIPNG ERP</h1>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@npipng.ac.pg"
          className="w-full h-11 rounded-md border border-gray-300 px-3"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="btn-primary h-11 rounded-md px-4 disabled:opacity-50"
        >
          {loading ? 'Sending…' : 'Send magic link'}
        </button>

        {err && <p className="text-red-600">{err}</p>}
        {msg && <p className="text-green-600">{msg}</p>}

        <a href="/" className="text-sm text-blue-600 hover:underline">
          Back home
        </a>
      </form>
    </div>
  );
}
