import { notebooks } from "../mock-data";
import { useParams, useNavigate } from "react-router-dom";


const NotebookDetails = () => {
  let params = useParams();
  let navigate = useNavigate();
  let nb = notebooks.find((n) => n.id === params.id);

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
