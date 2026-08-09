import { useCallback, useEffect, useState } from "react";
import { apiErrorMessage, useTranslation } from "canopui";
import { ApiError } from "../api/client";
import { definirJourDebutMois, getPreferences } from "../api/budgy";

export interface JourDebutMoisState {
  jour: number;
  loading: boolean;
  saving: boolean;
  error: string | null;
  enregistre: boolean;
  definir: (jour: number) => Promise<void>;
}

/**
 * Jour où commence le mois budgétaire.
 *
 * Le 1er reste la valeur par défaut : tant que rien n'est réglé, le découpage
 * est celui du calendrier et rien ne change pour l'utilisateur.
 */
export function useJourDebutMois(): JourDebutMoisState {
  const { t } = useTranslation();
  const [jour, setJour] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [enregistre, setEnregistre] = useState(false);

  useEffect(() => {
    let actif = true;
    getPreferences()
      .then((prefs) => {
        if (actif) setJour(prefs.jour_debut_mois);
      })
      .catch((e: unknown) => {
        const code = e instanceof ApiError ? e.code : undefined;
        if (actif) {
          setError(apiErrorMessage(t, code, t("budgy.monthStart.loadError")));
        }
      })
      .finally(() => {
        if (actif) setLoading(false);
      });
    return () => {
      actif = false;
    };
  }, [t]);

  const definir = useCallback(
    async (valeur: number) => {
      setSaving(true);
      setError(null);
      setEnregistre(false);
      try {
        const prefs = await definirJourDebutMois(valeur);
        setJour(prefs.jour_debut_mois);
        setEnregistre(true);
      } catch (e: unknown) {
        const code = e instanceof ApiError ? e.code : undefined;
        setError(apiErrorMessage(t, code, t("budgy.monthStart.saveError")));
      } finally {
        setSaving(false);
      }
    },
    [t]
  );

  return { jour, loading, saving, error, enregistre, definir };
}
