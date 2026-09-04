"use client";

import { useState, FormEvent } from "react";
import { Input, FieldError } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { passwordChangeSchema } from "@/lib/validations";

export function PasswordForm() {
  const [form, setForm] = useState({ currentPassword: "", newPassword: "" });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setMessage(null);
    setFieldErrors({});

    const parsed = passwordChangeSchema.safeParse(form);
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        errors[issue.path[0] as string] = issue.message;
      }
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/profile/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setMessage({ type: "error", text: data.error ?? "Something went wrong. Please try again." });
        setLoading(false);
        return;
      }

      setMessage({ type: "success", text: "Password updated successfully." });
      setForm({ currentPassword: "", newPassword: "" });
      setLoading(false);
    } catch {
      setMessage({ type: "error", text: "Something went wrong. Please try again." });
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl bg-white p-6 shadow-card">
      {message && (
        <div
          className={`rounded-lg px-4 py-3 text-sm ${
            message.type === "success" ? "bg-primary-50 text-primary-700" : "bg-red-50 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Current password</label>
        <Input
          type="password"
          value={form.currentPassword}
          onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
        />
        <FieldError message={fieldErrors.currentPassword} />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">New password</label>
        <Input
          type="password"
          value={form.newPassword}
          onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
        />
        <FieldError message={fieldErrors.newPassword} />
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Updating..." : "Change password"}
      </Button>
    </form>
  );
}
