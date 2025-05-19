"use client";

import type React from "react";
import { useRef } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface OccupationFormProps {
  occupation: string;
  setOccupation: (value: string) => void;
  customOccupation: string;
  setCustomOccupation: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
  isSubmitting: boolean;
}

const occupations = [
  { value: "developer", label: "Software Developer" },
  { value: "designer", label: "Designer" },
  { value: "marketer", label: "Marketing Professional" },
  { value: "product_manager", label: "Product Manager" },
  { value: "business_owner", label: "Business Owner" },
  { value: "student", label: "Student" },
  { value: "other", label: "Other" },
];

export default function OccupationForm({
  occupation,
  setOccupation,
  customOccupation,
  setCustomOccupation,
  onSubmit,
  onBack,
  isSubmitting,
}: OccupationFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const firstRadioRef = useRef<HTMLButtonElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!occupation) {
      if (formRef.current) {
        formRef.current.classList.remove("animate-shake");
        // Force reflow to restart animation
        void formRef.current.offsetWidth;
        formRef.current.classList.add("animate-shake");
        // Focus on the first radio button
        firstRadioRef.current?.focus();
      }

      toast({
        title: "Please select an occupation",
        description: "Select your occupation or choose 'Other' to specify",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    if (occupation === "other" && !customOccupation.trim()) {
      if (formRef.current) {
        formRef.current.classList.remove("animate-shake");
        void formRef.current.offsetWidth;
        formRef.current.classList.add("animate-shake");
      }

      toast({
        title: "Please specify your occupation",
        description: "Enter your occupation in the field provided",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    onSubmit(e);
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="space-y-4 md:space-y-6"
    >
      <div className="space-y-3 md:space-y-4">
        <Label
          htmlFor="occupation"
          className="text-sm font-medium text-gray-700"
        >
          What is your occupation?
        </Label>
        <RadioGroup
          id="occupation"
          value={occupation}
          onValueChange={(value) => {
            setOccupation(value);
            // Clear custom occupation when switching away from "other"
            if (value !== "other") {
              setCustomOccupation("");
            }
          }}
          className="space-y-2 md:space-y-3"
        >
          {occupations.map((item, index) => (
            <div key={item.value} className="flex items-center space-x-3">
              <RadioGroupItem
                value={item.value}
                id={item.value}
                ref={index === 0 ? firstRadioRef : undefined}
                className="text-gray-900 border-gray-400"
              />
              <Label
                htmlFor={item.value}
                className={`cursor-pointer text-sm md:text-base ${
                  occupation === item.value
                    ? "text-gray-900 font-medium"
                    : "text-gray-500"
                }`}
              >
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
              className="bg-white border-gray-200 focus:border-gray-400 h-10 md:h-12 text-gray-900 placeholder:text-gray-400 rounded-lg"
              required={occupation === "other"}
            />
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="border-gray-200 text-gray-700 hover:bg-gray-100 px-3 md:px-6 py-2 rounded-lg transition-all duration-300 text-sm md:text-base"
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
  );
}
