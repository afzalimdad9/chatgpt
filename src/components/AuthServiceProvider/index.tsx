'use client';
import React, { useMemo } from "react";
import { createAuthService } from '@saas-ui/clerk'
import { AuthProvider } from '@saas-ui/auth'
import { useClerk } from '@clerk/clerk-react'

const AuthServiceProvider = ({ children }: { children: React.ReactNode }) => {
    const clerk = useClerk()

    const authService = useMemo(() => {
        if (clerk.loaded) {
            return createAuthService(clerk)
        }
    }, [clerk.loaded])

    if (!clerk.loaded) {
        return null
    }

    return <AuthProvider {...authService}>{children}</AuthProvider>
}

export default AuthServiceProvider;