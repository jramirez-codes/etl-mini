import React from "react";
import Button from "@mui/material/Button";
import { Input, Stack, Checkbox, TextField } from "@mui/material";
import { GenericDataGrid } from "@/components/tables/generic-data-grid";

export function SqlNode({
  isQueryPersisting,
  setIsQueryPersisting,
  setCurrQuery,
  sendQuery,
  currEdges,
  selectedNode,
  handleTableTitleChange,
  handleTitleChange
}) {
  // Table List
  const tableList = React.useMemo(() => {
    return currEdges.filter((e) => e.target === selectedNode.id);
  }, [currEdges, selectedNode]);

  return (
    <>
      <Stack
        alignItems="stretch"
        direction="column"
        spacing={1}
        sx={{ height: "100%", p: 1, minHeight: 200 }}
      >
        <input
          onChange={(e) => { handleTitleChange(e.target.value) }}
          style={{ border: 0, fontFamily: 'Roboto', fontSize: 20, fontWeight: 'bold' }}
          value={selectedNode.title}
        />
        <form onSubmit={(e) => { e.preventDefault(); sendQuery(null) }}>
          {tableList.map((obj) => {
            return (
              <Input
                value={obj.sourceDisplayTitle}
                onChange={(e) => {
                  handleTableTitleChange({
                    idx: obj.idx,
                    title: e.target.value
                  })
                }}
                key={obj.id}
                fullWidth
                placeholder={`Table Name - ${obj.sourceTitle}`}
                required
              />
            );
          })}
          <Button
            sx={{ marginTop: '1vh' }}
            startIcon={
              <Checkbox
                size="small"
                checked={isQueryPersisting}
                onClick={() => {
                  setIsQueryPersisting();
                }}
              />
            }
            type="submit"
            fullWidth
          >
            Run Query
          </Button>
        </form>
        <TextField
          fullWidth
          value={selectedNode.nodeData.query}
          onChange={async (e) => {
            // Apply Table Names
            await setCurrQuery(e.target.value);
            if (isQueryPersisting) {
              // Handle Query Persisting
              sendQuery(e.target.value)
            }
          }}
          placeholder='Enter some SQL. No inspiration ? Try "select sqlite_version()"'
          rows={11}
          size="large"
          multiline
        />
        <GenericDataGrid data={selectedNode.nodeData.results} />
      </Stack>
    </>
  );
}
