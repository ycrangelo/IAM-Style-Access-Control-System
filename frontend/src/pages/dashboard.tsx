import axios from "axios";
import { Button, Card, Spinner, Badge } from "flowbite-react";
import React, { useEffect, useState } from "react";

type Permission = {
  module: string;
  action: "CREATE" | "READ" | "UPDATE" | "DELETE";
};

export default function Dashboard() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [notification, setNotification] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found, please login.");
        }

        const res = await axios.get(
          "http://localhost:3000/api/accessControl/me/getMyPermissions",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            validateStatus: (status) => status < 500,
          }
        );

        setPermissions(res.data.permissions || []);
      } catch (err: any) {
        console.error("Error:", err);
        setNotification(
          err.response?.data?.error ||
            err.message ||
            "Failed to load permissions"
        );
        setTimeout(() => setNotification(""), 5000);
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, []);

  const hasPermission = (module: string, action: string) => {
    return permissions.some((p) => p.module === module && p.action === action);
  };

  const simulateAction = (module: string, action: string) => {
    const allowed = hasPermission(module, action);
    setNotification(
      allowed
        ? `✅ You have permission to ${action} on ${module} module`
        : `❌ You don't have permission to ${action} on ${module} module`
    );
    setTimeout(() => setNotification(""), 3000);
  };

  const modules = Array.from(new Set(permissions.map((p) => p.module)));

  return (
    <div className="flex flex-col items-center min-h-screen gap-4 p-4">
      <h1 className="text-3xl font-bold mb-4">Dashboard - My Permissions</h1>

      {notification && (
        <div
          className={`p-3 rounded-lg w-full max-w-md text-center ${
            notification.includes("✅")
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {notification}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center mt-10">
          <Spinner size="xl" />
          <span className="ml-2">Loading permissions...</span>
        </div>
      ) : modules.length === 0 ? (
        <Card className="w-full max-w-md text-center">
          <p className="text-gray-500">
            No permissions available for your account
          </p>
        </Card>
      ) : (
        modules.map((module) => (
          <Card key={module} className="w-full max-w-md">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-semibold">Module: {module}</h2>
              <Badge color="info">
                {permissions.filter((p) => p.module === module).length}{" "}
                permissions
              </Badge>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Available Actions:</h3>
              <div className="flex gap-2 flex-wrap">
                {["CREATE", "READ", "UPDATE", "DELETE"].map((action) => {
                  const hasPerm = hasPermission(module, action);
                  return (
                    <Button
                      key={action}
                      size="sm"
                      onClick={() => simulateAction(module, action)}
                      color={hasPerm ? "success" : "failure"}
                      className={hasPerm ? "" : "opacity-70"}
                      title={
                        hasPerm
                          ? `You can ${action} in ${module}`
                          : `You cannot ${action} in ${module}`
                      }
                    >
                      {action}
                      {hasPerm && <span className="ml-1">✓</span>}
                    </Button>
                  );
                })}
              </div>
            </div>
          </Card>
        ))
      )}
    </div>
  );
}
