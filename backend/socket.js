let Room = require('./models/room');
let Message = require('./models/message');
let Track = require('./models/track');

var sockets = {};

// rooms which are currently available in chat
var rooms = [];

//-----------------------------------


function getTime() {
    var today = new Date(); // for now
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();

    if (dd < 10) {
        dd = '0' + dd;
    }

    if (mm < 10) {
        mm = '0' + mm;
    }

    return mm + '/' + dd + '/' + yyyy + ' -  ' + today.getHours() + ':' + today.getMinutes();
}

sockets.init = function (server) {
    // socket.io setup
    var io = require('socket.io').listen(server);
    io.sockets.on('connection', function (socket) {

        socket.on('createroom', function (username) {
            try {
                if (socket.room) {
                    leave(socket);
                }

                var roomnumber = Math.floor(Math.random() * (9999 - 1111 + 1)) + 1111;

                while (roomnumber in rooms) {
                    console.log('room is not empty. Creating new Roomnumber');
                    roomnumber = Math.floor(Math.random() * (9999 - 1111 + 1)) + 1111;
                }


                console.log('user: ' + username + ' creating room: ' + roomnumber);

                var room = new Room(roomnumber, username);


                //save room
                rooms[room.getroomnumber()] = room;
                //rooms.push(room);
                // store the username in the socket session for this client
                socket.username = username;
                // store the room name in the socket session for this client
                socket.room = roomnumber;

                // send client to room 1
                socket.join(roomnumber);

                // echo to room 1 that a person has connected to their room
                var message = new Message('SERVER', username + ' has connected to this room', getTime());
                socket.broadcast.to(roomnumber).emit('updatechat', message);
                //socket.emit('updateroom', rooms[socket.room]);
                socket.emit('updateroom', {Roominfo: rooms[socket.room], requester: username});
            } catch (e) {
                console.log(e);
            }
        });

        // when the client emits 'joinroom', this listens and executes
        socket.on('joinroom', function (username, roomnumber) {
            try {
                //if roomnumber doesn't exist return
                if (!(roomnumber in rooms)) {
                    socket.emit('updateroom', {error: -1});
                    return;
                }
                //if Error during disconnect from another Room manually disconnect user
                if (socket.room) {
                    leave(socket);
                }
                //Check username duplication
                var arrayLength = rooms[roomnumber].getusernames().length;
                for (var i = 0; i < arrayLength; i++) {
                    if (rooms[roomnumber].getusernames()[i] === username) {

                        var index = username.indexOf("(");
                        if (index > 0) {
                            username = username.substring(0, index) + '(' + i + ')';
                        } else {
                            username = username + '(' + i + ')';
                        }
                        i = 0;
                    }
                }

                // store the username in the socket session for this client
                console.log('user: ' + username + ' joining room: ' + roomnumber);
                rooms[roomnumber].getusernames().push(username);

                socket.username = username;
                // store the room name in the socket session for this client
                socket.room = roomnumber;
                // send client to room 1
                socket.join(roomnumber);

                // echo to room 1 that a person has connected to their room
                var message = new Message('SERVER', username + ' has connected to this room', getTime());
                socket.broadcast.to(roomnumber).emit('updatechat', message);
                socket.emit('updateroom', {Roominfo: rooms[socket.room], requester: username});
            } catch (e) {
                console.log(e);
            }
        });

        function leave(socket) {
            //if disconnect has failed manually disconnect
            try {
                var hostHasLeft = false;
                if (!socket.username || !socket.room) return;

                console.log(socket.username + ' trying to disconnect from ' + socket.room);

                if (rooms[socket.room] !== undefined) {
                    var index = rooms[socket.room].getusernames().indexOf(socket.username);
                    if (index > -1) {
                        rooms[socket.room].getusernames().splice(index, 1);
                        console.log(socket.username + ' removed from ' + socket.room);
                        if (rooms[socket.room].host === socket.username) {
                            hostHasLeft = true;
                        }
                    }

                    // echo globally that this client has left
                    //socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
                    var message = new Message('SERVER', socket.username + ' has left this room', getTime());
                    socket.broadcast.to(socket.room).emit('updatechat', message);

                    //setting new host:
                    if (rooms[socket.room].getusernames().length > 0 && hostHasLeft === true) {
                        rooms[socket.room].host = rooms[socket.room].getusernames()[0];
                        console.log(rooms[socket.room].host + ' is now the Host in Room' + socket.room);
                        socket.broadcast.to(socket.room).emit('hostUpdated', rooms[socket.room].host);
                    }
                    else if (rooms[socket.room].getusernames().length <= 0) {
                        delete rooms[socket.room];
                        console.log('Room ' + socket.room + ' has been cleared!');
                    }
                }
                socket.leave(socket.room);
            } catch (e) {
                console.log(e);
            }
        };


        socket.on('getusername', function () {
            try {
                console.log(socket.username + ' has requested to get username [Room:' + socket.room + ']');
                socket.emit('usernameUpdate', socket.username);
            } catch (e) {
                console.log(e);
            }
        });

        // when the client emits 'sendchat', this listens and executes
        socket.on('sendchat', function (data) {
            try {
                // we tell the client to execute 'updatechat' with 2 parameters
                console.log(socket.username + ' sending:' + data);

                //Create Timestamp
                const d = new Date();
                const hour = d.getHours();
                let minutes;

                if (d.getMinutes() < 10)
                    minutes = "0" + d.getMinutes();
                else {
                    minutes = d.getMinutes();
                }
                const time = hour + ":" + minutes.toString();


                var message = new Message(socket.username, data, time);
                io.sockets.in(socket.room).emit('updatechat', message);
            } catch (e) {
                console.log(e);
            }
        });


        socket.on('vote', function (trackSource) {
            try {
                // store the username in the socket session for this client
                console.log(socket.username + ' has voted ' + trackSource + '[Room:' + socket.room + ']');
                var arrayLength = rooms[socket.room].gettracklist().length;
                for (var i = 0; i < arrayLength; i++) {
                    if (rooms[socket.room].gettracklist()[i].source === trackSource) {
                        rooms[socket.room].gettracklist()[i].votecnt = rooms[socket.room].gettracklist()[i].votecnt + 1;
                        rooms[socket.room].gettracklist()[i].usersVoted.push(socket.username);
                    }

                }
                io.sockets.in(socket.room).emit('updatetrackvote', {
                    tracks: rooms[socket.room].gettracklist(),
                    currentlyPlaying: rooms[socket.room].currentlyPlaying
                }, socket.room);
            }catch(e){
                console.log(e);
            }
        });

        socket.on('unvote', function (trackSource) {
            try {
                // store the username in the socket session for this client
                console.log(socket.username + ' has unvoted ' + trackSource + '[Room:' + socket.room + ']');
                var arrayLength = rooms[socket.room].gettracklist().length;
                for (var i = 0; i < arrayLength; i++) {
                    if (rooms[socket.room].gettracklist()[i].source === trackSource) {
                        rooms[socket.room].gettracklist()[i].votecnt = rooms[socket.room].gettracklist()[i].votecnt - 1;
                        var index = rooms[socket.room].gettracklist()[i].usersVoted.lastIndexOf(socket.username);
                        rooms[socket.room].gettracklist()[i].usersVoted.splice(index, 1);
                    }

                }
                io.sockets.in(socket.room).emit('updatetrackvote', {
                    tracks: rooms[socket.room].gettracklist(),
                    currentlyPlaying: rooms[socket.room].currentlyPlaying
                }, socket.room);
            }catch(e){
                console.log(e);
            }
        });

        socket.on('getroominfo', function () {
            try {
                // store the username in the socket session for this client
                console.log(socket.username + ' has requested to get Room Informations [Room:' + socket.room + ']');
                socket.emit('roominfoUpdate', rooms[socket.room]);
            }catch(e){
                console.log(e);
            }
        });

        // when the client emits 'adduser', this listens and executes
        socket.on('addtrack', function (track) {
            try {
                // store the username in the socket session for this client
                console.log('user: ' + socket.username + ' trying to add Track: ' + track.artist + '-' + track.title + "Cover:" + track.thumbnail);

                var track2 = new Track(track, socket.username);
                //check if Track already exists in TrackList
                var trackExists = false;
                var arrayLength = rooms[socket.room].gettracklist().length;

                for (var i = 0; i < arrayLength; i++) {
                    if (rooms[socket.room].gettracklist()[i].source === track2.source) {
                        trackExists = true;
                    }
                }

                if (trackExists === false) {
                    rooms[socket.room].gettracklist().push(track2);
                    io.sockets.in(socket.room).emit('updatetrackvote', {
                        tracks: rooms[socket.room].gettracklist(),
                        currentlyPlaying: rooms[socket.room].currentlyPlaying
                    }, socket.room);
                } else {
                    socket.emit('trackAddError', {error: "Track already exists!"});
                }
            }catch(e){
                console.log(e);
            }
        });

        socket.on('getTracks', function () {
            try {
                // store the username in the socket session for this client
                console.log('Sending Tracklist to ' + socket.username);
                io.sockets.in(socket.room).emit('updatetrackvote', {
                    tracks: rooms[socket.room].gettracklist(),
                    currentlyPlaying: rooms[socket.room].currentlyPlaying
                }, socket.room);
            }catch(e){
                console.log(e);
            }
        });

        socket.on('getMostVotedTrack', function () {
            try {
                // store the username in the socket session for this client
                console.log(socket.username + ' has requested to get Most Voted Track [Room:' + socket.room + ']');

                var arrayLength = rooms[socket.room].gettracklist().length;
                var highestVotedTrackIndex = 0;
                var maxVoteCounter = -1;
                for (var i = 0; i < arrayLength; i++) {
                    if (rooms[socket.room].gettracklist()[i].votecnt > maxVoteCounter) {
                        highestVotedTrackIndex = i;
                        maxVoteCounter = rooms[socket.room].gettracklist()[i].votecnt;
                    }
                }

                if (maxVoteCounter >= 0) {
                    console.log(' Most Voted Track in [Room:' + socket.room + '] =' + rooms[socket.room].gettracklist()[highestVotedTrackIndex].title);
                    socket.emit('mostVotedTrack', rooms[socket.room].gettracklist()[highestVotedTrackIndex]);
                    rooms[socket.room].currentlyPlaying = rooms[socket.room].gettracklist()[highestVotedTrackIndex];
                    rooms[socket.room].gettracklist().splice(highestVotedTrackIndex, 1);
                    io.sockets.in(socket.room).emit('updatetrackvote', {
                        tracks: rooms[socket.room].gettracklist(),
                        currentlyPlaying: rooms[socket.room].currentlyPlaying
                    }, socket.room);
                }
            }catch(e){
                console.log(e);
            }
        });

        //leave room
        socket.on('leave', function () {
            leave(socket);
        });

        // when the user disconnects.. perform this
        socket.on('disconnect', function () {
            // remove the username from global usernames list
            leave(socket);
        });
    });

};

module.exports = sockets;