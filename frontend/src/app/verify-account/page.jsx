"use client";
import React from "react";
import { ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import axios from 'axios';
import { toast } from "react-hot-toast";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { AuthShell, AuthTopBar, AuthCard } from "@/components/auth/AuthShell";

const VerificationNotice = () => {
    const params = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState('');
    const [success, setSuccess] = useState(false);
    useEffect(() => {
        const token = params.get('account');
        if (token) {
            setToken(token);
        }
        else {
            toast.error('Account not found!');
            setLoading(false);
        }

    }, []);
    useEffect(() => {
        if (token) {
            axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-account`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).
                then((res) => {
                    toast.success('Account verified!');
                    setSuccess(true);
                    setLoading(false);
                })
                .catch((err) => {
                    toast.error('Error in verifying account!');
                    setSuccess(false);
                    setLoading(false);
                }
                );
        }
    }, [token]);

    if (loading) {
        return (
            <AuthShell>
                <div className="size-6 animate-spin rounded-full border-2 border-neutral-300 border-t-amber-600" />
            </AuthShell>
        );
    }

    if (!token) {
        return (
            <AuthShell>
                <AuthTopBar backHref="/login" backLabel="Back to login" />
                <AuthCard>
                    <div className="mx-auto flex w-full max-w-sm flex-col items-center justify-center gap-2 p-8 text-center">
                        <h2 className="text-xl font-semibold text-neutral-900">Account not found</h2>
                        <p className="text-sm text-neutral-500">Account not found. Please try again.</p>
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
                            <ShieldCheck className="size-6 text-amber-600" />
                        </div>
                        <h2 className="text-xl font-semibold text-neutral-900">Account verified</h2>
                        <p className="text-sm text-neutral-500">Your account has been verified. You can now login.</p>
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
                <div className="mx-auto flex w-full max-w-sm flex-col items-center justify-center gap-2 p-8 text-center">
                    <h2 className="text-xl font-semibold text-neutral-900">Error verifying account</h2>
                    <p className="text-sm text-neutral-500">There was an error verifying your account. Please try again.</p>
                </div>
            </AuthCard>
        </AuthShell>
    );
};

const page = () => {
    return (
        <Suspense fallback={<AuthShell><div className="size-6 animate-spin rounded-full border-2 border-neutral-300 border-t-amber-600" /></AuthShell>}>
            <VerificationNotice />
        </Suspense>
    )
}

export default page;
