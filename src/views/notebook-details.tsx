import { nbs } from "../mock-data";
import { useParams, useNavigate } from "react-router-dom";

let nb = nbs[0];

const NotebookDetails = () => {
  let params = useParams();
  let navigate = useNavigate();
  let nb = nbs.find((n) => n.id === params.id);

  return (
    <div>
      <button onClick={() => navigate("/")}>go back</button>
      {!nb && <div>no nb</div>}
      {nb && (
        <>
          <h1>{nb.title}</h1>
          <p>{nb.content}</p>
        </>
      )}
    </div>
  );
};

export default NotebookDetails;
