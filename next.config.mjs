/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    DotNetAppURL: process.env.DOT_NET_URL,
    AzureB2CClientID: process.env.AZURE_B2C_CLIENT_ID,
    AzureB2CTenantName: process.env.AZURE_B2C_TENANT_NAME,
    LocalAccSignIn: process.env.LOCAL_ACC_SIGN_IN,
    MaintainceMode: process.env.MAINTENANCE_MODE,
    MaintainceWillStartAt: process.env.MAINTAINCE_WILL_START_AT,
    MaintainceWillFinishAt: process.env.MAINTAINCE_WILL_FINISH_AT,
    MaintainceAlertWindow: process.env.MAINTENANCE_ALERT_WINDOW,
    RateStrikeDate: process.env.RATE_STRIKE_DATE
  },
  async redirects() {
    let redirects;
    if (process.env.MAINTENANCE_MODE === '1') {
      redirects = [{
        source: '/',
        destination: '/maintenance',
        permanent: false
      },
      {
        source: '/solicitor',
        destination: '/maintenance',
        permanent: false
      }, {
        source: '/solicitor/account',
        destination: '/maintenance',
        permanent: false
      }]
    } else {
      redirects = [{
        source: '/',
        destination: '/solicitor/account',
        permanent: false
      }, {
        source: '/maintenance',
        destination: '/solicitor/account',
        permanent: false
      },]
    }
    return redirects.filter(Boolean)
  }
};

export default nextConfig;
