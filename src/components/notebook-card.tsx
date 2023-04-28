import { Button } from "@mantine/core";
import { Notebook as INotebook } from "../types";
import { useNavigate } from "react-router-dom";

const NotebookCard = ({ notebook }: { notebook: INotebook }) => {
  let navigate = useNavigate();
  let { title } = notebook;
  return (
    <Button
      variant="outline"
      color="dark"
      fullWidth
      className="shrink-0 h-auto"
      classNames={{ label: "flex flex-col justify-center items-start w-full py-2 gap-1" }}
      onClick={() => navigate(`/${notebook.id}`)}
    >
      <span >
        {title === "" ? "Untitled" : title}
      </span>
      <span className="text-xs font-normal text-slate-400">
        updated: {new Date(notebook.timestamps.updated).toLocaleString("en-CA")}
      </span>
    </Button>
  );
};

export default NotebookCard;
