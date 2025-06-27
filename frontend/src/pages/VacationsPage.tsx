import * as React from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import VacationTable from "./../components/tables/vacation/vacationTable";

export default function CenteredTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const getStatus = () => {
    switch (value) {
      case 0:
        return "pending";
      case 1:
        return "active";
      case 2:
        return "other";
      default:
        return "pending";
    }
  };

  return (
    <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
      <Tabs
        value={value}
        onChange={handleChange}
        sx={{
          "& .MuiTab-root": {
            fontWeight: "bold",
          },
        }}
      >
        <Tab label="На рассмотрении" />
        <Tab label="Актуальные" />
        <Tab label="Архив" />
      </Tabs>
      <VacationTable status={getStatus()} />
    </Box>
  );
}

export const VacationsPage = () => {
  return <CenteredTabs />;
};
