"use client";

import useJwtRefresher from "@/hooks/useJwtRefresher";

export default function JwtRefresher() {
  useJwtRefresher(); // Обновляем токен
  return null; // Не рендерим UI
}
