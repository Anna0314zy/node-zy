
let proto = {

}

module.exports = proto;
//ctx.__proto__.__proto__ = proto;
function defineGetter(target,key) {
    proto.__defineGetter__(key,function() { // defineProperty
        return this[target][key];
    })
}
function defineSetter(target,key) {
    proto.__defineSetter__(key,function(value) { // defineProperty
         this[target][key] = value
    })
}
//代理 ctx.xxx = ctx.request.xxx
defineGetter('request','path');
defineGetter('request','url');
defineGetter('request','setHeader');
defineGetter('response','body');
defineSetter('response','body');