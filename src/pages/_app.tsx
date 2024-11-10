import '../assets/css/globals.css'
import '../assets/css/app.css'
import '../assets/css/font-din-2014.css'
import '../assets/css/hint.min.css'
import '../assets/css/print.css'
//import '../assets/css/font-awesome.min.css'
import type { AppProps } from 'next/app'
import { AuthenticationResult, EventMessage, EventType, PublicClientApplication } from '@azure/msal-browser';
import { msalConfig } from '@/config/auth.config';
import { MsalProvider } from '@azure/msal-react';
import { setCookie } from 'cookies-next';


export const msalInstance = new PublicClientApplication(msalConfig);

if (!msalInstance.getActiveAccount() && msalInstance.getAllAccounts().length > 0) {
  msalInstance.setActiveAccount(msalInstance.getAllAccounts()[0]);
}

msalInstance.addEventCallback((event: EventMessage) => {
  if (
    (event.eventType === EventType.LOGIN_SUCCESS ||
      event.eventType === EventType.ACQUIRE_TOKEN_SUCCESS ||
      event.eventType === EventType.SSO_SILENT_SUCCESS) &&
    event.payload
  ) {
    setCookie('token', (event.payload as AuthenticationResult).idToken);
    // @ts-ignore
    msalInstance.setActiveAccount(event.payload.account);
  }
});


export default function App({ Component, pageProps }: AppProps) {
  return <>
    <MsalProvider instance={msalInstance}>
      <Component {...pageProps} />
    </MsalProvider>
  </>
}