// src/app/layout.tsx

import Header from "@/components/header";  // Импортируем Header
import "./globals.css";  // Глобальные стили
import JwtRefresher from "@/components/JWTrefresher"; 

export const metadata = {
  title: "CRIPTO BANK",
  description: "Выгодные кредиты",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <JwtRefresher />
        <Header />  {/* Вставляем Header в layout */}
        <main> {/* Добавляем отступ сверху для основного контента */}
          {children}
        </main>
      </body>
    </html>
  );
}
