"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { useEffect, useState } from "react";
import axios from 'axios';
import { toast } from "react-hot-toast";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { AuthShell, AuthTopBar, AuthCard } from "@/components/auth/AuthShell";

const VerificationNotice = () => {
    const params = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [resending, setResending] = useState(false);
    const [email, setEmail] = useState('');
    const [success, setSuccess] = useState(false);
    useEffect(() => {
        const email = params.get('email');
        if (email) {
            setEmail(email);
        }
        else {
            toast.error('Email not found!');
            setLoading(false);
        }

    }, []);
    useEffect(() => {
        if (email) {
            axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/send-verification`, { email: email }).
                then((res) => {
                    toast.success('Verification email sent!');
                    setSuccess(true);
                    setLoading(false);
                })
                .catch((err) => {
                    console.log(err);
                    toast.error('Error sending email!');
                    setSuccess(false);
                    setLoading(false);
                }
                );
        }
    }, [email]);
    const onResend = async () => {
        setResending(true);
        axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/send-verification`, { email: email }).
            then((res) => {
                toast.success('Verification email sent!');
                setResending(false);
                setSuccess(true);
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
                toast.error('Error sending email!');
                setResending(false);
                setSuccess(false);
                setLoading(false);
            }
            );
    }

    if (loading) {
        return (
            <AuthShell>
                <div className="size-6 animate-spin rounded-full border-2 border-neutral-300 border-t-amber-600" />
            </AuthShell>
        );
    }

    if (!email) {
        return (
            <AuthShell>
                <AuthTopBar backHref="/signup" backLabel="Back to signup" />
                <AuthCard>
                    <div className="mx-auto flex w-full max-w-sm flex-col items-center justify-center gap-2 p-8 text-center">
                        <h2 className="text-xl font-semibold text-neutral-900">Email not found</h2>
                        <p className="text-sm text-neutral-500">Please sign up again to receive a verification link.</p>
                    </div>
                </AuthCard>
            </AuthShell>
        );
    }

    if (success) {
        return (
            <AuthShell>
                <AuthTopBar backHref="/login" backLabel="Back to login" />
                <AuthCard>
                    <div className="mx-auto flex w-full max-w-sm flex-col items-center justify-center gap-3 p-8 text-center">
                        <div className="flex size-12 items-center justify-center rounded-full bg-amber-50">
                            <Mail className="size-6 text-amber-600" />
                        </div>
                        <h2 className="text-xl font-semibold text-neutral-900">Check your email</h2>
                        <p className="text-sm text-neutral-500">
                            We&apos;ve sent a verification link to <span className="font-medium text-neutral-700">{email}</span>.
                            Please check your inbox and verify your account.
                        </p>
                        <p className="text-xs text-neutral-400">
                            Didn&apos;t receive the email? Check your spam folder or resend it below.
                        </p>
                        <Button onClick={onResend} disabled={resending} className="mt-2 w-full bg-amber-600 hover:bg-amber-700 disabled:bg-neutral-300">
                            {resending ? "Resending…" : "Resend email"}
                        </Button>
                        <a href="/login" className="text-sm text-amber-700 underline-offset-2 hover:underline">Go back to login</a>
                    </div>
                </AuthCard>
            </AuthShell>
        );
    }

    return (
        <AuthShell>
            <AuthTopBar backHref="/login" backLabel="Back to login" />
            <AuthCard>
                <div className="mx-auto flex w-full max-w-sm flex-col items-center justify-center gap-3 p-8 text-center">
                    <h2 className="text-xl font-semibold text-neutral-900">Error sending email</h2>
                    <p className="text-sm text-neutral-500">There was an error sending the verification email. Please try again.</p>
                    <Button onClick={onResend} disabled={resending} className="mt-2 w-full bg-amber-600 hover:bg-amber-700 disabled:bg-neutral-300">
                        {resending ? "Resending…" : "Resend email"}
                    </Button>
                </div>
            </AuthCard>
        </AuthShell>
    );
}
const page = () => {
    return (
        <Suspense fallback={<AuthShell><div className="size-6 animate-spin rounded-full border-2 border-neutral-300 border-t-amber-600" /></AuthShell>}>
            <VerificationNotice />
        </Suspense>
    )
}

export default page;
