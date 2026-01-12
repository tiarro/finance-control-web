"use client";

import { useState } from "react";
import { Title } from "@/components/ui/title";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ProgressBar from "@/components/ui/progress-bar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Edit2, Trash2 } from "lucide-react";
import styles from "./Budgets.module.css";

interface Budget {
  id: string;
  category: string;
  amount: number;
  spent: number;
}

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<Budget[]>([
    // Mock data - replace with real data
    {
      id: "1",
      category: "Makanan",
      amount: 1000000,
      spent: 750000,
    },
    {
      id: "2",
      category: "Transport",
      amount: 500000,
      spent: 200000,
    },
    {
      id: "3",
      category: "Hiburan",
      amount: 300000,
      spent: 350000, // Exceeded budget
    },
  ]);

  const [formData, setFormData] = useState({
    category: "",
    amount: "",
  });

  const [editingBudget, setEditingBudget] = useState<string | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    budgetId: string | null;
    budgetCategory: string;
  }>({
    isOpen: false,
    budgetId: null,
    budgetCategory: "",
  });

  const handleEditBudget = (budgetId: string) => {
    const budget = budgets.find((b) => b.id === budgetId);
    if (budget) {
      setFormData({
        category: budget.category,
        amount: budget.amount.toString(),
      });
      setEditingBudget(budgetId);
    }
  };

  const handleDeleteBudget = (budgetId: string) => {
    const budget = budgets.find((b) => b.id === budgetId);
    if (budget) {
      setDeleteDialog({
        isOpen: true,
        budgetId: budgetId,
        budgetCategory: budget.category,
      });
    }
  };

  const confirmDeleteBudget = () => {
    if (deleteDialog.budgetId) {
      setBudgets(
        budgets.filter((budget) => budget.id !== deleteDialog.budgetId)
      );
    }
    setDeleteDialog({
      isOpen: false,
      budgetId: null,
      budgetCategory: "",
    });
  };

  const cancelDeleteBudget = () => {
    setDeleteDialog({
      isOpen: false,
      budgetId: null,
      budgetCategory: "",
    });
  };

  const handleCancelEdit = () => {
    setEditingBudget(null);
    setFormData({
      category: "",
      amount: "",
    });
  };

  const categories = [
    "Makanan",
    "Transport",
    "Hiburan",
    "Tagihan",
    "Belanja",
    "Kesehatan",
    "Pendidikan",
    "Lainnya",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.category || !formData.amount) return;

    if (editingBudget) {
      // Update existing budget
      setBudgets((prev) =>
        prev.map((budget) =>
          budget.id === editingBudget
            ? {
                ...budget,
                category: formData.category,
                amount: parseFloat(formData.amount),
              }
            : budget
        )
      );
      setEditingBudget(null);
    } else {
      // Add new budget
      const newBudget: Budget = {
        id: Date.now().toString(),
        category: formData.category,
        amount: parseFloat(formData.amount),
        spent: 0,
      };
      setBudgets((prev) => [...prev, newBudget]);
    }

    setFormData({ category: "", amount: "" });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className={styles.container}>
      {/* Top Section - Budget Overview */}
      <div className={styles.budgetCard}>
        <Title label="Anggaran" size="md" as="h2" />
        <p className="text-gray-600 text-sm mt-3 mb-5">
          Catat setiap rupiah agar tidak ada yang terlewat.
        </p>

        {budgets.length === 0 ? (
          <div className={styles.emptyState}>
            <p className={styles.emptyText}>Belum ada budget yang diatur</p>
          </div>
        ) : (
          <div className={styles.budgetList}>
            {budgets.map((budget) => {
              const remaining = budget.amount - budget.spent;
              const isExceeded = budget.spent > budget.amount;

              return (
                <div key={budget.id} className={styles.budgetItem}>
                  <div className={styles.budgetHeader}>
                    <span className={styles.budgetCategory}>
                      {budget.category}
                    </span>
                    <div className={styles.budgetActions}>
                      <span className={styles.budgetAmount}>
                        Rp {budget.amount.toLocaleString("id-ID")}
                      </span>
                      <div className={styles.actionButtons}>
                        <button
                          onClick={() => handleEditBudget(budget.id)}
                          className={styles.editButton}
                          title="Edit Budget"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteBudget(budget.id)}
                          className={styles.deleteButton}
                          title="Hapus Budget"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className={styles.budgetProgress}>
                    <ProgressBar
                      value={budget.spent}
                      max={budget.amount}
                      label=""
                    />
                  </div>

                  <div className={styles.budgetStats}>
                    <span className={styles.spent}>
                      Terpakai: Rp {budget.spent.toLocaleString("id-ID")}
                    </span>
                    <span
                      className={
                        isExceeded ? styles.exceeded : styles.remaining
                      }
                    >
                      {isExceeded
                        ? `Melebihi: Rp ${Math.abs(remaining).toLocaleString(
                            "id-ID"
                          )}`
                        : `Sisa: Rp ${remaining.toLocaleString("id-ID")}`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Add Budget Form */}
        <div className={styles.formSection}>
          <Title
            label={editingBudget ? "Edit Budget" : "Atur Budget Baru"}
            size="md"
            as="h2"
            className="mb-5"
          />

          <form onSubmit={handleSubmit}>
            <div className={styles.formGrid}>
              <div className={`${styles.formGroup} space-y-3`}>
                <Label htmlFor="category">Kategori</Label>
                <select
                  id="category"
                  className={styles.select}
                  value={formData.category}
                  onChange={(e) =>
                    handleInputChange("category", e.target.value)
                  }
                  required
                >
                  <option value="">Pilih kategori...</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className={`${styles.formGroup} space-y-3`}>
                <Label htmlFor="amount">Jumlah Budget (Rp)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="1000000"
                  value={formData.amount}
                  onChange={(e) => handleInputChange("amount", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className={styles.buttonGroup}>
              <Button type="submit" size={"lg"} className="w-full">
                {editingBudget ? "Update Budget" : "Atur Budget"}
              </Button>
              {editingBudget && (
                <Button
                  type="button"
                  variant="outline"
                  size={"lg"}
                  className="w-full"
                  onClick={handleCancelEdit}
                >
                  Batal
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.isOpen}
        onOpenChange={(open) => !open && cancelDeleteBudget()}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Budget</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus budget untuk kategori &quot;
              {deleteDialog.budgetCategory}&quot;? Tindakan ini tidak dapat
              dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={cancelDeleteBudget}>
              Batal
            </Button>
            <Button variant="destructive" onClick={confirmDeleteBudget}>
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
