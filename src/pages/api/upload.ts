// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import pdf from "pdf-parse";
interface Data {
  data: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const hardCodedPath =
    "/Users/keivinc/Documents/sample_health_history_1/tony_stark_health_screen1.pdf";
  // let dataBuffer = fs.readFileSync('path to PDF file...');
  const dataBuffer = fs.readFileSync(hardCodedPath);

  const pdfResult = await pdf(dataBuffer).then(function (data: any): string {
    // number of pages
    console.log(data.numpages);
    // number of rendered pages
    console.log(data.numrender);
    // PDF info
    console.log(data.info);
    // PDF metadata
    console.log(data.metadata);
    // PDF.js version
    // check https://mozilla.github.io/pdf.js/getting_started/
    console.log(data.version);
    // PDF text
    console.log(data.text);

    return JSON.stringify(data.text);
  });
  res.status(200).json({ data: pdfResult });
  // if (!pdfData) {
  //   res.status(500).json({ pdfdata: 'error' })
  // } else {
  //   res.status(200).json({ pdfdata: pdfResult })
  // }
}
