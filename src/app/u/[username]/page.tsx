'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import z from 'zod'
import axios from 'axios'
import { useParams } from 'next/navigation'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'

import { InputGroup, InputGroupInput } from '@/components/ui/input-group'
import { messageSchema } from '@/Schemas/messageSchema'

const Page = () => {
  const [isSending, setIsSending] = useState(false)

  const params = useParams()
  const username =
    typeof params.username === 'string' ? params.username : params.username?.[0]

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: '',
    },
  })

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    try {
      setIsSending(true)

      await axios.post('/api/send-message', {
        username,
        content: data.content, // ✅ FIX
      })

      form.reset() // optional UX improvement
    } catch (error) {
      console.error('Error sending message', error)
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div>
      <h1>Public Profile Link</h1>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full md:w-[70%] flex flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <InputGroup className="h-12 rounded-none">
                    <InputGroupInput
                      {...field}
                      type="text"
                      placeholder="Enter your message"
                    />
                  </InputGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <button
            type="submit"
            disabled={isSending}
            className="w-40 bg-[#4CBF98] h-12 text-white rounded-md self-center disabled:opacity-50"
          >
            {isSending ? 'Sending...' : 'Send'}
          </button>
        </form>
      </Form>
    </div>
  )
}

export default Page
