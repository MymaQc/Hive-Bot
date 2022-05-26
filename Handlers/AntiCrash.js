/**
 * @param client
 */
module.exports = (client) => {
    client.on('error', err => {
        console.log(err)
    });

    process.on("unhandledRejection", (reason, promise) => {
        return console.log('——————————[Unhandled Rejection/Catch]——————————\n' + reason, promise)
    });
    
    process.on("uncaughtException", (error, origin) => {
        return console.log('——————————[Uncaught Exception/Catch]——————————\n' + error, origin)
    });
    
    process.on("uncaughtExceptionMonitor", (error, origin) => {
        return console.log('——————————[Uncaught Exception Monitor/Catch]——————————\n' + error, origin)
    });
    
    process.on("multipleResolves", (type, promise, reason) => {
        console.log('——————————[Multiple Resolves/Catch]——————————\n' + type, promise, reason)
    });
    
    process.on("warning", (warn) => {
        console.log('——————————[Uncaught Exception Monitor Warning/Catch]——————————\n' + warn)
    });
}
