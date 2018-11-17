const ProgressBar  = require('progress');
const chalk = require('chalk');
const utils = require('./util');
const HillCipher = require('../dist/hill-cipher').default;

const VISIBLE_CHARS = '~`1234567890-=!@#$%^&*()_+qwertyuiop[]\\asdfghjkl;\'zxcvbnm,./QWERTYUIOP{}|ASDFGHJKL:"ZXCVBNM<>?"';
const PRIMES = [
  7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59,
  61, 67, 71, 73, 79, 83, 89
];

const CASES = 10000;
console.log(chalk.green('Test ') + chalk.cyan(CASES) + chalk.green(' cases for correctness'));

const errors = {};
let correct = 0;
let wrong = 0;

const bar = new ProgressBar(':current/:total :bar :rate', {
  total: CASES
});

function test() {
  const templateLength = PRIMES[utils.randInt(0, PRIMES.length - 1)];
  const template = utils.randStrUnique(templateLength, VISIBLE_CHARS);
  const keyLength = utils.randInt(5, 100);
  const key = utils.randStr(keyLength, template);
  const textLength = utils.randInt(1, 10000);
  const text = utils.randStr(textLength, template);

  try {
    const hillCipher = new HillCipher({ key, template });
    const cipher = hillCipher.encrypt(text);
    const decrypted = hillCipher.decrypt(cipher);
    if (decrypted.slice(0, textLength) === text) correct++;
    else wrong++;
  } catch (e) {
    if (errors[e.message] === undefined)
      errors[e.message] = 1;
    else
      errors[e.message]++;
  }
  bar.tick();
}

let testCount = 0;
function doTest(done) {
  setTimeout(() => {
    test();
    if (++testCount < CASES) {
      doTest(done);
    } else {
      done();
    }
  }, 0);
}

doTest(() => {
  const totalErr = Object.values(errors).reduce((a, b) => a + b);

  console.log(chalk.cyan('\nTest done\n'));
  console.log(chalk.green( `Correct: ${correct} / ${CASES}`));
  console.log(chalk.red(   `Wrong  : ${wrong} / ${CASES}`));
  console.log(chalk.yellow(`Error  : ${totalErr} / ${CASES}`));
  Object.keys(errors).forEach(err => {
    console.log(chalk.yellow(`         ${errors[err]}: ${err}`));
  });
});
