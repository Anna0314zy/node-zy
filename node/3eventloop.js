async function async1() {
    console.log('async1 start')
    await async2(); //node 会被编译成2个then ---演示不出来呀
    // console.log('async1 end');
    //node 11版本编译了2个then
      // async2().then(() => {
    //     return
    // }).then(() => {
    //     console.log('async1 end')
    // })
    //浏览器编译 
  
    // async2().then(() => {
    //     console.log('async1 end');
    // })

}
async function async2() {
    console.log('async2')
}
console.log('script start');
setTimeout(function() {
    console.log('settimeout');
},0)
async1();
new Promise(function(resolve) {
    console.log('promise1');
    resolve();
}).then(function() {
    console.log('promise2')
})
console.log('script end');
// script start
// async1 start
// async2
// promise1
// script end
// async1 end
// promise2
// settimeout
/**
 * 默认先执行宏任务（script）会清空所有的微任务(全部执行完毕)
 微任务执行后开始页面渲染（不是每次都渲染） 取出一个宏任务执行 执行过程中可能再次产生宏任务微任务 不停的循环
 */
//常见的宏任务 setTimeout setImmdiate script ui i/o 事件 ajax
//微任务 mutationObserver promise.then  process.nextTick queneMicrotask