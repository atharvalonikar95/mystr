'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import z from 'zod'
import axios from 'axios'
import { useParams } from 'next/navigation'
import {
  Item,
  ItemContent,
  ItemTitle

} from "@/components/ui/item"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'

import { InputGroup, InputGroupInput } from '@/components/ui/input-group'
import { messageSchema } from '@/Schemas/messageSchema'
import { Button } from '@/components/ui/button'
import { Divide } from 'lucide-react'
import { Input } from '@/components/ui/input'

const Page = () => {
  const [isSending, setIsSending] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [text, setText] = useState('')

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
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message || 'Something went wrong'

        form.setError('content', {
          type: 'server',
          message,
        })
      } else {
        console.error('Error sending message', error)
      }
    } finally {
      setIsSending(false)
    }
  }

  const handleGetSuggestions = async () => {
    const response = await axios.post(`/api/suggest-messages`, {
      prompt: text
    })
    console.log(response.data);
    setSuggestions(response.data.messages)
  }

  const onItemClick = async (suggestion: string) => {
    form.setValue('content', suggestion)
    // const copied = await navigator.clipboard.write(suggestion)
    // setText(copied)
  }

  return (
    <div className='w-full h-screen outline- p-2 flex flex-col items-center '>
      <h1 className='text-4xl font-semibold p-2 text-center text-[#4CBF98] capitalize '>welcome please start sending messages</h1>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full  flex flex-row items-center justify-center gap-4 outline- p-2 mb-2"
        >
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <InputGroup className="h-12 w-[60vw] rounded-none">
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

      <div className='w- flex flex-col items-start justify-center '>
        <p className='text-[#40a483]'>Don't know what to send . give prompt and get suggestions</p>
        <div className=" flex flex-row items-center justify-center gap-4 outline- pt-2 pr-2  mb-2">
          <Input className='h-12 rounded-none w-[60vw] p-2 outline-1' type="text" value={text} onChange={(e) => setText(e.target.value)} />
          <Button className='w-40 bg-[#4CBF98] h-12' onClick={handleGetSuggestions} >get suggestions</Button>
        </div>
      </div>

      <Item variant="outline" size="sm" className='w-[70%] mt-10 p-10 outline-l flex flex-col items-center '>
        <p className='capitalize outline- p-2 mb-2 text-lg text-[#4CBF98]'> Thanks for choosing us. these are some suggestions : </p>
        {
          suggestions.length > 0 &&
          (
            suggestions.map((suggestion, idx) =>
            (
              <ItemContent onClick={() => onItemClick(suggestion)} className='outline-1 outline-gray-200 p-4 text-start min-w-[60%] ' key={idx}>
                <ItemTitle >{suggestion}</ItemTitle>
              </ItemContent>
            ))
          )

        }
      </Item>

    </div>


  )
}

export default Page
