//代理 
// let obj ={
//     a:1,
//     b:2
// }
let obj = [1,2, {b:4}];
// let obj = {
//     a:{a:1}
// }
function update() {
    console.log('视图更新')
}
let handler = {
    set(target, key, value) {
        console.log(key, 'key');
        if (key === 'length') return true; //更新数组的话先改可以 再改可以 会有2次set
        update();
        return Reflect.set(target, key, value)
    },
    get(target, key) {
        if (typeof target[key] === 'object') {
            //如果当前对象是object 继续做代理 返回当前这个对象的代理
            return new Proxy(target[key],  handler)
        }
      return Reflect.get(target, key)
    }
}
let proxyObj = new Proxy(obj,  handler)//代理的方法有16种

proxyObj[2].b = 100; //本身并不是深度监听 

console.log(proxyObj) //可以劫持新添加的属性
