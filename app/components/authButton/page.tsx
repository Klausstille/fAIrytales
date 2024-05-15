"use client";

import { signOut, signIn, useSession } from "next-auth/react";
import { Button } from "../Button";

export default function AuthButton() {
    const { data: session } = useSession();
    if (session) {
        return (
            <>
                <Button
                    className="bg-[#222] hover:bg-[#333] text-white border-none px-6 py-1 transition-all duration-250"
                    onClick={() => signOut()}
                >
                    Sign out
                </Button>
            </>
        );
    }
    return (
        <>
            <Button
                className="bg-[#222] hover:bg-[#333] text-white border-none px-6 py-1"
                onClick={() => signIn()}
            >
                Sign in
            </Button>
        </>
    );
}
