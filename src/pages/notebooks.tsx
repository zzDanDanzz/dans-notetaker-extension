import { ActionIcon, Button, Menu, TextInput } from "@mantine/core";
import NotebookCard from "../components/notebook-card";
import { useNavigate } from "react-router-dom";
import { useNotebooksStore } from "../store/notebooks-store";
import { useEffect, useMemo, useState } from "react";
// @ts-ignore
import IconSearch from "@tabler/icons-react/dist/esm/icons/IconSearch";
import Fuse from "fuse.js";
import { atom, useAtom } from "jotai";
import MoreOptionsMenu from "../components/more-options-menu";
import { useModalsStore } from "../store/modal-store";
// @ts-ignore
import IconTrash from "@tabler/icons-react/dist/esm/icons/IconTrash";
// @ts-ignore
import IconDownload from "@tabler/icons-react/dist/esm/icons/IconDownload";
import JSZip from "jszip";
import saveAs from "file-saver";

let searchStringAtom = atom("");

const MenuItems = {
  DeleteAll,
  DownloadAll,
};

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

      <div className="flex w-full items-center justify-between">
        <Button variant="outline" color="dark" onClick={() => navigate("/add")}>
          New Notebook
        </Button>
        <MoreOptionsMenu>
          <MenuItems.DeleteAll />
          <MenuItems.DownloadAll />
        </MoreOptionsMenu>
      </div>
    </div>
  );
};

function DeleteAll() {
  const openModal = useModalsStore((s) => s.openModal);
  const notebooks = useNotebooksStore((s) => s.notebooks);
  const [loading, setloading] = useState(false);
  let deleteEverything = useNotebooksStore((s) => s.deleteEverything);

  function openDeleteModal() {
    openModal((close) => {
      return (
        <div className="flex flex-col gap-2">
          <p>Are you sure you want to delete EACH AND EVERY notebook??</p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              color="red"
              loaderPosition="center"
              style={{ color: loading ? "transparent" : undefined }}
              loading={loading}
              onClick={async () => {
                setloading(true);
                await deleteEverything();
                setloading(false);
                close();
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
      disabled={notebooks.length === 0}
    >
      Delete EVERYTHING!
    </Menu.Item>
  );
}

function DownloadAll() {
  const [loading, setloading] = useState(false);
  const notebooks = useNotebooksStore((s) => s.notebooks);

  async function handleDownload() {
    setloading(true);
    const zip = new JSZip();

    for (const nb of notebooks) {
      zip.file(`${nb.title || "Untitled"}.txt`, nb.content || "", {
        date: new Date(nb.timestamps.updated),
      });
    }

    await zip.generateAsync({ type: "blob" }).then(function (content) {
      saveAs(content, `notes_${new Date().toLocaleDateString("en-CA")}.zip`);
    });

    setloading(false);
  }
  return (
    <Menu.Item
      icon={<IconDownload size={14} />}
      onClick={handleDownload}
      disabled={loading}
    >
      Download everything
    </Menu.Item>
  );
}

export default Notebooks;
