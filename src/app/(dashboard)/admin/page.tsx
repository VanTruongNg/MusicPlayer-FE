"use client";

import { LoadingSpinner } from "@/components/Loading";
import { useAuthCheck } from "@/components/withAuth";


export default function AdminDashboard() {
  const { isChecking, isAuthorized, user } = useAuthCheck(true);

  if (isChecking) {
    return <LoadingSpinner />;
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Total Users</h3>
          <p className="text-2xl font-bold">1,234</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Total Songs</h3>
          <p className="text-2xl font-bold">5,678</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Active Users</h3>
          <p className="text-2xl font-bold">890</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Admin Information</h2>
        <div className="space-y-2">
          <p>
            <strong>Username:</strong> {user?.username}
          </p>
          <p>
            <strong>Email:</strong> {user?.email}
          </p>
          <p>
            <strong>Role:</strong> {user?.role}
          </p>
        </div>
      </div>
    </div>
  );
}
