

function fn(arr){
    var result = [],
        i = 0;
    result[i] = [arr[0]];
    arr.reduce(function(prev, cur){
      cur-prev === 1 ? result[i].push(cur) : result[++i] = [cur];
      return cur;
    });
    return result;
}

var a = [1, 2, 2, 3, 4, 5, 8, 5, 9];
// a.sort();
var l = fn(a);
console.log(l.length);
for (var idx in l){
    console.log(l[idx]);
}
// console.log(l);