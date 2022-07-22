const dotenv=require('dotenv')
const cors=require('cors')
dotenv.config()

app.use(cors())

const PORT= process.env.PORT
const io =require("socket.io")(PORT,{


cors:{
                         origin:"https://sociallychats.herokuapp.com/",
},
})

let activeUser=[];

io.on('connection', (socket) => {
        socket.on('new-user-add',(newUserId)=>{
          if(!activeUser.some((user)=>user.userId===newUserId))
          {
                         activeUser.push
                         ({
                         userId:newUserId,
                         socketId:socket.id
                         });
          }
          console.log('User connected',activeUser)
          io.emit('get-users',activeUser)
        })
        socket.on('disconnect',()=>{
                         activeUser=activeUser.filter((user)=>user.socketId !==socket.id)
                         console.log('User disconnected',activeUser)
                         io.emit('get-users',activeUser)
        })
        //send message to specific user
        socket.on("send-message", (data) => {
                         const { receiverId } = data;
                         const user = activeUser.find((user) => user.userId === receiverId);
                         console.log("Sending from socket to :", receiverId)
                         console.log("Data: ", data)
                         if (user) {
                           io.to(user.socketId).emit("recieve-message", data);
                         }
                       });
})