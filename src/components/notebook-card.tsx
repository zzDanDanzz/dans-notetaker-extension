import { Button } from "@mantine/core";
import { Notebook as INotebook } from "../types";
import { useNavigate } from "react-router-dom";
import Timestamp from "./timestamp";

const NotebookCard = ({ notebook }: { notebook: INotebook }) => {
  let navigate = useNavigate();
  let { title, id, timestamps } = notebook;

  return (
    <Button
      variant="outline"
      color="dark"
      fullWidth
      className="h-auto shrink-0"
      classNames={{
        label: "flex flex-col justify-center items-start w-full py-2 gap-1",
      }}
      onClick={() => navigate(`/${id}`)}
    >
      <span>{title === "" ? "Untitled" : title}</span>
      <Timestamp timestamps={timestamps} />
    </Button>
  );
};

export default NotebookCard;
