import { Notebook } from "../types";

function Timestamp({ timestamps }: { timestamps: Notebook["timestamps"] }) {
  let date = new Date(timestamps.updated).toLocaleString("en-CA");
  let { created, updated } = timestamps;

  return (
    <span className="text-xs font-normal text-slate-400">
      {created === updated ? "created" : "updated"}: {date}
    </span>
  );
}
export default Timestamp;
