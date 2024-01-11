import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const Logo = () => {
    return (
        <div className='flex items-center gap-1.5'>
            <div className='flex flex-col font-bold text-4xl'>
                <p>GRA</p>
                <p className='mt-[-8px]'>MA</p>
                <div className='flex gap-3 mt-[-8px]'>
                    <p>JE</p>
                    <p className='italic'>{"I>"}</p>
                </div>
            </div>
            <div>
                <Avatar>
                    <AvatarImage src="https://avatars.githubusercontent.com/u/56760866?s=400&u=85f1f7114a7c9f4afc1c63e3d06d35a7e204ce1a&v=4" />
                    <AvatarFallback>BA  </AvatarFallback>
                </Avatar>
            </div>
        </div>
    )
}

export default Logo