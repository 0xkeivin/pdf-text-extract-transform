import { NextApiHandler, NextApiRequest } from "next";
import formidable from "formidable";
import path from "path";
import fs from "fs/promises";

export const config = {
  api: {
    bodyParser: false,
  },
};

const readFile = (
  req: NextApiRequest,
  saveLocally?: boolean
): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
  const options: formidable.Options = {};
  if (saveLocally) {
    options.uploadDir = path.join(process.cwd(), "/public/files");
    options.filename = (name, ext, path, form) => {
      const filePath = Date.now().toString() + "_" + path.originalFilename;
      return filePath;
      // return Date.now().toString() + "_" + path.originalFilename;
    };
  }
  options.maxFileSize = 4000 * 1024 * 1024;
  const form = formidable(options);
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });
};

const handler: NextApiHandler = async (req, res) => {
  try {
    await fs.readdir(path.join(process.cwd() + "/public", "/files"));
  } catch (error) {
    await fs.mkdir(path.join(process.cwd() + "/public", "/files"));
  }
  // await readFile(req, true);
  const { fields, files } = await readFile(req, true);
  // const filePath = files;
  // console.log(filePath)
  

  res.json({ files });
};

export default handler;
