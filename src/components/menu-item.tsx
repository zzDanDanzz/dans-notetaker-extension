import { Menu, MenuItemProps } from "@mantine/core";
import { PolymorphicComponentProps } from "@mantine/utils";

function MenuItem(props: PolymorphicComponentProps<"button", MenuItemProps>) {
  return <Menu.Item style={{ fontSize: "0.75rem" }} {...props} />;
}

export default MenuItem;
