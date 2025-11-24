'use client'
import { signIn, signOut, useSession } from "next-auth/react";

export default function Component() {
    const { data: session } = useSession();
    if (session) {
        return (
            <>
                Signed in as {session.user.email} <br />
                <button  onClick={() => signOut()} >Sign Out</button>
            </>
        )
    }
    else {
        return (
            <>
                Not Signed in <br />
                <button className="m-2" onClick={() => signIn()} >Sign In </button>
            </>

        )
    }
}