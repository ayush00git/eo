"use client";
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { Mail, Lock, ShieldCheck } from 'lucide-react'
import { AuthShell, AuthTopBar, AuthCard } from '@/components/auth/AuthShell'

const INSTRUCTIONS = [
  "Already registered with your faculty email? Sign in and start booking venues.",
  "Haven't registered yet? Create an account first.",
  "Trouble logging in or registering? Contact the Estate Office.",
];

function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isLoginSubmitting, setIsLoginSubmitting] = useState(false);
  const [formdata, setFormdata] = useState({
    email: '',
    password: '',
  });
  useEffect(() => {
    const token = localStorage.getItem('xccess-token'); // Check if token exists
    if (token) {

      router.push('/dashboard'); // Redirect to dashboard if authenticated
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
  const handleSubmit = async () => {
    setIsLoginSubmitting(true);
    console.log(formdata);

    axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/signin`, formdata).
      then((res) => {
        console.log(res.data);
        localStorage.setItem('xccess-token', res.data.data.token);
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      })
      .catch((err) => {
        console.log(err);
        setIsLoginSubmitting(false)

        if (err?.response?.data?.error?.explanation == "User not verified") {
          toast.error('User not verified!');
        }
        else {

          toast.error('Invalid Credentials!');
        }
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
      <AuthTopBar rightHref="/admin/login" rightLabel="Admin login" />
      <AuthCard>
        <div className="flex w-full flex-col justify-center gap-6 p-8 sm:w-1/2 sm:p-14">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">Login</h1>
            <p className="mt-1 text-sm text-neutral-500">
              Sign in with your faculty email to book a venue.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <label className="flex items-center gap-2 rounded-md border border-neutral-300 px-3 py-2.5 text-sm transition focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/30">
              <Mail className="size-4 shrink-0 text-neutral-400" />
              <input
                type="email"
                placeholder="Email"
                id="email"
                onChange={handleChange}
                className="w-full min-w-0 outline-none placeholder:text-neutral-400"
              />
            </label>
            <label className="flex items-center gap-2 rounded-md border border-neutral-300 px-3 py-2.5 text-sm transition focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/30">
              <Lock className="size-4 shrink-0 text-neutral-400" />
              <input
                type="password"
                placeholder="Password"
                id="password"
                onChange={handleChange}
                className="w-full min-w-0 outline-none placeholder:text-neutral-400"
              />
            </label>
            <button
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

            <div className="flex flex-col items-center gap-1 pt-1 text-center text-sm">
              <a href="/forgotpassword" className="text-amber-700 underline-offset-2 hover:underline">
                Forgot password?
              </a>
              <p className="text-neutral-500">
                Don&apos;t have an account?{' '}
                <a href="/signup" className="text-amber-700 underline-offset-2 hover:underline">
                  Sign up
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="hidden w-1/2 flex-col justify-center gap-5 border-l border-neutral-200 p-14 sm:flex">
          <h2 className="text-sm font-semibold tracking-wide text-neutral-500 uppercase">
            Before you sign in
          </h2>
          <ul className="space-y-4">
            {INSTRUCTIONS.map((text, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-neutral-700">
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-amber-600" />
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>
      </AuthCard>
    </AuthShell>
  )
}

export default Login
