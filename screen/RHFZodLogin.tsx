import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image } from 'react-native';
import Toast from 'react-native-toast-message';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const COLORS = {
  background: '#0d0d0f',
  surface: '#151518',
  border: '#2a2a2e',
  textPrimary: '#ffffff',
  textSecondary: '#b9b9c0',
  error: '#ff5a6a',
  fiapPink: '#e91d63',
  fiapPinkDark: '#c2185b',
};

const onlyLettersRegex = /^([A-Za-zÀ-ÿ]+)$/;

// Regex robusta para validação de e-mail
const emailRegex = new RegExp(
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
);

const schema = z.object({
  fullName: z
    .string()
    .min(1, 'Informe nome e sobrenome.')
    .refine(value => value.trim().split(/\s+/).filter(Boolean).length >= 2, {
      message: 'Informe nome e sobrenome.',
    })
    .refine(value => value.trim().split(/\s+/).filter(Boolean).every(p => onlyLettersRegex.test(p)), {
      message: 'Apenas letras (sem números).',
    }),
  age: z
    .string()
    .min(1, 'Informe sua idade.')
    .regex(/^[0-9]+$/, 'Idade inválida.')
    .refine(value => Number(value) >= 18, { message: 'Idade mínima: 18 anos.' }),
  email: z
    .string()
    .min(5, 'Mínimo de 5 caracteres.')
    // O refine aplica a validação personalizada usando o Regex
    .refine((val) => emailRegex.test(val), {
      message: "E-mail não está em um formato válido (ex: nome@dominio.com).",
    }),
  password: z
    .string()
    .min(6, 'Senha precisa de 6+ caracteres.'),
});

type FormValues = z.infer<typeof schema>;

export default function RHFZodLogin() {
  const { register, setValue, handleSubmit, formState: { errors, isValid }, trigger } = useForm<FormValues>({
    mode: 'onChange',
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: '',
      age: '',
      email: '',
      password: '',
    },
  });

  React.useEffect(() => {
    register('fullName');
    register('age');
    register('email');
    register('password');
  }, [register]);

  const onSubmit = () => {
    Toast.show({ type: 'success', text1: 'Login realizado com sucesso!' });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../assets/fiap-logo.png')}
          style={styles.logo}
          resizeMode="contain"
          accessibilityLabel="FIAP icon"
        />
      </View>
      <View style={styles.card}>
        <Text style={styles.title}>Acesse sua conta (React Hook Form + Zod)</Text>

        <Text style={styles.label}>Nome completo</Text>
        <TextInput
          placeholder="Nome e sobrenome"
          onChangeText={async text => { setValue('fullName', text); await trigger('fullName'); }}
          style={[styles.input, errors.fullName && styles.inputError]}
          placeholderTextColor={COLORS.textSecondary}
          autoCapitalize="words"
        />
        {errors.fullName && <Text style={styles.errorText}>{errors.fullName.message}</Text>}

        <Text style={styles.label}>Idade</Text>
        <TextInput
          placeholder="Ex.: 20"
          onChangeText={async text => { const digitsOnly = text.replace(/[^0-9]/g, ''); setValue('age', digitsOnly); await trigger('age'); }}
          style={[styles.input, errors.age && styles.inputError]}
          placeholderTextColor={COLORS.textSecondary}
          keyboardType="number-pad"
          inputMode="numeric"
          maxLength={3}
        />
        {errors.age && <Text style={styles.errorText}>{errors.age.message}</Text>}

        <Text style={styles.label}>Email</Text>
        <TextInput
          placeholder="email@exemplo.com"
          autoCapitalize="none"
          keyboardType="email-address"
          onChangeText={async text => { setValue('email', text); await trigger('email'); }}
          style={[styles.input, errors.email && styles.inputError]}
          placeholderTextColor={COLORS.textSecondary}
        />
        {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

        <Text style={styles.label}>Senha</Text>
        <TextInput
          placeholder="sua senha"
          secureTextEntry
          onChangeText={async text => { setValue('password', text); await trigger('password'); }}
          style={[styles.input, errors.password && styles.inputError]}
          placeholderTextColor={COLORS.textSecondary}
        />
        {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}

        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          style={[styles.button, !isValid && styles.buttonDisabled]}
          activeOpacity={0.8}
          disabled={!isValid}
        >
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    width: 84,
    height: 84,
    borderRadius: 18,
    marginBottom: 8,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
    color: COLORS.textPrimary,
  },
  label: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#1b1b1f',
    color: COLORS.textPrimary,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  errorText: {
    color: COLORS.error,
    marginTop: 6,
    fontSize: 12,
  },
  button: {
    marginTop: 20,
    backgroundColor: COLORS.fiapPink,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.fiapPinkDark,
    shadowColor: COLORS.fiapPink,
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 12,
    elevation: 4,
  },
  buttonDisabled: {
    backgroundColor: '#3a3a3f',
    borderColor: COLORS.border,
    shadowOpacity: 0,
    shadowRadius: 0,
    shadowOffset: { width: 0, height: 0 },
    elevation: 0,
  },
  buttonText: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});


