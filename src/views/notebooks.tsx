import { Button } from "@mantine/core";
import Notebook from "../components/notebook";
import { notebooks } from "../mock-data";

const Notebooks = () => {
  return (
    <div className="flex flex-col items-start gap-3">
      <h1 className="font-bold">Notebooks</h1>
      {notebooks.map((n) => (
        <Notebook notebook={n} key={n.id} />
      ))}
      <Button variant="outline" color="dark">
        new notebook
      </Button>
    </div>
  );
};

export default Notebooks;
