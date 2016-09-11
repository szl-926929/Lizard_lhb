export const SERVICE_NS = {
  'Origin': {
    path:'Hotel',
    code: '10932',
    key: 'Origin'
  },
  'Product': {
    path:'Hotel/Product',
    code: '10933',
    key: 'Product'
  },
  'Booking': {
    path:'Hotel/Booking',
    code: '10935',
    key: 'Booking'
  },
  'Customer': {
    path:'Hotel/Customer',
    code: '10934',
    key: 'Customer'
  },
  'Static': {
    path:'Hotel/Static',
    code: '10936',
    key: 'Static'
  },
  'Inn': {
    path:'Hotel/Inn',
    code: '11390',
    key: 'Inn'
  },
  'OtherBU': {
    path:'Hotel/OtherBU',
    code: '10915',
    key: 'OtherBU'
  },
  'Event': {
    path:'Hotel/Event',
    code: '11126',
    key: 'Event'
  },
  'External_GS': {
    path:'',
    code: '10130',
    key: 'External_GS',
    noSubenv: true,
  },
  'Direct': {
    path:'',
    code: '',
    key: 'Direct'
  },
  // Common
  // FarmHouse
};

Object.values(SERVICE_NS).forEach(value => Object.freeze(value));
Object.freeze(SERVICE_NS);
