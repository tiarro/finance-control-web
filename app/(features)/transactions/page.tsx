"use client";

import { useState } from "react";
import { Title } from "@/components/ui/title";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import styles from "./Transactions.module.css";

export default function TransactionsPage() {
  const [formData, setFormData] = useState({
    type: "income",
    amount: "",
    category: "",
    date: new Date().toISOString().split("T")[0],
    description: "",
  });

  const [filter, setFilter] = useState("all");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted:", formData);
    // Reset form
    setFormData({
      type: "income",
      amount: "",
      category: "",
      date: new Date().toISOString().split("T")[0],
      description: "",
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className={styles.container}>
      {/* Top Section - Form */}
      <Title label="Transaksi" size="md" as="h2" />
      <p className="text-gray-600 text-sm mt-3 mb-5">
        Rencanakan belanja hari ini untuk kenyamanan esok hari.
      </p>

      <div className={styles.formCard}>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <Label htmlFor="type">Tipe</Label>
              <select
                id="type"
                className={styles.select}
                value={formData.type}
                onChange={(e) => handleInputChange("type", e.target.value)}
              >
                <option value="income">Pemasukan</option>
                <option value="expense">Pengeluaran</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <Label htmlFor="amount">Jumlah (Rp)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="50000"
                value={formData.amount}
                onChange={(e) => handleInputChange("amount", e.target.value)}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <Label htmlFor="category">Kategori</Label>
              <select
                id="category"
                className={styles.select}
                value={formData.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
                required
              >
                <option value="">Pilih kategori...</option>
                {formData.type === "income" ? (
                  <>
                    <option value="salary">Gaji</option>
                    <option value="freelance">Freelance</option>
                    <option value="investment">Investasi</option>
                    <option value="other-income">Lainnya</option>
                  </>
                ) : (
                  <>
                    <option value="food">Makanan</option>
                    <option value="transport">Transport</option>
                    <option value="entertainment">Hiburan</option>
                    <option value="bills">Tagihan</option>
                    <option value="shopping">Belanja</option>
                    <option value="other-expense">Lainnya</option>
                  </>
                )}
              </select>
            </div>

            <div className={styles.formGroup}>
              <Label htmlFor="date">Tanggal</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange("date", e.target.value)}
                required
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <Label htmlFor="description">Keterangan</Label>
            <textarea
              id="description"
              className={styles.textarea}
              placeholder="Deskripsi transaksi"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
            />
          </div>

          <Button type="submit" size={"lg"} className="w-full mt-4">
            Tambah Transaksi
          </Button>
        </form>
      </div>

      {/* Bottom Section - Transaction History */}
      <div className={styles.historyCard}>
        <div className={styles.historyHeader}>
          <Title label="Riwayat Transaksi" size="md" as="h2" />
          <div className="flex items-center gap-2">
            <Label htmlFor="filter">Filter:</Label>
            <select
              id="filter"
              className={styles.filterSelect}
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">Semua Kategori</option>
              <option value="income">Pemasukan</option>
              <option value="expense">Pengeluaran</option>
            </select>
          </div>
        </div>

        {/* Empty State */}
        <div className={styles.emptyState}>
          <Wallet className={styles.emptyIcon} />
          <div className={styles.emptyTitle}>Belum ada transaksi</div>
          <div className={styles.emptyDescription}>
            Tambahkan transaksi pertama Anda di atas
          </div>
        </div>
      </div>
    </div>
  );
}
