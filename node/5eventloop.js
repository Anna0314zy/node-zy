

// 【3】 
// 1 2 6 8 5 3 4 7 
console.log(1);
async function async() {
    console.log(2);
    await console.log(3);
    console.log(4);
}
setTimeout(() => {
    console.log(5);
})
const promise = new Promise((reslove,reject) => {
   console.log(6);
   reslove(7)
})
promise.then(res => {
    console.log(res)
})
async();
console.log(8)
// [7], 2, 4
//1 6 2 8 7 3 4 5
//1 6 2 3 8 