import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "@/styles/Home.module.css";
import { FileUpload } from "@/components/FileUpload";
import axios from "axios";
import React, { useEffect } from "react";
import { Textarea, Button } from "@chakra-ui/react";
import { useState } from "react";
import { ChangeEventHandler } from "react";
import processText from "@/utils/openai"; '@utils/openai'
const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [pdfText, setPdfText] = useState("");
  const [openAiText, setOpenAiText] = useState("");

  const uploadHandler = (data: FileList | null) => {
    console.log(data);
    axios.get("/api/upload").then((res) => {
      if (res.status === 200) {
        console.log("success");
        setPdfText(res.data.data);
      } else {
        console.log("error");
        setPdfText("something went wrong :(");
      }
    });
  };

  const handleSubmit = async () => {
    if (pdfText === "") {
      console.log("nothing to submit");
      return;
    }
    const processedText = await processText(pdfText);
    if (processedText) {
      setOpenAiText(processedText);
    } else {
      console.log("error");
    }

  };
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    let inputValue = e.target.value;
    setPdfText(inputValue);
  };
  useEffect(() => {
    axios.get("/api/hello").then((res) => {
      console.log(res.data);
    });
  }, []);

  return (
    <>
      <Head> PDF to Image to Text ? </Head>
      <FileUpload
        accept="application/pdf"
        // onFileUploaded={(data) => {
        //   console.log(data);
        // }}
        onFileUploaded={uploadHandler}
      />
      <Textarea
        placeholder="Placeholder"
        value={pdfText}
        onChange={handleInputChange}
        size="xl"
        height={500}
        width={800}
      />
      <Textarea
        placeholder="Placeholder"
        value={openAiText}
        // onChange={handleInputChange}
        size="xl"
        height={500}
        width={800}
        />
        <Button
        onClick={handleSubmit}
        >Process OpenAI</Button>
    </>
  );
}
