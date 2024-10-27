'use client'
import { AppContextProvider } from "@/context/AppContext";
import { SaasProvider } from '@saas-ui/react';
import localFont from "next/font/local";
import { ToastContainer } from "react-toastify";
import 'react-toastify/ReactToastify.min.css';
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

import AuthServiceProvider from "@/components/AuthServiceProvider";
import {
  ClerkProvider
} from '@clerk/nextjs';
import './globals.css';
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}
    >
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <SaasProvider>
            <AuthServiceProvider>
              <AppContextProvider>
                {children}
              </AppContextProvider>
              <ToastContainer theme="dark" autoClose={15} newestOnTop stacked />
            </AuthServiceProvider>
          </SaasProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
