import DashboardLayout from "@/components/dashboard/DashboardLayout";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body>
        <DashboardLayout>{children}</DashboardLayout>
      </body>
    </html>
  );
};

export default AdminLayout;
