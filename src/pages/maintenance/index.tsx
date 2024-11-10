'use client'
import { envVariables } from '@/config/envMap'
import Head from 'next/head'

export default function Home() {
    //useMsalAuthentication(InteractionType.Redirect);

    return (
        <>

            <Head>
                <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
                <title>Under Maintenance - Solicitor Portal | Dunedin City Council</title>
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
            <div className='dcc-relative dcc-w-screen dcc-h-screen maintenance-page-wrapper'>
                <div className='overlay'></div>
                <div className="dcc-relative dcc-flex dcc-items-center dcc-justify-center dcc-z-10 dcc-h-full dcc-w-full dcc-flex-col dcc-text-white dcc-text-center dcc-p-6 md:dcc-p-12 xl:dcc-p-24">
                    <span title="Dunedin City Council" className="logo-reverse" id="dcc-logo"
                        aria-label=" Dunedin City Council – Kaunihera-a-rohe o Otepoti">
                    </span>
                    <h1>Portal under going maintenance</h1>
                    <div className='dcc-max-w-2xl dcc-mb-5'>
                        <h4 className='dcc-mb-4 dcc-font-normal'>Our web portal is currently under maintenance. We'll be back soon.</h4>
                        <h4 className='dcc-font-normal'>Estimated back online: <strong suppressHydrationWarning>{new Date(envVariables.MaintainceWillFinishAt).toLocaleString('en-NZ', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true, timeZoneName: 'short' })}</strong></h4>
                    </div>

                    <div className="social-icons">
                        <a href="mailto:dcc@dcc.govt.nz?subject=Solicitor Portal" target="_blank" rel="external"
                            title="Dunedin City Council Customer Services Email" className="email"
                            aria-label="Email"></a>
                        <a href="https://www.facebook.com/DunedinCityCouncil" target="_blank" rel="external"
                            title="Dunedin City Council Facebook Page - Opens in a new window." className="facebook"
                            aria-label="Facebook"></a>
                        <a href="https://www.instagram.com/dunedincitycouncil" target="_blank" rel="external"
                            title="Dunedin City Council Instagram Page - Opens in a new window." className="instagram"
                            aria-label="Instagram"></a>
                        <a href="https://twitter.com/DnCityCouncil" target="_blank" rel="external"
                            title="Dunedin City Council Twitter Page - Opens in a new window." className="twitter" aria-label="Twitter"></a>
                        <a href="https://www.youtube.com/user/dunedincitycouncil" target="_blank" rel="external"
                            title="Dunedin City Council Youtube channel- Opens in a new window." className="youtube"
                            aria-label="YouTube"></a>

                    </div>
                </div>

            </div>

        </>
    )
}
