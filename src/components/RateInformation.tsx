import { ChangeEvent, useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
// import pdfMakeX from 'pdfmake/build/pdfmake.js';
// import pdfFontsX from 'pdfmake/build/vfs_fonts';
// (pdfMakeX as any).vfs = pdfFontsX.pdfMake.vfs;
import DirectDebit from "./rates/DirectDebit";
import { format } from "date-fns";
import WaterRates from "./rates/WaterRates";

function RateInformation(props: props) {

    const rateInfo = props.rateInfo;
    let counter = 1;
    // Scroll to the top of the page when ChildComponent renders
    useEffect(() => {
        window.scrollTo(0, 0);

    }, []);


    return (
        <>

            {/* Rates Information */}
            <section className={`${"dcc-relative"}${!props.showInList ? "sp-grid-top-border" : ""}`}>
                <div className="dcc-alert dcc-border-alertInformationBorder dcc-bg-alertInformationBackground dcc-text-alertInformation">
                    The information detailed on this page is provided based on the details you have entered in the Portal.
                    <br />The DCC has made all reasonable endeavours to ensure the accuracy of information.
                </div>
                <h2 className={`${!props.showInList ? "dcc-pt-6" : ''}`}>Information </h2>
                <div className="sp-grid-layout dcc-pt-5">
                    {
                        rateInfo?.status == "OK" ?
                            <>
                                {
                                    props.futureRateRequested ?
                                        <div className="dcc-alert dcc-border-alertDangerBorder dcc-bg-alertDangerBackground dcc-text-alertDanger">
                                            NOTICE: The settlement date entered crosses the 30th of June, the end of the financial year.
                                        </div>
                                        : ''
                                }
                                {!!rateInfo.propertyInfo.valuationNumber ?
                                    <div
                                        className="dcc-grid dcc-grid-cols-1 md:dcc-grid-cols-3 sp-grid-bottom-border dcc-py-4 dcc-items-center dcc-gap-4  md:dcc-gap-3 2xl:dcc-gap-0 2xl:dcc-max-w-[60%]">
                                        <p className="dcc-font-bold dcc-text-base">Valuation Number</p>
                                        <p className="dcc-font-normal dcc-text-base md:dcc-col-span-2">{rateInfo.propertyInfo.valuationNumber}</p>
                                    </div> : <></>}

                                <div
                                    className="dcc-grid dcc-grid-cols-1 md:dcc-grid-cols-3 sp-grid-bottom-border dcc-py-4 dcc-items-center dcc-gap-4  md:dcc-gap-3 2xl:dcc-gap-0 2xl:dcc-max-w-[60%]">
                                    <p className="dcc-font-bold dcc-text-base">Rating Details as at</p>
                                    <p className="dcc-font-normal dcc-text-base md:dcc-col-span-2">{format(rateInfo.ratingDetailsDate, "EEE dd/MM/yyy")}</p>
                                </div>
                                <div
                                    className="dcc-grid dcc-grid-cols-1 md:dcc-grid-cols-3 sp-grid-bottom-border dcc-py-4 dcc-items-center dcc-gap-4  md:dcc-gap-3 2xl:dcc-gap-0 2xl:dcc-max-w-[60%]">
                                    <p className="dcc-font-bold dcc-text-base">Our Rates Reference</p>
                                    <p className="dcc-font-normal dcc-text-base md:dcc-col-span-2">{rateInfo.rateReferenceId}</p>
                                </div>
                            </> :
                            <>
                                <div
                                    className="dcc-grid dcc-grid-cols-1 md:dcc-grid-cols-3 sp-grid-bottom-border dcc-py-4 dcc-items-center dcc-gap-4  md:dcc-gap-3 2xl:dcc-gap-0 2xl:dcc-max-w-[60%]">
                                    <p className="dcc-font-bold dcc-text-base">Valuation Number</p>
                                    <p className="dcc-font-normal dcc-text-base md:dcc-col-span-2">{rateInfo.propertyInfo.valuationNumber}</p>
                                </div>
                            </>
                    }

                    <div
                        className="dcc-grid dcc-grid-cols-1 md:dcc-grid-cols-3 sp-grid-bottom-border dcc-py-4 dcc-items-center dcc-gap-4  md:dcc-gap-3 2xl:dcc-gap-0 2xl:dcc-max-w-[60%]">
                        <p className="dcc-font-bold dcc-text-base">Legal Description</p>
                        <p className="dcc-font-normal dcc-text-base md:dcc-col-span-2">{rateInfo.propertyInfo.legalDescription}</p>
                    </div>

                    <div
                        className="dcc-grid dcc-grid-cols-1 md:dcc-grid-cols-3 sp-grid-bottom-border dcc-py-4 dcc-items-center dcc-gap-4  md:dcc-gap-3 2xl:dcc-gap-0 2xl:dcc-max-w-[60%]">
                        <p className="dcc-font-bold dcc-text-base">Property Address</p>
                        <p className="dcc-font-normal dcc-text-base md:dcc-col-span-2">{rateInfo.propertyInfo.address}</p>
                    </div>

                    <div
                        className="dcc-grid dcc-grid-cols-1 md:dcc-grid-cols-3 sp-grid-bottom-border dcc-py-4 dcc-items-center dcc-gap-4  md:dcc-gap-3 2xl:dcc-gap-0 2xl:dcc-max-w-[60%]">
                        <p className="dcc-font-bold dcc-text-base">Rate payers</p>
                        <p className="dcc-font-normal dcc-text-base md:dcc-col-span-2">
                            {rateInfo.ratePayers && rateInfo.ratePayers.length && rateInfo.ratePayers.map((ratePayerName, i) =>
                                <>
                                    <span key={`ratepayer_${i}`}>{ratePayerName.name}<br /></span>
                                </>)
                            }
                        </p>
                    </div>
                    {
                        rateInfo?.status == "OK" ?
                            <div
                                className="dcc-grid dcc-grid-cols-1 md:dcc-grid-cols-3 sp-grid-bottom-border dcc-py-4 dcc-items-center dcc-gap-4  md:dcc-gap-3 2xl:dcc-gap-0 2xl:dcc-max-w-[60%]">
                                <p className="dcc-font-bold dcc-text-base">Annual Rates</p>
                                <p className="dcc-font-normal dcc-text-base md:dcc-col-span-2">${rateInfo.annualRateAmount.toFixed(2)}</p>
                            </div>
                            : ''
                    }

                </div>
            </section>
            {
                rateInfo?.status == "OK" ?
                    <>
                        {/* {
                            rateInfo.settlementDate && rateInfo.settlementDate.toISOString > new Date()
                        } */}
                        {/* Instalments */}
                        <section className="dcc-relative dcc-pt-6 full-width">
                            <h3>Instalments</h3>
                            {/* instalments cards */}
                            {rateInfo.instalments.length > 0 ?

                                <div className="dcc-relative dcc-py-5">
                                    {/* Card layout */}
                                    <div
                                        className="dcc-grid dcc-grid-cols-1 lg:dcc-grid-cols-2 4xl:dcc-grid-cols-4 dcc-items-center dcc-gap-4 md:dcc-gap-6">
                                        {/* instalment Card */}

                                        {
                                            rateInfo.instalments &&
                                            rateInfo.instalments.length > 0 &&
                                            rateInfo.instalments.sort((a, b) => {
                                                return new Date(a.date).getTime() - new Date(b.date).getTime()
                                            }).map((installment) =>
                                                <>
                                                    <div className="dcc-min-h-24 dcc-min-w-24 dcc-border-b dcc-bg-white dcc-p-6 dcc-rounded-xl" key={`${"installement_"}${installment.dueDate}`}>
                                                        <div className="dcc-flex dcc-items-center dcc-justify-between dcc-py-4">
                                                            <p
                                                                className="dcc-font-bold dcc-text-xl dcc-rounded-full dcc-bg-teal dcc-p-2 dcc-h-10 dcc-w-10 dcc-text-white dcc-text-center dcc-flex dcc-items-center dcc-justify-center dcc-mb-0">
                                                                <span>{counter++}</span>
                                                            </p>
                                                            <p className="dcc-font-bold dcc-text-xl dcc-mb-0">{format(installment.date, "dd MMMM yyyy")}</p>
                                                        </div>

                                                        <div
                                                            className="dcc-flex dcc-items-center dcc-justify-between sp-grid-bottom-border dcc-py-4">
                                                            <p className="dcc-font-normal dcc-text-base dcc-mb-0">Instalment Amount<span className="has-hint"><span
                                                                className="hint-tooltip hint--right"
                                                                aria-label="If a minus sign is showing the account is in credit">
                                                                <em className="user-tip"></em>
                                                            </span></span></p>
                                                            <p className="dcc-font-normal dcc-text-lg dcc-mb-0">${installment.amount.toFixed(2)}<span className="has-hint"><span
                                                                className="hint-tooltip hint--right"
                                                                aria-label="If a minus sign is showing the account is in credit">
                                                                <em className="user-tip"></em>
                                                            </span></span></p>
                                                        </div>
                                                        <div
                                                            className="dcc-flex dcc-items-center dcc-justify-between sp-grid-bottom-border dcc-py-4">
                                                            <p className="dcc-font-normal dcc-text-base dcc-mb-0">Penalty Amount</p>
                                                            <p className="dcc-font-normal dcc-text-lg dcc-mb-0">{(installment.penalty && installment.penalty != 0 && !isNaN(Number(installment.penalty))) ? '$' + installment.penalty.toFixed(2) : '-'}</p>
                                                        </div>
                                                        <div
                                                            className="dcc-flex dcc-items-center dcc-justify-between sp-grid-bottom-border dcc-py-4">
                                                            <p className="dcc-font-normal dcc-text-base dcc-mb-0">Total Amount Due</p>
                                                            <p className="dcc-font-bold dcc-text-lg dcc-mb-0">${installment.total.toFixed(2)}</p>
                                                        </div>
                                                        <div
                                                            className="dcc-flex dcc-items-center dcc-justify-between sp-grid-bottom-border dcc-py-4">
                                                            <p className="dcc-font-normal dcc-text-base dcc-mb-0">Instalment Balance</p>
                                                            <p className="dcc-font-bold dcc-text-lg dcc-mb-0">${installment.balance.toFixed(2)}</p>
                                                        </div>

                                                        <div className="dcc-flex dcc-items-center dcc-justify-between dcc-py-4">
                                                            <p className="dcc-font-normal dcc-text-xl dcc-mb-0">Due Date:</p>
                                                            <p className="dcc-font-bold dcc-text-xl dcc-mb-0">{installment.dueDate ? format(installment.dueDate, "dd-MMM-yyyy") : '-'}</p>
                                                        </div>

                                                    </div>
                                                </>)
                                        }
                                    </div>
                                </div>
                                : ""}
                            <article className={`${"dcc-relative dcc-pb-0"} ${rateInfo.instalments.length == 0 ? "dcc-pt-6" : ""}`}>
                                <p>A 10% penalty will be added to any unpaid portion of the current instalment
                                    if not paid by the Tuesday following the due date.</p>
                                <p><b>Exceptions</b> - a penalty will not be added
                                    if there is a direct debit in place or one has been recently cancelled as part of the
                                    settlement process.</p>
                                {
                                    rateInfo && rateInfo.penaltyWaiver ?
                                        <>
                                            <div
                                                className="dcc-grid dcc-grid-cols-3 sp-grid-bottom-border dcc-py-4 dcc-items-center dcc-gap-4 dcc-gap-3 2xl:dcc-gap-0 2xl:dcc-max-w-[60%]">
                                                {

                                                    rateInfo.penaltyWaiver.map((penalty) =>
                                                        <>
                                                            <p className="dcc-font-bold dcc-text-base dcc-col-span-2">Penalty Waiver ({format(penalty.date, "dd MMM yyyy")})</p>
                                                            <p className="dcc-font-normal dcc-text-base dcc-text-right">${penalty.amount.toFixed(2)}</p>
                                                        </>
                                                    )
                                                }

                                            </div>
                                        </> : ''
                                }

                                <div className="sp-grid-layout">
                                    <div
                                        className="dcc-grid dcc-grid-cols-3 sp-grid-bottom-border dcc-py-4 dcc-items-center dcc-gap-4 dcc-gap-3 2xl:dcc-gap-0 2xl:dcc-max-w-[60%]">
                                        <div className="dcc-relative dcc-col-span-2">
                                            <p className="dcc-font-bold dcc-text-base dcc-flex dcc-items-center">Current Balance <span className="has-hint"><span
                                                className="hint-tooltip hint--right"
                                                aria-label="If a minus sign is showing the account is in credit">
                                                <em className="user-tip"></em>
                                            </span></span></p>
                                            <p className="dcc-py-1 dcc-mb-0 dcc-text-sm 2xl:dcc-hidden dcc-italic"><b>Hint: </b>If a minus sign is showing the account is in credit</p>
                                        </div>

                                        <p className="dcc-font-normal dcc-text-base dcc-text-right">{rateInfo.currentBalance > 0 ? "$" + rateInfo.currentBalance.toFixed(2) : rateInfo.currentBalance == 0 ? "$0.00" : ("-$" + rateInfo.currentBalance.toFixed(2).substring(1))} </p>
                                    </div>
                                    <div
                                        className="dcc-grid dcc-grid-cols-3 sp-grid-bottom-border dcc-py-4 dcc-items-center dcc-gap-4 dcc-gap-3 2xl:dcc-gap-0 2xl:dcc-max-w-[60%]">
                                        <p className="dcc-font-bold dcc-text-base dcc-col-span-2">Total to clear rates to end of rating year</p>
                                        <p className="dcc-font-normal dcc-text-base dcc-text-right">${rateInfo.totalClearBalance.toFixed(2)}</p>
                                    </div>
                                </div>
                            </article>
                        </section>
                        {/* Future Rates Section */}
                        {
                            props.futureRateRequested ?
                                <>
                                    <section className="dcc-relative dcc-pt-6">
                                        <h3 className="dcc-font-medium">Future rates</h3>
                                        <div className="dcc-relative dcc-pt-6">
                                            {
                                                rateInfo.futureRates.showRID && rateInfo.futureRates.rates?.length ?
                                                    <>
                                                        <div className="dcc-alert dcc-border-alertInformationBorder dcc-bg-alertInformationBackground dcc-text-alertInformation">
                                                            Future rates are available. The rates for this period after the 30th of June are an estimate only and allowance should be made for variance. Instalment dates for this period are not available until after rates are struck.
                                                        </div>
                                                        <article className="sp-grid-layout">
                                                            <>
                                                                {
                                                                    rateInfo.futureRates && rateInfo.futureRates.rates &&
                                                                    rateInfo.futureRates.rates.map((futureRate) =>
                                                                        <>
                                                                            <div
                                                                                className="dcc-grid dcc-grid-cols-1 md:dcc-grid-cols-3 sp-grid-bottom-border dcc-py-4 dcc-items-center dcc-gap-4 md:dcc-gap-3 2xl:dcc-gap-0 2xl:dcc-max-w-[60%]">
                                                                                <p className="dcc-font-bold dcc-text-base md:dcc-col-span-2">{futureRate.description}</p>
                                                                                <p className="dcc-font-normal dcc-text-base dcc-text-right">{futureRate.amount ? "$" + futureRate.amount.toFixed(2) : "$0.00"}</p>
                                                                            </div>
                                                                        </>)
                                                                }
                                                                {
                                                                    rateInfo.futureRates && rateInfo.futureRates.rates ?
                                                                        <div
                                                                            className="dcc-grid dcc-grid-cols-1 md:dcc-grid-cols-3 sp-grid-bottom-border dcc-py-4 dcc-items-center dcc-gap-4 md:dcc-gap-3 2xl:dcc-gap-0 2xl:dcc-max-w-[60%]">
                                                                            <p className="dcc-font-bold dcc-text-base md:dcc-col-span-2">Total</p>
                                                                            <p className="dcc-font-normal dcc-text-base dcc-text-right">{rateInfo.futureRates && rateInfo.futureRates.total ? "$" + rateInfo.futureRates.total.toFixed(2) : "$0.00"}</p>
                                                                        </div> : ''
                                                                }
                                                            </>
                                                        </article>

                                                    </> :
                                                    <>
                                                        <div className="dcc-alert dcc-border-alertDangerBorder dcc-bg-alertDangerBackground dcc-text-alertDanger">
                                                            Future rates are not available.
                                                        </div>
                                                    </>
                                            }

                                        </div>

                                    </section>
                                </> :
                                <></>
                        }
                    </> :
                    <>
                        {/* Interupt Message */}
                        <section className="dcc-relative" style={{ paddingBottom: "0px" }}>
                            <div className="dcc-flex dcc-items-center dcc-justify-between dcc-pb-3">
                                <h2>Cannot provide report online</h2>
                            </div>
                            <div className="dcc-relative has-list-items">
                                <p>We can not process your request at this time due to one of the following being present on this rate account:</p>
                                <ul>
                                    <li>The property is historic.</li>
                                    <li>Presence of a targeted rate on the property.</li>
                                    <li>The account being flagged for Termination.</li>
                                    <li>The property being in arrears for the previous rating year.</li>
                                    <li>The property is still proposed and a rate account has not been added yet.</li>
                                </ul>

                                {/* <br />If you would still like to receive the requested information, please tick request settlement report and submit to send your request to
                                    our team, and you will be contacted shortly. */}

                            </div>
                        </section>
                    </>
            }

            {/* Direct Debit */}
            {
                rateInfo?.status == "OK" ?
                    <DirectDebit resetFunc={props.resetFun} rateInfo={props.rateInfo} account={props.account} /> : ''
            }

            {/* Water Rates */}
            <WaterRates resetFunc={props.resetFun} rateInfo={props.rateInfo} account={props.account} futureRateRequested={props.futureRateRequested} />


        </>
    )

}

export default RateInformation