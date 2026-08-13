"use client";
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { User, Mail, Lock, ShieldCheck } from 'lucide-react'
import { AuthShell, AuthTopBar, AuthCard } from '@/components/auth/AuthShell'

const INSTRUCTIONS = [
  "Register with your NIT Hamirpur faculty email — student email IDs can't be used to book venues.",
  "You'll get a verification link over email before you can sign in.",
  "Already registered? Sign in instead.",
];

function Signup() {
    const router = useRouter();
    const [Submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [errorpass, setErrorpass] = useState('');
    const [errormail, setErrormail] = useState('');
    const [formdata, setFormdata] = useState({
        email: '',
        name: '',
        password: '',
        cpassword: ''
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
        const { id, value } = e.target;

        // Regular expression for student email pattern
        const studentEmailRegex = /^[0-9]{2}[a-z]{3}[0-9]{3}@nith\.ac\.in$/;

        if (id === 'password') {
            if (value.length < 8) {
                setErrorpass("Password should be at least 8 characters long");
            } else if (formdata.cpassword && value !== formdata.cpassword) {
                setErrorpass("Passwords do not match");
            } else {
                setErrorpass('');
            }
        }

        if (id === 'cpassword') {
            if (value !== formdata.password) {
                setErrorpass("Passwords do not match");
            } else {
                setErrorpass('');
            }
        }

        if (id === 'email') {
            if (!value.endsWith("@nith.ac.in")) {
                setErrormail("Email should be of NITH domain");
            }
             else if (studentEmailRegex.test(value)) {
                setErrormail("Only register with a Faculty Email ID");
            }
            else {
                setErrormail('');
            }
        }

        setFormdata({
            ...formdata,
            [id]: value
        });
    };




    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true)

        axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/signup`, formdata).
            then((res) => {
                router.push(`/send-verification?email=${formdata.email}`);

            })
            .catch((err) => {
                setSubmitting(false);
                toast.error(err?.response?.data?.error?.explanation);
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
                        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">Create account</h1>
                        <p className="mt-1 text-sm text-neutral-500">
                            Register with your faculty email to start booking venues.
                        </p>
                    </div>

                    {(errorpass || errormail) && (
                        <div className="space-y-1 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                            {errorpass && <p>{errorpass}</p>}
                            {errormail && <p>{errormail}</p>}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <label className="flex items-center gap-2 rounded-md border border-neutral-300 px-3 py-2.5 text-sm transition focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/30">
                            <User className="size-4 shrink-0 text-neutral-400" />
                            <input required type="text" placeholder="Name" id="name" onChange={handleChange} className="w-full min-w-0 outline-none placeholder:text-neutral-400" />
                        </label>
                        <label className="flex items-center gap-2 rounded-md border border-neutral-300 px-3 py-2.5 text-sm transition focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/30">
                            <Mail className="size-4 shrink-0 text-neutral-400" />
                            <input required type="text" placeholder="Email" id="email" onChange={handleChange} className="w-full min-w-0 outline-none placeholder:text-neutral-400" />
                        </label>
                        <label className="flex items-center gap-2 rounded-md border border-neutral-300 px-3 py-2.5 text-sm transition focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/30">
                            <Lock className="size-4 shrink-0 text-neutral-400" />
                            <input required type="password" placeholder="Password" id="password" onChange={handleChange} className="w-full min-w-0 outline-none placeholder:text-neutral-400" />
                        </label>
                        <label className="flex items-center gap-2 rounded-md border border-neutral-300 px-3 py-2.5 text-sm transition focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/30">
                            <Lock className="size-4 shrink-0 text-neutral-400" />
                            <input required type="password" placeholder="Confirm password" id="cpassword" onChange={handleChange} className="w-full min-w-0 outline-none placeholder:text-neutral-400" />
                        </label>
                        <button
                            type="submit"
                            className="flex w-full items-center justify-center rounded-md bg-amber-600 p-2.5 text-sm font-medium text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:bg-neutral-300"
                            disabled={!!errorpass || !!errormail}
                        >
                            {Submitting ? "Creating account…" : "Create account"}
                        </button>
                        <p className="text-center text-sm text-neutral-500">
                            Already have an account?{' '}
                            <a href="/login" className="text-amber-700 underline-offset-2 hover:underline">Sign in</a>
                        </p>
                    </form>
                </div>

                <div className="hidden w-1/2 flex-col justify-center gap-5 border-l border-neutral-200 p-14 sm:flex">
                    <h2 className="text-sm font-semibold tracking-wide text-neutral-500 uppercase">
                        Before you register
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

export default Signup
