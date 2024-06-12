import React, { useEffect, useState } from "react";
import {
  Button,
  StyleSheet,
  View,
  NativeModules,
  NativeEventEmitter,
} from "react-native";
import PlugPag from "./utils/PlugPag";

export type Props = {
  name: string;
  baseEnthusiasmLevel?: number;
};

const App: React.FC<Props> = ({ name, baseEnthusiasmLevel = 0 }) => {

  console.log('ok1');
  
  PlugPag.initializePlugPag("AppTeste", "1.0");
  const { MakeTransaction } = NativeModules;

  const [payment, setPayment] = useState<any>({});

  console.log('ok2');

  useEffect(() => {

    console.log('ok3');

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

    console.log('ok4');

    console.log(payment);
    if (payment?.transactionId) {

      console.log('ok5');

      console.log(payment);

      console.log("DEU BOM");

      /*  handlePaymentBack(paymentType, {
        transactionId: payment.transactionId,
        transactionCode: payment.transactionCode,
        terminalSerial: payment.terminalSerialNumber,
      }); */
      /*     setOpen(false); */
    } else if (payment?.errorCode && payment?.errorCode !== "0000") {
      console.log("DEU RUIM");
      /*  
      setTimeout(() => {
          setOpen(false); 
      }, 3000);
           setPayType(''); */
    }
  }, [payment]);

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
    <View style={styles.container}>
      <View>
        <Button
          title="Pagar"
          accessibilityLabel="increment"
          onPress={paymentProcessPagSeguro}
          color="blue"
        />

        <Button
          title="Abortar"
          accessibilityLabel="increment"
          onPress={abort}
          color="blue"
        />
      </View>
    </View>
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
