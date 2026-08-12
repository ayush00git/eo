import React from 'react'
import { FaGithub, FaLinkedin } from 'react-icons/fa'

const teamMembers = [
    {
        rollno: '23BCS036',
        name: 'Himanshu',
        department: 'Computer Science and Engineering ',
        role: 'Frontend',
        email: 'himanshu10092004@gmail.com',
        linkedin: 'https://www.linkedin.com/in/himanshus2004',
        github: 'https://github.com/himanshu1009',
    },
    {
        rollno: '23BCS063',
        name: 'Mritunjai Gupta',
        department: 'Computer Science and Engineering ',
        role: 'Backend',
        email: 'themritunjai@gmail.com',
        linkedin: 'https://www.linkedin.com/in/mritunjai-gupta-a7490724b',
        github: 'https://github.com/Mritunjaii',
    },
    
]

// const facultyMembers = [
//     {
//         id: 1,
//         name: 'Dr. Arun Kumar Yadav',
//         position: 'Assistant Professor Grade-I',
//         department: 'Computer Science',
//     },
//     {
//         id: 1,
//         name: 'Dr. Mohit Kumar',
//         position: 'Assistant Professor Grade-I',
//         department: 'Computer Science',
//     },
// ]

const getRoleClass = (role) => {
    switch (role) {
        case 'Frontend':
            return 'bg-[#cdffe2] text-[#0d8c3c] border border-[#0d8c3c]'
            case 'Backend':
                return 'bg-[#fdffc3] text-[#a2690d] border border-[#a2690d]'
        case 'Team_Lead':
            return 'bg-[#fff2e4] text-[#d93f00] border border-[#d93f00]'
        default:
            return 'bg-gray-500 text-white'
    }
}

const DeveloperPage = () => {
    return (
        <div className='min-h-screen'>
            <main className='container mx-auto mt-8 p-4'>
                <h1 className='text-3xl font-bold text-center mb-6'>
                    Developer Team
                </h1>

                <div className='mx-50'>
                    {/* Faculty section for mobile on top, for desktop on the right */}
                    {/* <section className='md:col-span-1 md:order-2 order-1'>
                        <h2 className='text-2xl text-center font-semibold mb-4'>
                            Faculty Incharge
                        </h2>
                        <div className='bg-white shadow-md rounded-lg p-4'>
                            {facultyMembers.map((faculty) => (
                                <div
                                    key={faculty.id}
                                    className='mb-4 last:mb-0'
                                >
                                    <p className='font-medium'>
                                        {faculty.name}
                                    </p>
                                    <p className='text-[#01419a]'>
                                        {faculty.position}, {faculty.department}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section> */}

                    {/* Team members section, on mobile below the faculty section, on desktop takes left and main space */}
                    <section className='md:col-span-2 md:order-1 order-2'>
                        
                        <div className='bg-white shadow-md rounded-lg overflow-x-auto'>
                            <table className='w-full'>
                                <thead className='bg-[#272b40] text-white'>
                                    <tr>
                                        <th className='p-2 text-left'>S.no</th>
                                        <th className='p-2 text-left'>
                                            RollNo
                                        </th>
                                        <th className='p-2 text-left'>Name</th>
                                        <th className='p-2 text-left'>
                                            Department
                                        </th>
                                        <th className='p-2 text-left'>Role</th>
                                        <th className='p-2 text-left'>Email</th>
                                        <th className='p-2 text-left'>
                                            LinkedIn
                                        </th>
                                        <th className='p-2 text-left'>
                                            GitHub
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {teamMembers.map((member, index) => (
                                        <tr
                                            key={member.rollno}
                                            className={
                                                index % 2 === 0
                                                    ? 'bg-white'
                                                    : ''
                                            }
                                        >
                                            <td className='p-2'>{index + 1}</td>
                                            <td className='p-2'>
                                                {member.rollno}
                                            </td>
                                            <td className='p-2 font-bold'>
                                                {member.name}
                                            </td>
                                            <td className='p-2'>
                                                {member.department}
                                            </td>
                                            <td className='p-2'>
                                                <span
                                                    className={`px-2 py-1 rounded-full text-sm font-semibold ${getRoleClass(
                                                        member.role,
                                                    )}`}
                                                >
                                                    {member.role}
                                                </span>
                                            </td>
                                            <td className='p-2'>
                                                <a
                                                    href={`mailto:${member.email}`}
                                                    className='text-[#01419a] hover:text-[#1d72e9]'
                                                >
                                                    {member.email}
                                                </a>
                                            </td>
                                            <td className='p-2'>
                                                <a
                                                    href={member.linkedin}
                                                    target='_blank'
                                                    rel='noopener noreferrer'
                                                    className='text-[#01419a] hover:text-[#1d72e9]'
                                                >
                                                    <FaLinkedin className='inline mr-1' />
                                                </a>
                                            </td>
                                            <td className='p-2'>
                                                <a
                                                    href={member.github}
                                                    target='_blank'
                                                    rel='noopener noreferrer'
                                                    className='text-[#01419a] hover:text-[#1d72e9]'
                                                >
                                                    <FaGithub className='inline mr-1' />
                                                </a>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    )
}

export default DeveloperPage
