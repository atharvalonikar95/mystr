import { Message } from '@/model/Message'
import { acceptMessageSchema } from '@/Schemas/acceptMessageSchema'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { useSession } from 'next-auth/react'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'



const Dashboard = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId))

  }

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
        setValue('acceptMessages', response?.data?.isAcceptingMessages)
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>
      }
    }, [])

  //fetching all messages and displaying on ui
  const fetchMessages = useCallback(async (refresh?: boolean) => {
    setIsLoading(true);
    setIsSwitchLoading(false);
    try {
      const response = await axios.get<ApiResponse>('/api/get-messages')
      setMessages(response.data.messages || [])

      if (refresh) {
        alert('showing latest messages Refreshed')
      }

    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      alert(axiosError.response?.data.message)
    }
    finally {
      setIsLoading(true);
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
      alert(axiosError.response?.data.message)
    }
  }

  if(!session || !session.user){
    return(
      <div>
        please login
      </div>
    )
  }

  return (
    <div>
      Dashboard
    </div>
  )
}

export default Dashboard