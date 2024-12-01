import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./App.css";

const socket = io("http://localhost:5000");

function App() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  async function submitMessage(e) {
    e.preventDefault();
    socket.emit("message_input", { message, name });
    setMessage("");
  }

  return (
    <>
      <div>
        {messages.map((message, index) => {
          return (
            <p key={index}>
              {message.name} : {message.message}
            </p>
          );
        })}
      </div>
      <form onSubmit={submitMessage}>
        <input
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
        ></input>
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
