//then 方法的参数 是可选参数
const p = new Promise((resolve, reject) => {
    resolve('ok')
}).then().then().then().then(data => {
    console.log(data);
})