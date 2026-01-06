'use client'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { memo, useEffect, useState } from 'react';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { EyeClosed, EyeClosedIcon, EyeIcon, EyeOff, MailIcon, User2Icon } from "lucide-react";
import { useRouter } from 'next/navigation';
import { useForm, FormProvider } from 'react-hook-form';
import { Form, FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { signUpSchema } from '@/Schemas/signUpSchema';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { useDebounceCallback } from 'usehooks-ts';
import { signIn } from 'next-auth/react';

const SignUp = () => {
    const router = useRouter(); 
    const [username, setUsername] = useState('') 
    const [usernameMessage, setUsernameMessage] = useState('') 
    const [isCheckingUsername, setIsCheckingUsername] = useState(false) 
    const [isSubmitting, setIsSubmitting] = useState(false); 
    const debounced= useDebounceCallback(setUsername, 500);
    const [showPass,setShowPass]=useState(false);

    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: '',
            email: '',
            password: ''
        }
    });

    const checkUsernameUnique = async () => {
        if (username) {
            setIsCheckingUsername(true)
            setUsernameMessage('')

            try {
                const response = await axios.get(`/api/checkUsernameUnique?username=${username}`)
                console.log(response)
                setUsernameMessage(response.data.message)
            } catch (error) {
                const axiosError = error as AxiosError<ApiResponse>;
                setUsernameMessage(axiosError.response?.data.message ?? 'error while checking')
            }
        }
    }
    useEffect(()=>{
        checkUsernameUnique()
    },[username])

    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        try {
            setIsSubmitting(true);
            const response= await axios.post<ApiResponse>('/api/signUp', data);
            console.log(response)
            router.replace(`/verify/${username}`);
        } catch (error) {
            console.log(error);
            const axiosError = error as AxiosError<ApiResponse>;
            alert(axiosError.response?.data.message ?? "Error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <div className="w-full min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-6xl min-h-[80vh] flex flex-col md:flex-row rounded-md shadow-lg overflow-hidden">

                {/* Left Section */}
                <div className="w-full md:w-[40%] p-6 h-[40vh] md:h-auto bg-[#3AAF9F]
                        text-white flex flex-col justify-center items-center gap-6 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold">Welcome Back</h2>

                    <h4 className="text-base md:text-lg mx-4">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Consequuntur incidunt molestias.
                    </h4>

                    <button
                        onClick={() => router.push('/signin')}
                        className="w-40 h-12 border border-white rounded-md">
                        Sign In
                    </button>
                </div>

                {/* Right Section */}
                <div className="w-full md:w-[60%] p-6 flex flex-col justify-center items-center gap-6">
                    <h2 className="text-3xl md:text-4xl font-bold text-[#3AAF9F]">
                        Create Account
                    </h2>

                    {/* Social buttons */}
                    <div className="w-full flex gap-4 justify-center">
                        <button className="w-12 h-12 text-xl font-bold rounded-full border border-gray-300">f</button>
                        <button onClick={()=>signIn("google")} className="w-12 h-12 text-xl font-bold rounded-full border border-gray-300">G+</button>
                        <button onClick={()=>signIn("linkedin")} className="w-12 h-12 text-xl font-bold rounded-full border border-gray-300">in</button>
                    </div>

                    <p className="text-gray-400">or signup by email & password :</p>

                    {/* FORM */}
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="w-full md:w-[70%] flex flex-col gap-4"
                        >

                            {/* Username */}
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <InputGroup className="h-12 rounded-none">
                                                <InputGroupInput
                                                    {...field}
                                                    placeholder="Enter your user name"
                                                    onChange={(e)=>{field.onChange(e)
                                                        debounced(e.target.value)
                                                    }}
                                                />
                                                <InputGroupAddon>
                                                    <User2Icon />
                                                </InputGroupAddon>
                                            </InputGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Email */}
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <InputGroup className="h-12 rounded-none">
                                                <InputGroupInput
                                                    {...field}
                                                    type="email"
                                                    placeholder="Enter your email"
                                                />
                                                <InputGroupAddon>
                                                    <MailIcon />
                                                </InputGroupAddon>
                                            </InputGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Password */}
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <InputGroup className="h-12 rounded-none">
                                                <InputGroupInput
                                                    {...field}
                                                    type={showPass?`text`:`password`}
                                                    placeholder="Enter your password"
                                                />
                                                <InputGroupAddon onClick={()=>setShowPass(curr=>!curr)} >
                                                    {showPass ? <EyeIcon/> :<EyeOff />}
                                                </InputGroupAddon>
                                            </InputGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-40 bg-[#4CBF98] h-12 text-white rounded-md self-center"
                            >
                                {isSubmitting ? "Signing Up..." : "Sign Up"}
                            </button>

                        </form>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default memo(SignUp);







