// FOOTER CONFIG FOR TOPSHOP
// Please see comments besides each property
// =================================================================

/*
For the Newsletter and Social Links, the below 'location' combinations available:
1)  newsletter.location = TOP_CENTER
    socialLinks.location = TOP_CENTER

2)  newsletter.location = TOP_RIGHT
    socialLinks.location = TOP_LEFT

3) newsletter.location = TOP_CENTER
  socialLinks.location = BOTTOM_LEFT
*/

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
    isVisible: true, // determine if social links will display on page
    location: 'BOTTOM_LEFT', // options are: TOP_CENTER, TOP_LEFT, BOTTOM_LEFT (CSS classes will apply and change the layout accordingly)
    links: [
      {
        fileName: 'instagram.svg', // file name in `/assets/${brandName}/images/footer/${fileName}`
        linkUrl: 'https://www.instagram.com/topshop/', // url which user can navigate to if clicked
      },
      {
        fileName: 'facebook.svg', // file name in `/assets/${brandName}/images/footer/${fileName}`
        linkUrl: 'http://www.facebook.com/Topshop', // url which user can navigate to if clicked
      },
      {
        fileName: 'twitter.svg', // file name in `/assets/${brandName}/images/footer/${fileName}`
        linkUrl: 'http://www.twitter.com/topshop', // url which user can navigate to if clicked
      },
      {
        fileName: 'pinterest.svg', // file name in `/assets/${brandName}/images/footer/${fileName}`
        linkUrl: 'http://pinterest.com/topshop/', // url which user can navigate to if clicked
      },
      {
        fileName: 'snapchat.svg', // file name in `/assets/${brandName}/images/footer/${fileName}`
        linkUrl: 'https://www.snapchat.com/add/topshop', // url which user can navigate to if clicked
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
        text: 'Follow us', // define the text you want on the page - this text is translated using `l` from React's context property (see FooterContainter.jsx)
        openNewWindow: false, // define if link should open in new tab
        linkUrl: '', // url which user can navigate to if clicked
      },
    ],

    // Bottom Content - RIGHT SIDE
    // This array can contain image(s) or text
    // =================================================================
    right: [
      {
        fileName: 'shop_for_him_uk.svg', // file name in `/assets/${brandName}/images/footer/${fileName}`
        openNewWindow: true, // define if link should open in new tab
        alt: 'Shop For Him At Topman', // img alt
        linkUrl: 'https://www.topman.com', // url which user can navigate to if clicked
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
        fileName: 'shop_for_him_de.svg',
        openNewWindow: true,
        alt: 'Topman',
        linkUrl: 'https://de.topman.com',
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
        fileName: 'shop_for_him_fr.svg',
        openNewWindow: true,
        alt: 'Topman',
        linkUrl: 'https://fr.topman.com',
      },
    ],
  },
}
