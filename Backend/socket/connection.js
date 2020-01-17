module.exports = function(io,User,_) {
    const userData = new User();
    io.on('connection', socket => {

        socket.on('refresh', data => {
            io.emit('refreshPage',{})
        });

        socket.on('join chat', data => {
            socket.join(data.room1);
            socket.join(data.room2);
        });

        socket.on('start_typing', data => {
            io.to(data.receiver).emit('is_typing',data)
        });

        socket.on('stop_typing', data => {
            io.to(data.receiver).emit('has_stopped_typing',data)
        });

        socket.on('onlineUser', data => {
            socket.join(data.room)
            userData.EnterRoom(socket.id,data.user,data.room);
            const list = userData.GetList(data.room);
            io.emit('usersOnline',_.uniq(list));
        });

        socket.on('disconnect', () => {   
            const user = userData.RemoveUser(socket.id)
            if(user) {
                const userArr = userData.GetList(user.room);
                const arr = _.uniq(userArr);
                _.remove(arr, n => n === user.name);
                io.emit('usersOnline',arr)
            }
        })
    })
}