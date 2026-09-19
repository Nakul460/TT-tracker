"use client";
import { Button } from "@/components/ui/button";
import { toast, Toaster } from "@/components/ui/toast";
import { authClient } from "@/src/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ResetPassword() {
  const router = useRouter();
  const [newPass, setNewPass] = useState("");

  async function resetPass() {
    const token = new URLSearchParams(window.location.search).get("token");

    if (!token) {
      toast.add({ type: "error", description: "invalid token" });
    } else {
      const { data, error } = await authClient.resetPassword({
        newPassword: newPass,
        token,
      });

      if (error) {
        toast.add({
          type: "error",
          description:
            error.message ||
            "Failed to reset password. The link may have expired.",
        });
        return;
      }
      toast.add({ type: "success", description: "Password reset successful" });
      router.push("/dashboard");
    }
  }

  return (
    <>
      <Toaster />

      <form>
        <input
          type="text"
          name=""
          id=""
          placeholder="enter your new password"
          onChange={(e) => setNewPass(e.target.value)}
          value={newPass}
        />
        <Button onClick={resetPass}>Reset</Button>
      </form>
    </>
  );
}
