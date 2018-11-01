import HillCipher from './hill-cipher';

const cipher = new HillCipher({
  key: 'This is a test message.',
  template: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz,.!? ',
});
