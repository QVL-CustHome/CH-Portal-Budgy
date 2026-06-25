import { Navigate, Route, Routes } from "react-router-dom";
import RequireBudgy from "./components/RequireBudgy";
import BudgyLayout from "./components/BudgyLayout";
import Home from "./pages/Home";
import Forbidden from "./pages/Forbidden";

export default function App() {
  return (
    <Routes>
      <Route path="/forbidden" element={<Forbidden />} />
      <Route element={<RequireBudgy />}>
        <Route element={<BudgyLayout />}>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Route>
      </Route>
    </Routes>
  );
}
