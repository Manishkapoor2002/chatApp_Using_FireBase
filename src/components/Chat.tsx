import { useEffect, useState } from "react";
import { addDoc ,collection,onSnapshot,orderBy,query,serverTimestamp, where} from "firebase/firestore";
import {auth,db} from "../firebase-config"
type ChatProp = {
    room : String | Number | null | undefined
     username : String |Number | null |undefined

}
  

interface Message {
    id:String,
    text: string;
    createdAt: String,
    room:String ,
    userName:String
}

export const Chat: React.FC<ChatProp> = ({room,username}) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState<String>("");
    const messageRef =collection(db,"message");


    useEffect(()=>{
        const queryMessage = query(messageRef,where("room", "==" ,room ),orderBy("createdAt", "asc"));
        const unsubscribe = onSnapshot(queryMessage, (snapshot) => {
            const msg: Message[] = [];
            snapshot.forEach((doc) => {
              const data = doc.data();
              // console.log(typeof(doc.id))
              if (data.text && data.createdAt && data.room && data.userName) {
                msg.push({
                  id: doc.id,
                  text: data.text,
                  createdAt: data.createdAt,
                  room: data.room,
                  userName: data.userName
                });
              }
            });
            setMessages(msg);
          });
          return ()=> unsubscribe()
    },[])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if(newMessage === "") return;

        await addDoc(messageRef,{
            'text': newMessage,
            'createdAt':serverTimestamp(),
            "userName" : auth.currentUser?.displayName,
            room,
        });
        setNewMessage("")

    };
    return <div>
        <div>
        <h1>Chat Room: {room ? room.toString() : "Unknown Room"}</h1>
        </div>
        <div>
        {messages.map((msg,id) => (
          <div key={id}>
            <strong>userName</strong>: {msg.text}

          </div>
        ))}
        </div>
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="type your message here...." value={newMessage.toString()} onChange={(e) => setNewMessage(e.target.value)} />
            <button type="submit">Send</button>
        </form>
    </div>

}