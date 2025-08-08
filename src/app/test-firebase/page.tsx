"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";

export default function TestFirebasePage() {
  const { user, isAuthenticated, isLoading, login, logout, register } = useAuth();
  const [testEmail, setTestEmail] = useState("test@example.com");
  const [testPassword, setTestPassword] = useState("123456");
  const [testResult, setTestResult] = useState<string>("");

  const testRegistration = async () => {
    setTestResult("🔄 Testing registration...");
    try {
      const result = await register(testEmail, testPassword, "Test User");
      if (result.success) {
        setTestResult("✅ Registration successful!");
      } else {
        setTestResult(`❌ Registration failed: ${result.message}`);
      }
    } catch (error) {
      setTestResult(`❌ Registration error: ${error}`);
    }
  };

  const testLogin = async () => {
    setTestResult("🔄 Testing login...");
    try {
      const result = await login(testEmail, testPassword);
      if (result.success) {
        setTestResult("✅ Login successful!");
      } else {
        setTestResult(`❌ Login failed: ${result.message}`);
      }
    } catch (error) {
      setTestResult(`❌ Login error: ${error}`);
    }
  };

  const testLogout = async () => {
    setTestResult("🔄 Testing logout...");
    try {
      const result = await logout();
      if (result.success) {
        setTestResult("✅ Logout successful!");
      } else {
        setTestResult(`❌ Logout failed: ${result.message}`);
      }
    } catch (error) {
      setTestResult(`❌ Logout error: ${error}`);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Firebase Integration Test</h1>
        
        <Card className="mb-6">
          <CardHeader>
            <h2 className="text-xl font-semibold">Current Auth State</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>Loading:</strong> {isLoading ? "Yes" : "No"}</p>
              <p><strong>Authenticated:</strong> {isAuthenticated ? "Yes" : "No"}</p>
              <p><strong>User:</strong> {user ? JSON.stringify(user, null, 2) : "None"}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <h2 className="text-xl font-semibold">Test Credentials</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Email:</label>
                <input
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  className="minimal-input w-full px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Password:</label>
                <input
                  type="password"
                  value={testPassword}
                  onChange={(e) => setTestPassword(e.target.value)}
                  className="minimal-input w-full px-3 py-2"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <h2 className="text-xl font-semibold">Test Actions</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button onClick={testRegistration} className="w-full">
                Test Registration
              </Button>
              <Button onClick={testLogin} className="w-full">
                Test Login
              </Button>
              <Button onClick={testLogout} className="w-full">
                Test Logout
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Test Results</h2>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-800 p-4 rounded-lg">
              <pre className="whitespace-pre-wrap">{testResult || "No tests run yet"}</pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
