import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "@/styles/Home.module.css";
import { FileUpload } from "@/components/FileUpload";
import axios from "axios";
import { useEffect } from "react";
import {Textarea} from "@chakra-ui/react"
import {useState} from "react"
const inter = Inter({ subsets: ["latin"] });


export default function Home() {
  const [pdfText, setPdfText] = useState("")

const uploadHandler = (data: FileList | null) => {
  console.log(data);
  axios.get("/api/upload").then((res) => {
    if (res.status === 200) {
      console.log("success");
      setPdfText(res.data.data)
    } else {
      console.log("error");
      setPdfText("something went wrong :(")
    }
  });
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
      />
    </>
  );
}
