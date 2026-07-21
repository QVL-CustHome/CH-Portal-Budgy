# CH-Portal-Budgy

Portail front (React 19 + Vite) de l'app Budgy. Sert le SPA et proxifie `/api` vers le CH-Api-GateWay via `server.js`.

## Démarrage

- `npm run dev` — serveur Vite (port `PORT`, défaut `3203`).
- `npm run build` — `tsc -b && vite build`.
- `npm start` — sert le build via Express (`server.js`).

Env : copier `.env.example` vers `.env` (`PORT`, `GATEWAY_URL`, `VITE_AUTH_PORTAL_URL`).

## Routes

`/home`, `/banque` (+ `/banque/callback`), `/comptes` (+ `/comptes/:accountId`), `/categories`, `/consentements`, `/forbidden`. Tout est monté sous `RequireBudgy` puis `BudgyLayout` (sauf `/forbidden`).

## Dépendance UI — `canopui@1.0.1`

Le portail build sur le paquet npm publié **`canopui@1.0.1`** (registre privé, version épinglée dans `package.json`), et **non** sur la source `CH-UI-Library`.

Conséquence : modifier la source `CH-UI-Library` n'a **aucun effet** sur le portail tant que `canopui` n'est pas republié et la version bumpée ici. Pour ajouter/étendre un composant, s'appuyer uniquement sur ce qui est exposé par `canopui@1.0.1`.

## Tests

Suite via `npm test` (= `vitest run`), setup dans `src/test/setup.ts`.

Pièges (CI réparée fin Sprint 2, SCRUM-288) :
- **Mock `canopui` doit exposer `palette`** — consommé au niveau module par `src/lib/categories.ts` (`import { palette } from "canopui"`) ; un mock incomplet casse l'import dès le chargement.
- **Ajout d'une page/route → mocker la page dans les tests de navigation** (`BudgyLayout.nav.test.tsx`) ; l'oubli de la page `Categories` avait cassé le job.
