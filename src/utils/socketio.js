import { io } from "socket.io-client";



 export const createSocketConnection =()=>{

     return io("http://localhost:4000",{
        withCredentials:true,
     });
};

