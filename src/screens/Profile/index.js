// aqui é a tela inicial, que tem o toque aqui pra iniciar.
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  Container,
  CenteredView,
  LogoInstagram,
  LogoMercadinhoInteligente,
  StyledTextToqueNaTela,
  StyledTextMercadinhoInteligente,
  StyledTextSejaBemVindo,
  ImageWrapper,
  TextWrapper
} from './styles';

export default () => {

  console.log('entrou no index do Profile...');

  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate('Comprar');
  };

  return (
    <Container>
      <TouchableOpacity style={{ flex: 1 }} onPress={handlePress}>
        <CenteredView>
          <ImageWrapper>
            <LogoInstagram
              source={require('../../assets/outraslogos/logo_instagram.png')}
            />
          </ImageWrapper>
          <TextWrapper>
            <StyledTextMercadinhoInteligente>@inteligentemercadinho</StyledTextMercadinhoInteligente>
          </TextWrapper>
          <ImageWrapper>
            <LogoMercadinhoInteligente
              source={require('../../assets/logomercadinho/logo_mercadinho_inteligente.png')}
            />
          </ImageWrapper>
          <TextWrapper>
            <StyledTextSejaBemVindo>SEJA BEM VINDO</StyledTextSejaBemVindo>
          </TextWrapper>
          <TextWrapper>
            <StyledTextToqueNaTela>Toque na tela para iniciar</StyledTextToqueNaTela>
          </TextWrapper>
        </CenteredView>
      </TouchableOpacity>
    </Container>
  );
};
