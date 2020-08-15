const res = 'P:0;V1:0;V2:0;V3:0;V4:0;V5:0;V6:0;DA:0;FA:0;LA:1;BM:0;F1:0.0 l/min;D:0.36 bar;T1:-127.0 Grad C;';

function handleResponse(text, regexMatch) {
  const result = {};
  let value = regexMatch.exec(text);

  while (value != null) {
    const arr = value[0].split(':');
    result[arr[0]] = arr[1] === 1;
    value = regexMatch.exec(text);
  }
  return result;
}


const pumpValues = handleResponse(res, /P.?:\d/g, 'value');
const senrorValues = handleResponse(res, /LA.?:\d/g, 'value');
const ventileValues = handleResponse(res, /V.?:\d/g, 'id');

console.log('pumpValues', pumpValues);
console.log('senrorValues', senrorValues);
console.log('ventileValues', ventileValues);
