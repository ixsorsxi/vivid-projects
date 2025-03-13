
import {
  useToast as useToastInternal,
  type ToastActionElement,
  type ToastProps,
} from "@/components/ui/toast";

type ToastType = {
  title?: string;
  description?: string;
  action?: ToastActionElement;
  variant?: "default" | "destructive";
};

export const useToast = () => {
  const { toast } = useToastInternal();

  return {
    toast: (props: ToastType) => {
      return toast(props);
    },
  };
};

// Re-export the toast function from internal
export { toast } from "@/components/ui/toast";
