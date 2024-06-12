import React, {useEffect, useContext} from 'react';
import {
  Container,
  LoadingIcon,
  LogoMercadinhoInteligente,
  TextWrapper,
  StyledTextAguarde
} from './styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {UserContext} from '../../contexts/UserContext';
import {useNavigation} from '@react-navigation/native';
import Api from '../../Api';


export default () => {
  // criar o dispatch para poder mandar informações para o context
  const {dispatch: userDispatch} = useContext(UserContext);

  console.log('1 - entrou no index do preload...');
  const navigation = useNavigation();
  console.log('passou pelo navigation...');
  useEffect(() => {
    console.log('2 - vai verificar se existe o usuário no celular...');

    /**
     * vamos verificar se os dados do usuário estão salvos no celular - se tiver vamos fazer o login automático
     * ESSA PARTE FIZ DA MINHA CABEÇA.... SE PRECISAR É SÓ ARRACANCAR
     */
    const checkUser = async () => {
      console.log('2.1 - entrou em checkUser....');
      const user = JSON.parse(await AsyncStorage.getItem('user'));
      if (user) {
        // encontrou os dados do usuário no celular
        console.log('3 - User existe!');
        console.log('4 - Fazer login...');
        const emailField = user.email;
        const passwordField = user.password;

        if (emailField !== '' && passwordField !== '') {
          console.log('5 - vai chamar a api SignIn...');
          // usar api para fazer o login
          let json = await Api.signIn(emailField, passwordField);
          console.log('json: ');
          console.log(json);

          if (json.user) {
            json.user.password = passwordField;
            // salvar os dados do usuário logado no async storage
            await AsyncStorage.setItem('user', JSON.stringify(json.user));
            console.log('Usuário salvo no celular!');
            console.log(json.user);
          }
          if (json.token) {
            console.log('Token recebido no index do preload!');
            // aqui recebeu o token

            console.log('Usuário autenticado automaticamente!');

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
        }
      } else {
        console.log('User não existe');
      }
    };
    checkUser();

    // pegar o token salvo no app e validar no laravel
    const checkToken = async () => {
      console.log('entrou em checkToken...');
      const token = await AsyncStorage.getItem('token');
      if (token) {
        // encontrou o token no celular
        console.log('token existe');
        // validar o token
        let json = await Api.checkToken(token);
        // verfiicar se retornou um novo token
        if (json.token) {
          console.log('Token recebido novamente!');

          // salvar o novo token no async storage - fechar o app e abrir de novo, estará lá
          await AsyncStorage.setItem('token', json.token);

          console.log('Token salvo!');
          console.log('Vai salvar o usuário na seção...');

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
          // navigation.reset({
          //   routes: [{name: 'MainTab'}],
          // });
        } else {
          navigation.navigate('SignIn');
        }
      } else {
        console.log('token NÃO existe');
        // não tem token - enviar pro login

        navigation.navigate('SignIn');
      }
    };
    checkToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Container>
      {/* <ImgCarroPreto width="100%" height="160" /> */}

      <LogoMercadinhoInteligente
        source={require('../../assets/logomercadinho/logo_mercadinho_inteligente.png')}
      />

      <TextWrapper>
        <StyledTextAguarde>Aguarde...</StyledTextAguarde>
      </TextWrapper>

      <LoadingIcon size="large" color="#FFFFFF" />
    </Container>
  );
};
