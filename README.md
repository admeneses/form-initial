# Validação de Formulário (Expo/React Native)

## Objetivo do Projeto
Aplicativo base para a aula de validação de formulário. O foco é demonstrar boas práticas de coleta e validação de dados de entrada no React Native com Expo, oferecendo feedback claro ao usuário e garantindo consistência dos dados.

## Sobre o App
- **Stack**: Expo, React Native, React
- **Gerenciamento**: Projeto iniciado com Expo, suporte a iOS, Android e Web
- **Feedback ao usuário**: `react-native-toast-message`
- **Estilos**: Centralizados em `styles/commonStyles.ts` e `constants/colors.ts`

## Tipos de Formulários Implementados

### 1. Formulário Manual (App.tsx)
- **Abordagem**: Validação manual com `useState` e funções de validação
- **Características**:
  - Controle manual de estado para cada campo
  - Validação em tempo real com `onChangeText`
  - Mensagens de erro personalizadas
  - Botão desabilitado quando formulário inválido

### 2. Formik + Yup (screen/FormikLogin.tsx)
- **Bibliotecas**: `formik` + `yup`
- **Características**:
  - Gerenciamento de estado automático
  - Schema de validação declarativo com Yup
  - Validação em tempo real (`validateOnMount`)
  - Integração nativa com React Native
  - Suporte a validação condicional e customizada

### 3. React Hook Form + Zod (screen/RHFZodLogin.tsx)
- **Bibliotecas**: `react-hook-form` + `zod` + `@hookform/resolvers/zod`
- **Características**:
  - Performance otimizada (menos re-renders)
  - Validação com TypeScript nativo (Zod)
  - Modo `onChange` para validação em tempo real
  - API moderna com hooks
  - Validação assíncrona suportada

## Campos Implementados
- **Nome completo**: Validação de nome e sobrenome, apenas letras
- **Idade**: Apenas números, mínimo 18 anos
- **Email**: Validação de formato com regex
- **Senha**: Mínimo 6 caracteres
- **É administrador**: Campo boolean com switch customizado

## O que será trabalhado na aula
- **Validação de campos**: obrigatoriedade, formatos (e-mail, telefone), tamanho mínimo/máximo, máscaras quando aplicável.
- **Fluxo de erros**: mensagens claras, destaque visual de campos inválidos, prevenção de envio quando houver inconsistências.
- **UX de formulários**: estados de carregamento, desabilitar botões quando inválido, rolagem até o primeiro erro.
- **Boas práticas**: componentes controlados, funções puras de validação, reutilização de regras e mensagens, separação de responsabilidades.
- **Comparação de abordagens**: Manual vs Formik vs React Hook Form

## Dependências Principais

### Formulário Manual
- `react-native`: Componentes nativos
- `react-native-toast-message`: Feedback visual

### Formik + Yup
- `formik`: Gerenciamento de formulários
- `yup`: Schema de validação

### React Hook Form + Zod
- `react-hook-form`: Gerenciamento de formulários otimizado
- `zod`: Validação com TypeScript
- `@hookform/resolvers/zod`: Integração entre RHF e Zod

## Exemplos de Uso

### Formik + Yup
```typescript
const validationSchema = Yup.object({
  fullName: Yup.string()
    .required('Informe nome e sobrenome.')
    .test('nome-sobrenome', 'Informe nome e sobrenome.', value => {
      const parts = value.trim().split(/\s+/).filter(Boolean);
      return parts.length >= 2;
    }),
  email: Yup.string()
    .required('Mínimo de 5 caracteres.')
    .email('Email inválido.'),
  isAdmin: Yup.boolean(),
});
```

### React Hook Form + Zod
```typescript
const schema = z.object({
  fullName: z.string()
    .min(1, 'Informe nome e sobrenome.')
    .refine(value => value.trim().split(/\s+/).filter(Boolean).length >= 2, {
      message: 'Informe nome e sobrenome.',
    }),
  email: z.string()
    .min(5, 'Mínimo de 5 caracteres.')
    .refine((val) => emailRegex.test(val), {
      message: "E-mail não está em um formato válido.",
    }),
  isAdmin: z.boolean(),
});
```

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

## Estrutura do Projeto
```
form-initial/
├── App.tsx                    # Formulário manual + navegação entre formulários
├── screen/
│   ├── FormikLogin.tsx       # Formulário com Formik + Yup
│   └── RHFZodLogin.tsx       # Formulário com React Hook Form + Zod
├── styles/
│   └── commonStyles.ts       # Estilos centralizados
├── constants/
│   └── colors.ts             # Constantes de cores
├── assets/
│   └── fiap-logo.png         # Logo da FIAP
├── index.ts                  # Registro da aplicação
├── app.json                  # Configurações do Expo
└── package.json              # Dependências do projeto
```

### Arquivos Principais
- **`App.tsx`**: Ponto de entrada com formulário manual e navegação
- **`screen/FormikLogin.tsx`**: Implementação com Formik + Yup
- **`screen/RHFZodLogin.tsx`**: Implementação com React Hook Form + Zod
- **`styles/commonStyles.ts`**: Estilos compartilhados entre todos os formulários
- **`constants/colors.ts`**: Paleta de cores centralizada

## Comparação das Abordagens

| Aspecto | Manual | Formik + Yup | React Hook Form + Zod |
|---------|--------|--------------|----------------------|
| **Complexidade** | Baixa | Média | Média |
| **Performance** | Boa | Boa | Excelente |
| **Bundle Size** | Menor | Maior | Médio |
| **TypeScript** | Manual | Boa | Excelente |
| **Validação** | Manual | Declarativa | Declarativa |
| **Re-renders** | Muitos | Muitos | Poucos |
| **Curva de Aprendizado** | Baixa | Média | Média |

## Quando Usar Cada Abordagem

### Formulário Manual
- Projetos simples com poucos campos
- Quando você precisa de controle total
- Para aprender os conceitos básicos
- Não é ideal para Formulários complexos com muitas validações

### Formik + Yup
- Projetos que já usam Formik
- Validações complexas e condicionais
- Equipes familiarizadas com Yup
- Quando precisa de muitas validações customizadas

### React Hook Form + Zod
- Projetos novos com TypeScript
- Performance é crítica
- Validação com tipos seguros
- Formulários com muitos campos
- Aplicações que precisam de menos re-renders

