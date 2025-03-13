
import * as React from "react";
import { 
  ToastType, 
  ToasterToast, 
  State, 
  Action, 
  actionTypes 
} from "./toast-types";
import { reducer, toastTimeouts } from "./toast-reducer";

// Counter for generating unique IDs
let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

// Initial state
const listeners: ((state: State) => void)[] = [];
let memoryState: State = { toasts: [] };

// Dispatch function
function dispatch(action: Action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}

// Context interface
interface ToastContextType {
  toasts: ToasterToast[];
  toast: (props: ToastType) => string;
  dismiss: (toastId?: string) => void;
}

export const ToastContext = React.createContext<ToastContextType>({
  toasts: [],
  toast: () => "",
  dismiss: () => {},
});

export const useToast = () => {
  const context = React.useContext(ToastContext);
  
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  
  return context;
};

export function ToastProvider({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const [state, setState] = React.useState<State>(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]);

  const toast = React.useCallback(
    (props: ToastType) => {
      const id = genId();

      const update = (props: ToastType) =>
        dispatch({
          type: actionTypes.UPDATE_TOAST,
          toast: { ...props, id },
        });
      const dismiss = () => dispatch({ type: actionTypes.DISMISS_TOAST, toastId: id });

      dispatch({
        type: actionTypes.ADD_TOAST,
        toast: {
          ...props,
          id,
          onOpenChange: (open) => {
            if (!open) dismiss();
          },
        },
      });

      return id;
    },
    []
  );

  const dismiss = React.useCallback((toastId?: string) => {
    dispatch({ type: actionTypes.DISMISS_TOAST, toastId });
  }, []);

  return (
    <ToastContext.Provider value={{ toasts: state.toasts, toast, dismiss }}>
      {children}
    </ToastContext.Provider>
  );
}

// Convenience function to use the toast outside of React components
export const toast = (props: ToastType) => {
  const { toast } = useToast();
  return toast(props);
};
