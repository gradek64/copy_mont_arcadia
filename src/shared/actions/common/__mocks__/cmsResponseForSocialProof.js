export default {
  page: {
    pageData: [
      {
        options: {
          descendants: [
            {
              type: 'row',
              options: {
                descendants: [
                  {
                    type: 'column',
                    options: {
                      descendants: [
                        {
                          type: 'socialProof',
                          options: {
                            images: {
                              PLP: {
                                desktop: 'plpSocialProofDesktop',
                                mobile: 'plpSocialProofMobile',
                              },
                              orderProduct: {
                                desktop: 'orderProductSocialProofDesktop',
                                mobile: 'orderProductSocialProofMobile',
                              },
                            },
                          },
                        },
                      ],
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    ],
  },
}
