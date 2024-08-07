import React, {useState, useEffect, useRef} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { BleManager } from 'react-native-ble-plx';
import {
  PermissionsAndroid,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Platform,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import {
  Container,
  InputArea,
  BotaoPagar,
  BotaoSair,
  CustomButton,
  CustomButtonText,
  RowContainer,
  NomeProduto,
  PrecoProduto,
  LoadingIcon,
  CenteredMessage,
  MessageText,
} from './styles';
import {useNavigation, useRoute, useFocusEffect} from '@react-navigation/native';
import Api from '../../Api';
import ImgExcluir from '../../assets/excluir.svg';

const ip = Platform.OS === 'ios' ? '127.0.0.1' : '10.0.2.2';
const BASE_API = 'https://mercadinhointeligente.com.br'; // url
// const BASE_API = 'http://' + ip + ':8000/api'; // url das apis do sistema mercadinho

export default () => {

  // console.log('entrou no index do Home...');

  const [inputValue, setInputValue, setTextInputValue] = useState('');
  const [productList, setProductList] = useState([]);
  const [totalValue, setTotalValue] = useState(0);
  const [isLoading, setIsLoading] = useState(false); // Novo estado de carregamento
  const navigation = useNavigation();
  const inputRef = useRef(null); // Referência para o TextInput
  const route = useRoute();

  // Atualiza o estado com os parâmetros recebidos da navegação
  useEffect(() => {

    console.log('entrou no useEffect do Home...');

    if (
      route.params?.totalValue !== undefined &&
      route.params?.productList !== undefined
    ) {
      setTotalValue(route.params.totalValue);
      setProductList(route.params.productList);
    }
  }, [route.params]);

  useFocusEffect(
    React.useCallback(() => {
      // Função para definir o foco no TextInput
      const focusOnInput = () => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      };

      // Definindo o foco após um pequeno atraso para garantir que a renderização seja concluída
      const timer = setTimeout(focusOnInput, 100);

      // Limpeza do timer ao sair do componente
      return () => clearTimeout(timer);
    }, [inputRef])
  );


  // permissões para bluetooth
  async function requestPermissions() {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
      if (Platform.Version >= 31) {
        await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN);
        await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT);
        await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE);
      }
    }
  }
  requestPermissions();


  const handleSignOut = () => {
    navigation.reset({
      routes: [{name: 'SignIn'}],
    });
  };

  // Função para definir o foco no TextInput
  const focusOnInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleEnter = (event) => {
    console.log('!!! Entrou no handleEnter !!!');
    // console.log(event.nativeEvent.text); // Aqui está o valor do TextInput

    let codigoDeBarras = event.nativeEvent.text;

    console.log( 'código = ' + codigoDeBarras); // Aqui está o valor do TextInput

    if( codigoDeBarras == '12345678901234567890' ){
      handleSignOut();
    } else {
      buscarProduto(codigoDeBarras);
    }
    
    // Definindo o foco após um pequeno atraso para garantir que a renderização seja concluída
    const timer = setTimeout(focusOnInput, 100);
  };


  const handleInputChange = text => {
    setInputValue(text);

    let textAux = '';

    if(text != textAux){
      textAux = text;
    } else {
      buscarProduto(text);
    }



    // if (text.length === 13) {
    //   if(text === '1234567890123'){
    //     handleSignOut();
    //   } else {
    //     buscarProduto(text);
    //   }
      
    // }
  };

  const buscarProduto = async text => {

    const user = await AsyncStorage.getItem('user');

    console.log('usuário:');
    console.log(user);

    if (text.trim() !== '') {
      setIsLoading(true); // Inicia o carregamento
      // let json = await Api.buscarProduto(text);
      let json = await Api.buscarProduto(text, user);

      if (json.produto) {
        let produto = json.produto;

        console.log('produto recebido - verificar');
        console.log(produto);

        let idProduto = produto.id;
        let nomeProduto = produto.nome;
        let precoCompraProduto = produto.preco_compra;
        let precoVendaProdutoMercadinho = produto.preco_venda_produto_mercadinho;
        let percentualLucroDesejado = produto.percentual_lucro_desejado;
        let caminhoImagemProduto = BASE_API + produto.caminho_imagem_produto;

        /**
         * verificar se veio a variável de preço do mercadinho.
         * caso tenha vindo, vamos utiliza-la (precoVendaProdutoMercadinho)
         * caso não tenha vindo ou tenha vindo zerada, vamos utilizar o preço normal, 
         * cadastrado para todos os mercadinhos.
         */
        if( precoVendaProdutoMercadinho > 0 ){
          // let precoVenda = parseFloat(precoVendaProdutoMercadinho);
          console.log('preco venda produto mercadinho: ');
          console.log(parseFloat(precoVendaProdutoMercadinho));
          var precoVenda = parseFloat(precoVendaProdutoMercadinho);
        } else {
          var precoVenda =
          parseFloat(precoCompraProduto) +
          (parseFloat(precoCompraProduto) *
            parseFloat(percentualLucroDesejado)) /
            100;

        }


        console.log('preco venda:');
        console.log(precoVenda);


        const product = {
          id: Date.now() + Math.random(), // Gera um id único para o sistema
          idProduto, // idProduto vindo da API
          name: nomeProduto,
          value: precoVenda,
          image: caminhoImagemProduto,
        };

        setProductList(prevProductList => [product, ...prevProductList]);
        setTotalValue(prevTotalValue => prevTotalValue + precoVenda);
      } else {
        var mensagem = json.message;
        console.log('produto não localizado');
        alert(mensagem);
      }
      setInputValue('');
      setIsLoading(false); // Finaliza o carregamento
    }
  };

  const baixarEstoque = async productList => {
    const user = await AsyncStorage.getItem('user');

    console.log('entrou em baixar estoque...');
    console.log(productList);

    console.log('usuário:');
    console.log(user);

    setIsLoading(true); // Inicia o carregamento
    let json = await Api.baixarEstoque(productList, user);

    console.log('json no index:');
    console.log(json);

    let mensagem = json.message;

    alert(mensagem);

    // setInputValue('');
    setIsLoading(false); // Finaliza o carregamento

    // Zera a lista de produtos e o valor total
    setProductList([]);
    setTotalValue(0);
  };

  const handleDelete = (id, value) => {
    setProductList(prevProductList =>
      prevProductList.filter(item => item.id !== id),
    );
    setTotalValue(prevTotalValue => prevTotalValue - value);

    // Definindo o foco após um pequeno atraso para garantir que a renderização seja concluída
    const timer = setTimeout(focusOnInput, 100);

  };

  const handleGoToPayment = () => {
    navigation.navigate('Pagar', {totalValue, productList});
  };

  const screenWidth = Dimensions.get('window').width;

  return (
    <Container>
      <View style={{flex: 1, flexDirection: 'column'}}>
        <InputArea>
          <TextInput
            ref={inputRef} // Passando a referência para o TextInput
            style={{
              backgroundColor: '#268596',
              color: '#FFF',
              fontSize: 20,
              fontWeight: 'bold',
              textAlign: 'center',
            }}
            value={inputValue}
            // onChangeText={handleInputChange}
            // onSubmitEditing={teste}
            showSoftInputOnFocus={false} // Desabilita o teclado ao focar (somente em Android)
            onSubmitEditing={handleEnter}
            placeholder="Produto"
            keyboardType="numeric"
            maxLength={20}
            autoFocus
          />
        </InputArea>
        {/* mensagem na tela com informativo */}
        {productList.length === 0 && (
          <>
          <CenteredMessage>
            
            <MessageText>1 - Passe o código de barras dos produtos no leitor</MessageText>
            
            <MessageText>2 - Clique em Pagar</MessageText>
          </CenteredMessage>
          </>
        )}

        <View style={{flex: 1, backgroundColor: '#FFF'}}>
          <ScrollView style={{flex: 1}}>
            {productList.map((item, index) => (
              <RowContainer key={item.id} index={index}>
                <View
                  style={{
                    flexDirection: 'column',
                    width: '40%',
                    alignItems: 'center',
                  }}>
                  {item.image && (
                    <Image
                      source={{uri: item.image}}
                      style={{
                        width: '100%',
                        height: screenWidth * 0.4,
                        marginTop: 10,
                        resizeMode: 'contain',
                      }}
                    />
                  )}
                </View>
                <View
                  style={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '50%',
                    justifyContent: 'center',
                  }}>
                  <NomeProduto>{item.name}</NomeProduto>
                  <PrecoProduto>
                    <Text>R$ {item.value.toFixed(2)}</Text>
                  </PrecoProduto>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: '10%',
                    justifyContent: 'center',
                  }}>
                  <TouchableOpacity
                    onPress={() => handleDelete(item.id, item.value)}
                    style={{ 
                      width: 30,
                      height: 35,
                      backgroundColor: '#f00',
                      justifyContent: 'center', // Centraliza verticalmente
                      alignItems: 'center', // Centraliza horizontalmente
                      borderColor: '#000',
                      borderWidth: 1,
                      borderRadius: 10,
                    }}>
                    <Text 
                      style={{ 
                        fontSize: 23, // Ajuste o tamanho da fonte para caber bem no contêiner
                        color: '#000',
                        fontWeight: 'bold',
                      }}>
                      x
                    </Text>
                  </TouchableOpacity>

                </View>
              </RowContainer>
            ))}
          </ScrollView>
          

          {productList.length > 0 && (
            <>
              <View style={{padding: 10, alignItems: 'center'}}>
                <Text style={{fontSize: 30, fontWeight: 'bold', color: '#000066'}}>
                  Total: R$ {totalValue.toFixed(2)}
                </Text>
              </View>
              <View
                style={{
                  padding: 10,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>

                <BotaoPagar onPress={handleGoToPayment}>
                  <CustomButtonText>Pagar</CustomButtonText>
                </BotaoPagar>

                {/* <BotaoSair onPress={handleSignOut}>
                  <CustomButtonText>Sair</CustomButtonText>
                </BotaoSair> */}


              </View>
            </>
          )}



        </View>
      </View>
      {isLoading && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}>
          <LoadingIcon size="large" color="#FFF" />
        </View>
      )}
    </Container>
  );
};