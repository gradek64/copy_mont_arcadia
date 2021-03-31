import { mapObjIndexed, fromPairs } from 'ramda'

const ukPostInCodePatten = '[0-9][abd-hjlnp-uw-zABD-HJLNP-UW-Z]{2}'
const ukPostcodePattern = `^ *(([gG][iI][rR] {0,}0[aA]{2})|(([aA][sS][cC][nN]|[sS][tT][hH][lL]|[tT][dD][cC][uU]|[bB][bB][nN][dD]|[bB][iI][qQ][qQ]|[fF][iI][qQ][qQ]|[pP][cC][rR][nN]|[sS][iI][qQ][qQ]|[iT][kK][cC][aA]) {0,}1[zZ]{2})|((([a-pr-uwyzA-PR-UWYZ][a-hk-yxA-HK-XY]?[0-9][0-9]?)|(([a-pr-uwyzA-PR-UWYZ][0-9][a-hjkstuwA-HJKSTUW])|([a-pr-uwyzA-PR-UWYZ][a-hk-yA-HK-Y][0-9][abehmnprv-yABEHMNPRV-Y]))) {0,}${ukPostInCodePatten})) *$`

const defaultRules = {
  pattern: '^ *[\\w ]+$',
  stateFieldType: false,
  postcodeRequired: true,
  postcodeLabel: 'Postal Code',
  premisesRequired: true,
  premisesLabel: 'Street Address',
}

const requiresPostcode = [
  'Albania',
  'Andorra',
  'Anguilla',
  'Argentina',
  'Armenia',
  'Australia',
  'Austria',
  'Azerbaijan',
  'Bangladesh',
  'Barbados',
  'Belgium',
  'Bermuda',
  'Bolivia',
  'Bosnia and Herzegovina',
  'Brazil',
  'Brunei',
  'Bulgaria',
  'Cambodia',
  'Canada',
  'Cayman Islands',
  'Chile',
  'China',
  'Colombia',
  'Croatia',
  'Czech Republic',
  'Denmark',
  'Estonia',
  'Falkland Islands',
  'Faroe Islands',
  'Finland',
  'France',
  'French Guiana',
  'Germany',
  'Greece',
  'Greenland',
  'Guadeloupe',
  'Guernsey',
  'Holy See',
  'Hungary',
  'India',
  'Indonesia',
  'Ireland',
  'Italy',
  'Japan',
  'Jersey',
  'Kazakhstan',
  'Korea South',
  'Kyrgyzstan',
  'Latvia',
  'Libya',
  'Liechtenstein',
  'Lithuania',
  'Luxembourg',
  'Madagascar',
  'Malaysia',
  'Maldives',
  'Marshall Islands',
  'Mexico',
  'Moldova',
  'Monaco',
  'Montenegro',
  'Morocco',
  'Nepal',
  'Netherlands',
  'New Caledonia',
  'New Zealand',
  'Niger',
  'Norway',
  'Oman',
  'Pakistan',
  'Palau',
  'Philippines',
  'Poland',
  'Portugal',
  'Puerto Rico',
  'Romania',
  'S Georgia & S Sandwich Islands',
  'Saint Pierre and Miquelon',
  'Samoa',
  'San Marino',
  'Serbia',
  'Singapore',
  'Slovakia',
  'South Africa',
  'Spain',
  'Sri Lanka',
  'St Vincent and the Grenadines',
  'Svalbard and Jan Mayen',
  'Sweden',
  'Switzerland',
  'Taiwan',
  'Thailand',
  'Togo',
  'Tunisia',
  'Turkey',
  'Turkmenistan',
  'Ukraine',
  'United Kingdom',
  'United States',
  'Uruguay',
  'Vietnam',
  'Virgin Islands British',
]

const specialRules = {
  Australia: {
    pattern: '^ *[0-9]{4} *$',
    stateFieldType: 'input',
    postcodeLabel: 'Postcode',
  },
  Canada: {
    stateFieldType: 'input',
  },
  Denmark: {
    pattern: '^ *[^\\s]*[0-9]{3,4} *$',
  },
  France: {
    pattern: '^ *[0-9]{5} *$',
    postcodeLabel: 'Postcode',
  },
  Germany: {
    pattern: '^ *[0-9]{5} *$',
    postcodeLabel: 'Postcode',
  },
  Guernsey: {
    pattern: `^ *[Gg][Yy]([0-9]|10)[ ]?${ukPostInCodePatten} *$`,
    postcodeLabel: 'Postcode',
    premisesRequired: false,
    premisesLabel: 'House name or number',
  },
  'Hong Kong S.A.R. of China': {
    pattern: '.',
    postcodeRequired: false,
    postcodeLabel: 'Town or Locality',
    premisesRequired: false,
  },
  India: {
    postcodeLabel: 'Postal Index Number',
  },
  Ireland: {
    postcodeRequired: false,
    postcodeLabel: 'Town or Locality',
  },
  Jersey: {
    pattern: `^ *[Jj][Ee]{1,2}[0-5][ ]?${ukPostInCodePatten} *$`,
    postcodeLabel: 'Postcode',
    premisesRequired: false,
    premisesLabel: 'House name or number',
  },
  Malaysia: {
    postcodeLabel: 'Postcode',
  },
  Netherlands: {
    pattern: '^ *[0-9]{4}[\\s][a-zA-Z]{2} *$',
  },
  Philippines: {
    postcodeLabel: 'Zip Code',
  },
  Spain: {
    pattern: '^ *([a-zA-Z]{2}|[0-9]{2})[0-9]{3} *$',
    stateFieldType: 'input',
  },
  Sweden: {
    pattern: '^ *[1-9][0-9]{2}[\\s][0-9]{2} *$',
  },
  Turkey: {
    postcodeLabel: 'Postcode',
  },
  'United Kingdom': {
    pattern: ukPostcodePattern,
    postcodeLabel: 'Postcode',
    premisesRequired: false,
    premisesLabel: 'House number',
  },
  'United States': {
    pattern: '^ *[0-9]{5}(-[0-9]{4}){0,1} *$',
    stateFieldType: 'SELECT',
    postcodeLabel: 'Zip Code',
  },
}

const makeEmptyRules = (countries) =>
  fromPairs(countries.map((country) => [country, {}]))

const mergeDefaults = (defaults) => (i, key, obj) => ({
  ...defaults,
  ...obj[key],
})

const mergeDefaultRules = mapObjIndexed(mergeDefaults(defaultRules))

export default mergeDefaultRules({
  ...makeEmptyRules(requiresPostcode),
  ...specialRules,
})
