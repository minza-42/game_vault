# 🎮 GameVault

**Ditt personliga spelbibliotek.**

GameVault är en webbapplikation byggd med React och TypeScript där du kan organisera och hålla koll på din egen spelsamling.

Jag har alltid älskat att spela spel, och gaming är ett av mina största fritidsintressen. Jag ville därför skapa ett projekt som kombinerar mitt personliga intresse för spel med det jag lär mig inom frontendutveckling.

Med GameVault kan jag samla mina spel på ett ställe, hålla koll på vad jag spelar just nu, vilka spel jag har klarat och vilka äventyr som väntar härnäst.

**Live Demo:** [GameVault](https://game-vault-rose.vercel.app/)

---

## ✨ Funktioner

- **Dashboard** – Få en överblick över din spelsamling med statistik och senast tillagda spel.
- **Spelbibliotek** – Visa och hantera alla dina spel på ett och samma ställe.
- **Lägg till spel** – Lägg till spel med titel, plattform, status, betyg, anteckningar och omslagsbild.
- **Redigera spel** – Uppdatera spelinformation, inklusive titel och omslagsbilder.
- **Ta bort spel** – Ta bort enskilda spel eller hela spelsamlingen.
- **Speldetaljer** – Se mer information om varje spel.
- **Statusfilter** – Filtrera spel efter aktuell status.
- **Plattformsfilter** – Filtrera spel efter plattform.
- **Sök och sortering** – Hitta spel och organisera biblioteket.
- **Responsiv design** – Anpassad för dator, surfplatta och mobil.

## 🕹️ Spelstatusar

Varje spel kan ha en av fyra olika statusar:

| Status       | Beskrivning                                |
| ------------ | ------------------------------------------ |
| Want to Play | Spel jag vill spela i framtiden            |
| Playing      | Spel jag spelar just nu                    |
| Completed    | Spel jag har klarat                        |
| Dropped      | Spel jag har valt att inte fortsätta spela |

## 🛠️ Tekniker

Projektet är byggt med följande tekniker:

- React
- TypeScript
- Vite
- React Router
- SCSS / Sass
- Questlog API
- Git och GitHub
- Vercel

## 🔌 API – Questlog

GameVault använder Questlog API för att hämta, skapa, uppdatera och ta bort spel.

API:et använder ett personligt handle för att hålla varje användares spelsamling separat.

Mitt handle är:

`gamevault-minai`

Följande HTTP-metoder används:

- **GET** – Hämta spel.
- **POST** – Lägga till nya spel.
- **PATCH** – Uppdatera befintliga spel.
- **DELETE** – Ta bort spel.

API-dokumentation: [Questlog API](https://questlog-api.vercel.app/docs)

## 🧩 Custom Hooks

För att hålla koden organiserad och separera återanvändbar logik och API-anrop från komponenterna använder GameVault egna React Hooks.

- `useGames` – Hämtar och hanterar spelsamlingen, inklusive laddnings- och felhantering.
- `useSaveGame` – Hanterar skapandet av nya spel via Questlog API.
- `useUpdateGame` – Hanterar uppdatering av spelinformation.
- `useDeleteGame` – Hanterar borttagning av enskilda spel.
- `useDeleteAllGames` – Hanterar borttagning av samtliga spel från spelsamlingen.
- `useLocalStorage` – Sparar och hämtar värden från webbläsarens LocalStorage. Används för att behålla sökning, statusfilter, plattformsfilter och sortering även efter att sidan laddats om.

Genom att använda egna hooks kan jag återanvända logik och hålla komponenterna enklare. Det gör också att komponenterna kan fokusera mer på presentation och användarinteraktion istället för att hantera all logik själva.

## 🎨 Design och utvecklingsbeslut

GameVault har en mörk design med lila och blå färgdetaljer för att skapa en modern gamingkänsla.

Jag har lagt stor vikt vid att skapa ett tydligt gränssnitt som är enkelt att navigera och fungerar på olika skärmstorlekar.

### Steam Library – borttagen funktion

Under utvecklingen hade jag även en idé om att integrera Steam Library i GameVault.

Tanken var att användaren skulle kunna koppla sitt Steam-konto och automatiskt hämta sina spel och sin speltid.

Efter att ha undersökt lösningen insåg jag att det skulle krävas en separat backend med ytterligare serverfunktionalitet. Det visade sig vara mer komplicerat än jag först hade räknat med.

Jag valde därför att ta bort Steam Library och istället fokusera på projektets kärnfunktioner. På så sätt kunde jag lägga mer tid på att utveckla och förbättra CRUD-funktionaliteten, användarupplevelsen och själva spelbiblioteket.

## 🚀 Kom igång

### Förutsättningar

- Node.js
- npm

### Installation

1. Klona repot:

   ```bash
   git clone https://github.com/minza-42/game_vault.git
   ```

2. Navigera till applikationens mapp:

   ```bash
   cd game_vault
   ```

3. Installera beroenden:

   ```bash
   npm install
   ```

4. Starta utvecklingsservern:

   ```bash
   npm run dev
   ```

5. Öppna den lokala adressen som Vite visar i terminalen.

## 📁 Projektstruktur

```text
game_vault/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   ├── hooks/
│   ├── pages/
│   ├── services/
│   ├── styles/
│   ├── types/
│   ├── App.tsx
│   └── main.tsx
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
└── README.md
```

## 🌐 Publicering

GameVault är publicerad med Vercel.

**Webbplats:** [Game Vault](https://game-vault-rose.vercel.app/)

**GitHub:** [game_vault repo](https://github.com/minza-42/game_vault)

---

**Målsättning: VG**
