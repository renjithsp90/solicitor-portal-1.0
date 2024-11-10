/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
'use client';
import { useMsal } from '@azure/msal-react';
import LoadingSkeleton from './LoadingSkeleton';
import { deleteCookie } from 'cookies-next';
import Link from 'next/link';


export default function Account() {
    const { instance, accounts } = useMsal();
    const activeAccount = accounts[0]?.idTokenClaims as LoggeduserBasicDetails;
    const handleLogoutRedirect = () => {
        deleteCookie('token');
        instance.logoutRedirect();
    };
    return (
        <>

            <LoadingSkeleton position={"absolute"} />

            <div className="dcc-relative dcc-p-6 md:dcc-p-12 xl:dcc-p-24 dcc-bg-bodyBg dcc-z-50">
                <div className="dcc-flex dcc-items-center dcc-justify-between dcc-pb-3">
                    <h2>My Account</h2>
                    <a href="#" onClick={() => handleLogoutRedirect()} className="dcc-signout"><span>Sign out</span></a>
                </div>
                {
                    activeAccount ?
                        <section className="sp-grid-layout">
                            {/* Profile details with hint */}

                            <div
                                className="dcc-grid dcc-grid-cols-1 md:dcc-grid-cols-2 sp-grid-bottom-border dcc-py-4 dcc-items-center dcc-gap-4 lg:dcc-gap-0">
                                <div>
                                    <p className="dcc-font-bold dcc-text-base dcc-flex dcc-items-center">Work Email Address
                                        <span className="has-hint"><span
                                            className="hint-tooltip hint--right"
                                            aria-label="Please contact us to modify.">
                                            <em className="user-tip"></em>
                                        </span></span>
                                    </p>
                                    <p className="dcc-mb-0 dcc-text-sm 2xl:dcc-hidden dcc-italic"><b>Hint: </b>Please contact us to modify.</p>
                                </div>
                                <p className="dcc-font-normal dcc-text-base">{!!activeAccount.email ? activeAccount.email : "-"}</p>
                            </div>

                            {/* Profile details with hint */}
                            <div
                                className="dcc-grid dcc-grid-cols-1 md:dcc-grid-cols-2 sp-grid-bottom-border dcc-py-4 dcc-items-center dcc-gap-4 lg:dcc-gap-0">
                                <div>
                                    <p className="dcc-font-bold dcc-text-base dcc-flex dcc-items-center">Company Name
                                        <span className="has-hint"><span
                                            className="hint-tooltip hint--right"
                                            aria-label="Please contact us to modify.">
                                            <em className="user-tip"></em>
                                        </span></span>
                                    </p>
                                    <p className="dcc-mb-0 dcc-text-sm 2xl:dcc-hidden dcc-italic"><b>Hint: </b>Please contact us to modify.</p>
                                </div>
                                <p className="dcc-font-normal dcc-text-base">{!!activeAccount.extension_CompanyName ? activeAccount.extension_CompanyName : "-"}</p>
                            </div>

                            {/* Profile details without hint */}
                            <div
                                className="dcc-grid dcc-grid-cols-1 md:dcc-grid-cols-2 sp-grid-bottom-border dcc-py-4 dcc-items-center dcc-gap-4 lg:dcc-gap-0">
                                <p className="dcc-font-bold dcc-text-base">First Name</p>
                                <p className="dcc-font-normal dcc-text-base has-editable-field"><span>{!!activeAccount.given_name ? activeAccount.given_name : "-"}</span>
                                </p>
                            </div>

                            {/* Profile details without hint */}
                            <div
                                className="dcc-grid dcc-grid-cols-1 md:dcc-grid-cols-2 sp-grid-bottom-border dcc-py-4 dcc-items-center dcc-gap-4 lg:dcc-gap-0">
                                <p className="dcc-font-bold dcc-text-base">Last Name</p>
                                <p className="dcc-font-normal dcc-text-base has-editable-field"><span>{!!activeAccount.family_name ? activeAccount.family_name : "-"}</span>
                                </p>
                            </div>


                            <div className="relative dcc-pt-6">
                                <p className="dcc-font-normal dcc-text-base">Please review the <Link href="/solicitor/terms-and-conditions">Terms and Conditions</Link> of use and&nbsp;<a href="https://www.dunedin.govt.nz/about-this-site/privacy-policy" target="_blank" className="newwindow-site-small">Privacy Policy</a>.
                                </p>
                            </div>

                        </section>
                        : ''
                }
            </div>
        </>
    )
}
