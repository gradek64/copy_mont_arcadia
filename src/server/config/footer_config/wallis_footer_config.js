// FOOTER CONFIG FOR WALLIS
// See comments in footer_config/topshop_footer_config.js for an explanation of each section
// ===========================================================================================

export const defaultConfig = {
  // Newsletter
  // =================================================================
  newsletter: {
    isVisible: true, // determine if newsletter will display on page
    location: 'TOP_RIGHT', // options are: TOP_CENTER, TOP_RIGHT (CSS classes will apply and change the layout accordingly)
  },

  // Social Links
  // =================================================================
  socialLinks: {
    isVisible: true,
    location: 'TOP_LEFT',
    links: [
      {
        fileName: 'SOCIAL_60x60px_INSTAGRAM.svg',
        linkUrl: 'https://www.instagram.com/wallisfashion',
      },
      {
        fileName: 'SOCIAL_60x60px_FACEBOOK.svg',
        linkUrl: 'http://www.facebook.com/Wallis',
      },
      {
        fileName: 'SOCIAL_60x60px_TWITTER.svg',
        linkUrl: 'http://twitter.com/WallisFashion',
      },
      {
        fileName: 'SOCIAL_60x60px_PINTEREST.svg',
        linkUrl: 'https://www.pinterest.com/wallisfashion',
      },
      {
        fileName: 'you_tube__1___1_.svg',
        linkUrl: 'https://www.youtube.com/user/WallisFashionMedia',
      },
    ],
  },

  // Bottom Content
  // =================================================================
  bottomContent: {
    // Bottom Content - LEFT SIDE
    // This array can contain image(s) or text
    // =================================================================
    left: [
      {
        text: 'Shop securely with us', // this text is translated using `l` from React's context property (see FooterContainter.jsx)
        openNewWindow: false, // define if link should open in new tab
        linkUrl: '', // url which user can navigate to if clicked
      },
      {
        fileName: 'mastercardsecurecode.svg', // file name in `/assets/${brandName}/images/footer/${fileName}`
        openNewWindow: false, // define if link should open in new tab
        alt: 'Mastercard Secure', // img alt
        linkUrl: '', // url which user can navigate to if clicked
      },
      {
        fileName: 'verified-by-visa.svg',
        openNewWindow: false,
        alt: 'Verified by Visa',
        linkUrl: null,
      },
    ],

    // Bottom Content - RIGHT SIDE
    // This array can contain image(s) or text
    // =================================================================
    right: [
      {
        text: 'Download our App',
        openNewWindow: false,
        linkUrl:
          'https://www.wallis.co.uk/en/wluk/category/wallis-on-device-4938359/home?TS=1446123082407',
      },
      {
        fileName: 'ipad_app.png',
        openNewWindow: false,
        alt: 'iPad App',
        linkUrl:
          'https://www.wallis.co.uk/en/wluk/category/wallis-on-device-4938359/home?TS=1446123082407',
      },
    ],
  },
}

/* =================== region: uk =================== */
export const uk = {
  ...defaultConfig,
  /*
    --- you can override config here ---
  */
}

/* =================== region: eu =================== */
export const eu = {
  ...defaultConfig,
  /*
    --- you can override config here ---
  */
}

/* =================== region: de =================== */
export const de = {
  ...defaultConfig,
  /*
    --- you can override config here ---
  */
  bottomContent: {
    left: defaultConfig.bottomContent.left,
    right: [],
  },
}

/* =================== region: us =================== */
export const us = {
  ...defaultConfig,
  /*
    --- you can override config here ---
  */
  bottomContent: {
    left: defaultConfig.bottomContent.left,
    right: [],
  },
}
