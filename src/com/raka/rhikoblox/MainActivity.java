package com.raka.rhikoblox;
import android.app.Activity;
import android.os.Bundle;
import android.webkit.WebView;
public class MainActivity extends Activity {
    private WebView wv;
    @Override public void onCreate(Bundle b) {
        super.onCreate(b);
        wv = new WebView(this);
        wv.getSettings().setJavaScriptEnabled(true);
        wv.getSettings().setDomStorageEnabled(true);
        setContentView(wv);
        wv.loadUrl("file:///android_asset/index.html");
    }
    @Override public void onBackPressed() { if (wv != null && wv.canGoBack()) wv.goBack(); else super.onBackPressed(); }
}
