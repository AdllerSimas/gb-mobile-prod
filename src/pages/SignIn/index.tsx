import React, { useCallback, useRef } from 'react';
import { Image, View, ScrollView, KeyboardAvoidingView, Platform, TextInput, Alert  } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import * as Yup from 'yup';

import { Form } from  '@unform/mobile'; 
import { FormHandles } from '@unform/core';

import { useAuth } from '../../hooks/auth';

import getValidationErrors from '../../utils/getValidationErrors';

import logoImg from '../../assets/logo.png';

import Input from '../../components/Input';
import Button from '../../components/Button';

import { Container, Title, ForgotPassword, ForgotPasswordText, CreateAccountButton, CreateAccountButtonText } from './styles';

interface SignInFormData {
    email: string;
    password: string;
}

const SignIn: React.FC = () => {
    
    const formRef = useRef<FormHandles>(null);
    const passwordInputRef = useRef<TextInput>(null);
    
    const navigation = useNavigation();

    const { signIn, user } = useAuth();

    const handleSignIn = useCallback(async (data: SignInFormData) => {
        
        try {

            formRef.current?.setErrors({});

            const schema = Yup.object().shape({
                email: Yup.string().required('E-mail Obrigatório!').email('Digite um email válido!'),
                password: Yup.string().min(6, 'Senha Obrigatória!'),
            });
            console.log('1');
            await schema.validate(data, {
                abortEarly: false,
            });

            console.log('2');
            await signIn({
                email: data.email,
                password: data.password,
            });
            console.log('3');

        } catch (err) {
            
            if (err instanceof Yup.ValidationError) {
                const errors = getValidationErrors(err);
                console.log(err);
                formRef.current?.setErrors(errors);

                return;
            }
            
            Alert.alert('Erro na Autenticação', 'Erro ao fazer login, cheque as credenciais!');

            
        }
    },[signIn]);

    return (
        <>
            <KeyboardAvoidingView 
                style={ { flex:1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                enabled
            >
                <ScrollView
                    contentContainerStyle={{flex:1}}
                    keyboardShouldPersistTaps="handled"
                >
                    <Container>
                        
                        <Image source={ logoImg }/>

                        <View>
                            <Title>Faça Seu Login</Title>
                        </View>

                        <Form ref={formRef} onSubmit={handleSignIn}>
                        
                            <Input
                                autoCorrect={false}
                                autoCapitalize="none"
                                keyboardType="email-address" 
                                name="email" 
                                icon="mail" 
                                placeholder="Email"
                                returnKeyType="next"
                                onSubmitEditing={() => {
                                    passwordInputRef.current?.focus();
                                }}
                            />
                            <Input 
                                ref={passwordInputRef}
                                name="password" 
                                icon="lock" 
                                placeholder="Senha"
                                secureTextEntry
                                returnKeyType="send"
                                onSubmitEditing={() => {
                                    formRef.current?.submitForm();
                                }}
                            />
                            
                            <Button onPress={() => {
                                formRef.current?.submitForm();
                            }}>Entrar</Button>
                        
                        </Form>

                        <ForgotPassword onPress={() => {}}>
                            <ForgotPasswordText>Recuperar Minha Senha!</ForgotPasswordText>
                        </ForgotPassword>

                    </Container>
                </ScrollView>

            </KeyboardAvoidingView>

            <CreateAccountButton onPress={() => navigation.navigate('SignUp')}>
                <Icon name="log-in" size={20} color="#ff9000" />
                <CreateAccountButtonText>Criar Uma Conta</CreateAccountButtonText>
            </CreateAccountButton>
        </>
    );
}

export default SignIn;