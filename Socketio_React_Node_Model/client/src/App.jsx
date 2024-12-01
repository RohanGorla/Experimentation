import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./App.css";

const socket = io("http://localhost:5000");

function App() {
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");

  async function submitMessage(e) {
    e.preventDefault();
    socket.emit("message_input", { message, name });
    setMessage("");
  }

  return (
    <>
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
