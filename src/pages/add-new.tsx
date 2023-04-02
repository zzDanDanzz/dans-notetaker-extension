import { Button, Input, Textarea } from "@mantine/core";
import { useNavigate } from "react-router-dom";

const AddNew = () => {
  let navigate = useNavigate();
  return (
    <div className="flex flex-col gap-3">
      <h1 className="font-bold">Add new</h1>
      <Input placeholder="Title" />
      <Textarea placeholder="Content" withAsterisk />
      <div className="flex gap-3">
        <Button variant="outline" color="dark">
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
