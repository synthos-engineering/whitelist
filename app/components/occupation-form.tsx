"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowLeft, ArrowRight } from "lucide-react"

interface OccupationFormProps {
  occupation: string
  setOccupation: (value: string) => void
  customOccupation: string
  setCustomOccupation: (value: string) => void
  onSubmit: (e: React.FormEvent) => void
  onBack: () => void
  isSubmitting: boolean
}

const occupations = [
  { value: "developer", label: "Software Developer" },
  { value: "designer", label: "Designer" },
  { value: "marketer", label: "Marketing Professional" },
  { value: "product_manager", label: "Product Manager" },
  { value: "business_owner", label: "Business Owner" },
  { value: "student", label: "Student" },
  { value: "other", label: "Other" },
]

export default function OccupationForm({
  occupation,
  setOccupation,
  customOccupation,
  setCustomOccupation,
  onSubmit,
  onBack,
  isSubmitting,
}: OccupationFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4 md:space-y-6">
      <div className="space-y-3 md:space-y-4">
        <Label htmlFor="occupation" className="text-sm font-medium text-purple-200">
          What is your occupation?
        </Label>
        <RadioGroup id="occupation" value={occupation} onValueChange={setOccupation} className="space-y-2 md:space-y-3">
          {occupations.map((item) => (
            <div key={item.value} className="flex items-center space-x-3">
              <RadioGroupItem value={item.value} id={item.value} className="text-purple-400 border-purple-700" />
              <Label htmlFor={item.value} className="cursor-pointer text-purple-100 text-sm md:text-base">
                {item.label}
              </Label>
            </div>
          ))}
        </RadioGroup>

        {occupation === "other" && (
          <div className="pt-2">
            <Input
              type="text"
              placeholder="Please specify your occupation"
              value={customOccupation}
              onChange={(e) => setCustomOccupation(e.target.value)}
              className="bg-[#1a103c] border-purple-800/50 focus:border-purple-500 h-10 md:h-12 text-white placeholder:text-purple-400/50 rounded-lg"
            />
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="border-purple-800/50 text-purple-200 hover:bg-purple-800/30 px-3 md:px-6 py-2 rounded-lg transition-all duration-300 text-sm md:text-base"
        >
          <ArrowLeft className="mr-1 md:mr-2 h-4 w-4" /> Back
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-purple-600 hover:bg-purple-700 text-white px-3 md:px-6 py-2 rounded-lg transition-all duration-300 hover:translate-y-[-2px] hover:shadow-md text-sm md:text-base"
        >
          Next <ArrowRight className="ml-1 md:ml-2 h-4 w-4" />
        </Button>
      </div>
    </form>
  )
}
