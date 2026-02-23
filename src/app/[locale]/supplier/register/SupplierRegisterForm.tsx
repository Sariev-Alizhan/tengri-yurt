'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

async function createSupplierRecord(userId: string, companyName: string, description: string) {
  const res = await fetch('/api/supplier/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, companyName, description }),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || 'Registration failed');
  }
}

export function SupplierRegisterForm({
  existingUserId,
  translations,
}: {
  existingUserId: string | null;
  translations: Record<string, string>;
}) {
  const params = useParams();
  const locale = (params?.locale as string) || 'en';
  const [companyName, setCompanyName] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isCompleteProfile = !!existingUserId;

  const goToDashboard = async () => {
    // Небольшая задержка, чтобы дать Supabase время обработать изменения
    await new Promise(resolve => setTimeout(resolve, 500));
    const path = `/${locale}/supplier/dashboard`;
    window.location.href = path;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (isCompleteProfile) {
        await createSupplierRecord(existingUserId!, companyName, description);
        goToDashboard();
        return;
      }
      const supabase = createClient();
      const { data: { user }, error: authError } = await supabase.auth.signUp({ email, password });
      if (authError) throw authError;
      if (!user) throw new Error('No user returned');
      await createSupplierRecord(user.id, companyName, description);
      goToDashboard();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const labelClass = 'block font-inter text-white/60 text-xs uppercase tracking-wider mb-2';
  const inputClass = 'w-full border border-white/40 bg-transparent text-white px-3 py-2 font-inter placeholder:text-white/40';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {isCompleteProfile && (
        <p className="font-inter text-white/70 text-sm mb-4">
          {translations.completeProfile ?? 'Add your company details to access the dashboard.'}
        </p>
      )}
      <div>
        <label className={labelClass}>{translations.companyName}</label>
        <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>{translations.description}</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className={inputClass} />
      </div>
      {!isCompleteProfile && (
        <>
      <div>
        <label className={labelClass}>{translations.email}</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>{translations.password}</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className={inputClass} />
      </div>
        </>
      )}
      {error && <p className="font-inter text-red-400 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        style={{
          width: '100%',
          border: '1px solid rgba(255,255,255,0.6)',
          background: 'transparent',
          color: 'rgba(255,255,255,0.9)',
          padding: '14px 24px',
          fontFamily: 'Inter, sans-serif',
          fontSize: '11px',
          fontWeight: 500,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.6 : 1,
          transition: 'all 0.2s ease',
          appearance: 'none',
          WebkitAppearance: 'none',
        }}
      >
        {loading ? '...' : translations.submit}
      </button>
    </form>
  );
}
