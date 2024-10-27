'use client'
import Sidebar from '@/components/Sidebar'
import React from 'react'
import Logo from '@/components/Logo'
import { SignInButton, SignUpButton, useClerk } from '@clerk/clerk-react'
import ProfileDropdown from '@/components/ProfileDropdown'

const ChatLayout = ({ children }: { children?: React.ReactNode }) => {
    const { user } = useClerk();

    return (
        <main className='h-full bg-black/70 flex flex-row w-full min-h-screen'>
            {/* Sidebar */}
            <Sidebar />
            <div className='flex flex-col h-full min-h-screen w-3/4 sticky'>
                <header className='flex justify-between items-center p-4 w-full h-[10vh] bg-gray-800'>
                    <Logo />
                    {
                        !user ? (
                            <div className='flex items-center gap-2'>
                                <SignInButton>
                                    <span className='cursor-pointer px-3 py-1 relative rounded-full border border-white bg-white text-black text-sm h-full min-h-8'>Login</span>
                                </SignInButton>
                                <SignUpButton>
                                    <span className='cursor-pointer px-3 py-1 relative rounded-full border border-medium bg-secondary text-white text-sm h-full min-h-8'>SignUp</span>
                                </SignUpButton>
                            </div>
                        ) : (
                            <ProfileDropdown />
                        )
                    }
                </header>
                {children}
            </div>
        </main>
    )
}

export default ChatLayout