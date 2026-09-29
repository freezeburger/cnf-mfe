# Méthdologie

- Lire intégralement ce fichier.
- Générer un PLAN.md sous `/_documentation` avec aborescence technique.
- Générer DES ADR_[INCREMENTAL_ID].md sous `/_documentation/adr`
- Générer DES ADR_[INCREMENTAL_ID].md sous `/_documentation/adr`
- Ajouter les commentaire TSDoc dans le code et les tag `@example`
- Créer sous `/core/types` un type system réutilisable et discréminant pour l'expérience developpeur
- Completer des README pratique et pédagogique à destination de developpeur exprimentés, contenant commande utiles et suggestions de prompts

# Description

Dans products :

- Objectif créer dans ce worskpace angular:
- Une librairie de composant graphiques Design System (état de l'art) avec documentation des bonnes pratiques.
- Un librairie mono service abastraction normalisée de HttpClient 
- Un librairie mono service abastraction normalisée de MfeSseCommunicator
- Un project "shell" pour l'accueil des micro frontend selon https://native-federation.com/
- Deux porject micro frontend (MFE)
- Créer des commit pertinents (message multiligne)



# Structure a respecter pour les MFE

> La pertinence de la structure est adaptable.

```
/src
    /core
    /share
    /layout
    /infra
    /features
        /(domaine)

```
# Outils

L'angular cli est accessible via `npx  @angular/cli generate` utilise autant que possible.


# Contrainte

- N'utiliser que signal resource et signal forme
- Les service doivent passer par une encapsulation de HttpClient sous  `/infra `
    - Cette encapsulation doit gérer globlament les erruers Http.
- Les type et models doivent respecter une Interface Segregation stricte.
- Les type de models doivent etre inférés de schema zod
- Les valeur d'environnement doivent etre déclarées dans `environments.ts`
    - Les valeur d'environnement sont exposé depuis des  `InjectionToken`  dans  `/core/config`
- Les sous dossier de `features` sont des domaines. (models/service/components)
- Les service d'exploitation de models doivent être CQS et exposer un état observable de données.
- Les composants`features` doivent séparer leur exploitation logique dans un Presenter Service.
- Toutes les routes doivent être lazy loadées.
- Les composants graphiques sont crées sous `/shared/components` et exposés via un barrel file.
- `/core/services` peux contenir des services applicatif (eg. BusEvent, Notification, Auth ....)
- Utiliser https://www.npmjs.com/package/sselib pour la communication entre MFE
- Utiliser json-server pour l'api locale

