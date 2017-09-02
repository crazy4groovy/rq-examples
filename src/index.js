const {RQ, requestorize, delay} = require('../libs/rq');

const delay_req = delay;
const work_req = (type, init) => requestorize(function work(val) {
  console.log(`>${type}`, init, '+', val);
  return init + val;
});

const work_req_delay = (type, init) => ms => delay(ms, requestorize(function work(val) {
  console.log(`>${type}`, init, '+', val);
  return init + val;
}));

const myCb = (success, failure) => {
  if (failure === undefined)
    console.log('SUCCESS', success);
  else
    console.log('FAILURE', failure);
}

const fillArray = num => {
  const array = [];
  while (num-- > 0)
    array.push(num);
  return array.reverse();
}

const pop = (array, x = 5) => array.splice(0, x);
const vals = fillArray(50);

console.log('START', new Date().toString());

let round = 0;
while (vals.length >= 5) {
  round++;
  const five = pop(vals);

  RQ.sequence([
    work_req_delay('s' + round, five[0])(1000),
    work_req('s' + round, five[1]),
    work_req('s' + round, five[2]),
    work_req('s' + round, five[3]),
    work_req('s' + round, five[4])
  ])(myCb, 0);

  RQ.parallel([
    work_req_delay('p' + round, five[0])(2000),
    work_req('p' + round, five[1]),
    work_req('p' + round, five[2]),
    work_req('p' + round, five[3]),
    work_req('p' + round, five[4])
  ])(myCb, 0);
}

console.log('END', new Date().toString());
