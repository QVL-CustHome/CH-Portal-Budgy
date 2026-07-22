import { Navigate, Route, Routes } from "react-router-dom";
import RequireBudgy from "./components/RequireBudgy";
import BudgyLayout from "./components/BudgyLayout";
import Home from "./pages/Home";
import RattacherBanque from "./pages/RattacherBanque";
import RattacherBanqueCallback from "./pages/RattacherBanqueCallback";
import MesComptes from "./pages/MesComptes";
import TransactionsCompte from "./pages/TransactionsCompte";
import Transactions from "./pages/Transactions";
import Categories from "./pages/Categories";
import Consentements from "./pages/Consentements";
import Forbidden from "./pages/Forbidden";

export default function App() {
  return (
    <Routes>
      <Route path="/forbidden" element={<Forbidden />} />
      <Route element={<RequireBudgy />}>
        <Route element={<BudgyLayout />}>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/banque" element={<RattacherBanque />} />
          <Route path="/banque/callback" element={<RattacherBanqueCallback />} />
          <Route path="/comptes" element={<MesComptes />} />
          <Route path="/comptes/:accountId" element={<TransactionsCompte />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/consentements" element={<Consentements />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Route>
      </Route>
    </Routes>
  );
}
