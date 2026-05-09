import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/forgot-password")({ component: Forgot });

function Forgot() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  return (
    <div className="min-h-screen grid place-items-center p-6 bg-background">
      <div className="w-full max-w-md glass rounded-3xl p-8 luxe-shadow">
        <h1 className="font-display text-3xl">Reset password</h1>
        {step === 1 && (
          <form onSubmit={(e) => { e.preventDefault(); if (!email) return; toast.success("OTP sent (demo: 1234)"); setStep(2); }} className="mt-6 space-y-4">
            <p className="text-sm text-muted-foreground">Enter your email and we'll send a verification code.</p>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" className="w-full rounded-xl bg-input px-4 py-3 text-sm border border-border focus:border-primary outline-none" />
            <button className="w-full py-3 rounded-xl gold-bg text-primary-foreground font-semibold">Send OTP</button>
          </form>
        )}
        {step === 2 && (
          <form onSubmit={(e) => { e.preventDefault(); if (otp.join("") !== "1234") return toast.error("Invalid OTP"); setStep(3); }} className="mt-6 space-y-4">
            <p className="text-sm text-muted-foreground">Enter the 4-digit code we sent to {email}</p>
            <div className="flex gap-2 justify-center">
              {otp.map((v, i) => (
                <input key={i} value={v} maxLength={1}
                  onChange={(e) => { const n = [...otp]; n[i] = e.target.value.replace(/\D/g, ""); setOtp(n); if (e.target.value && i < 3) (e.target.nextElementSibling as HTMLInputElement)?.focus(); }}
                  className="h-14 w-14 text-center text-xl rounded-xl bg-input border border-border focus:border-primary outline-none" />
              ))}
            </div>
            <button className="w-full py-3 rounded-xl gold-bg text-primary-foreground font-semibold">Verify</button>
          </form>
        )}
        {step === 3 && (
          <div className="mt-6 space-y-4">
            <p className="text-sm">Verified! In production you'd set a new password here.</p>
            <Link to="/login" className="block w-full py-3 rounded-xl gold-bg text-primary-foreground font-semibold text-center">Back to login</Link>
          </div>
        )}
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Remembered? <Link to="/login" className="text-primary hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}