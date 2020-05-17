/* eslint-disable max-len */
const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY || '';

export default {

  apiUrl: process.env.API_URL || '',
  uiUrl: process.env.UI_URL || '',
  geoByIpUrl: `${process.env.API_URL}${process.env.GEOBYIP_API_URL}` || '',

  googleMapsApiKey,
  googleMapsApiV3Url: `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&language=ro&v=3.exp&libraries=geometry,drawing,places`,
  googleAnalyticsKey: process.env.ANALYTICS_KEY || '',
  googleLoginClientId: process.env.GOOGLE_LOGIN_CLIENT_ID || '',
  facebookLoginAppId: process.env.FACEBOOK_LOGIN_APP_ID || '',
  socketsApi: process.env.SOCKETS_API || '',
  stripeApiKey: process.env.STRIPE_KEY || '',
  defaultMeta: {},

  formats: {
     dateTime: 'DD-MM-YYYY HH:mm',
     date: 'DD-MM-YYYY',
     time: 'HH:mm',
   },
};
