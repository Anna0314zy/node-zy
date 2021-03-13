#! /usr/bin/env node


const {program} = require('commander')
const config = require('./config')
const {forEachObj} = require('../utils')
program.name('zs')
// program
//   .option('-d, --debug', 'output extra debugging')
//   .option('-s, --small', 'small pizza size')
//   .option('-p, --port <v>', 'flavour of pizza')

// Object.values(config).forEach(val => {
//     program.option(val.option,val.descriptor)
//     // program.option('-p, --port <v>')
// })
forEachObj(config,val => {
    program.option(val.option,val.descriptor)
    // program.option('-p, --port <v>')
} )
program.on('--help', function() {
    console.log('examples:')
    Object.values(config).forEach(val => {
        console.log('  '+val.usage);
    })
})
program.parse(process.argv);
const options = program.opts(); //获取参数
// console.log(program,options)
const finalConfig = {};
// console.log(program[key])

// Object.entries(config).forEach(([key,value]) => {

//     finalConfig[key] = options[key] || value.default
// })
forEachObj(config,(val,key) => {
    finalConfig[key] = options[key] || val.default
    // program.option('-p, --port <v>')
} )
// console.log(finalConfig)
const Server = require('../src/index');
let server = new Server(finalConfig);
server.start()
