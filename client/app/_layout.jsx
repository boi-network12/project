import { Slot, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import AuthProvider, { useAuth } from "../context/AuthContext";
import { ThemeProvider } from "../context/ThemeContext";

const MainLayout = () => {
  const { isAuthenticated } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (typeof isAuthenticated === "undefined") return;

    const inApp = segments[0] === "(app)";
    if (isAuthenticated && !inApp) {
      router.replace("/Home");
    } else if (isAuthenticated === false && inApp) {
      router.replace("/welcome");
    }
  }, [isAuthenticated, segments]);

  return <Slot />;
};

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainLayout />
      </AuthProvider>
    </ThemeProvider>
  );
};
