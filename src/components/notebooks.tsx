import { nbs } from "../mock-data";

const Notebooks = () => {
  return (
    <div className="flex flex-col gap-3 ">
      {nbs.map((n) => (
        <div
          key={n.id}
          className="p-4 border border-slate-700 rounded hover:bg-slate-400"
        >
          <span>{n.title}</span>
        </div>
      ))}
    </div>
  );
};

export default Notebooks;
