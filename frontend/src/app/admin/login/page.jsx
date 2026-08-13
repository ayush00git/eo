"use client";
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { Mail, Lock } from 'lucide-react'
import { AuthShell, AuthTopBar, AuthCard } from '@/components/auth/AuthShell'

function AdminLogin() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isLoginSubmitting, setIsLoginSubmitting] = useState(false);
  const [formdata, setFormdata] = useState({
    email: '',
    password: ''
  });
  useEffect(() => {
    const token = localStorage.getItem('xccess-token-Admin'); // Check if token exists
    if (token) {

      router.push('/admin/dashboard'); // Redirect to dashboard if authenticated
    }
    else {
      setLoading(false);
    }
  }, []);

  const handleChange = (e) => {
    setFormdata({
      ...formdata,
      [e.target.id]: e.target.value
    })

  }
  const handleSubmit = async (e) => {
    setIsLoginSubmitting(true);
    e.preventDefault();
    console.log(formdata);

    axios.post(`${process.env.NEXT_PUBLIC_API_URL}/admin/login`, formdata).
      then((res) => {
        console.log(res.data);
        if (res.data.data.token === undefined) {
          toast.error('Invalid Credentials!');
          setIsLoginSubmitting(false);
          return;

        }
        localStorage.setItem('xccess-token-Admin', res.data.data.token);
        setTimeout(() => {
          setIsLoginSubmitting(false);
          router.push('/admin/dashboard');
        }, 2000);
      })
      .catch((err) => {
        setIsLoginSubmitting(false);
        console.error(err);
        toast.error('Invalid Credentials!');
      });
  }

  if (loading) {
    return (
      <AuthShell>
        <div className="size-6 animate-spin rounded-full border-2 border-neutral-300 border-t-amber-600" />
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <AuthTopBar rightHref="/login" rightLabel="User login" />
      <AuthCard>
        <div className="mx-auto flex w-full max-w-sm flex-col justify-center gap-6 p-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">Admin login</h1>
            <p className="mt-1 text-sm text-neutral-500">
              Sign in with your Estate Office admin credentials.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <label className="flex items-center gap-2 rounded-md border border-neutral-300 px-3 py-2.5 text-sm transition focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/30">
              <Mail className="size-4 shrink-0 text-neutral-400" />
              <input
                type="email"
                id="email"
                placeholder="Email"
                value={formdata.email}
                onChange={handleChange}
                className="w-full min-w-0 outline-none placeholder:text-neutral-400"
              />
            </label>
            <label className="flex items-center gap-2 rounded-md border border-neutral-300 px-3 py-2.5 text-sm transition focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/30">
              <Lock className="size-4 shrink-0 text-neutral-400" />
              <input
                type="password"
                id="password"
                placeholder="Password"
                value={formdata.password}
                onChange={handleChange}
                className="w-full min-w-0 outline-none placeholder:text-neutral-400"
              />
            </label>
            <button
              type="submit"
              className="flex w-full items-center justify-center rounded-md bg-amber-600 p-2.5 text-sm font-medium text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:bg-neutral-300"
              disabled={isLoginSubmitting}
              onClick={handleSubmit}
            >
              {isLoginSubmitting ? (
                <div className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              ) : (
                "Login"
              )}
            </button>
          </form>
        </div>
      </AuthCard>
    </AuthShell>
  )
}

export default AdminLogin
