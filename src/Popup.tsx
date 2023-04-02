import { MemoryRouter, Routes, Route, Router } from "react-router-dom";
import Notebooks from "./views/notebooks";
import NotebookDetails from "./views/notebook-details";
import AddNew from "./views/add-new";

function Popup() {
  return (
    <div className="w-96 p-4 rounded-lg bg-white">
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
