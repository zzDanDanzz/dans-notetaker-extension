import INotebook from "../components/notebook";
import { nbs } from "../mock-data";

const Notebooks = () => {
  return (
    <div className="flex flex-col gap-3 ">
      {nbs.map((n) => (
        <INotebook notebook={n} />
      ))}
    </div>
  );
};

export default Notebooks;
