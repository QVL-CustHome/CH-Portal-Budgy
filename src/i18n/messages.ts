import type { ChLocale, ChLocaleMessages } from "@custhome/ui";

export const defaultLocale: ChLocale = "fr";

export const messages: ChLocaleMessages = {
  fr: {
    "budgy.brand": "BUdgy",
    "budgy.loading": "Chargement",
    "budgy.logout": "Se déconnecter",
    "budgy.nav.home": "Accueil",
    "budgy.nav.accounts": "Comptes",
    "budgy.nav.notifications": "Notifications",
    "budgy.guard.loadError": "Impossible de vérifier votre session. Réessayez.",
    "budgy.forbidden.title": "Accès refusé",
    "budgy.forbidden.message":
      "Votre compte n'a pas le rôle requis pour accéder au portail BUdgy.",
    "budgy.forbidden.switch": "Se connecter avec un autre compte",
    "budgy.home.title": "Mon budget",
    "budgy.home.welcome": "Bienvenue sur BUdgy, votre espace de gestion de budget personnel.",
    "budgy.home.bank.title": "Rattacher une banque",
    "budgy.home.bank.description":
      "Connectez vos comptes bancaires en toute sécurité pour suivre vos dépenses.",
    "budgy.home.accounts.title": "Comptes et transactions",
    "budgy.home.accounts.description":
      "Consultez vos comptes rattachés et l'historique de vos transactions.",
    "budgy.home.notifications.title": "Notifications",
    "budgy.home.notifications.description":
      "Recevez des alertes sur votre activité bancaire et vos seuils de budget.",
    "budgy.home.comingSoon": "Bientôt disponible",
    "budgy.home.open": "Ouvrir",
    "budgy.bank.title": "Rattacher ma banque",
    "budgy.bank.intro":
      "Sélectionnez votre banque puis autorisez l'accès à vos comptes pour suivre vos dépenses.",
    "budgy.bank.selectLabel": "Votre banque",
    "budgy.bank.selectPlaceholder": "Choisissez une banque",
    "budgy.bank.connect": "Connecter ma banque",
    "budgy.bank.loadingBanks": "Chargement des banques",
    "budgy.bank.banksError":
      "Impossible de récupérer la liste des banques. Réessayez.",
    "budgy.bank.connectError":
      "Impossible de lancer le rattachement. Réessayez.",
    "budgy.bank.retry": "Réessayer",
    "budgy.callback.title": "Rattachement de votre banque",
    "budgy.callback.pending": "Finalisation du rattachement",
    "budgy.callback.success": "Votre banque a bien été rattachée.",
    "budgy.callback.accountsTitle": "Comptes rattachés",
    "budgy.callback.ibanLabel": "IBAN",
    "budgy.callback.accountIdLabel": "Identifiant du compte",
    "budgy.callback.backHome": "Retour à l'accueil",
    "budgy.callback.error":
      "Le rattachement n'a pas abouti. Vous pouvez recommencer.",
    "budgy.callback.missingParams":
      "Les informations de retour de la banque sont manquantes.",
    "budgy.callback.retry": "Recommencer",
    "ch.error.consentement_refuse":
      "Vous avez refusé le partage de vos données bancaires. Vous pouvez recommencer.",
    "ch.error.banque_indisponible":
      "Banque momentanément indisponible, réessayez plus tard.",
  },
  en: {
    "budgy.brand": "BUdgy",
    "budgy.loading": "Loading",
    "budgy.logout": "Log out",
    "budgy.nav.home": "Home",
    "budgy.nav.accounts": "Accounts",
    "budgy.nav.notifications": "Notifications",
    "budgy.guard.loadError": "Unable to verify your session. Please try again.",
    "budgy.forbidden.title": "Access denied",
    "budgy.forbidden.message":
      "Your account does not have the role required to access the BUdgy portal.",
    "budgy.forbidden.switch": "Sign in with another account",
    "budgy.home.title": "My budget",
    "budgy.home.welcome": "Welcome to BUdgy, your personal budget management space.",
    "budgy.home.bank.title": "Link a bank",
    "budgy.home.bank.description":
      "Securely connect your bank accounts to track your spending.",
    "budgy.home.accounts.title": "Accounts and transactions",
    "budgy.home.accounts.description":
      "Browse your linked accounts and your transaction history.",
    "budgy.home.notifications.title": "Notifications",
    "budgy.home.notifications.description":
      "Get alerts about your banking activity and budget thresholds.",
    "budgy.home.comingSoon": "Coming soon",
    "budgy.home.open": "Open",
    "budgy.bank.title": "Link my bank",
    "budgy.bank.intro":
      "Select your bank then authorise access to your accounts to track your spending.",
    "budgy.bank.selectLabel": "Your bank",
    "budgy.bank.selectPlaceholder": "Choose a bank",
    "budgy.bank.connect": "Connect my bank",
    "budgy.bank.loadingBanks": "Loading banks",
    "budgy.bank.banksError": "Unable to load the list of banks. Please try again.",
    "budgy.bank.connectError": "Unable to start the linking process. Please try again.",
    "budgy.bank.retry": "Try again",
    "budgy.callback.title": "Linking your bank",
    "budgy.callback.pending": "Finalising the link",
    "budgy.callback.success": "Your bank has been linked successfully.",
    "budgy.callback.accountsTitle": "Linked accounts",
    "budgy.callback.ibanLabel": "IBAN",
    "budgy.callback.accountIdLabel": "Account id",
    "budgy.callback.backHome": "Back to home",
    "budgy.callback.error": "The link did not complete. You can start over.",
    "budgy.callback.missingParams": "The return information from the bank is missing.",
    "budgy.callback.retry": "Start over",
    "ch.error.consentement_refuse":
      "You declined sharing your banking data. You can start over.",
    "ch.error.banque_indisponible":
      "Bank temporarily unavailable, please try again later.",
  },
};
