import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [files, setFiles] = useState("");
  const [images, setImages] = useState([]);

  async function handleSubmit(e) {
    e.preventDefault();
    console.log(files);
  }

  async function getPhotos() {
    const response = await axios.get("http://localhost:8008/getphotos");
    console.log(response.data);
    setImages(response.data);
  }

  useEffect(() => {
    getPhotos();
  }, []);

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
      {images.map((image, index) => {
        let url = "https://drive.google.com/thumbnail?id=" + image.id;
        return <img key={index} src={url}></img>;
      })}
    </>
  );
}

export default App;
