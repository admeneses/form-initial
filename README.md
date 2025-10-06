# Validação de Formulário (Expo/React Native)

## Objetivo do Projeto
Aplicativo base para a aula de validação de formulário. O foco é demonstrar boas práticas de coleta e validação de dados de entrada no React Native com Expo, oferecendo feedback claro ao usuário e garantindo consistência dos dados.

## Sobre o App
- **Stack**: Expo, React Native, React
- **Gerenciamento**: Projeto iniciado com Expo, suporte a iOS, Android e Web
- **Feedback ao usuário**: `react-native-toast-message`

## O que será trabalhado na aula
- **Validação de campos**: obrigatoriedade, formatos (e-mail, telefone), tamanho mínimo/máximo, máscaras quando aplicável.
- **Fluxo de erros**: mensagens claras, destaque visual de campos inválidos, prevenção de envio quando houver inconsistências.
- **UX de formulários**: estados de carregamento, desabilitar botões quando inválido, rolagem até o primeiro erro.
- **Boas práticas**: componentes controlados, funções puras de validação, reutilização de regras e mensagens, separação de responsabilidades.

## Scripts Disponíveis
- `npm start`: inicia o servidor de desenvolvimento do Expo
- `npm run android`: abre o app no Android
- `npm run ios`: abre o app no iOS
- `npm run web`: abre o app no navegador

## Como Executar
1. Instale as dependências:
   ```bash
   npm install
   ```
2. Inicie o projeto:
   ```bash
   npm start
   ```
3. Escolha a plataforma (a, i, w) ou use o app Expo Go para escanear o QR code.

## Estrutura Resumida
- `App.tsx`: ponto de entrada do app e tela de formulário.
- `index.ts`: registro da aplicação.
- `app.json`: configurações do Expo (nome, splash, ícones, plataforma).
- `assets/`: recursos estáticos (logos e imagens usadas pelo Expo).

