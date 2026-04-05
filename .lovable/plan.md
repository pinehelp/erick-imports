## Plano de Revisão Completa

### 1. Firebase Services Layer
- Criar serviços Firebase reais (Firestore CRUD para catálogo, regras, settings, leads)
- Criar hooks React para consumir dados do Firebase em tempo real
- Remover todos os mocks e dados estáticos

### 2. Admin - Catálogo CRUD
- Modal/drawer para adicionar, editar e remover aparelhos (aceitos e desejados)
- Toggle ativo/inativo funcional com Firebase
- Confirmação de exclusão
- Validação de duplicatas

### 3. Admin - Switches visuais
- Redesenhar Switch component com paleta da marca
- Melhorar contraste e estados

### 4. Área Pública - Firebase dinâmico
- Steps do simulador consumem catálogo do Firebase
- Regras de preço do Firebase
- Settings do Firebase (WhatsApp, disclaimer, fotos)
- Aparelhos inativos não aparecem

### 5. Mobile UX
- Fix zoom automático em inputs (font-size ≥ 16px)
- Viewport meta tag ajustada
- Revisar todos os inputs/selects

### 6. Contraste dos selecionáveis
- Melhorar SelectionCard, ToggleYesNo, cards de seleção
- Estado selecionado com destaque forte (borda laranja, glow)

### 7. README.md completo
- Documentação técnica Firebase de ponta a ponta

### 8. Integração admin ↔ público
- Garantir que alterações no admin reflitam no simulador em tempo real
