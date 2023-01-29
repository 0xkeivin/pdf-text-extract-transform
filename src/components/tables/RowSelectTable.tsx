import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  RadioGroup,
  Radio,
} from "@chakra-ui/react";

export interface RowSelectTableProps {
  rowTitles?: string[];
  rowValues?: string[];
  selectedRow: number;
  onChange: (nextVal: string) => void;
}

export const RowSelectTable = ({
  rowTitles = [],
  rowValues = [],
  selectedRow,
  onChange = () => {},
}: RowSelectTableProps) => {
  return (
    <TableContainer w="100%">
      <form>
        {/* <RadioGroup value={selectedRow} onChange={onChange}> */}
        <RadioGroup value={selectedRow.toString()} onChange={onChange}>
          <Table variant="simple" size="lg">
            <Thead>
              <Tr>
                <Th>Keys</Th>
                <Th>Value</Th>
                <Th>Selection</Th>
              </Tr>
            </Thead>
            <Tbody>
              {rowTitles.map((row, idx) => (
                <Tr key={idx}>
                  <Td>{row}</Td>
                  <Td>{rowValues[idx]}</Td>
                  <Td>
                    {/* <Radio value={idx} /> */}
                    <Radio value={idx.toString()} />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </RadioGroup>
      </form>
    </TableContainer>
  );
};
