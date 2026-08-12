"use client";
import React, { use } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import axios from 'axios';
import { toast } from "react-hot-toast";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";





const VerificationNotice = () => {
    const params = useSearchParams();
    const[loading,setLoading]=useState(true);
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
    if(loading){
        return(
            <div className="text-center rounded-lg text-lg font-semibold">Processing...</div>
        )
    }

    if (!email) {
        return (
            <div className="flex justify-center bg-white py-18 h-screen">
                <div className="text-center">
                    <h2 className="text-xl font-semibold mt-4">Email not found</h2>
                    <p className="text-gray-600 mt-2">
                        Email not found. Please try again.
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
                    <h2 className="text-xl font-semibold mt-4">Check Your Email</h2>
                    <p className="text-gray-600 mt-2">
                        We've sent a verification link to <span className="font-medium">{email}</span>.
                        Please check your inbox and verify your account.
                    </p>
                    <p className="text-gray-500 text-sm mt-2">
                        Didn't receive the email? Check your spam folder or resend it below.
                    </p>
                    <Button onClick={onResend} disabled={resending} className="mt-4 disabled:bg-gray-400">Resend Email</Button>
                    <a href="/login" className="block mt-4 text-blue-500 hover:underline">Go back to home</a>
                </CardContent>
            </Card>
        );
    }
    else {
        return (
            <div className="flex justify-center bg-white py-18 h-screen">
                <div className="text-center">
                    <h2 className="text-xl font-semibold mt-4">Error sending email</h2>
                    <p className="text-gray-600 mt-2">
                        There was an error sending the verification email. Please try again.
                    </p>
                    <Button onClick={onResend} disabled={resending} className="mt-4 disabled:bg-gray-400">Resend Email</Button>
                </div>
            </div>
        );
    }
}
const page =()=>{
    return(
        <Suspense fallback={<p>Loading...</p>}>
            <VerificationNotice/>
        </Suspense>
    )
}

export default page;
