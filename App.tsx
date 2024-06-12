import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  Button,
  StyleSheet,
  View,
  NativeModules,
  NativeEventEmitter,
  Modal,
  Text,
  TouchableOpacity
} from "react-native";
import PlugPag from "./utils/PlugPag";

import {NavigationContainer, useFocusEffect, useNavigation, useRoute} from '@react-navigation/native';

import UserContextProvider from './src/contexts/UserContext';
import MainStack from './src/stacks/MainStack';


export type Props = {
  name: string;
  baseEnthusiasmLevel?: number;
};

const App: React.FC<Props> = ({ name, baseEnthusiasmLevel = 0 }) => {

  console.log('ok1');
  
  PlugPag.initializePlugPag("AppTeste", "1.0");
  const { MakeTransaction } = NativeModules;

  const [payment, setPayment] = useState<any>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const inputRef = useRef(null); // Referência para o TextInput


  console.log('ok2');

  // useEffect(() => {

  //   console.log('ok3');

  //   const eventEmitter = new NativeEventEmitter(NativeModules.ToastExample);
  //   let eventListener = eventEmitter.addListener("onPlugPagEvent", (event) => {
  //     setPayment(event);
  //   });

  //   // Removes the listener once unmounted
  //   return () => {
  //     eventListener.remove();
  //   };
  // }, []);


  // useEffect(() => {

  //   console.log('!!!!! *******   Entrou no useEffect do App.tsx...');
  //   console.log('payment: ');
  //   console.log(payment);
  //   console.log('fim do payment: ');
  //   console.log('verificar o retorno... ');

  //   let mensagem = payment.message;
    
  //   console.log(mensagem);

  //   if (payment?.transactionId) {

  //     console.log('Entrou no if...');

  //     console.log(payment);

  //     console.log("DEU BOM");

  //     /*  handlePaymentBack(paymentType, {
  //       transactionId: payment.transactionId,
  //       transactionCode: payment.transactionCode,
  //       terminalSerial: payment.terminalSerialNumber,
  //     }); */
  //     /*     setOpen(false); */
  //   } else if (payment?.errorCode && payment?.errorCode !== "0000") {
  //     console.log('Entrou no else...');
  //     console.log("DEU RUIM");
  //     /*  
  //     setTimeout(() => {
  //         setOpen(false); 
  //     }, 3000);
  //          setPayType(''); */
  //   } else {
  //     console.log('Nada retornado, nem bom nem ruim!');
  //     // mostrar a modal

  //     // mostrar a modal
  //     setModalMessage(mensagem);
  //     setModalVisible(true);


  
  //   }
  // }, [payment]);

  function paymentProcessPagSeguro() {

    console.log('ok - payment');

    PlugPag.doPayment({
      amount: 27800,
      installments: 1,
      userReference: "djdas",
      installmentType: PlugPag.INSTALLMENT_TYPE_A_VISTA,
      paymentType: PlugPag.TYPE_CREDITO,
    });
  }

  /*   MakeTransaction.getTerminalSerialNumber((e) =>
    console.log("getTerminalSerialNumber", e)
  );

  MakeTransaction.asyncIsAuthenticated((e) =>
    console.log("isAuthenticated", e)
  ); */

  function abort() {

    console.log('entrou no abort...');

    MakeTransaction.abort((e: any) => console.log(e));
  }

  return (
    // aqui quer dizer que os dados do usuário serão acessíveis em qualquer lugar
    <UserContextProvider>
      <NavigationContainer>
        <MainStack />
      </NavigationContainer>
    </UserContextProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  greeting: {
    fontSize: 20,
    fontWeight: "bold",
    margin: 16,
  },
});

export default App;
