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
}) {
  // Render
  React.useEffect(()=>{},[selectedNode])

  // Table List
  const tableList = React.useMemo(() => {
    return currEdges.filter((e) => e.target === selectedNode.id);
  }, [currEdges, selectedNode]);
  
  // Query Input
  const [localQueryText, setLocalQueryText] = React.useState("")
  React.useEffect(()=>{
    setLocalQueryText(selectedNode.nodeData.query)
  },[])

  // Handle Configure Query Run
  async function handleQueryRun(e) {
    await e.preventDefault()

    // Update Local Query Tables
    setLocalQueryText(query=>{
      // Apply Table Replacements
      let configuredQuery = query
      for(let idx in tableList) {
        configuredQuery = configuredQuery.replaceAll(e.target[idx].value, tableList[idx].source)
      }

      // Send Query Command
      sendQuery(configuredQuery);

      // Update State
      return query
    })
  }

  return (
    <>
      <Stack
        alignItems="stretch"
        direction="column"
        spacing={1}
        sx={{ height: "100%", p: 1, minHeight: 200 }}
      >
        <h3 style={{ margin: 0 }}>{selectedNode.title}</h3>
        <form onSubmit={(e)=>{handleQueryRun(e)}}>
          {tableList.map((obj) => {
            return (
              <Input
                key={obj.id}
                fullWidth
                placeholder="Table Name"
                required
                value={obj.id}
              />
            );
          })}
          <Button
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
          value={localQueryText}
          onChange={(e) => {
            if (isQueryPersisting) {
              // Handle Query Persisting
              sendQuery(e.target.value);
            }
            setLocalQueryText(e.target.value);

            // Apply Table Names
            setCurrQuery(e.target.value);
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
