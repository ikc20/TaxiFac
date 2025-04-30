#!/bin/bash

TARGET="node_modules/react-native-bluetooth-escpos-printer/android/src/main/java/cn/jystudio/bluetooth/RNBluetoothManagerModule.java"

if [ -f "$TARGET" ]; then
  sed -i '' 's|import android.support.v4.app.ActivityCompat;|import androidx.core.app.ActivityCompat;|g' "$TARGET"
  sed -i '' 's|import android.support.v4.content.ContextCompat;|import androidx.core.content.ContextCompat;|g' "$TARGET"
  echo " Bluetooth patch appliqué avec succès."
else
  echo " Fichier introuvable : $TARGET"
fi
