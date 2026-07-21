import { useCallback, useEffect, useState } from "react";
import { apiErrorMessage, useTranslation } from "canopui";
import { ApiError } from "../api/client";
import { listCategories, type Category } from "../api/budgy";

interface UseCategoriesResult {
  categories: Category[];
  loading: boolean;
  error: string | null;
  reload: () => void;
}

export function useCategories(): UseCategoriesResult {
  const { t } = useTranslation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await listCategories();
      setCategories(response.data);
    } catch (caught) {
      const code = caught instanceof ApiError ? caught.code : undefined;
      setError(apiErrorMessage(t, code, t("budgy.categories.error")));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    void load();
  }, [load]);

  return {
    categories,
    loading,
    error,
    reload: () => void load(),
  };
}
