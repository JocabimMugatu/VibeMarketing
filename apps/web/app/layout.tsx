import "./globals.css";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

export const metadata = {
  title: "VibeLaunch OS",
  description: "CMO dashboard for VibeLaunch OS",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="app-shell">
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex min-h-screen flex-1 flex-col">
            <Topbar />
            <main className="flex-1 space-y-12 px-10 py-12">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
