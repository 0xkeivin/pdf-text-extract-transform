// const { Configuration, OpenAIApi } = require("openai");
import { Configuration, OpenAIApi } from "openai";
const configuration = new Configuration({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API,
});
const openai = new OpenAIApi(configuration);
interface Resp {
  respText: string;
  respStatus: boolean;
}

const processText = async (text: string): Promise<Resp> => {
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt:
      'Generate a JSON output in the structure of [{"key":key,"value": value}] for the identified fields \n' +
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

  if (
    response.status !== 200 ||
    response.data.choices[0].text === "" ||
    response.data.choices[0].text === undefined
  ) {
    return {
      respText: "Error",
      respStatus: false,
    };
  }
  return {
    respText: response.data.choices[0].text,
    respStatus: true,
  };
};

export default processText;
