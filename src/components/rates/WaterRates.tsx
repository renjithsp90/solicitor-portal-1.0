import React, { useEffect, useState } from "react";
import { CreateWaterRFS } from "@/app/api/createWFR";
import { format } from "date-fns";
import Holidays from 'date-holidays'
import ReactDatePicker from "react-datepicker";
import { CreateRateRFS } from "@/app/api/createRAT";
import { deleteCookie, setCookie } from 'cookies-next';
import { useMsal } from "@azure/msal-react";
import { generatePDF } from "../GeneratePDF";

export default function WaterRates({ resetFunc, rateInfo, account, futureRateRequested }: { resetFunc: any, rateInfo: RatesInfo, account: LoggeduserBasicDetails, futureRateRequested: boolean }) {
    const { instance, accounts } = useMsal();

    //resetting the idtoken if there is an inactivity
    instance.acquireTokenSilent({
        account: accounts[0],
        scopes: []
    }).then((res) => {
        setCookie('token', res.idToken);
    }).catch((error) => {
        console.log("Error on retreiving token" + error)
    });

    //get all sundays
    function getSundays(year: number) {
        let Sundays: string[] = [];
        let dateToCheck = new Date(year, 0, 1);
        const day = dateToCheck.getDay();
        if (day != 0) {
            dateToCheck.setDate(dateToCheck.getDate() + (7 - day));
        }
        Sundays.push(format(dateToCheck, "yyyy-MM-dd"));
        while (dateToCheck) {
            dateToCheck.setDate(dateToCheck.getDate() + 7);
            if (dateToCheck.getFullYear() != year) return Sundays;
            Sundays.push(format(dateToCheck, "yyyy-MM-dd"));
        }
        return Sundays
    }
    function getSatuardays(year: number) {
        let Satuardays: string[] = [];
        let dateToCheck = new Date(year, 0, 1);
        const day = dateToCheck.getDay();
        if (day != 6) {
            dateToCheck.setDate(dateToCheck.getDate() + (6 - day));
        }
        Satuardays.push(format(dateToCheck, "yyyy-MM-dd"));
        while (dateToCheck) {
            dateToCheck.setDate(dateToCheck.getDate() + 7);
            if (dateToCheck.getFullYear() != year) return Satuardays;
            Satuardays.push(format(dateToCheck, "yyyy-MM-dd"));
        }
        return Satuardays
    }

    const hd = new Holidays('NZ', 'OTA');
    const currentYear = new Date().getFullYear();
    let publicHolidaysDetails: HolidayDateStructure[] = [];
    let publicHolidaysStringArray: string[] = [];
    publicHolidaysDetails = publicHolidaysDetails.concat(hd.getHolidays(currentYear - 1), hd.getHolidays(currentYear), hd.getHolidays(currentYear + 1))
    publicHolidaysDetails.forEach(holiday => {
        publicHolidaysStringArray.push(holiday.date.slice(0, 10))
    });

    let datesToDisable: string[] = publicHolidaysStringArray.concat(getSundays(2023), getSundays(2024), getSundays(2025), getSatuardays(2023), getSatuardays(2024), getSatuardays(2025));

    let leadDaysCount = 0;
    let dayToCompare = new Date();
    do {
        if (datesToDisable.includes(format(dayToCompare, "yyyy-MM-dd"))) {
            dayToCompare = new Date(dayToCompare.getTime() + 24 * 60 * 60 * 1000);
        } else {
            datesToDisable.push(format(dayToCompare, "yyyy-MM-dd"));
            dayToCompare = new Date(dayToCompare.getTime() + 24 * 60 * 60 * 1000);
            leadDaysCount++;
        }
    } while (leadDaysCount < 3)

    const [rateRFS, setRateRFS] = useState<number>(0);
    const [waterRatesRFS, setWaterRatesRFS] = useState<number>(0);
    // input field error 
    const [inputFieldError, setInputFieldError] = useState("");
    const [inputFieldErrorSettlementRepport, setInputFieldErrorSettlementRepport] = useState("")
    const [iswaterConsentTriggered, setIswaterConsentTriggered] = useState<string>("dcc-hidden");
    const [waterRateReadDate, setWaterRateReadDate] = useState<string>("dcc-hidden");
    const [inputWaterRateDate, setInputWaterRateDate] = useState<Date | null>();
    const [validWaterRateDate, setValidWaterRateDate] = useState<boolean>(false);
    const [waterRFSCreated, setIsWaterRFSCreated] = useState<boolean>(false);
    const [haveFinalWaterReadingDate, setHaveFinalWaterReadingDate] = useState<boolean>(rateInfo.waterRates);
    const [requestForRefinanceOrSale, setRequestForRefinanceOrSale] = useState<string>('Sale');
    const [cancelDirectDebitAsPartOfRequest, setCancelDirectDebitAsPartOfRequest] = useState<boolean>(true);

    // interupt property 
    const [isCancelReport, setIsCancelReport] = useState<string>("dcc-hidden");
    const [cancelReportRequest, setCancelReportRequest] = useState<boolean>(false);

    let timeoutId: NodeJS.Timeout;
    const confirm_water_rates = document.getElementById("confirm_water_rates_" + rateInfo.propertyInfo.assessment_PK.toString());
    const request_settlement_report_div = document.getElementById("request_settlement_report_div_" + rateInfo.propertyInfo.assessment_PK.toString());
    const creating_water_rates_rfrs = document.getElementById("creating_water_rates_rfrs_" + rateInfo.propertyInfo.assessment_PK.toString());
    const void_water_rates = document.getElementById("void_water_rates_" + rateInfo.propertyInfo.assessment_PK.toString());
    const authorise_water_rates = document.getElementById("authorise_water_rates_" + rateInfo.propertyInfo.assessment_PK.toString());
    var void_water_rates_error = document.getElementById("void_water_rates_error_" + rateInfo.propertyInfo.assessment_PK.toString());
    const water_rate_date = document.getElementById("water_rate_date_" + rateInfo.propertyInfo.assessment_PK.toString());
    const submitBtn = document.getElementById("create_rfs_btn_" + rateInfo.propertyInfo.assessment_PK.toString());
    var confirm_water_rates_contents = confirm_water_rates ? (confirm_water_rates as HTMLInputElement).innerHTML : "";

    // interupt property
    const void_report_request = document.getElementById("void_report_request_" + rateInfo.propertyInfo.assessment_PK.toString());
    var void_report_request_error = document.getElementById("void_report_request_error_" + rateInfo.propertyInfo.assessment_PK.toString());
    const creating_report_request_rfs = document.getElementById("creating_report_request_rfs_" + rateInfo.propertyInfo.assessment_PK.toString());
    const confirm_report_request = document.getElementById("confirm_report_request_" + rateInfo.propertyInfo.assessment_PK.toString());
    const authorise_report_request = document.getElementById("authorise_report_request_" + rateInfo.propertyInfo.assessment_PK.toString());

    const resetForm = () => {
        resetFunc(true);
        deleteCookie('RATRFSNumber')
        deleteCookie('WFRRFSNumber')
    }

    const triggerWaterRFSConsent = () => {
        if (iswaterConsentTriggered == "dcc-hidden") {
            setIswaterConsentTriggered("")
        }
        else {
            setIswaterConsentTriggered("dcc-hidden")
        }
    }

    const triggerHaveFinalWaterReadingDate = () => {

        let waterReadingDateYes = document.getElementById("waterReadingDateYes_" + rateInfo.propertyInfo.assessment_PK.toString());
        if (waterReadingDateYes && (waterReadingDateYes as HTMLInputElement).checked) {
            setHaveFinalWaterReadingDate(true);
        }
        else {
            setHaveFinalWaterReadingDate(false);
        }

    }

    const triggerRequestForRefinanceOrSale = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRequestForRefinanceOrSale(event.target.value)
    }

    const triggerCancelDirectDebitAsPartOfRequest = (event: React.ChangeEvent<HTMLInputElement>) => {
        const checked = event.target.value == "Yes" ? true : false;
        setCancelDirectDebitAsPartOfRequest(checked)
    }


    // user cancek settlement report request 
    const voidReportRequest = () => {
        setIsCancelReport("dcc-hidden");
        setCancelReportRequest(false);
    }

    // user triggers request settlement report 
    const triggerManualRequest = () => {
        if (!haveFinalWaterReadingDate) {
            setIsCancelReport("");
            setCancelReportRequest(true);
        }
        else if (waterRateReadDate == "dcc-hidden" && haveFinalWaterReadingDate) {
            setWaterRateReadDate("");
            setInputFieldError("Please enter a valid final read date");
        }
        else {
            if (inputWaterRateDate && haveFinalWaterReadingDate) {
                let water_rate_date_val_valid = !isNaN(inputWaterRateDate.getTime())
                if (!inputWaterRateDate || !water_rate_date_val_valid) {
                    setInputFieldError("Please enter a valid final read date");
                    return;
                }
                setIsCancelReport("");
                setCancelReportRequest(true);
            }
        }
    }

    // user authorise setltement repolrt request 
    const authoriseReportRequest = () => {
        if (!waterRFSCreated && haveFinalWaterReadingDate)
            authoriseWaterRFSCreation();

        if (creating_report_request_rfs && confirm_report_request && authorise_report_request && void_report_request && void_report_request_error) {
            (creating_report_request_rfs as HTMLInputElement).classList.add("dcc-loading");
            (authorise_report_request as HTMLInputElement).disabled = true;
            (void_report_request as HTMLInputElement).disabled = true;
            (authorise_report_request as HTMLInputElement).innerHTML = "Creating RFS...";

            // delay the api call for 2 seconds t oshoe the loading icon 
            timeoutId = setTimeout(() => {
                CreateRateRFS(rateInfo, account, cancelDirectDebitAsPartOfRequest, requestForRefinanceOrSale).then((res) => {
                    (creating_report_request_rfs as HTMLInputElement).classList.remove("dcc-loading");
                    (void_report_request as HTMLInputElement).disabled = false;
                    (authorise_report_request as HTMLInputElement).innerHTML = "Yes, proceed";
                    if (res != 0) {
                        setRateRFS(res);
                        setCancelReportRequest(true);
                    }
                    // invalid response 
                    else {

                        (authorise_report_request as HTMLInputElement).classList.add("dcc-hidden");
                        const htmlContent = `
                        <div class="dcc-alert-without-border dcc-text-errorRed" style="align-items:flex-start;">
                        <p>There was an issue creating a request for support. Please refresh your browser and try again. If the issue persists, please contact DCC at <a href="dcc@dcc.govt.nz">dcc@dcc.govt.nz</a> or call <a href="tel:+6434774000">+64 3 477 4000</a> for support.</p>
                        </div>
                            `;
                        (request_settlement_report_div as HTMLInputElement).innerHTML = htmlContent;
                        (void_report_request as HTMLInputElement).classList.add("dcc-hidden")
                        setCancelReportRequest(false);
                    }
                });
            }, 2000);

        }
    }

    const submitRates = () => {
        if (!haveFinalWaterReadingDate) {
            if (!validWaterRateDate) {
                setInputFieldError("Please enter a valid final read date");
            }
        }
        // if (request_settlement_report && !(request_settlement_report as HTMLInputElement).checked) {
        //     setInputFieldErrorSettlementRepport("Please check request settlement rate");
        //     return;
        // }
        setInputFieldErrorSettlementRepport("");
        if (submitBtn) {
        }

    }

    // user voids the water RFS
    const voidWaterRFS = () => {
        if (water_rate_date) {
            setIswaterConsentTriggered("dcc-hidden");
            setWaterRateReadDate("dcc-hidden");
            (water_rate_date as HTMLInputElement).value = "";
            setInputWaterRateDate(null);
            setValidWaterRateDate(false);
            (water_rate_date as HTMLInputElement).max = new Date().toDateString();
            setInputFieldError("");
        }
    }

    // error in creating RFS 
    const voidWaterRFSError = () => {
        if (water_rate_date) {
            setIswaterConsentTriggered("dcc-hidden");
            setWaterRateReadDate("dcc-hidden");
            (water_rate_date as HTMLInputElement).value = "";
            setInputWaterRateDate(null);
            setValidWaterRateDate(false);
            (authorise_water_rates as HTMLInputElement).classList.remove("dcc-hidden");
            (authorise_water_rates as HTMLInputElement).disabled = false;
            (confirm_water_rates as HTMLInputElement).innerHTML = confirm_water_rates_contents;
            (void_water_rates_error as HTMLInputElement).classList.add("dcc-hidden");
            (void_water_rates as HTMLInputElement).classList.remove("dcc-hidden")
        }
    }


    // user authorise the water RFS
    const authoriseWaterRFSCreation = () => {
        if (creating_water_rates_rfrs && confirm_water_rates && authorise_water_rates && void_water_rates && void_water_rates_error) {
            (creating_water_rates_rfrs as HTMLInputElement).classList.add("dcc-loading");
            (authorise_water_rates as HTMLInputElement).disabled = true;
            (void_water_rates as HTMLInputElement).disabled = true;
            (authorise_water_rates as HTMLInputElement).innerHTML = "Creating RFS...";


            // delay the api call for 2 seconds t oshoe the loading icon 
            timeoutId = setTimeout(() => {
                CreateWaterRFS(rateInfo, account).then((res) => {
                    (creating_water_rates_rfrs as HTMLInputElement).classList.remove("dcc-loading");
                    (void_water_rates as HTMLInputElement).disabled = false;
                    (authorise_water_rates as HTMLInputElement).innerHTML = "Yes, proceed";


                    if (res != 0) {
                        // valid response 
                        setWaterRatesRFS(res);
                        setIsWaterRFSCreated(true)
                    }
                    // invalid response 
                    else {

                        (authorise_water_rates as HTMLInputElement).classList.add("dcc-hidden");
                        const htmlContent = `
                            <div className="dcc-text-errorRed dcc-mb-4">
                                <span>There was an issue creating a request for support. Please refresh your browser and try again. If the issue persists, please contact DCC at <a href="dcc@dcc.govt.nz">dcc@dcc.govt.nz</a> or call <a href="tel:+6434774000">+64 3 477 4000</a> for support.</span>
                            </div>
                        `;
                        (confirm_water_rates as HTMLInputElement).innerHTML = htmlContent;
                        (void_water_rates_error as HTMLInputElement).classList.remove("dcc-hidden");
                        (void_water_rates as HTMLInputElement).classList.add("dcc-hidden")
                    }
                });
            }, 2000);

        }
    }

    // show the field or trigger the popup 
    const createWaterRequest = () => {
        // show the field 
        if (waterRateReadDate == "dcc-hidden") {
            setWaterRateReadDate("");
            setInputFieldError("Please enter a valid final read date");
        }
        else {
            if (inputWaterRateDate) {
                let water_rate_date_val_valid = !isNaN(inputWaterRateDate.getTime())
                if (!inputWaterRateDate || !water_rate_date_val_valid) {
                    setInputFieldError("Please enter a valid final read date");
                    return;
                }
                setInputFieldError("");
                setValidWaterRateDate(true);
                // trigger popup open
                triggerWaterRFSConsent();
            }
        }
    };
    useEffect(() => {
        // Clear the timeout when the component unmounts
        return () => clearTimeout(timeoutId);
    }, []);

    function reformatAddress(inputString: string): string {
        let stringWithHyphens = inputString.replace(/\s+/g, '-');
        stringWithHyphens = stringWithHyphens.toLowerCase();
        const currentDate = new Date();
        const dateSuffix = `-${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
        return stringWithHyphens + dateSuffix;
    }


    return (
        <>
            <section className="dcc-relative dcc-pt-5">
                <h3>Water Rates</h3>

                {
                    rateInfo.waterRates ?
                        !waterRFSCreated ?
                            <>
                                <div className="dcc-relative dcc-pt-3">
                                    <p>This property is responsible for paying water rates. A final water meter reading is required for settlement. Please indicate the date for final reading. <b>Please allow 3 working days lead time for final reading.</b>
                                    </p>
                                    <p>Do you know the date for the final reading?</p>

                                    <div className="dcc-w-full dcc-relative">
                                        <div className="dcc-grid dcc-grid-cols-4 dcc-font-normal dcc-text-base dcc-h-4">
                                            <div className="dcc-relative dcc-flex">
                                                <input type="radio" aria-label="I have final water reading date" name="waterReadingDate" id={`${"waterReadingDateYes_"}${rateInfo.propertyInfo.assessment_PK.toString()}`} checked={haveFinalWaterReadingDate} onChange={triggerHaveFinalWaterReadingDate} />
                                                <label htmlFor={`${"waterReadingDateYes_"}${rateInfo.propertyInfo.assessment_PK.toString()}`} className="dcc-pl-8 dcc-mt-1">Yes</label>
                                            </div>
                                            <div className="dcc-relative dcc-flex">
                                                <input type="radio" aria-label="I don't have final water reading date" name="waterReadingDate" id={`${"waterReadingDateNo_"}${rateInfo.propertyInfo.assessment_PK.toString()}`} onChange={triggerHaveFinalWaterReadingDate} checked={!haveFinalWaterReadingDate} />
                                                <label htmlFor={`${"waterReadingDateNo_"}${rateInfo.propertyInfo.assessment_PK.toString()}`} className="dcc-pl-8 dcc-mt-1">No</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="sp-grid-layout">

                                    {
                                        haveFinalWaterReadingDate ?
                                            <>
                                                <div className="dcc-grid dcc-grid-cols-1 md:dcc-grid-cols-4 dcc-py-5 dcc-items-center dcc-gap-4 md:dcc-gap-3 2xl:dcc-gap-0">
                                                    <div className="dcc-col-span-2">
                                                        <div className="dcc-w-full dcc-relative dcc-dateicon dcc-pt-2">
                                                            <ReactDatePicker
                                                                id={`${"water_rate_date_"}${rateInfo.propertyInfo.assessment_PK.toString()}`}
                                                                className="dcc-w-full dcc-relative dcc-pt-2"
                                                                selected={inputWaterRateDate}
                                                                placeholderText="Enter final water date - dd/mm/yyyy"
                                                                calendarStartDay={1}
                                                                // maxDate={waterRateDateLimitString}
                                                                dateFormat="dd/MM/yyyy"
                                                                onChange={(date: Date | null | undefined) => {
                                                                    setInputWaterRateDate(date);
                                                                    setWaterRateReadDate("");
                                                                    if (date) {
                                                                        setValidWaterRateDate(true);
                                                                        setInputFieldError("");
                                                                        rateInfo.finalWaterReadingDate = date;
                                                                    } else {
                                                                        setValidWaterRateDate(false);
                                                                    }
                                                                }}
                                                                excludeDates={datesToDisable.map((date) => new Date(date))}
                                                            />
                                                            <div aria-hidden="true" aria-live="polite" className="dcc-sr-only">
                                                                <p>This input field is used for entering final water read date.</p>
                                                                <p>It is labeled as &quot;Water Rates&quot; and is required.</p>
                                                            </div>
                                                        </div>
                                                        {/* Error */}
                                                        {!!inputFieldError && (inputFieldError.length > 0) ? <div className="dcc-alert-without-border dcc-text-errorRed" style={{ padding: '5px', paddingBottom: '0px' }} id={`${"rates_lookup_input_error_"}${rateInfo.propertyInfo.assessment_PK.toString()}`}>
                                                            {inputFieldError}
                                                        </div> : <></>}
                                                        <div className="dcc-relative dcc-flex dcc-items-start dcc-gap-3 dcc-py-4">
                                                            <button className="action-button haze-action-button" id={`${"create_water_request_"}${rateInfo.propertyInfo.assessment_PK.toString()}`} onClick={createWaterRequest}>Submit</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </> : ''}



                                    <div className={`${"confirm-user-action-wrapper"} ${iswaterConsentTriggered}`}>
                                        <div className="confirm-user-action-container">
                                            <div id={`${"creating_water_rates_rfrs_"}${rateInfo.propertyInfo.assessment_PK.toString()}`}>
                                                <h3 className="dcc-pb-3 dcc-text-left">Water Rates</h3>
                                                <div className="dcc-relative" id={`${"confirm_water_rates_"}${rateInfo.propertyInfo.assessment_PK.toString()}`} key="confirm_water_rates">
                                                    <p>The property owner is responsible for paying water rates. A final water meter reading is required for settlement. Once submitted our Water Business Support team will initiate this process.</p>
                                                    <p>Are you sure you want to continue with this request?</p>
                                                </div>
                                            </div>

                                            <div className="confirm-user-action-btn">
                                                <button type="button" id={`${"void_water_rates_error_"}${rateInfo.propertyInfo.assessment_PK.toString()}`} className="dcc-hidden action-button green-action-button" onClick={voidWaterRFSError}>Close</button>
                                                <button type="button" id={`${"void_water_rates_"}${rateInfo.propertyInfo.assessment_PK.toString()}`} className="dcc-underline" onClick={voidWaterRFS}>Back</button>
                                                <button type="button" id={`${"authorise_water_rates_"}${rateInfo.propertyInfo.assessment_PK.toString()}`} className="action-button danger-action-button" onClick={authoriseWaterRFSCreation}>Continue</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </> : <>
                                <div className="dcc-alert dcc-border-alertSuccessBorder dcc-bg-alertSuccessBackground dcc-text-alerSuccess dcc-mt-6">
                                    <p className="dcc-col-span-2 dcc-w-[80%] dcc-text-pretty dcc-mb-0" ><strong>Request Number: {waterRatesRFS}</strong><br />
                                        <em className="dcc-text-sm">(Your final reading has been initiated)</em></p></div></>
                        : <p className="dcc-col-span-2 dcc-w-[80%] dcc-text-pretty dcc-pt-3">There are no water rates for this property.</p>
                }


                {
                    rateInfo?.status != "OK" ?
                        <>

                            <div className="dcc-relative dcc-pt-6">
                                <h3 className="dcc-pb-3">Request Manual Report</h3>
                                {/* <div className="dcc-relative dcc-pb-4" >
                                    <p>If you would still like to receive the requested information, please submit to send your request to
                                        our team, and you will be contacted shortly. <b>Please allow 2 working days for manual report to be sent.</b>
                                    </p>
                                </div> */}
                                {
                                    !!rateRFS && rateRFS > 0 ?
                                        <>
                                            <div className="dcc-alert dcc-border-alertSuccessBorder dcc-bg-alertSuccessBackground dcc-text-alerSuccess dcc-mt-6"><p className="dcc-col-span-2 dcc-w-[80%] dcc-text-pretty dcc-mb-0" ><strong>Request Number: {rateRFS}</strong><br />
                                                <em className="dcc-text-sm">(Your Settlement report request has been created. <b>Please allow 2 working days for manual report to be sent.</b>)</em></p></div>
                                        </> :
                                        <>
                                            {
                                                rateInfo && rateInfo.directDebits ?
                                                    <>
                                                        <div className="dcc-relative dcc-pt-3">
                                                            <p>There is a Direct Debit on this Rate Account, would you like to cancel it as part of the request?</p>

                                                            <div className="dcc-w-full dcc-relative">
                                                                <div className="dcc-grid dcc-grid-cols-4 dcc-font-normal dcc-text-base dcc-h-4">
                                                                    <div className="dcc-relative dcc-flex">
                                                                        <input type="radio" aria-label="Cancel the Direct Debit as part of request" name="cancelDirectDebitAsPartOfRequest" id={`${"cancelDirectDebitAsPartOfRequestYes_"}${rateInfo.propertyInfo.assessment_PK.toString()}`} onChange={triggerCancelDirectDebitAsPartOfRequest} value="Yes" checked={cancelDirectDebitAsPartOfRequest} />
                                                                        <label htmlFor={`${"cancelDirectDebitAsPartOfRequestYes_"}${rateInfo.propertyInfo.assessment_PK.toString()}`} className="dcc-pl-8 dcc-mt-1">Yes</label>
                                                                    </div>
                                                                    <div className="dcc-relative dcc-flex">
                                                                        <input type="radio" aria-label="Don't cancel the Direct Debit as part of request" name="cancelDirectDebitAsPartOfRequest" id={`${"cancelDirectDebitAsPartOfRequestNo_"}${rateInfo.propertyInfo.assessment_PK.toString()}`} onChange={triggerCancelDirectDebitAsPartOfRequest} value="No" checked={!cancelDirectDebitAsPartOfRequest} />
                                                                        <label htmlFor={`${"cancelDirectDebitAsPartOfRequestNo_"}${rateInfo.propertyInfo.assessment_PK.toString()}`} className="dcc-pl-8 dcc-mt-1">No</label>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </>
                                                    :
                                                    <p></p>
                                            }


                                            <div className="dcc-relative dcc-pb-4" id={`${"request_settlement_report_div_"}${rateInfo.propertyInfo.assessment_PK.toString()}`}>
                                                <div className="dcc-relative dcc-pt-3">
                                                    {/* <p>We have Direct debit found</p> */}
                                                    <br></br>
                                                    <p>Is this request for a Refinance or Sale?</p>

                                                    <div className="dcc-w-full dcc-relative">
                                                        <div className="dcc-grid dcc-grid-cols-4 dcc-font-normal dcc-text-base dcc-h-4">
                                                            <div className="dcc-relative dcc-flex">
                                                                <input type="radio" aria-label="It is not for a Refinance or Sale" name="refinanceOrSale" id={`${"sale_"}${rateInfo.propertyInfo.assessment_PK.toString()}`} onChange={triggerRequestForRefinanceOrSale} value="Sale" checked={requestForRefinanceOrSale == 'Sale' ? true : false} />
                                                                <label htmlFor={`${"sale_"}${rateInfo.propertyInfo.assessment_PK.toString()}`} className="dcc-pl-8 dcc-mt-1">Sale</label>
                                                            </div>
                                                            <div className="dcc-relative dcc-flex">
                                                                <input type="radio" aria-label="This for a Refinance or Sale" name="refinanceOrSale" id={`${"refinance_"}${rateInfo.propertyInfo.assessment_PK.toString()}`} onChange={triggerRequestForRefinanceOrSale} value="Refinance" checked={requestForRefinanceOrSale == 'Refinance' ? true : false} />
                                                                <label htmlFor={`${"refinance_"}${rateInfo.propertyInfo.assessment_PK.toString()}`} className="dcc-pl-8 dcc-mt-1">Refinance</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <br></br>
                                                <br></br>
                                                <p>If you would still like to receive the requested information, please submit to send your request to
                                                    our team, and you will be contacted shortly. <b>Please allow 2 working days for manual report to be sent.</b>
                                                </p>
                                            </div>

                                            <div className="dcc-flex dcc-items-center dcc-h-0">

                                                <label className="dcc-checkbox-label dcc-pl-8 dcc-my-4"></label>

                                                <div className={`${"confirm-user-action-wrapper"} ${isCancelReport}`}>
                                                    <div className="confirm-user-action-container">
                                                        <div id={`${"creating_report_request_rfs_"}${rateInfo.propertyInfo.assessment_PK.toString()}`}>
                                                            <h3 className="dcc-pb-3 dcc-text-left">Request a manual report</h3>
                                                            <div className="dcc-relative" id={`${"confirm_report_request_"}${rateInfo.propertyInfo.assessment_PK.toString()}`} key={`${"confirm_direct_report_request_"}${rateInfo.propertyInfo.assessment_PK.toString()}`}>
                                                                <p>This can take up to two working days to prepare.</p>
                                                                <p> Are you sure you want to continue?</p>
                                                            </div>
                                                        </div>

                                                        <div className="confirm-user-action-btn">
                                                            <button type="button" id={`${"void_report_request_error_"}${rateInfo.propertyInfo.assessment_PK.toString()}`} className="dcc-hidden action-button green-action-button" onClick={voidReportRequest}>Close</button>
                                                            <button type="button" id={`${"void_report_request_"}${rateInfo.propertyInfo.assessment_PK.toString()}`} className="dcc-underline" onClick={voidReportRequest}>Back</button>
                                                            <button type="button" id={`${"authorise_report_request_"}${rateInfo.propertyInfo.assessment_PK.toString()}`} className="action-button danger-action-button" onClick={authoriseReportRequest}>Continue</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </>

                                }
                                {
                                    !!inputFieldErrorSettlementRepport && (inputFieldErrorSettlementRepport.length > 0) ?
                                        <div style={{ paddingBottom: "0", paddingLeft: "0" }} className="dcc-alert-without-border dcc-text-errorRed" id={`${"water_rates_input_error_"}${rateInfo.propertyInfo.assessment_PK.toString()}`}>
                                            {inputFieldErrorSettlementRepport}
                                        </div>
                                        : <></>
                                }

                            </div>
                        </>
                        : ''
                }

            </section >
            {/* Action Buttons */}
            < div className="dcc-relative dcc-flex dcc-items-start dcc-gap-3 dcc-pb-5" >
                <div className="action-button haze-action-button dcc-mb-0" onClick={resetForm} >New Search</div>
                {/* <a href="/" className="action-button haze-action-button dcc-mb-0" >New Search</a> */}
                {
                    rateInfo?.status == "OK" ?
                        <button type="button" className="action-button green-action-button dcc-mb-0 dcc-font-bold" id={`${"generate_download_pdf_"}${rateInfo.propertyInfo.assessment_PK.toString()}`} onClick={() => generatePDF(rateInfo, futureRateRequested)}>Generate & Download PDF</button>
                        :
                        // Action Buttons
                        <div className="dcc-relative dcc-flex dcc-items-start dcc-gap-3">
                            <button type="button" className="action-button green-action-button dcc-mb-0 dcc-font-bold" id={`${"create_rfs_btn_"}${rateInfo.propertyInfo.assessment_PK.toString()}`} onClick={triggerManualRequest} disabled={cancelReportRequest} style={{ minWidth: "115px" }}>Submit</button>
                        </div>
                }

            </div >
        </>

    )
}