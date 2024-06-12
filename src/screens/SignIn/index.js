import React, {useState, useContext, useEffect} from 'react';
import {useNavigation} from '@react-navigation/core';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {UserContext} from '../../contexts/UserContext';
import {
  Container,
  InputArea,
  CustomButton,
  CustomButtonText,
  SignMessageButton,
  SignMessageButtonText,
  SignMessageButtonTextBold,
} from './styles';

import { TouchableOpacity, TextInput, Text, View, StyleSheet, Image } from 'react-native';

// importar o arquivo de api
import Api from '../../Api';

// importar nosso componente input
import SignInput from '../../components/SignInput';

//importar os svg
import ImgLogin from '../../assets/imgLogin.svg';
import ImgEmail from '../../assets/imgEmail.svg';
import ImgCadeadoPreto from '../../assets/imgCadeadoPreto.svg';

// Caminho para a logo
const logoPath = require('../../assets/logomercadinho/logo_mercadinho_inteligente.png');

export default () => {

  console.log('entrou no index do SignIn...');

  // criar o dispatch para poder mandar informações para o context
  const {dispatch: userDispatch} = useContext(UserContext);
  const navigation = useNavigation();
  // criar os states de email e senha
  const [emailField, setEmailField] = useState('');
  const [passwordField, setPasswordField] = useState('');

  // ir pra tela de cadastro
  const handleMessageButtonClick = () => {
    // quando clicar vai pra tela de cadastro - sem a possibilidade dele voltar - reset
    navigation.reset({
      routes: [{name: 'SignUp'}],
    });
  };

  useEffect(() => {
    console.log('Entrou no useEffect do signIn...');
    console.log('Vamos verificar se tem o objeto user salvo no celular...');
    const checkUser = async () => {
      const user = await AsyncStorage.getItem('user');
      if (user) {
        // encontrou o token no celular
        console.log('User existe');
      } else {
        console.log('User não existe');
      }
    };
    checkUser();
  }, []);

  // quando clicar no botão de login
  const handleSignClick = async () => {
    console.log('entrou no signin...');
    
    // navigation.reset({
    //   routes: [{name: 'MainTab'}],
    // });

    // verificar se digitou email e senha
    if (emailField !== '' && passwordField !== '') {
      console.log('vai chamar a api...');
      // usar api para fazer o login
      let json = await Api.signIn(emailField, passwordField);
      console.log('json: ');
      console.log(json);

      if (json.user) {
        json.user.password = passwordField;
        /**
         * salvar os dados do usuário logado no async storage
         * salvar email e password, para quando ele voltar fazermos o login automático
         */
        await AsyncStorage.setItem('user', JSON.stringify(json.user));
        console.log('Usuário salvo no celular!');
        console.log(json.user);
      }
      if (json.token) {
        console.log('Token recebido no index do signin!');
        console.log(json.token);
        // aqui recebeu o token
        // eslint-disable-next-line no-alert
        // alert('Usuário autenticado com sucesso!');

        // salvar o token no async storage - fechar o app e abrir de novo, estará lá
        await AsyncStorage.setItem('token', json.token);
        console.log('Token salvo no celular!');

        // console.log('Vai salvar o usuário na seção...');
        // salvar outras informações no context (na seção)
        // o setUser precisar estar criado no UserReducer
        userDispatch({
          type: 'setUser', // nome da ação
          payload: {
            user: json.user, //enviar o user pra ser salvo
          },
        });
        console.log('Usuário salvo na seção!');

        // mandar o usuário pro home - tab principal - reset para ele não poder voltar para o login, uma vez que ele já logou.
        navigation.reset({
          routes: [{name: 'MainTab'}],
        });
      } else {
        // eslint-disable-next-line no-alert
        alert('Email ou senha não conferem');
      }
    } else {
      // email ou senha não foram digitados
      // eslint-disable-next-line no-alert
      alert('Dados inválidos!');

      // navigation.reset({
      //   routes: [{name: 'MainTab'}],
      // });
    }
  };
  return (
    <View style={styles.container}>
      <Image source={logoPath} style={styles.logo} />
      <View style={styles.inputArea}>
        <TextInput
          placeholder="Digite seu e-mail"
          value={emailField}
          onChangeText={(t) => setEmailField(t)}
          style={styles.input}
        />

        <TextInput
          placeholder="Digite sua senha"
          value={passwordField}
          onChangeText={(t) => setPasswordField(t)}
          secureTextEntry={true}
          style={styles.input}
        />
      </View>

      <TouchableOpacity onPress={handleSignClick} style={styles.button}>
        <Text style={styles.buttonText}>LOGIN</Text>
      </TouchableOpacity>

      {/* <TouchableOpacity onPress={handleMessageButtonClick}>
        <Text style={styles.signupText}>Ainda não tem uma conta? <Text style={styles.boldText}>Cadastre-se</Text></Text>
      </TouchableOpacity> */}
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#63c2d1',
  },
  logo: {
    width: 200, // ajuste a largura conforme necessário
    height: 200, // ajuste a altura conforme necessário
    marginBottom: 20,
    borderRadius: 30,
  },
  inputArea: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#83d6e3',
    borderRadius: 30,
    padding: 10,
    marginBottom: 10,
    width: '100%',
    backgroundColor: '#83d6e3',
    
  },
  button: {
    backgroundColor: '#268596',
    padding: 10,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#268596'
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18
  },
  signupText: {
    textAlign: 'center',
  },
  boldText: {
    fontWeight: 'bold',
  },
});