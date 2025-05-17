"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface PlatformFormProps {
  platform: string
  setPlatform: (value: string) => void
  customPlatform: string
  setCustomPlatform: (value: string) => void
  onSubmit: (e: React.FormEvent) => void
  onBack: () => void
  isSubmitting: boolean
}

const platforms = [
  { value: "instagram", label: "Instagram" },
  { value: "twitter", label: "Twitter/X" },
  { value: "facebook", label: "Facebook" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "tiktok", label: "TikTok" },
  { value: "youtube", label: "YouTube" },
  { value: "email", label: "Email Marketing" },
  { value: "other", label: "Other" },
]

export default function PlatformForm({
  platform,
  setPlatform,
  customPlatform,
  setCustomPlatform,
  onSubmit,
  onBack,
  isSubmitting,
}: PlatformFormProps) {
  const validateForm = () => {
    if (!platform) {
      // Add haptic feedback
      if (navigator.vibrate) {
        navigator.vibrate(200)
      }

      toast({
        title: "Please select a platform",
        description: "Select your preferred platform or choose 'Other' to specify",
        variant: "destructive",
        duration: 3000,
      })
      return false
    }

    if (platform === "other" && !customPlatform.trim()) {
      // Add haptic feedback
      if (navigator.vibrate) {
        navigator.vibrate(200)
      }

      toast({
        title: "Please specify your platform",
        description: "Enter your preferred platform in the field provided",
        variant: "destructive",
        duration: 3000,
      })
      return false
    }

    return true
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    onSubmit(e)
  }

  const handleBack = () => {
    // Clear the form state when going back
    setPlatform("")
    setCustomPlatform("")
    onBack()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
      <div className="space-y-3 md:space-y-4">
        <Label htmlFor="platform" className="text-sm font-medium text-gray-700">
          Which platform would you like to use the most?
        </Label>
        <RadioGroup 
          id="platform" 
          value={platform} 
          onValueChange={(value) => {
            setPlatform(value)
            // Clear custom platform when switching away from "other"
            if (value !== "other") {
              setCustomPlatform("")
            }
          }} 
          className="space-y-2 md:space-y-3"
        >
          {platforms.map((item) => (
            <div key={item.value} className="flex items-center space-x-3">
              <RadioGroupItem
                value={item.value}
                id={`platform-${item.value}`}
                className="text-gray-900 border-gray-400"
              />
              <Label 
                htmlFor={`platform-${item.value}`} 
                className={`cursor-pointer text-sm md:text-base ${
                  platform === item.value ? 'text-gray-900 font-medium' : 'text-gray-500'
                }`}
              >
                {item.label}
              </Label>
            </div>
          ))}
        </RadioGroup>

        {platform === "other" && (
          <div className="pt-2">
            <Input
              type="text"
              placeholder="Please specify your preferred platform"
              value={customPlatform}
              onChange={(e) => setCustomPlatform(e.target.value)}
              className="bg-white border-gray-200 focus:border-gray-400 h-10 md:h-12 text-gray-900 placeholder:text-gray-400 rounded-lg"
              required={platform === "other"}
            />
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={handleBack}
          className="border-gray-200 text-gray-700 hover:bg-gray-100 px-3 md:px-6 py-2 rounded-lg transition-all duration-300 text-sm md:text-base"
        >
          <ArrowLeft className="mr-1 md:mr-2 h-4 w-4" /> Back
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-purple-600 hover:bg-purple-700 text-white px-3 md:px-6 py-2 rounded-lg transition-all duration-300 hover:translate-y-[-2px] hover:shadow-md text-sm md:text-base"
        >
          {isSubmitting ? "Submitting..." : "Submit"} {!isSubmitting && <ArrowRight className="ml-1 md:ml-2 h-4 w-4" />}
        </Button>
      </div>
    </form>
  )
}
