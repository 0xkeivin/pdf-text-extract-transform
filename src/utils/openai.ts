// const { Configuration, OpenAIApi } = require("openai");
import { Configuration, OpenAIApi } from "openai";
const configuration = new Configuration({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API,
});
const openai = new OpenAIApi(configuration);

const processText = async (text: string): Promise<string> => {
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt:
      "Generate a medical health summary in the form of key value pairs in JSON output\n" +
      text,
    temperature: 0.7,
    max_tokens: 512,
    top_p: 1,
    best_of: 5,
    frequency_penalty: 0,
    presence_penalty: 0,
    stop: ["/##"],
  });
  console.log(response.data.choices[0].text);
  if (response.data.choices[0].text === undefined) {
    return "Error";
  }
  return response.data.choices[0].text;
};

export default processText;
