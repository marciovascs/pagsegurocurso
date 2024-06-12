import { NativeModules } from "react-native";

import { PlugPagPaymentData } from "./interfaces/PlugPagPaymentData";
import { PlugPagTransactionResult } from "./interfaces/PlugPagTransactionResult";

const { MakeTransaction } = NativeModules;

export class PlugPag {
  private static instance: PlugPag;
  // static TYPE_CREDITO: number
  // static TYPE_DEBITO: number
  // static TYPE_PIX: number
  // static TYPE_QRCODE: number
  // static TYPE_VOUCHER: number
  // static INSTALLMENT_TYPE_A_VISTA: number
  // static INSTALLMENT_TYPE_PARC_VENDEDOR: number

  static RET_OK: number;
  static REQUEST_CODE_AUTHENTICATION: number;
  static TYPE_CREDITO: number;
  static TYPE_DEBITO: number;
  static TYPE_VOUCHER: number;
  static TYPE_QRCODE: number;
  static TYPE_PIX: number;
  static INSTALLMENT_TYPE_A_VISTA: number;
  static INSTALLMENT_TYPE_PARC_VENDEDOR: number;
  static ERROR_REQUIREMENTS_MISSING_PERMISSIONS: number;
  static ERROR_REQUIREMENTS_ROOT_PERMISSION: number;

  private constructor() {}

  /**
   * Código utilizado para indicar sucesso nas operações.
   */
  readonly RET_OK: number = 0;

  /**
   * Tipo de pagamento: crédito.
   */
  readonly TYPE_CREDITO: number = 1;

  /**
   * Tipo de pagamento: débito.
   */
  readonly TYPE_DEBITO: number = 2;

  /**
   * Tipo de pagamento: voucher (vale refeição).
   */
  readonly TYPE_VOUCHER: number = 3;

  /**
   * Tipo de pagamento: qrcode elo.
   */
  readonly TYPE_QRCODE: number = 4;

  /**
   * Tipo de pagamento: qrcode pix.
   */
  readonly TYPE_PIX: number = 5;

  /**
   * Forma de parcelamento: à vista.
   */
  readonly INSTALLMENT_TYPE_A_VISTA: number = 1;

  /**
   * Forma de parcelamento: parcelamento vendedor.
   */
  readonly INSTALLMENT_TYPE_PARC_VENDEDOR: number = 2;

  /**
   * Singleton PlugPag
   * @returns Uma instância do PlugPlag
   */
  public static getInstance(): PlugPag {
    if (!PlugPag.instance) {
      PlugPag.instance = new PlugPag();
    }
    return PlugPag.instance;
  }

  /**
   * @param appName: string
   * @param appVersion: string
   * @returns Uma instância do PlugPlag
   */
  initializePlugPag(appName: string, appVersion: string): void {
    console.log(`initializePlugPag("${appName}", "${appVersion}")`);
    MakeTransaction.initializePlugPag(appName, appVersion);
  }

  /**
   * Efetua um pagamento.
   * @returns Retorna o resultado da transação.
   */
  doPayment(paymentData: PlugPagPaymentData): PlugPagTransactionResult {
    console.log('Entrou em PlugPag.ts -> doPayment...');
    const result: PlugPagTransactionResult =
      MakeTransaction.doPayment(paymentData);
    return result;
  }
}

