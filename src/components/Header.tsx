'use client'
import { envVariables } from '@/config/envMap';
import Image from 'next/image';
import greenPattern from '@/assets/images/2600-x-600-green-pattern.jpg'
import { useState } from 'react';
// import { getCookies, setCookie, deleteCookie, getCookie, hasCookie } from 'cookies-next';

export default function Header({ title }: { title: string }) {
    const maintaincePlanned: boolean = (Date.parse(new Date().toString()) > (envVariables.MaintainceWillStartAt - (Number(envVariables.MaintainceAlertWindow) * 24 * 60 * 60 * 1000))) &&
        (Date.parse(new Date().toString()) < (envVariables.MaintainceWillFinishAt));

    const [showSystemAlert, setShowSystemAlert] = useState<Boolean>(maintaincePlanned);
    // Toggle Aert wrapper
    const toggleSystemAlert = () => {
        setShowSystemAlert(!showSystemAlert);

    };

    return (
        <>
            {/* {
                maintaincePlanned ?
                    <> */}
            {/** Alert */}
            <div className={`${"dcc-maintenance-wrapper dcc-relative"}${showSystemAlert ? " show" : ""}`}>
                <div className={`${"dcc-maintenance"}`}>
                    <div className='notice dcc-relative'><p suppressHydrationWarning>UPCOMING OUTAGE: We have a planned outage of from {new Date(envVariables.MaintainceWillStartAt).toLocaleString('en-NZ', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true, timeZoneName: 'short' })} to {new Date(envVariables.MaintainceWillFinishAt).toLocaleString('en-NZ', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true, timeZoneName: 'short' })}</p></div>
                    {/* <div className='close dcc-cursor-pointer dcc-z-10' title='Close Alert' onClick={toggleSystemAlert}></div> */}
                </div>
            </div >
            {/* </>
                    : ''
            } */}

            <div className="hero small">
                <Image src={greenPattern} title="DCC default banner pattern" alt="Banner image"
                    className="dcc-h-full dcc-object-cover dcc-w-full" role="banner" />
                <div className="hero-content dcc-p-6 md:dcc-p-12 xl:dcc-p-24">
                    <div className="dcc-ml-0">
                        {/* <div className="dcc-alert dcc-border-alertSuccessBorder dcc-bg-alertSuccessBackground dcc-text-alertSuccess">
                            We have a planned outgae of from {process.env.MaintainceWillStartAt} to {process.env.MaintainceWillFinishAt}
                        </div> */}
                        <h1>{title}</h1>
                    </div>
                </div>
            </div>
        </>

    )
}
