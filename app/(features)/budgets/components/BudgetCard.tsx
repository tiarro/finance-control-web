import React from "react";
import { LucideIcon, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils"; // Fungsi bawaan shadcn untuk gabung class
import { formatRupiah } from "@/utils/format/formatRupiah";

interface BudgetCardProps {
  name: string;
  icon: LucideIcon;
  limit: number;
  spent: number;
  onClick?: () => void;
}

const BudgetCard = ({
  name,
  icon: Icon,
  limit,
  spent,
  onClick,
}: BudgetCardProps) => {
  const percentage = Math.min((spent / limit) * 100, 100);
  const isOverbudget = spent > limit;
  const remaining = limit - spent;

  // Logika Warna Dinamis
  const getProgressColor = () => {
    if (percentage >= 90) return "bg-red-500";
    if (percentage >= 70) return "bg-yellow-500";
    return "bg-emerald-500";
  };

  return (
    <div
      className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow cursor-pointer hover:border-emerald-200"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-50 rounded-lg text-slate-600">
            <Icon size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">{name}</h3>
            <p className="text-xs text-slate-500">Anggaran Bulanan</p>
          </div>
        </div>

        <div className="text-right">
          <span
            className={cn(
              "text-sm font-bold",
              isOverbudget ? "text-red-500" : "text-emerald-600"
            )}
          >
            {isOverbudget
              ? `-${formatRupiah(Math.abs(remaining))}`
              : formatRupiah(remaining)}
          </span>
          <p className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">
            {isOverbudget ? "Overbudget" : "Sisa Saku"}
          </p>
        </div>
      </div>

      {/* Progress Bar Container */}
      <div className="space-y-2">
        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full transition-all duration-500",
              getProgressColor()
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>

        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-500">
            Terpakai:{" "}
            <span className="font-medium text-slate-700">
              {formatRupiah(spent)}
            </span>
          </span>
          <span className="text-slate-400">Limit: {formatRupiah(limit)}</span>
        </div>
      </div>

      {/* Warning Alert jika overbudget */}
      {isOverbudget && (
        <div className="mt-4 flex items-center gap-2 p-2 bg-red-50 rounded-lg text-red-600 text-[11px] animate-pulse">
          <AlertCircle size={14} />
          <span>Wah, pengeluaranmu sudah melebihi batas!</span>
        </div>
      )}
    </div>
  );
};

export default BudgetCard;
