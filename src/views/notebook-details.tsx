import { Button } from "@mantine/core";
import { notebooks } from "../mock-data";
import { useParams, useNavigate } from "react-router-dom";

const NotebookDetails = () => {
  let params = useParams();
  let navigate = useNavigate();
  let nb = notebooks.find((n) => n.id === params.id);

  return (
    <div className="flex flex-col items-start gap-3">
      <Button variant="outline" color="dark" onClick={() => navigate("/")}>
        go back
      </Button>
      {!nb && <div>no nb</div>}
      {nb && (
        <>
          <h1 className="font-bold">{nb.title}</h1>
          <p>{nb.content}</p>
        </>
      )}
    </div>
  );
};

export default NotebookDetails;
