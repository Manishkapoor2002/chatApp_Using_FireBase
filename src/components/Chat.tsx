import { useEffect, useState, useRef } from "react";
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp, where } from "firebase/firestore";
import { auth, db } from "../firebase-config"
import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import Cookies from "universal-cookie";
const cookies = new Cookies();

type ChatProp = {
  room: String | Number | null | undefined  
}

const chatContainerStyle: React.CSSProperties = {
  maxHeight: '400px',
  overflowY: 'auto',
  marginBottom: '10px',
  padding: '10px',
  backgroundColor: '#f4f4f4',
  borderRadius: '10px',
  boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
};

const userNameStyle: React.CSSProperties = {
  fontWeight: 'bold',
  color: '#333',
  marginBottom: '5px',
  display: 'block',
};


interface Message {
  id: String,
  text: string;
  createdAt: String,
  room: String,
  userName: String
}

export const Chat: React.FC<ChatProp> = ({ room }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<String>("");
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const messageRef = collection(db, "message");
  const currUsername = cookies.get('currentUsername')

  const messageStyle = (isCurrentUser: Boolean): React.CSSProperties => ({
    textAlign: isCurrentUser ? 'right' : 'left',
    padding: '10px',
    margin: '5px 0',
    alignSelf: isCurrentUser ? 'flex-end' : 'flex-start',
    backgroundColor: isCurrentUser ? '#daf8cb' : '#fff',
    border: isCurrentUser ? '1px solid #cce5b1' : '1px solid #ddd',
    borderRadius: '15px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  });


  useEffect(() => {
    const queryMessage = query(messageRef, where("room", "==", room), orderBy("createdAt", "asc"));
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
    return () => unsubscribe()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage === "") return;

    await addDoc(messageRef, {
      'text': newMessage,
      'createdAt': serverTimestamp(),
      "userName": auth.currentUser?.displayName,
      room,
    });
    setNewMessage("")
  };


  const scrollToBottom = () => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div style={{
      width: '600px',
      height: '800px'
    }}>

<div style={{
        display: 'flex',
        maxHeight: '75px',
        width: 'auto',
        marginBottom: '10px',
        justifyContent: 'center'
      }}>
        <h1>Welcome : {currUsername.toString()} </h1>
      </div>
      <div style={{
        display: 'flex',
        maxHeight: '75px',
        width: 'auto',
        justifyContent: 'center'
      }}>
        <h1>Chat Room: {room ? room.toString() : "Unknown Room"}</h1>
      </div>

      <div style={chatContainerStyle}>
        {messages.map((msg, id) => (
          <div style={messageStyle(msg.userName === currUsername)} key={id}>
            {msg.userName !== currUsername && <span style={userNameStyle}>{msg.userName}:</span>}
            <span>{msg.text}</span>
            <div ref={chatEndRef} />
          </div>
        ))}
      </div>

      <div style={{
        width: '100%'
      }}>
        <form onSubmit={handleSubmit}>
          <div style={{
            display: 'flex',
          }}>
            <Box
              sx={{
                width: '100%',
              }}
            >
              <TextField fullWidth label="write your message" id="fullWidth" placeholder="type your message here...." value={newMessage.toString()} onChange={(e) => setNewMessage(e.target.value)} />
            </Box>
            <Button type="submit" variant="contained" endIcon={<SendIcon />}>
              Send
            </Button>
          </div>
        </form>
      </div>
    </div>
  )

}