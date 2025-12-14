"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { getAllUsers, updateUserRole } from "@/app/actions/admin";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt: Date;
  _count: {
    phones: number;
    expenses: number;
  };
}

export function AdminPanel() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    if (!session?.user?.id) return;
    setLoading(true);
    try {
      const data = await getAllUsers(session.user.id);
      setUsers(data);
    } catch (error: any) {
      alert(error.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  async function handleRoleChange(userId: string, newRole: "FREE" | "PREMIUM" | "ADMIN") {
    if (!session?.user?.id) return;
    setUpdating(userId);
    try {
      await updateUserRole(session.user.id, userId, newRole);
      await loadUsers();
    } catch (error: any) {
      alert(error.message || "Failed to update user role");
    } finally {
      setUpdating(null);
    }
  }

  function getRoleBadgeVariant(role: string) {
    switch (role) {
      case "ADMIN":
        return "destructive";
      case "PREMIUM":
        return "default";
      case "FREE":
        return "secondary";
      default:
        return "secondary";
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Users</CardTitle>
        <CardDescription>
          Manage user roles and view user statistics
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No users found</p>
          ) : (
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="inline-block min-w-full align-middle px-4 sm:px-0">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2 text-sm font-medium">Name</th>
                      <th className="text-left p-2 text-sm font-medium hidden sm:table-cell">Email</th>
                      <th className="text-left p-2 text-sm font-medium">Role</th>
                      <th className="text-left p-2 text-sm font-medium hidden md:table-cell">Phones</th>
                      <th className="text-left p-2 text-sm font-medium hidden md:table-cell">Expenses</th>
                      <th className="text-left p-2 text-sm font-medium hidden lg:table-cell">Joined</th>
                      <th className="text-left p-2 text-sm font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b">
                        <td className="p-2">
                          <div className="flex flex-col">
                            <span>{user.name || <span className="text-muted-foreground">No name</span>}</span>
                            <span className="text-xs text-muted-foreground sm:hidden">{user.email}</span>
                          </div>
                        </td>
                        <td className="p-2 hidden sm:table-cell">{user.email}</td>
                        <td className="p-2">
                          <Badge variant={getRoleBadgeVariant(user.role)}>
                            {user.role}
                          </Badge>
                        </td>
                        <td className="p-2 hidden md:table-cell">{user._count.phones}</td>
                        <td className="p-2 hidden md:table-cell">{user._count.expenses}</td>
                        <td className="p-2 text-sm text-muted-foreground hidden lg:table-cell">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-2">
                          {updating === user.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Select
                              value={user.role}
                              onValueChange={(value) =>
                                handleRoleChange(user.id, value as "FREE" | "PREMIUM" | "ADMIN")
                              }
                              disabled={user.id === session?.user?.id}
                            >
                              <SelectTrigger className="w-28 sm:w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="FREE">FREE</SelectItem>
                                <SelectItem value="PREMIUM">PREMIUM</SelectItem>
                                <SelectItem value="ADMIN">ADMIN</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

