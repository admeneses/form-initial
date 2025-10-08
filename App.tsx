import { StatusBar } from 'expo-status-bar';
import { Text, View, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useState } from 'react';
import FormikLogin from './screen/FormikLogin';
import RHFZodLogin from './screen/RHFZodLogin';
import Toast from 'react-native-toast-message';
import { commonStyles } from './styles/commonStyles';
import { COLORS } from './constants/colors';

export default function App() {

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [fullName, setFullName] = useState('');
  const [fullNameError, setFullNameError] = useState<string | null>(null);
  const [age, setAge] = useState('');
  const [ageError, setAgeError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const [useFormik, setUseFormik] = useState(false);
  const [useRHF, setUseRHF] = useState(false);

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (!text || text.length < 5) {
      setEmailError('Mínimo de 5 caracteres.');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)) {
      setEmailError('Email inválido.');
    } else {
      setEmailError(null);
    }
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (!text || text.length < 6) {
      setPasswordError('Senha precisa de 6+ caracteres.');
    } else {
      setPasswordError(null);
    }
  };

  const handleFullNameChange = (text: string) => {
    setFullName(text);
    const trimmed = text.trim();
    const parts = trimmed.split(/\s+/).filter(Boolean);
    const onlyLetters = /^([A-Za-zÀ-ÿ]+)$/;
    if (parts.length < 2) {
      setFullNameError('Informe nome e sobrenome.');
      return;
    }
    if (!parts.every(p => onlyLetters.test(p))) {
      setFullNameError('Apenas letras (sem números).');
      return;
    }
    setFullNameError(null);
  };

  const handleAgeChange = (text: string) => {
    // Mantém somente dígitos
    const digitsOnly = text.replace(/[^0-9]/g, '');
    setAge(digitsOnly);
    if (!digitsOnly) {
      setAgeError('Informe sua idade.');
      return;
    }
    const n = parseInt(digitsOnly, 10);
    if (Number.isNaN(n)) {
      setAgeError('Idade inválida.');
      return;
    }
    if (n < 18) {
      setAgeError('Idade mínima: 18 anos.');
      return;
    }
    setAgeError(null);
  };

  const handleSubmit = () => {
    Toast.show({ type: 'success', text1: 'Login realizado com sucesso!' });
  };

  const isValid = Boolean(
    fullName && age && email && password &&
    !fullNameError && !ageError && !emailError && !passwordError
  );

  if (useFormik) {
    return (
      <View style={commonStyles.container}>
        <StatusBar style="light" />
        <FormikLogin onBackToManual={() => setUseFormik(false)} />
        <Toast />
      </View>
    );
  }

  if (useRHF) {
    return (
      <View style={commonStyles.container}>
        <StatusBar style="light" />
        <RHFZodLogin onBackToManual={() => setUseRHF(false)} />
        <Toast />
      </View>
    );
  }

  return (
    <View style={commonStyles.container}>
      <StatusBar style="light" />
      <ScrollView 
        contentContainerStyle={commonStyles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={commonStyles.header}>
          <Image
            source={require('./assets/fiap-logo.png')}
            style={commonStyles.logo}
            resizeMode="contain"
            accessibilityLabel="FIAP icon"
          />
        </View>
        <View style={commonStyles.card}>
          <Text style={commonStyles.title}>Acesse sua conta</Text>
          <TouchableOpacity onPress={() => { setUseFormik(true); setUseRHF(false); }} style={[commonStyles.switchButton]} activeOpacity={0.8}>
            <Text style={commonStyles.switchText}>Usar Formik + Yup</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { setUseRHF(true); setUseFormik(false); }} style={[commonStyles.switchButton]} activeOpacity={0.8}>
            <Text style={commonStyles.switchText}>Usar React Hook Form + Zod</Text>
          </TouchableOpacity>

          <Text style={commonStyles.label}>Nome completo</Text>
          <TextInput
            placeholder="Nome e sobrenome"
            value={fullName}
            onChangeText={handleFullNameChange}
            style={[commonStyles.input, fullNameError && commonStyles.inputError]}
            placeholderTextColor={COLORS.textSecondary}
            autoCapitalize="words"
          />
          {fullNameError && <Text style={commonStyles.errorText}>{fullNameError}</Text>}

          <Text style={commonStyles.label}>Idade</Text>
          <TextInput
            placeholder="Ex.: 20"
            value={age}
            onChangeText={handleAgeChange}
            style={[commonStyles.input, ageError && commonStyles.inputError]}
            placeholderTextColor={COLORS.textSecondary}
            keyboardType="number-pad"
            inputMode="numeric"
            maxLength={3}
          />
          {ageError && <Text style={commonStyles.errorText}>{ageError}</Text>}

          <Text style={commonStyles.label}>Email</Text>
          <TextInput
            placeholder="email@exemplo.com"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={handleEmailChange}
            style={[commonStyles.input, emailError && commonStyles.inputError]}
            placeholderTextColor={COLORS.textSecondary}
          />
          {emailError && <Text style={commonStyles.errorText}>{emailError}</Text>}

          <Text style={commonStyles.label}>Senha</Text>
          <TextInput
            placeholder="sua senha"
            secureTextEntry
            value={password}
            onChangeText={handlePasswordChange}
            style={[commonStyles.input, passwordError && commonStyles.inputError]}
            placeholderTextColor={COLORS.textSecondary}
          />
          {passwordError && <Text style={commonStyles.errorText}>{passwordError}</Text>}

          <View style={commonStyles.switchContainer}>
            <Text style={commonStyles.switchLabel}>É administrador?</Text>
            <TouchableOpacity
              onPress={() => setIsAdmin(!isAdmin)}
              style={[commonStyles.switch, isAdmin && commonStyles.switchActive]}
              activeOpacity={0.8}
            >
              <View style={[commonStyles.switchThumb, isAdmin && commonStyles.switchThumbActive]} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={handleSubmit}
            style={[commonStyles.button, !isValid && commonStyles.buttonDisabled]}
            activeOpacity={0.8}
            disabled={!isValid}
          >
            <Text style={commonStyles.buttonText}>Entrar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Toast />
    </View>
  );
}

