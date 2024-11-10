import { NextResponse } from "next/server";
import { getCookie } from 'cookies-next';

const DATA_SOURCE_URL = process.env.DotNetAppURL;



export async function GetRates(isActiveOption: number, searchValue: string) {
    const token = getCookie('token');

    let searchType: string = 'propertyAddress';
    switch (isActiveOption) {
        case 1: {
            searchType = "propertyAddress";
            break;
        }
        case 2: {
            searchType = "valuationReference";
            break;
        }
        default: {
            searchType = "propertyAddress";
        }
    }

    const res = await fetch(DATA_SOURCE_URL + "/ratesapi/" + searchType + "/" + searchValue, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (res.status == 200) {
        let rateInfo: RatesInfo[] = await res.json();
        if (rateInfo.length > 0) {
            return NextResponse.json(rateInfo);
        } else {
            return NextResponse.json([])
        }
    }
    return NextResponse.json({ "error": "No matching records found, please try again" });
}