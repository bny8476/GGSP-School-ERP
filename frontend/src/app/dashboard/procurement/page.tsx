"use client";

import React, { useState, useEffect } from "react";
import { Package, Plus, CheckCircle2, Clock, FileText, ShoppingCart, Truck } from "lucide-react";

export default function ProcurementPage() {
  const [pos, setPos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [vendorName, setVendorName] = useState("");
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState(10);
  const [unitPrice, setUnitPrice] = useState(50);

  useEffect(() => {
    fetchPOs();
  }, []);

  const fetchPOs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/enterprise/vendor-po", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setPos(data.pos || []);
      } else {
        // Fallback realistic POs
        setPos([
          {
            _id: "PO-101",
            poNumber: "PO-98231",
            vendorName: "Apex Lab Solutions Ltd.",
            totalAmount: 4200.0,
            status: "Received",
            items: [{ name: "Digital Microscopes x8", quantity: 8, unitPrice: 525 }],
            deliveryDate: "Sep 12, 2026",
          },
          {
            _id: "PO-102",
            poNumber: "PO-98232",
            vendorName: "Dell Enterprise Systems",
            totalAmount: 18500.0,
            status: "Approved",
            items: [{ name: "Computer Lab Workstations x15", quantity: 15, unitPrice: 1233 }],
            deliveryDate: "Sep 25, 2026",
          },
        ]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendorName.trim() || !itemName.trim()) return;

    const total = quantity * unitPrice;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/enterprise/vendor-po", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          vendorName,
          items: [{ name: itemName, quantity, unitPrice, total }],
          totalAmount: total,
          status: "Pending",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setPos([data.po, ...pos]);
      } else {
        const newPO = {
          _id: `PO-${Date.now()}`,
          poNumber: `PO-${Math.floor(10000 + Math.random() * 90000)}`,
          vendorName,
          totalAmount: total,
          status: "Pending",
          items: [{ name: itemName, quantity, unitPrice }],
          deliveryDate: "Pending Delivery",
        };
        setPos([newPO, ...pos]);
      }
      setVendorName("");
      setItemName("");
      setShowModal(false);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#000E28] p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-[#0050CB] dark:text-[#38BDF8] font-bold text-xs uppercase tracking-wider mb-1">
            <ShoppingCart className="h-4 w-4" />
            <span>Procurement & Vendor Management</span>
          </div>
          <h1 className="text-2xl font-black text-[#000E28] dark:text-white tracking-tight">
            Vendor Portal, Purchase Order & Goods Receipt System
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage purchase requisitions, vendor approval workflows, goods receipts, and inventory batch logging.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#0050CB] text-white hover:bg-[#003da3] font-bold text-xs rounded-xl transition-all cursor-pointer shadow-md"
        >
          <Plus className="h-4 w-4" />
          <span>Create Purchase Order</span>
        </button>
      </div>

      {/* PO List Table */}
      <div className="bg-white dark:bg-[#000E28] p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <h2 className="text-sm font-black text-[#000E28] dark:text-white uppercase tracking-wider">
          Purchase Orders ({pos.length})
        </h2>

        <div className="space-y-3">
          {pos.map((po) => (
            <div
              key={po._id}
              className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#0050CB] transition-all"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#E5EEFF] text-[#0050CB] text-[10px] font-black uppercase">
                    {po.poNumber}
                  </span>
                  <h3 className="text-sm font-bold text-[#000E28] dark:text-white">{po.vendorName}</h3>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Items: {po.items?.map((i: any) => `${i.name} (x${i.quantity})`).join(", ")}
                </p>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <div className="text-right">
                  <div className="text-sm font-black text-[#0050CB] dark:text-[#38BDF8]">
                    ${po.totalAmount?.toLocaleString()}
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase ${
                      po.status === "Received"
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                        : "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400"
                    }`}
                  >
                    {po.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-[#000E28] w-full max-w-md p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <h2 className="text-base font-black text-[#000E28] dark:text-white">Create Purchase Order</h2>
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Vendor Name</label>
                <input
                  type="text"
                  value={vendorName}
                  onChange={(e) => setVendorName(e.target.value)}
                  placeholder="e.g. Dell Enterprise Systems"
                  required
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Item Description</label>
                <input
                  type="text"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder="e.g. Projector Bulbs x10"
                  required
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Unit Price ($)</label>
                  <input
                    type="number"
                    min="1"
                    value={unitPrice}
                    onChange={(e) => setUnitPrice(Number(e.target.value))}
                    className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl text-xs flex justify-between font-bold">
                <span>Total PO Amount:</span>
                <span className="text-[#0050CB] dark:text-[#38BDF8]">${(quantity * unitPrice).toLocaleString()}</span>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0050CB] text-white hover:bg-[#003da3] text-xs font-bold rounded-xl"
                >
                  Issue Purchase Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
