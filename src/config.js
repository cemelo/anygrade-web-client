const server = {
  rest: 'http://localhost:4000',
  url: 'ws://localhost:4000/ws',
  params: {},
  loginUrl: 'http://localhost:4000/login/:provider',
};

const devices = {
  iPad: 768,
  'MS-Surface-Pro': 720,
  'iPhone-6S-Plus': 425,
};

export default {
  server,
  devices,
};
