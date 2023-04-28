import { Menu, ActionIcon } from "@mantine/core";
// @ts-ignore
import IconDotsVertical from "@tabler/icons-react/dist/esm/icons/IconDotsVertical";
// @ts-ignore
// @ts-ignore
import { PropsWithChildren } from "react";

const MoreOptionsMenu = ({ children }: PropsWithChildren) => {
  return (
    <Menu shadow="md" position="top-end">
      <Menu.Target>
        <ActionIcon variant="outline" color="dark">
          <IconDotsVertical size="1.125rem" />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>{children}</Menu.Dropdown>
    </Menu>
  );
};

export default MoreOptionsMenu;
