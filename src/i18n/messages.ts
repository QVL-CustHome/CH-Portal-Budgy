import type { ChLocale, ChLocaleMessages } from "@custhome/ui";

export const defaultLocale: ChLocale = "fr";

export const messages: ChLocaleMessages = {
  fr: {
    "budgy.brand": "Budgy",
    "budgy.loading": "Chargement",
    "budgy.logout": "Se déconnecter",
    "budgy.nav.home": "Accueil",
    "budgy.nav.accounts": "Comptes",
    "budgy.nav.consents": "Consentements",
    "budgy.guard.loadError": "Impossible de vérifier votre session. Réessayez.",
    "budgy.forbidden.title": "Accès refusé",
    "budgy.forbidden.message":
      "Votre compte n'a pas le rôle requis pour accéder au portail Budgy.",
    "budgy.forbidden.switch": "Se connecter avec un autre compte",
    "budgy.home.title": "Mon budget",
    "budgy.home.welcome": "Bienvenue sur Budgy, votre espace de gestion de budget personnel.",
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
    "budgy.callback.renewTitle": "Renouvellement du consentement",
    "budgy.callback.renewPending": "Finalisation du renouvellement",
    "budgy.callback.renewSuccess":
      "Votre consentement a bien été renouvelé. La synchronisation de vos comptes reprend.",
    "budgy.callback.accountsTitle": "Comptes rattachés",
    "budgy.callback.ibanLabel": "IBAN",
    "budgy.callback.accountIdLabel": "Identifiant du compte",
    "budgy.callback.backHome": "Retour à l'accueil",
    "budgy.callback.backAccounts": "Voir mes comptes",
    "budgy.callback.error":
      "Le rattachement n'a pas abouti. Vous pouvez recommencer.",
    "budgy.callback.refused":
      "Vous avez refusé ou interrompu l'autorisation auprès de votre banque. Vous pouvez recommencer.",
    "budgy.callback.missingParams":
      "Les informations de retour de la banque sont manquantes.",
    "budgy.callback.retry": "Recommencer",
    "budgy.consents.title": "Mes consentements",
    "budgy.consents.loading": "Chargement des consentements",
    "budgy.consents.error":
      "Impossible de récupérer vos consentements. Réessayez.",
    "budgy.consents.empty":
      "Aucun consentement bancaire pour le moment. Rattachez une banque pour commencer.",
    "budgy.consents.retry": "Réessayer",
    "budgy.consents.renew": "Renouveler le consentement",
    "budgy.consents.renewError":
      "Impossible de lancer le renouvellement. Réessayez.",
    "budgy.consents.expiresAt": "Expire le",
    "budgy.consents.noExpiry": "Sans échéance",
    "budgy.consents.bankFallback": "Votre banque",
    "budgy.consents.alert.renewalRequired":
      "Le consentement pour {bank} doit bientôt être renouvelé pour continuer à synchroniser vos comptes.",
    "budgy.consents.alert.expired":
      "Le consentement pour {bank} a expiré. La synchronisation est interrompue : renouvelez-le pour la reprendre.",
    "budgy.consents.status.pending": "En attente",
    "budgy.consents.status.active": "Actif",
    "budgy.consents.status.expired": "Expiré",
    "budgy.consents.status.revoked": "Révoqué",
    "budgy.consents.status.failed": "Échec",
    "budgy.consents.renewal.renewal-required": "Renouvellement requis",
    "budgy.consents.renewal.expired": "Consentement expiré",
    "budgy.accounts.title": "Mes comptes",
    "budgy.accounts.loading": "Chargement des comptes",
    "budgy.accounts.error":
      "Impossible de récupérer vos comptes. Réessayez.",
    "budgy.accounts.empty":
      "Aucun compte rattaché pour le moment. Rattachez une banque pour commencer.",
    "budgy.accounts.retry": "Réessayer",
    "budgy.accounts.balanceType": "Type de solde",
    "budgy.accounts.balanceUnavailable": "Solde indisponible",
    "budgy.accounts.updatedAt": "Mis à jour le {date}",
    "budgy.accounts.openTransactions": "Voir les transactions",
    "budgy.transactions.title": "Transactions du compte",
    "budgy.transactions.backToAccounts": "Retour à mes comptes",
    "budgy.transactions.error":
      "Impossible de récupérer les transactions. Réessayez.",
    "budgy.transactions.retry": "Réessayer",
    "budgy.transactions.empty": "Aucune transaction sur ce compte.",
    "budgy.transactions.date": "Date",
    "budgy.transactions.label": "Libellé",
    "budgy.transactions.status": "Statut",
    "budgy.transactions.amount": "Montant",
    "budgy.transactions.status.booked": "Comptabilisée",
    "budgy.transactions.status.pending": "En attente",
    "budgy.pagination.previous": "Précédent",
    "budgy.pagination.next": "Suivant",
    "budgy.pagination.status": "Page {page} sur {pageCount}",
    "budgy.consent.error":
      "Impossible de récupérer l'état de vos consentements. Réessayez.",
    "budgy.notifications.syncFailed":
      "La synchronisation de vos données bancaires a échoué. Réessayez plus tard.",
    "budgy.notifications.consentRenewalRequired":
      "Votre consentement bancaire doit être renouvelé pour continuer à synchroniser vos comptes.",
    "budgy.notifications.consentExpired":
      "Votre consentement bancaire a expiré. Rattachez votre banque pour reprendre le suivi.",
    "ch.error.consentement_refuse":
      "Vous avez refusé le partage de vos données bancaires. Vous pouvez recommencer.",
    "ch.error.banque_indisponible":
      "Banque momentanément indisponible, réessayez plus tard.",
    "budgy.legal.footerLabel": "Liens légaux",
    "budgy.legal.cgu": "Conditions générales d'utilisation",
    "budgy.legal.notice": "Mentions légales",
  },
  en: {
    "budgy.brand": "Budgy",
    "budgy.loading": "Loading",
    "budgy.logout": "Log out",
    "budgy.nav.home": "Home",
    "budgy.nav.accounts": "Accounts",
    "budgy.nav.consents": "Consents",
    "budgy.guard.loadError": "Unable to verify your session. Please try again.",
    "budgy.forbidden.title": "Access denied",
    "budgy.forbidden.message":
      "Your account does not have the role required to access the Budgy portal.",
    "budgy.forbidden.switch": "Sign in with another account",
    "budgy.home.title": "My budget",
    "budgy.home.welcome": "Welcome to Budgy, your personal budget management space.",
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
    "budgy.callback.renewTitle": "Renewing your consent",
    "budgy.callback.renewPending": "Finalising the renewal",
    "budgy.callback.renewSuccess":
      "Your consent has been renewed. Account synchronisation resumes.",
    "budgy.callback.accountsTitle": "Linked accounts",
    "budgy.callback.ibanLabel": "IBAN",
    "budgy.callback.accountIdLabel": "Account id",
    "budgy.callback.backHome": "Back to home",
    "budgy.callback.backAccounts": "View my accounts",
    "budgy.callback.error": "The link did not complete. You can start over.",
    "budgy.callback.refused":
      "You declined or interrupted the authorisation at your bank. You can start over.",
    "budgy.callback.missingParams": "The return information from the bank is missing.",
    "budgy.callback.retry": "Start over",
    "budgy.consents.title": "My consents",
    "budgy.consents.loading": "Loading consents",
    "budgy.consents.error": "Unable to load your consents. Please try again.",
    "budgy.consents.empty":
      "No bank consent yet. Link a bank to get started.",
    "budgy.consents.retry": "Try again",
    "budgy.consents.renew": "Renew consent",
    "budgy.consents.renewError":
      "Unable to start the renewal. Please try again.",
    "budgy.consents.expiresAt": "Expires on",
    "budgy.consents.noExpiry": "No expiry",
    "budgy.consents.bankFallback": "Your bank",
    "budgy.consents.alert.renewalRequired":
      "The consent for {bank} will soon need to be renewed to keep syncing your accounts.",
    "budgy.consents.alert.expired":
      "The consent for {bank} has expired. Syncing is paused: renew it to resume.",
    "budgy.consents.status.pending": "Pending",
    "budgy.consents.status.active": "Active",
    "budgy.consents.status.expired": "Expired",
    "budgy.consents.status.revoked": "Revoked",
    "budgy.consents.status.failed": "Failed",
    "budgy.consents.renewal.renewal-required": "Renewal required",
    "budgy.consents.renewal.expired": "Consent expired",
    "budgy.accounts.title": "My accounts",
    "budgy.accounts.loading": "Loading accounts",
    "budgy.accounts.error": "Unable to load your accounts. Please try again.",
    "budgy.accounts.empty":
      "No linked account yet. Link a bank to get started.",
    "budgy.accounts.retry": "Try again",
    "budgy.accounts.balanceType": "Balance type",
    "budgy.accounts.balanceUnavailable": "Balance unavailable",
    "budgy.accounts.updatedAt": "Updated on {date}",
    "budgy.accounts.openTransactions": "View transactions",
    "budgy.transactions.title": "Account transactions",
    "budgy.transactions.backToAccounts": "Back to my accounts",
    "budgy.transactions.error":
      "Unable to load the transactions. Please try again.",
    "budgy.transactions.retry": "Try again",
    "budgy.transactions.empty": "No transaction on this account.",
    "budgy.transactions.date": "Date",
    "budgy.transactions.label": "Label",
    "budgy.transactions.status": "Status",
    "budgy.transactions.amount": "Amount",
    "budgy.transactions.status.booked": "Booked",
    "budgy.transactions.status.pending": "Pending",
    "budgy.pagination.previous": "Previous",
    "budgy.pagination.next": "Next",
    "budgy.pagination.status": "Page {page} of {pageCount}",
    "budgy.consent.error":
      "Unable to load your consent status. Please try again.",
    "budgy.notifications.syncFailed":
      "Syncing your banking data failed. Please try again later.",
    "budgy.notifications.consentRenewalRequired":
      "Your bank consent needs to be renewed to keep syncing your accounts.",
    "budgy.notifications.consentExpired":
      "Your bank consent has expired. Link your bank again to resume tracking.",
    "ch.error.consentement_refuse":
      "You declined sharing your banking data. You can start over.",
    "ch.error.banque_indisponible":
      "Bank temporarily unavailable, please try again later.",
    "budgy.legal.footerLabel": "Legal links",
    "budgy.legal.cgu": "Terms of use",
    "budgy.legal.notice": "Legal notice",
  },
};
