'use client'
import WelcomeBack from '@/components/WelcomeBack';
import { SignedIn, SignedOut, SignInButton, SignUpButton, useClerk } from '@clerk/nextjs';
import type { Chat, Memory, Message } from '@prisma/client';
import axios, { AxiosResponse } from 'axios';
import { useParams } from 'next/navigation';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const initialConext = {
    messages: [],
    setMessages: () => { },
    chat: null,
    setChat: () => { },
    chats: [],
    setChats: () => { },
    isLoading: true,
    setIsLoading: () => { },
    memories: [],
    setMemories: () => { },
    id: ""
};

interface AppContext {
    messages: Message[];
    setMessages: (messages: Message[]) => void;
    memories: Memory[];
    setMemories: (memories: Memory[]) => void;
    chats: Chat[];
    setChats: (chats: Chat[]) => void;
    setChat: (chat: Chat | null) => void;
    chat?: Chat | null;
    isLoading: boolean;
    setIsLoading: (isLoading: boolean) => void;
    id?: string;
}

const AppContext = React.createContext<AppContext>(initialConext);

export const AppContextProvider = ({ children }: { children?: React.ReactNode; }) => {
    const [memories, setMemories] = useState<Memory[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [chats, setChats] = useState<Chat[]>([]);
    const [chat, setChat] = useState<Chat | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const params = useParams();
    const { id } = params;
    const { user, loaded } = useClerk();

    const getChatMessages = useCallback(async () => {
        try {
            if (!chat || !id) return;
            setIsLoading(true);
            const { data: { data: messages } }: AxiosResponse<{ data: Message[], error?: string }> = await axios.get(`/api/chat/${id}/messages`);
            setMessages(messages);
        } catch (error: any) {
            toast.error(`Error getting chat messages: ${error.error || error.message}`)
        } finally {
            setIsLoading(false);
        }
    }, [id, chat])

    useEffect(() => {
        getChatMessages();
    }, [getChatMessages]);

    const getData = useCallback(async () => {
        try {
            if (!user) return;
            setIsLoading(true);
            const { data: { data: chats } }: AxiosResponse<{ data: Chat[], error?: string }> = await axios.get(`/api/chat?userId=${user?.id}`);
            setChats(chats);
            if (!chats.length) return;
        } catch (error: any) {
            toast.error("Failed loading data: ", error.error || error.meessage)
        } finally {
            setIsLoading(false);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    useEffect(() => {
        getData()
    }, [getData]);

    useEffect(() => {
        if (!chat || chat.id !== Number(id)) {
            const chatFind = chats.find(chat => chat.id.toString() === id?.toString());
            if (chatFind) {
                setChat(chatFind || null);
                document.title = chatFind.title
            }
        }
    }, [id, chat, chats]);

    return (
        <AppContext.Provider value={{
            chats,
            messages,
            chat,
            setChat,
            setMessages,
            setChats,
            isLoading,
            setIsLoading,
            memories,
            setMemories,
            id: id?.toString()
        }}>
            {
                !loaded ? (
                    <div>Loading...</div>
                ) :
                    user ? (
                        <SignedIn>
                            {children}
                        </SignedIn>
                    ) : (
                        <SignedOut>
                            {children}
                            <WelcomeBack>
                                    <h2 className='text-white text-2xl mb-1 font-semibold text-center'>Welcome back</h2>
                                    <p className='mb-6 text-center text-lg text-token-text-secondary text-white'>Log in or sign up to get smarter responses, upload files and images, and more.</p>
                                    <SignInButton>
                                        <span className='cursor-pointer mb-2 sm:mb-3 relative text-black w-full bg-white !rounded-full px-4` py-3 min-h-11 h-full items-center justify-center flex border border-white text-sm'>Login</span>
                                    </SignInButton>
                                    <SignUpButton>
                                        <span className='cursor-pointer mb-2 sm:mb-3 relative text-white w-full bg-secondary !rounded-full px-4 py-3 min-h-11 h-full items-center justify-center flex border border-medium text-sm'>Sign Up</span>
                                    </SignUpButton>
                            </WelcomeBack>
                        </SignedOut>
                    )
            }
        </AppContext.Provider>
    )
}

export const useAppContext: () => AppContext = () => useContext(AppContext);