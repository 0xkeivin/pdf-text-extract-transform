import Head from "next/head";
import { FileUpload } from "@/components/FileUpload";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Textarea, Button, useToast } from "@chakra-ui/react";
import processText from "@/utils/openai";
import { FlexibleFormTable } from "@/components/tables";
import parseJSON from "@/utils/parseJSON";
import { json } from "stream/consumers";
interface RowDatas {
  rowTitles: string[];
  rowValues: string[];
}

interface PdfFormObj {
  files: {
    pdfFile: {
      size: number;
      filepath: string;
      newFilename: string;
      mimetype: string;
      mtime: string;
      originalFilename: string;
    }
  };
}
export default function Home() {
  const [pdfText, setPdfText] = useState("");
  const [openAiText, setOpenAiText] = useState("");
  const [loadingOpenAI, setlLoadingOpenAI] = useState<boolean>(false);
  const [pdfFilePath, setPdfFilePath] = useState<string>('')
  
  const toast = useToast();
  // form panel
  const [rowData, setRowData] = useState<RowDatas>({
    rowTitles: [],
    rowValues: [],
  });

  const onDataChange = (data: RowDatas) => {
    setRowData(data);
    // console.log(`row data: ${JSON.stringify(rowData)}`);
  };
  const uploadHandler = async (data: FileList | null) => {
    console.log(data);
    // await axios.get("/api/upload").then((res) => {
    //   if (res.status === 200) {
    //     console.log("success");
    //     setPdfText(res.data.data);
    //   } else {
    //     console.log("error");
    //     setPdfText("something went wrong :(");
    //   }
    // });
    // test /uploadfile
    const selectedFile = data?.item(0);
    try {
      if (!selectedFile) {
        return;
      }
      const formData = new FormData();
      formData.append("pdfFile", selectedFile);
      const { data } = await axios.post("/api/uploadfile", formData);
      const jsonVal = JSON.stringify(data);
      console.log(jsonVal);
      const jsonObj: PdfFormObj = JSON.parse(jsonVal);
      // final path 
      const finalPath = jsonObj.files.pdfFile.filepath;
      console.log(finalPath);
      if (finalPath) {
        setPdfFilePath(finalPath);
        console.log(`pdfFilePath: ${pdfFilePath}`)
        await axios.get(`/api/extract-pdf-text?filepath=${pdfFilePath}`).then((res) => {
            if (res.status === 200) {
              console.log("success");
              setPdfText(res.data.data);
            } else {
              console.log("error");
              setPdfText("something went wrong :(");
            }
          });
      }
    } catch (e) {
      console.log(e);
    }
  };

  // map JSONObj to rowData
  const mapJSONObjToRowData = (jsonString: string): RowDatas => {
    const jsonObj = parseJSON(jsonString);
    jsonObj.forEach((obj) => {
      rowData.rowTitles.push(obj.key);
      rowData.rowValues.push(obj.value);
    });
    console.log(`rowData: ${JSON.stringify(rowData)}`);
    return rowData;
  };
  // handlers
  const handleSubmit = async () => {
    setlLoadingOpenAI(true);
    if (pdfText === "") {
      console.log("nothing to submit");
      return;
    }
    const { respText, respStatus } = await processText(pdfText);
    if (respStatus) {
      setOpenAiText(respText);
      toast({
        title: "Success",
        description: "OpenAI has processed your text",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      // map json to rowData
      console.log(respText);
      const rowData = mapJSONObjToRowData(respText);
      setRowData(rowData);
      console.log(`rowData: ${JSON.stringify(rowData)}`);
    } else {
      console.log("error");
      toast({
        title: "Failed",
        description: "OpenAI failed us :(",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputValue = e.target.value;
    setPdfText(inputValue);
  };
  useEffect(() => {
    // axios.get("/api/hello").then((res) => {
    //   console.log(res.data);
    // });
    if (loadingOpenAI) {
      toast({
        title: "Processing",
        description: "OpenAI is processing your text",
        status: "info",
        duration: 2000,
        isClosable: true,
      });
    }
  }, [loadingOpenAI]);

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
        readOnly={true} // this prevents warnings
        // onChange={() => {
        //   null;
        // }}
        size="xl"
        height={500}
        width={800}
      />
      <Button onClick={handleSubmit}>Process OpenAI</Button>
      <FlexibleFormTable onChange={onDataChange} rowData={rowData} />
    </>
  );
}
