"use client";

import React from "react";
import "@/app/globals.css"
import MainLayout from "@/components/shared/MainLayout";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
