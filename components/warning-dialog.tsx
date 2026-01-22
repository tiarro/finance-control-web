"use client";

import { useIncomeCheck } from "@/contexts/income-check-context";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { AlertTriangle } from "lucide-react";

export function WarningDialog() {
  const { showWarningDialog, setShowWarningDialog } = useIncomeCheck();
  const router = useRouter();

  return (
    <Dialog open={showWarningDialog} onOpenChange={setShowWarningDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-orange-600">
            <AlertTriangle className="h-5 w-5" />
            Peringatan: Tidak Ada Pemasukan
          </DialogTitle>
          <DialogDescription>
            Anda tidak dapat menambahkan transaksi atau anggaran karena total
            pemasukan Anda adalah Rp 0 atau kurang. Silakan tambahkan pemasukan
            terlebih dahulu sebelum melanjutkan.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col md:flex-col sm:flex-row justify-center items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setShowWarningDialog(false);
              router.push("/transactions");
            }}
            className="w-full md:w-full sm:w-auto px-4 py-2 text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors"
          >
            Tambah Pemasukan
          </button>
          <button
            type="button"
            onClick={() => {
              setShowWarningDialog(false);
              router.push("/budgets");
            }}
            className="w-full md:w-full sm:w-auto px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
          >
            Buat Budget
          </button>
          <button
            type="button"
            onClick={() => setShowWarningDialog(false)}
            className="w-full md:w-full sm:w-auto px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            Nanti Saja
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
