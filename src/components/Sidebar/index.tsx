'use client'
import { useAppContext } from '@/context/AppContext';
import Link from 'next/link'
import React from 'react'

const Sidebar = () => {
  const { chats, isLoading, setChat, setMessages } = useAppContext();

  const sortedChats = [...chats].sort((a, b) => {
    const dateA = new Date(a.updatedAt || a.createdAt);
    const dateB = new Date(b.updatedAt || b.createdAt);
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <div className='w-1/4 h-full min-h-screen py-10 px-8 shadow-md shadow-white sticky top-0 left-0'>
      <h1 className='font-bold text-3xl'>ChatGPT</h1>
      <div className='my-4'>
        <Link onClick={() => { setChat(null); setMessages([]); }} href="/" className='block py-2 px-4 h-10 text-white hover:bg-gray-700 rounded'>
          Start New Chat
        </Link>
        {(isLoading || sortedChats.length > 0) && <h2 className='text-white/60 text-lg mb-4 font-medium'>Recent Chats</h2>}
        {isLoading ? (
          <div className='animate-pulse'>
            {[...Array(12)].map((_, index) => (
              <div key={index} className='h-10 bg-gray-300 rounded my-2'></div>
            ))}
          </div>
        ) : (
          <>
            {sortedChats.map((chat) => (
              <Link key={chat.id} href={`/chat/${chat.id}`} className='block py-2 px-4 h-10 text-white hover:bg-gray-700 rounded'>
                {chat.title}
              </Link>
            ))}
          </>
        )}
      </div>
    </div>
  )
}

export default Sidebar