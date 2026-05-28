import type { Metadata } from "next";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { StatCard, StatsGrid } from "@/components/ui/StatCard";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { OrdersDonutChart } from "@/components/dashboard/OrdersDonutChart";
import { TopProducts } from "@/components/dashboard/TopProducts";
import { RecentOrders } from "@/components/dashboard/RecentOrders";
import { PaymentStats } from "@/components/dashboard/PaymentStats";
import { RecentActivities } from "@/components/dashboard/RecentActivities";

export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardPage() {
  return (
    <AdminLayout title="Dashboard" subtitle="Tổng quan hệ thống">
      <div className="page-content">

        {/* Stats Row */}
        <StatsGrid cols={4}>
          <StatCard
            label="Tổng đơn hàng"
            value={1248}
            change={12.5}
            changeLabel="so với tháng trước"
            icon="cart"
            color="blue"
          />
          <StatCard
            label="Doanh thu tháng"
            value={285450000}
            change={8.2}
            changeLabel="so với tháng trước"
            icon="money"
            color="green"
            isCurrency
          />
          <StatCard
            label="Khách hàng"
            value={856}
            change={5.1}
            changeLabel="thành viên mới"
            icon="users"
            color="purple"
          />
          <StatCard
            label="Sản phẩm"
            value={32}
            change={-2.3}
            changeLabel="hết hàng"
            icon="package"
            color="amber"
          />
        </StatsGrid>

        {/* Charts Row - 3 columns */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 330px 260px", gap: 16 }}>
          <RevenueChart />
          <OrdersDonutChart />
          <TopProducts />
        </div>

        {/* Bottom Row — Orders (left) | PaymentStats + Activities (right) */}
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
