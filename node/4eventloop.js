
Promise.resolve().then(() => {
    console.log("then1");
    Promise.resolve().then(() => {
        console.log('then1-1');
        return Promise.resolve();//x.then().then() 返回了一个promise 延迟执行 被解析成了2个then
        // return 1;
    }).then(() => {
        console.log("then1-2");
    })
})
.then(() => {
    console.log('then2'); //then2执行完了 把 console.log('then3')
})
.then(() => {
    console.log('then3');
})
.then(() => {
    console.log('then4');
})
.then(() => {
    console.log('then5');
})
//promise遵循promise A+规范 遵循es262规范
//微任务 then1 then1-1 then2 
// 第一次 then1  微任务队列里有[第一个then方法的回调]
//清空微任务 打印出then1 微任务['then1-1' then2]
//打印then1-1 then2 微任务[x.then, 'then3']
//清空微任务队列 [] 打印then3 ['then4','then1-2'] 
//打印then4 then1-2

// 【3】 
// 1 2 6 8 5 3 4 7 