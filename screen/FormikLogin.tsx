import React from 'react';
import { Text, View, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Toast from 'react-native-toast-message';
import { commonStyles } from '../styles/commonStyles';
import { COLORS } from '../constants/colors';

type FormValues = {
  fullName: string;
  age: string;
  email: string;
  password: string;
  isAdmin: boolean;
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
  isAdmin: Yup.boolean(),
});

interface FormikLoginProps {
  onBackToManual: () => void;
}

export default function FormikLogin({ onBackToManual }: FormikLoginProps) {
  const initialValues: FormValues = {
    fullName: '',
    age: '',
    email: '',
    password: '',
    isAdmin: false,
  };

  return (
    <ScrollView 
      contentContainerStyle={commonStyles.scrollContainer}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View style={commonStyles.header}>
        <Image
          source={require('../assets/fiap-logo.png')}
          style={commonStyles.logo}
          resizeMode="contain"
          accessibilityLabel="FIAP icon"
        />
      </View>
      <View style={commonStyles.card}>
        <Text style={commonStyles.title}>Acesse sua conta (Formik + Yup)</Text>
        
        <TouchableOpacity
          onPress={onBackToManual}
          style={[commonStyles.switchButton]}
          activeOpacity={0.8}
        >
          <Text style={commonStyles.switchText}>Usar formulário manual</Text>
        </TouchableOpacity>

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
              <Text style={commonStyles.label}>Nome completo</Text>
              <TextInput
                placeholder="Nome e sobrenome"
                value={values.fullName}
                onChangeText={handleChange('fullName')}
                onBlur={handleBlur('fullName')}
                style={[commonStyles.input, touched.fullName && errors.fullName && commonStyles.inputError]}
                placeholderTextColor={COLORS.textSecondary}
                autoCapitalize="words"
              />
              {touched.fullName && errors.fullName ? (
                <Text style={commonStyles.errorText}>{errors.fullName}</Text>
              ) : null}

              <Text style={commonStyles.label}>Idade</Text>
              <TextInput
                placeholder="Ex.: 20"
                value={values.age}
                onChangeText={text => {
                  const digitsOnly = text.replace(/[^0-9]/g, '');
                  setFieldValue('age', digitsOnly);
                }}
                onBlur={handleBlur('age')}
                style={[commonStyles.input, touched.age && errors.age && commonStyles.inputError]}
                placeholderTextColor={COLORS.textSecondary}
                keyboardType="number-pad"
                inputMode="numeric"
                maxLength={3}
              />
              {touched.age && errors.age ? (
                <Text style={commonStyles.errorText}>{errors.age}</Text>
              ) : null}

              <Text style={commonStyles.label}>Email</Text>
              <TextInput
                placeholder="email@exemplo.com"
                autoCapitalize="none"
                keyboardType="email-address"
                value={values.email}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                style={[commonStyles.input, touched.email && errors.email && commonStyles.inputError]}
                placeholderTextColor={COLORS.textSecondary}
              />
              {touched.email && errors.email ? (
                <Text style={commonStyles.errorText}>{errors.email}</Text>
              ) : null}

              <Text style={commonStyles.label}>Senha</Text>
              <TextInput
                placeholder="sua senha"
                secureTextEntry
                value={values.password}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                style={[commonStyles.input, touched.password && errors.password && commonStyles.inputError]}
                placeholderTextColor={COLORS.textSecondary}
              />
              {touched.password && errors.password ? (
                <Text style={commonStyles.errorText}>{errors.password}</Text>
              ) : null}

              <View style={commonStyles.switchContainer}>
                <Text style={commonStyles.switchLabel}>É administrador?</Text>
                <TouchableOpacity
                  onPress={() => setFieldValue('isAdmin', !values.isAdmin)}
                  style={[commonStyles.switch, values.isAdmin && commonStyles.switchActive]}
                  activeOpacity={0.8}
                >
                  <View style={[commonStyles.switchThumb, values.isAdmin && commonStyles.switchThumbActive]} />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={() => handleSubmit()}
                style={[commonStyles.button, !isValid && commonStyles.buttonDisabled]}
                activeOpacity={0.8}
                disabled={!isValid}
              >
                <Text style={commonStyles.buttonText}>Entrar</Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </View>
    </ScrollView>
  );
}



