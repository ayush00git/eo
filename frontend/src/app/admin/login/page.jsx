"use client";
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import axios from 'axios'
import { useRouter } from 'next/navigation'



function page() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isLoginSubmitting, setIsLoginSubmitting] = useState(false);
  const [formdata, setFormdata] = useState({
    email: '',
    password: ''
  });
  useEffect(() => {
    const token = localStorage.getItem('xccess-token-Admin'); // Check if token exists
    if (token) {

      router.push('/admin/dashboard'); // Redirect to dashboard if authenticated
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
  const handleSubmit = async (e) => {
    setIsLoginSubmitting(true);
    e.preventDefault();
    console.log(formdata);

    axios.post(`${process.env.NEXT_PUBLIC_API_URL}/admin/login`, formdata).
      then((res) => {
        console.log(res.data);
        if (res.data.data.token === undefined) {
          toast.error('Invalid Credentials!');
          setIsLoginSubmitting(false);
          return;
          
        }
        localStorage.setItem('xccess-token-Admin', res.data.data.token);
        setTimeout(() => {
          setIsLoginSubmitting(false);
          router.push('/admin/dashboard');
        }, 2000);
      })
      .catch((err) => {
        setIsLoginSubmitting(false);
        console.error(err);
        toast.error('Invalid Credentials!');
      });
  }
  if (!loading) {
    return (
      <div className="w-1/3 mx-auto mt-25 p-6 bg-white rounded-xl drop-shadow-lg ">
        <h1 className="text-2xl font-semibold text-gray-800">Admin Login</h1>
        <form className="mt-6">
          <div className="mb-5">
            <label className="block mb-2 text-sm font-medium text-gray-600">Email</label>
            <input type="email" id="email" value={formdata.email} onChange={handleChange} className="w-full p-3 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500" />
          </div>
          <div className="mb-5">
            <label className="block mb-2 text-sm font-medium text-gray-600">Password</label>
            <input type="password" id="password" value={formdata.password} onChange={handleChange} className="w-full p-3 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500" />
          </div>
          <button className="w-full p-4 text-white bg-indigo-500 rounded-lg font-semibold disabled:bg-gray-400" disabled={isLoginSubmitting} onClick={handleSubmit}>{isLoginSubmitting?<div className='mx-auto  animate-spin rounded-full h-4 w-2 my-1  border-b-2 border-white'></div>:<div>Login</div>}</button>
        </form>
      </div>
    )
  }
}

export default page