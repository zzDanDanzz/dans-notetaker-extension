import Notebook from "../components/notebook";
import { notebooks } from "../mock-data";

const Notebooks = () => {
  return (
    <div className="flex flex-col gap-3 ">
      {notebooks.map((n) => (
        <Notebook notebook={n} key={n.id} />
      ))}
    </div>
  );
};

export default Notebooks;
