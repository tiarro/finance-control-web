"use client";

import { createContext, useContext, ReactNode, useState } from "react";

interface IncomeCheckContextType {
  totalIncome: number;
  setTotalIncome: (income: number) => void;
  checkIncomeAndNavigate: (destination: string, navigate: () => void) => void;
  showWarningDialog: boolean;
  setShowWarningDialog: (show: boolean) => void;
}

const IncomeCheckContext = createContext<IncomeCheckContextType | undefined>(undefined);

export function IncomeCheckProvider({ children }: { children: ReactNode }) {
  const [totalIncome, setTotalIncome] = useState(0);
  const [showWarningDialog, setShowWarningDialog] = useState(false);

  const checkIncomeAndNavigate = (destination: string, navigate: () => void) => {
    if (totalIncome <= 0) {
      setShowWarningDialog(true);
    } else {
      navigate();
    }
  };

  return (
    <IncomeCheckContext.Provider
      value={{
        totalIncome,
        setTotalIncome,
        checkIncomeAndNavigate,
        showWarningDialog,
        setShowWarningDialog,
      }}
    >
      {children}
    </IncomeCheckContext.Provider>
  );
}

export function useIncomeCheck() {
  const context = useContext(IncomeCheckContext);
  if (context === undefined) {
    throw new Error("useIncomeCheck must be used within an IncomeCheckProvider");
  }
  return context;
}
