import { Geist, Geist_Mono,Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header/headerComp";
import Footer from "@/components/footer.jsx/Footer";
import { Toaster } from "react-hot-toast";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});



export const metadata = {
  title: "National Institute of Technology, Hamirpur || Venue Booking System",
  description: "National Institute of Technology, Hamirpur || Venue Booking System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${geistMono.variable} antialiased bg-gray-50`}
      >
        {/* Sticky-footer shell: header and footer keep their natural height,
            main claims exactly what's left, so short pages (like /login)
            never grow taller than the viewport. */}
        <div className="flex min-h-dvh flex-col">
          <Header />
          <Toaster />
          <main className="min-h-0 flex-1 overflow-y-auto">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
