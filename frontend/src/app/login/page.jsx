"use client";
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import Link from 'next/link'



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
  if (!loading) {
    return (
      <div className='flex justify-center bg-white py-18 h-screen'>
        <div className=' absolute top-0 right-0 p-2 drop-shadow-2xl  border-2 m-2 rounded-xl'>
          <Link href="/admin/login" className='text-blue-500 '>Admin Login</Link>
        </div>
        <div className=' border-2 border-r-0 drop-shadow-xs px-16 py-20 min-h-1/2 bg-white rounded-l-xl flex flex-col justify-start  w-1/3 space-y-4'>
          <h1 className='text-3xl  font-bold text-center mb-20'>Login</h1>
          <div className='flex flex-col space-y-8'>

            <input type='text' placeholder='Email' id="email" onChange={handleChange} className='w-full p-2 border border-gray-300 rounded-md' />
            <input type='password' placeholder='Password' id="password" onChange={handleChange} className='w-full p-2 border border-gray-300 rounded-md' />
            <button className='w-full p-2 bg-blue-500 text-white rounded-md disabled:bg-gray-500' disabled={isLoginSubmitting} onClick={handleSubmit} >{isLoginSubmitting?<div className='mx-auto  animate-spin rounded-full h-4 w-2 my-1  border-b-2 border-white'></div> :"Login"}</button>
            <div className='text-center flex flex-col space-y-2'>
              <a href='/forgotpassword' className='text-center text-blue-500 underline'>Forgot Password?</a>
              <div className='space-x-2 text-center'>Don't have an account?
                <a href='/signup' className='text-center ml-2 text-blue-500 underline'>SignUp</a>
              </div>
            </div>

          </div>
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