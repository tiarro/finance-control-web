import React, { useState } from "react";
import { Calendar, DollarSign, FileText, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (transaction: TransactionData) => void;
  budgetName: string;
}

interface TransactionData {
  date: string;
  type: "pemasukan" | "pengeluaran";
  category: string;
  amount: number;
  description: string;
}

const BudgetModal = ({ isOpen, onClose, onSave, budgetName }: BudgetModalProps) => {
  const [formData, setFormData] = useState<TransactionData>({
    date: new Date().toISOString().split('T')[0],
    type: "pengeluaran",
    category: budgetName,
    amount: 0,
    description: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
    // Reset form
    setFormData({
      date: new Date().toISOString().split('T')[0],
      type: "pengeluaran",
      category: budgetName,
      amount: 0,
      description: ""
    });
  };

  const handleChange = (field: keyof TransactionData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-center font-bold text-xl">Tambah Transaksi - {budgetName}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 my-2">
          {/* Tanggal */}
          <div className="space-y-4">
            <Label htmlFor="date" className="flex items-center gap-2">
              <Calendar size={16} />
              Tanggal
            </Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => handleChange('date', e.target.value)}
              required
            />
          </div>

          {/* Tipe */}
          <div className="space-y-4">
            <Label htmlFor="type" className="flex items-center gap-2">
              <TrendingUp size={16} />
              Tipe
            </Label>
            <select
              id="type"
              value={formData.type}
              onChange={(e) => handleChange('type', e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="pemasukan">Pemasukan</option>
              <option value="pengeluaran">Pengeluaran</option>
            </select>
          </div>

          {/* Kategori */}
          <div className="space-y-4">
            <Label htmlFor="category" className="flex items-center gap-2">
              <FileText size={16} />
              Kategori
            </Label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value={budgetName}>{budgetName}</option>
              <option value="Sewa Kos">Sewa Kos</option>
              <option value="Listrik & Air">Listrik & Air</option>
              <option value="Internet/Pulsa">Internet/Pulsa</option>
              <option value="Iuran Lain">Iuran Lain</option>
              <option value="Makan & Minum">Makan & Minum</option>
              <option value="Air Galon">Air Galon</option>
              <option value="Gas">Gas</option>
              <option value="Jajan/Kopi">Jajan/Kopi</option>
              <option value="Transportasi">Transportasi</option>
              <option value="Laundry">Laundry</option>
              <option value="Perlengkapan Mandi & Cuci">Perlengkapan Mandi & Cuci</option>
              <option value="Skincare/Personal Care">Skincare/Personal Care</option>
              <option value="Nongkrong">Nongkrong</option>
              <option value="Langganan Digital">Langganan Digital</option>
              <option value="Hobi">Hobi</option>
              <option value="Tabungan">Tabungan</option>
              <option value="Dana Darurat">Dana Darurat</option>
              <option value="Persembahan/Zakat">Persembahan/Zakat</option>
            </select>
          </div>

          {/* Jumlah */}
          <div className="space-y-4">
            <Label htmlFor="amount" className="flex items-center gap-2">
              <DollarSign size={16} />
              Jumlah
            </Label>
            <Input
              id="amount"
              type="number"
              value={formData.amount}
              onChange={(e) => handleChange('amount', parseInt(e.target.value) || 0)}
              placeholder="0"
              min="0"
              required
            />
          </div>

          {/* Deskripsi */}
          <div className="space-y-4">
            <Label htmlFor="description" className="flex items-center gap-2">
              <FileText size={16} />
              Deskripsi
            </Label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Tambahkan catatan..."
              rows={3}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Buttons */}
          <DialogFooter className="flex justify-center items-center gap-2 w-full">
            <Button
              type="button"
              variant="outline"
              className="flex-1 py-6 bg-gray-50 hover:bg-gray-200"
              onClick={onClose}
            >
              Batal
            </Button>
            <Button
              type="submit"
              className={cn(
                formData.type === "pemasukan" 
                  ? "bg-emerald-500 hover:bg-emerald-600 flex-1 py-6" 
                  : "bg-red-500 hover:bg-red-600 flex-1 py-6"
              )}
            >
              Simpan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BudgetModal;
