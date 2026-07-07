import { CardGrid } from "canopui";
import type { Consent } from "../api/budgy";
import ConsentementCard from "./ConsentementCard";

export interface ConsentementsListProps {
  consents: Consent[];
  renewingConsentId: string | null;
  onRenew: (consentId: string) => void;
}

export default function ConsentementsList({
  consents,
  renewingConsentId,
  onRenew,
}: ConsentementsListProps) {
  return (
    <CardGrid minItemWidth="20rem" gap="md">
      {consents.map((consent) => (
        <ConsentementCard
          key={consent.consent_id}
          consent={consent}
          renewing={renewingConsentId === consent.consent_id}
          renewDisabled={
            renewingConsentId !== null &&
            renewingConsentId !== consent.consent_id
          }
          onRenew={onRenew}
        />
      ))}
    </CardGrid>
  );
}
