/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useState } from "react";
import "./index.css";

interface JSONFile {
  name: string;
  contentGlobalKey: string;
}

function App() {
  const [error, setIsError] = useState<boolean>(false);
  const [jsonData, setJsonData] = React.useState<JSONFile>();
  const fileName = React.useRef("");

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const currentFile = e.target.files?.[0];
    if (currentFile?.type !== "application/json") {
      setIsError(true);
      return;
    }

    fileName.current = currentFile.name;

    const jsonFileReader = new FileReader();

    function readerLoadHandler(e: ProgressEvent<FileReader>) {
      const fileContent = e.target?.result as string;

      try {
        JSON.parse(fileContent);
        {/* @ts-ignore */}
        globalThis.jsonFileContent = fileContent;
        setJsonData({
          contentGlobalKey: "jsonFileContent",
          name: fileName.current,
        });
        setIsError(false);
      } catch (err) {
        setIsError(true);
      }
    }

    jsonFileReader.addEventListener("load", readerLoadHandler);

    jsonFileReader.readAsText(currentFile, "UTF-8");

    setIsError(false);
  }

  return (
    <>
      <div className="container">
        {/* @ts-ignore */}
        {globalThis.jsonFileContent && !error ? (
          <>
            <span className="file-title">{jsonData?.name}</span>
            <div className="file-content-div">
              {/* @ts-ignore */}
              <pre>{globalThis.jsonFileContent}</pre>
            </div>
          </>
        ) : (
          <>
            <span className="title">JSON Tree Viewer</span>
            <p style={{ fontSize: "24px" }}>
              Simple JSON Viewer that runs completely on-client. No data
              exchange
            </p>
            <label htmlFor="file">Load Json</label>
            <input
              type="file"
              id="file"
              accept=".json"
              onChange={handleFileChange}
              aria-label="File"
            />
            {error && (
              <span
                style={{
                  color: "#BF0E0E",
                  fontSize: "16px",
                  marginTop: "1.5rem",
                }}
              >
                Invalid file. Please load a valid JSON file.
              </span>
            )}
          </>
        )}
      </div>
      <button
        onClick={() => {
          setJsonData(undefined);
          {/* @ts-ignore */}
          globalThis.jsonFileContent = "";
        }}
      >
        Clean
      </button>
    </>
  );
}

export default App;
