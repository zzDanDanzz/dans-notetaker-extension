import { Button } from "@mantine/core";
import { Notebook as INotebook } from "../types";
import { useNavigate } from "react-router-dom";

const Notebook = ({ notebook }: { notebook: INotebook }) => {
  let navigate = useNavigate();
  return (
    <Button
      variant="outline"
      color="dark"
      fullWidth
      onClick={() => navigate(`/${notebook.id}`)}
    >
      <span>{notebook.title}</span>
    </Button>
  );
};

export default Notebook;
