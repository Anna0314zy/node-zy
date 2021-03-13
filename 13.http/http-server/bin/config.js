const config = {
    port:{
        option: '-p, --port <v>',//program('-p,--port<val>','xxx)
        descriptor: 'set your server port',
        usage:'zs --port 3000',
        default: 8080
    },
    directory:{
        option:'-d,--directory <v>',
        descriptor:'set you server start directory',
        usage:'zs --directory D:',
        default: process.cwd()
    }
}
module.exports = config;