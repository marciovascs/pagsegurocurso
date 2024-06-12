import styled from 'styled-components/native';
import {Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');
const imageLogoInstagram = width * 0.25;
const imageLogoMercadinhoInteligente = width * 0.5;

export const Container = styled.SafeAreaView`
  background-color: #63c2d1;
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export const InputArea = styled.View`
  background-color: #268596;
  padding: 10px;
`;

export const BotaoPagar = styled.TouchableOpacity`
  height: 60px;
  background-color: #268596;
  border-radius: 30px;
  justify-content: center;
  align-items: center;
  flex: 1;
  margin-horizontal: 5px;
  flex-basis: 60%;
`;

export const BotaoSair = styled.TouchableOpacity`
  height: 60px;
  background-color: #268596;
  border-radius: 30px;
  justify-content: center;
  align-items: center;
  flex: 1;
  margin-horizontal: 5px;
  flex-basis: 20%;
`;

export const CustomButton = styled.TouchableOpacity`
  height: 60px;
  background-color: #268596;
  border-radius: 30px;
  justify-content: center;
  align-items: center;
`;

export const CustomButtonText = styled.Text`
  font-size: 25px;
  color: #fff;
`;

export const DeleteButton = styled.TouchableOpacity`
  background-color: red;
  padding: 5px 10px;
  border-radius: 5px;
`;

export const DeleteButtonText = styled.Text`
  color: #fff;
`;

export const NomeProduto = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: #990000;
`;

export const PrecoProduto = styled.Text`
  font-size: 25px;
  font-weight: bold;
  align-items: center;
`;

export const RowContainer = styled.View`
  background-color: ${({index}) => (index % 2 === 0 ? '#fff' : '#f5f5f5')};
  padding: 10px;
  flex-direction: row;
  justify-content: space-between;
`;

export const LoadingIcon = styled.ActivityIndicator`
  margin-top: 50px;
`;

export const CenteredView = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export const LogoInstagram = styled.Image`
  width: ${imageLogoInstagram}px;
  height: ${imageLogoInstagram}px;
  resize-mode: contain;
  margin-bottom: 20px;
  border-radius: 30px;
`;

export const LogoMercadinhoInteligente = styled.Image`
  width: ${imageLogoMercadinhoInteligente}px;
  height: ${imageLogoMercadinhoInteligente}px;
  resize-mode: contain;
  margin-bottom: 20px;
  border-radius: 30px;
`;

export const StyledTextToqueNaTela = styled.Text`
  font-size: 24px;
  color: #cc0000;
  margin-bottom: 20px;
  font-weight: bold;
`;

export const StyledTextObrigado = styled.Text`
  justify-content: center;
  align-items: center;
  font-size: 25px;
  font-weight: bold;
  color: #000088;
  margin-bottom: 20px;
`;

export const StyledTextRetireOCartao = styled.Text`
  justify-content: center;
  align-items: center;
  font-size: 25px;
  font-weight: bold;
  color: #cc0000;
  margin-bottom: 20px;
`;

export const StyledTextMercadinhoInteligente = styled.Text`
  font-size: 25px;
  font-weight: bold;
  color: #1d7d9c;
  margin-bottom: 20px;
`;

export const ImageWrapper = styled.View`
  margin-bottom: 20px;
`;

export const TextWrapper = styled.View`
  margin-bottom: 20px;
  justify-content: center;
  align-items: center;
`;
