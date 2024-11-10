import { format } from "date-fns";
import { getCookie, setCookie } from 'cookies-next';

const DATA_SOURCE_URL = process.env.DotNetAppURL;

export async function CreateRateRFS(rateInfo: RatesInfo, loggeduserBasicDetails: LoggeduserBasicDetails, cancelDD: boolean | null, requestForRefinanceOrSale: string | null) {
    const token = getCookie('token');
    const RFSInformation: RFSInformation = {
        rfsTypeCode: "RAT",
        receivingOfficerUserName: "E-SOL-PORT",
        actioningOfficerUserName: rateInfo.status == "WARM_DUNEDIN" ? "E-WRM-DUN" : (rateInfo.status == "ARREARS" ? "E-RAT-ARREARS" : "E-CR-RATES"),
        noteSummary: "Rate RFS from Solicitor portal"
    }
    const moduleLinks: ModuleLinks[] = [
        {
            moduleLinkRoleType: "Assessment",
            moduleLinkId: rateInfo.propertyInfo.assessment_PK
        }
    ];

    //preparing notes based on purpose of sale.
    let additionalNotes = requestForRefinanceOrSale == "Sale" ? ", This request for Sale purposes." :
        requestForRefinanceOrSale == "Refinance" ? ", This request for Refinance purposes only." : ''
    additionalNotes = additionalNotes + ", Laywer email : " + loggeduserBasicDetails.email

    const questionnaires: Questionnaire[] = [{
        nameCode: "RATE", //Subject
        questions: [{
            question: "Subject",
            answer: (cancelDD && (cancelDD != null) && requestForRefinanceOrSale == null) ? "7.OTHER" : "1.SETTLE"
        },
        {
            question: "Lawyer discussions - Name of person CSO spoke to",
            answer: loggeduserBasicDetails.given_name + " " + loggeduserBasicDetails.family_name
        },
        {
            question: "Settlement date",
            answer: rateInfo.settlementDate ? format(rateInfo.settlementDate, "dd/MM/yyy") : ''
        },
        {
            question: "Notes",
            answer: "Email : " + loggeduserBasicDetails.email + additionalNotes
        }]
    }]
    if (cancelDD != null) {
        if (cancelDD) {
            questionnaires.forEach(question => {
                question.questions.push({
                    question: "Cancel DD - effective immediately only",
                    answer: "YES"
                })
            });
        } else {
            questionnaires.forEach(question => {
                question.questions.push({
                    question: "Cancel DD - effective immediately only",
                    answer: "NO"
                })
            });
        }
    }


    //do we need to add cancell DD as seperate request or not.

    const references: Reference[] = [{
        name: "CUSNAM",
        value: loggeduserBasicDetails.given_name + " " + loggeduserBasicDetails.family_name
    }, {
        name: "3.EMAIL",
        value: loggeduserBasicDetails.email
    }]

    const RfsRequestBody = {
        "rfsTypeCode": RFSInformation.rfsTypeCode,
        "receivingOfficerUserName": RFSInformation.receivingOfficerUserName,
        "actioningOfficerUserName": RFSInformation.actioningOfficerUserName,
        "noteSummary": RFSInformation.noteSummary,
        "questionnaires": questionnaires,
        "moduleLinks": moduleLinks,
        "references": references
    }
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(RfsRequestBody)
    };

    const res = await fetch(DATA_SOURCE_URL + "/rfs", requestOptions);
    if (res.status == 200) {
        const rfsResponse: RfsResponse = await res.json();
        setCookie('RATRFSNumber', Number(rfsResponse.requestNumber))
        return Number(rfsResponse.requestNumber);
    }
    return 0;
}