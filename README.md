Ceci est un projet utilisant [Node.js](https://nodejs.org/en/download/current/)+[Next.js](https://nextjs.org/).

## Avant toute choses
Il est recommandé de lire en entier la [page Notion](https://www.notion.so/thomascardon/PTUT-1-524f16b2e99a451b953becb84e8ef513), qui permet de savoir tous les logiciels utilisés ainsi que les objectifs à atteindre.

Une fois Node.js **installé** et le répertoire cloné, n'oubliez pas de préparer le projet avant de tenter de le modifier ou de l'exécuter:
```bash
npm install
```

De plus, le répertoire contient un fichier `.gitignore`. Il permet à GitHub de ne pas compter parmi ses changements certains dossiers, comme `node_modules`, qui est le répertoire qui contient toute les bibliothèques (dépendences), mais ce dossier n'est pas nécessaire car si vous avez fait les choses correctement, Node.js est capable de le réinstaller car les dépendances sont inscrites dans le fichier `package.json`.

## Commencer
Pour commencer, lancez le serveur de développement:

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) avec votre navigateur une fois le serveur de lancé afin de voir le résultat.

Le serveur met-à-jour automatiquement la page sans besoin de relancer dès que vous changez les pages.

Le dossier `pages/api` permet de relier à l'adresse `/api/*`. Les fichiers dans ce répertoire sont traités comme des [API routes](https://nextjs.org/docs/api-routes/introduction) au lieu de pages React.

## En savoir plus

Pour plus comprendre Next.js:
- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
