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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import OccupationForm from "./components/occupation-form";
import PlatformForm from "./components/platform-form";

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
  const formCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
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
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    // Move to occupation step
    setCurrentStep("occupation");
  };

  const handleOccupationSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!occupation) {
      toast({
        title: "Please select an occupation",
        description: "Select your occupation or choose 'Other' to specify",
        variant: "destructive",
      });
      return;
    }

    if (occupation === "other" && !customOccupation) {
      toast({
        title: "Please specify your occupation",
        description: "Enter your occupation in the field provided",
        variant: "destructive",
      });
      return;
    }

    // Move to platform step
    setCurrentStep("platform");
  };

  const handlePlatformSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!platform) {
      toast({
        title: "Please select a platform",
        description:
          "Select your preferred platform or choose 'Other' to specify",
        variant: "destructive",
      });
      return;
    }

    if (platform === "other" && !customPlatform) {
      toast({
        title: "Please specify your platform",
        description: "Enter your preferred platform in the field provided",
        variant: "destructive",
      });
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

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to submit");
      }

      toast({
        title: "Success!",
        description:
          "You've been added to our early access list. Check your email for confirmation!",
      });

      // Store the submitted email for the success screen
      setSubmittedEmail(email);
      setCurrentStep("success");

      // Show additional toast
      toast({
        title: "Welcome to Synthos!",
        description: "We're excited to have you join our early access program.",
      });
    } catch (error) {
      console.error("Submission error:", error);
      toast({
        title: "Something went wrong",
        description:
          error instanceof Error ? error.message : "Please try again later",
        variant: "destructive",
      });
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
    setCurrentStep("email");
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

      <Toaster />
      <div className="container mx-auto px-4 relative z-10 min-h-screen flex flex-col justify-center">
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
              <span className="text-xl md:text-2xl font-bold text-gray-900">
                Synthos
              </span>
            </div>

            {/* Social Media Links */}
            <div className="flex items-center gap-4">
              <Link
                href="https://x.com/SynthOS__"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-600 hover:text-purple-700 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
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

        <div className="grid max-w-2xl mx-auto w-full mt-24">
          <div className="flex flex-col items-center text-center">
            {/* Main Heading and Subheading */}
            <div className="mb-10 md:mb-12">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                AI Agents for DeFi
              </h1>
              <p className="text-lg md:text-xl text-gray-600">
                Tailored investment strategies based on user preferences,
                ensuring data privacy and verifiability.
              </p>
            </div>

            {/* Form Card */}
            <div
              ref={formCardRef}
              className="bg-white rounded-2xl shadow-xl border border-purple-100 p-5 md:p-8 transition-all duration-300 hover:shadow-2xl w-full"
            >
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
              ) : (
                /* Success Screen */
                <div className="flex flex-col items-center justify-center py-4 md:py-6">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle className="w-10 h-10 md:w-12 md:h-12 text-green-600" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 text-center">
                    Thank You!
                  </h3>
                  <p className="text-gray-600 text-center mb-6 max-w-md">
                    We've added{" "}
                    <span className="text-gray-900 font-medium">
                      {submittedEmail}
                    </span>{" "}
                    to our early access list. We'll notify you when Synthos
                    launches.
                  </p>
                  <div className="space-y-4 w-full max-w-sm">
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Spread the Word! 🚀
                      </h4>
                      <div className="flex flex-col gap-3">
                        <Link
                          href={`https://twitter.com/intent/tweet?text=I just joined the waitlist for Synthos - AI Agents for DeFi! Join me: https://synthos.ai`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-white hover:bg-purple-50 p-2 rounded-md transition-colors flex items-center gap-2"
                        >
                          <Twitter className="w-5 h-5 text-purple-600" />
                          <span className="text-sm text-gray-700">
                            Share on X
                          </span>
                        </Link>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-700">
                            Be with the ALPHA:
                          </span>
                          <Link
                            href="https://t.me/+VQtBZ5QIoacxZjZl"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white hover:bg-purple-50 p-2 rounded-md transition-colors flex items-center gap-2"
                          >
                            <Send className="w-5 h-5 text-purple-600" />
                            <span className="text-sm text-gray-700">
                              Telegram
                            </span>
                          </Link>
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={resetForm}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition-all duration-300"
                    >
                      Sign up with another email
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
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
