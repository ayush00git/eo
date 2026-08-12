"use client";
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { set } from 'react-hook-form';



function Login() {
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
        console.log(formdata);
        setSubmitting(true)

        axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/signup`, formdata).
            then((res) => {
                console.log(res.data);
                router.push(`/send-verification?email=${formdata.email}`);

            })
            .catch((err) => {
                console.log(err);
                toast.error(err?.response?.data?.error?.explanation);
            });
    }
    if (!loading) {
        return (
            <div className='flex justify-center bg-white py-18 h-screen'>

                <div className=' border-2 border-r-0 drop-shadow-xs px-16 py-15 min-h-1/2 bg-white rounded-l-xl flex flex-col justify-start  w-1/3 space-y-4'>
                    <h1 className='text-3xl  font-bold text-center mb-10'>Create Account</h1>
                    {errorpass && <p className='text-red-500 '>{errorpass}</p>}
                    {errormail && <p className='text-red-500 '>{errormail}</p>}
                    <form onSubmit={handleSubmit} >
                        <div className='flex flex-col space-y-8'>

                            <input required type='text' placeholder='Name' id="name" onChange={handleChange} className='w-full p-2 border border-gray-300 rounded-md' />
                            <input required type='text' placeholder='Email' id="email" onChange={handleChange} className='w-full p-2 border border-gray-300 rounded-md' />
                            <input required type='password' placeholder='Password' id="password" onChange={handleChange} className='w-full p-2 border border-gray-300 rounded-md' />
                            <input required type='password' placeholder='Confirm Password' id="cpassword" onChange={handleChange} className='w-full p-2 border border-gray-300 rounded-md' />
                            <button type="submit" className='w-full p-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300 disabled:text-black' disabled={errorpass || errormail}  >{Submitting ? "Creating Account" : "Create Account"}</button>
                            <div className='text-center flex flex-col space-y-2'>
                                <div className='space-x-2 text-center'>Already have account?
                                    <a href='/login' className='text-center ml-2 text-blue-500 underline'>SignIn</a>
                                </div>
                            </div>

                        </div>
                    </form>
                </div>
                <div className=' border-2 border-l-0 drop-shadow-xs px-16 min-h-1/2 bg-gray-100 rounded-r-xl flex flex-col justify-start pt-20 w-1/3 space-y-4'>
                    <h1 className='text-3xl mb-16 font-bold '>Instructions</h1>
                    <ul className='list-disc space-y-6'>
                        <li className='text-md'>If your Email already registered using your Faculty email ID, you can login and book Venues.</li>
                        <li className='text-md'>If your Email haven't registered yet, <a href='/signup' className='text-blue-400 underline'>Click Here</a> to SignUp  </li>

                        <li className='text-md'>If you are facing any problems in logging in or registering, please contact Estate Office.

                        </li>
                    </ul>

                </div>


            </div>
        )
    }
}


export default Login