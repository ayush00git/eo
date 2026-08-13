'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2, Users } from 'lucide-react'
import AdminModalStaff from '@/components/adminModals/AdminStaffAdd'
import StaffUpdateModal from '@/components/adminUpdateModals/AdminStaffUpdate'



export default function StaffAdmin() {
    const [data, setData] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
    const [initialData, setInitialData] = useState({})
    const [venues, setVenues] = useState([])

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
        <div>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Audi Staff</h1>
                    <p className="mt-1 text-sm text-neutral-500">Staff assigned to look after each venue.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-700"
                >
                    <Plus className="size-4" />
                    Add staff member
                </button>
            </div>

            <StaffTable
                data={data}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
                venues={venues}
            />

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

function StaffTable({ data, onDelete, onUpdate, venues }) {
    if (!data || data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-neutral-200 py-14 text-center">
                <Users className="size-6 text-neutral-300" />
                <p className="text-sm font-medium text-neutral-600">No staff added yet.</p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="border-b border-neutral-200 bg-neutral-50 text-xs font-semibold tracking-wide text-neutral-500 uppercase">
                            <th className="px-4 py-3">Staff</th>
                            <th className="px-4 py-3">Designation</th>
                            <th className="px-4 py-3">Email</th>
                            <th className="px-4 py-3">Phone</th>
                            <th className="px-4 py-3">Venue</th>
                            <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                        {data.map((item) => (
                            <tr key={item._id} className="transition hover:bg-neutral-50">
                                <td className="px-4 py-3 font-medium text-neutral-900">{item.name}</td>
                                <td className="px-4 py-3 text-neutral-600">{item.designation}</td>
                                <td className="px-4 py-3 text-neutral-600">{item.email}</td>
                                <td className="px-4 py-3 text-neutral-600">{item.phoneNumber}</td>
                                <td className="px-4 py-3 text-neutral-600">
                                    {venues?.find((hall) => hall._id === item.venue)?.name || '—'}
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => onUpdate(item._id)}
                                            className="rounded-md p-1.5 text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900"
                                            aria-label="Edit staff"
                                        >
                                            <Pencil className="size-4" />
                                        </button>
                                        <button
                                            onClick={() => onDelete(item._id)}
                                            className="rounded-md p-1.5 text-neutral-500 transition hover:bg-red-50 hover:text-red-600"
                                            aria-label="Delete staff"
                                        >
                                            <Trash2 className="size-4" />
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
