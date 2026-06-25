import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { apiErrorMessage, useTranslation } from "@custhome/ui";
import { ApiError } from "../api/client";
import {
  completerConsentement,
  type ConsentCompletion,
} from "../api/budgy";

type CallbackStatus = "pending" | "success" | "error";

interface UseConsentementCallbackResult {
  status: CallbackStatus;
  result: ConsentCompletion | null;
  errorMessage: string | null;
}

export function useConsentementCallback(): UseConsentementCallbackResult {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<CallbackStatus>("pending");
  const [result, setResult] = useState<ConsentCompletion | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const complete = useCallback(
    async (code: string, state: string) => {
      setStatus("pending");
      setErrorMessage(null);
      try {
        const completion = await completerConsentement(code, state);
        setResult(completion);
        setStatus("success");
      } catch (error) {
        const errorCode = error instanceof ApiError ? error.code : undefined;
        setErrorMessage(apiErrorMessage(t, errorCode, t("budgy.callback.error")));
        setStatus("error");
      }
    },
    [t]
  );

  useEffect(() => {
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    if (!code || !state) {
      setErrorMessage(t("budgy.callback.missingParams"));
      setStatus("error");
      return;
    }
    void complete(code, state);
  }, [searchParams, complete, t]);

  return { status, result, errorMessage };
}
