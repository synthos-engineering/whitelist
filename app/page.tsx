"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Twitter,
  Send,
  BarChart4,
  ListFilter,
  Wallet,
  CheckCircle,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OccupationForm from "./components/occupation-form";
import PlatformForm from "./components/platform-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { ToastContainer } from "react-toastify";

type FormStep = "email" | "occupation" | "platform" | "success";

export default function LandingPage() {
  const [email, setEmail] = useState("");
  const [occupation, setOccupation] = useState("");
  const [customOccupation, setCustomOccupation] = useState("");
  const [platform, setPlatform] = useState("");
  const [customPlatform, setCustomPlatform] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState<FormStep>("email");
  const [mounted, setMounted] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [remainingSpots, setRemainingSpots] = useState<number | null>(null);
  const formCardRef = useRef<HTMLDivElement>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Fetch waitlist count
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

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      if (formCardRef.current) {
        formCardRef.current.classList.remove("animate-shake");
        // Force reflow to restart animation
        void formCardRef.current.offsetWidth;
        formCardRef.current.classList.add("animate-shake");
      }
      toast.error("Please enter a valid email address");
      return;
    }

    // Move to occupation step
    setCurrentStep("occupation");
  };

  const handleOccupationSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!occupation) {
      toast.error("Please select an occupation or choose 'Other' to specify");
      return;
    }

    if (occupation === "other" && !customOccupation) {
      toast.error("Please enter your occupation in the field provided");
      return;
    }

    // Move to platform step
    setCurrentStep("platform");
  };

  const handlePlatformSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!platform) {
      toast.error("Please select a platform or choose 'Other' to specify");
      return;
    }

    if (platform === "other" && !customPlatform) {
      toast.error("Please enter your preferred platform in the field provided");
      return;
    }

    setIsSubmitting(true);

    try {
      const finalOccupation =
        occupation === "other" ? customOccupation : occupation;
      const finalPlatform = platform === "other" ? customPlatform : platform;

      const response = await fetch("/api/submit-waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          occupation: finalOccupation,
          platform: finalPlatform,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Show error message from the server as a toast
        toast.error(data.error || "Failed to submit");
        return;
      }

      toast.success(
        "You've been added to our early access list. Check your email for confirmation!"
      );

      // Store the submitted email for the success screen
      setSubmittedEmail(email);
      setShowSuccessDialog(true);

      // Show additional toast
      toast.success(
        "Welcome to Synthos! We're excited to have you join our early access program."
      );
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Unable to connect to the server. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setEmail("");
    setOccupation("");
    setCustomOccupation("");
    setPlatform("");
    setCustomPlatform("");
    setShowSuccessDialog(false);
  };

  const goBack = () => {
    if (currentStep === "occupation") {
      setCurrentStep("email");
    } else if (currentStep === "platform") {
      setCurrentStep("occupation");
    }
  };

  return (
    <div className="min-h-screen text-gray-800 relative overflow-hidden bg-gray-100">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-100 rounded-full filter blur-3xl opacity-30 -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-100 rounded-full filter blur-3xl opacity-30 translate-y-1/2 -translate-x-1/3"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10 min-h-screen flex flex-col justify-center">
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 bg-gray-100/90 backdrop-blur-sm border-b-2 border-gray-300 z-50">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center">
              {logoError ? (
                <div className="w-12 h-12 md:w-16 md:h-16 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  S
                </div>
              ) : (
                <div className="w-12 h-12 md:w-16 md:h-16 relative">
                  <Image
                    src="/synthos-logo.png"
                    alt="Synthos Logo"
                    fill
                    sizes="(max-width: 768px) 48px"
                    className="object-contain"
                    priority
                    onError={() => setLogoError(true)}
                  />
                </div>
              )}
              <Link href="/" className="flex items-center">
                <span className="ml-2 font-bold text-xl">SynthOS</span>
              </Link>
            </div>

            {/* Social Media Links */}
            <div className="flex items-center gap-4">
              <Link
                href="https://x.com/SynthOS__"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-600 hover:text-purple-700 transition-colors"
                aria-label="X"
              >
                <svg width="20" height="18" viewBox="0 0 300 271" fill="#9333ea" xmlns="http://www.w3.org/2000/svg">
                  <path d="m236 0h46l-101 115 118 156h-92.6l-72.5-94.8-83 94.8h-46l107-123-113-148h94.9l65.5 86.6zm-16.1 244h25.5l-165-218h-27.4z"/>
                </svg>
              </Link>
              <Link
                href="https://t.me/+x8mewakKNJNmY2Nl"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-600 hover:text-purple-700 transition-colors"
                aria-label="Telegram"
              >
                <Send className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </header>

        <div className="grid max-w-2xl mx-auto w-full">
          <div className="flex flex-col items-center text-center py-[120px]">
            {/* Main Heading and Subheading */}
            <div className="mb-10 md:mb-12">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Personalized DeFi Investing Made Simple
              </h1>
              <p className="text-lg md:text-xl text-gray-600">
                No research, no stress.
              </p>
              <p className="text-lg md:text-xl text-gray-600 mb-4">
                SynthOS builds custom investment plans just for you.
              </p>
              {remainingSpots !== null && (
                <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-full text-purple-700 shadow-sm border border-purple-100">
                  <div className="items-center">
                    <div className="flex gap-1 justify-center items-center">
                      <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                        {remainingSpots}
                      </span>
                      <span className="text-sm font-semibold text-purple-600">
                        spots remaining
                      </span>
                    </div>
                  </div>
                  <div className="h-4 w-px bg-purple-200"></div>
                  <span className="text-xs text-purple-600">
                    Join the waitlist now!
                  </span>
                </div>
              )}
            </div>

            {/* Form Card */}
            <div
              ref={formCardRef}
              className={`bg-white rounded-2xl shadow-xl border border-purple-100 p-5 md:p-8 transition-all duration-300 hover:shadow-2xl w-full relative ${
                remainingSpots === 0 ? "pointer-events-none" : ""
              }`}
            >
              {remainingSpots === 0 && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center rounded-2xl">
                  <div className="text-center p-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      Waitlist is Full
                    </h3>
                    <p className="text-gray-600">
                      Please wait for our public beta release.
                    </p>
                  </div>
                </div>
              )}
              {currentStep !== "success" ? (
                <>
                  {/* Form Progress Indicator */}
                  <div className="mb-6 md:mb-8">
                    <div className="flex items-center justify-center">
                      <div className="flex items-center">
                        <div
                          className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-medium transition-colors duration-300 ${
                            currentStep === "email"
                              ? "bg-purple-600 text-white"
                              : "bg-purple-600 text-white"
                          }`}
                        >
                          1
                        </div>
                        <div
                          className={`w-8 md:w-16 h-1 transition-colors duration-300 ${
                            currentStep === "email"
                              ? "bg-purple-100"
                              : "bg-purple-600"
                          }`}
                        ></div>
                      </div>
                      <div className="flex items-center">
                        <div
                          className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-medium transition-colors duration-300 ${
                            currentStep === "occupation"
                              ? "bg-purple-600 text-white"
                              : currentStep === "platform"
                              ? "bg-purple-600 text-white"
                              : "bg-purple-100 text-purple-600"
                          }`}
                        >
                          2
                        </div>
                        <div
                          className={`w-8 md:w-16 h-1 transition-colors duration-300 ${
                            currentStep === "platform"
                              ? "bg-purple-600"
                              : "bg-purple-100"
                          }`}
                        ></div>
                      </div>
                      <div className="flex items-center">
                        <div
                          className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-medium transition-colors duration-300 ${
                            currentStep === "platform"
                              ? "bg-purple-600 text-white"
                              : "bg-purple-100 text-purple-600"
                          }`}
                        >
                          3
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Form Title */}
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 text-center mb-4 md:mb-6">
                    Request Early Access
                  </h3>

                  {/* Multi-step Form */}
                  <div
                    className={`transition-opacity duration-300 ${
                      mounted ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    {currentStep === "email" ? (
                      <form
                        onSubmit={handleEmailSubmit}
                        className="space-y-4 md:space-y-6"
                      >
                        <div className="space-y-2">
                          <label
                            htmlFor="email"
                            className="text-sm font-medium text-gray-700"
                          >
                            Email Address
                          </label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-white border-gray-200 focus:border-purple-500 h-10 md:h-12 text-gray-900 placeholder:text-gray-400 rounded-lg"
                            required
                          />
                        </div>
                        <div className="flex justify-end">
                          <Button
                            type="submit"
                            className="bg-purple-600 hover:bg-purple-700 text-white px-4 md:px-6 py-2 rounded-lg transition-all duration-300 hover:translate-y-[-2px] hover:shadow-md"
                          >
                            Next <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </form>
                    ) : currentStep === "occupation" ? (
                      <OccupationForm
                        occupation={occupation}
                        setOccupation={setOccupation}
                        customOccupation={customOccupation}
                        setCustomOccupation={setCustomOccupation}
                        onSubmit={handleOccupationSubmit}
                        onBack={goBack}
                        isSubmitting={false}
                      />
                    ) : (
                      <PlatformForm
                        platform={platform}
                        setPlatform={setPlatform}
                        customPlatform={customPlatform}
                        setCustomPlatform={setCustomPlatform}
                        onSubmit={handlePlatformSubmit}
                        onBack={goBack}
                        isSubmitting={isSubmitting}
                      />
                    )}
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-semibold text-gray-900">
              Success! 🎉
            </DialogTitle>
            <div className="text-center">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 md:w-12 md:h-12 text-green-600" />
              </div>
              <div className="text-gray-600 mb-6 max-w-md mx-auto">
                We've added{" "}
                <span className="text-gray-900 font-medium">
                  {submittedEmail}
                </span>{" "}
                to our waitlist. We'll notify you when we launch!
              </div>
              <div className="space-y-4 w-full max-w-sm mx-auto">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="text-sm font-medium text-gray-700 mb-2">
                    Spread the Word! 🚀
                  </div>
                  <div className="flex flex-col gap-3">
                    <a
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                        "I just joined the waitlist for SynthOS! Join me and be among the first to experience the future of DeFi. 🚀\n\n"
                      )}&url=${encodeURIComponent("https://synthos-engineering.com")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-neutral-800 transition-colors"
                    >
                      <svg width="20" height="18" viewBox="0 0 300 271" fill="white" xmlns="http://www.w3.org/2000/svg">
                        <path d="m236 0h46l-101 115 118 156h-92.6l-72.5-94.8-83 94.8h-46l107-123-113-148h94.9l65.5 86.6zm-16.1 244h25.5l-165-218h-27.4z"/>
                      </svg>
                      Share on X
                    </a>
                    <a
                      href="https://t.me/+x8mewakKNJNmY2Nl"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 bg-[#229ED9] text-white px-4 py-2 rounded-lg hover:bg-[#1787b7] transition-colors"
                    >
                      <Send className="w-5 h-5" />
                      Join Telegram
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button
                onClick={resetForm}
                className="w-full bg-gray-900 hover:bg-gray-800"
              >
                Sign up with another email
              </Button>
            </DialogFooter>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <footer className="fixed bottom-0 left-0 right-0 bg-gray-100/90 backdrop-blur-sm border-t-2 border-gray-300 z-50">
        <div className="container mx-auto px-4 py-3">
          <p className="text-center text-xs md:text-sm text-gray-500">
            © 2025 Synthos. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
