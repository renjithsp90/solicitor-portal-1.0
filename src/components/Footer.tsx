import Head from 'next/head'
import Link from 'next/link'
export default function Footer() {
    return (
        <>
            <footer id="footer" className="relative dcc-px-6 dcc-py-12 md:dcc-px-12 xl:dcc-px-24">
                <a href="#top" title="Back to top of page." id="scroll-top" aria-label="Back to top"></a>
                <div className="dcc-grid dcc-grid-cols-1 3xl:dcc-grid-cols-6 dcc-gap-6 xl:dcc-gap-12">
                    {/* Contact us */}
                    <div className="dcc-relative 2xl:dcc-col-span-2">
                        <h3>Contact us</h3>
                        <div className="dcc-relative dcc-grid dcc-grid-cols-1 sm:dcc-grid-cols-2 dcc-gap-6 sm:dcc-gap-0">
                            <div className="dcc-relative">
                                <p>PO Box 5045</p>
                                <p>Dunedin 9054</p>
                                <p>New Zealand</p>
                            </div>
                            <div className="dcc-relative">
                                <p className="dcc-whitespace-nowrap"><span className="fixed-space">Phone</span> <a
                                    href="tel:+6434774000" title="Contact Dunedin City Council">+64 3 477 4000</a>
                                </p>
                                <p className="dcc-whitespace-nowrap"><span className="fixed-space">Email</span> <a
                                    href="mailto:dcc@dcc.govt.nz"
                                    title="Email Dunedin City Council.">dcc@dcc.govt.nz</a></p>
                            </div>
                        </div>
                    </div>
                    {/* External Links */}
                    <div className="dcc-relative 2xl:dcc-col-span-3 3xl:dcc-ml-6">
                        <h3>Other DCC websites</h3>
                        <div className="dcc-relative dcc-grid dcc-grid-cols-1 sm:dcc-grid-cols-2 dcc-gap-6 sm:dcc-gap-0">
                            <div className="dcc-relative">

                                <p className="dcc-whitespace-nowrap"><a href="http://www.dcc.jobs/" target="_blank"
                                    rel="external" title="Careers website - Opens in a new window.">Careers</a></p>

                                <p className="dcc-whitespace-nowrap"><a href="http://justswim.nz/" target="_blank"
                                    rel="external" title="Just Swim website - Opens in a new window.">Just Swim</a>
                                </p>

                                <p className="dcc-whitespace-nowrap"><a href="http://www.dunedin.art.museum/"
                                    target="_blank" rel="external"
                                    title="Dunedin Public Art Gallery website - Opens in a new window.">Dunedin
                                    Public Art Gallery</a>
                                </p>

                                <p className="dcc-whitespace-nowrap"><a href="http://www.dunedinbotanicgarden.co.nz/"
                                    target="_blank" rel="external"
                                    title="Dunedin Botanic Garden website - Opens in a new window.">Dunedin Botanic
                                    Garden</a></p>

                            </div>
                            <div className="dcc-relative">

                                <p className="dcc-whitespace-nowrap"><a href="http://www.dunedinchinesegarden.com/"
                                    target="_blank" rel="external"
                                    title="Dunedin Chinese Garden website - Opens in a new window.">Dunedin Chinese
                                    Garden</a></p>

                                <p className="dcc-whitespace-nowrap"><a href="http://www.dunedinlibraries.govt.nz/"
                                    target="_blank" rel="external"
                                    title="Dunedin Public Libraries website - Opens in a new window.">Dunedin Public
                                    Libraries</a></p>

                                <p className="dcc-whitespace-nowrap"><a href="http://www.toituosm.com/" target="_blank"
                                    rel="external"
                                    title="Toitū Otago Settlers Museum website - Opens in a new window.">Toitū Otago
                                    Settlers Museum</a>
                                </p>

                                <p className="dcc-whitespace-nowrap"><a href="http://www.olveston.co.nz/" target="_blank"
                                    rel="external"
                                    title="Olveston Historic Home website - Opens in a new window.">Olveston
                                    Historic Home</a></p>

                            </div>
                        </div>
                    </div>
                    {/* Linlks */}
                    <div className="dcc-relative dcc-flex dcc-items-center dcc-gap-5 3xl:dcc-flex-col">
                        <a href="https://www.dunedinnz.com/" target="_blank" rel="external"
                            title="Dunedin NZ website - Opens in a new window." className="logo dunedin"
                            aria-label="Dunedin NZ"></a>
                        <a href="https://www.cityofliterature.co.nz/" target="_blank" rel="external"
                            title="Dunedin UNESCO City of Literature website - Opens in a new window."
                            className="logo dunedin-unesco" aria-label="Dunedin UNESCO City of Literature"></a>
                        <a href="https://www.govt.nz/" target="_blank" rel="external"
                            title="New Zealand Government website - Opens in a new window." className="logo newzealand-govt"
                            aria-label="newzealand.govt.nz"></a>
                    </div>
                </div>
                {/* footer-columns end */}
                <div className="dcc-relative dcc-pt-8 3xl:dcc-pt-5">
                    <nav
                        className="dcc-flex dcc-flex-wrap dcc-justify-start dcc-items-center dcc-gap-4 md:dcc-gap-6">

                        <Link href="/solicitor/account">My Account</Link>
                        <Link href="/solicitor">Rates Enquiry</Link>
                        <a href="https://www.dunedin.govt.nz/home/contact-us" target="_blank">Contact Us</a>
                        <a href="https://www.dunedin.govt.nz/portal/sp-faq" target="_blank">FAQs</a>
                        <a href="https://www.dunedin.govt.nz" target="_blank" rel="index, follow" title="">DCC Home</a>
                        <Link href="/solicitor/terms-and-conditions">Terms and Conditions</Link>
                    </nav>
                </div>
            </footer>
            <div className="dcc-hidden dcc-bg-gray-200"></div>
        </>
    )
}
