import { Button, TextInput } from "@mantine/core";
import NotebookCard from "../components/notebook-card";
import { useNavigate } from "react-router-dom";
import { useNotebooksStore } from "../store/notebooks-store";
import { useEffect, useMemo } from "react";
// @ts-ignore
import IconSearch from "@tabler/icons-react/dist/esm/icons/IconSearch";
import Fuse from "fuse.js";
import { atom, useAtom } from "jotai";

let searchStringAtom = atom("");

const Notebooks = () => {
  const notebooks = useNotebooksStore((s) => s.notebooks);
  const retrieveNotebooks = useNotebooksStore((s) => s.retrieveNotebooks);
  let navigate = useNavigate();
  let [searchString, setSearchString] = useAtom(searchStringAtom);

  const fuse = useMemo(
    () => new Fuse(notebooks, { keys: ["title", "content"] }),
    [notebooks]
  );

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
            {fuse?.search(searchString).map((n) => {
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
        New Notebook
      </Button>
    </div>
  );
};

export default Notebooks;
