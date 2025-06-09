import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        maroon: '#49111C',
        khaki: '#A9927D',
        DarkKhaki: '#5E503F',


        paleOlive: '#CAD2C5',  // базовый фон для страницы 
        mutedSage: '#84A98C',
        deepMossGreen: '#52796F', // базовый фон для всех карточек
        charcoalGreen: '#354F52', // фон для hover кнопки  
        charcoalBlue: '#2F3E46', // базовый фон хедера и футера | фон для кнопки   bg-charcoalGreen hover:bg-charcoalBlue

        darkGray: '#2C3E50', // для текста на paleOlive 
        lightGray: '#D1D1D1',// для текста на charcoalBlue deepMossGreen                
        darkGold: '#C29D6B',

        terracota: '#E2725B', // цвет красных кнопок

      },
    },
  },
  plugins: [],
} satisfies Config;
