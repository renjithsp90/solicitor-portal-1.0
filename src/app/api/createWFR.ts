import { format } from "date-fns";
import { getCookie, setCookie } from 'cookies-next';

const DATA_SOURCE_URL = process.env.DotNetAppURL;

export async function CreateWaterRFS(rateInfo: RatesInfo, loggeduserBasicDetails: LoggeduserBasicDetails) {
    const token = getCookie('token');
    const RFSInformation: RFSInformation = {
        rfsTypeCode: "WFR",
        receivingOfficerUserName: "E-SOL-PORT",
        actioningOfficerUserName: "E-WAT-FIN",
        noteSummary: "Water RFS created through Solicitor Portal"
    }

    const moduleLinks: ModuleLinks[] = [
        {
            moduleLinkRoleType: "Assessment",
            moduleLinkId: Number(rateInfo.waterAssessmentTPK)
        }
    ]
    if (rateInfo.propertyInfo.propertyTPK) {
        moduleLinks.push({
            moduleLinkRoleType: "Incident Property",
            moduleLinkId: rateInfo.propertyInfo.propertyTPK
        })
    };

    const questionnaires: Questionnaire[] = [{
        nameCode: "WFR",
        questions: [{
            question: "Method of Communication",
            answer: "EMAIL"
        },
        {
            question: "Lawyer for settlement",
            answer: loggeduserBasicDetails.given_name + " " + loggeduserBasicDetails.family_name
        },
        {
            question: "Date final reading is required",
            answer: rateInfo.finalWaterReadingDate ? format(rateInfo.finalWaterReadingDate, "yyyy-MM-dd") + "T00:00:00" : ""
        },
        {
            question: "Where to forward the final water notice?",
            answer: loggeduserBasicDetails.email
        }]
    }]

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

        setCookie('WFRRFSNumber', Number(rfsResponse.requestNumber))
        return Number(rfsResponse.requestNumber);
    }
    return 0
}