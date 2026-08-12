'use client'
import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import { MdDelete, MdModeEdit } from 'react-icons/md'
import AdminModalStaff from '@/components/adminModals/AdminStaffAdd'
import StaffUpdateModal from '@/components/adminUpdateModals/AdminStaffUpdate'



export default function StaffAdmin() {
    const [data, setData] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
    const [initialData, setInitialData] = useState({})
    const [headers, setHeaders] = useState({})
    const [venues, setVenues] = useState([])

    useEffect(() => {
        setHeaders({
            Authorization: `Bearer ${localStorage.getItem("xccess-token-Admin")}`,
        })


    }, [])
    const fetchVenues = async () => {
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/hall/getHall`).
            then((res) => {

                setVenues(res.data.data);
            })
            .catch((err) => {
                console.error(err);
            });
    }
    const fetchData = () => {
        const urlWithParams = `${process.env.NEXT_PUBLIC_API_URL}/audiHelper/get`

        axios
            .get(urlWithParams, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('xccess-token-Admin')}`
                }
            })
            .then((response) => {
                setData(response.data.data)
            })
            .catch((error) => {
                console.error('Error fetching data:', error)
            })
    }

    useEffect(() => {
        fetchData()
        fetchVenues()
    }, [])

    const handleDelete = (id) => {

        const userConfirmed = window.confirm(
            'Are you sure you want to delete this ? This action cannot be undone.',
        )
        if (!userConfirmed) {
            return // Exit if the user cancels
        }

        axios
            .delete(`${process.env.NEXT_PUBLIC_API_URL}/audiHelper/delete/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('xccess-token-Admin')}`
                }
            })
            .then((response) => {
                toast.success('Staff deleted successfully')
                fetchData()
            })
            .catch((error) => {
                toast.error('Error deleting staff')
                console.error(error)
            })
    }

    const handleUpdate = (id) => {
        const staff = data.find((item) => item._id === id)
        setInitialData(staff)
        setIsUpdateModalOpen(true)
    }
    const handleModalSubmit = (formData) => {
        axios
            .post(`${process.env.NEXT_PUBLIC_API_URL}/audiHelper/add`, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('xccess-token-Admin')}`
                },
            })
            .then((response) => {
                toast.success('Staff added successfully')
                fetchData()
                setIsModalOpen(false)
            })
            .catch((error) => {
                toast.error('Error adding staff')
                console.error(error)
            })
    }
    const handleUpdateSubmit = (formData, id) => {
        axios
            .patch(`${process.env.NEXT_PUBLIC_API_URL}/audiHelper/update/${id}`, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('xccess-token-Admin')}`
                }
            })
            .then((response) => {
                toast.success('Staff updated successfully')
                fetchData()
                setIsUpdateModalOpen(false)
            })
            .catch((error) => {
                toast.error('Error updating staff')
                console.error(error)
            })
    }

    return (
        <div className='h-[92vh]'>
            <Toaster />
            <div className='flex justify-between items-center border-b-2 p-4'>
                <h1 className='font-semibold text-2xl'>Staff Page</h1>
                <div className='flex justify-center gap-8 '>
                    <Button
                        onClick={() => setIsModalOpen(true)}
                        className='bg-slate-950 text-white border-3 border rounded-3xl px-4 py-2'
                    >
                        Add staff member
                    </Button>
                </div>
            </div>

            <div className='font-bold text-2xl p-4 justify-center flex items-center'>
                Uploaded Data:
            </div>

            <div className='flex h-full'>
                <div className='w-full'>
                    <div className='gap-2 w-full'>
                        <StaffTable
                            data={data}
                            onDelete={handleDelete}
                            onUpdate={handleUpdate}
                            venues={venues}
                        />
                    </div>
                </div>
            </div>
            
            <AdminModalStaff
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleModalSubmit}
                venues={venues}
            />

            <StaffUpdateModal
                isOpen={isUpdateModalOpen}
                onClose={() => setIsUpdateModalOpen(false)}
                onSubmit={handleUpdateSubmit}
                initialData={initialData}
                venues={venues}
            />
        </div>
    )
}

function StaffTable({ data, onDelete, onUpdate ,venues}) {
    return (
        <div className='font-sans'>
            <div className='border rounded my-2 lg:mx-8'>
                <table className='border-1 border-l border-r border-solid border-black w-full'>
                    <thead>
                        <tr>
                            <th className='text-nowrap p-3 text-center text-xl font-medium bg-[#272e3f] text-[#fff]'>
                                Sr. No.
                            </th>
                            <th className='text-nowrap p-3 text-center text-xl font-medium bg-[#272e3f] max-w-[200px] text-[#fff]'>
                                Staff
                            </th>
                            <th className='text-nowrap p-3 text-center text-xl font-medium bg-[#272e3f] text-[#fff]'>
                                Designation
                            </th>
                            <th className='text-nowrap p-3 text-center text-xl font-medium bg-[#272e3f] text-[#fff]'>
                                Email
                            </th>
                            <th className='text-nowrap p-3 text-center text-xl font-medium bg-[#272e3f] text-[#fff]'>
                                Phone No.
                            </th>
                            <th className='text-nowrap p-3 text-center text-xl font-medium bg-[#272e3f] text-[#fff]'>
                                Venue    </th>
                            <th className='text-nowrap p-3 text-center text-xl font-medium bg-[#272e3f] text-[#fff]'>
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {data &&
                            data.map((item, index) => (
                                <tr key={item._id}>
                                    <td className='p-2 text-center border-b border-r border-1 border-solid border-black'>
                                        {index + 1}
                                    </td>
                                    <td className='p-2 text-left text-blue-800 border-b border-1 border-solid border-black text-lg'>
                                        {item.name}
                                    </td>
                                    <td className='p-2 text-center text-nowrap border-b border-l border-1 border-solid border-black'>
                                        {item.designation}
                                    </td>
                                    <td className='p-2 text-center text-nowrap border-b border-l border-1 border-solid border-black'>
                                        {item.email}
                                    </td>
                                    <td className='p-2 text-center text-nowrap border-b border-l border-1 border-solid border-black'>
                                        {item.phoneNumber}
                                    </td>
                                    <td className='p-2 text-center text-nowrap border-b border-l border-1 border-solid border-black'>
                                        {venues&&venues.find((hall) => (
                                            hall._id==item.venue
                            
                                        ))?.name}
                                    </td>
                                    <td className='text-center p-3 border-b border-l border-1 border-solid border-black'>
                                        <div className='flex justify-center gap-2'>
                                            <button
                                                onClick={() =>
                                                    onDelete(item._id)
                                                }
                                                className='p-2 bg-red-500 text-white rounded'
                                            >
                                                <MdDelete />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    onUpdate(item._id)
                                                }
                                                className='p-2 bg-[#10132b] text-white rounded'
                                            >
                                                <MdModeEdit />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
