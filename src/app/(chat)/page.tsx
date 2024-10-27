'use client'
import MessageBubble from "@/components/MessageBubble";
import { useAppContext } from "@/context/AppContext";
import { chatWithModel, handleChat } from "@/lib/utils";
import { useClerk } from "@clerk/clerk-react";
import { Chat, type Memory, type Message } from '@prisma/client';
import axios, { AxiosResponse } from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export const cache = 'force-cache';

export default function Home() {
  const [input, setInput] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { setChat, chat, messages, setMessages, setChats, memories, setMemories, id } = useAppContext()
  const router = useRouter();
  const { user } = useClerk();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchMemories = async () => {
      try {
        const { data: { data: fetchedMemories } }: AxiosResponse<{ data: Memory[], error?: string }> = await axios.get('/api/memory');
        setMemories(fetchedMemories);
      } catch (error) {
        console.error('Error fetching memories:', error);
      }
    };
    fetchMemories();
  }, [setMemories]);

  const handleAiChat = async (chatId: number, userMessageId: number, aiMessageId: number, userInput: string) => {
    let aiResponse = "";
    const relevantMemories = memories.map(memory => memory.memory).join('\n');
    const contextWithMemories = `Previous context:\n${relevantMemories}\n\nCurrent conversation:\n`;

    const contentArray: string[] = [];

    await handleChat(
      [
        { role: 'system', content: contextWithMemories },
        ...messages.filter(message => message.id !== userMessageId).map(message => ({
          role: message.role,
          content: message.content
        }))
      ],
      userInput,
      async messageContent => {
        contentArray.push(messageContent);
        aiResponse += messageContent.replace('undefined', '');
      }
    );

    let content = '';

    for (const messageContent of contentArray) {
      content += messageContent;
      setMessages(((prevMessages: Message[]) => [
        ...prevMessages.filter(message => message.id !== aiMessageId),
        { ...prevMessages.filter(message => message.id === aiMessageId), isLoading: false, content: content.replace('undefined', '') },
      ]) as unknown as Message[]);
    }

    await axios.put(`/api/chat/${chatId}/messages/${aiMessageId}`, { content: aiResponse.replace('undefined', ''), isLoading: false, userId: user?.id || "", role: "assistant" });

    if (!id) {
      router.push(`/chat/${chatId}`)
    }

    // Logic to create memory
    await createMemory(userInput, aiResponse);
  };

  const createMemory = async (userInput: string, aiResponse: string) => {
    try {
      const memoryPrompt = `You are an advanced AI assistant tasked with creating concise, meaningful memories based on user interactions. Your goal is to distill the essence of each conversation into a brief, informative summary. Focus on key points, intentions, and outcomes. Be precise and avoid any extraneous information. Provide only the memory, without any additional commentary or explanation.

User Input: ${userInput}
AI Response: ${aiResponse}

Memory:`;

      const memoryStream = await chatWithModel([
        { role: "system", content: "You are a highly efficient memory generation system. Your task is to create concise, relevant memories from user interactions." },
        { role: "user", content: memoryPrompt }
      ]);

      let memory = "";
      const reader = memoryStream.getReader();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        memory += value || "";
      }

      const { data: { data: newMemory } }: AxiosResponse<{ data: Memory, error?: string }> = await axios.post('/api/memory', {
        memory: memory.trim(),
        userId: user?.id || "" // Use the correct user ID here
      });
      setMemories(((prevMemories: Memory[]) => [...prevMemories, newMemory]) as unknown as Memory[]);
      console.log('New memory created:', newMemory);
    } catch (error) {
      console.error('Error creating memory:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    let updatedChat = chat;

    if (!chat) {
      const { data: { data: newChat } }: AxiosResponse<{ data: Chat; error?: string }> = await axios.post('/api/chat', {
        message: input,
        userId: user?.id || ""
      });

      setChats(((prevChats: Chat[]) => ([...prevChats, newChat])) as unknown as Chat[]);

      setChat(newChat);

      updatedChat = newChat;

      document.title = newChat.title;
    }

    const { data: { data: newMessage } }: AxiosResponse<{ data: Message, error?: string }> = await axios.post(`/api/chat/${updatedChat?.id}/messages`, {
      role: 'user',
      content: input,
      userId: user?.id || ""
    });

    setMessages(((prevMessages: Message[]) => [...prevMessages, newMessage]) as unknown as Message[]);
    setInput("");
    const { data: { data: aiMessage } }: AxiosResponse<{ data: Message, error?: string }> = await axios.post(`/api/chat/${updatedChat?.id}/messages`, { content: "Jarvis is thinking", isLoading: true, role: 'assistant', userId: user?.id || "" });

    setMessages(((prevMessages: Message[]) => [...prevMessages, aiMessage]) as unknown as Message[]);
    await handleAiChat(updatedChat?.id || 0, newMessage.id, aiMessage.id, input);
  };

  return (
    <main className="flex flex-col h-[90vh] w-full bg-gray-900">
      <div className="flex-grow overflow-y-auto p-4">
        <MessageBubble message={{ chatId: id ? Number(id) : 0, content: "Hello how may I assist you today?", createdAt: messages[0]?.createdAt ? messages?.[0]?.createdAt : new Date(), isFailed: false, isLoading: false, role: "assistant", userId: user?.id || "", id: 0 }} />
        {
          messages.map(message => (
            <MessageBubble message={message} key={message.id} />
          ))
        }
        <div ref={messagesEndRef} />
      </div>
      <div className="bg-gray-800 p-4 border-t border-gray-700">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message here..."
            className="flex-grow p-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300"
          >
            Send
          </button>
        </form>
      </div>
    </main>
  );
}