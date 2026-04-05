# Erick Imports — iPhone Upgrade Simulator

## Visão Geral

Aplicação web para simulação de upgrade de iPhones com área administrativa completa, integrada ao Firebase.

**Stack:** React 18 + Vite + TypeScript + Tailwind CSS + Firebase (Auth, Firestore, Storage)

---

## 1. Configuração do Firebase

### 1.1 Criar projeto

1. Acesse [console.firebase.google.com](https://console.firebase.google.com)
2. Clique em "Adicionar projeto"
3. Nomeie como `erick-imports` (ou similar)
4. Ative Google Analytics (opcional)

### 1.2 Ativar serviços

No console do Firebase:

- **Authentication** → Sign-in method → Ativar "Email/Senha"
- **Firestore Database** → Criar banco de dados → Modo produção
- **Storage** → Ativar (para upload de fotos dos leads)

### 1.3 Registrar app web

1. Configurações do projeto → Adicionar app → Web
2. Copie as credenciais geradas

---

## 2. Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=erick-imports.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=erick-imports
VITE_FIREBASE_STORAGE_BUCKET=erick-imports.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXX
```

> **Importante:** Sem estas variáveis, a aplicação funciona em modo local com dados mockados. Com elas, conecta ao Firebase automaticamente.

---

## 3. Estrutura das Coleções do Firestore

### `catalog_trade_in` — Aparelhos aceitos para troca

```json
{
  "id": "iphone-15-pro",
  "name": "iPhone 15 Pro",
  "generation": 15,
  "active": true,
  "storage": [
    { "gb": 128, "tradeInValue": 4500 },
    { "gb": 256, "tradeInValue": 5000 }
  ],
  "colors": [
    { "id": "natural", "name": "Titânio Natural", "hex": "#C2BCAF" }
  ]
}
```

### `catalog_sale` — Aparelhos disponíveis para venda

```json
{
  "id": "iphone-16-pro-max",
  "name": "iPhone 16 Pro Max",
  "generation": 16,
  "active": true,
  "storage": [
    { "gb": 256, "sealedPrice": 11000, "usedPrice": 9400 },
    { "gb": 512, "sealedPrice": 12500, "usedPrice": 10600 }
  ]
}
```

### `pricing_rules` — Regras de depreciação e bônus

```json
{
  "id": "bat-80-89",
  "category": "battery",
  "key": "80-89",
  "label": "Bateria 80-89%",
  "value": 0.05,
  "description": "Depreciação leve"
}
```

Categorias: `battery`, `condition`, `defect`, `bonus`, `payment`

### `app_settings` (doc: `global`) — Configurações da operação

```json
{
  "whatsappNumber": "5511999999999",
  "ctaText": "Simular meu upgrade",
  "defaultContactMessage": "Olá! Vi sua simulação...",
  "disclaimerText": "Esta cotação é uma estimativa...",
  "photosEnabled": true,
  "photosLimit": 5,
  "questionsConfig": {
    "faceIdWorks": true,
    "deepScratches": true,
    "crackedScreen": true,
    "scratchedScreen": true,
    "crackedBack": true,
    "dentedSides": true,
    "camerasWorking": true,
    "previousRepair": true,
    "hasBox": true,
    "hasInvoice": true
  }
}
```

### `lead_sessions` — Leads (sessões do simulador)

```json
{
  "name": "Rafael Oliveira",
  "phone": "11987654321",
  "status": "novo",
  "currentModel": "iphone-13",
  "currentStorage": 128,
  "currentColor": "midnight",
  "batteryHealth": 82,
  "condition": "good",
  "defects": { "faceIdWorks": true, "crackedScreen": false, "..." : "..." },
  "desiredModel": "iphone-15-pro",
  "desiredStorage": 256,
  "desiredCondition": "sealed",
  "paymentMethod": "credit",
  "currentStep": 10,
  "lastCompletedStep": 9,
  "completed": true,
  "quote": { "currentPhoneBaseValue": 2200, "difference": 6030, "..." : "..." },
  "utm": { "utm_source": "instagram", "utm_medium": "social" },
  "referrer": "https://instagram.com",
  "startedAt": "2025-03-20T09:00:00Z",
  "lastInteraction": "2025-03-20T09:15:00Z",
  "notes": [],
  "statusHistory": []
}
```

### `lead_notes` — Observações internas

```json
{
  "sessionId": "lead-001",
  "text": "Lead quente, demonstrou interesse.",
  "author": "Admin",
  "createdAt": "2025-03-20T10:00:00Z"
}
```

### `lead_status_history` — Histórico de mudanças de status

```json
{
  "sessionId": "lead-001",
  "id": "uuid",
  "from": "novo",
  "to": "em_contato",
  "author": "Admin",
  "createdAt": "2025-03-20T15:00:00Z"
}
```

### `admins` — Usuários administradores

```json
{
  "uid": "firebase-auth-uid",
  "email": "admin@erickimports.com",
  "displayName": "Erick Admin",
  "role": "admin",
  "active": true,
  "createdAt": "2025-01-01T00:00:00Z"
}
```

Roles: `admin`, `manager`, `viewer`

---

## 4. Cadastrar Primeiro Admin

1. No Firebase Console → Authentication → Adicionar usuário
2. Informe email e senha
3. Copie o UID gerado
4. No Firestore → Criar documento em `admins/{UID}`:

```json
{
  "uid": "SEU_UID_AQUI",
  "email": "admin@erickimports.com",
  "displayName": "Erick Admin",
  "role": "admin",
  "active": true,
  "createdAt": "2025-01-01T00:00:00Z"
}
```

---

## 5. Regras de Segurança do Firestore

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Catálogo e configurações: leitura pública, escrita somente admin autenticado
    match /catalog_trade_in/{docId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /catalog_sale/{docId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /pricing_rules/{docId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /app_settings/{docId} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    // Leads: escrita pública (simulador), leitura somente admin
    match /lead_sessions/{sessionId} {
      allow create: if true;
      allow update: if true;
      allow read: if request.auth != null;
    }
    match /lead_notes/{noteId} {
      allow read, write: if request.auth != null;
    }
    match /lead_status_history/{historyId} {
      allow read, write: if request.auth != null;
    }

    // Admins: somente admin autenticado
    match /admins/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
  }
}
```

---

## 6. Regras de Segurança do Storage

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /lead_photos/{sessionId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.resource.size < 10 * 1024 * 1024
                   && request.resource.contentType.matches('image/.*');
    }
  }
}
```

---

## 7. Como Funciona a Integração

### Área Pública (Simulador)

1. Ao carregar, o simulador busca o **catálogo ativo** do Firestore (apenas `active: true`)
2. As **regras de preço** são carregadas do Firestore em tempo real
3. As **configurações** (WhatsApp, disclaimer, perguntas ativas) vêm do Firestore
4. A cada etapa, a sessão do lead é salva no Firestore automaticamente
5. A cotação é calculada dinamicamente usando as regras carregadas

### Área Admin

1. Login via Firebase Authentication
2. Dashboard calcula métricas em tempo real a partir dos leads no Firestore
3. Catálogo pode ser editado, ativado/desativado — reflete imediatamente no simulador
4. Regras de preço editáveis — impactam cotações imediatamente
5. Configurações editáveis — impactam comportamento do simulador em tempo real
6. Leads são monitorados via `onSnapshot` (tempo real)

### Fluxo de dados

```
[Usuário] → Simulador → Firestore (lead_sessions)
                ↕
[Admin] → Painel Admin → Firestore (catálogo, regras, settings)
                ↕
         Firestore ← onSnapshot → Simulador (atualização em tempo real)
```

---

## 8. Seed de Dados Iniciais

A aplicação inclui dados mockados como fallback quando o Firebase não está configurado. Para popular o Firebase com dados iniciais, a função `seedInitialData()` está disponível em `src/services/firestore.ts`.

Execute no console do navegador após configurar Firebase:

```javascript
import { seedInitialData } from './services/firestore';
import { TRADE_IN_MODELS, SALE_MODELS } from './data/catalog';
import { MOCK_PRICING_RULES, MOCK_SETTINGS } from './data/admin-mock';

seedInitialData(
  TRADE_IN_MODELS.map(m => ({ ...m, active: true })),
  SALE_MODELS.map(m => ({ ...m, active: true })),
  MOCK_PRICING_RULES,
  MOCK_SETTINGS
);
```

---

## 9. Testar Localmente

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build de produção
npm run build
```

### Modo sem Firebase (local)

Se as variáveis `VITE_FIREBASE_*` não estiverem configuradas, a aplicação opera com dados mockados automaticamente. Isso permite desenvolvimento e testes sem precisar de um projeto Firebase.

### Modo com Firebase

1. Configure as variáveis de ambiente
2. Crie o primeiro admin no Firebase Auth
3. Execute o seed de dados
4. Acesse `/admin/login` e faça login

---

## 10. Checklist de Configuração

- [ ] Criar projeto no Firebase Console
- [ ] Ativar Firebase Authentication (Email/Senha)
- [ ] Criar Firestore Database
- [ ] Ativar Firebase Storage
- [ ] Registrar app web e copiar credenciais
- [ ] Configurar variáveis de ambiente (`.env`)
- [ ] Aplicar regras de segurança do Firestore
- [ ] Aplicar regras de segurança do Storage
- [ ] Criar primeiro usuário admin no Firebase Auth
- [ ] Criar documento do admin no Firestore (`admins/{uid}`)
- [ ] Executar seed de dados iniciais
- [ ] Testar login no `/admin/login`
- [ ] Testar simulador público
- [ ] Verificar que alterações no admin refletem no simulador
- [ ] Configurar domínio personalizado (opcional)

---

## 11. Erros Comuns

| Erro | Causa | Solução |
|------|-------|---------|
| "Firebase not configured" | Variáveis VITE_FIREBASE_* ausentes | Criar arquivo `.env` com as credenciais |
| "Credenciais inválidas" no login | Usuário não existe no Firebase Auth | Criar usuário no Firebase Console |
| Dados não aparecem no admin | Firestore vazio | Executar seed de dados |
| Leads não salvam | Regras do Firestore bloqueando | Verificar regras de segurança |
| Fotos não carregam | Storage não ativado ou regras | Ativar Storage e configurar regras |
| Aparelho não aparece no simulador | `active: false` no catálogo | Ativar no painel admin |
| Cotação retorna zero | Regras de preço não carregadas | Verificar coleção `pricing_rules` |

---

## 12. Arquitetura do Projeto

```
src/
├── components/
│   ├── admin/           # Layout, badges, cards do admin
│   ├── simulator/       # Componentes do simulador público
│   ├── steps/           # Etapas do wizard (StepModel, StepStorage, etc.)
│   └── ui/              # shadcn/ui components
├── contexts/
│   └── AuthContext.tsx   # Firebase Auth + fallback mock
├── data/
│   ├── catalog.ts       # Dados estáticos de fallback
│   └── admin-mock.ts    # Dados mockados de fallback
├── hooks/
│   ├── useSimulator.ts  # Hook principal do simulador
│   ├── useFirebaseData.ts  # Hooks para catálogo, regras, settings
│   └── useFirebaseLeads.ts # Hook de leads com Firebase
├── lib/
│   ├── firebase.ts      # Inicialização do Firebase
│   ├── lead-tracker.ts  # Tracking de sessões
│   └── quote-calculator.ts # Calculadora de cotação (fallback estático)
├── pages/
│   ├── admin/           # Páginas do admin
│   ├── Index.tsx        # Landing page
│   ├── Simulator.tsx    # Wizard do simulador
│   └── QuoteResult.tsx  # Resultado da cotação
├── services/
│   └── firestore.ts     # CRUD do Firestore
└── types/
    ├── simulator.ts     # Tipos do simulador
    └── admin.ts         # Tipos do admin
```
