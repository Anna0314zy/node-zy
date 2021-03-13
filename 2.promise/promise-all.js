let fs = require('fs')
let util = require('util');
let read = util.promisify(fs.readFile);
function isPromise(x) {
    if ((typeof x === 'object' && x !== null) || typeof x === 'function') {
        if (typeof x.then === 'function') {
            return true;
        }
    }
    return false;
}
Promise.all = function(promises) {
    return new Promise((reslove, reject) => {
        let arr = [];
        let idx = 0;
        let processData = (value, index) => {
            arr[index] = value;
            //必须要用这个 因为有异步
            if (++idx === promises.length) {
                reslove(arr)
            }
        }
        for(let i = 0; i < promises.length;i++) {
            let currentValue = promises[i];
            if (isPromise(currentValue)) {
                currentValue.then((y) => {
                    processData(y,i);
                })
            }else {
                processData(currentValue,i);
            }
        }
    })
}
Promise.all([1, read('./a.text', 'utf8'), 2, read('./b.text', 'utf8'), 3]).then(data => {
    console.log(data);
})