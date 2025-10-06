import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image } from 'react-native';
import { useState } from 'react';
import FormikLogin from './screen/FormikLogin';
import RHFZodLogin from './screen/RHFZodLogin';
import Toast from 'react-native-toast-message';

export default function App() {
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

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [fullName, setFullName] = useState('');
  const [fullNameError, setFullNameError] = useState<string | null>(null);
  const [age, setAge] = useState('');
  const [ageError, setAgeError] = useState<string | null>(null);
  
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
      <View style={styles.container}>
        <View style={styles.header}>
          <Image
            source={require('./assets/fiap-logo.png')}
            style={styles.logo}
            resizeMode="contain"
            accessibilityLabel="FIAP icon"
          />
        </View>
        <View style={styles.card}>
          <Text style={styles.title}>Acesse sua conta</Text>
          <TouchableOpacity
            onPress={() => setUseFormik(false)}
            style={[styles.switchButton]}
            activeOpacity={0.8}
          >
            <Text style={styles.switchText}>Usar formulário manual</Text>
          </TouchableOpacity>
        </View>
        <FormikLogin />
        <StatusBar style="light" />
        <Toast />
      </View>
    );
  }

  if (useRHF) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Image
            source={require('./assets/fiap-logo.png')}
            style={styles.logo}
            resizeMode="contain"
            accessibilityLabel="FIAP icon"
          />
        </View>
        <View style={styles.card}>
          <Text style={styles.title}>Acesse sua conta</Text>
          <TouchableOpacity
            onPress={() => setUseRHF(false)}
            style={[styles.switchButton]}
            activeOpacity={0.8}
          >
            <Text style={styles.switchText}>Usar formulário manual</Text>
          </TouchableOpacity>
        </View>
        <RHFZodLogin />
        <StatusBar style="light" />
        <Toast />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('./assets/fiap-logo.png')}
          style={styles.logo}
          resizeMode="contain"
          accessibilityLabel="FIAP icon"
        />
      </View>
      <View style={styles.card}>
        <Text style={styles.title}>Acesse sua conta</Text>
        <TouchableOpacity onPress={() => { setUseFormik(true); setUseRHF(false); }} style={[styles.switchButton]} activeOpacity={0.8}>
          <Text style={styles.switchText}>Usar Formik + Yup</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { setUseRHF(true); setUseFormik(false); }} style={[styles.switchButton]} activeOpacity={0.8}>
          <Text style={styles.switchText}>Usar React Hook Form + Zod</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Nome completo</Text>
        <TextInput
          placeholder="Nome e sobrenome"
          value={fullName}
          onChangeText={handleFullNameChange}
          style={[styles.input, fullNameError && styles.inputError]}
          placeholderTextColor={COLORS.textSecondary}
          autoCapitalize="words"
        />
        {fullNameError && <Text style={styles.errorText}>{fullNameError}</Text>}

        <Text style={styles.label}>Idade</Text>
        <TextInput
          placeholder="Ex.: 20"
          value={age}
          onChangeText={handleAgeChange}
          style={[styles.input, ageError && styles.inputError]}
          placeholderTextColor={COLORS.textSecondary}
          keyboardType="number-pad"
          inputMode="numeric"
          maxLength={3}
        />
        {ageError && <Text style={styles.errorText}>{ageError}</Text>}

        <Text style={styles.label}>Email</Text>
        <TextInput
          placeholder="email@exemplo.com"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={handleEmailChange}
          style={[styles.input, emailError && styles.inputError]}
          placeholderTextColor={COLORS.textSecondary}
        />
        {emailError && <Text style={styles.errorText}>{emailError}</Text>}

        <Text style={styles.label}>Senha</Text>
        <TextInput
          placeholder="sua senha"
          secureTextEntry
          value={password}
          onChangeText={handlePasswordChange}
          style={[styles.input, passwordError && styles.inputError]}
          placeholderTextColor={COLORS.textSecondary}
        />
        {passwordError && <Text style={styles.errorText}>{passwordError}</Text>}

        <TouchableOpacity
          onPress={handleSubmit}
          style={[styles.button, !isValid && styles.buttonDisabled]}
          activeOpacity={0.8}
          disabled={!isValid}
        >
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
      </View>
      <StatusBar style="light" />
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d0f',
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
  brand: {
    color: '#e91d63',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 2,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#151518',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2a2a2e',
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
    color: '#ffffff',
  },
  label: {
    fontSize: 13,
    color: '#b9b9c0',
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#2a2a2e',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#1b1b1f',
    color: '#ffffff',
  },
  inputError: {
    borderColor: '#ff5a6a',
  },
  errorText: {
    color: '#ff5a6a',
    marginTop: 6,
    fontSize: 12,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#e91d63',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#c2185b',
    shadowColor: '#e91d63',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 12,
    elevation: 4,
  },
  buttonDisabled: {
    backgroundColor: '#3a3a3f',
    borderColor: '#2a2a2e',
    shadowOpacity: 0,
    shadowRadius: 0,
    shadowOffset: { width: 0, height: 0 },
    elevation: 0,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  switchButton: {
    marginTop: 8,
    marginBottom: 8,
    backgroundColor: '#26262b',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2a2a2e',
  },
  switchText: {
    color: '#b9b9c0',
    fontSize: 13,
    fontWeight: '600',
  },
});
