import Head from 'next/head'
import Link from 'next/link'
import Script from 'next/script'
import { AuthenticatedTemplate, UnauthenticatedTemplate, useIsAuthenticated, useMsal, useMsalAuthentication } from '@azure/msal-react'
import { AccountInfo, InteractionType } from '@azure/msal-browser'
import { Suspense, useState } from 'react'
import NavBar from '@/components/Navbar'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Information from '@/components/Information'
import LoadingSkeleton from '@/components/LoadingSkeleton'

export default function Home() {
  useMsalAuthentication(InteractionType.Redirect);

  const [pageRefresh, setPageRefresh] = useState<Boolean>(true);

  function updateStatus(){
    setPageRefresh(!pageRefresh);
  }

  
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <Head>
          <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
          <title>Rating Enquiring - Solicitor Portal | Dunedin City Council</title>
          {/* <!-- Meta tags--> */}

          <meta name="page:breadcrumbs" content="Dunedin City Council" />
          <meta name="robots" content="noindex" />
          <meta httpEquiv="x-ua-compatible" content="ie=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta name="format-detection" content="telephone=yes" />
          <meta name="description" content="This is the Dunedin City Council website homepage" />

          <meta name="page:parent" content="Dunedin City Council" />
          <meta name="keywords" content="Dunedin City Council - Home" />
          <meta name="author" content="Dunedin City Council" />

          {/* <!-- Facebook/Twitter sharing data --> */}
          <meta property="og:title" name="twitter:title" content="Home" />
          <meta property="og:url" name="twitter:url" content="https://www.dunedin.govt.nz/home" />
          <meta property="og:description" name="twitter:description"
            content="This is the Dunedin City Council website homepage" />

          {/* <!-- An image will need created, this is what is shown when shared on social channels (1200 x 630px) --> */}
          <meta property="og:image" name="twitter:image" content="" />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <meta property="og:type" content="website" />

          {/* <!-- Google verification--> */}
          <meta name="google-site-verification" content="" />

          {/* <!-- Nav icon files --> */}
          <link rel="apple-touch-icon"
            href="https://www.dunedin.govt.nz/__data/assets/image/0008/675287/touch-icon-192x192.png" />
          <link rel="shortcut icon" href="https://www.dunedin.govt.nz/__data/assets/file/0008/675341/favicon.ico"
            type="image/x-icon" />
          <link rel="shortcut icon" sizes="16x16"
            href="https://www.dunedin.govt.nz/__data/assets/image/0005/675284/favicon-16x16.png" />
          <link rel="shortcut icon" sizes="32x32"
            href="https://www.dunedin.govt.nz/__data/assets/image/0006/675285/favicon-32x32.png" />
          <link rel="shortcut icon" sizes="32x32"
            href="https://www.dunedin.govt.nz/__data/assets/image/0007/675286/favicon-96x96.png" />
          {/* <script src='../assets/js/generatePDF.js'></script> */}

        </Head>
        <div className="page-wrapper" id="top">
          <NavBar refresh={updateStatus} status={undefined} />
          <main className="main-content" id="main-content">
            <UnauthenticatedTemplate>
              <Header title={"Rates search"} />
            </UnauthenticatedTemplate>
            <div className="dcc-relative">
              <AuthenticatedTemplate>
                <Information refresh={updateStatus} status={pageRefresh} />
              </AuthenticatedTemplate>
              <UnauthenticatedTemplate>
                <LoadingSkeleton position={undefined} />
              </UnauthenticatedTemplate>
            </div>
            <Footer />
          </main>
        </div>
      </Suspense>
    </>
  )
}
