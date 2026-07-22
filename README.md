# CH-Portal-Budgy

Portail front (React 19 + Vite) de l'app Budgy. Sert le SPA et proxifie `/api` vers le CH-Api-GateWay via `server.js`.

## Démarrage

- `npm run dev` — serveur Vite (port `PORT`, défaut `3203`).
- `npm run build` — `tsc -b && vite build`.
- `npm start` — sert le build via Express (`server.js`).

Env : copier `.env.example` vers `.env` (`PORT`, `GATEWAY_URL`, `VITE_AUTH_PORTAL_URL`).

## Routes

`/home`, `/dashboard`, `/banque` (+ `/banque/callback`), `/comptes` (+ `/comptes/:accountId`), `/transactions`, `/categories`, `/budgets`, `/consentements`, `/forbidden`. Tout est monté sous `RequireBudgy` puis `BudgyLayout` (sauf `/forbidden`).

## Vues métier

### Dashboard (`/dashboard`)

Grille de blocs (`DashboardGrid`) alimentés chacun par son propre hook :

- **Soldes consolidés** (`SoldesConsolidesBlock`, `useSoldesConsolides`) — total tous comptes + détail par compte.
- **Reste à dépenser** (`ResteADepenserBlock`, `useResteADepenser`) — par catégorie budgétée sur le mois sélectionné.
- **Budget prévisionnel mensuel** (`PrevisionnelBlock`, `usePrevisionnel`, SCRUM-237) — solde prévisionnel du mois à partir des revenus/dépenses récurrents et des budgets, avec ventilation par catégorie ; affiche un état « données insuffisantes » quand l'historique ne suffit pas.
- **Dépenses par catégorie** (`ExpensesByCategoryBlock`, `useExpensesByCategory`) — donut SVG *home-made* (`ExpensesByCategoryChart`, aucune lib de charting) + légende, couleurs issues des tokens `canopui`, navigation mois précédent/suivant.

### Transactions (`/transactions`)

Liste consolidée tous comptes avec filtres (compte, catégorie, période, type), tri (champ + ordre) et pagination. Logique dans `useTransactions`.

### Budgets (`/budgets`)

Gestion des budgets mensuels par catégorie : formulaire d'ajout/modification (`BudgetForm`) et liste des budgets du mois (`MonthlyBudgetList`). Logique dans `useMonthlyBudget`.

## Architecture front

- **Logique dans les hooks** (`src/hooks`) — chargement, état, sélection de mois, gestion d'erreur (`usePrevisionnel`, `useResteADepenser`, `useExpensesByCategory`, `useSoldesConsolides`, `useTransactions`, `useMonthlyBudget`…).
- **Rendu pur dans les composants** (`src/components`) et pages (`src/pages`) minces qui câblent hook + composants.
- **Préparation des données dans `src/lib`** (`budget.ts`, `forecast.ts`, `expenses.ts`, `transactions.ts`, `categories.ts`…) — dérivations, segments de graphique, mois disponibles, indexation.

## Dépendance UI — `canopui@1.0.1`

Le portail build sur le paquet npm publié **`canopui@1.0.1`** (registre privé, version épinglée dans `package.json`), et **non** sur la source `CH-UI-Library`.

Conséquence : modifier la source `CH-UI-Library` n'a **aucun effet** sur le portail tant que `canopui` n'est pas republié et la version bumpée ici. Pour ajouter/étendre un composant, s'appuyer uniquement sur ce qui est exposé par `canopui@1.0.1`.

## Tests

Suite via `npm test` (= `vitest run`), setup dans `src/test/setup.ts`.

Pièges (CI réparée fin Sprint 2, SCRUM-288) :
- **Mock `canopui` doit exposer `palette`** — consommé au niveau module par `src/lib/categories.ts` (`import { palette } from "canopui"`) ; un mock incomplet casse l'import dès le chargement.
- **Ajout d'une page/route → mocker la page dans les tests de navigation** (`BudgyLayout.nav.test.tsx`) ; l'oubli de la page `Categories` avait cassé le job.
