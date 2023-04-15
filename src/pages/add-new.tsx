import { Button, Input, Textarea } from "@mantine/core";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNotebooksStore } from "../store/notebooks-store";
import { v4 as uuid } from "uuid";
import { Notebook } from "../types";

const AddNew = () => {
  let navigate = useNavigate();
  let [title, setTitle] = useState("");
  let [content, setContent] = useState("");
  let addNotebook = useNotebooksStore((s) => s.addNotebook);
  let [isDoneButtonDisabled, setIsDoneButtonDisabled] = useState(true);

  useEffect(() => {
    if (title === "" && content === "") {
      setIsDoneButtonDisabled(true);
      return;
    }

    if (isDoneButtonDisabled) {
      setIsDoneButtonDisabled(false);
    }
  }, [title, content]);

  const add = () => {
    let id = uuid();
    let nb: Notebook = {
      id,
      title,
      content,
    };

    addNotebook(nb);
    navigate('/')
  };

  return (
    <div className="flex flex-col gap-3">
      <h1 className="font-bold">Add new</h1>
      <Input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <div className="flex gap-3">
        <Button
          variant="outline"
          color="dark"
          disabled={isDoneButtonDisabled}
          onClick={add}
        >
          Done
        </Button>
        <Button variant="outline" color="red" onClick={() => navigate("/")}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default AddNew;
