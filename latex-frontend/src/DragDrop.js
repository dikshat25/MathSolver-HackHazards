import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DragDrop = () => {
  const [file, setFile]       = useState(null);
  const [latex, setLatex]     = useState("");
  const [loading, setLoading] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setFile(e.dataTransfer.files[0]);
    setLatex("");
  };

  const handleUpload = async () => {
    if (!file) {
      return toast.error("Please upload an image first!");
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const { data } = await axios.post("http://127.0.0.1:8000/latex", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (data.latex) {
        setLatex(data.latex);
        toast.success("LaTeX extraction successful!");
      } else {
        toast.warn("No text detected. Try a clearer image.");
      }
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.detail || err.message;
      toast.error(`Error: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign:'center', padding:'2rem' }}>
      <h1>📄 Drag & Drop Math Image</h1>
      <div
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
        style={{
          width:300, height:200, border:'2px dashed #aaa',
          margin:'1rem auto', display:'flex',
          justifyContent:'center', alignItems:'center'
        }}
      >
        {file ? file.name : "Drop image here"}
      </div>

      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Processing..." : "Upload & Convert"}
      </button>

      {latex && (
        <div style={{ whiteSpace:'pre-wrap', marginTop:20 }}>
          <h3>🖋 LaTeX Output</h3>
          <pre>{latex}</pre>
        </div>
      )}

      {/* Toast container */}
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default DragDrop;
