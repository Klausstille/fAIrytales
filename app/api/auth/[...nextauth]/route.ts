import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { User } from "next-auth";

const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Loïc",
            credentials: {
                username: {
                    label: "Username",
                    type: "text",
                    placeholder: "admin",
                },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials, req): Promise<User | null> {
                const username = credentials?.username;
                const password = credentials?.password;

                const auth_username = process.env.AUTH_USERNAME;
                const auth_password = process.env.AUTH_PASSWORD;

                if (username === auth_username && password === auth_password) {
                    return {
                        id: "1",
                        name: "Loïc",
                        email: "loïc@sutter.com",
                    };
                }
                return null;
            },
        }),
    ],
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/admin",
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
