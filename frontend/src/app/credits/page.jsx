import React from 'react'
import { Github, Linkedin, Mail } from 'lucide-react'

const maintainer = {
    name: 'Ayush',
    github: 'ayush00git',
    githubUrl: 'https://github.com/ayush00git',
    role: 'Currently maintaining the project',
}

const teamMembers = [
    {
        rollno: '23BCS036',
        name: 'Himanshu',
        department: 'Computer Science and Engineering',
        role: 'Frontend',
        email: 'himanshu10092004@gmail.com',
        linkedin: 'https://www.linkedin.com/in/himanshus2004',
        github: 'https://github.com/himanshu1009',
    },
    {
        rollno: '23BCS063',
        name: 'Mritunjai Gupta',
        department: 'Computer Science and Engineering',
        role: 'Backend',
        email: 'themritunjai@gmail.com',
        linkedin: 'https://www.linkedin.com/in/mritunjai-gupta-a7490724b',
        github: 'https://github.com/Mritunjaii',
    },
]

const ROLE_BADGE = {
    Frontend: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200',
    Backend: 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200',
    Team_Lead: 'bg-orange-50 text-orange-700 ring-1 ring-inset ring-orange-200',
}

const DeveloperPage = () => {
    return (
        <div className="mx-auto max-w-4xl">
            <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Credits</h1>
                <p className="mt-1 text-sm text-neutral-500">People behind this project.</p>
            </div>

            <section className="mb-8">
                <h2 className="mb-3 text-xs font-semibold tracking-wide text-neutral-500 uppercase">
                    Maintainer
                </h2>
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-neutral-200 bg-white p-5">
                    <div>
                        <p className="text-base font-semibold text-neutral-900">{maintainer.name}</p>
                        <p className="text-sm text-neutral-500">{maintainer.role}</p>
                    </div>
                    <a
                        href={maintainer.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-sm font-medium text-neutral-700 shadow-sm transition hover:border-amber-300 hover:text-amber-700"
                    >
                        <Github className="size-4" />
                        {maintainer.github}
                    </a>
                </div>
            </section>

            <section>
                <h2 className="mb-3 text-xs font-semibold tracking-wide text-neutral-500 uppercase">
                    Developer Team
                </h2>
                <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-neutral-200 bg-neutral-50 text-xs font-semibold tracking-wide text-neutral-500 uppercase">
                                    <th className="px-4 py-3">Name</th>
                                    <th className="px-4 py-3">Department</th>
                                    <th className="px-4 py-3">Role</th>
                                    <th className="px-4 py-3">Contact</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100">
                                {teamMembers.map((member) => (
                                    <tr key={member.rollno} className="transition hover:bg-neutral-50">
                                        <td className="px-4 py-3">
                                            <p className="font-medium text-neutral-900">{member.name}</p>
                                            <p className="text-xs text-neutral-400">{member.rollno}</p>
                                        </td>
                                        <td className="px-4 py-3 text-neutral-600">{member.department}</td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                                                    ROLE_BADGE[member.role] ||
                                                    'bg-neutral-100 text-neutral-500 ring-1 ring-inset ring-neutral-200'
                                                }`}
                                            >
                                                {member.role}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3 text-neutral-400">
                                                <a
                                                    href={`mailto:${member.email}`}
                                                    className="transition hover:text-amber-700"
                                                    aria-label={`Email ${member.name}`}
                                                >
                                                    <Mail className="size-4" />
                                                </a>
                                                <a
                                                    href={member.linkedin}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="transition hover:text-amber-700"
                                                    aria-label={`${member.name} on LinkedIn`}
                                                >
                                                    <Linkedin className="size-4" />
                                                </a>
                                                <a
                                                    href={member.github}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="transition hover:text-amber-700"
                                                    aria-label={`${member.name} on GitHub`}
                                                >
                                                    <Github className="size-4" />
                                                </a>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default DeveloperPage
