"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  ArrowRight,
  CheckCircle,
  User,
  Mail,
  Calendar,
  X,
  Clock,
  LightbulbIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ToastContainer } from "react-toastify";

const updates = [];

export default function LandingPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [remainingSpots, setRemainingSpots] = useState<number | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showUpdates, setShowUpdates] = useState(false);
  const [showAllUpdates, setShowAllUpdates] = useState(false);

  useEffect(() => {
    fetch("/api/waitlist-count")
      .then((res) => res.json())
      .then((data) => {
        if (data.remainingSpots !== undefined) {
          setRemainingSpots(data.remainingSpots);
        }
      })
      .catch((error) => {
        console.error("Error fetching waitlist count:", error);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/submit-waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          occupation: "not_specified",
          platform: "not_specified",
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.error || "Failed to submit");
        return;
      }
      setSubmittedEmail(email);
      setShowSuccessDialog(true);
    } catch (error) {
      toast.error("Unable to connect to the server. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setEmail("");
    setName("");
    setShowSuccessDialog(false);
  };

  // Function to toggle showing all updates
  const toggleShowAllUpdates = () => {
    setShowAllUpdates(!showAllUpdates);
  };

  // Determine which updates to display
  const displayedUpdates = showAllUpdates ? updates : updates.slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-slate-50">
      {/* Gradient background overlay */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse at top left, rgba(167, 139, 250, 0.15) 0%, transparent 70%), radial-gradient(ellipse at bottom right, rgba(99, 102, 241, 0.15) 0%, transparent 70%)",
        }}
      />
      {/* Subtle pattern */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-10"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236366f1' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          backgroundSize: "30px 30px",
        }}
      />
      {/* Updates Button with social links */}
      <div className="absolute top-4 right-4 md:top-8 md:right-8 z-20 flex items-center gap-3">
        <a
          href="https://x.com/SynthOS__"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white/80 backdrop-blur-sm border border-indigo-100 shadow-sm rounded-full p-2 flex items-center justify-center text-indigo-700 hover:bg-indigo-50 transition"
          aria-label="Follow us on X"
        >
          <svg
            width="20"
            height="18"
            viewBox="0 0 300 271"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="m236 0h46l-101 115 118 156h-92.6l-72.5-94.8-83 94.8h-46l107-123-113-148h94.9l65.5 86.6zm-16.1 244h25.5l-165-218h-27.4z" />
          </svg>
        </a>
        <button
          onClick={() => setShowUpdates(true)}
          className="bg-white/80 backdrop-blur-sm border border-indigo-100 shadow-sm rounded-lg px-4 py-2 flex items-center gap-2 text-indigo-700 hover:bg-indigo-50 transition"
        >
          <span className="font-medium hidden md:inline">Updates</span>
          <Calendar className="w-5 h-5 text-indigo-500" />
        </button>
      </div>
      <ToastContainer position="top-right" autoClose={3000} theme="light" />
      <main className="w-full max-w-md mx-auto px-4 py-8 relative z-10 flex flex-col items-center">
        {/* Logo */}
        <div className="mb-8">
          {logoError ? (
            <div className="w-28 h-28 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto shadow-xl">
              S
            </div>
          ) : (
            <div className="w-28 h-28 relative mx-auto">
              <Image
                src="/synthos-logo.png"
                alt="SynthOS Logo"
                fill
                sizes="112px"
                className="object-contain"
                priority
                onError={() => setLogoError(true)}
              />
            </div>
          )}
        </div>
        {/* Headline & Subheadline */}
        <div className="text-center mb-8">
          <p className="text-indigo-600 text-sm font-medium tracking-wider mb-2 uppercase">
            SYNTHOS WAITLIST
          </p>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gray-900">
            DeFi Made Personal <br />
          </h1>
          <p className="text-gray-600 text-base max-w-md mx-auto mt-4">
            Thousands of curated APY plans tailored to your unique preferences.
            Navigate DeFi with confidence, without the complexity.
          </p>
        </div>
        {/* Waitlist Form */}
        <form
          onSubmit={handleSubmit}
          className="w-full bg-white border border-gray-200 rounded-2xl shadow-xl p-6 mb-8 flex flex-col gap-4"
        >
          <div className="relative">
            <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Full name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-12 bg-gray-50 border-gray-200 focus:border-indigo-400 rounded-xl pl-12 text-gray-900 placeholder:text-gray-500"
              autoComplete="off"
            />
          </div>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="email"
              placeholder="Email address..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 bg-gray-50 border-gray-200 focus:border-indigo-400 rounded-xl pl-12 text-gray-900 placeholder:text-gray-500"
              autoComplete="off"
              disabled={isSubmitting}
              required
            />
          </div>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl font-semibold text-base transition-all group"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                Secure Your Spot{" "}
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </span>
            )}
          </Button>
        </form>
        {/* Waitlist Spots Indicator */}
        {remainingSpots !== null && (
          <div className="flex items-center gap-3 px-5 py-3 bg-white/80 backdrop-blur-sm border border-indigo-100 shadow-sm rounded-full">
            <Clock className="w-4 h-4 text-indigo-500" />
            <p className="text-indigo-800 font-medium">
              Limited access: Only{" "}
              <span className="font-bold text-indigo-600">
                {remainingSpots}
              </span>{" "}
              spots left
            </p>
          </div>
        )}
        {/* Footer */}
        <footer className="w-full text-center text-sm text-gray-500 mt-8 border-t border-gray-200 pt-6">
          <p>© 2024 SynthOS. All rights reserved.</p>
        </footer>
      </main>
      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md bg-[#18181c] text-white p-0 overflow-hidden rounded-2xl border border-gray-800 shadow-xl">
          <DialogTitle className="sr-only">Waitlist Confirmation</DialogTitle>
          <div className="p-6">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center">
                <CheckCircle className="h-10 w-10 text-green-500" />
              </div>
            </div>
            <h2 className="text-center text-2xl font-semibold mb-2 text-white">
              We've added you to our waitlist!
            </h2>
            <p className="text-center text-gray-300 mb-6">
              We'll let you know when SynthOS is ready.
            </p>
            <div className="bg-[#23232a] rounded-xl p-4 mb-6 border border-gray-700">
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-gray-100 font-medium">
                  {submittedEmail}
                </span>
              </div>

              <a
                href="https://t.me/+x8mewakKNJNmY2Nl"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-[#229ED9] text-white px-4 py-3 rounded-lg hover:bg-[#1787b7] transition-colors mt-4 w-full"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-send"
                >
                  <path d="m22 2-7 20-4-9-9-4Z" />
                  <path d="M22 2 11 13" />
                </svg>
                Join our Telegram Group
              </a>
            </div>
            <Button
              onClick={resetForm}
              className="w-full h-12 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl font-medium"
            >
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      {/* Updates Panel */}
      <Dialog open={showUpdates} onOpenChange={setShowUpdates}>
        <DialogContent className="sm:max-w-md bg-white text-gray-900 p-0 overflow-hidden rounded-lg border border-gray-200 shadow-xl max-h-[90vh]">
          <DialogTitle className="sr-only">Development Updates</DialogTitle>
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-semibold text-gray-900">Updates</h2>
            </div>
            <div className="space-y-3 overflow-y-auto max-h-[60vh] pr-2">
              {displayedUpdates.map((update, index) => (
                <div
                  key={index}
                  className="border-b border-gray-200 pb-3 last:border-b-0 last:pb-0"
                >
                  <div className="text-xs text-gray-500 mb-1">
                    {update.date}
                  </div>
                  <p className="text-sm text-gray-700">{update.content}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-200">
              <div className="text-xs text-gray-500">Latest from SynthOS</div>
              <Button
                onClick={toggleShowAllUpdates}
                variant="outline"
                className="text-xs flex items-center border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                {showAllUpdates ? "Show Less" : "See All"}
                <ArrowRight
                  className={`ml-1 h-3 w-3 transition-transform ${
                    showAllUpdates ? "rotate-90" : ""
                  }`}
                />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
