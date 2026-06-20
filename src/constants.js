export const PRODUCTS = [
  { code: 'ult_small', name: 'Unlimited 1GB', price: 24.90 },
  { code: 'ult_medium', name: 'Unlimited 2GB', price: 29.90 },
  { code: 'ult_large', name: 'Unlimited 5GB', price: 44.90 },
  { code: '1gb', name: '1 GB Data-pack', price: 9.90 },
];

export const SCENARIOS = [
  {
    title: 'Scenario 1',
    adds: [['ult_small'], ['ult_small'], ['ult_small'], ['ult_large']],
    expectedTotal: 94.7,
  },
  {
    title: 'Scenario 2',
    adds: [
      ['ult_small'], ['ult_small'],
      ['ult_large'], ['ult_large'], ['ult_large'], ['ult_large'],
    ],
    expectedTotal: 209.4,
  },
  {
    title: 'Scenario 3',
    adds: [['ult_small'], ['ult_medium'], ['ult_medium']],
    expectedTotal: 84.7,
  },
  {
    title: 'Scenario 4',
    adds: [['ult_small'], ['1gb', 'I<3AMAYSIM']],
    expectedTotal: 31.32,
  },
];