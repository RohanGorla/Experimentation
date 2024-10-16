import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [files, setFiles] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    console.log(files);
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            setFiles(e.target.files);
          }}
        ></input>
        <input type="submit"></input>
      </form>
    </>
  );
}

export default App;
