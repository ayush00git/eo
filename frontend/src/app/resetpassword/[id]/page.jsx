'use client'
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Lock } from 'lucide-react';
import { AuthShell, AuthTopBar, AuthCard } from '@/components/auth/AuthShell';

const ResetPassword = () => {
    const [token, setToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [responseMessage, setResponseMessage] = useState('');
    const [loading, setLoading] = useState(true); // Loader state
    const { id } = useParams();
    const Router = useRouter();

    useEffect(() => {
        setToken(id);
        // @ts-ignore
        validateToken(id);
    }, []);

    const validateToken = async (id) => {
        setLoading(true); // Set loading to true
       if(id){
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/check`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${id}`,
                }
            });

            if (!response.ok) {
                throw new Error('Token validation failed');
            }

            const data = await response.json();
            if (data.success) {
                setResponseMessage('Token validated successfully! Please enter your new password.');
            } else {
                setResponseMessage('Invalid token. Please try again.');
            }
        } catch (error) {
            setResponseMessage('Request timed out. Please try again later.');
            console.error('Error:', error);
        } finally {
            setLoading(false); // Set loading to false
        }
       }
    };

    const updatePassword = async (event) => {
        event.preventDefault(); // Prevent form submission
        setLoading(true); // Set loading to true

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/update`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({newpassword: newPassword })
            });

            if (response.ok) {
                setResponseMessage('Password updated successfully!');
                Router.push('/login');

            } else {

                setResponseMessage('Error updating password.');
            }
        } catch (error) {
            setResponseMessage('Request timed out. Please try again later.');
            console.error('Error:', error);
        } finally {
            setLoading(false); // Set loading to false
        }
    };

    return (
        <AuthShell>
            <AuthTopBar backHref="/login" backLabel="Back to login" />
            <AuthCard>
                <div className="mx-auto flex w-full max-w-sm flex-col justify-center gap-6 p-8">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">Reset password</h1>
                        <p className="mt-1 text-sm text-neutral-500">Choose a new password for your account.</p>
                    </div>

                    {responseMessage && (
                        <div
                            className={`rounded-md px-3 py-2 text-center text-sm ${
                                responseMessage.includes('successfully')
                                    ? 'border border-emerald-200 bg-emerald-50 text-emerald-700'
                                    : 'border border-red-200 bg-red-50 text-red-600'
                            }`}
                        >
                            {responseMessage}
                        </div>
                    )}

                    {loading ? (
                        <div className="flex justify-center py-4">
                            <div className="size-6 animate-spin rounded-full border-2 border-neutral-300 border-t-amber-600" />
                        </div>
                    ) : responseMessage.includes('successfully') && !responseMessage.includes('Password updated') ? (
                        <form onSubmit={updatePassword} className="flex flex-col gap-4">
                            <label className="flex items-center gap-2 rounded-md border border-neutral-300 px-3 py-2.5 text-sm transition focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/30">
                                <Lock className="size-4 shrink-0 text-neutral-400" />
                                <input
                                    type="password"
                                    id="newPassword"
                                    placeholder="New password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                    className="w-full min-w-0 outline-none placeholder:text-neutral-400"
                                />
                            </label>
                            <button
                                type="submit"
                                className="flex w-full items-center justify-center rounded-md bg-amber-600 p-2.5 text-sm font-medium text-white transition hover:bg-amber-700"
                            >
                                Update password
                            </button>
                        </form>
                    ) : null}
                </div>
            </AuthCard>
        </AuthShell>
    );
};

export default ResetPassword;
