import HillCipher from './hill-cipher';

const cipher = new HillCipher({
  key: 'this is a test message.',
  template: ' .,!?abcdefghijklmnopqrstuvwxyz0123456789',
});
