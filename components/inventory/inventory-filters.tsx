"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function InventoryFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [status, setStatus] = useState(searchParams.get("status") || "all");
  const [condition, setCondition] = useState(searchParams.get("condition") || "all");

  function applyFilters() {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (status && status !== "all") params.set("status", status);
    if (condition && condition !== "all") params.set("condition", condition);
    router.push(`/inventory?${params.toString()}`);
  }

  function clearFilters() {
    setSearch("");
    setStatus("all");
    setCondition("all");
    router.push("/inventory");
  }

  return (
    <Card className="p-4">
      <div className="flex flex-wrap items-center gap-3">
        <Input
          placeholder="Search by model name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && applyFilters()}
          className="flex-1 min-w-[200px]"
        />
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="IN_STOCK">In Stock</SelectItem>
            <SelectItem value="SOLD">Sold</SelectItem>
          </SelectContent>
        </Select>
        <Select value={condition} onValueChange={setCondition}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Condition" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Conditions</SelectItem>
            <SelectItem value="Mint">Mint</SelectItem>
            <SelectItem value="Good">Good</SelectItem>
            <SelectItem value="Fair">Fair</SelectItem>
            <SelectItem value="Green lines">Green lines</SelectItem>
            <SelectItem value="Shadow issue">Shadow issue</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={applyFilters} className="whitespace-nowrap">
          Filter
        </Button>
        <Button variant="outline" onClick={clearFilters} className="whitespace-nowrap">
          Clear
        </Button>
      </div>
    </Card>
  );
}

