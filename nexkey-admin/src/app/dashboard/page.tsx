"use client";

import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { StatCard, StatsGrid } from "@/components/ui/StatCard";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { OrdersDonutChart } from "@/components/dashboard/OrdersDonutChart";
import { TopProducts } from "@/components/dashboard/TopProducts";
import { RecentOrders } from "@/components/dashboard/RecentOrders";
import { PaymentStats } from "@/components/dashboard/PaymentStats";
import { RecentActivities } from "@/components/dashboard/RecentActivities";
import { dashboardApi } from "@/lib/api";

type DashStats = {
  totalOrders: number;
  revenue: number;
  totalCustomers: number;
  totalProducts: number;
};

export default function DashboardPage() {
  const [stats, setStats] = useState<DashStats>({ totalOrders: 0, revenue: 0, totalCustomers: 0, totalProducts: 0 });

  useEffect(() => {
    dashboardApi.stats().then(s => {
      setStats({
        totalOrders: s.totalOrders,
        revenue: s.tongDoanhThu,
        totalCustomers: s.totalCustomers,
        totalProducts: s.totalProducts,
      });
    }).catch(() => {});
  }, []);

  return (
    <AdminLayout title="Dashboard" subtitle="Tổng quan hệ thống">
      <div className="page-content">

        <StatsGrid cols={4}>
          <StatCard
            label="Tổng đơn hàng"
            value={stats.totalOrders}
            change={0}
            changeLabel="tổng cộng"
            icon="cart"
            color="blue"
          />
          <StatCard
            label="Doanh thu"
            value={stats.revenue}
            change={0}
            changeLabel="tổng doanh thu"
            icon="money"
            color="green"
            isCurrency
          />
          <StatCard
            label="Khách hàng"
            value={stats.totalCustomers}
            change={0}
            changeLabel="thành viên"
            icon="users"
            color="purple"
          />
          <StatCard
            label="Sản phẩm"
            value={stats.totalProducts}
            change={0}
            changeLabel="sản phẩm"
            icon="package"
            color="amber"
          />
        </StatsGrid>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 330px 260px", gap: 16 }}>
          <RevenueChart />
          <OrdersDonutChart />
          <TopProducts />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 16, alignItems: "start" }}>
          <RecentOrders />
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <PaymentStats />
            <RecentActivities />
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}
