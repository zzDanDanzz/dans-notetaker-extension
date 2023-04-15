import { MemoryRouter, Routes, Route, Router } from "react-router-dom";
import Notebooks from "../pages/notebooks";
import NotebookDetails from "../pages/notebook-details";
import AddNew from "../pages/add-new";
import Modal from "./modal";

function Popup() {
  return (
    <div className="relative w-96 rounded-lg bg-white p-4">
      <Modal />
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/add" element={<AddNew />} />
          <Route path="/:id" element={<NotebookDetails />} />
          <Route path="/" element={<Notebooks />} />
        </Routes>
      </MemoryRouter>
    </div>
  );
}

export default Popup;
