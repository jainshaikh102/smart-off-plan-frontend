"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactFormSchema, ContactFormData } from "@/lib/validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useUserStore } from "@/store/useUserStore";
import { showSuccess, showError } from "@/lib/error-handler";
import { sanitize } from "@/lib/security";
import { Mail, Phone, User, MessageSquare } from "lucide-react";

interface ContactFormProps {
  propertyId?: string;
  onSuccess?: () => void;
  className?: string;
}

export function ContactForm({
  propertyId,
  onSuccess,
  className,
}: ContactFormProps) {
  const { submitContactForm, loading } = useUserStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
      propertyId: propertyId || "",
      source: "website",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      // Sanitize input data
      const sanitizedData = {
        ...data,
        name: sanitize.text(data.name),
        email: sanitize.email(data.email),
        phone: sanitize.phone(data.phone),
        subject: data.subject ? sanitize.text(data.subject) : undefined,
        message: sanitize.text(data.message),
      };

      await submitContactForm(sanitizedData);

      showSuccess(
        "Thank you! Your message has been sent successfully. We will get back to you soon."
      );
      reset();

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      showError(error, "Failed to send message. Please try again.");
    }
  };

  const isLoading = loading || isSubmitting;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={className} noValidate>
      <div className="space-y-6">
        {/* Name Field */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-[#8b7355] font-medium">
            <User className="w-4 h-4 inline mr-2" />
            Full Name *
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="Enter your full name"
            {...register("name")}
            className={errors.name ? "border-red-500 focus:border-red-500" : ""}
            disabled={isLoading}
          />
          {errors.name && (
            <p className="text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-[#8b7355] font-medium">
            <Mail className="w-4 h-4 inline mr-2" />
            Email Address *
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email address"
            {...register("email")}
            className={
              errors.email ? "border-red-500 focus:border-red-500" : ""
            }
            disabled={isLoading}
          />
          {errors.email && (
            <p className="text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* Phone Field */}
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-[#8b7355] font-medium">
            <Phone className="w-4 h-4 inline mr-2" />
            Phone Number *
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+971 50 123 4567"
            {...register("phone")}
            className={
              errors.phone ? "border-red-500 focus:border-red-500" : ""
            }
            disabled={isLoading}
          />
          {errors.phone && (
            <p className="text-sm text-red-600">{errors.phone.message}</p>
          )}
        </div>

        {/* Subject Field */}
        <div className="space-y-2">
          <Label htmlFor="subject" className="text-[#8b7355] font-medium">
            Subject
          </Label>
          <Input
            id="subject"
            type="text"
            placeholder="What is this regarding?"
            {...register("subject")}
            className={
              errors.subject ? "border-red-500 focus:border-red-500" : ""
            }
            disabled={isLoading}
          />
          {errors.subject && (
            <p className="text-sm text-red-600">{errors.subject.message}</p>
          )}
        </div>

        {/* Message Field */}
        <div className="space-y-2">
          <Label htmlFor="message" className="text-[#8b7355] font-medium">
            <MessageSquare className="w-4 h-4 inline mr-2" />
            Message *
          </Label>
          <Textarea
            id="message"
            placeholder="Tell us how we can help you..."
            rows={5}
            {...register("message")}
            className={
              errors.message ? "border-red-500 focus:border-red-500" : ""
            }
            disabled={isLoading}
          />
          {errors.message && (
            <p className="text-sm text-red-600">{errors.message.message}</p>
          )}
          <div className="text-sm text-gray-500">
            {watch("message")?.length || 0}/1000 characters
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#8b7355] hover:bg-deep-brown text-white py-3"
        >
          {isLoading ? (
            <>
              <LoadingSpinner size="sm" color="white" className="mr-2" />
              Sending Message...
            </>
          ) : (
            "Send Message"
          )}
        </Button>

        {/* Privacy Notice */}
        <p className="text-xs text-gray-500 text-center">
          By submitting this form, you agree to our{" "}
          <a href="/privacy-policy" className="text-[#8b7355] hover:underline">
            Privacy Policy
          </a>{" "}
          and consent to being contacted by our team.
        </p>
      </div>
    </form>
  );
}
