import { PageContent, useTranslation } from "canopui";
import DashboardGrid from "../components/DashboardGrid";
import SoldesConsolidesBlock from "../components/SoldesConsolidesBlock";

export default function Dashboard() {
  const { t } = useTranslation();

  return (
    <PageContent title={t("budgy.dashboard.title")}>
      <DashboardGrid>
        <SoldesConsolidesBlock />
      </DashboardGrid>
    </PageContent>
  );
}
