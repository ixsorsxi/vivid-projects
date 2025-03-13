
import { useToast as useToastInternal, toast as toastInternal, type ToastActionElement } from "@/components/ui/toast";

type ToastType = {
  title?: string;
  description?: string;
  action?: ToastActionElement;
  variant?: "default" | "destructive";
};

export const useToast = () => {
  const { toast: internalToast } = useToastInternal();

  return {
    toast: (props: ToastType) => {
      return internalToast(props);
    },
  };
};

export const toast = (props: ToastType) => {
  return toastInternal(props);
};
