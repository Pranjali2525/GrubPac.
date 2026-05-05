import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

export const metadata = {
  title: "EduBroadcast – Content Broadcasting System",
  description: "Educational content broadcasting for teachers, principals, and students.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
          <Toaster position="top-right" toastOptions={{ duration: 4000, style: { borderRadius: "12px", fontSize: "14px" } }} />
        </AuthProvider>
      </body>
    </html>
  );
}
