
import { ToastActionElement } from "@/components/ui/toast";

export type ToastType = {
  title?: string;
  description?: string;
  action?: ToastActionElement;
  variant?: "default" | "destructive";
};

export type ToasterToast = ToastType & {
  id: string;
  title?: string;
  description?: string;
  action?: ToastActionElement;
  onOpenChange?: (open: boolean) => void;
};

export const TOAST_LIMIT = 20;
export const TOAST_REMOVE_DELAY = 1000;

export const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const;

export type ActionType = typeof actionTypes;

export interface State {
  toasts: ToasterToast[];
}

export type Action =
  | {
      type: ActionType["ADD_TOAST"];
      toast: ToasterToast;
    }
  | {
      type: ActionType["UPDATE_TOAST"];
      toast: Partial<ToasterToast>;
    }
  | {
      type: ActionType["DISMISS_TOAST"];
      toastId?: string;
    }
  | {
      type: ActionType["REMOVE_TOAST"];
      toastId?: string;
    };
