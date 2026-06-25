import { CardGrid, Feedback, PageContent, Stack, useTranslation } from "@custhome/ui";
import FeatureCard from "../components/FeatureCard";
import { useHomeFeatures } from "../hooks/useHomeFeatures";

export default function Home() {
  const { t } = useTranslation();
  const features = useHomeFeatures();

  return (
    <PageContent title={t("budgy.home.title")}>
      <Stack gap="lg">
        <Feedback severity="info">{t("budgy.home.welcome")}</Feedback>
        <CardGrid minItemWidth="18rem" gap="md">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </CardGrid>
      </Stack>
    </PageContent>
  );
}
