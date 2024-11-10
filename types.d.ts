type LoggeduserBasicDetails = {
    acr: string,
    aud: string,
    auth_time: number,
    email: string,
    extension_CompanyName: string,
    extension_IsB2BCustomer: boolean,
    extension_termsOfUseConsentDateTime: number,
    family_name: string,
    given_name: string
}

type RatesInfo = {
    ratingDetailsDate: Date,
    rateReferenceId: number,
    propertyInfo:
    {
        address: string,
        valuationNumber: string,
        legalDescription: string,
        assessment_PK: number,
        propertyTPK: number,
        status: string,
    },
    ratePayers: {
        name: string,
    }[],
    annualRateAmount: number,
    instalments: {
        amount: number,
        balance: number,
        date: Date,
        description: string,
        dueDate: Date,
        penalty?: number,
        total: number
    }[],
    penaltyWaiver: {
        date: Date,
        amount: number
    }[],
    currentBalance: number,
    totalClearBalance: number,
    directDebits: {
        frequency: string,
        amount: number | string
    },
    lastPaymentReceived: Date,
    waterRates: boolean,
    waterAssessmentTPK?: number,
    deceasEstate: boolean,
    status: string,
    settlementDate?: Date | null,
    finalWaterReadingDate?: Date | string | null,
    futureRates: {
        showRID: boolean,
        total?: number,
        rates?: {
            description: string,
            factor: number,
            rate: number,
            amount: number
        }[]
    }
}

type pages = {
    refresh: any,
    status: any
}

type props = {
    resetFun: any,
    showInList: boolean,
    rateInfo: RatesInfo,
    account: LoggeduserBasicDetails,
    triggerLogout: any,
    futureRateRequested: boolean
}

type RFSInformation = {
    rfsTypeCode: string,
    receivingOfficerUserName: string,
    actioningOfficerUserName?: string,
    noteSummary: string
}


type ModuleLinks = {
    moduleLinkRoleType: string,
    moduleLinkId: number
}

type Questionnaire = {
    nameCode: string;
    questions: {
        question: string,
        answer: string | Date
    }[]
}
type Reference = {
    name: string,
    value: string
}

type RfsResponse = {
    id: string,
    requestNumber: string
}

type HolidayDateStructure = {
    date: string,
    start: Date,
    end: Date,
    name: string,
    type: string,
    rule: string
}

type SquizData = {
    id: string;
    type: string;
    type_name: string;
    version: string;
    name: string;
    short_name: string;
    status: {
        id: number;
        code: string;
        name: string;
    };
    created: {
        date: string;
        user_id: string;
    };
    updated: {
        date: string;
        user_id: string;
    };
    published: {
        date: string;
        user_id: string;
    };
    status_changed: {
        date: string;
        user_id: string;
    };
    contents: string;
}