import { Button } from "@mantine/core";
import NotebookCard from "../components/notebook-card";
import { useNavigate } from "react-router-dom";
import { useNotebooksStore } from "../store/notebooks-store";
import { useEffect } from "react";

const Notebooks = () => {
  const notebooks = useNotebooksStore((s) => s.notebooks);
  const retrieveNotebooks = useNotebooksStore((s) => s.retrieveNotebooks);
  let navigate = useNavigate();

  useEffect(() => {
    retrieveNotebooks();
  }, []);

  return (
    <div className="flex flex-col items-start gap-3">
      <h1 className="font-bold">Notebooks</h1>
      <div className="flex max-h-64 w-full flex-col items-start gap-3 overflow-y-auto py-2">
        {notebooks.map((n) => (
          <NotebookCard notebook={n} key={n.id} />
        ))}
      </div>
      <Button variant="outline" color="dark" onClick={() => navigate("/add")}>
        new notebook
      </Button>
    </div>
  );
};

export default Notebooks;
