import { Button, TextInput, Textarea } from "@mantine/core";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { useNotebooksStore } from "../store";

const NotebookDetails = () => {
  const params = useParams();
  const navigate = useNavigate();

  const allNotebooks = useNotebooksStore((s) => s.notebooks);
  const notebook = allNotebooks.find((n) => n.id === params.id);
  const [initialTitle, setInitialTitle] = useState(notebook?.title ?? "");
  const [initialContent, setInitialContent] = useState(notebook?.content ?? "");

  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);

  let [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(true);

  let updateNotebook = useNotebooksStore((s) => s.updateNotebook);

  useEffect(() => {
    if (title === initialTitle && content === initialContent) {
      setIsSaveButtonDisabled(true);
      return;
    }
    if (isSaveButtonDisabled) {
      setIsSaveButtonDisabled(false);
    }
  }, [title, content]);

  const update = () => {
    if (!notebook?.id)
      throw new Error("Failed trying to update notebook. Invalid id.");
    updateNotebook(notebook.id, { title, content });
    setInitialTitle(title);
    setInitialContent(content);
    setIsSaveButtonDisabled(true);
  };

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
          <Button
            variant="outline"
            color="dark"
            disabled={isSaveButtonDisabled}
            onClick={update}
          >
            Save
          </Button>
        </>
      ) : (
        <div>No notebook with this id :(</div>
      )}
    </div>
  );
};

export default NotebookDetails;
