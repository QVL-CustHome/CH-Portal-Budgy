# CH-Portal-Budgy

Portail front (React 19 + Vite) de l'app Budgy. Sert le SPA et proxifie `/api` vers le CH-Api-GateWay via `server.js`.

## Démarrage

- `npm run dev` — serveur Vite (port `PORT`, défaut `3203`).
- `npm run build` — `tsc -b && vite build`.
- `npm start` — sert le build via Express (`server.js`).

Env : copier `.env.example` vers `.env` (`PORT`, `GATEWAY_URL`, `VITE_AUTH_PORTAL_URL`).

## Routes

`/` (dashboard), `/banque` (+ `/banque/callback`), `/comptes` (+ `/comptes/:accountId`), `/categories`, `/consentements`, `/forbidden`. Toute route inconnue redirige vers `/`. Tout est monté sous `RequireBudgy` puis `BudgyLayout` (sauf `/forbidden`).

La navigation compte **4 entrées** : dashboard, comptes, catégories, consentements. Les pages `/transactions` et `/budgets` ont été retirées : la première faisait doublon avec le détail d'un compte, la seconde est devenue inutile depuis que le reste à dépenser se prédit tout seul.

## Vues métier

### Dashboard (`/`)

Grille de blocs (`DashboardGrid`) alimentés chacun par son propre hook. **Mois courant uniquement** — pas de navigation mensuelle.

- **Soldes consolidés** (`SoldesConsolidesBlock`, `useSoldesConsolides`) — total tous comptes + détail par compte. Affiche le **solde à venir** (opérations en attente incluses) sous le total et par compte, uniquement quand la banque le fournit.
- **Reste à dépenser** (`ResteADepenserBlock`, `useResteADepenser`) — une ligne par catégorie, filtrables via un `Select` mono-catégorie (composant `canopui`, options portant leur pastille couleur + icône), et un total en bas. Le dépassement se lit au reste négatif, sans badge dédié.
- **Budget prévisionnel mensuel** (`PrevisionnelBlock`, `usePrevisionnel`) — solde prévisionnel du mois et ses deux composantes (revenus, dépenses récurrentes). Affiche un état « données insuffisantes » tant qu'aucune récurrence ni aucun revenu n'est prédit.

Au montage du layout, le portail appelle `recategoriser()` : réconciliation idempotente côté API (virements internes, règles, crédits). Les données se réparent seules, sans écran d'administration.

### Comptes (`/comptes`, `/comptes/:accountId`)

Liste des comptes puis transactions du compte. Les montants sont colorés **vert (crédit) / rouge (débit) sur mobile comme sur desktop**. Le libellé affiché est le `clean_label` renvoyé par l'API (le tiers, pas le bruit bancaire). Catégoriser une transaction propose de créer la règle correspondante **en un clic** : le motif est dérivé côté API, l'utilisateur ne saisit rien.

### Rattachement bancaire (`/banque`)

Sélection de l'établissement puis redirection vers le consentement. Les **caisses régionales du Crédit Agricole sont fusionnées** en une entrée générique « Crédit Agricole » (`lib/banks.ts`) : l'API en expose une quarantaine qui redirigent toutes vers la même page de sélection d'agence. Un Crédit Agricole hors France reste distinct.

## Architecture front

- **Logique dans les hooks** (`src/hooks`) — chargement, état, sélection de mois, gestion d'erreur (`usePrevisionnel`, `useResteADepenser`, `useExpensesByCategory`, `useSoldesConsolides`, `useTransactions`, `useMonthlyBudget`…).
- **Rendu pur dans les composants** (`src/components`) et pages (`src/pages`) minces qui câblent hook + composants.
- **Préparation des données dans `src/lib`** (`budget.ts`, `banks.ts`, `expenses.ts`, `transactions.ts`, `categories.ts`, `money.ts`…) — dérivations, généralisation des banques, mois disponibles, indexation.

## Dépendance UI — `canopui`

Le portail build sur le paquet npm publié **`canopui`** (registre privé Verdaccio), et **non** sur une source locale.

`package.json` déclare `3.1.1`, mais le job `build` de la CI exécute `npm install canopui@latest` avant de builder : **l'artefact déployé embarque toujours la dernière version publiée**. Une correction du design system se propage donc au prochain build, sans bump manuel ici.

Règle d'équipe : tout besoin de composant se traite **dans CanopUI**, pas en local. Le `Select` mono-sélection (avec icône par option) et l'export d'icônes supplémentaires ont été ajoutés au design system pour ce portail plutôt que dupliqués ici.

Le job `update-checkout` de la CI fait par ailleurs un `git pull` du clone local sur `/mnt/c` à chaque push sur `main`, pour que la copie de travail de la machine ne dérive pas.

## Tests

Suite via `npm test` (= `vitest run`), setup dans `src/test/setup.ts`.

Pièges (CI réparée fin Sprint 2, SCRUM-288) :
- **Mock `canopui` doit exposer `palette`** — consommé au niveau module par `src/lib/categories.ts` (`import { palette } from "canopui"`) ; un mock incomplet casse l'import dès le chargement.
- **Ajout d'une page/route → mocker la page dans les tests de navigation** (`BudgyLayout.nav.test.tsx`) ; l'oubli de la page `Categories` avait cassé le job.
