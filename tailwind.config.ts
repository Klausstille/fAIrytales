import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        screens: {
            tablet: "768px",
            desktop: "1150px",
            "desktop-s": "1250px",
            "desktop-m": "1400px",
            "desktop-l": "1600px",
            "desktop-xl": "1800px",
        },
        extend: {
            aspectRatio: {
                "16/9": "16 / 9",
                "4/3": "4 / 3",
                "3/4": "3 / 4",
            },
            dropShadow: {
                authButton: "0 0 8px #15151560",
                button: "0 0 8px #00000060",
                form: "5px 5px 5px #17171760",
                about: "0 0 50px #ffffff",
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
        },
    },
    plugins: [],
};
export default config;
