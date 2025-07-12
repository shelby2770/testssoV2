import * as React from "react";

interface ToastProps {
  message: string;
  type: "success" | "error" | "info";
  onClose: () => void;
}

export function Toast({ message, type, onClose }: ToastProps) {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor =
    type === "success"
      ? "bg-green-900/30 border-green-500/30 text-green-300"
      : type === "error"
      ? "bg-red-900/30 border-red-500/30 text-red-300"
      : "bg-blue-900/30 border-blue-500/30 text-blue-300";

  const iconColor =
    type === "success"
      ? "text-green-400"
      : type === "error"
      ? "text-red-400"
      : "text-blue-400";

  const icon =
    type === "success" ? (
      <svg
        className={`h-5 w-5 ${iconColor}`}
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clipRule="evenodd"
        />
      </svg>
    ) : type === "error" ? (
      <svg
        className={`h-5 w-5 ${iconColor}`}
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
          clipRule="evenodd"
        />
      </svg>
    ) : (
      <svg
        className={`h-5 w-5 ${iconColor}`}
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
          clipRule="evenodd"
        />
      </svg>
    );

  return (
    <div
      className={`fixed top-4 right-4 z-50 backdrop-blur-sm ${bgColor} p-4 rounded-xl border shadow-lg animate-fade-in-down`}
    >
      <div className="flex items-center">
        <div className="flex-shrink-0">{icon}</div>
        <div className="ml-3">
          <p>{message}</p>
        </div>
        <div className="ml-4">
          <button
            className="inline-flex text-gray-400 hover:text-gray-200 focus:outline-none"
            onClick={onClose}
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// ToastContext to manage toast state globally
interface ToastContextType {
  showToast: (message: string, type: "success" | "error" | "info") => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(
  undefined
);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = React.useState<{
    message: string;
    type: "success" | "error" | "info";
    visible: boolean;
  }>({
    message: "",
    type: "info",
    visible: false,
  });

  const showToast = React.useCallback(
    (message: string, type: "success" | "error" | "info") => {
      setToast({ message, type, visible: true });
    },
    []
  );

  const hideToast = React.useCallback(() => {
    setToast((prev) => ({ ...prev, visible: false }));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast.visible && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
