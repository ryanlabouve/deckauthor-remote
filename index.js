var express = require('express');
var app = express();
app.set('port', (process.env.PORT || 5000));

var http = require('http').Server(app);
var io = require('socket.io')(http);

var _ = require('lodash');

var sessions = {};

io.on('connection', function(socket) {
  console.log('a user connected');
  // console.log(socket);

  socket.on('register', function(data) {
    console.log('Register', socket.id, data);
    // register connection with appropriate session
    sessions[data.presentationId] = sessions[data.presentationId] || [];
    sessions[data.presentationId].push(socket.id);
  });

  socket.on('navigate', function(data) {
    console.log(data);
    console.log(sessions);
    socket.id; // don't send nav to this one
    // loop through each client of session
    _.forEach(sessions[data.presentationId], function(clientId) {
      if(socket.id === clientId) {
        // don't broadcast to client
        return;
      }
      console.log('sending nav to one client');
      // io.sockets.socket(clientId).emit('navigate', data);
      try {
        io.sockets.connected[clientId].emit('navigate', data);
      } catch (error) {
        console.log('we blowing up due to ', error);
      }
    });
  });

  socket.on('disconnect', function() {

    console.log('disconnecting client');
  });
});


// http.listen(app.get('port'), function() {
//   console.log('App is running');
// });

http.listen(5000, function() {
  console.log('App is running');
});
