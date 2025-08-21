import { toast } from "sonner";

export function showSuccess(message: string) {
  toast.success(message);
}

export function showError(error: unknown, fallbackMessage = "Something went wrong") {
  const message =
    error instanceof Error
      ? error.message
      : typeof error === "string"
      ? error
      : fallbackMessage;
  toast.error(message);
}

