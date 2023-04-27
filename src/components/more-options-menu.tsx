import { Menu, ActionIcon, Button } from "@mantine/core";
// @ts-ignore
import IconDotsVertical from "@tabler/icons-react/dist/esm/icons/IconDotsVertical";
// @ts-ignore
import IconTrash from "@tabler/icons-react/dist/esm/icons/IconTrash";
import { useNotebooksStore } from "../store/notebooks-store";
import { useNavigate } from "react-router-dom";
import { useModalsStore } from "../store/modal-store";

const MoreOptionsMenu = ({ noteBookId }: { noteBookId: string }) => {
  let deleteNotebook = useNotebooksStore((s) => s.deleteNotebook);
  const openModal = useModalsStore((s) => s.openModal);
  const navigate = useNavigate();

  const delNotebook = () => {
    deleteNotebook(noteBookId);
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
    <Menu shadow="md" position="top-end">
      <Menu.Target>
        <ActionIcon variant="outline" color="dark">
          <IconDotsVertical size="1.125rem" />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item
          color="red"
          icon={<IconTrash size={14} />}
          onClick={openDeleteModal}
        >
          Delete notebook
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};



export default MoreOptionsMenu;
