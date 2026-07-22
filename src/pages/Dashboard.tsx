import { PageContent, useTranslation } from "canopui";
import DashboardGrid from "../components/DashboardGrid";
import SoldesConsolidesBlock from "../components/SoldesConsolidesBlock";
import ResteADepenserBlock from "../components/ResteADepenserBlock";
import PrevisionnelBlock from "../components/PrevisionnelBlock";
import ExpensesByCategoryBlock from "../components/ExpensesByCategoryBlock";

export default function Dashboard() {
  const { t } = useTranslation();

  return (
    <PageContent title={t("budgy.dashboard.title")}>
      <DashboardGrid>
        <SoldesConsolidesBlock />
        <ResteADepenserBlock />
        <PrevisionnelBlock />
        <ExpensesByCategoryBlock />
      </DashboardGrid>
    </PageContent>
  );
}
