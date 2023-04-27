import { Button, TextInput } from "@mantine/core";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { useNotebooksStore } from "../store/notebooks-store";
import DeleteMenu from "../components/delete-menu";
import { useModalsStore } from "../store/modal-store";

const NotebookDetails = () => {
  const params = useParams();
  const navigate = useNavigate();
  const openModal = useModalsStore((s) => s.openModal);

  const allNotebooks = useNotebooksStore((s) => s.notebooks);
  const notebook = allNotebooks.find((n) => n.id === params.id);
  const [initialTitle, setInitialTitle] = useState(notebook?.title ?? "");
  const [initialContent, setInitialContent] = useState(notebook?.content ?? "");

  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);

  let [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(true);

  let updateNotebook = useNotebooksStore((s) => s.updateNotebook);
  let deleteNotebook = useNotebooksStore((s) => s.deleteNotebook);

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
    updateNotebook(notebook!.id, { title, content });
    setInitialTitle(title);
    setInitialContent(content);
    setIsSaveButtonDisabled(true);
  };

  const remove = () => {
    deleteNotebook(notebook!.id);
    navigate("/");
  };

  function openRemoveModal() {
    openModal((close) => {
      return (
        <div className="flex flex-col gap-2">
          <p>Are you sure you want to remove this note?</p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              color="red"
              onClick={() => {
                close();
                remove();
              }}
            >
              Yes
            </Button>
            <Button
              variant="outline"
              color="dark"
              onClick={() => {
                close();
              }}
            >
              No
            </Button>
          </div>
        </div>
      );
    });
  }

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
          <div className="flex w-full items-center justify-between">
            <Button
              variant="outline"
              color="dark"
              disabled={isSaveButtonDisabled}
              onClick={update}
            >
              Save
            </Button>
            <DeleteMenu onDelete={openRemoveModal} />
          </div>
        </>
      ) : (
        <div>No notebook with this id :(</div>
      )}
    </div>
  );
};

export default NotebookDetails;
