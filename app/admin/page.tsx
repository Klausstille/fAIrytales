"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/app/components/Button";
import MouseMoveContainer from "../components/MouseMoveContainer";
import FullScreenAnimation from "../components/FullScreenAnimation";
import { useProjectData } from "../utils/useProjectData";

export default function SignIn() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const result = await signIn("credentials", {
            redirect: false,
            username,
            password,
            callbackUrl: "/",
        });

        if (result && result.error) {
            console.error(result.error);
            setErrorMessage("Login failed. Please check your credentials.");
        } else if (result?.url) {
            window.location.href = result.url;
        }
    };

    const { projectData, isLoading } = useProjectData();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <aside className="fixed h-screen w-screen overflow-hidden pointer-events-none z-[50]">
                <MouseMoveContainer isSpeeking />
            </aside>

            {/* <section className="w-[screen] h-screen flex justify-center items-center text-white flex-col gap-4"> */}

            <FullScreenAnimation
                isAdminPage
                isFullscreen
                projectData={projectData}
                activeIndex={21}
            />

            <section className="w-screen h-screen flex justify-center backdrop-blur-xl items-center text-white flex-col gap-4 z-[999]">
                <section className="flex flex-col gap-4 p-6 rounded-3xl w-[300px]">
                    <h1 className="text-3xl leading-none text-center">
                        Welcome to the <br></br>Gateway<br></br> of Wonders
                    </h1>
                    <form
                        className="w-[250px] flex justify-center items-center text-white flex-col gap-2"
                        onSubmit={handleSubmit}
                    >
                        <div className="flex flex-col gap-1 justify-center text-center">
                            <input
                                autoComplete="off"
                                className="text-white backdrop-blur-3xl border-[1px] border-white bg-[transparent] rounded-full px-4 py-[2px] w-[200px]"
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="admin"
                            />
                        </div>
                        <div className="flex flex-col gap-1 justify-center text-center">
                            <input
                                className="text-white backdrop-blur-3xl border-[1px] border-white bg-[transparent] rounded-full px-4 py-[2px] w-[200px]"
                                id="password"
                                type="password"
                                placeholder="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <Button className="bg-[#a3a3a3ba] text-[#fff] hover:opacity-80 border-none px-6 py-1">
                            Sign In
                        </Button>
                        {errorMessage && (
                            <div className="text-red-500 text-center">
                                {errorMessage}
                            </div>
                        )}
                    </form>
                </section>

                <small className="absolute bottom-4 text-sm">
                    Powered by Stille Studio 💫
                </small>
            </section>
        </>
    );
}
