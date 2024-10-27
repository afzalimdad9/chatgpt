import { useAppContext } from '@/context/AppContext';
import { useClerk, RedirectToUserProfile } from '@clerk/clerk-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const ProfileDropdown = () => {
  const { setChat, setChats, setMessages, setMemories } = useAppContext()
  const { user, signOut } = useClerk();
  const [isOpen, setIsOpen] = useState(false);
  const [redirectComponent, setRedirectComponent] = useState<React.ReactNode | null>(null);
  const navigate = useRouter();

  const signOutUser = async () => {
    await signOut();
    setMemories([]);
    setChats([]);
    setChat(null);
    setMessages([]);

    navigate.push('/');
  }
  return (
    <div className='relative'>
      <button onClick={() => setIsOpen(!isOpen)} className='px-3 py-1 rounded-full border border-gray-800 bg-gray-800 text-white text-sm h-full min-h-8'>
        {
          user?.imageUrl ? <Image src={user?.imageUrl} className='rounded-full' alt="profile" width={40} height={40} /> : <span className='w-10 h-10 bg-white rounded-full text-black'>{user?.fullName?.charAt(0)}</span>
        }
      </button>
      {
        isOpen && (
          <div className='absolute right-0 mt-2 w-48 bg-gray-800 shadow-lg rounded-md py-2'>
            <a href='#' onClick={() => setRedirectComponent(RedirectToUserProfile as unknown as React.ReactNode)} className='block px-4 py-2 text-sm text-gray-400 hover:bg-gray-700'>Manage Account</a>
            <a href='#' onClick={signOutUser} className='block px-4 py-2 text-sm text-gray-400 hover:bg-gray-700'>Logout</a>
          </div>
        )
      }

      {redirectComponent}
    </div>
  );
};

export default ProfileDropdown;
