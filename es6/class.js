// //es3 构造函数充当类
// function Animal() { //构造函数中的属性 都是实例上的属性
//     //以_明明都是私有属性
//      this.type = '哺乳类';
//      this.age = 20;
//      return {};//返回一个引用类型
// }
// Animal.prototype.say = function() {};
// Animal.flag = '动物';//静态属性
// let a1 = new Animal;//{}
// let a2 = new Animal;
//静态属性
// console.log(a1.say === a2.say);
function Animal(name) { //构造函数中的属性 都是实例上的属性
    //以_明明都是私有属性
     this.type = '哺乳类';
     this.name = name;
     this.age = 20;
}
Animal.prototype.say = function() {
    console.log('say'+ this.name);
};
let animal = new Animal;
//每个对象都有一个__proto__指向所属类的原型
// 每个原型会有一个constuctor 指向所属类
console.log(animal.__proto__ === Animal.prototype);//true
console.log(animal.__proto__.constructor === Animal);//true
console.log(animal.constructor === Animal);//true
console.log(Animal.prototype.__proto__ === Object.prototype);//true
console.log(Object.prototype.__proto__ == null);//true
console.log(Animal.__proto__ === Function.prototype);//true
console.log(Function.prototype.__proto__ === Object.prototype);//true



function Dog(name) {
    Animal.call(this, name);//获取实例上的属性
}
// Dog.prototype.__proto__ = Animal.prototype;
// Object.setPrototypeOf(Dog.prototype, Animal.prototype)
function create(parentPrototype) {
    function Fn() {}
    Fn.prototype = parentPrototype;
    let fn = new Fn();
    fn.constructor = Dog;
    return fn;
} 
//Dog的原型指向了Fn的实例 这个实例的__proto__ 指向了 Animal.prototype
 Dog.prototype= Object.create(Animal.prototype, {constructor:{value: Dog}});
let dog = new Dog('xiao');//实例化子类的时候传参
dog.say()
console.log(dog.constructor) //会指向Animal
//一般情况下会采用 Object.create + call 实现继承

//Dog.prototype = new Animal //既有原型的属性还有实例上的属性，无法给父类传递参数 因为毫无意义 应该实例化子类传参