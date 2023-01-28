import React, { useCallback, useState, useEffect } from "react";
import { useDropzone, FileWithPath } from "react-dropzone";
// import PdfParse from "pdf-parse";
// import fs from "fs";
// import arrayBufferToBuffer from "arraybuffer-to-buffer";
import { Buffer } from "buffer";
// import { PDFExtract, PDFExtractOptions } from "pdf.js-extract";
// import { Buffer } from "buffer";
import { pdfToText } from "text-from-pdf";
import pdfjs from "pdfjs-dist";

async function extractText(buffer: Buffer) {
  if (!buffer) {
    console.log("No buffer");
    return "";
  }
  const binaryData = new Uint8Array(Buffer.from(buffer));
  const pdf = await pdfjs.getDocument({
    data: binaryData,
  }).promise;
  const numPages = pdf.numPages;
  let text = "";
  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const pageText = await page.getTextContent();
    for (const item of pageText.items) {
      text += item;
    }
  }
  return text;
}

function MyDropzone() {
  //   const onDrop = useCallback((acceptedFiles: any) => {
  //     acceptedFiles.forEach((file: any) => {
  //       const reader = new FileReader();

  //       reader.onabort = () => console.log("file reading was aborted");
  //       reader.onerror = () => console.log("file reading has failed");
  //       reader.onload = () => {
  //         // Do whatever you want with the file contents
  //         const binaryStr = reader.result;
  //         console.log(binaryStr);
  //       };
  //       reader.readAsArrayBuffer(file);
  //     });
  //   }, []);

  const [fileBuffer, setFileBuffer] = useState<Buffer>();
  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
    // get first file only
    const file = acceptedFiles[0];
    const filePath = file.path!;
    console.log(filePath);
    file.arrayBuffer().then((arrayBuffer) => {
      //   console.log(arrayBuffer);
      const dataBuffer = Buffer.from(arrayBuffer);
      //   const encoder = new TextEncoder();

      //   const buffer = encoder.encode(arrayBuffer);
      //   const buffer = arrayBufferToBuffer(arrayBuffer);
      console.log(dataBuffer);
      setFileBuffer(dataBuffer);
    });
  }, []);
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    onDrop,
  });

  const files = acceptedFiles.map((file: FileWithPath) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));
  useEffect(() => {
    // pdfToText()
    // conver buffer to string
    // const text = fileBuffer?.toString("utf-8");
    // console.log(text);
    const getText = async () => {
      if (!fileBuffer) {
        console.log("No fileBuffer");
        return;
      } else {
        console.log(`fileBuffer: ${fileBuffer}`);

        const text = await extractText(fileBuffer!);
        console.log(text);
      }
    };

    getText();
  }, [fileBuffer]);

  return (
    <>
      dropzone
      <div className="max-w-xl">
        <label className="flex justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
          <span className="flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            {/* <span className="font-medium text-gray-600">
                Drop files to Attach, or
                <span className="text-blue-600 underline">browse</span>
            </span> */}
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              <p>Drag 'n' drop some files here, or click to select files</p>
            </div>
          </span>

          <input type="file" name="file_upload" className="hidden" />
        </label>
      </div>
      <aside>
        <h4>Files</h4>
        <ul>{files}</ul>
      </aside>
      {/* <section className="container">
        <div {...getRootProps()}>
          <input {...getInputProps()} />
          <p>Drag 'n' drop some files here, or click to select files</p>
        </div>
        <aside>
          <h4>Files</h4>
          <ul>{files}</ul>
        </aside>
      </section> */}
    </>
  );
}
export default MyDropzone;
