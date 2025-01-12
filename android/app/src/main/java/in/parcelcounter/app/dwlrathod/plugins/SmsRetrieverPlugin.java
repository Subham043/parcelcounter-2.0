package in.parcelcounter.app.dwlrathod.plugins;

import android.app.PendingIntent;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.IntentSender;

import com.getcapacitor.JSObject;
import com.getcapacitor.NativePlugin;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;

import com.google.android.gms.auth.api.phone.SmsRetriever;
import com.google.android.gms.auth.api.phone.SmsRetrieverClient;
import com.google.android.gms.tasks.Task;

import static in.parcelcounter.app.dwlrathod.plugins.SMSReceiver.ERROR_KEY;
import static in.parcelcounter.app.dwlrathod.plugins.SMSReceiver.MESSAGE_KEY;
import static in.parcelcounter.app.dwlrathod.plugins.SmsRetrieverPlugin.REQUEST_PHONE_NUMBER_REQUEST_CODE;

@CapacitorPlugin(name = "SmsRetrieverPlugin", requestCodes = REQUEST_PHONE_NUMBER_REQUEST_CODE)
public class SmsRetrieverPlugin extends Plugin implements
        SMSReceiver.OTPReceiveListener {

    public static final int REQUEST_PHONE_NUMBER_REQUEST_CODE = 23;

    @PluginMethod
    public void getAppSignature(PluginCall call) {
        AppSignatureHelper signatureHelper = new AppSignatureHelper(getContext());
        JSObject ret = new JSObject();
        ret.put("signature", signatureHelper.getAppSignatures().get(0));
        call.resolve(ret);
    }

    private SMSReceiver smsReceiver;

    @PluginMethod
    public void startSmsReceiver(PluginCall call) {

        if (!GooglePlayServicesHelper.isAvailable(getContext())) {
            call.error(GooglePlayServicesHelper.UNAVAILABLE_ERROR_MESSAGE);
            return;
        }

        if (!GooglePlayServicesHelper.hasSupportedVersion(getContext())) {
            call.error(GooglePlayServicesHelper.UNSUPPORTED_VERSION_ERROR_MESSAGE);
            return;
        }

        saveCall(call);

        // Get an instance of SmsRetrieverClient, used to start listening for a matching
        // SMS message.
        SmsRetrieverClient client = SmsRetriever.getClient(getContext());

        // Starts SmsRetriever, which waits for ONE matching SMS message until timeout
        // (5 minutes). The matching SMS message will be sent via a Broadcast Intent with
        // action SmsRetriever#SMS_RETRIEVED_ACTION.
        Task<Void> task = client.startSmsRetriever();


        // Listen for success/failure of the start Task. If in a background thread, this
        // can be made blocking using Tasks.await(task, [timeout]);

        task.addOnSuccessListener(aVoid -> {
            // Successfully started retriever, expect broadcast intent
            PluginCall savedCall = getSavedCall();
            final boolean registered = registerReceiver();
            JSObject info = new JSObject();
            info.put("isRegistered", registered);
            savedCall.resolve(info);
        });

        task.addOnFailureListener(e -> {
            // Failed to start retriever, inspect Exception for more details
            PluginCall savedCall = getSavedCall();
            savedCall.error(e.getLocalizedMessage());
        });
    }

    private boolean registerReceiver() {

        smsReceiver = new SMSReceiver();
        smsReceiver.setOTPListener(this);

        IntentFilter intentFilter = new IntentFilter();
        intentFilter.addAction(SmsRetriever.SMS_RETRIEVED_ACTION);

        try {
            // Registers receiver to listen for SMS
            getContext().registerReceiver(smsReceiver, intentFilter);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }


    private void unregisterReceiver() {
        if (smsReceiver == null) {
            return;
        }

        try {
            getContext().unregisterReceiver(smsReceiver);
            smsReceiver = null;
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @PluginMethod
    public void removeSmsReceiver(PluginCall call) {
        unregisterReceiver();
        call.resolve();
    }

    @Override
    protected void handleOnDestroy() {
        super.handleOnDestroy();
        unregisterReceiver();
    }

    @Override
    public void onOTPReceived(final String message) {
        JSObject ret = new JSObject();
        ret.put(MESSAGE_KEY, message);
        notifyListeners("onSmsReceive", ret);
    }

    @Override
    public void onOTPReceivedError(final String error) {
        JSObject ret = new JSObject();
        ret.put(ERROR_KEY, error);
        notifyListeners("onSmsReceive", ret);
    }
}
