function randInt(start = 0, end) {
  return ~~(Math.round(Math.random() * (end - start) + start));
}

function randStr(length, choices) {
  return Array(length).fill(0).map(
    () => choices[randInt(0, choices.length - 1)]
  ).join('');
}

function randStrUnique(length, choices) {
  const arr = Array(choices.length).fill(0).map((_, i) => ({
    weight: Math.random(),
    char: choices[i]
  }));
  arr.sort((a, b) => a.weight - b.weight);
  return arr.slice(0, length).map(t => t.char).join('');  
}

module.exports = {
  randInt,
  randStr,
  randStrUnique,
};
