"use client";

import { useAppStore } from "@/lib/store";
import { useState, useRef, ChangeEvent, FormEvent } from "react";
import { Dialog, DialogContent, DialogHeader } from "../ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Eye, EyeOff, Building2 } from "lucide-react";
import { apiClient } from "@/lib/API_Client";
import { BASE_URL } from "@/lib/Base_url";

interface FormData {
  avatar: string | null;
  fullName: string;
  email: string;
  companyName: string;
  password: string;
  role: string;
  agreeToTerms: boolean;
}

export default function CreateClientForm() {
  const isCreateClientOpen = useAppStore((state) => state.isCreateClientOpen);
  const setIsCreateClientOpen = useAppStore((state) => state.setIsCreateClientOpen);
  const [form, setForm] = useState<FormData>({
    avatar: null,
    fullName: "",
    email: "",
    companyName: "",
    password: "",
    role: 'client',
    agreeToTerms: false,
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleAvatarFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) =>
      setForm((f) => ({ ...f, avatar: e.target?.result as string }));
    reader.readAsDataURL(file);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.agreeToTerms) return;
    setIsSubmitting(true);
    try {
      const response = await apiClient.post(`${BASE_URL}/clients/createClients`, form);
      if (response.status === 200 || response.status === 201) {
        setSubmitted(true);
      }
    } catch (error) {
      console.error("Failed to create client:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsCreateClientOpen(false);
    setTimeout(() => {
      setSubmitted(false);
      setForm({ 
        avatar: null, 
        fullName: "", 
        email: "", 
        companyName: "", 
        password: "", 
        role: 'client', 
        agreeToTerms: false 
      });
    }, 300);
  };

  return (
    <Dialog open={isCreateClientOpen} onOpenChange={setIsCreateClientOpen}>
      {/* RESPONSIVE FIXES: 
          - w-[95vw] ensures it doesn't touch screen edges on mobile
          - max-h-[90vh] and overflow-y-auto prevents content cutoff on short screens
      */}
      <DialogContent className="w-[95vw] sm:max-w-[450px] p-4 sm:p-6 border-border bg-background shadow-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">Create a Client</DialogTitle>
        </DialogHeader>

        {submitted ? (
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-12 flex flex-col items-center gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-3xl">
              ✓
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Client Created!</h2>
            <p className="text-slate-500 text-sm">
              {form.fullName || "Your client"} has been added to your workspace.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-2 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
            >
              Add Another Client
            </button>
            <button
              onClick={handleClose}
              className="text-sm text-slate-400 hover:text-slate-600 font-medium"
            >
              Close
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl p-5 sm:p-8 w-full">
            <div className="mb-6 sm:mb-7">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Create a client</h1>
              <p className="text-slate-500 text-xs sm:text-sm mt-1">
                Start managing your clients more efficiently
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-4 sm:space-y-5">
              {/* Avatar upload */}
              <div
                className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl border transition-all cursor-pointer group
                ${dragOver
                    ? "border-blue-400 bg-blue-50"
                    : "border-slate-200 bg-slate-50 hover:border-blue-300 hover:bg-blue-50/40"
                  }`}
                onClick={() => fileRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  const f = e.dataTransfer.files[0];
                  if (f) handleAvatarFile(f);
                }}
              >
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden bg-white border-2 border-white shadow-sm">
                    {form.avatar ? (
                      <img src={form.avatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-slate-400">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center">
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                      <circle cx="12" cy="13" r="4" />
                    </svg>
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-slate-700">
                    {form.avatar ? "Photo uploaded" : "Upload a photo"}
                  </p>
                  <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5">
                    Drag & drop or click
                  </p>
                </div>
              </div>

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleAvatarFile(f);
                }}
              />

              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs sm:text-sm font-medium text-slate-700">Full name</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="John Doe"
                    value={form.fullName}
                    onChange={handleChange}
                    className="w-full pl-9 pr-4 py-2 sm:py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs sm:text-sm font-medium text-slate-700">Email address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="name@company.com"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 sm:py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white transition-all"
                />
              </div>

              {/* Company Name */}
              <div className="space-y-1.5">
                <label className="text-xs sm:text-sm font-medium text-slate-700">Company name</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <Building2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </span>
                  <input
                    type="text"
                    name="companyName"
                    placeholder="Acme Corp"
                    value={form.companyName}
                    onChange={handleChange}
                    className="w-full pl-9 pr-4 py-2 sm:py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-xs sm:text-sm font-medium text-slate-700">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Create a password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full px-4 py-2 sm:py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                  </button>
                </div>
              </div>

              {/* Terms */}
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={form.agreeToTerms}
                  onChange={handleChange}
                  className="mt-1 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded border-slate-300 accent-blue-600"
                />
                <span className="text-[10px] sm:text-xs text-slate-500 leading-tight">
                  I agree to the <span className="text-blue-600 underline">Terms</span> and <span className="text-blue-600 underline">Privacy Policy</span>.
                </span>
              </label>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting || !form.agreeToTerms}
                className="w-full py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all shadow-md text-sm sm:text-base"
              >
                {isSubmitting ? "Creating..." : "Create account →"}
              </button>
            </form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}