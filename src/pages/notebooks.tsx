import { Button, TextInput, ActionIcon } from "@mantine/core";
import NotebookCard from "../components/notebook-card";
import { useNavigate } from "react-router-dom";
import { useNotebooksStore } from "../store/notebooks-store";
import { useEffect, useRef, useState } from "react";
// @ts-ignore
import IconSearch from "@tabler/icons-react/dist/esm/icons/IconSearch";
import Fuse from "fuse.js";
import { Notebook } from "../types";

const Notebooks = () => {
  const notebooks = useNotebooksStore((s) => s.notebooks);
  const retrieveNotebooks = useNotebooksStore((s) => s.retrieveNotebooks);
  let navigate = useNavigate();
  let [searchString, setSearchString] = useState("");

  const fuse = useRef<null | Fuse<Notebook>>(null);

  useEffect(() => {
    fuse.current = new Fuse(notebooks, { keys: ["title", "content"] });
  }, [notebooks]);

  useEffect(() => {
    retrieveNotebooks();
  }, [retrieveNotebooks]);

  return (
    <div className="flex flex-col items-start gap-3">
      <div className="flex w-full items-center justify-between gap-2">
        <h1 className="font-bold">Notebooks</h1>
        <TextInput
          placeholder="fuzzy search"
          size="xs"
          value={searchString}
          onChange={(e) => setSearchString(e.target.value)}
          icon={<IconSearch size={"1rem"} />}
        />
      </div>

      <div className="flex max-h-64 w-full flex-col items-start gap-3 overflow-y-auto py-2">
        {searchString !== "" ? (
          <>
            {fuse.current &&
              fuse.current.search(searchString).map((n) => {
                return <NotebookCard notebook={n.item} key={n.item.id} />;
              })}
          </>
        ) : (
          <>
            {notebooks.map((n) => (
              <NotebookCard notebook={n} key={n.id} />
            ))}
          </>
        )}
      </div>
      <Button variant="outline" color="dark" onClick={() => navigate("/add")}>
        new notebook
      </Button>
    </div>
  );
};

export default Notebooks;
