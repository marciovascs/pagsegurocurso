// import React from 'react';
import styled from 'styled-components/native';
import {Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');
const imageLogoMercadinhoInteligente = width * 0.5;

/**
 * horizontalmente no meio
 * verticalmente no meio
 */
export const Container = styled.SafeAreaView`
  background-color: #63c2d1;
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export const LoadingIcon = styled.ActivityIndicator`
  margin-top: 50px;
`;

export const LogoMercadinhoInteligente = styled.Image`
  width: ${imageLogoMercadinhoInteligente}px;
  height: ${imageLogoMercadinhoInteligente}px;
  resize-mode: contain;
  margin-bottom: 40px;
  border-radius: 30px;
`;

export const TextWrapper = styled.View`
  margin-bottom: 5px;
  justify-content: center;
  align-items: center;
`;

export const StyledTextAguarde = styled.Text`
  font-size: 25px;
  font-weight: bold;
  color: #cc0000;
  margin-bottom: 70px;
  margin-top: 0px;
`;
