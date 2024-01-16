import React from 'react'
import Sidebar from './Sidebar'
import AboutMe from './content/AboutMe'
import Logo from '../header/Logo'

const Main = () => {
    return (
        <div className='w-full h-full flex gap-12 mt-6'>
            <div className="flex flex-col gap-4">
                <Logo />
                <Sidebar />
            </div>
            <div className="grow">
                <AboutMe />
            </div>
        </div>
    )
}

export default Main