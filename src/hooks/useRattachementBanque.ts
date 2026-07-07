import { useCallback, useEffect, useState } from "react";
import { apiErrorMessage, useTranslation } from "canopui";
import { ApiError } from "../api/client";
import {
  initierConsentement,
  listBanks,
  type Bank,
} from "../api/budgy";
import { navigateTo } from "../lib/navigation";

interface UseRattachementBanqueResult {
  banks: Bank[];
  selectedBankId: string | null;
  selectBank: (bankId: string | null) => void;
  loadingBanks: boolean;
  banksError: string | null;
  connecting: boolean;
  connectError: string | null;
  reloadBanks: () => void;
  connect: () => void;
}

export function useRattachementBanque(): UseRattachementBanqueResult {
  const { t } = useTranslation();
  const [banks, setBanks] = useState<Bank[]>([]);
  const [selectedBankId, setSelectedBankId] = useState<string | null>(null);
  const [loadingBanks, setLoadingBanks] = useState(true);
  const [banksError, setBanksError] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [connectError, setConnectError] = useState<string | null>(null);

  const loadBanks = useCallback(async () => {
    setLoadingBanks(true);
    setBanksError(null);
    try {
      const response = await listBanks();
      setBanks(response.data);
    } catch (error) {
      const code = error instanceof ApiError ? error.code : undefined;
      setBanksError(apiErrorMessage(t, code, t("budgy.bank.banksError")));
    } finally {
      setLoadingBanks(false);
    }
  }, [t]);

  useEffect(() => {
    void loadBanks();
  }, [loadBanks]);

  const connect = useCallback(async () => {
    if (!selectedBankId) {
      return;
    }
    setConnecting(true);
    setConnectError(null);
    try {
      const { authorization_url } = await initierConsentement(selectedBankId);
      navigateTo(authorization_url);
    } catch (error) {
      const code = error instanceof ApiError ? error.code : undefined;
      setConnectError(apiErrorMessage(t, code, t("budgy.bank.connectError")));
      setConnecting(false);
    }
  }, [selectedBankId, t]);

  return {
    banks,
    selectedBankId,
    selectBank: setSelectedBankId,
    loadingBanks,
    banksError,
    connecting,
    connectError,
    reloadBanks: () => void loadBanks(),
    connect: () => void connect(),
  };
}
