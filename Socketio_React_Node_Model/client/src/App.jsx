import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./App.css";

/* CONNECTING TO WEB SOCKET */
const socket = io("http://localhost:5000");

function App() {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [roomMessages, setRoomMessages] = useState([]);

  /* SEND MESSAGE FUNCTION */
  async function submitMessage(e) {
    e.preventDefault();
    socket.emit("message_input", { message, name });
    setMessage("");
  }

  /* GET ROOM CHAT */
  async function getRoomChat() {
    socket.emit("join room", room);
  }

  useEffect(() => {
    /* SOCKET CATCH 'MESSAGE OUTPUT' EVENT */
    socket.on("message_output", (payload) => {
      console.log(`Payload is: ${payload.name} : ${payload.message}`);
      setMessages([...messages, payload]);
    });
    /* SOCKET CATCH 'SEND ALL CHAT' EVENT */
    socket.on("all_chat", (payload) => {
      console.log(payload);
      setMessages(payload);
    });
  });

  return (
    <>
      {/* SHOW ALL MESSAGES BOX */}
      <div className="Messages_Box">
        {roomMessages.map((message, index) => {
          return (
            <p key={index}>
              {message.name} : {message.message || message.msg}
            </p>
          );
        })}
      </div>
      {/* CHAT MESSAGE FORM */}
      <form onSubmit={submitMessage}>
        <label>Enter Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
        ></input>
        <label>Enter Room</label>
        <input
          type="text"
          value={room}
          onChange={(e) => {
            setRoom(e.target.value);
          }}
        ></input>
        <button
          onClick={(e) => {
            e.preventDefault();
            getRoomChat();
          }}
        >
          Pick Room
        </button>
        <label>Enter Message</label>
        <input
          type="text"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
          }}
        ></input>
        <input type="submit" name="Send"></input>
      </form>
    </>
  );
}

export default App;
