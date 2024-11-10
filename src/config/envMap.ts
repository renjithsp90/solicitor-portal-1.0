export const envVariables = {
    DotNetAppURL: process.env.DotNetAppURL,
    AzureB2CClientID: process.env.AzureB2CClientID,
    AzureB2CTenantName: process.env.AzureB2CTenantName,
    LocalAccSignIn: process.env.LocalAccSignIn,
    MaintainceMode: process.env.MaintainceMode,
    MaintainceWillStartAt: Date.parse(process.env.MaintainceWillStartAt ? process.env.MaintainceWillStartAt : ''),
    MaintainceWillFinishAt: Date.parse(process.env.MaintainceWillFinishAt ? process.env.MaintainceWillFinishAt : ''),
    RateStrikeDate: Date.parse(process.env.RateStrikeDate ? process.env.RateStrikeDate : ''),
    MaintainceAlertWindow: process.env.MaintainceAlertWindow
}