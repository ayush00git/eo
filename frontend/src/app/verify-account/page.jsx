"use client";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Mail } from "lucide-react";
import { useEffect, useState } from "react";
import axios from 'axios';
import { toast } from "react-hot-toast";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";




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
                    console.log(err);
                    toast.error('Error in verifying account!');
                    setSuccess(false);
                    setLoading(false);
                }
                );
        }
    }, [token]);

    if (loading) {
        return (
            <div className="text-center rounded-lg text-lg font-semibold">Processing...</div>
        )
    }

    if (!token) {
        return (
            <div className="flex justify-center bg-white py-18 h-screen">
                <div className="text-center">
                    <h2 className="text-xl font-semibold mt-4">Account not found</h2>
                    <p className="text-gray-600 mt-2">
                        Account not found. Please try again.
                    </p>
                </div>
            </div>
        );
    }
    if (success) {
        return (

            <Card className="max-w-md mx-auto p-6 mt-42  text-center shadow-lg">
                <CardContent>
                    <Mail className="w-12 h-12 mx-auto text-blue-500" />
                    <h2 className="text-xl font-semibold mt-4">Account Verified</h2>
                    <p className="text-gray-600 mt-2">
                        Your account has been verified. You can now login.
                    </p>
                    <a href="/login" className="block mt-4 text-blue-500 hover:underline">Go back to home</a>
                </CardContent>
            </Card>
        );
    }
    else {
        return (
            <div className="flex justify-center bg-white py-18 h-screen">
                <div className="text-center">
                    <h2 className="text-xl font-semibold mt-4">Error Verifing Account</h2>
                    <p className="text-gray-600 mt-2">
                        There was an error while verification of Your Account. Please try again.
                    </p>

                </div>
            </div>
        );
    }
};
const page = () => {
    return (
        <Suspense fallback={<p>Loading...</p>}>
            return (

            <VerificationNotice />

            )

        </Suspense >
    )
}
    export default page;
