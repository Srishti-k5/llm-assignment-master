// import { useState } from "react";
// // import "./App.css";

// export default function App() {
//   const [result, setResult] = useState();
//   const [question, setQuestion] = useState();
//   const [file, setFile] = useState();

//   const handleQuestionChange = (event: any) => {
//     setQuestion(event.target.value);
//   };

//   const handleFileChange = (event: any) => {
//     setFile(event.target.files[0]);
//   };

//   const handleSubmit = (event: any) => {
//     event.preventDefault();

//     const formData = new FormData();

//     if (file) {
//       formData.append("file", file);
//     }
//     if (question) {
//       formData.append("question", question);
//     }

//     fetch("http://127.0.0.1:8000/predict", {
//       method: "POST",
//       body: formData,
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         setResult(data.result);
//       })
//       .catch((error) => {
//         console.error("Error", error);
//       });
//   };

//   return (
//     <div className="appBlock">
//       <form onSubmit={handleSubmit} className="form">
//         <label className="questionLabel" htmlFor="question">
//           Question:
//         </label>
//         <input
//           className="questionInput"
//           id="question"
//           type="text"
//           value={question}
//           onChange={handleQuestionChange}
//           placeholder="Ask your question here"
//         />

//         <br></br>
//         <label className="fileLabel" htmlFor="file">
//           Upload CSV file:
//         </label>

//         <input
//           type="file"
//           id="file"
//           name="file"
//           accept=".csv"
//           onChange={handleFileChange}
//           className="fileInput"
//         />
//         <br></br>
//         <button
//           className="submitBtn"
//           type="submit"
//           disabled={!file || !question}
//         >
//           Submit
//         </button>
//       </form>
//       <p className="resultOutput">Result: {result}</p>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import "./App.css";
export default function App() {
  const [result, setResult] = useState<string>("");
  const [question, setQuestion] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [messages, setMessages] = useState<{ content: string; role: string }[]>([]);
  const [showPopup, setShowPopup] = useState(false);

  const handleQuestionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion(event.target.value);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files ? event.target.files[0] : null;
  
    if (!selectedFile) {
      return; // No file selected
    }
  
    const allowedFileTypes = [".csv", ".pdf", ".docx", ".txt"];
    const fileType = selectedFile.name.substring(selectedFile.name.lastIndexOf("."));
  
    if (!allowedFileTypes.includes(fileType.toLowerCase())) {
      alert("Unsupported file type. Please select a file of type .csv, .pdf, .docx, or .txt.");
      event.target.value = ''; // Clear the file input
      setFile(null); // Reset the file state
      return;
    }
  
    if (selectedFile.size > 100 * 1024 * 1024) { // 100 MB in bytes
      alert("File size exceeds the limit of 100 MB. Please select a smaller file.");
      event.target.value = ''; // Clear the file input
      setFile(null); // Reset the file state
      return;
    }
  
    setFile(selectedFile);
    setShowPopup(true);
  };
  

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData();

    if (file) {
      formData.append("file", file);
    }
    if (question) {
      formData.append("question", question);
      setMessages((prevMessages) => [...prevMessages, { content: question, role: "user" }]);
    }
    setQuestion("");

    fetch("http://127.0.0.1:8000/predict", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        // setQuestion("");
        setResult(data.result);
        setMessages((prevMessages) => [...prevMessages, { content: data.result, role: "system" }]);
      })
      .catch((error) => {
        console.error("Error", error);
      });
  };

  useEffect(() => {
    if (showPopup) {
      const timer = setTimeout(() => {
        setShowPopup(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showPopup]);
  // console.log(messages)
  return (
    <div className="appBlock">
      {showPopup && <div className="popup">File Inserted Successfully</div>}
      <div className="resultOutput">
        {messages.map((message, index) => (
          <div key={index} className={message.role === "system" ? "answerDiv" : "questionDiv"}>
            <p className={message.role === "system" ? "answer" : "question"}>
              <span>{message.role === "system" ? "AI Bot" : "You"}</span>
              <span>{message.content}</span>
            </p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="form">
        <label htmlFor="file">
          {file ? <div className="insertImg">&#9745;</div> : <div className="insertImg">&#128930;</div>}
        </label>
        <input
          type="file"
          id="file"
          name="file"
          accept=".txt,.docx,.pdf,.csv"
          onChange={handleFileChange}
          className="fileInput"
          style={{ display: "none" }}
        />

        <input
          className="questionInput"
          id="question"
          type="text"
          value={question}
          onChange={handleQuestionChange}
          placeholder="Ask your question here"
        />

        <button
          className="submitBtn"
          type="submit"
          disabled={!file || !question}
        >
          &#8883;
        </button>
      </form>
    </div>
  );
}
