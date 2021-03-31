// FOOTER CONFIG FOR TOPMAN
// See comments in footer_config/topshop_footer_config.js for an explanation of each section
// ============================================================================================

export const defaultConfig = {
  // Newsletter
  // =================================================================
  newsletter: {
    isVisible: true, // determine if newsletter will display on page
    location: 'TOP_CENTER', // options are: TOP_CENTER, TOP_RIGHT (CSS classes will apply and change the layout accordingly)
  },

  // Social Links
  // =================================================================
  socialLinks: {
    isVisible: true,
    location: 'BOTTOM_LEFT',
    links: [
      {
        fileName: 'facebook.svg',
        linkUrl: 'http://www.facebook.com/topman',
      },
      {
        fileName: 'twitter.svg',
        linkUrl: 'http://www.twitter.com/topman',
      },
      {
        fileName: 'instagram.svg',
        linkUrl: 'https://www.instagram.com/topman',
      },
      {
        fileName: 'youtube.svg',
        linkUrl: 'https://www.youtube.com/user/topman',
      },
      {
        fileName: 'google-plus.svg',
        linkUrl: 'https://plus.google.com/+Topman',
      },
    ],
  },
  // Bottom Content
  // =================================================================
  bottomContent: {
    left: [
      {
        text: 'Follow us', // this text is translated using `l` from React's context property (see FooterContainter.jsx)
        openNewWindow: false,
        linkUrl: '',
      },
    ],
    right: [
      {
        fileName: 'shop_for_her_uk.svg',
        openNewWindow: true,
        alt: 'Shop For Her At Topshop',
        linkUrl: 'http://www.topshop.com',
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

/* =================== region: us =================== */
export const us = {
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

/* =================== region: de =================== */
export const de = {
  ...defaultConfig,
  /*
    --- you can override config here ---
  */
  bottomContent: {
    left: defaultConfig.bottomContent.left,
    right: [
      {
        fileName: 'shop_for_her_de.svg',
        openNewWindow: true,
        alt: 'Topshop',
        linkUrl: 'https://de.topshop.com',
      },
    ],
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
    right: [
      {
        fileName: 'shop_for_her_fr.svg',
        openNewWindow: true,
        alt: 'Topshop',
        linkUrl: 'https://fr.topshop.com',
      },
      {
        fileName: 'comodo.svg',
        openNewWindow: false,
        alt: 'Comodo Secure',
        linkUrl: null,
      },
    ],
  },
}
