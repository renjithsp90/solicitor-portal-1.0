import { ChangeEvent, useEffect, useState } from "react";
import { format } from "date-fns";
import { CreateRateRFS } from "@/app/api/createRAT";
import { deleteCookie, setCookie } from 'cookies-next';
import { useMsal } from "@azure/msal-react";

export default function DirectDebit({ resetFunc, rateInfo, account }: { resetFunc: any, rateInfo: RatesInfo, account: LoggeduserBasicDetails }) {
    const { instance, accounts } = useMsal();

    //resetting the idtoken if there is an inactivity
    instance.acquireTokenSilent({
        account: accounts[0],
        scopes: []
    }).then((res) => {
        setCookie('token', res.idToken);
    }).catch((error) => {
        console.log("Error on retreiving token")
    });

    const [cancelDDRequest, setCancelDDRequest] = useState<boolean | null>(null);
    const [cancelDDRFS, setCancelDDRFS] = useState<number>(0);
    const [isCancelDDChecked, setIsCancelDDChecked] = useState<string>("dcc-hidden");

    const resetForm = () => {
        resetFunc(true);
        deleteCookie('RATRFSNumber')
        deleteCookie('WFRRFSNumber')
    }

    const triggerDDCheckbox = () => {
        setCancelDDRequest(true)
        setIsCancelDDChecked("")
    }

    var timeoutId: NodeJS.Timeout;

    const cancel_direct_debit = document.getElementById("cancel_direct_debit_" + rateInfo.propertyInfo.assessment_PK.toString());
    const confirm_direct_debit_cancellation = document.getElementById("confirm_direct_debit_cancellation_" + rateInfo.propertyInfo.assessment_PK.toString());
    const creating_direct_debit_cancellation_rfs = document.getElementById("creating_direct_debit_cancellation_rfs_" + rateInfo.propertyInfo.assessment_PK.toString());
    const void_direct_debit_cancellation = document.getElementById("void_direct_debit_cancellation_" + rateInfo.propertyInfo.assessment_PK.toString());
    const authorise_direct_debit_cancellation = document.getElementById("authorise_direct_debit_cancellation_" + rateInfo.propertyInfo.assessment_PK.toString());
    var void_direct_debit_cancellation_error = document.getElementById("void_direct_debit_cancellation_error_" + rateInfo.propertyInfo.assessment_PK.toString());
    var cancel_dd_btn_group = document.getElementById("cancel_dd_btn_group_" + rateInfo.propertyInfo.assessment_PK.toString());
    var confirm_direct_debit_cancellation_contents = confirm_direct_debit_cancellation ? (confirm_direct_debit_cancellation as HTMLInputElement).innerHTML : "";

    // user voids the direct debit cancellation
    const voidDirectDebitCancellation = () => {
        if (cancel_direct_debit) {
            setIsCancelDDChecked("dcc-hidden");
            (cancel_direct_debit as HTMLInputElement).checked = false;
        }
    }

    const voidDirectDebitCancellationError = () => {
        if (cancel_direct_debit) {
            setIsCancelDDChecked("dcc-hidden");
            (cancel_direct_debit as HTMLInputElement).checked = false;
            (authorise_direct_debit_cancellation as HTMLInputElement).classList.remove("dcc-hidden");
            (authorise_direct_debit_cancellation as HTMLInputElement).disabled = false;
            (confirm_direct_debit_cancellation as HTMLInputElement).innerHTML = confirm_direct_debit_cancellation_contents;
            (void_direct_debit_cancellation_error as HTMLInputElement).classList.add("dcc-hidden");
            (void_direct_debit_cancellation as HTMLInputElement).classList.remove("dcc-hidden")
        }
    }


    // user authorise the direct debit cancellation
    const authoriseDirectDebitCancellation = () => {

        if (creating_direct_debit_cancellation_rfs && confirm_direct_debit_cancellation && authorise_direct_debit_cancellation && void_direct_debit_cancellation && void_direct_debit_cancellation_error) {
            (creating_direct_debit_cancellation_rfs as HTMLInputElement).classList.add("dcc-loading");
            (authorise_direct_debit_cancellation as HTMLInputElement).disabled = true;
            (void_direct_debit_cancellation as HTMLInputElement).disabled = true;
            (authorise_direct_debit_cancellation as HTMLInputElement).innerHTML = "Creating RFS...";


            // delay the api call for 2 seconds t oshoe the loading icon 
            timeoutId = setTimeout(() => {
                CreateRateRFS(rateInfo, account, cancelDDRequest, null).then((res) => {
                    (creating_direct_debit_cancellation_rfs as HTMLInputElement).classList.remove("dcc-loading");
                    (void_direct_debit_cancellation as HTMLInputElement).disabled = false;
                    (authorise_direct_debit_cancellation as HTMLInputElement).innerHTML = "Yes, proceed";
                    if (res != 0) {
                        // valid response 
                        setCancelDDRFS(res);
                        // hie the button 
                        setIsCancelDDChecked("dcc-hidden");
                        (cancel_dd_btn_group as HTMLInputElement).classList.add("dcc-hidden")
                    }
                    // invalid response 
                    else {

                        (authorise_direct_debit_cancellation as HTMLInputElement).classList.add("dcc-hidden");
                        const htmlContent = `
                            <div class="dcc-alert-without-border dcc-text-errorRed" style="align-items:flex-start;">
                            <p>There was an issue creating a request for support. Please refresh your browser and try again. If the issue persists, please contact DCC at <a href="dcc@dcc.govt.nz">dcc@dcc.govt.nz</a> or call <a href="tel:+6434774000">+64 3 477 4000</a> for support.</p>
                            </div>
                        `;
                        (confirm_direct_debit_cancellation as HTMLInputElement).innerHTML = htmlContent;
                        (void_direct_debit_cancellation_error as HTMLInputElement).classList.remove("dcc-hidden");
                        (void_direct_debit_cancellation as HTMLInputElement).classList.add("dcc-hidden")
                    }
                });
            }, 2000);

        }
    }

    useEffect(() => {
        // Clear the timeout when the component unmounts
        return () => clearTimeout(timeoutId);
    }, []);

    return (


        <section className="dcc-relative dcc-pt-6">
            <div className="dcc-flex dcc-items-center dcc-justify-between dcc-pb-3">
                <h3>Direct Debit</h3>
            </div>
            {
                rateInfo && rateInfo.directDebits ?
                    <>
                        {
                            rateInfo.status == "OK" ?
                                <>
                                    <div className="sp-grid-layout">
                                        <div
                                            className="dcc-grid dcc-grid-cols-1 md:dcc-grid-cols-3 sp-grid-bottom-border dcc-py-4 dcc-items-center dcc-gap-4 md:dcc-gap-3 2xl:dcc-gap-0 2xl:dcc-max-w-[60%]">
                                            <p className="dcc-font-bold dcc-text-base">Frequency</p>
                                            <p className="dcc-font-normal dcc-text-base md:dcc-col-span-2">{rateInfo.directDebits.frequency ? rateInfo.directDebits.frequency : "-"}</p>
                                        </div>
                                        <div
                                            className="dcc-grid dcc-grid-cols-1 md:dcc-grid-cols-3 sp-grid-bottom-border dcc-py-4 dcc-items-center dcc-gap-4 md:dcc-gap-3 2xl:dcc-gap-0 2xl:dcc-max-w-[60%]">
                                            <p className="dcc-font-bold dcc-text-base">Amount</p>
                                            <p className="dcc-font-normal dcc-text-base md:dcc-col-span-2">{(rateInfo.directDebits.amount && Number(rateInfo.directDebits.amount) != 0) ? (isNaN(Number(rateInfo.directDebits.amount)) ? rateInfo.directDebits.amount : "$" + Number(rateInfo.directDebits.amount).toFixed(2)) : "$" + "0.00"}</p>
                                        </div>
                                        <div
                                            className="dcc-grid dcc-grid-cols-1 md:dcc-grid-cols-3 sp-grid-bottom-border dcc-py-4 dcc-items-center dcc-gap-4 md:dcc-gap-3 2xl:dcc-gap-0 2xl:dcc-max-w-[60%]">
                                            <p className="dcc-font-bold dcc-text-base">Last payment Received</p>
                                            <p className="dcc-font-normal dcc-text-base md:dcc-col-span-2">{rateInfo.lastPaymentReceived ? format(rateInfo.lastPaymentReceived, "dd/MM/yyyy") : "-"}</p>
                                        </div>


                                        {
                                            !!cancelDDRFS && cancelDDRFS > 0 ? <><div className="dcc-alert dcc-border-alertSuccessBorder dcc-bg-alertSuccessBackground dcc-text-alerSuccess dcc-mt-6"><p className="dcc-col-span-2 dcc-w-[80%] dcc-text-pretty dcc-mb-0"><strong>Request Number: {cancelDDRFS}</strong><br />
                                                <em className="dcc-text-sm">(Your Direct Debit Cancellation request has been created)</em></p></div></> :
                                                <>
                                                    <div className="2xl:dcc-flex dcc-items-center dcc-gap-2 xl:dcc-gap-0 dcc-pt-5" id={`${"cancel_dd_btn_group_"}${rateInfo.propertyInfo.assessment_PK.toString()}`}>
                                                        <button type="button" className="action-button gainsboro-action-button" id={`${"cancel_direct_debit_"}${rateInfo.propertyInfo.assessment_PK.toString()}`} onClick={() => triggerDDCheckbox()}
                                                        >Cancel Direct Debit</button>
                                                        <p className="dcc-font-bold dcc-text-base has-hint"><span
                                                            className="hint-tooltip hint--right"
                                                            aria-label="Direct debit will be cancelled within two working days.">
                                                            <em className="user-tip"></em>
                                                        </span></p>
                                                        <p className="dcc-pt-3 dcc-mb-0 dcc-text-sm 2xl:dcc-hidden dcc-italic"><b>Hint: </b>Direct debit will be cancelled within two working days.</p>
                                                    </div>
                                                    <div className="dcc-flex dcc-items-center dcc-h-0">
                                                        <label className="dcc-checkbox-label dcc-pl-8 dcc-my-4"></label>

                                                        <div className={`${"confirm-user-action-wrapper"} ${isCancelDDChecked}`}>
                                                            <div className="confirm-user-action-container">
                                                                <div id={`${"creating_direct_debit_cancellation_rfs_"}${rateInfo.propertyInfo.assessment_PK.toString()}`}>
                                                                    <h3 className="dcc-pb-3 dcc-text-left">Direct Debit Cancellation</h3>
                                                                    <div className="dcc-relative" id={`${"confirm_direct_debit_cancellation_"}${rateInfo.propertyInfo.assessment_PK.toString()}`} key="confirm_direct_debit_cancellation">
                                                                        <p>Proceeding with this request will terminate the Direct Debit. Please only initiate this cancellation when convenient for your client.</p>
                                                                        <p>If there is a direct debit payment within the next two working days, you will need to check the portal again to see whether or not that payment occurred.</p>
                                                                        <p> Are you sure you want to continue with this request?</p>
                                                                    </div>
                                                                </div>

                                                                <div className="confirm-user-action-btn">
                                                                    <button type="button" id={`${"void_direct_debit_cancellation_error_"}${rateInfo.propertyInfo.assessment_PK.toString()}`} className="dcc-hidden action-button green-action-button" onClick={voidDirectDebitCancellationError}>Close</button>
                                                                    <button type="button" id={`${"void_direct_debit_cancellation_"}${rateInfo.propertyInfo.assessment_PK.toString()}`} className="dcc-underline" onClick={voidDirectDebitCancellation}>Back</button>
                                                                    <button type="button" id={`${"authorise_direct_debit_cancellation_"}${rateInfo.propertyInfo.assessment_PK.toString()}`} className="action-button danger-action-button" onClick={authoriseDirectDebitCancellation}>Continue</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                        }
                                    </div>
                                </> :
                                <>
                                    <div className="dcc-relative dcc-pt-3">
                                        <p>We have Direct debit found</p>
                                        <p>Do you want to cancel the Direct Debit as part of request?</p>

                                        <div className="dcc-w-full dcc-relative">
                                            <div className="dcc-grid dcc-grid-cols-4 dcc-font-normal dcc-text-base dcc-h-4">
                                                <div className="dcc-relative dcc-flex">
                                                    <input type="radio" aria-label="Cancel the Direct Debit as part of request" name="cancelDirectDebit" id={`${"cancelDirectDebitYes_"}${rateInfo.propertyInfo.assessment_PK.toString()}`} onChange={triggerDDCheckbox} />
                                                    <label htmlFor={`${"cancelDirectDebitYes_"}${rateInfo.propertyInfo.assessment_PK.toString()}`} className="dcc-pl-8 dcc-mt-1">Yes</label>
                                                </div>
                                                <div className="dcc-relative dcc-flex">
                                                    <input type="radio" aria-label="Don't cancel the Direct Debit as part of request" name="cancelDirectDebit" id={`${"cancelDirectDebitNo_"}${rateInfo.propertyInfo.assessment_PK.toString()}`} onChange={triggerDDCheckbox} />
                                                    <label htmlFor={`${"cancelDirectDebitNo_"}${rateInfo.propertyInfo.assessment_PK.toString()}`} className="dcc-pl-8 dcc-mt-1">No</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                        }
                    </>
                    :
                    <p className="dcc-mb-0">There is no direct debit on this account. If the rates are paid by automatic payment, please ask the customer to cancel it.</p>
            }


        </section>


    )
}
