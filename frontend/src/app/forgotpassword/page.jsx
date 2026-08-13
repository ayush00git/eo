"use client"
import axios from 'axios'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { Mail } from 'lucide-react'
import { AuthShell, AuthTopBar, AuthCard } from '@/components/auth/AuthShell'

function Forgotpassword() {
  const [email, setEmail] = React.useState('')
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    setLoading(true)
    e.preventDefault()
    axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`, { email })
      .then((res) => {
        toast.success('Password reset link sent to your email');
        setEmail('');
        setLoading(false)
      }
      )
      .catch((err) => {
        setLoading(false)
        if (err?.response?.data.error?.explanation) {
          toast.error(err?.response?.data.error?.explanation)
        }
        else {

          toast.error('Error sending password reset link');
        }
      });
  }

  return (
    <AuthShell>
      <AuthTopBar backHref="/login" backLabel="Back to login" />
      <AuthCard>
        <div className="mx-auto flex w-full max-w-sm flex-col justify-center gap-6 p-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">Forgot password</h1>
            <p className="mt-1 text-sm text-neutral-500">
              Enter your account email and we&apos;ll send you a reset link.
            </p>
          </div>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <label className="flex items-center gap-2 rounded-md border border-neutral-300 px-3 py-2.5 text-sm transition focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/30">
              <Mail className="size-4 shrink-0 text-neutral-400" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full min-w-0 outline-none placeholder:text-neutral-400"
              />
            </label>
            <button
              type="submit"
              className="flex w-full items-center justify-center rounded-md bg-amber-600 p-2.5 text-sm font-medium text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:bg-neutral-300"
              disabled={loading}
            >
              {loading ? (
                <div className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              ) : (
                "Send reset link"
              )}
            </button>
          </form>

          <a href="/login" className="text-center text-sm text-amber-700 underline-offset-2 hover:underline">
            Back to login
          </a>
        </div>
      </AuthCard>
    </AuthShell>
  )
}

export default Forgotpassword
