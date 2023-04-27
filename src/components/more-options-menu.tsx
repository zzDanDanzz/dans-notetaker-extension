import { Menu, ActionIcon, Button } from "@mantine/core";
// @ts-ignore
import IconDotsVertical from "@tabler/icons-react/dist/esm/icons/IconDotsVertical";
// @ts-ignore
import IconTrash from "@tabler/icons-react/dist/esm/icons/IconTrash";
// @ts-ignore
import IconCopy from "@tabler/icons-react/dist/esm/icons/IconCopy";
import { useNotebooksStore } from "../store/notebooks-store";
import { useNavigate } from "react-router-dom";
import { useModalsStore } from "../store/modal-store";
import { Notebook } from "../types";
import { useClipboard } from "@mantine/hooks";

const MenuItems = {
  Delete,
  Copy,
};

const MoreOptionsMenu = ({ notebook }: { notebook: Notebook }) => {
  return (
    <Menu shadow="md" position="top-end">
      <Menu.Target>
        <ActionIcon variant="outline" color="dark">
          <IconDotsVertical size="1.125rem" />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        <MenuItems.Copy notebook={notebook} />
        <MenuItems.Delete notebook={notebook} />
      </Menu.Dropdown>
    </Menu>
  );
};

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
    <Menu.Item
      color="red"
      icon={<IconTrash size={14} />}
      onClick={openDeleteModal}
    >
      Delete notebook
    </Menu.Item>
  );
}

function Copy({ notebook }: { notebook: Notebook }) {
  const clipboard = useClipboard();

  function handleCopy() {
    clipboard.copy(notebook.content);
  }

  return (
    <Menu.Item
      icon={<IconCopy size={14} />}
      onClick={handleCopy}
      disabled={!notebook.content}
    >
      Copy content
    </Menu.Item>
  );
}

export default MoreOptionsMenu;
