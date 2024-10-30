"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

export const useAuthCheck = (adminRequired?: boolean) => {
  const router = useRouter();
  const { user, isLoggedIn, fetchUserData } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("Current auth state:", { isLoggedIn, user, adminRequired });

        // Nếu đã đăng nhập nhưng chưa có user data
        if (isLoggedIn && !user) {
          console.log("Fetching user data...");
          await fetchUserData();
        }

        // Kiểm tra quyền truy cập
        const hasAccess =
          isLoggedIn && user && (!adminRequired || user.role === "admin");
        console.log("Access check:", { hasAccess, role: user?.role });

        if (!hasAccess) {
          if (!isLoggedIn || !user) {
            console.log("Redirecting to login...");
            router.push("/login");
          } else if (adminRequired && user.role !== "admin") {
            console.log("Redirecting to home...");
            router.push("/");
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [isLoggedIn, user, router, adminRequired, fetchUserData]);

  const isAuthorized =
    isLoggedIn && user && (!adminRequired || user.role === "admin");
  console.log("Final auth state:", { isChecking, isAuthorized, user });

  return {
    isChecking,
    isAuthorized,
    user,
  };
};
