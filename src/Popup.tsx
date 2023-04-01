import { MemoryRouter, Routes, Route, Router } from "react-router-dom";
import Notebooks from "./views/notebooks";
import NotebookDetails from "./views/notebook-details";

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <Notebooks />,
//   },
//   {
//     path: "/:id",
//     element: <NotebookDetails />,
//   },
// ]);

function Popup() {
  return (
    <div className="w-96 p-4 rounded-lg bg-white">
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<Notebooks />} />
          <Route path="/:id" element={<NotebookDetails />} />
        </Routes>
      </MemoryRouter>
    </div>
  );
}

export default Popup;
