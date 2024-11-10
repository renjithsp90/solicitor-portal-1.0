
import { useState, useRef, useEffect } from "react";
import RatesInformation from "@/components/RateInformation"
import ReactDatePicker from "react-datepicker";
import MapLoadingSkeleton from "./MapLoadingSkeleton";
import { envVariables } from "@/config/envMap";
import { deleteCookie } from "cookies-next";

function PropertyInformation(props: props) {

    deleteCookie('RATRFSNumber')
    deleteCookie('WFRRFSNumber')

    const [inputFieldError, setInputFieldError] = useState<string>("")
    const [inputSettlementDate, setInputSettlementDate] = useState<Date | null>();
    const [validSettlementDate, setValidSettlementDate] = useState<boolean>(false);
    const [futureRateRequested, setUserFutureRateRequestedOrNot] = useState<boolean>(false);
    const rateInfo = props.rateInfo;
    const accountData = props.account;
    const showInList = props.showInList;

    // map loading
    const [isLoaded, setIsLoaded] = useState(false);

    const handleIframeLoad = () => {
        setTimeout(() => {
            setIsLoaded(true);
        }, 5000);
    };


    const resetForm = () => {
        props.resetFun(true)
    }
    const validateSettlementDate = () => {

        var settletment_date = document.getElementById("settlement_date_" + rateInfo.propertyInfo.assessment_PK.toString());
        if (settletment_date) {
            var settlement_date_val = (settletment_date as HTMLInputElement).value;
            let settlement_date_val_parts = settlement_date_val.split("/");
            let formattedDate = `${settlement_date_val_parts[1]}/${settlement_date_val_parts[0]}/${settlement_date_val_parts[2]}`; // convert UK format to US format
            let settlement_date_val_object = new Date(formattedDate);
            let settlement_date_val_valid = !isNaN(settlement_date_val_object.getTime())

            if (!settlement_date_val || !settlement_date_val_valid) {
                setInputFieldError("Please enter a valid settlement date");
                return;
            }
            rateInfo.settlementDate = settlement_date_val_object;
            setInputFieldError("");
            setInputSettlementDate(settlement_date_val_object);
            setValidSettlementDate(true);
            let rateStrikeDate = new Date(envVariables.RateStrikeDate)
            let endDateOfThisFinancialYear = new Date().getMonth() > 5 ? new Date(new Date().getFullYear() + 1, 5, 30) : new Date(new Date().getFullYear(), 5, 30) // 5 means June, 0 means January
            let endDateOfPreviousFinancialYear = new Date(endDateOfThisFinancialYear.getFullYear() - 1, 5, 30)
            if (new Date().getTime() > envVariables.RateStrikeDate) {
                //today is after the strike day
                //set the rate strike day to june 30 of current financial year
                rateStrikeDate = endDateOfThisFinancialYear
                if (settlement_date_val_object.getTime() > rateStrikeDate.getTime()) {
                    //settlemet date greater than strike date(EOY)
                    setUserFutureRateRequestedOrNot(true)
                }
            }
            else {
                //today is before the strike day
                if (settlement_date_val_object.getTime() > rateStrikeDate.getTime()) {
                    //settlemet date greater than strike day
                    setUserFutureRateRequestedOrNot(true)
                } else if (settlement_date_val_object.getTime() < rateStrikeDate.getTime() && settlement_date_val_object.getTime() > endDateOfPreviousFinancialYear.getTime()) {
                    //settlemet date is in between start of financial year and strikedate(EOY)
                    setUserFutureRateRequestedOrNot(true)
                }
            }
        }
    };

    return (
        <>
            {
                rateInfo && !validSettlementDate ?
                    <>
                        {/* Map Container  */}

                        <section className={`${"dcc-relative"} ${!showInList ? "sp-grid-top-border" : ""}`}>
                            <div className={`${"dcc-flex dcc-items-center dcc-justify-between dcc-pb-3"} ${!showInList ? "dcc-pt-6" : ""}`}>
                                <h2>Property Address</h2>
                            </div>
                            <div className="sp-grid-layout">
                                {!!rateInfo.propertyInfo.valuationNumber ?
                                    <div
                                        className="dcc-grid dcc-grid-cols-1 md:dcc-grid-cols-3 sp-grid-bottom-border dcc-py-4 dcc-items-center dcc-gap-4  md:dcc-gap-3 2xl:dcc-gap-0 2xl:dcc-max-w-[60%]">
                                        <p className="dcc-font-bold dcc-text-base">Valuation Number</p>
                                        <p className="dcc-font-normal dcc-text-base md:dcc-col-span-2">{rateInfo.propertyInfo.valuationNumber}</p>
                                    </div> : <></>}

                                {!!rateInfo.propertyInfo.legalDescription ?
                                    <div
                                        className="dcc-grid dcc-grid-cols-1 md:dcc-grid-cols-3 sp-grid-bottom-border dcc-py-4 dcc-items-center dcc-gap-4  md:dcc-gap-3 2xl:dcc-gap-0 2xl:dcc-max-w-[60%]">
                                        <p className="dcc-font-bold dcc-text-base">Legal Description</p>
                                        <p className="dcc-font-normal dcc-text-base md:dcc-col-span-2">{rateInfo.propertyInfo.legalDescription}</p>
                                    </div> : <></>}

                                {!!rateInfo.ratePayers && rateInfo.ratePayers.length ?
                                    <div
                                        className="dcc-grid dcc-grid-cols-1 md:dcc-grid-cols-3 sp-grid-bottom-border dcc-py-4 dcc-items-center dcc-gap-4  md:dcc-gap-3 2xl:dcc-gap-0 2xl:dcc-max-w-[60%]">
                                        <p className="dcc-font-bold dcc-text-base">Property Owner</p>
                                        <p className="dcc-font-normal dcc-text-base md:dcc-col-span-2">
                                            {rateInfo.ratePayers.map((ratePayerName: { name: string }, i: number) =>
                                                <span id={`ratePayer_${i}`} key={`ratePayer_${i}`}>{ratePayerName.name}<br /></span>
                                            )
                                            }
                                        </p>
                                    </div> : <></>}

                                {!!rateInfo.propertyInfo.address ?
                                    <div
                                        className="dcc-grid dcc-grid-cols-1 md:dcc-grid-cols-3 sp-grid-bottom-border dcc-py-4 dcc-items-center dcc-gap-4  md:dcc-gap-3 2xl:dcc-gap-0 2xl:dcc-max-w-[60%]">
                                        <p className="dcc-font-bold dcc-text-base">Property Address</p>
                                        <p className="dcc-font-normal dcc-text-base md:dcc-col-span-2">{rateInfo.propertyInfo.address}</p>
                                    </div> : <></>}

                                {
                                    (rateInfo.propertyInfo.status != 'Historic') ?
                                        <>
                                            <section className="dcc-relative dcc-pt-6">
                                                <h3 className=" dcc-pb-4">Map Location</h3>
                                                <div className="dcc-relative dcc-w-full">
                                                    {!isLoaded && <MapLoadingSkeleton position={"absolute"} paddingBottom={"0px"} />}
                                                    <iframe id="iframe" onLoad={handleIframeLoad} src={`https://dunedin.maps.arcgis.com/apps/Minimalist/index.html?appid=261470b734c14365b59f97b75ffc8868&rates=${rateInfo.propertyInfo.assessment_PK}`} title="Interactive Map of Dunedin" aria-label="Interactive Map of Dunedin" loading="lazy"></iframe>
                                                </div>
                                            </section>
                                        </>
                                        :
                                        <>
                                            <section className="dcc-relative dcc-pt-6">
                                                <h3 className=" dcc-pb-4">Map Location</h3>
                                                <div className="dcc-relative dcc-w-full">
                                                    <div className="dcc-alert-without-border dcc-text-errorRed">
                                                        Map view unavailable for historic property
                                                    </div>
                                                    {/* {!isLoaded && <MapLoadingSkeleton position={"absolute"} paddingBottom={"0px"} />}
                                                    <iframe id="iframe" onLoad={handleIframeLoad} src="C:\RSP\DCC_Projects\eServices\Development\solicitor-portal\src\assets\images\noMap.png" title="Interactive Map of Dunedin" aria-label="Interactive Map of Dunedin" loading="lazy">No image</iframe> */}
                                                </div>
                                            </section>
                                        </>
                                }


                                <div
                                    className="dcc-grid dcc-grid-cols-1 dcc-items-center dcc-gap-4 md:dcc-gap-3 2xl:dcc-gap-0 xl:dcc-max-w-[60%]">
                                    <div className="dcc-relative dcc-w-full 2xl:dcc-max-w-[80%]">
                                        <h3 className="dcc-flex dcc-items-center">Settlement Date  <span className="dcc-font-bold dcc-text-base has-hint dcc-mt-1"><span
                                            className="hint-tooltip hint--right"
                                            aria-label="If settlement date is unknown please use todays date for a current balance.">
                                            <em className="user-tip"></em>
                                        </span></span></h3>
                                        <p className="dcc-py-1 dcc-mb-0 dcc-text-sm 2xl:dcc-hidden dcc-italic"><b>Hint: </b>If settlement date is unknown please use todays date for a current balance.</p>
                                        <div className="dcc-w-full dcc-relative dcc-dateicon dcc-pt-2">
                                            <ReactDatePicker
                                                id={`${"settlement_date_"}${rateInfo.propertyInfo.assessment_PK.toString()}`}
                                                className="dcc-w-full dcc-relative dcc-pt-2"
                                                selected={inputSettlementDate}
                                                placeholderText="Settlement date - dd/mm/yyyy"
                                                calendarStartDay={1}
                                                minDate={new Date()}
                                                dateFormat="dd/MM/yyyy"
                                                onChange={(date) => setInputSettlementDate(date)}
                                            />
                                            <div aria-hidden="true" aria-live="polite" className="dcc-sr-only">
                                                <p>This input field is used for entering settlement date.</p>
                                                <p>It is labeled as &quot;Settlement Date&quot; and is required.</p>
                                            </div>
                                        </div>
                                        {/* Error */}
                                        {!!inputFieldError && (inputFieldError.length > 0) ? <div className="dcc-alert-without-border dcc-text-errorRed" style={{ padding: '5px', paddingBottom: '0px' }} id="rates_lookup_input_error">
                                            {inputFieldError}
                                        </div> : <></>}
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="dcc-relative dcc-flex dcc-items-start dcc-gap-3 dcc-py-4">
                                <div className="action-button haze-action-button dcc-mb-0" onClick={resetForm} >New Search</div>
                                {/* <a href="/" className="action-button haze-action-button dcc-mb-0" >New Search</a> */}
                                <button className="action-button green-action-button dcc-mb-0" onClick={validateSettlementDate}>Get Rates</button>
                            </div>

                        </section>
                    </>
                    : <>
                        <RatesInformation resetFun={resetForm} showInList={showInList} rateInfo={rateInfo} account={accountData} triggerLogout={undefined} futureRateRequested={futureRateRequested} />
                    </>

            }

        </>
    )
}

export default PropertyInformation

