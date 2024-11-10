/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
'use client';
import Header from '@/components/Header'
import { useEffect, useState } from 'react';
import { useMsal } from '@azure/msal-react';
import { GetRates } from '@/app/api/getRates';
import PropertyInformation from '@/components/PropertyInformation';
import { deleteCookie, setCookie } from 'cookies-next';

export default function Information(props: pages) {
  const { instance, accounts } = useMsal();
  const activeAccount = accounts[0]?.idTokenClaims as LoggeduserBasicDetails;

  //resetting the idtoken if there is an inactivity
  instance.acquireTokenSilent({
    account: accounts[0],
    scopes: []
  }).then((res) => {
    setCookie('token', res.idToken);
  }).catch((error) => {
    console.log("Error on retreiving token")
  });
  const handleLogoutRedirect = () => {
    deleteCookie('token');
    instance.logoutRedirect();
  };


  // input field error 
  const [inputFieldError, setInputFieldError] = useState("")
  // toggle rates search
  const [isToggleActive, setIsToggleActive] = useState(false);
  // toggle rates search option
  const [isActiveOption, setIsActiveOption] = useState(1);
  //use state of rate info
  const [rateInfo, setRateInfo] = useState<RatesInfo[]>();
  // rates search field placeholder
  const [ratesLookupPlaceholder, setRatesLookupPlaceholder] = useState("e.g., 50 The Octagon")
  const [rateInformationFlag, setMyRateInformationFlag] = useState(false);
  const [isValidRateInfo, setIsValidRateInfo] = useState(true);
  const [isEmptyPropertyReturn, setIsEmptyPropertyReturn] = useState(false);
  const [propertyHasPenalty, setPropertyHasPenalty] = useState(false);
  const [pageStatus, setPageStatus] = useState(null);

  // handle the search dropdown
  const toggleRatesSearch = ({ status }: { status: boolean }) => {
    setIsToggleActive(status)
  }

  // handle class name change for wrapper 
  const toggleRatesSearchWrapper = () => {
    if (isToggleActive) return "active";
    else return "";
  };

  // handle click event of dropsown option
  const toggleRatesSearchOption = ({ option }: { option: number }) => {
    setIsActiveOption(option)
    setIsToggleActive(!isToggleActive) // close popup

    // change inner html contents 
    const ratesSearchHtml = document.getElementById('rates-search-option');
    const ratesSearchAddress = document.getElementById('address');
    const ratesSearchValidation = document.getElementById('validation');

    if (ratesSearchHtml && ratesSearchAddress && ratesSearchValidation) {
      const ratesSearchAddressContent = ratesSearchAddress.innerHTML;
      const ratesSearchValidationContent = ratesSearchValidation.innerHTML;

      if (option == 1) {
        ratesSearchHtml.innerHTML = ratesSearchAddressContent
        setRatesLookupPlaceholder("e.g., 50 The Octagon")
      }
      else if (option == 2) {
        ratesSearchHtml.innerHTML = ratesSearchValidationContent
        setRatesLookupPlaceholder("e.g., 12345-67890")
      }

      resetRatesSearchForm({ toggleRatesSearch: false });
    }

  }
  const [showInList, setShowInList] = useState(false)
  // function toggleShowInList() {
  //   setShowInList(false)
  // }

  /**
   * Fuction to change the dopdown option disabled class
   * @param option
   * @returns String|null
   */
  const toggleRatesSearchOptionDisabled = ({ option }: { option: number }) => {
    if (isActiveOption == option) return "disabled";
    else return "";
  };

  /**
   * Function triggered on form reset
   */
  const resetRatesSearchForm = ({ toggleRatesSearch = true }: { toggleRatesSearch: boolean }) => {
    // restore actions 
    if (toggleRatesSearch) {
      toggleRatesSearchOption({ option: 1 });
      props.refresh();
    }

    setIsValidRateInfo(true);
    setRateInfo(undefined);
    setInputFieldError("");
    setIsToggleActive(false);
    let rates_lookup = document.getElementById("rates_lookup");
    if (rates_lookup) {
      (rates_lookup as HTMLInputElement).value = "";
      (rates_lookup as HTMLInputElement).focus();
    }

  }

  const handleOnFormSubmit = async (e: React.FormEvent<HTMLFormElement>, isActiveOption: number) => {

    e.preventDefault();

    let rates_lookup = document.getElementById("rates_lookup");
    let searchBtn = document.getElementById("rates-lookup-search");

    // get the search value
    let rates_lookup_val = (rates_lookup as HTMLInputElement).value;

    if (!rates_lookup_val) {
      setInputFieldError(isActiveOption == 1 ? "Please enter an address to look up rates." : (isActiveOption == 2 ? "Please enter an validation number to look up rates." : "Please enter an legal description to look up rates."));
      return;
    }

    setIsValidRateInfo(true);

    //rateInfo response from API
    let rateInfo = undefined;
    setRateInfo(rateInfo);

    if (searchBtn && rates_lookup) {

      // loading animation
      searchBtn.innerHTML = "<div class='submit-btn-loading'></div>";
      var searchBtnDisabled = searchBtn as HTMLButtonElement;
      searchBtnDisabled.disabled = true;
      try {
        if (rates_lookup_val && isActiveOption) {

          setInputFieldError(""); // reset error messages 

          // get the api response 
          const response = await GetRates(isActiveOption, rates_lookup_val);
          rateInfo = await response.json();
        }

        // if the response is ok
        searchBtnDisabled.disabled = false;
        searchBtn.innerHTML = "Search";
        setRateInfo(rateInfo);
        if (rateInfo.length > 0) {
          setMyRateInformationFlag(true);
        }
        if (rateInfo.length > 1) {
          setShowInList(true);
        }
        if (rateInfo) {
          if (('status' in rateInfo)) {
            setIsValidRateInfo(true);
          }
          else if (rateInfo.length == 0) {
            setIsEmptyPropertyReturn(true);
            setIsValidRateInfo(false);
          }

          // if there is no response 
          else if (('error' in rateInfo)) {
            setIsValidRateInfo(false);
          }

        }
      }
      catch (e) {
        searchBtnDisabled.disabled = false;
        searchBtn.innerHTML = "Search";
        setIsValidRateInfo(false);
      }
    }

  }

  const showHidePrpertyData = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    var addressData = event.currentTarget.dataset.address;
    var propertyData = document.querySelectorAll(".dcc-property-data");
    const propertyDataArray = Array.from(propertyData);
    var propertyList = document.querySelectorAll(".dcc-property-list");
    const propertyListArray = Array.from(propertyList);
    if (typeof addressData !== "undefined" || addressData != null) {
      var wrapper = document.getElementById("property_" + addressData);
      var information = document.getElementById("property_address_data_" + addressData);
      if (wrapper && information) {
        propertyDataArray.forEach((property) => {
          property.classList.add("dcc-hidden");
        });

        propertyListArray.forEach((property) => {
          property.classList.add("dcc-hidden");
        });

        information.classList.remove("dcc-hidden");
        var currentProperty = document.getElementById("property_" + addressData);
        if (currentProperty) {
          currentProperty.classList.remove("dcc-hidden");
          currentProperty.classList.add("remove-border");
        }
      }
    }
    setShowInList(false)
  }

  const hidePropertyData = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    var propertyData = document.querySelectorAll(".dcc-property-data");
    const propertyDataArray = Array.from(propertyData);
    var propertyList = document.querySelectorAll(".dcc-property-list");
    const propertyListArray = Array.from(propertyList);

    propertyDataArray.forEach((property) => {
      property.classList.add("dcc-hidden");
    });

    propertyListArray.forEach((property) => {
      property.classList.remove("dcc-hidden");
      property.classList.remove("remove-border");
    });

    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }
    setShowInList(true)
  }

  // Track state change from Navbar compnoent
  useEffect(() => {
    //setPageStatus(props.status);
    if (props.status == false) {
      resetRatesSearchForm({ toggleRatesSearch: true });
    }
  }, [props.status]);


  return (

    <>
      {/* Hero container  */}
      {/* <Header title={rateInformationFlag ? (rateInformation?.status == "OK" ? 'Rates Information' : 'Rates search - Interupt') : 'Rates search'} /> */}
      <Header title={rateInformationFlag ? (rateInfo && rateInfo.length == 1 && rateInfo[0]?.status == "OK" ? 'Rates Search - Information' : (rateInfo && rateInfo.length == 1 && rateInfo[0]?.status != "OK" ? 'Rates Search - Interrupt' : (rateInfo && rateInfo.length > 0 ? 'Rates Search - Information' : 'Rates Search'))) : "Rates Search"} />

      {/* Body container */}
      <div className="dcc-relative dcc-p-6 md:dcc-p-12 xl:dcc-p-24">
        {
          // !rateInformationFlag ?
          //   (
          <>

            <div className="dcc-flex dcc-items-center dcc-justify-between dcc-pb-6">
              <h2>Rates Search {pageStatus}</h2>
              <a href="#" onClick={() => handleLogoutRedirect()} className="dcc-signout"><span>Sign out</span></a>
            </div>

            <div className="dcc-relative">
              <div className="dcc-grid xl:dcc-grid-cols-4 3xl:dcc-grid-cols-2 dcc-gap-5">
                <form className="dcc-relative xl:dcc-col-span-3 3xl:dcc-col-span-1" method="post" onSubmit={(e) => handleOnFormSubmit(e, isActiveOption)} onReset={() => resetRatesSearchForm({ toggleRatesSearch: false })}>
                  {/* Input field */}
                  <div className="dcc-flex dcc-flex-col dcc-basis-2/4">
                    <label className="dcc-font-bold dcc-text-lg" style={{ width: "max-content" }} onMouseOver={() => toggleRatesSearch({ status: true })} onMouseOut={() => toggleRatesSearch({ status: false })}>
                      <div className={`${"dcc-rates-lookup-dropdown-wrapper"} ${toggleRatesSearchWrapper()}`} id="rates-search-option"><svg xmlns="http://www.w3.org/2000/svg" width="24"
                        viewBox="0 0 24 24" id="home">
                        <path fill="#0B7A7D"
                          d="M21.66,10.25l-9-8a1,1,0,0,0-1.32,0l-9,8a1,1,0,0,0-.27,1.11A1,1,0,0,0,3,12H4v9a1,1,0,0,0,1,1H19a1,1,0,0,0,1-1V12h1a1,1,0,0,0,.93-.64A1,1,0,0,0,21.66,10.25ZM13,20H11V17a1,1,0,0,1,2,0Zm5,0H15V17a3,3,0,0,0-6,0v3H6V12H18ZM5.63,10,12,4.34,18.37,10Z">
                        </path>
                      </svg>Search by address</div>
                      <ul className="dcc-rates-lookup-dropdown">
                        <li className={`${"dcc-rates-lookup-dropdown-option"} ${toggleRatesSearchOptionDisabled({ option: 1 })} `} onClick={() => toggleRatesSearchOption({ option: 1 })} id="address"><svg xmlns="http://www.w3.org/2000/svg" width="24"
                          viewBox="0 0 24 24" id="home">
                          <path fill="#0B7A7D"
                            d="M21.66,10.25l-9-8a1,1,0,0,0-1.32,0l-9,8a1,1,0,0,0-.27,1.11A1,1,0,0,0,3,12H4v9a1,1,0,0,0,1,1H19a1,1,0,0,0,1-1V12h1a1,1,0,0,0,.93-.64A1,1,0,0,0,21.66,10.25ZM13,20H11V17a1,1,0,0,1,2,0Zm5,0H15V17a3,3,0,0,0-6,0v3H6V12H18ZM5.63,10,12,4.34,18.37,10Z">
                          </path>
                        </svg>Search by address</li>
                        <li className={`${"dcc-rates-lookup-dropdown-option"} ${toggleRatesSearchOptionDisabled({ option: 2 })} `} onClick={() => toggleRatesSearchOption({ option: 2 })} id="validation"><svg xmlns="http://www.w3.org/2000/svg" width="24"
                          viewBox="0 0 24 24" id="file-check">
                          <path fill="#0B7A7D"
                            d="M20,8.94a1.31,1.31,0,0,0-.06-.27l0-.09a1.07,1.07,0,0,0-.19-.28h0l-6-6h0a1.07,1.07,0,0,0-.28-.19.32.32,0,0,0-.09,0A.88.88,0,0,0,13.05,2H7A3,3,0,0,0,4,5V19a3,3,0,0,0,3,3H17a3,3,0,0,0,3-3V9S20,9,20,8.94ZM14,5.41,16.59,8H15a1,1,0,0,1-1-1ZM18,19a1,1,0,0,1-1,1H7a1,1,0,0,1-1-1V5A1,1,0,0,1,7,4h5V7a3,3,0,0,0,3,3h3Zm-3.71-6.71L11,15.59l-1.29-1.3a1,1,0,0,0-1.42,1.42l2,2a1,1,0,0,0,1.42,0l4-4a1,1,0,0,0-1.42-1.42Z">
                          </path>
                        </svg> Search by valuation number</li>
                      </ul>
                    </label>
                    <div className="dcc-w-full dcc-relative dcc-editicon dcc-pt-1">
                      <input type="text"
                        aria-label="Rates search"
                        name="search"
                        placeholder={ratesLookupPlaceholder}
                        id="rates_lookup"
                        aria-required="true"
                      />
                      <div aria-hidden="true" aria-live="polite" className="dcc-sr-only">
                        <p>This input field is used for looking up rates.</p>
                        <p>It is labeled as "Rates search" and is required.</p>
                      </div>
                    </div>

                    {!!inputFieldError && (inputFieldError.length > 0) ? <div className="dcc-alert-without-border dcc-text-errorRed" style={{ padding: '5px', paddingBottom: '0px' }} id="rates_lookup_input_error">
                      {inputFieldError}
                    </div> : <></>}
                  </div>
                  {/* Action Buttons */}
                  <div className="dcc-relative dcc-flex dcc-items-start dcc-gap-3 dcc-pt-4">
                    <input type="reset" value="Reset" />
                    <button type="submit" name="submit" id="rates-lookup-search" style={{ minWidth: "140px" }}>Search</button>
                  </div>
                </form>
              </div>

              {!isValidRateInfo ? <>
                <div className="dcc-relative has-list-items">
                  {
                    isEmptyPropertyReturn ?
                      <>
                        <div className="dcc-alert dcc-border-alertDangerBorder dcc-bg-alertDangerBackground dcc-text-alertDanger">
                          <p>No property found matching your results, please try again!</p>
                        </div>
                      </> :
                      <>
                        <div className="dcc-alert dcc-border-alertDangerBorder dcc-bg-alertDangerBackground dcc-text-alertDanger">
                          <p>There was an error searching the property, please try again</p>
                        </div>
                      </>
                  }

                  <p className='dcc-pt-5'><strong>You can also contact us at:</strong></p>
                  <ul>
                    <li>
                      <a href="tel:+6434774000">+64 3 477 4000</a>
                    </li>

                    <li><a href="mailto:dcc@dcc.govt.nz">dcc@dcc.govt.nz</a>
                    </li>
                  </ul>
                  <div>
                  </div>
                </div>
              </> : <></>}
            </div>
          </>
          // )
          // : (<>
          // </>)
        }
        <>
          {
            rateInfo && rateInfo.length > 1 ?
              <>

                {/* Show Address */}
                <div className="sp-grid-top-border">

                  {showInList ?
                    <div>

                      {/* More than one address */}
                      <article className="dcc-alert dcc-border-alertWarningBorder dcc-bg-alertWarningBackground dcc-text-alertWarning dcc-my-6">
                        We found {rateInfo?.length} properties based on your search. Please choose the right one and search rates
                      </article>
                    </div>
                    : ''}

                  {
                    rateInfo &&
                      rateInfo.length > 0 ?
                      rateInfo.map((rateInformation) =>
                        <>
                          {
                            !!rateInformation ? (
                              (!("error" in rateInformation)) ? (
                                <div className="dcc-relative dcc-property-list" id={`${"property_"}${rateInformation.propertyInfo.assessment_PK.toString()}`}>
                                  <div className="dcc-relative" onClick={showHidePrpertyData} data-address={`${rateInformation.propertyInfo.assessment_PK.toString()}`}><h4>{rateInformation.propertyInfo.address} ({rateInformation.propertyInfo.status})</h4></div>
                                  <div className="dcc-relative dcc-hidden dcc-property-data" id={`${"property_address_data_"}${rateInformation.propertyInfo.assessment_PK.toString()}`}>
                                    <p className="dcc-pb-3" style={{ textDecoration: "none" }} onClick={hidePropertyData}>&#10094; Back</p>
                                    <PropertyInformation resetFun={resetRatesSearchForm} showInList={true} rateInfo={rateInformation} account={activeAccount} triggerLogout={undefined} futureRateRequested={false} />
                                  </div>
                                </div>
                              ) : ''
                            ) : <></>
                          }
                        </>
                      ) : ""
                  }
                </div>
              </> : <></>
          }

          {
            rateInfo &&
              rateInfo.length == 1 ?
              rateInfo.map((rateInformation) =>
                <>
                  {
                    !!rateInformation ?
                      ((!("error" in rateInformation)) ? <PropertyInformation resetFun={resetRatesSearchForm} showInList={false} rateInfo={rateInformation} account={activeAccount} triggerLogout={undefined} futureRateRequested={false} /> : <></>)
                      : <>
                        <div className="dcc-relative has-list-items">
                          <div className="dcc-alert dcc-border-alertDangerBorder dcc-bg-alertDangerBackground dcc-text-alertDanger">
                            <p>There were some errors in fetching the property data, please try again!!!</p>
                            <p></p>
                          </div>
                          <p className='dcc-pt-5'><strong>You can also contact us at:</strong></p>
                          <ul>
                            <li>
                              <a href="tel:+6434774000">+64 3 477 4000</a>
                            </li>

                            <li><a href="mailto:dcc@dcc.govt.nz">dcc@dcc.govt.nz</a>
                            </li>
                          </ul>
                        </div>
                      </>
                  }
                </>) : ''
          }
        </>
      </div >
    </>

  );

}