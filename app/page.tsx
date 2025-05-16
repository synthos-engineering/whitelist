"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Twitter, Send, BarChart4, ListFilter, Wallet, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import CountdownTimer from "./components/countdown-timer"
import OccupationForm from "./components/occupation-form"
import PlatformForm from "./components/platform-form"

type FormStep = "email" | "occupation" | "platform" | "success"

export default function LandingPage() {
  const [email, setEmail] = useState("")
  const [occupation, setOccupation] = useState("")
  const [customOccupation, setCustomOccupation] = useState("")
  const [platform, setPlatform] = useState("")
  const [customPlatform, setCustomPlatform] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState<FormStep>("email")
  const [mounted, setMounted] = useState(false)
  const [logoError, setLogoError] = useState(false)
  const [submittedEmail, setSubmittedEmail] = useState("")

  // Set launch date to May 22, 2025 (Malaysia time)
  const launchDate = new Date("2025-05-22T00:00:00+08:00")

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !email.includes("@")) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      })
      return
    }

    // Move to occupation step
    setCurrentStep("occupation")
  }

  const handleOccupationSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!occupation) {
      toast({
        title: "Please select an occupation",
        description: "Select your occupation or choose 'Other' to specify",
        variant: "destructive",
      })
      return
    }

    if (occupation === "other" && !customOccupation) {
      toast({
        title: "Please specify your occupation",
        description: "Enter your occupation in the field provided",
        variant: "destructive",
      })
      return
    }

    // Move to platform step
    setCurrentStep("platform")
  }

  const handlePlatformSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!platform) {
      toast({
        title: "Please select a platform",
        description: "Select your preferred platform or choose 'Other' to specify",
        variant: "destructive",
      })
      return
    }

    if (platform === "other" && !customPlatform) {
      toast({
        title: "Please specify your platform",
        description: "Enter your preferred platform in the field provided",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const finalOccupation = occupation === "other" ? customOccupation : occupation
      const finalPlatform = platform === "other" ? customPlatform : platform

      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Simulate successful response
      // const response = await fetch("/api/submit-waitlist", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     email,
      //     occupation: finalOccupation,
      //     platform: finalPlatform,
      //   }),
      // })

      // if (!response.ok) {
      //   throw new Error("Failed to submit")
      // }

      toast({
        title: "Success!",
        description: "You've been added to our early access list. Check your email for confirmation!",
      })
      
      // Store the submitted email for the success screen
      setSubmittedEmail(email)
      setCurrentStep("success")

      // Show additional toast
      toast({
        title: "Welcome to Synthos!",
        description: "We're excited to have you join our early access program.",
      })

    } catch (error) {
      console.error("Submission error:", error)
      toast({
        title: "Something went wrong",
        description: "Please try again later",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setEmail("")
    setOccupation("")
    setCustomOccupation("")
    setPlatform("")
    setCustomPlatform("")
    setCurrentStep("email")
  }

  const goBack = () => {
    if (currentStep === "occupation") {
      setCurrentStep("email")
    } else if (currentStep === "platform") {
      setCurrentStep("occupation")
    }
  }

  return (
    <div className="min-h-screen text-gray-800 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-100 rounded-full filter blur-3xl opacity-30 -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-100 rounded-full filter blur-3xl opacity-30 translate-y-1/2 -translate-x-1/3"></div>
      </div>

      <Toaster />
      <div className="container mx-auto px-4 py-6 md:py-8 relative z-10">
        {/* Header */}
        <header className="flex justify-between items-center mb-8 md:mb-12">
          <div className="flex items-center gap-2 md:gap-3">
            {logoError ? (
              <div className="w-8 h-8 md:w-10 md:h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                S
              </div>
            ) : (
              <div className="w-8 h-8 md:w-10 md:h-10 relative">
                <Image
                  src="/synthos-logo.png"
                  alt="Synthos Logo"
                  fill
                  sizes="(max-width: 768px) 32px, 40px"
                  className="object-contain"
                  priority
                  onError={() => setLogoError(true)}
                />
              </div>
            )}
            <span className="text-lg md:text-xl font-bold text-gray-900">Synthos</span>
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
        </header>

        {/* Funding Announcement */}
        <div className="mb-8 md:mb-12 text-center">
          <div className="inline-flex items-center px-4 py-2 md:px-5 md:py-2.5 rounded-full bg-purple-100 text-purple-700 text-xs md:text-sm font-medium">
            <span className="mr-2">💫</span>
            We've raised a $1.2M pre-seed led by Abstract Ventures.
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 md:gap-16 max-w-6xl mx-auto">
          <div>
            {/* Main Heading and Subheading */}
            <div className="mb-10 md:mb-12">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                AI Agents for DeFi
              </h1>
              <p className="text-lg md:text-xl text-gray-600">
                Tailored investment strategies based on user preferences, ensuring data privacy and verifiability.
              </p>
            </div>

            {/* Countdown Timer */}
            <div className="mb-10 md:mb-12">
              <h3 className="text-base md:text-lg font-medium text-gray-600 mb-4 md:mb-6">
                <span className="inline-block px-3 py-1 md:px-4 md:py-1 bg-purple-100 rounded-full text-purple-700 mb-2 text-sm">
                  Limited Early Access
                </span>
                <br />
                Launching In:
              </h3>
              <CountdownTimer targetDate={launchDate} />
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-purple-100 p-5 md:p-8 transition-all duration-300 hover:shadow-2xl">
              {currentStep !== "success" ? (
                <>
                  {/* Form Progress Indicator */}
                  <div className="mb-6 md:mb-8">
                    <div className="flex items-center justify-center">
                      <div className="flex items-center">
                        <div
                          className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-medium transition-colors duration-300 ${
                            currentStep === "email" ? "bg-purple-600 text-white" : "bg-purple-100 text-purple-600"
                          }`}
                        >
                          1
                        </div>
                        <div
                          className={`w-8 md:w-16 h-1 transition-colors duration-300 ${
                            currentStep === "email" ? "bg-purple-100" : "bg-purple-600"
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
                            currentStep === "platform" ? "bg-purple-600" : "bg-purple-100"
                          }`}
                        ></div>
                      </div>
                      <div className="flex items-center">
                        <div
                          className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-medium transition-colors duration-300 ${
                            currentStep === "platform" ? "bg-purple-600 text-white" : "bg-purple-100 text-purple-600"
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
                  <div className={`transition-opacity duration-300 ${mounted ? "opacity-100" : "opacity-0"}`}>
                    {currentStep === "email" ? (
                      <form onSubmit={handleEmailSubmit} className="space-y-4 md:space-y-6">
                        <div className="space-y-2">
                          <label htmlFor="email" className="text-sm font-medium text-gray-700">
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
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 text-center">Thank You!</h3>
                  <p className="text-gray-600 text-center mb-6 max-w-md">
                    We've added <span className="text-gray-900 font-medium">{submittedEmail}</span> to our early access
                    list. We'll notify you when Synthos launches.
                  </p>
                  <div className="space-y-4 w-full max-w-sm">
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Share with friends</h4>
                      <div className="flex gap-3">
                        <Link
                          href={`https://twitter.com/intent/tweet?text=I just joined the waitlist for Synthos - AI Agents for DeFi! Join me: https://synthos.ai`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-white hover:bg-purple-50 p-2 rounded-md transition-colors"
                        >
                          <Twitter className="w-5 h-5 text-purple-600" />
                        </Link>
                        <Link
                          href={`https://t.me/share/url?url=https://synthos.ai&text=I just joined the waitlist for Synthos - AI Agents for DeFi! Join me:`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-white hover:bg-purple-50 p-2 rounded-md transition-colors"
                        >
                          <Send className="w-5 h-5 text-purple-600" />
                        </Link>
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

          {/* Workflow Visualization - Right Column */}
          <div className="flex justify-center items-center">
            <div className="relative max-w-sm">
              {/* Vertical Line */}
              <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-purple-200 -translate-x-1/2"></div>

              {/* Start */}
              <div className="relative mb-8">
                <div className="bg-white rounded-2xl shadow-lg p-4 w-40 mx-auto text-center text-gray-900 font-medium border border-purple-100">
                  Start
                </div>
                <div className="absolute left-1/2 bottom-0 w-0.5 h-8 bg-purple-200 -translate-x-1/2 translate-y-full"></div>
              </div>

              {/* Step 1: App */}
              <div className="relative mb-8">
                <div className="absolute left-1/2 bottom-0 w-0.5 h-8 bg-purple-200 -translate-x-1/2 translate-y-full"></div>
                <div className="bg-white rounded-2xl shadow-lg p-4 w-72 mx-auto flex items-center border border-purple-100 relative overflow-hidden group hover:shadow-xl transition-all duration-300">
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-400"></div>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mr-4 ml-2">
                      <BarChart4 className="h-5 w-5" />
                    </div>
                    <span className="text-gray-900 font-medium">App</span>
                  </div>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm">
                    1
                  </div>
                </div>
              </div>

              {/* Step 2: DeFi Strategies */}
              <div className="relative mb-8">
                <div className="absolute left-1/2 bottom-0 w-0.5 h-8 bg-purple-200 -translate-x-1/2 translate-y-full"></div>
                <div className="bg-white rounded-2xl shadow-lg p-4 w-72 mx-auto flex items-center border border-purple-100 relative overflow-hidden group hover:shadow-xl transition-all duration-300">
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-purple-400"></div>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 mr-4 ml-2">
                      <ListFilter className="h-5 w-5" />
                    </div>
                    <span className="text-gray-900 font-medium">DeFi Strategies</span>
                  </div>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 font-bold text-sm">
                    2
                  </div>
                </div>
              </div>

              {/* Step 3: Pick One */}
              <div className="relative mb-8">
                <div className="absolute left-1/2 bottom-0 w-0.5 h-8 bg-purple-200 -translate-x-1/2 translate-y-full"></div>
                <div className="bg-white rounded-2xl shadow-lg p-4 w-72 mx-auto flex items-center border border-purple-100 relative overflow-hidden group hover:shadow-xl transition-all duration-300">
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-orange-400"></div>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 mr-4 ml-2">
                      <ListFilter className="h-5 w-5" />
                    </div>
                    <span className="text-gray-900 font-medium">Pick One</span>
                  </div>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600 font-bold text-sm">
                    3
                  </div>
                </div>
              </div>

              {/* Step 4: Invest */}
              <div className="relative mb-8">
                <div className="absolute left-1/2 bottom-0 w-0.5 h-8 bg-purple-200 -translate-x-1/2 translate-y-full"></div>
                <div className="bg-white rounded-2xl shadow-lg p-4 w-72 mx-auto flex items-center border border-purple-100 relative overflow-hidden group hover:shadow-xl transition-all duration-300">
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-green-400"></div>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600 mr-4 ml-2">
                      <Wallet className="h-5 w-5" />
                    </div>
                    <span className="text-gray-900 font-medium">Invest</span>
                  </div>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg bg-green-50 flex items-center justify-center text-green-600 font-bold text-sm">
                    4
                  </div>
                </div>
              </div>

              {/* Earn */}
              <div className="relative">
                <div className="bg-white rounded-2xl shadow-lg p-4 w-40 mx-auto text-center flex items-center justify-center gap-2 text-gray-900 border border-purple-100 hover:shadow-xl transition-all duration-300">
                  <Wallet className="h-4 w-4" />
                  <span className="font-medium">Earn</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-xs md:text-sm text-gray-500 mt-12 md:mt-16 pb-4">
          <p>© 2025 Synthos. All rights reserved.</p>
        </footer>
      </div>
    </div>
  )
}
