interface JSONObj {
  key: string;
  value: string;
}
function parseJSON(jsonString: string): JSONObj[] {
  const json = JSON.parse(jsonString);
  const result: JSONObj[] = [];
  json.forEach((obj: any) => {
    result.push({ key: obj.key, value: obj.value });
  });
  return result;
}

export default parseJSON;
