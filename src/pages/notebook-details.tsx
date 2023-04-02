import { Button, TextInput, Textarea } from "@mantine/core";
import { notebooks } from "../mock-data";
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import TextareaAutosize from "react-textarea-autosize";

const NotebookDetails = () => {
  const params = useParams();
  const navigate = useNavigate();
  const notebook = notebooks.find((n) => n.id === params.id);
  const [content, setContent] = useState(notebook?.content ?? "");
  const [title, setTitle] = useState(notebook?.title ?? "");

  return (
    <div className="flex flex-col items-start gap-3">
      <Button variant="outline" color="dark" onClick={() => navigate("/")}>
        go back
      </Button>
      {notebook ? (
        <>
          <TextInput
            placeholder="Title"
            value={title}
            className="w-full font-bold"
            variant="unstyled"
            onChange={(ev) => setTitle(ev.target.value)}
          />
          <TextareaAutosize
            className="w-full resize-none outline-none"
            maxRows={8}
            placeholder="Notebook content"
            value={content}
            onChange={(ev) => setContent(ev.target.value)}
          />
        </>
      ) : (
        <div>No notebook with this id :(</div>
      )}
    </div>
  );
};

export default NotebookDetails;
