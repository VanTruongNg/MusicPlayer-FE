"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect, useState } from "react";
import { LoadingSpinner } from "../Loading";
import { Sidebar } from "./SideBar";
import { Header } from "./Header";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { user, isLoggedIn } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      console.log("Layout auth check:", { isLoggedIn, user });

      if (!isLoggedIn || !user) {
        router.push("/login");
      } else if (user.role !== "admin") {
        router.push("/");
      } else {
        setIsChecking(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [isLoggedIn, user, router]);

  if (isChecking) {
    return <LoadingSpinner />;
  }

  if (!isLoggedIn || !user || user.role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen flex dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header user={user} />
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
