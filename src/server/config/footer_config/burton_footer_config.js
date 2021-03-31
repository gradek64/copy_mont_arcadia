// FOOTER CONFIG FOR BURTON
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
        fileName: 'instagram.svg',
        linkUrl: 'https://www.instagram.com/burton_menswear/',
      },
      {
        fileName: 'facebook.svg',
        linkUrl: 'https://www.facebook.com/BurtonMenswear',
      },
      {
        fileName: 'twitter.svg',
        linkUrl: 'https://twitter.com/Burton_Menswear?',
      },
      {
        fileName: 'pinterest.svg',
        linkUrl: 'https://uk.pinterest.com/burtonmenswear/',
      },
      {
        fileName: 'googleplus.svg',
        linkUrl: 'https://plus.google.com/+burtons',
      },
      {
        fileName: 'youtube.svg',
        linkUrl: 'https://www.youtube.com/user/BurtonClothing',
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
        linkUrl: '',
      },
      {
        fileName: 'verified-by-visa.svg',
        openNewWindow: false,
        alt: 'Verified by Visa',
        linkUrl: null,
      },
      {
        fileName: 'mastercardsecurecode.svg',
        openNewWindow: false,
        alt: 'Mastercard Secure',
        linkUrl: '',
      },
    ],

    // Bottom Content - RIGHT SIDE
    // This array can contain image(s) or text
    // =================================================================
    right: [
      {
        fileName: 'ipad.svg',
        openNewWindow: false,
        alt: 'iPad app',
        linkUrl:
          'https://www.burton.co.uk/en/bruk/category/burton-menswear-apps-2687851/home?cat2=1596050',
      },
      {
        fileName: 'iphone.svg',
        openNewWindow: false,
        alt: 'iPhone app',
        linkUrl:
          'https://www.burton.co.uk/en/bruk/category/burton-menswear-apps-2687851/home?cat2=1596050',
      },
      {
        text: 'Download the Burton apps',
        openNewWindow: false,
        linkUrl:
          'https://www.burton.co.uk/en/bruk/category/burton-menswear-apps-2687851/home?cat2=1596050',
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
