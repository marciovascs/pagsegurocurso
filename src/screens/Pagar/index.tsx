import React, { useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  NativeModules,
  NativeEventEmitter,
  Modal,
  Alert,
} from 'react-native';
import {
  Container,
  CustomButton,
  CustomButtonText,
  LoadingIcon,
  InputArea,
} from '../Home/styles'; // Importando estilos
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import Api from '../../Api';
import PlugPag from "../../../utils/PlugPag"



export type Props = {
  name: string;
  baseEnthusiasmLevel?: number;
};


type RouteParams = {
  params: {
    totalValue: number;
    productList: any[];
  };
};


const PagarScreen: React.FC<Props> = ({ name, baseEnthusiasmLevel = 0 }) => {
  console.log('entrou no index do Pagar...');
  
  PlugPag.initializePlugPag("AppTeste", "1.0");
  const { MakeTransaction } = NativeModules;

  const [payment, setPayment] = useState<any>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  
  const [cpf, setCpf] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigation = useNavigation();
  const route = useRoute<RouteProp<{ params: RouteParams }, 'params'>>();
  const { totalValue, productList } = route.params;

  useEffect(() => {
    const eventEmitter = new NativeEventEmitter(NativeModules.ToastExample);
    let eventListener = eventEmitter.addListener("onPlugPagEvent", (event) => {
      setPayment(event);
    });

    // Removes the listener once unmounted
    return () => {
      eventListener.remove();
    };
  }, []);


  useEffect(() => {

    console.log('!!!!! *******   Entrou no useEffect do index.tsx do Pagar...');
    console.log('payment: ');
    console.log(payment);
    console.log('fim do payment: ');
    console.log('verificar o retorno... ');



    // TESTE LOCAL - comentar TUDO para subir.
    // payment.message = 'PROCESSANDO';
    // payment.message = 'APROXIME, INSIRA OU PASSE O CARTÃO';
    // payment.message = 'SELECIONADO: CREDITO';
    // payment.message = 'TRANSAÇÃO AUTORIZADA';
    // payment.errorCode = 1001;
    // payment.transactionId = 11;
    // payment.message = 'RETIRE O CARTÃO';
    // FIM TESTE LOCAL - comentar para subir.


    if(payment.message) {
      let mensagem = payment.message;
      console.log('!!! Tem payment !!!');
      console.log(mensagem);

      setModalMessage(mensagem);
      setModalVisible(true);
    }

    // Verificar se a transação foi finalizada
    if (payment?.transactionId) {
      // Aqui tudo certo. Vamos enviar o usuário para a página final.

      console.log('Entrou no transaction id. Id = ' + payment.transactionId);

      console.log(payment);

      console.log("DEU BOM");

      setModalVisible(false);
      baixarEstoque(productList);
      
      navigation.navigate('Sobre', { totalValue: 0, productList: [] });

      /*  handlePaymentBack(paymentType, {
        transactionId: payment.transactionId,
        transactionCode: payment.transactionCode,
        terminalSerial: payment.terminalSerialNumber,
      }); */
      /*     setOpen(false); */




    } else if (payment?.errorCode && payment?.errorCode !== "0000") {

      // Aqui deu erro.

      console.log('Entrou no erro. Código do erro: ' + payment.errorCode);
      console.log("DEU RUIM");


      // mostrar a modal do erro
      let mensagem = 'Tente novamente. Erro: ' + payment.errorCode;
      setModalMessage(mensagem);
      
      setIsLoading(false);

      // fechar a modal
      setTimeout(() => {
        setModalVisible(false);
      }, 6000); 

        
      // setTimeout(() => {
      //     setOpen(false); 
      // }, 3000);
      //      setPayType('');
    } 
  }, [payment]);


  const paymentProcessPagSeguro = (tipoPagamento: string) => {

    console.log('**************');
    console.log('ok - payment');
    console.log('tipo: ');
    console.log(tipoPagamento);
    console.log('valor antes: ');
    console.log(totalValue);

    let valorArredondado = Math.round(totalValue * 100) / 100;
    let valorEmCentavos = Math.round(valorArredondado * 100);

    console.log('valor depois: ');
    console.log(valorEmCentavos);

    setIsLoading(true);
    // baixarEstoque(productList);


    if( tipoPagamento == 'crédito' ){
      console.log('Pagar com crédito');
      PlugPag.doPayment({
        amount: valorEmCentavos,
        installments: 1,
        userReference: "djdas",
        installmentType: PlugPag.INSTALLMENT_TYPE_A_VISTA,
        paymentType: PlugPag.TYPE_CREDITO,
      });
    } else if( tipoPagamento == 'débito' ){
      console.log('Pagar com débito');
      PlugPag.doPayment({
        amount: valorEmCentavos,
        installments: 1,
        userReference: "djdas",
        installmentType: PlugPag.INSTALLMENT_TYPE_A_VISTA,
        paymentType: PlugPag.TYPE_DEBITO,
      });
    } else if( tipoPagamento == 'pix' ){
      console.log('Pagar com pix');
      PlugPag.doPayment({
        amount: valorEmCentavos,
        installments: 1,
        userReference: "djdas",
        installmentType: PlugPag.INSTALLMENT_TYPE_A_VISTA,
        paymentType: PlugPag.TYPE_PIX,
      });
    }

    // navigation.navigate('Sobre', { totalValue: 0, productList: [] });

  }

  /*   MakeTransaction.getTerminalSerialNumber((e) =>
    console.log("getTerminalSerialNumber", e)
  );

  MakeTransaction.asyncIsAuthenticated((e) =>
    console.log("isAuthenticated", e)
  ); */

  const abort = () => {

    console.log('entrou no abort...');

    MakeTransaction.abort((e: any) => console.log(e));
  }

  const handleFinalize = () => {
    alert('Pagamento Finalizado');
    navigation.reset({
      routes: [{ name: 'Home' }],
    });
  };

  const handleBack = () => {
    navigation.goBack();
  };


  const baixarEstoque = async (productList: any[]) => {
    const user = await AsyncStorage.getItem('user');
    console.log('user:');
    console.log(user);
    setIsLoading(true);
    const json = await Api.baixarEstoque(productList, user);
    console.log('json: ');
    console.log(json);
    const mensagem = json.message;
    // alert(mensagem);
    setIsLoading(false);
    navigation.navigate('Sobre', { totalValue: 0, productList: [] });
  };

  const screenWidth = Dimensions.get('window').width;

  return (
    <Container>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>{modalMessage}</Text>

            {/* <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Fechar</Text>
            </TouchableOpacity> */}
          </View>
        </View>
      </Modal>



      <View style={styles.center}>
        <Text style={styles.totalText}>Total: R$ {totalValue.toFixed(2)}</Text>
        {/* <TextInput
          style={styles.input}
          placeholder="CPF para Nota Fiscal"
          value={cpf}
          onChangeText={setCpf}
          keyboardType="numeric"
          maxLength={11}
        /> */}
        <View style={styles.buttonContainer}>

          <CustomButton
            onPress={() => paymentProcessPagSeguro('débito')}
            style={styles.flexButton}
          >
            <CustomButtonText>Débito</CustomButtonText>
          </CustomButton>

          <CustomButton
            onPress={() => paymentProcessPagSeguro('crédito')}
            style={styles.flexButton}
          >
            <CustomButtonText>Crédito</CustomButtonText>
          </CustomButton>

          <CustomButton
            onPress={() => paymentProcessPagSeguro('pix')}
            style={styles.flexButton}
          >
            <CustomButtonText>Pix</CustomButtonText>
          </CustomButton>


        </View>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <LoadingIcon size="large" color="#FFF" />
        </View>
      )}
    </Container>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  totalText: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: Dimensions.get('window').width * 0.8,
    height: 50,
    borderColor: '#268596',
    borderWidth: 1,
    marginBottom: 20,
    borderRadius: 10,
    paddingHorizontal: 10,
    fontSize: 18,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    width: Dimensions.get('window').width * 0.8,
  },
  flexButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  backButton: {
    marginTop: 20,
  },
  backButtonText: {
    fontSize: 18,
    color: '#268596',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },

  
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: 300,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalText: {
    fontSize: 25,
    color: '#cc0000',
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: "center"
  },
  closeButton: {
    backgroundColor: "#2196F3",
    borderRadius: 10,
    padding: 10,
    elevation: 2
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  }

});

export default PagarScreen;