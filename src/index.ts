import HillCipher from './hill-cipher';

const cipher = new HillCipher({
  key: 'this is a test message.',
  template: ' .,!?abcdefghijklmnopqrstuvwxyz0123456789',
});

const s = cipher.encrypt('test');
console.log(s);
const x = cipher.decrypt(s);
console.log(x);
