// FOOTER CONFIG FOR EVANS
// See comments in footer_config/topshop_footer_config.js for an explanation of each section
// ============================================================================================

export const defaultConfig = {
  // Newsletter
  // =================================================================
  newsletter: {
    isVisible: true,
    location: 'TOP_RIGHT',
  },

  // Social Links
  // =================================================================
  socialLinks: {
    isVisible: true,
    location: 'TOP_LEFT',
    links: [
      {
        fileName: 'facebook.svg',
        linkUrl: 'https://www.facebook.com/Evans/',
      },
      {
        fileName: 'twitter.svg',
        linkUrl: 'https://twitter.com/evansclothing',
      },
      {
        fileName: 'instagram.svg',
        linkUrl: 'https://www.instagram.com/evansclothing/',
      },
      {
        fileName: 'pinterest.svg',
        linkUrl: 'https://www.pinterest.co.uk/evansclothing/',
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
        text: 'Shop securely with us',
        openNewWindow: false,
        linkUrl: null,
      },
      {
        fileName: 'mastercardsecurecode.svg',
        openNewWindow: false,
        alt: 'Mastercard Secure',
        linkUrl: null,
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
        text: 'Download our App', // this text is translated using `l` from React's context property (see FooterContainter.jsx)
        openNewWindow: false,
        linkUrl: null,
      },
      {
        fileName: 'ipad_app.png',
        openNewWindow: false,
        alt: 'iPad App',
        linkUrl:
          'http://www.evans.co.uk/en/evuk/category/evans-on-the-go-2379048/home',
      },
    ],
  },
}

// /* =================== region: uk =================== */
export const uk = {
  ...defaultConfig,
  /*
    --- you can override config here ---
  */
}

// /* =================== region: eu =================== */
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
