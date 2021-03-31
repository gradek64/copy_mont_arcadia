// FOOTER CONFIG FOR DOROTHY PERKINS
// See comments in footer_config/topshop_footer_config.js for an explanation of each section
// ============================================================================================

export const defaultConfig = {
  // Newsletter
  // =================================================================
  newsletter: {
    isVisible: true,
    location: 'TOP_CENTER',
  },

  // Social Links
  // =================================================================
  socialLinks: {
    isVisible: true,
    location: 'TOP_CENTER',
    links: [
      {
        fileName: 'icon-facebook.svg',
        linkUrl: 'https://www.facebook.com/dorothyperkins',
      },
      {
        fileName: 'icon-twitter.svg',
        linkUrl: 'https://twitter.com/dorothy_perkins',
      },
      {
        fileName: 'icon-pinterest.svg',
        linkUrl: 'https://uk.pinterest.com/dorothyperkins',
      },
      {
        fileName: 'icon-instagram.svg',
        linkUrl: 'https://www.instagram.com/dorothyperkins',
      },
      {
        fileName: 'icon-youtube.svg',
        linkUrl: 'http://www.youtube.com/user/OfficialDP',
      },
      {
        fileName: 'icon-theblog.svg',
        linkUrl: 'http://www.dorothyperkins.com/blog/',
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
        fileName: 'visa.svg',
        openNewWindow: false,
        alt: 'Visa',
        linkUrl: '',
      },
      {
        fileName: 'mastercard.svg',
        openNewWindow: false,
        alt: 'Mastercard',
        linkUrl: '',
      },
      {
        fileName: 'maestro.svg',
        openNewWindow: false,
        alt: 'Maestro',
        linkUrl: '',
      },
      {
        fileName: 'dorothyperkinsmastercard.svg',
        openNewWindow: false,
        alt: 'Mastercard',
        linkUrl: '',
      },
      {
        fileName: 'paypal.svg',
        openNewWindow: false,
        alt: 'PayPal',
        linkUrl: '',
      },
    ],

    // Bottom Content - RIGHT SIDE
    // This array can contain image(s) or text
    // =================================================================
    right: [
      {
        fileName: 'verified-by-visa.svg',
        openNewWindow: false,
        alt: 'Verified by Visa',
        linkUrl: '',
      },
      {
        fileName: 'mastercardsecurecode.svg',
        openNewWindow: false,
        alt: 'Mastercard Securecode',
        linkUrl: '',
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

/* =================== region: us =================== */
export const us = {
  ...defaultConfig,
  /*
    --- you can override config here ---
  */
}

/* =================== region: fr =================== */
export const fr = {
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
}

/* =================== region: sg =================== */
export const sg = {
  ...defaultConfig,
  /*
    --- you can override config here ---
  */
}

/* =================== region: my =================== */
export const my = {
  ...defaultConfig,
  /*
    --- you can override config here ---
  */
}

/* =================== region: th =================== */
export const th = {
  ...defaultConfig,
  /*
    --- you can override config here ---
  */
}

/* =================== region: id =================== */
export const id = {
  ...defaultConfig,
  /*
    --- you can override config here ---
  */
}
