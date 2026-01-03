'use client'
import React, { useState } from 'react'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from './ui/button';
import { Edit2Icon, X } from 'lucide-react';
import axios from 'axios';
import { MessageDTO } from '@/types/messageDTO';

type messageProps = {
  message: MessageDTO;
  onMessageDelete: (messageId: any) => void
  onMessageEdit: (messageId: any, newContent: string) => void;

}

const MessageCard = ({ message, onMessageDelete, onMessageEdit }: messageProps) => {

  const [editmessage, setEditMessage] = useState(message.content)

  const handleDeleteConfirm = async () => {
    const response = await axios.delete(`/api/delete-message/${message?._id}`)
    console.log(response);
    onMessageDelete(message?._id);
  }

  const handleEditContent = async () => {
    const response = await axios.put(`/api/edit-messages/${message?._id}`, { content: editmessage })
    console.log(response.data);
    onMessageEdit(message?._id, editmessage);
  }

  return (
    <Card className='w-full h-full flex flex-col'>
      <CardHeader className='outline-'>
        <CardTitle>{message.content}</CardTitle>
        <CardDescription>{message.createdAt.toString()}</CardDescription>
        <CardAction> Action</CardAction>
      </CardHeader>
      {/* <CardContent>      </CardContent> */}
      <div className=' mt-auto flex flex-row items-center justify-around gap- px-'>
        {/* delete button */}
        <AlertDialog  >
          <AlertDialogTrigger asChild >
            <Button className=' w-fit sm:w-[5vw]  ' variant="destructive"><X className=' w-5 h-5' /></Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <AlertDialog  >
          {/* edit */}
          <AlertDialogTrigger asChild >
            <Button className=' w-fit sm:w-[5vw] ' variant="secondary">< Edit2Icon className='w-5 h-5' /></Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                <input
                  className='w-full h-10 p-2 outline-1'
                  type="text"
                  value={editmessage}
                  onChange={(e) => setEditMessage(e.target.value)} />
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => handleEditContent()}>Save</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

    </Card>


  )
}

export default MessageCard;