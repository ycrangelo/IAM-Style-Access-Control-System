import axios from "axios";
import { Button, Card, Spinner } from "flowbite-react";
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
        console.log("Token from localStorage:", token);
        
        if (!token) {
          throw new Error("No token found, please login.");
        }
        
        // Validate token format (basic check)
        if (typeof token !== 'string' || token.trim() === '') {
          throw new Error("Invalid token format, please login again.");
        }

        const res = await axios.get(
          "http://localhost:3000/api/accessControl/me/getMyPermissions"
        );

        console.log("API Response:", res.data);
        setPermissions(res.data.permissions || []);
      } catch (err: any) {
        console.error("Error details:", err);
        console.error("Response data:", err.response?.data);
        console.error("Response status:", err.response?.status);
        
        if (err.response?.status === 401) {
          setNotification("loading");
          // Optionally redirect to login
          // window.location.href = '/login';
        } else {
          setNotification(err.response?.data?.error || err.message || "Failed to load permissions");
        }
        
        setTimeout(() => setNotification(""), 5000);
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, []);

  const simulateAction = (module: string, action: string) => {
    const allowed = permissions.some(
      (p) => p.module === module && p.action === action
    );

    setNotification(
      allowed
        ? `✅ You are allowed to ${action} on ${module}`
        : `❌ You are NOT allowed to ${action} on ${module}`
    );

    setTimeout(() => setNotification(""), 3000);
  };

  const modules = Array.from(new Set(permissions.map((p) => p.module)));

  return (
    <div className="flex flex-col items-center min-h-screen gap-4 p-4">
      <h1 className="text-3xl font-bold mb-4">Dashboard - My Permissions</h1>

      {/* Debug Information */}
      {/* <div className="bg-gray-100 p-4 rounded-lg w-full max-w-md text-sm">
        <h3 className="font-semibold mb-2">Debug Info:</h3>
        <p>Token exists: {localStorage.getItem("token") ? "Yes" : "No"}</p>
        <p>Token length: {localStorage.getItem("token")?.length || 0}</p>
        <p>Token preview: {localStorage.getItem("token")?.substring(0, 20) || "None"}...</p>
      </div> */}

      {notification && (
        <div className="bg-gray-100 text-black p-2 rounded">{notification}</div>
      )}

      {loading ? (
        <div className="flex items-center justify-center mt-10">
          <Spinner size="xl" />
          <span className="ml-2">Loading permissions...</span>
        </div>
      ) : modules.length === 0 ? (
        <p className="text-gray-500 mt-10">No permissions available</p>
      ) : (
        modules.map((mod) => (
          <Card key={mod} className="w-full max-w-md">
            <h2 className="text-xl font-semibold mb-2">{mod}</h2>
            <div className="flex gap-2 flex-wrap">
              {["CREATE", "READ", "UPDATE", "DELETE"].map((action) => (
                <Button
                  key={action}
                  size="sm"
                  onClick={() => simulateAction(mod, action)}
                  color={
                    permissions.some(
                      (p) => p.module === mod && p.action === action
                    )
                      ? "success"
                      : "gray"
                  }
                >
                  {action}
                </Button>
              ))}
            </div>
          </Card>
        ))
      )}
    </div>
  );
}
