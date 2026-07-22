import { PageContent, useTranslation } from "canopui";
import DashboardGrid from "../components/DashboardGrid";
import SoldesConsolidesBlock from "../components/SoldesConsolidesBlock";
import ExpensesByCategoryBlock from "../components/ExpensesByCategoryBlock";

export default function Dashboard() {
  const { t } = useTranslation();

  return (
    <PageContent title={t("budgy.dashboard.title")}>
      <DashboardGrid>
        <SoldesConsolidesBlock />
        <ExpensesByCategoryBlock />
      </DashboardGrid>
    </PageContent>
  );
}
