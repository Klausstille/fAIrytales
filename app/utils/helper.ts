import { useState, useEffect } from "react";

export function useMouse() {
    const [mousePosition, setMousePosition] = useState<{
        x: number | null;
        y: number | null;
    }>({
        x: null,
        y: null,
    });

    useEffect(() => {
        function handle(e: MouseEvent) {
            const currentX = e.clientX;
            const currentY = e.clientY;
            setMousePosition({
                x: currentX,
                y: currentY,
            });
        }
        document.addEventListener("mousemove", handle);
        return () => document.removeEventListener("mousemove", handle);
    }, []);

    return mousePosition;
}

export const generateRandomPanning = () => {
    const maxPanPercentage = 15;
    const xValues = Array.from(
        { length: 10 },
        () =>
            `${
                Math.floor(Math.random() * maxPanPercentage) -
                maxPanPercentage / 2
            }%`
    );
    const yValues = Array.from(
        { length: 10 },
        () =>
            `${
                Math.floor(Math.random() * maxPanPercentage) -
                maxPanPercentage / 2
            }%`
    );
    const scaleValues = Array.from(
        { length: 10 },
        () => Math.random() * 0.2 + 1.1
    );

    return {
        x: xValues,
        y: yValues,
        scale: scaleValues,
        transition: {
            x: {
                repeat: Infinity,
                repeatType: "mirror",
                duration: 20,
                ease: "linear",
            },
            y: {
                repeat: Infinity,
                repeatType: "mirror",
                duration: 20,
                ease: "linear",
            },
            scale: {
                repeat: Infinity,
                repeatType: "mirror",
                duration: 20,
                ease: "linear",
            },
        },
    };
};

export default function GetWindowDimensions() {
    const [dimensions, setDimensions] = useState({
        windowWidth: typeof window !== "undefined" ? window.innerWidth : 0,
        windowHeight: typeof window !== "undefined" ? window.innerHeight : 0,
    });

    useEffect(() => {
        const handleResize = () => {
            setDimensions({
                windowWidth: window.innerWidth,
                windowHeight: window.innerHeight,
            });
        };

        if (typeof window !== "undefined") {
            window.addEventListener("resize", handleResize);
            handleResize();
            return () => {
                window.removeEventListener("resize", handleResize);
            };
        }
    }, []);

    return dimensions;
}

const baseUrl =
    process.env.NODE_ENV === "development"
        ? "http://localhost:3000/"
        : process.env.NEXT_PUBLIC_DOMAIN;

export async function dynamicBlurDataUrl(url: string) {
    const base64str = await fetch(
        `${baseUrl}/_next/image?url=${url}&w=32&q=85`
    ).then(async (res) =>
        Buffer.from(await res.arrayBuffer()).toString("base64")
    );

    const blurSvg = `
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 10'>
      <filter id='b' color-interpolation-filters='sRGB'>
        <feGaussianBlur stdDeviation='0.5' />
      </filter>

      <image preserveAspectRatio='none' filter='url(#b)' x='0' y='0' height='100%' width='100%' 
      href='data:image/avif;base64,${base64str}' />
    </svg>
  `;

    const toBase64 = (str: string) =>
        typeof window === "undefined"
            ? Buffer.from(str).toString("base64")
            : window.btoa(str);

    return `data:image/svg+xml;base64,${toBase64(blurSvg)}`;
}
