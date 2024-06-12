import React, {useState, useContext} from 'react';
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

// importar nosso componente input
import SignInput from '../../components/SignInput';

// importar o arquivo de api
import Api from '../../Api';

//importar os svg - ícones
import ImgLogin from '../../assets/imgLogin.svg';
import ImgEmail from '../../assets/imgEmail.svg';
import ImgCadeadoPreto from '../../assets/imgCadeadoPreto.svg';
import ImgPessoaPreto from '../../assets/imgPessoaPreto.svg';

export default () => {

  console.log('entrou no index do SignUp...');

  // criar o dispatch para poder mandar informações para o context
  const userDispatch = useContext(UserContext);
  const navigation = useNavigation();
  // criar os states de email e senha
  const [emailField, setEmailField] = useState('');
  const [passwordField, setPasswordField] = useState('');
  const [nameField, setNameField] = useState('');
  // 
  const handleSignClick = async () => {
    // 
    if (nameField !== '' && emailField !== '' && passwordField !== '') {
      let json = await Api.signUp(nameField, emailField, passwordField);
      console.log(json);
      if (json.token) {
        // aqui foi cadastrado
        console.log('Token recebido no ato do cadastro!');
        // aqui recebeu o token
        alert('Usuário cadastrado com sucesso!');

        // salvar o token no async storage - fechar o app e abrir de novo, estará lá
        await AsyncStorage.setItem('token', json.token);

        console.log('Token salvo!');
        console.log('Vai salvar o usuário na seção...');

        // salvar outras informações no context (na seção)
        // o setUser precisar estar criado no UserReducer
        userDispatch({
          type: 'setUser',
          payload: {
            user: json.user,
          },
        });
        console.log('Usuário salvo na seção!');

        // mandar o usuário pro home - tab principal - reset para ele não poder voltar para o login, uma vez que ele já logou.
        navigation.reset({
          routes: [{name: 'MainTab'}],
        });

      } else {
        alert('Erro: '+json.error);
      }
    } else {
      alert('Preencha os campos!');
    }
  };
  // ir pra tela de cadastro
  const handleMessageButtonClick = () => {
    // quando clicar vai pra tela de cadastro - sem a possibilidade dele voltar - reset
    navigation.reset({
      routes: [{name: 'SignIn'}], // login
    });
  };
  return (
    <Container>
      <ImgLogin width="100%" height="160" />
      <InputArea>
        {/* Chamar nossos componentes passando o ícone que é pra mostrar */}
        <SignInput
          IconSvg={ImgPessoaPreto}
          placeholder="Digite seu nome"
          value={nameField}
          onChangeText={t => setNameField(t)} // possibilitar alterar o valor do campo
        />
        <SignInput
          IconSvg={ImgEmail}
          placeholder="Digite seu e-mail"
          value={emailField}
          onChangeText={t => setEmailField(t)} // possibilitar alterar o valor do campo
        />
        <SignInput
          IconSvg={ImgCadeadoPreto}
          placeholder="Digite sua senha"
          value={passwordField}
          onChangeText={t => setPasswordField(t)} // possibilitar alterar o valor do campo
          password={true}
        />
        <CustomButton onPress={handleSignClick}>
          <CustomButtonText>CADASTRAR</CustomButtonText>
        </CustomButton>
      </InputArea>
      <SignMessageButton onPress={handleMessageButtonClick}>
        <SignMessageButtonText>Já possui conta?</SignMessageButtonText>
        <SignMessageButtonTextBold>Faça Login</SignMessageButtonTextBold>
      </SignMessageButton>
    </Container>
  );
};
