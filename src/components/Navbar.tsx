import Head from 'next/head'
import Image from 'next/image'
import dccLogo from '../assets/images/svg/logo-dunedin-city-council.svg'
import { AuthenticatedTemplate } from '@azure/msal-react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function Navbar(props: pages) {


    const router = useRouter();
    const [openMenu, setOpenMenu] = useState<Boolean>(false);

    const toggleMenuOpen = () => {
        setOpenMenu(!openMenu);
    }

    const forcePageRefresh = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
        if (router.pathname === "/solicitor") {
            e.preventDefault(); // Prevent default action first
            props.refresh(); // Then proceed with your logic
        }
    };

    return (
        <>

            <div id="hamburger-plate">
                <button type="button" id="hamburger" role="button" className="fixed" onClick={toggleMenuOpen} style={{ outline: "none" }}>MENU</button>
            </div>
            <nav className={`${"nav"}${openMenu ? ' open' : ''}`}>
                <a className="skip-link" href="#main-content">Skip to content</a>
                <a href="/solicitor" title="Dunedin City Council" className="logo" id="dcc-logo"
                    aria-label=" Dunedin City Council – Kaunihera-a-rohe o Otepoti">
                </a>

                {/* Main menu open */}
                <ul className="menu">
                    <li><Link href="/solicitor/account">My Account</Link></li>
                    <li><Link href="/solicitor"><span onClick={forcePageRefresh}>Rating Enquiry</span></Link></li>
                    <li><a href="https://dunedin.govt.nz/home/contact-us/?utm_source=solicitors_portal" target="_blank" className='newwindow-site'>Contact Us</a></li>
                    <li><a href="https://www.dunedin.govt.nz/portal/sp-faq" target="_blank" className='newwindow-site'>FAQs</a></li>
                    <li><a href="https://dunedin.govt.nz/?utm_source=solicitors_portal" target="_blank" className='newwindow-site'>DCC Home</a></li>
                </ul>
                {/* Main menu close */}
                <footer>
                    <a className="phone" href="tel:006434774000">03 477 4000</a>
                    <div className="social-icons">
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
                </footer>
            </nav>
            <div className="nav-close-area"></div>
            <div className="nav-close-button" tabIndex={0} aria-label="Closemenu" role="button" onClick={toggleMenuOpen}></div>
        </>
    )
}
