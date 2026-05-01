import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import FormsList from "./pages/FormsList.jsx";
import CreateForm from "./pages/CreateForm.jsx";
import FillForm from "./pages/FillForm.jsx";
import Responses from "./pages/Responses.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Navigate to="/admin" replace />} />
          <Route path="/admin" element={<FormsList />} />
          <Route path="/admin/create" element={<CreateForm />} />
          <Route path="/admin/responses/:formId" element={<Responses />} />
          <Route path="/form/:id" element={<FillForm />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
