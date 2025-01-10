package in.parcelcounter.app;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;

import in.parcelcounter.app.plugins.MyPlugin;
import in.parcelcounter.app.dwlrathod.plugins.SmsRetrieverPlugin;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(MyPlugin.class);
        registerPlugin(SmsRetrieverPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
