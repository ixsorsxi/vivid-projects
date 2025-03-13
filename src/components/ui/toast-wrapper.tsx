
import { toast, Toaster } from "sonner";

// Re-export the toast function for use throughout the app
export { toast, Toaster };

// Simplified toast interface that matches our current usage
export const useToast = () => {
  return {
    toast: (props: {
      title?: string;
      description?: string;
      variant?: "default" | "destructive";
    }) => {
      if (props.variant === "destructive") {
        return toast.error(props.title, {
          description: props.description,
        });
      }
      return toast(props.title, {
        description: props.description,
      });
    }
  };
};
