import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Toast from 'react-native-toast-message';

type FormValues = {
  fullName: string;
  age: string;
  email: string;
  password: string;
};

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

const validationSchema = Yup.object({
  fullName: Yup.string()
    .required('Informe nome e sobrenome.')
    .test('nome-sobrenome', 'Informe nome e sobrenome.', value => {
      if (!value) return false;
      const parts = value.trim().split(/\s+/).filter(Boolean);
      return parts.length >= 2;
    })
    .test('apenas-letras', 'Apenas letras (sem números).', value => {
      if (!value) return false;
      const parts = value.trim().split(/\s+/).filter(Boolean);
      return parts.every(p => onlyLettersRegex.test(p));
    }),
  age: Yup.string()
    .required('Informe sua idade.')
    .matches(/^[0-9]+$/, 'Idade inválida.')
    .test('min-18', 'Idade mínima: 18 anos.', value => {
      const n = Number(value);
      return Number.isFinite(n) && n >= 18;
    }),
  email: Yup.string()
    .required('Mínimo de 5 caracteres.')
    .min(5, 'Mínimo de 5 caracteres.')
    .email('Email inválido.'),
  password: Yup.string()
    .required('Senha precisa de 6+ caracteres.')
    .min(6, 'Senha precisa de 6+ caracteres.'),
});

export default function FormikLogin() {
  const initialValues: FormValues = {
    fullName: '',
    age: '',
    email: '',
    password: '',
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
        <Text style={styles.title}>Acesse sua conta (Formik + Yup)</Text>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          validateOnMount
          onSubmit={() => {
            Toast.show({ type: 'success', text1: 'Login realizado com sucesso!' });
          }}
        >
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isValid, setFieldValue }) => (
            <View>
              <Text style={styles.label}>Nome completo</Text>
              <TextInput
                placeholder="Nome e sobrenome"
                value={values.fullName}
                onChangeText={handleChange('fullName')}
                onBlur={handleBlur('fullName')}
                style={[styles.input, touched.fullName && errors.fullName && styles.inputError]}
                placeholderTextColor={COLORS.textSecondary}
                autoCapitalize="words"
              />
              {touched.fullName && errors.fullName ? (
                <Text style={styles.errorText}>{errors.fullName}</Text>
              ) : null}

              <Text style={styles.label}>Idade</Text>
              <TextInput
                placeholder="Ex.: 20"
                value={values.age}
                onChangeText={text => {
                  const digitsOnly = text.replace(/[^0-9]/g, '');
                  setFieldValue('age', digitsOnly);
                }}
                onBlur={handleBlur('age')}
                style={[styles.input, touched.age && errors.age && styles.inputError]}
                placeholderTextColor={COLORS.textSecondary}
                keyboardType="number-pad"
                inputMode="numeric"
                maxLength={3}
              />
              {touched.age && errors.age ? (
                <Text style={styles.errorText}>{errors.age}</Text>
              ) : null}

              <Text style={styles.label}>Email</Text>
              <TextInput
                placeholder="email@exemplo.com"
                autoCapitalize="none"
                keyboardType="email-address"
                value={values.email}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                style={[styles.input, touched.email && errors.email && styles.inputError]}
                placeholderTextColor={COLORS.textSecondary}
              />
              {touched.email && errors.email ? (
                <Text style={styles.errorText}>{errors.email}</Text>
              ) : null}

              <Text style={styles.label}>Senha</Text>
              <TextInput
                placeholder="sua senha"
                secureTextEntry
                value={values.password}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                style={[styles.input, touched.password && errors.password && styles.inputError]}
                placeholderTextColor={COLORS.textSecondary}
              />
              {touched.password && errors.password ? (
                <Text style={styles.errorText}>{errors.password}</Text>
              ) : null}

              <TouchableOpacity
                onPress={() => handleSubmit()}
                style={[styles.button, !isValid && styles.buttonDisabled]}
                activeOpacity={0.8}
                disabled={!isValid}
              >
                <Text style={styles.buttonText}>Entrar</Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
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


