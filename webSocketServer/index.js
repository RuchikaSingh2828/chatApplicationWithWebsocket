const webSocketsServerPort = 8000;
const webSocketServer = require('websocket').server;
const http = require('http');

// Spinning the http server and the websocket server

const server = http.createServer();
server.listen(webSocketsServerPort);
console.log('listening on port 8000');

// spawn on a websocket server
const wsServer = new webSocketServer({
    httpServer: server
});
// store all the connected clients
const clients = {};

// fr generating unique user ID's 
const getUniqueID = () => {
    const s4 = () => Math.floor((1 + Math.random()) * 10000);
    return s4() * s4() * s4();
}


wsServer.on('request', function(request) {
    // createa unique user id for every user tha connects to te server
    const userID = getUniqueID();
    // after the uniqueID has been created we will log the new request that we have received
    console.log((new Date()) + ' Received a new connectionfrom origin ' + request.origin + '.');

    //this can be rewritten to accept only the requests from allowed 'origin
    const connection = request.accept(null, request.origin); // this is creating a new connection

    //using this connection we will store the connection to the clients object
    clients[userID] = connection;

    // logging that we have connected to the server
    console.log('connected: User ID in client');
    console.log(userID);
    console.log('###############################');
    console.log(Object.getOwnPropertyNames(clients));

    //will be triggered whenever the server receives any message
    connection.on('message', function(message) {
        if(message.type === 'utf8'){
            console.log(`Received Message: `, message.utf8Data);

            // broadcasting message to all connected clients
            for(key in clients){
                clients[key].sendUTF(message.utf8Data);
                console.log(`sent message to :`);
                console.log(clients[key]);
            }
        }
    })

})