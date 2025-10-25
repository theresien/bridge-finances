# Finance Manager - Frontend Setup

Application React moderne qui se connecte à votre backend Spring Boot.

## 🚀 Stack Technique

- **React 18** avec TypeScript
- **Vite** pour le build
- **Tailwind CSS** pour le styling
- **React Router** pour la navigation
- **TanStack Query** pour la gestion des données
- **Shadcn UI** pour les composants

## 📦 Installation

```bash
npm install
```

## ⚙️ Configuration

1. Créez un fichier `.env` à la racine du projet :

```bash
cp .env.example .env
```

2. Modifiez l'URL de votre backend Spring Boot dans `.env` :

```env
VITE_API_URL=http://localhost:8080/api
```

> **Note:** Remplacez `http://localhost:8080/api` par l'URL de votre backend Spring Boot.

## 🏃 Démarrage

```bash
npm run dev
```

L'application sera accessible sur `http://localhost:8080`

## 🔗 Connexion au Backend

L'application est configurée pour se connecter aux endpoints suivants de votre backend Spring Boot :

### Auth
- `POST /api/auth/login` - Connexion
- `POST /api/auth/register` - Inscription
- `GET /api/auth/me` - Utilisateur connecté

### Accounts
- `GET /api/accounts` - Liste des comptes
- `GET /api/accounts/:id` - Détail d'un compte
- `POST /api/accounts` - Créer un compte
- `PUT /api/accounts/:id` - Modifier un compte
- `DELETE /api/accounts/:id` - Supprimer un compte

### Transactions
- `GET /api/transactions` - Liste des transactions
- `GET /api/transactions/:id` - Détail d'une transaction
- `POST /api/transactions` - Créer une transaction
- `PUT /api/transactions/:id` - Modifier une transaction
- `DELETE /api/transactions/:id` - Supprimer une transaction

### Budgets
- `GET /api/budgets` - Liste des budgets
- `GET /api/budgets/:id` - Détail d'un budget
- `POST /api/budgets` - Créer un budget
- `PUT /api/budgets/:id` - Modifier un budget
- `DELETE /api/budgets/:id` - Supprimer un budget

### Categories
- `GET /api/categories` - Liste des catégories
- `GET /api/categories/:id` - Détail d'une catégorie
- `POST /api/categories` - Créer une catégorie
- `PUT /api/categories/:id` - Modifier une catégorie
- `DELETE /api/categories/:id` - Supprimer une catégorie

## 🎨 Fonctionnalités

### ✅ Implémenté

- Authentification (Login/Register)
- Dashboard avec statistiques
- Page Transactions (liste)
- Page Comptes (liste)
- Page Budgets (liste avec indicateurs)
- Page Catégories (liste organisée)
- Navigation avec sidebar
- Design moderne et responsive
- Thème sombre

### 🔜 À venir

- Formulaires de création/modification
- Filtres et recherche
- Graphiques et statistiques avancées
- Export de données
- Notifications

## 🔒 Authentification

L'application utilise JWT pour l'authentification :

1. L'utilisateur se connecte via `/login`
2. Le backend renvoie un token JWT
3. Le token est stocké dans `localStorage`
4. Toutes les requêtes suivantes incluent le token dans le header `Authorization: Bearer {token}`

## 🛠️ Structure du projet

```
src/
├── components/
│   ├── layout/
│   │   ├── AppSidebar.tsx       # Sidebar de navigation
│   │   └── DashboardLayout.tsx  # Layout principal
│   └── ui/                       # Composants Shadcn UI
├── contexts/
│   └── AuthContext.tsx          # Context d'authentification
├── pages/
│   ├── Login.tsx                # Page de connexion
│   ├── Register.tsx             # Page d'inscription
│   ├── Dashboard.tsx            # Dashboard principal
│   ├── Transactions.tsx         # Gestion des transactions
│   ├── Accounts.tsx             # Gestion des comptes
│   ├── Budgets.tsx              # Gestion des budgets
│   └── Categories.tsx           # Gestion des catégories
├── services/
│   └── api.ts                   # Service API pour Spring Boot
├── types/
│   └── api.ts                   # Types TypeScript
└── App.tsx                      # Configuration des routes
```

## 🎯 Prochaines étapes

1. **Démarrez votre backend Spring Boot** sur `http://localhost:8080`
2. **Créez un compte** via `/register`
3. **Explorez les fonctionnalités** disponibles

## 💡 Développement

Pour ajouter de nouvelles fonctionnalités :

1. **Nouveaux endpoints** : Ajoutez-les dans `src/services/api.ts`
2. **Nouveaux types** : Définissez-les dans `src/types/api.ts`
3. **Nouvelles pages** : Créez-les dans `src/pages/` et ajoutez-les aux routes dans `App.tsx`
4. **Nouveaux composants** : Créez-les dans `src/components/`

## 🐛 Dépannage

### Le frontend ne se connecte pas au backend

1. Vérifiez que le backend est démarré
2. Vérifiez l'URL dans `.env`
3. Vérifiez les CORS dans votre backend Spring Boot :

```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:8080")
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
```

### Erreur 401 (Unauthorized)

- Vérifiez que vous êtes connecté
- Vérifiez que le token JWT est valide
- Vérifiez la configuration de sécurité dans Spring Boot

## 📝 Notes

- L'application utilise un design sombre par défaut
- Les couleurs sont configurées dans `src/index.css`
- Tous les styles utilisent le design system (pas de styles inline)
- L'application est entièrement responsive
