
import * as React from "react"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export type ToastProps = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
}

// Create a custom hook that provides toast functions
export function useToast() {
  const [toasts, setToasts] = React.useState<{
    id: string;
    title?: string;
    description?: string;
    action?: React.ReactNode;
    variant?: "default" | "destructive";
  }[]>([])

  const toast = React.useMemo(
    () => ({
      toast: (title: string, options?: { description?: string; variant?: "default" | "destructive" }) => {
        const id = Math.random().toString(36).slice(2, 9)
        setToasts((currentToasts) => [
          ...currentToasts,
          {
            id,
            title,
            description: options?.description,
            variant: options?.variant,
          },
        ])
        return id
      },
      error: (title: string, options?: { description?: string }) => {
        const id = Math.random().toString(36).slice(2, 9)
        setToasts((currentToasts) => [
          ...currentToasts,
          {
            id,
            title,
            description: options?.description,
            variant: "destructive",
          },
        ])
        return id
      },
      success: (title: string, options?: { description?: string }) => {
        const id = Math.random().toString(36).slice(2, 9)
        setToasts((currentToasts) => [
          ...currentToasts,
          {
            id,
            title,
            description: options?.description,
          },
        ])
        return id
      },
      dismiss: (toastId?: string) => {
        if (toastId) {
          setToasts((currentToasts) =>
            currentToasts.filter((toast) => toast.id !== toastId)
          )
        }
      },
      toasts,
    }),
    [toasts]
  )

  return toast
}

// Create a callable toast function
const createToastFunction = () => {
  // We need to create a toast function that can be called directly
  // but also has error and success methods
  const toastFn = (title: string, options?: { description?: string; variant?: "default" | "destructive" }) => {
    // This needs to work outside of React components, so we'll handle that in the Toaster component
    window.dispatchEvent(new CustomEvent('toast', { 
      detail: { title, description: options?.description, variant: options?.variant }
    }));
  };

  toastFn.error = (title: string, options?: { description?: string }) => {
    window.dispatchEvent(new CustomEvent('toast', { 
      detail: { title, description: options?.description, variant: "destructive" }
    }));
  };

  toastFn.success = (title: string, options?: { description?: string }) => {
    window.dispatchEvent(new CustomEvent('toast', { 
      detail: { title, description: options?.description, variant: "default" }
    }));
  };

  return toastFn;
};

// Export the callable toast function
export const toast = createToastFunction();

// Export Toaster component for use in main.tsx
export function Toaster() {
  const { toast: shadcnToast, toasts } = useToast();
  
  // Listen for toast events from outside React components
  React.useEffect(() => {
    const handleToast = (event: CustomEvent<ToastProps>) => {
      const { title, description, variant } = event.detail;
      shadcnToast(title || "", { description, variant });
    };
    
    window.addEventListener('toast', handleToast as EventListener);
    return () => {
      window.removeEventListener('toast', handleToast as EventListener);
    };
  }, [shadcnToast]);

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
