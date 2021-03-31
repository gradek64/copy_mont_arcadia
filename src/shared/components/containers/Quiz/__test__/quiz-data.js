export default {
  hasQuicklinks: true,
  hasSkips: true,
  name: 'Already know your shape?',
  callout: 'or',
  description:
    "Don't know your shape? Find out now in 2 simple steps with <span class=Quiz-coloredText>our shape calculator</span>",
  questions: [
    {
      title: 'The Shape Calculator',
      description:
        'Tell us about your hip to shoulder ratio. Your shoulders are:',
      options: [
        {
          text: 'Wider than your hips',
          points: 1,
          nextIndex: 1,
        },
        {
          text: 'The same width as your hips',
          points: 50,
          nextIndex: 2,
        },
        {
          text: 'Narrower than your hips',
          points: 100,
          nextIndex: 3,
        },
      ],
    },
    {
      title: 'One more question',
      description: 'Now your bust and waist:',
      options: [
        {
          text: 'Your waist is narrow with a full bust',
          points: 40,
        },
        {
          text: 'Your waist is full with a smaller or fuller bust',
          points: 150,
        },
      ],
    },
    {
      title: 'One more question',
      description: 'Now your bust and waist:',
      options: [
        {
          text: 'Your waist is narrower than your hips and shoulders',
          points: 20,
        },
        {
          text: 'Your waist is wider than your hips and shoulders',
          points: 150,
        },
      ],
    },
    {
      title: 'One more question',
      description: 'Now your bust and waist:',
      options: [
        {
          text: 'Your waist is narrow with a smaller or fuller bust',
          points: 30,
        },
        {
          text: 'Your waist is full with a smaller or fuller bust',
          points: 150,
        },
      ],
    },
  ],
  answers: [
    {
      id: 'busty',
      points: [0, 49],
      name: 'Busty',
      image:
        '/cms/topshop_uk/repository/pages/json/json-0000009840/images/pear-test.png',
      description:
        'You have a full bust with narrower hips and bottom. Create balance with eye catching patterns on your bottom half and show off your waist.',
      listTitle: 'Styles to try:',
      listItems: [
        'Darker colours on top.',
        'A splash of colour or pattern on trousers and skirts.',
        'Wide leg and bootcut jeans.',
        'Empire line or circle skirts with a flare.',
      ],
      link: '/',
      shopText: 'Shop busty',
      retryText: 'Not busty? Discover other shapes >',
    },
    {
      id: 'hourglass',
      points: [50, 99],
      name: 'Hourglass',
      image:
        '/cms/topshop_uk/repository/pages/json/json-0000009840/images/pear-test.png',
      description:
        'You have a defined waist, with a full bust and bottom. Accentuate your narrow waist and perfectly balanced hips and shoulders and celebrate those curves.',
      listTitle: 'Styles to try:',
      listItems: [
        'A fitted dress with low cut or empire line.',
        'Scoop neck and v-neck tops.',
        'Tailored shirts, jackets and coats.',
        'Pencil and bias cut skirts.',
      ],
      link: '/',
      shopText: 'Shop hourglass',
      retryText: 'Not a hourglass? Discover other shapes >',
    },
    {
      id: 'pear',
      points: [100, 149],
      name: 'Pear',
      image:
        '/cms/topshop_uk/repository/pages/json/json-0000009840/images/pear-test.png',
      description:
        'You have curvy hips and bum with a narrower back and shoulders. Create balance by drawing attention to your upper body and creating smooth lines over your lower half.',
      listTitle: 'Styles to try:',
      listItems: [
        'Skater,wrap or empire line dresses.',
        'High necklines,embellishment and ruffles.',
        'Bootcut or wide leg trousers.',
        'A tailored jacket.',
      ],
      link: '/',
      shopText: 'Shop pear',
      retryText: 'Not a pear? Discover other shapes >',
    },
    {
      id: 'apple',
      points: [150, 250],
      name: 'Apple',
      image:
        '/cms/topshop_uk/repository/pages/json/json-0000009840/images/pear-test.png',
      description:
        'Your hips and legs are narrower than your middle When choosing your outfits, aim to focus on your lovely legs and décolletage. And go for flattering draped fabrics that skim over your tummy.',
      listTitle: 'Styles to try:',
      listItems: [
        'V-neck and scoop neck.',
        'Eye-catching jewellery.',
        'Skater,wrap and empire line dresses.',
        'Slim fit and straight leg trousers.',
      ],
      link: '/',
      shopText: 'Shop apple',
      retryText: 'Not an apple? Discover other shapes >',
    },
  ],
}
