
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

import * as React from "react"
import { useToast as useShadcnToast } from "@/components/ui/toast"

export type ToastProps = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
}

// Create a wrapper around the shadcn toast to provide a more convenient API
const toast = (title: string, options?: { description?: string; variant?: "default" | "destructive" }) => {
  const { toast: shadcnToast } = useShadcnToast();
  return shadcnToast({
    title,
    description: options?.description,
    variant: options?.variant,
  });
};

// Add helper methods
toast.error = (title: string, options?: { description?: string }) => {
  const { toast: shadcnToast } = useShadcnToast();
  return shadcnToast({
    title,
    description: options?.description,
    variant: "destructive",
  });
};

toast.success = (title: string, options?: { description?: string }) => {
  const { toast: shadcnToast } = useShadcnToast();
  return shadcnToast({
    title,
    description: options?.description,
  });
};

export { useShadcnToast as useToast, toast };

// Export Toaster component for use in main.tsx
export function Toaster() {
  const { toasts } = useShadcnToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
