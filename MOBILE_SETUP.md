# 📱 Configuration Mobile avec Capacitor

Votre application Finance Manager est maintenant configurée pour être une vraie application mobile native !

## 🎯 Ce qui a été fait

✅ Installation de Capacitor (iOS & Android)  
✅ Configuration du projet avec hot-reload  
✅ Adaptation du port Vite pour Capacitor (8080)

## 📋 Prochaines étapes pour tester sur appareil/émulateur

### 1️⃣ Exportez votre projet vers GitHub
Cliquez sur le bouton **"Export to Github"** dans Lovable, puis clonez votre dépôt :
```bash
git clone [votre-repo-github]
cd [nom-du-projet]
```

### 2️⃣ Installez les dépendances
```bash
npm install
```

### 3️⃣ Ajoutez les plateformes natives

**Pour Android :**
```bash
npx cap add android
npx cap update android
```

**Pour iOS (Mac uniquement avec Xcode installé) :**
```bash
npx cap add ios
npx cap update ios
```

### 4️⃣ Compilez le projet
```bash
npm run build
```

### 5️⃣ Synchronisez avec les plateformes natives
```bash
npx cap sync
```

### 6️⃣ Lancez sur appareil/émulateur

**Pour Android (nécessite Android Studio) :**
```bash
npx cap run android
```

**Pour iOS (nécessite Mac + Xcode) :**
```bash
npx cap run ios
```

## 🔄 Workflow de développement

Pendant le développement dans Lovable, l'application utilise le **hot-reload** automatique via l'URL du sandbox. Vous pouvez donc :
- Modifier le code dans Lovable
- Voir les changements instantanément sur votre appareil/émulateur

**Après avoir fait un `git pull` de nouvelles modifications :**
```bash
npx cap sync
```

## 🛠️ Outils requis

### Pour Android :
- [Android Studio](https://developer.android.com/studio)
- JDK 11+
- Android SDK

### Pour iOS (Mac uniquement) :
- [Xcode](https://developer.apple.com/xcode/)
- CocoaPods : `sudo gem install cocoapods`
- Un Mac avec macOS

## 📱 Configuration backend

N'oubliez pas de configurer l'URL de votre backend Spring Boot dans `.env` :
```bash
VITE_API_URL=http://votre-backend-url:8080/api
```

**Important pour mobile :** 
- Sur émulateur Android, utilisez `http://10.0.2.2:8080/api` pour accéder à localhost
- Sur appareil physique, utilisez l'IP locale de votre machine (ex: `http://192.168.1.X:8080/api`)

## 🚀 Publication sur les stores

### Google Play Store (Android)
1. Générez un keystore pour signer l'app
2. Configurez `android/app/build.gradle`
3. Créez un APK/AAB de production
4. Créez un compte développeur Google Play (25$ unique)
5. Uploadez votre application

### Apple App Store (iOS)
1. Créez un compte Apple Developer (99$/an)
2. Configurez les certificats et profils de provisioning
3. Archivez l'app depuis Xcode
4. Uploadez via App Store Connect

## 🔗 Ressources

- [Documentation Capacitor](https://capacitorjs.com/docs)
- [Guide iOS](https://capacitorjs.com/docs/ios)
- [Guide Android](https://capacitorjs.com/docs/android)
- [Blog Lovable sur Capacitor](https://docs.lovable.dev/features/capacitor)

## ⚡ Capacités natives disponibles

Avec Capacitor, vous avez accès à :
- 📸 Appareil photo
- 📁 Système de fichiers
- 🔔 Notifications push
- 📍 Géolocalisation
- 🎤 Microphone
- 📱 Informations appareil
- Et bien plus...

[Voir tous les plugins Capacitor](https://capacitorjs.com/docs/plugins)
