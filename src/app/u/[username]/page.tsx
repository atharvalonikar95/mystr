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
import { suggestionTextSchema } from '@/Schemas/suggestionTextSchema'

const Page = () => {
  const [isSending, setIsSending] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [getting, setGetting] = useState(false)
  const [show, setShow] = useState(false)



  const params = useParams()
  const username =
    typeof params.username === 'string' ? params.username : params.username?.[0]

  //form1 - send message form

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
  //form 2 - handle suggestions form

    const form2 = useForm<z.infer<typeof suggestionTextSchema>>({
    resolver: zodResolver(suggestionTextSchema),
    defaultValues: {
      text: '',
    },
  })

  const handleGetSuggestions = async (data: z.infer<typeof suggestionTextSchema>) => {
    try {
      setGetting(true);
      setShow(true)
      const response = await axios.post(`/api/suggest-messages`, {
        prompt: data.text
      })
      console.log(response.data);
      setSuggestions(response.data.messages)
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
    }
    finally {
      setGetting(false)
    }
  }

  const onItemClick = async (suggestion: string) => {
    form.setValue('content', suggestion)
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
        <Form {...form2}>
          <form
            onSubmit={form2.handleSubmit(handleGetSuggestions)}
            className=" flex flex-row items-center justify-center gap-4 outline- pt-2 pr-2  mb-2">
            <FormField
              control={form2.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputGroup className="h-12 w-[60vw] rounded-none">
                      <InputGroupInput
                        {...field}
                        type="text"
                        placeholder="Enter your text"
                      />
                    </InputGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type='submit' className='w-40 bg-[#4CBF98] h-12'  >get suggestions</Button>
          </form>
        </Form>
      </div>


      {
        show &&
        <Item variant="outline" size="sm" className='w-[70%] mt-10 p-10 outline-l flex flex-col items-center '>
          <p className='capitalize outline- p-2 mb-2 text-lg text-[#4CBF98]'> {getting ? "Getting some suggestion just a moment" : "Thanks for choosing us. these are some suggestions : "}</p>
          {
            suggestions.length > 0 &&
            (
              suggestions.map((suggestion, idx) =>
              (
                <ItemContent key={idx} onClick={() => onItemClick(suggestion)} className='outline-1 outline-gray-200 p-4 text-start min-w-[60%] ' >
                  <ItemTitle >{suggestion}</ItemTitle>
                </ItemContent>
              ))
            )
          }
        </Item>

      }

    </div>


  )
}

export default Page
