import { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [files, setFiles] = useState([]);
  const [images, setImages] = useState([]);
  const [path, setPath] = useState("");
  const fileRefs = useRef(null);

  async function handleSubmit(e) {
    e.preventDefault();
    sendPhotos();
  }

  async function getPhotos() {
    const response = await axios.get("http://localhost:8008/getphotos");
    console.log(response.data);
    setImages(response.data);
  }

  async function sendPhotos() {
    let formData = new FormData();
    let files = fileRefs.current.files;
    for (let i = 0; i < files.length; i++) {
      formData.append("photos", files[i]);
    }
    const response = await axios.post(
      "http://localhost:8008/sendphotos",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          name: `${path}-${Date.now()}`,
        },
      }
    );
  }

  useEffect(() => {
    // getPhotos();
  }, []);

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          onChange={(e) => {
            setPath(e.target.value);
          }}
        ></input>
        <input
          type="file"
          accept="image/*"
          name="photos"
          multiple
          ref={fileRefs}
        ></input>
        <input type="submit"></input>
      </form>
      {/* {images?.map((image, index) => {
        let url = "https://drive.google.com/thumbnail?id=" + image.id;
        return <img key={index} src={url}></img>;
      })} */}
    </>
  );
}

export default App;
