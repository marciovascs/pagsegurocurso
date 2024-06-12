package com.mercadinhointeligente;

import android.Manifest;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Environment;
import android.util.Base64;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.app.ActivityCompat;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import org.jetbrains.annotations.NotNull;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import java.io.ByteArrayInputStream;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import br.com.uol.pagseguro.plugpagservice.wrapper.PlugPag;
import br.com.uol.pagseguro.plugpagservice.wrapper.PlugPagAbortResult;
import br.com.uol.pagseguro.plugpagservice.wrapper.PlugPagActivationData;
import br.com.uol.pagseguro.plugpagservice.wrapper.PlugPagAppIdentification;
import br.com.uol.pagseguro.plugpagservice.wrapper.PlugPagEventData;
import br.com.uol.pagseguro.plugpagservice.wrapper.PlugPagInitializationResult;
import br.com.uol.pagseguro.plugpagservice.wrapper.PlugPagNFCResult;
import br.com.uol.pagseguro.plugpagservice.wrapper.PlugPagNearFieldCardData;
import br.com.uol.pagseguro.plugpagservice.wrapper.PlugPagPaymentData;
import br.com.uol.pagseguro.plugpagservice.wrapper.PlugPagPrintResult;
import br.com.uol.pagseguro.plugpagservice.wrapper.PlugPagPrinterData;
import br.com.uol.pagseguro.plugpagservice.wrapper.PlugPagCustomPrinterLayout;
import br.com.uol.pagseguro.plugpagservice.wrapper.PlugPagPrinterListener;
import br.com.uol.pagseguro.plugpagservice.wrapper.PlugPagTransactionResult;
import br.com.uol.pagseguro.plugpagservice.wrapper.PlugPagVoidData;

public class MakeTransaction extends ReactContextBaseJavaModule {
    private static ReactApplicationContext reactContext;
    private static PlugPagAppIdentification appIdentification;
    private static PlugPag plugPag;

    private final String TAG = "MakeTransaction";

    MakeTransaction(ReactApplicationContext context) {
        super(context);
        reactContext = context;
    }

    @Override
    public String getName() {
        return "MakeTransaction";
    }

    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        constants.put("RET_OK", PlugPag.RET_OK);
        // constants.put("REQUEST_CODE_AUTHENTICATION",
        // PlugPag.REQUEST_CODE_AUTHENTICATION);
        constants.put("TYPE_CREDITO", PlugPag.TYPE_CREDITO);
        constants.put("TYPE_DEBITO", PlugPag.TYPE_DEBITO);
        constants.put("TYPE_VOUCHER", PlugPag.TYPE_VOUCHER);
        constants.put("TYPE_QRCODE", PlugPag.TYPE_QRCODE);
        constants.put("TYPE_PIX", PlugPag.TYPE_PIX);
        constants.put("INSTALLMENT_TYPE_A_VISTA", PlugPag.INSTALLMENT_TYPE_A_VISTA);
        constants.put("INSTALLMENT_TYPE_PARC_VENDEDOR", PlugPag.INSTALLMENT_TYPE_PARC_VENDEDOR);
        // constants.put("ERROR_REQUIREMENTS_MISSING_PERMISSIONS",
        // PlugPag.ERROR_REQUIREMENTS_MISSING_PERMISSIONS);
        // constants.put("ERROR_REQUIREMENTS_ROOT_PERMISSION",
        // PlugPag.ERROR_REQUIREMENTS_ROOT_PERMISSION);
        Log.d(TAG, "Constants:" + constants.toString());
        return constants;
    }

    // Send event to JS Listener(useEffect)
    private void sendEvent(@Nullable WritableMap params) {

        Log.d(TAG, "Entrou em sendEvent -> no MakeTransaction.java");
        Log.d(TAG, "params: ");
        Log.d(TAG, params.toString());

        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("onPlugPagEvent", params);

        Log.d(TAG, "Saindo do sendEvent -> no MakeTransaction.java");
    }

    // inicializa o plugpag
    @ReactMethod
    public void initializePlugPag(String appName, String appVersion) {

        Log.d(TAG, "Entrou em initializePlugPag -> no MakeTransaction.java");

        plugPag = new PlugPag(reactContext);
        Log.d(TAG, "Initialized:" + appName + appVersion);
    }

    // lê cartão genérico
    @ReactMethod()
    public void readNFCCard(Callback calllback) {
        // Cria a referência do PlugPag
        PlugPagNearFieldCardData dataCard = new PlugPagNearFieldCardData();
        dataCard.setStartSlot(1);
        dataCard.setEndSlot(1);

        // Lê um cartão NFC
        PlugPagNFCResult result = plugPag.readFromNFCCard(dataCard);
        calllback.invoke((result.getSlots().toString()));
    }

    // verificar se a maquininha está autenticada.
    @ReactMethod
    public void asyncIsAuthenticated(Callback callback) {
        Boolean isAuthenticated = plugPag.isAuthenticated();
        callback.invoke(isAuthenticated);
    }

    // autenticar a maquininha, quando compra uma nova.
    @ReactMethod
    public void initializeAndActivatePinPad(String activationCode, Callback successCallback, Callback errorCallback) {
        if (plugPag.isAuthenticated()) {
            errorCallback.invoke("10", "Terminal ja ativado");
            Log.d(TAG, "Terminal ja ativado");
        } else {
            PlugPagActivationData plugPagActivationData = new PlugPagActivationData(activationCode);
            PlugPagInitializationResult result = plugPag.initializeAndActivatePinpad(plugPagActivationData);

            if (result.getResult() == PlugPag.RET_OK) {
                successCallback.invoke(result.getErrorCode(), result.getErrorMessage());
            } else {
                errorCallback.invoke(result.getErrorCode(), result.getErrorMessage());
            }
        }
    }

    // fazer o pagamento
    @ReactMethod
    public void doPayment(ReadableMap options) {

        Log.d(TAG, "Entrou em doPaymente -> no MakeTransaction.java");

        plugPag.setEventListener((@NotNull PlugPagEventData plugPagEventData) -> {
            WritableMap params = Arguments.createMap();
            params.putString("eventType", "process");
            params.putInt("code", plugPagEventData.getEventCode());
            params.putString("message", plugPagEventData.getCustomMessage());
            Log.d(TAG, plugPagEventData.toString());
            sendEvent(params);
        });

        WritableMap params = Arguments.createMap();
        params.putInt("code", 1);
        params.putString("message", "INICIANDO");
        sendEvent(params);
        Log.d(TAG, "PaymentData:" + options);

        PlugPagPaymentData paymentData = new PlugPagPaymentData(
                options.getInt("paymentType"), // CREDITO, DEBITO, ETC
                options.getInt("amount"), // SÓ CENTAVOS
                options.getInt("installmentType"), // SE É PARCELADO PELO COMPRADOR OU VENDEDOR
                options.getInt("installments"), // 1 EM UMA VEZ
                options.getString("userReference"), // CÓDIGO INTERNO NOSSO
                false);// O false ou true é pra indicar se é para imprimir a via do comercio.

        // Cria a customização da dialog de impressão da via do cliente
        PlugPagCustomPrinterLayout customDialog = new PlugPagCustomPrinterLayout();
        customDialog.setTitle("Imprimir a sua via?"); // mensagem
        customDialog.setButtonBackgroundColor("#013565"); // cor do background
        customDialog.setMaxTimeShowPopup(10); // tempo em segundos.

        Thread paymentThread = new Thread(() -> {

            Log.d(TAG, "Entrou em paymentThread -> no MakeTransaction.java");

            plugPag.setPlugPagCustomPrinterLayout(customDialog);
            PlugPagTransactionResult result = plugPag.doPayment(paymentData);

            Log.d(TAG, "Result: -> em MakeTransaction.java");
            Log.d(TAG, result.toString());

            WritableMap payload = Arguments.createMap();
            payload.putInt("code", result.getResult());
            payload.putString("message", result.getMessage());
            payload.putString("cardApplication", result.getCardApplication());
            payload.putString("bin", result.getBin());
            payload.putString("availableBalance", result.getAvailableBalance());
            payload.putString("amount", result.getAmount());
            payload.putString("cardBrand", result.getCardBrand());
            payload.putString("date", result.getDate());
            payload.putString("errorCode", result.getErrorCode());
            payload.putString("extendedHolderName", result.getExtendedHolderName());
            payload.putString("holder", result.getHolder());
            payload.putString("hostNsu", result.getHostNsu());
            payload.putString("label", result.getLabel());
            payload.putString("terminalSerialNumber", result.getTerminalSerialNumber());
            payload.putString("transactionCode", result.getTransactionCode());
            payload.putString("transactionId", result.getTransactionId());
            payload.putString("eventType", "result");
            sendEvent(payload);
        });

        Log.d(TAG, "Vai startar a thread -> no MakeTransaction.java");

        paymentThread.start();
    }

    @ReactMethod
    public void getTerminalSerialNumber(Callback callback) {
        String string = Build.SERIAL;
        callback.invoke(string);
    }

    @ReactMethod
    public void abort(Callback callback) {

        Log.d(TAG, "Entrou em abort -> no MakeTransaction.java");

        PlugPagAbortResult result = plugPag.abort();
        int code = result.getResult();
        callback.invoke(code);
    }

    @ReactMethod
    public void refund(String transactionCode, String transactionId) {

        plugPag.setEventListener((@NotNull PlugPagEventData plugPagEventData) -> {
            WritableMap params = Arguments.createMap();
            params.putString("eventType", "process");
            params.putInt("code", plugPagEventData.getEventCode());
            params.putString("message", plugPagEventData.getCustomMessage());
            Log.d(TAG, plugPagEventData.toString());
            sendEvent(params);
        });

        PlugPagVoidData paymentData = new PlugPagVoidData(
                transactionCode,
                transactionId, true);

        Thread paymentThread = new Thread(() -> {
            PlugPagTransactionResult result = plugPag.voidPayment(
                    paymentData);

            WritableMap payload = Arguments.createMap();
            payload.putInt("code", result.getResult());
            payload.putString("message", result.getMessage());
            payload.putString("cardApplication", result.getCardApplication());
            payload.putString("bin", result.getBin());
            payload.putString("availableBalance", result.getAvailableBalance());
            payload.putString("amount", result.getAmount());
            payload.putString("cardBrand", result.getCardBrand());
            payload.putString("date", result.getDate());
            payload.putString("errorCode", result.getErrorCode());
            payload.putString("extendedHolderName", result.getExtendedHolderName());
            payload.putString("holder", result.getHolder());
            payload.putString("hostNsu", result.getHostNsu());
            payload.putString("label", result.getLabel());
            payload.putString("terminalSerialNumber", result.getTerminalSerialNumber());
            payload.putString("transactionCode", result.getTransactionCode());
            payload.putString("transactionId", result.getTransactionId());
            payload.putString("eventType", "result");
            sendEvent(payload);

        });
        paymentThread.start();
    }

    @ReactMethod
    public void printTicket(String file) {
        try {
            PlugPagPrinterData data = new PlugPagPrinterData(file,
                    4,
                    10 * 12);

            PlugPagPrinterListener listener = new PlugPagPrinterListener() {
                @Override
                public void onError(@NotNull PlugPagPrintResult plugPagPrintResult) {
                }

                @Override
                public void onSuccess(@NotNull PlugPagPrintResult plugPagPrintResult) {
                }
            };

            plugPag.setPrinterListener(listener);
            Log.d("PRINTER-DEBUG", data.toString());

            PlugPagPrintResult result = plugPag.printFromFile(data);
            if (result.getResult() != 0) {
                Log.d("PRINTER-ERROR", result.getErrorCode());
                Log.d("PRINTER-ERROR", result.getMessage());
            }

        } catch (Exception e) {
            Log.d("PRINTER-ERROR", e.getMessage());
        }

    }

    public static String parseBase64(String base64) {

        try {
            Pattern pattern = Pattern.compile("((?<=base64,).*\\s*)", Pattern.DOTALL | Pattern.MULTILINE);
            Matcher matcher = pattern.matcher(base64);
            if (matcher.find()) {
                return matcher.group().toString();
            } else {
                return "";
            }
        } catch (Exception e) {
            e.printStackTrace();

        }
        return "";
    }

    @ReactMethod
    public void printTicketBase64(String fileContent) {
        String[] requiredPermissions = { Manifest.permission.READ_EXTERNAL_STORAGE,
                Manifest.permission.WRITE_EXTERNAL_STORAGE };
        ArrayList<String> arrPerm = new ArrayList<String>();

        for (String perm : requiredPermissions) {
            if (ActivityCompat.checkSelfPermission(reactContext, perm) != PackageManager.PERMISSION_GRANTED)
                arrPerm.add(perm);
        }
        if (!arrPerm.isEmpty()) {
            String[] permissions = new String[arrPerm.size()];
            permissions = arrPerm.toArray(permissions);
            ActivityCompat.requestPermissions(reactContext.getCurrentActivity(), permissions, 1);
        }

        try {

            String destinationFolderParent = Environment.getExternalStorageDirectory().getAbsolutePath();
            File destinationFolder = new File(destinationFolderParent, "cache");
            if (!destinationFolder.exists())
                destinationFolder.mkdir();
            Log.d("DIRECTORY", destinationFolder.toString());
            // String attachment = parseBase64(fileContent); O DADO JA VEM SOMENTE EM BASE64
            byte[] byteArr = Base64.decode(fileContent, Base64.DEFAULT);
            File f = new File(destinationFolder, "sample1.jpg");
            f.createNewFile();
            FileOutputStream fo = new FileOutputStream(f);
            fo.write(byteArr);
            fo.close();
            Log.d("PRINTER-FILE", f.getAbsolutePath());
            PlugPagPrinterData data = new PlugPagPrinterData(f.getAbsolutePath(),
                    4,
                    10 * 12);

            PlugPagPrinterListener listener = new PlugPagPrinterListener() {
                @Override
                public void onError(@NotNull PlugPagPrintResult plugPagPrintResult) {
                }

                @Override
                public void onSuccess(@NotNull PlugPagPrintResult plugPagPrintResult) {
                }
            };

            plugPag.setPrinterListener(listener);
            Log.d("PRINTER-DEBUG", data.toString());
            PlugPagPrintResult result = plugPag.printFromFile(data);
            if (result.getResult() != 0) {
                Log.d("PRINTER-ERROR", result.getErrorCode());
                Log.d("PRINTER-ERROR", result.getMessage());
                f.delete();
            }

        } catch (Exception e) {
            Log.d("PRINTER-ERROR", e.getMessage());
        }

    }

}
