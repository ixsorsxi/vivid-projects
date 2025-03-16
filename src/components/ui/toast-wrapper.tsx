
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  useToast as useShadcnToast,
} from "@/components/ui/toast"

import * as React from "react"

export type ToastProps = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
}

// Create a wrapper around the shadcn toast to provide a more convenient API
const toast = {
  // Base toast
  show: (title: string, options?: { description?: string; variant?: "default" | "destructive" }) => {
    const { toast } = useShadcnToast();
    return toast({
      title,
      description: options?.description,
      variant: options?.variant,
    });
  },
  
  // Error toast
  error: (title: string, options?: { description?: string }) => {
    const { toast } = useShadcnToast();
    return toast({
      title,
      description: options?.description,
      variant: "destructive",
    });
  },
  
  // Success toast
  success: (title: string, options?: { description?: string }) => {
    const { toast } = useShadcnToast();
    return toast({
      title,
      description: options?.description,
    });
  }
};

// Default export
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
