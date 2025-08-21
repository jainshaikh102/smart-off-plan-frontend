import { toast } from "sonner";

// Minimal stub implementation to satisfy ContactForm dependency
// In a future iteration, wire this to real backend API or Redux actions.
export function useUserStore() {
  const submitContactForm = async (data: any) => {
    // Call the message-us proxy; assumes API expects similar fields
    const res = await fetch("/api/email/message-us", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        phone: data.phone,
        subject: data.subject || "General Inquiry",
        message: data.message,
        inquiryType: data.source || "website",
        propertyId: data.propertyId,
      }),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok || json?.success === false) {
      throw new Error(json?.message || "Failed to submit contact form");
    }
  };

  return {
    loading: false,
    submitContactForm,
  };
}

