import dbConnect from "@/lib/dbConnect";
import User from "@/model/User";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import LinkedInProvider from "next-auth/providers/linkedin";
import { JWT } from "next-auth/jwt"
import { User as USER } from "next-auth"


export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: any): Promise<any> {
                await dbConnect();
                try {
                    const user = await User.findOne({
                        $or: [{ email: credentials.identifier },
                        { username: credentials.identifier }
                        ]
                    })
                    if (!user) {
                        throw new Error('No user found with this email')
                    }
                    if (!user.isVerified) {
                        throw new Error('please verify your account first')
                    }
                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password!)
                    if (isPasswordCorrect) {
                        return user
                    }
                    else {
                        throw new Error('error')
                    }

                } catch (error: any) {
                    throw new Error(error)
                }

            }
        }),

        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        }),


        LinkedInProvider({
            clientId: process.env.LINKEDIN_CLIENT_ID!,
            clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
            issuer: "https://www.linkedin.com/oauth",
            wellKnown: "https://www.linkedin.com/oauth/.well-known/openid-configuration",
            authorization: {
                params: {
                    scope: "openid profile email",
                },
            },
            profile(profile) {
                return {
                    id: profile.sub, // 🔥 THIS FIXES THE ERROR
                    name: profile.name,
                    email: profile.email,
                    image: profile.picture,
                };
            },
        })
    ],
    pages: {
        signIn: '/signin',
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async jwt({ token, user }) {

            // if(user._id){
            //     token.sub=user._id
            // }

            if (user) {
                const u = user as any;

                token.sub = u._id.toString(); // REQUIRED by NextAuth
                token._id = u._id.toString();
                token.username = u.username;
                token.isVerified = u.isVerified;
                token.isAcceptingMessage = u.isAcceptingMessages;

            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user._id = token.sub!
                session.user.username = token.username as string
                session.user.isVerified = token.isVerified as boolean
                session.user.isAcceptingMessages = token.isAcceptingMessages as boolean
            }
            return session
        },
        async signIn({ user, account }) {
            if (account?.provider !== "credentials") {
                await dbConnect();

                let existingUser = await User.findOne({ email: user.email });

                if (!existingUser) {
                    existingUser = await User.create({
                        email: user.email,
                        username: user.name?.split(' ')[0].toLowerCase(),
                        provider: account?.provider, // must be set before saving
                        isVerified: true,
                        isAcceptingMessages: true,
                    });
                }
                // user._id = existingUser?._id?.toString(); // 🔥 CRITICAL
                (user as any)._id = existingUser?._id?.toString();
                return true;
            }
            return true;
        },


    }

}