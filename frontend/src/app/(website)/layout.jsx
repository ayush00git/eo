"use client";
import BreadcrumNav from '@/components/bredcrum'
import{useState} from 'react'
import Silderbar from '@/components/silderbar'
import React from 'react'
import withAuth  from '@/components/withAuth'

function layout({children}) {
  const [isopen, setIsopen] = useState(true)
  return (

        <div className='flex '>
          
            <Silderbar isopen={isopen} setIsopen={setIsopen} />
          
            <div className='flex flex-col w-full'>
            <BreadcrumNav/> 
            <main className="p-3 mb-5 h-[93vh] overflow-y-auto ">
 
            {children}
            </main>
            </div>
        </div>
  )
}

export default withAuth(layout)