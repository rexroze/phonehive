"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";

export function ExportPanel() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState<string | null>(null);

  async function handleExport(type: "inventory" | "expenses" | "sales") {
    if (!session?.user?.id) return;
    setLoading(type);
    try {
      const response = await fetch(`/api/export/${type}`);
      if (!response.ok) throw new Error("Export failed");
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${type}-${new Date().toISOString().split("T")[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      alert("Failed to export");
    } finally {
      setLoading(null);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Export Data</CardTitle>
        <CardDescription>Download your data as Excel files</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => handleExport("inventory")}
          disabled={loading === "inventory"}
        >
          <Download className="mr-2 h-4 w-4" />
          {loading === "inventory" ? "Exporting..." : "Export Inventory"}
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => handleExport("expenses")}
          disabled={loading === "expenses"}
        >
          <Download className="mr-2 h-4 w-4" />
          {loading === "expenses" ? "Exporting..." : "Export Expenses"}
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => handleExport("sales")}
          disabled={loading === "sales"}
        >
          <Download className="mr-2 h-4 w-4" />
          {loading === "sales" ? "Exporting..." : "Export Sales History"}
        </Button>
      </CardContent>
    </Card>
  );
}

