import { Notebook as INotebook } from "../types";
import { useNavigate } from "react-router-dom";

const Notebook = ({ notebook }: { notebook: INotebook }) => {
  let navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/${notebook.id}`)}
      className="p-4 border border-slate-700 rounded hover:bg-slate-400"
    >
      <span>{notebook.title}</span>
    </div>
  );
};

export default Notebook;
