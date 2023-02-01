import Head from "next/head";
import { FileUpload } from "@/components/FileUpload";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Textarea, Button, useToast } from "@chakra-ui/react";
import processText from "@/utils/openai";
import { FlexibleFormTable } from "@/components/tables";
import parseJSON from "@/utils/parseJSON";
interface RowDatas {
  rowTitles: string[];
  rowValues: string[];
}
interface PdfTable {
  title: string;
  headers: string[];
  rows: string[][];
}

interface OpenAIResponse {
  key: string;
  value: string;
}

export default function Home() {
  const [pdfText, setPdfText] = useState("");
  const [openAiText, setOpenAiText] = useState("");
  const [loadingOpenAI, setlLoadingOpenAI] = useState<boolean>(false);
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
    // const url2 = "http://localhost:5001/processpdf";
    const url2 = "http://13.229.230.171/processpdf";
    const axiosConfig = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    const singleFile = data?.item(0);
    const formData = new FormData();
    formData.append("file", singleFile as Blob);
    console.log(singleFile);
    await axios.post(url2, formData, axiosConfig).then((res) => {
      if (res.status === 200) {
        console.log("success");
        setPdfText(res.data.data);
        console.log(pdfText);
      } else {
        console.log("error");
        setPdfText("something went wrong :(");
      }
    });
    // await axios.get("/api/upload").then((res) => {
    //   if (res.status === 200) {
    //     console.log("success");
    //     setPdfText(res.data.data);
    //   } else {
    //     console.log("error");
    //     setPdfText("something went wrong :(");
    //   }
    // });
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
  // transpose rowData to PDFTable format
  const createPDFTableFromOpenAIResp = (
    pdfTitle: string,
    openAIResp: string
  ): PdfTable => {
    const parsedObj: OpenAIResponse[] = JSON.parse(openAIResp);
    const tableData: PdfTable = {
      title: pdfTitle,
      headers: ["key", "value"],
      rows: [],
    };
    for (const obj of parsedObj) {
      tableData.rows.push([obj.key, obj.value]);
    }
    console.log(`tableData: ${JSON.stringify(tableData)} `);
    return tableData;
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
  const handleGeneratePdf = async () => {
    const url2 = "http://localhost:5001/createpdf";
    const axiosConfig = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    // const tableData: PdfTable = {
    //   headers: rowData.rowTitles,
    //   rows: [rowData.rowValues],
    // };

    // console.log(tableData);
    // const tableDataJson = JSON.stringify(tableData);
    // console.log(`tableDataJson:${tableDataJson}`);
    // console.log(`${tableDataJson}`);

    const pdfTableData = createPDFTableFromOpenAIResp("tony_stark", openAiText);
    await axios
      .post(
        url2,
        // tableDataJson,
        {
          data: JSON.stringify(pdfTableData),
        },
        axiosConfig
      )
      .then((res) => {
        if (res.status === 200) {
          console.log("createpdf success");
          // console.log(res.data.data);
          console.log(res)
          const blob = new Blob([res.data], {
            type: "application/pdf",
          });
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = "tony_stark1.pdf";
          link.click();
        } else {
          console.log("something went wrong with /createpdf :(");
        }
      });
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputValue = e.target.value;
    setPdfText(inputValue);
  };
  useEffect(() => {
    // axios.get("/api/hello").then((res) => {
    //   console.log(res.data);
    // });

    const url = "http://localhost:5001/";
    axios.get(url).then((res) => {
      console.log(res.data);
    });

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
      <Button onClick={handleGeneratePdf}>Generate PDF</Button>
      <FlexibleFormTable onChange={onDataChange} rowData={rowData} />
    </>
  );
}
