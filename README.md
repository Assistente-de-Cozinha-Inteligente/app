> ⚠️ **Achou alguma melhoria, bug ou aquela gambiarra que magicamente funciona?**  
> Fique a vontade para abrir uma *issue* ou mandar um **pull request**.  
> Só não julgue tanto 😅😅😅

---

# 🍽️ Assistente de Cozinha Inteligente

Um aplicativo mobile que **resolve o que cozinhar**, usando o que você já tem, sem exigir planejamento, disciplina ou esforço constante.

> **Não é um app para gerenciar.  
> É um app para decidir.**

---

## 🚀 Sobre o projeto

O **Assistente de Cozinha Inteligente** foi criado para pessoas ocupadas, cansadas ou que simplesmente não querem pensar todo dia em:

- O que cozinhar?
- O que comprar?
- O que está perto de vencer?
- Como evitar desperdício?

O app assume parte dessas decisões e ajuda o usuário a seguir a semana com menos improviso e menos esforço mental.

---

## 🧠 Filosofia do produto

Este projeto segue alguns princípios claros:

- ✅ Funciona **sem login**
- ✅ Funciona **offline**
- ✅ Não exige cadastro inicial
- ✅ Resolve problemas em poucos segundos
- ✅ O usuário não precisa “manter” o app

O app **se adapta ao usuário**, e não o contrário.

---

## 📱 Principais funcionalidades

### 🍳 Receitas
- Catálogo público de receitas (acesso sem login)
- Busca por categorias, tempo e ingredientes
- Cache local para uso offline
- Detalhes claros e objetivos

### 🧺 Inventário
- Controle simples de ingredientes
- Não exige precisão absoluta
- Funciona mesmo com dados incompletos

### 🛒 Lista de compras
- Lista prática para o dia a dia
- Marcar itens como comprados alimenta o sistema
- Pode ser compartilhada facilmente

### 🤖 Assistente com IA
- Busca receitas a partir do que você tem
- Explica recomendações
- Sugere substituições
- Atua como apoio, não como chatbot genérico

---

## 💎 Premium (opcional)

O Premium **não bloqueia o uso do app**.  
Ele adiciona **profundidade, clareza e conforto**.

### Funcionalidades Premium incluem:

- Substituições inteligentes de ingredientes  
- Explicação: *“Por que essa receita foi sugerida?”*  
- Respostas completas da IA  
- Calorias totais e macros  
- Impacto nutricional por ingrediente  
- Pontos de atenção da receita  
- Tempo estimado por etapa  
- Insights de uso (*“Você costuma preferir…”*)  
- Remoção de anúncios  

O usuário vê o valor antes de decidir pagar.

---

## 🔓 Uso sem login

Você pode:
- Explorar receitas
- Buscar ideias
- Usar o app offline

O login é opcional e serve para:
- Sincronizar dados
- Salvar histórico
- Acessar Premium
- Backup em nuvem

---

## 🏗️ Arquitetura (resumo técnico)

- **Frontend:** React Native + Expo
- **Backend:** Firebase
- **Banco:** Firestore
- **Auth:** Firebase Auth (opcional)
- **Offline-first:** dados locais como base
- **Receitas:** leitura pública
- **Dados do usuário:** protegidos por UID

---

## 🔐 Segurança e dados

Este repositório é **público por design**, porque:

- ❌ Nenhuma chave sensível está versionada
- ❌ Nenhum segredo, token ou credencial é exposto
- ❌ Nenhum dado real de usuário está incluído
- ❌ Nenhuma lógica crítica de monetização depende do frontend

### Em resumo:
- Receitas são públicas **apenas para leitura**
- Escrita de dados exige autenticação
- Regras explícitas no Firestore
- Variáveis sensíveis são gerenciadas **fora do código**

Este repositório **não contém informações confidenciais**.

---

## 🧠 Sobre código aberto e cópias

Este projeto é público por **transparência, estudo e portfólio**, não por ausência de valor comercial.

- ✅ O código pode ser **estudado**
- ✅ A arquitetura pode ser **analisada**
- ✅ O projeto pode servir como **referência técnica**

Porém:

- ❌ Copiar o código **não concede direito** de replicar o produto
- ❌ A marca, identidade visual, conceito e posicionamento **não são licenciados**
- ❌ Uso comercial direto sem autorização **não é permitido**

Código aberto **não significa produto livre**.

---

## 🎯 Objetivo do projeto

Este projeto foi desenvolvido como:

- Estudo de produto real
- Aplicação prática de UX focado em retenção
- Demonstração de arquitetura mobile moderna
- Projeto de portfólio com visão de mercado

---

## 🧠 Diferencial

A maioria dos apps pede que o usuário se organize.  
Este app **assume parte da responsabilidade**.

> **Menos decisões.  
> Menos desperdício.  
> Mais tranquilidade.**

---

## 📌 Status do projeto

🚧 Em desenvolvimento ativo  
📱 Mobile (Android / iOS via Expo)  
🧪 Evolução contínua baseada em uso real  

---

## 📄 Licença

Este projeto utiliza a licença definida neste repositório.

- O código pode ser utilizado para **fins educacionais e de estudo**
- O uso comercial, redistribuição como produto final ou clonagem do app **não é permitido sem autorização**

Consulte o arquivo `LICENSE` para mais detalhes.

---

Se você chegou até aqui:  
obrigado por se interessar pelo projeto 🙌  

---

> 😄 **Nota honesta:** sim, este README foi gerado com ajuda de IA para ficar bonito, organizado e legível.  
> Se dependesse só de mim, provavelmente estaria funcional… porém bem feio
