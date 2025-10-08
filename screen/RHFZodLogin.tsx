import React from 'react';
import { Text, View, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import Toast from 'react-native-toast-message';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { commonStyles } from '../styles/commonStyles';
import { COLORS } from '../constants/colors';

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
  isAdmin: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

interface RHFZodLoginProps {
  onBackToManual: () => void;
}

export default function RHFZodLogin({ onBackToManual }: RHFZodLoginProps) {
  const { register, setValue, handleSubmit, formState: { errors, isValid }, trigger, watch } = useForm<FormValues>({
    mode: 'onChange',
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: '',
      age: '',
      email: '',
      password: '',
      isAdmin: false,
    },
  });

  React.useEffect(() => {
    register('fullName');
    register('age');
    register('email');
    register('password');
    register('isAdmin');
  }, [register]);

  const isAdmin = watch('isAdmin');

  const onSubmit = () => {
    Toast.show({ type: 'success', text1: 'Login realizado com sucesso!' });
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
        <Text style={commonStyles.title}>Acesse sua conta (React Hook Form + Zod)</Text>
        
        <TouchableOpacity
          onPress={onBackToManual}
          style={[commonStyles.switchButton]}
          activeOpacity={0.8}
        >
          <Text style={commonStyles.switchText}>Usar formulário manual</Text>
        </TouchableOpacity>

        <Text style={commonStyles.label}>Nome completo</Text>
        <TextInput
          placeholder="Nome e sobrenome"
          onChangeText={async text => { setValue('fullName', text); await trigger('fullName'); }}
          style={[commonStyles.input, errors.fullName && commonStyles.inputError]}
          placeholderTextColor={COLORS.textSecondary}
          autoCapitalize="words"
        />
        {errors.fullName && <Text style={commonStyles.errorText}>{errors.fullName.message}</Text>}

        <Text style={commonStyles.label}>Idade</Text>
        <TextInput
          placeholder="Ex.: 20"
          onChangeText={async text => { const digitsOnly = text.replace(/[^0-9]/g, ''); setValue('age', digitsOnly); await trigger('age'); }}
          style={[commonStyles.input, errors.age && commonStyles.inputError]}
          placeholderTextColor={COLORS.textSecondary}
          keyboardType="number-pad"
          inputMode="numeric"
          maxLength={3}
        />
        {errors.age && <Text style={commonStyles.errorText}>{errors.age.message}</Text>}

        <Text style={commonStyles.label}>Email</Text>
        <TextInput
          placeholder="email@exemplo.com"
          autoCapitalize="none"
          keyboardType="email-address"
          onChangeText={async text => { setValue('email', text); await trigger('email'); }}
          style={[commonStyles.input, errors.email && commonStyles.inputError]}
          placeholderTextColor={COLORS.textSecondary}
        />
        {errors.email && <Text style={commonStyles.errorText}>{errors.email.message}</Text>}

        <Text style={commonStyles.label}>Senha</Text>
        <TextInput
          placeholder="sua senha"
          secureTextEntry
          onChangeText={async text => { setValue('password', text); await trigger('password'); }}
          style={[commonStyles.input, errors.password && commonStyles.inputError]}
          placeholderTextColor={COLORS.textSecondary}
        />
        {errors.password && <Text style={commonStyles.errorText}>{errors.password.message}</Text>}

        <View style={commonStyles.switchContainer}>
          <Text style={commonStyles.switchLabel}>É administrador?</Text>
          <TouchableOpacity
            onPress={async () => { 
              const newValue = !isAdmin; 
              setValue('isAdmin', newValue); 
              await trigger('isAdmin'); 
            }}
            style={[commonStyles.switch, isAdmin && commonStyles.switchActive]}
            activeOpacity={0.8}
          >
            <View style={[commonStyles.switchThumb, isAdmin && commonStyles.switchThumbActive]} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          style={[commonStyles.button, !isValid && commonStyles.buttonDisabled]}
          activeOpacity={0.8}
          disabled={!isValid}
        >
          <Text style={commonStyles.buttonText}>Entrar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}



