// import React, { useState, useEffect } from "react";
// import { Sun, Moon, FileText, Download } from "lucide-react";
// import { pdfjs, Document, Page } from "react-pdf";
// import worker from "pdfjs-dist/build/pdf.worker.entry";

import React, { useState, useEffect } from "react";
import { Sun, Moon, Download, FileText } from "lucide-react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { Document } from "react-pdf";

// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
// pdfjs.GlobalWorkerOptions.workerSrc = worker;

const ResumeBuilder = () => {
  const [url, setUrl] = useState("");
  const [fileType, setFileType] = useState("pdf");
  const [pdfFile, setPdfFile] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia(
      "(prefers-color-scheme: dark)"
    );
    setIsDarkMode(darkModeMediaQuery.matches);

    const handleChange = (e) => setIsDarkMode(e.matches);
    darkModeMediaQuery.addEventListener("change", handleChange);

    return () => darkModeMediaQuery.removeEventListener("change", handleChange);
  }, []);

  const handleGenerate = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, fileType }),
      });
      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`);
      }
      console.log(response);
      const blob = await response.blob();
      setPdfFile(URL.createObjectURL(blob));
    } catch (error) {
      console.error("Error generating resume:", error);
    }
  };

  const handleDownload = () => {
    console.log(pdfFile);
    if (pdfFile) {
      const link = document.createElement("a");
      link.href = pdfFile;
      link.download = "resume.pdf";
      link.click();
    }
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  return (
    <div
      className={`flex h-screen ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
      }`}
    >
      {/* <div className="flex w-full max-w-6xl mx-auto p-6 space-x-6"> */}
      <div className="grid grid-cols-1 md:grid-cols-3 w-full max-w-6xl mx-auto p-6 space-x-6">
        {/* <div className="flex-1 space-y-6"> */}
        <div className="col-span-1 md:col-span-1 space-y-6">
          <div
            className={`p-6 rounded-lg ${
              isDarkMode ? "bg-gray-800" : "bg-white shadow-md"
            }`}
          >
            <h1 className="text-3xl font-bold text-center text-green-500 mb-6">
              Resume Builder
            </h1>
            <div className="space-y-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://"
                  className={`flex-1 p-2 rounded border ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600"
                      : "bg-white border-gray-300"
                  }`}
                />
                <select
                  value={fileType}
                  onChange={(e) => setFileType(e.target.value)}
                  className={`p-2 rounded border ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600"
                      : "bg-white border-gray-300"
                  }`}
                >
                  <option value="pdf">PDF</option>
                  <option value="doc">DOC</option>
                  <option value="docx">DOCX</option>
                </select>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleGenerate}
                  className="flex-1 p-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-200"
                >
                  Generate
                </button>
                <button
                  onClick={handleDownload}
                  disabled={!pdfFile}
                  className="flex-1 p-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download className="inline mr-2" size={18} />
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* <div className="flex-1 space-y-8"> */}
        <div className="col-span-2 space-y-8">
          <div
            className={`p-6 rounded-lg ${
              isDarkMode ? "bg-gray-800" : "bg-white shadow-md"
            }`}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Output:</h2>
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-2 rounded-full ${
                  isDarkMode
                    ? "bg-gray-700 hover:bg-gray-600"
                    : "bg-gray-200 hover:bg-gray-300"
                } transition duration-200`}
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
            {pdfFile ? (
              <div className="overflow-auto h-[calc(100vh-280px)]">
                <Worker
                  workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}
                >
                  <Viewer fileUrl={pdfFile} />
                </Worker>
              </div>
            ) : (
              <div className="flex items-center justify-center h-[calc(100vh-280px)] bg-gray-200 dark:bg-gray-700 rounded">
                <FileText
                  size={48}
                  className="text-gray-400 dark:text-gray-500"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
