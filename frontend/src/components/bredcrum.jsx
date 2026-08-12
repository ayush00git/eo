"use client";
import React, { useEffect, useState } from "react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";
import axios from "axios";
import { User } from "lucide-react";

function BreadcrumNav() {
    const pathname = usePathname();
    const pathlist = pathname.split("/").filter((path) => path !== "");
    const [user, setUser] = useState(null)
    useEffect(() => {
        fetchuser()
    }, [])
    const fetchuser = () => {
        axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/check`,{}, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("xccess-token")}`,
            },
        }
        )
            .then((res) => {
                setUser(res.data.data)
            })
            .catch((err) => {
                console.log(err)
            })
    }
    let accumulatedPath = "";

    return (
        <div className="bg-white flex justify-between  pl-10 py-2 h-fit w-full">
            <Breadcrumb >
                <BreadcrumbList>
                    <BreadcrumbSeparator />
                    {pathlist.map((path, index) => {
                        if (path === "admin") {
                            return null;
                        }
                        accumulatedPath += `/${path}`;
                        const isLast = index === pathlist.length - 1;
                        return (
                            <React.Fragment key={index}>
                                <BreadcrumbItem>
                                    {!isLast ? (
                                        <BreadcrumbLink href={accumulatedPath}>
                                            <span className="text-gray-600 text-xs font-bold hover:underline">
                                                {path.toUpperCase()}
                                            </span>
                                        </BreadcrumbLink>
                                    ) : (
                                        <BreadcrumbPage>{<span className="text-gray-600 text-xs font-semi-bold ">
                                            {path.toUpperCase()}
                                        </span>}</BreadcrumbPage>
                                    )}
                                </BreadcrumbItem>
                                {!isLast && <BreadcrumbSeparator />}
                            </React.Fragment>
                        );
                    })}
                </BreadcrumbList>
            </Breadcrumb>
            <div className="flex px-10 ">
                <div className="bg-gray-200 mr-2 rounded-full p-4 ">
                <User  className="h-full" />
                </div>
                <div className="flex flex-col ">
                    <p className="text-gray-600 text-md font-bold">Welcome</p>
                    <p className="text-gray-600 text-xs ">{user?.name}</p>
                    <p className="text-gray-600 text-xs font-bold">{user?.email}</p>
                </div>
            </div>

        </div>
    );
}
export default BreadcrumNav;
