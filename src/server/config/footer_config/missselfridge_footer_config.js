// FOOTER CONFIG FOR MISS SELFRIDGE
// See comments in footer_config/topshop_footer_config.js for an explanation of each section
// ============================================================================================

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
        fileName: 'facebook.svg',
        linkUrl: 'http://www.facebook.com/missselfridge',
      },
      {
        fileName: 'instagram.svg',
        linkUrl: 'http://www.instagram.com/missselfridge',
      },
      {
        fileName: 'twitter.svg',
        linkUrl: 'http://www.twitter.com/missselfridge',
      },
      {
        fileName: 'pinterest.svg',
        linkUrl: 'http://pinterest.com/missselfridge/',
      },
      {
        fileName: 'snapchat.svg',
        linkUrl: 'https://www.snapchat.com/add/missselfridgehq',
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
        openNewWindow: false,
        linkUrl: null,
      },
      {
        fileName: 'verified-by-visa.svg',
        openNewWindow: false,
        alt: 'Verified by Visa',
        linkUrl: null,
      },
      {
        fileName: 'amex-safekey.svg',
        openNewWindow: false,
        alt: 'Amex SafeKey',
        linkUrl: '',
      },
      {
        fileName: 'mastercardsecurecode.svg', // file name in `/assets/${brandName}/images/footer/${fileName}`
        openNewWindow: false, // define if link should open in new tab
        alt: 'Mastercard Secure', // img alt
        linkUrl: '', // url which user can navigate to if clicked
      },
    ],

    // Bottom Content - RIGHT SIDE
    // This array can contain image(s) or text
    // =================================================================
    right: [],
  },
}

/* =================== region: uk =================== */
export const uk = {
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

/* =================== region: fr =================== */
export const fr = {
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

/* =================== region: eu =================== */
export const eu = {
  ...defaultConfig,
  /*
    --- you can override config here ---
  */
  bottomContent: {
    left: defaultConfig.bottomContent.left,
    right: [],
  },
}
