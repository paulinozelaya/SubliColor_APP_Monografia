import { ToastProvider } from "./context/ToastContext";
import AppRoutes from "./AppRoutes";

export default function App() {
  return (
    <ToastProvider>
      <AppRoutes />
    </ToastProvider>
  );
}