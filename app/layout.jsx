import "./globals.css";

export const metadata = {
  title: "CI Dashboard",
  description: "Minimal CI repository analysis homepage",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
