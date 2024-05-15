"use client";
import { SessionProvider } from "next-auth/react";
interface SessionProviderCompProps {
    children: React.ReactNode;
}
export const SessionProviderComp = ({ children }: SessionProviderCompProps) => {
    return (
        <>
            <SessionProvider>{children}</SessionProvider>
        </>
    );
};
