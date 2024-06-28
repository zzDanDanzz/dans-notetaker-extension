import { ActionIcon, Button, Menu, TextInput } from "@mantine/core";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { useNotebooksStore } from "../store/notebooks-store";
import MoreOptionsMenu from "../components/more-options-menu";
import { useModalsStore } from "../store/modal-store";
// @ts-ignore
import IconChevronLeft from "@tabler/icons-react/dist/esm/icons/IconChevronLeft";
// @ts-ignore
import IconTrash from "@tabler/icons-react/dist/esm/icons/IconTrash";
// @ts-ignore
import IconCopy from "@tabler/icons-react/dist/esm/icons/IconCopy";
import Timestamp from "../components/timestamp";
import { useClipboard } from "@mantine/hooks";
import { Notebook } from "../types";
import MenuItem from "../components/menu-item";

const MenuItems = {
  Delete,
  Copy,
};

const NotebookDetails = () => {
  const params = useParams();

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
    updateNotebook({ title, content, id: notebook!.id });
    setInitialTitle(title);
    setInitialContent(content);
    setIsSaveButtonDisabled(true);
  };

  return (
    <div className="flex flex-col items-start gap-3">
      <div className="flex w-full justify-between ">
        <GoBackButton hasMadeChanges={!isSaveButtonDisabled} />
        {notebook && <Timestamp timestamps={notebook.timestamps} />}
      </div>
      {notebook ? (
        <>
          <div className="w-full">
            <TextInput
              placeholder="Title"
              value={title}
              className="w-full font-bold"
              classNames={{ input: "h-auto leading-3" }}
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
          </div>
          <div className="flex w-full items-center justify-between">
            <Button
              variant="outline"
              color="dark"
              disabled={isSaveButtonDisabled}
              onClick={update}
            >
              Save
            </Button>
            <MoreOptionsMenu>
              <MenuItems.Copy notebook={notebook} />
              <MenuItems.Delete notebook={notebook} />
            </MoreOptionsMenu>
          </div>
        </>
      ) : (
        <div>No notebook with this id :(</div>
      )}
    </div>
  );
};

function GoBackButton({ hasMadeChanges }: { hasMadeChanges: boolean }) {
  const navigate = useNavigate();
  const openModal = useModalsStore((s) => s.openModal);

  function handleGoBack() {
    if (hasMadeChanges) {
      openModal((close) => {
        return (
          <div className="flex flex-col gap-2">
            <p>Your unsaved changes will be lost</p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                color="red"
                onClick={() => {
                  close();
                  navigate("/");
                }}
              >
                OK
              </Button>
              <Button
                variant="outline"
                color="dark"
                onClick={() => {
                  close();
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        );
      });
    } else {
      navigate("/");
    }
  }

  return (
    <ActionIcon onClick={handleGoBack} variant="outline" color="dark">
      <IconChevronLeft />
    </ActionIcon>
  );
}

function Delete({ notebook }: { notebook: Notebook }) {
  const openModal = useModalsStore((s) => s.openModal);
  let deleteNotebook = useNotebooksStore((s) => s.deleteNotebook);
  const navigate = useNavigate();

  const delNotebook = () => {
    deleteNotebook(notebook.id);
    navigate("/");
  };

  function openDeleteModal() {
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
                delNotebook();
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
    <MenuItem
      color="red"
      icon={<IconTrash size={14} />}
      onClick={openDeleteModal}
    >
      Delete notebook
    </MenuItem>
  );
}

function Copy({ notebook }: { notebook: Notebook }) {
  const clipboard = useClipboard();

  function handleCopy() {
    clipboard.copy(notebook.content);
  }

  return (
    <MenuItem
      icon={<IconCopy size={14} />}
      onClick={handleCopy}
      disabled={!notebook.content}
    >
      Copy content
    </MenuItem>
  );
}

export default NotebookDetails;
