'use client'
import { User } from 'next-auth';
import { signOut, useSession } from 'next-auth/react'
import React from 'react'
import { Button } from './ui/button';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';

const Navbar = () => {

    const { data: session } = useSession();
    const user: User = session?.user as User;

    
        const { theme, toggleTheme } = useTheme();

        return (
            <nav className="w-full h-16 border-0 bg-[#4CBF98] border-black px-4 overflow-hidden flex items-center  m- ">
                <div className="h-10 w-full flex items-center justify-between">
                    <a href="#" className="text-lg font-semibold text-white">Mystry Message</a>

                    {session ? (
                        <div className="flex items-center gap-4">
                            <span className="font-medium">
                                Welcome, {user?.name || user?.username || user?.email}
                            </span>
                            <Button className=' bg-[#4CBF98]' onClick={toggleTheme}>
                                {theme === "dark" ? "🌙 Dark" : "☀️ Light"}
                            </Button>
                            <Button className=' bg-[#4CBF98]' onClick={() => signOut()}>Logout</Button>
                        </div>
                    ) : (
                        <Link href="/signin">
                            <Button className='mr-8 bg-[#0b0941]' >Login</Button>
                        </Link>
                    )}
                </div>
            </nav>

        )
    }


    export default Navbar
