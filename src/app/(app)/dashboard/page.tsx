'use client'
import MessageCard from '@/components/MessageCard'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
// import { Message } from '@/model/Message'
import { acceptMessageSchema } from '@/Schemas/acceptMessageSchema'
import { ApiResponse } from '@/types/ApiResponse'
import { MessageDTO } from '@/types/messageDTO'
import { zodResolver } from '@hookform/resolvers/zod'
import { Separator } from '@radix-ui/react-separator'
import axios, { AxiosError } from 'axios'
import { Loader2, RefreshCcw } from 'lucide-react'
import { User } from 'next-auth'
import { useSession } from 'next-auth/react'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'



const Dashboard = () => {
  const [messages, setMessages] = useState<MessageDTO[]>([])
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const [profileUrl, setProfileUrl] = useState<string>("");


  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId))

  }
  const handleEditContent = (messageId: string, newContent: string) => {
    setMessages((prevMessages) =>
      prevMessages.map((message) =>
        message._id === messageId
          ? { ...message, content: newContent }
          : message
      )
    );
  };


  const { data: session } = useSession()

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema)
  })

  const { setValue, watch, register } = form;
  const acceptMessages = watch('acceptMessages')

  // for getting user is accepting the messages or not
  const fetchAcceptMessage = useCallback(
    async () => {
      setIsSwitchLoading(true);
      try {
        const response = await axios.get<ApiResponse>('/api/accept-messages');
        setValue('acceptMessages', response.data?.isAcceptingMessages!)
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>
        console.log(axiosError)
      }
    }, [])

  //fetching all messages and displaying on ui
  const fetchMessages = useCallback(async (refresh?: boolean) => {
    setIsLoading(true);
    setIsSwitchLoading(false);
    try {
      const response = await axios.get<ApiResponse>('/api/get-messages')
      console.log(response);
      setMessages(response.data.messages ?? [])
      console.log(messages)

      if (refresh) {
        alert('showing latest messages Refreshed')
      }

    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      console.log(axiosError.response?.data)
    }
    finally {
      setIsLoading(false);
      setIsSwitchLoading(false);
    }
  }, [setIsLoading, setMessages])

  useEffect(() => {

    if (!session || !session.user) return
    fetchAcceptMessage()
    fetchMessages()

  }, [session, setValue, fetchAcceptMessage])

  //handle switch acceptmessage

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>('/api/accept-messages',
        {
          acceptMessages: !acceptMessages
        });
      setValue('acceptMessages', !acceptMessages)
      alert(response.data.message)

    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      console.log(axiosError.response?.data)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    alert(`url copied`);
  }
  useEffect(() => {
    if (!session?.user) return;

    const username =
      session.user.username ||
      session.user.name?.split(" ")[0].toLowerCase();

    const baseUrl = `${window.location.protocol}//${window.location.host}`;
    setProfileUrl(`${baseUrl}/u/${username}`);
  }, [session]);

  if (!session || !session.user) {
    return (
      <div>
        please login
      </div>
    )
  }

  return (
    <div className='w-full h-screen outline-0 outline-black  '>
      <p className=' text-green-500 font-semibold text-2xl text-center pt-2 '>Dashboard</p>
      <div className='w-full flex flex-col outline-  md:flex-row '>
        <div className='md:w-[50%] h-30 flex flex-col justify-center items-center  outline-0 '>
          <div className=' md:w-[80%] w-full px-2 outline- '>
            <h2 className='mb-2 text-green-500 font-bold sm:font-semibold md:text-2xl text-md capitalize '>copy your unique link</h2>
          </div>
          <div className='w-full md:w-[80%] outline- p-2  flex flex-row items-center justify- '>
            <input className=' outline-0 w-full md:w-[70%] p-1 text-center ' type="text" value={profileUrl} disabled />
            <Button className='md:w-fit' onClick={copyToClipboard}>copy url</Button>
          </div>
        </div>
        <div className='md:w-[50%] md:h-30 outline- flex flex-row items-center justify-center gap-5 p-2 '>
          <Switch className=''
            {...register('acceptMessages')}
            checked={acceptMessages}
            onCheckedChange={handleSwitchChange}
            disabled={isSwitchLoading}
          />
          <span>
            Accept Messages : {acceptMessages ? 'On' : 'off'}
          </span>
          {/* <Separator /> */}
          <Button>
            {
              isLoading ? (
                <Loader2 className='h-4 w-4 animate-spin' />
              ) : (
                <RefreshCcw className='h-4 w-4 ' />
              )
            }
          </Button>
        </div>
      </div>
      <div className='<div className="w-full  items-stretch  grid sm:grid-cols-2 md:grid-cols-2  lg:grid-cols-3  p-10 gap-4 ">'>
        {
          messages.length > 0 ? (

            messages.map((message, index) => (
              <MessageCard
                key={index}
                message={message}
                onMessageDelete={handleDeleteMessage}
                onMessageEdit={handleEditContent}
              />
            ))
          ) : (
            <p> No message to display</p>
          )
        }
      </div>

    </div>

  )
}

export default Dashboard