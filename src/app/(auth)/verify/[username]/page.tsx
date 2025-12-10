"use client"

import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"

import { verifySchema } from '@/Schemas/verifySchema';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from "@/components/ui/button";

const VerifyAccount = () => {

  const router = useRouter();
  const params = useParams<{ username: string }>();

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: "",
    },
  });

  const { handleSubmit, setValue, watch, formState: { errors } } = form;
  const otpValue = watch("code");

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      const response = await axios.post(`/api/verify-code`, {
        username: params.username,
        code: data.code
      });
      console.log(response)
      alert(`${response.data.message}`);
      router.replace(`/signin`);
    } catch (error) {
      console.log(error);
      const axiosError = error as AxiosError<ApiResponse>;
      alert(axiosError.response?.data.message ?? "Error occurred");
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-4">
      <div className="w-full shadow-gray-400 max-w-6xl min-h-[80vh] flex flex-col md:flex-row rounded-md shadow-lg overflow-hidden">

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
            Verify Account
          </h2>

          <p className="text-gray-400">Enter OTP sent on registered email :</p>

          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col items-center gap-4"
          >
            {/* Hidden input for RHF */}
            <input type="hidden" {...form.register("code")} />

            <InputOTP
              maxLength={6}
              pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
              value={otpValue}
              onChange={(value) =>
                setValue("code", value, { shouldValidate: true })
              }
            >
              <InputOTPGroup>
                {Array.from({ length: 6 }).map((_, i) => (
                  <InputOTPSlot key={i} index={i} className="h-12" />
                ))}
              </InputOTPGroup>
            </InputOTP>

            {errors.code && (
              <p className="text-sm text-red-500">{errors.code.message}</p>
            )}

            <Button
              type="submit"
              className="w-40 h-12 bg-[#3AAF9F] text-white text-lg"
            >
              Verify OTP
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default VerifyAccount;
