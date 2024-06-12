import styled from 'styled-components/native';

export const Container = styled.SafeAreaView`
  flex: 1;
  background-color: #fff;
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
  background-color: ${({ index }) => (index % 2 === 0 ? '#fff' : '#f5f5f5')};
  padding: 10px;
  flex-direction: row;
  justify-content: space-between;
`;

export const LoadingIcon = styled.ActivityIndicator`
  margin-top: 50px;
`;
