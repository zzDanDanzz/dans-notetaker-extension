import { Button } from "@mantine/core";
import NotebookCard from "../components/notebook-card";
import { notebooks } from "../mock-data";
import { useNavigate } from "react-router-dom";

const Notebooks = () => {
  let navigate = useNavigate();
  return (
    <div className="flex flex-col items-start gap-3">
      <h1 className="font-bold">Notebooks</h1>
      {notebooks.map((n) => (
        <NotebookCard notebook={n} key={n.id} />
      ))}
      <Button
        variant="outline"
        color="dark"
        onClick={() => navigate('/add')}
      >
        new notebook
      </Button>
    </div>
  );
};

export default Notebooks;
