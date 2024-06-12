// Aqui é a tela de obrigado.
import React, { useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import {
  Container,
  CenteredView,
  LogoMercadinhoInteligente,
  StyledTextObrigado,
  StyledTextRetireOCartao,
  ImageWrapper,
  TextWrapper
} from './styles';

export default () => {

  console.log('entrou no index do Search...');

  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      console.log('Screen is focused');
      const timer = setTimeout(() => {
        navigation.navigate('Profile');
      }, 3000);

      return () => {
        console.log('Screen is unfocused');
        clearTimeout(timer);
      };
    }, [navigation])
  );

  const handlePress = () => {
    navigation.navigate('Profile');
  };

  return (
    <Container>
      <TouchableOpacity style={{ flex: 1 }} onPress={handlePress}>
        <CenteredView>
          <TextWrapper>
            <StyledTextRetireOCartao>NÃO ESQUEÇA SEU CARTÃO!</StyledTextRetireOCartao>
          </TextWrapper>
          <ImageWrapper>
            <LogoMercadinhoInteligente
              source={require('../../assets/logomercadinho/logo_mercadinho_inteligente.png')}
            />
          </ImageWrapper>
          <TextWrapper>
            <StyledTextObrigado>Volte sempre!</StyledTextObrigado>
          </TextWrapper>
        </CenteredView>
      </TouchableOpacity>
    </Container>
  );
};
