import { Menu, ActionIcon } from "@mantine/core";
import { IconDotsVertical, IconTrash } from "@tabler/icons-react";

const DeleteMenu = ({ onDelete }: { onDelete: () => void }) => {
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
          onClick={onDelete}
        >
          Delete notebook
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default DeleteMenu;
