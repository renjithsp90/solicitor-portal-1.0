'use client'
import { AuthenticatedTemplate, UnauthenticatedTemplate, useIsAuthenticated, useMsal, useMsalAuthentication } from '@azure/msal-react'
import { AccountInfo, InteractionType } from '@azure/msal-browser'
import { Suspense } from 'react';
import LoadingSkeleton from '@/components/LoadingSkeleton';
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useMsalAuthentication(InteractionType.Redirect);
  return (
    <>
      <Suspense fallback={<LoadingSkeleton position={undefined} />}></Suspense>
      <html lang="en-nz">
        <body>{children}</body>
      </html>
    </>

  )
}