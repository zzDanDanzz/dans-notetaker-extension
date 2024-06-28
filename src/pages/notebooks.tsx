import { Anchor, Button, TextInput } from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import TextareaAutosize from "react-textarea-autosize";
import NotebookCard from "../components/notebook-card";
import { useNotebooksStore } from "../store/notebooks-store";
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

// @ts-ignore
import IconSeparator from "@tabler/icons-react/dist/esm/icons/IconSeparator";

// @ts-ignore
import IconInfoCircle from "@tabler/icons-react/dist/esm/icons/IconInfoCircle";

import saveAs from "file-saver";
import JSZip from "jszip";
import MenuItem from "../components/menu-item";
import {
  getSeperatorFromStorage,
  writeSeperatorToStorage,
} from "../lib/storage";

let searchStringAtom = atom("");

const MenuItems = {
  DeleteAll,
  DownloadAll,
  EditSeparator,
  About,
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

      <div className="flex max-h-64 min-h-[9rem] w-full flex-col items-start gap-3 overflow-y-auto py-2">
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
          <MenuItems.EditSeparator />
          <MenuItems.DeleteAll />
          <MenuItems.DownloadAll />
          <MenuItems.About />
        </MoreOptionsMenu>
      </div>
    </div>
  );
};

function About() {
  const openModal = useModalsStore((s) => s.openModal);

  function openAboutModal() {
    openModal((close) => {
      return (
        <div className="flex flex-col gap-2">
          <span>
            made with ❤️ by{" "}
            <Anchor href="https://zzdandanzz.github.io/" target="_blank">
              Dan
            </Anchor>
          </span>
          <Button variant="outline" color="dark" type="submit" onClick={close}>
            Ok
          </Button>
        </div>
      );
    });
  }
  return (
    <MenuItem
      style={{ fontSize: "0.75rem" }}
      icon={<IconInfoCircle size={14} />}
      onClick={openAboutModal}
    >
      About
    </MenuItem>
  );
}

function EditSeparator() {
  const openModal = useModalsStore((s) => s.openModal);
  const [separatorDefaultValue, setSeparatorDefaultValue] = useState("");

  useEffect(() => {
    getSeperatorFromStorage().then((s) => setSeparatorDefaultValue(s));
  }, []);

  function openEditSeparatorModal() {
    openModal((close) => {
      const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const { separator = "" } = Object.fromEntries(
          new FormData(e.currentTarget)
        ) as any;
        writeSeperatorToStorage(separator);
        close();
      };

      return (
        <form onSubmit={onSubmit}>
          <div className="flex flex-col gap-2">
            <TextareaAutosize
              className="w-full resize-none outline-none"
              maxRows={3}
              placeholder="separator"
              name="separator"
              defaultValue={separatorDefaultValue}
            />
            <div className="flex gap-2">
              <Button variant="outline" color="dark" type="submit">
                Save
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
        </form>
      );
    });
  }
  return (
    <MenuItem
      style={{ fontSize: "0.75rem" }}
      icon={<IconSeparator size={14} />}
      onClick={openEditSeparatorModal}
    >
      Edit separator
    </MenuItem>
  );
}

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
    <MenuItem
      color="red"
      icon={<IconTrash size={14} />}
      onClick={openDeleteModal}
      disabled={notebooks.length === 0}
    >
      Delete EVERYTHING!
    </MenuItem>
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
    <MenuItem
      icon={<IconDownload size={14} />}
      onClick={handleDownload}
      disabled={loading}
    >
      Download everything
    </MenuItem>
  );
}

export default Notebooks;
