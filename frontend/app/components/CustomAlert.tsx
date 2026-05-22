// ─────────────────────────────────────────────────────────────────────────────
//  components/CustomAlert.tsx
//
//  A fully custom alert modal matching GeoLore's theme.
//  Supports: success, error, warning, info, confirm
//
//  USAGE — wrap your root layout with <AlertProvider> then call useAlert():
//
//    const { showAlert, showConfirm } = useAlert();
//
//    // Simple alerts
//    showAlert('success', 'Saved!', 'Your profile has been updated.');
//    showAlert('error',   'Oops!',  'Something went wrong.');
//    showAlert('warning', 'Warning', 'This action cannot be undone.');
//    showAlert('info',    'Did you know?', 'You can switch roles from Profile.');
//
//    // Confirm dialog
//    showConfirm(
//      'Delete appointment',
//      'Are you sure you want to cancel this appointment?',
//      () => handleDelete(),   // onConfirm
//      () => {},               // onCancel (optional)
//    );
// ─────────────────────────────────────────────────────────────────────────────

import React, {
  createContext, useContext, useState, useCallback, ReactNode,
} from 'react';
import {
  Modal, View, Text, TouchableOpacity, StyleSheet,
  Animated, useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// ── Types ─────────────────────────────────────────────────────────────────────
type AlertType = 'success' | 'error' | 'warning' | 'info' | 'confirm';

interface AlertConfig {
  type:        AlertType;
  title:       string;
  message:     string;
  confirmText?: string;
  cancelText?:  string;
  onConfirm?:  () => void;
  onCancel?:   () => void;
}

interface AlertContextType {
  showAlert:   (type: Exclude<AlertType, 'confirm'>, title: string, message: string) => void;
  showConfirm: (title: string, message: string, onConfirm: () => void, onCancel?: () => void, confirmText?: string, cancelText?: string) => void;
}

// ── Theme per type ────────────────────────────────────────────────────────────
const ALERT_THEME: Record<AlertType, { icon: string; color: string; bg: string; border: string }> = {
  success: { icon: 'checkmark-circle',  color: '#27AE60', bg: '#F0FFF4', border: '#27AE60' },
  error:   { icon: 'close-circle',      color: '#E74C3C', bg: '#FFF5F5', border: '#E74C3C' },
  warning: { icon: 'warning',           color: '#F5A623', bg: '#FFFDF5', border: '#F5A623' },
  info:    { icon: 'information-circle',color: '#3B8ED0', bg: '#EFF8FF', border: '#3B8ED0' },
  confirm: { icon: 'help-circle',       color: '#5C3A00', bg: '#FFF3E0', border: '#F5A623' },
};

// ── Context ───────────────────────────────────────────────────────────────────
const AlertContext = createContext<AlertContextType>({
  showAlert:   () => {},
  showConfirm: () => {},
});

// ── Provider ──────────────────────────────────────────────────────────────────
export function AlertProvider({ children }: { children: ReactNode }) {
  const [config,  setConfig]  = useState<AlertConfig | null>(null);
  const [visible, setVisible] = useState(false);

  const hide = useCallback(() => {
    setVisible(false);
    setTimeout(() => setConfig(null), 300);
  }, []);

  const showAlert = useCallback((
    type: Exclude<AlertType, 'confirm'>,
    title: string,
    message: string,
  ) => {
    setConfig({ type, title, message });
    setVisible(true);
  }, []);

  const showConfirm = useCallback((
    title:       string,
    message:     string,
    onConfirm:   () => void,
    onCancel?:   () => void,
    confirmText?: string,
    cancelText?:  string,
  ) => {
    setConfig({
      type: 'confirm',
      title,
      message,
      confirmText: confirmText ?? 'Yes',
      cancelText:  cancelText  ?? 'No',
      onConfirm,
      onCancel,
    });
    setVisible(true);
  }, []);

  const handleConfirm = () => {
    hide();
    setTimeout(() => config?.onConfirm?.(), 300);
  };

  const handleCancel = () => {
    hide();
    setTimeout(() => config?.onCancel?.(), 300);
  };

  return (
    <AlertContext.Provider value={{ showAlert, showConfirm }}>
      {children}
      {config && (
        <AlertModal
          visible={visible}
          config={config}
          onDismiss={hide}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </AlertContext.Provider>
  );
}

// ── useAlert hook ─────────────────────────────────────────────────────────────
export function useAlert(): AlertContextType {
  return useContext(AlertContext);
}

// ── Alert Modal UI ────────────────────────────────────────────────────────────
function AlertModal({
  visible,
  config,
  onDismiss,
  onConfirm,
  onCancel,
}: {
  visible:   boolean;
  config:    AlertConfig;
  onDismiss: () => void;
  onConfirm: () => void;
  onCancel:  () => void;
}) {
  const theme      = ALERT_THEME[config.type];
  const isConfirm  = config.type === 'confirm';

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onDismiss}
    >
      {/* Backdrop */}
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={isConfirm ? undefined : onDismiss}
      >
        {/* Card — stop propagation so tapping card doesn't dismiss */}
        <TouchableOpacity activeOpacity={1} onPress={() => {}}>
          <View style={[styles.card, { borderColor: theme.border, backgroundColor: theme.bg }]}>

            {/* Icon circle */}
            <View style={[styles.iconCircle, { backgroundColor: theme.color + '22' }]}>
              <Ionicons name={theme.icon as any} size={36} color={theme.color} />
            </View>

            {/* Title */}
            <Text style={[styles.title, { color: theme.color }]}>{config.title}</Text>

            {/* Message */}
            <Text style={styles.message}>{config.message}</Text>

            {/* Buttons */}
            {isConfirm ? (
              <View style={styles.btnRow}>
                <TouchableOpacity
                  style={[styles.btn, styles.cancelBtn]}
                  onPress={onCancel}
                  activeOpacity={0.8}
                >
                  <Text style={styles.cancelBtnText}>{config.cancelText ?? 'No'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.btn, styles.confirmBtn, { backgroundColor: theme.color }]}
                  onPress={onConfirm}
                  activeOpacity={0.8}
                >
                  <Text style={styles.confirmBtnText}>{config.confirmText ?? 'Yes'}</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={[styles.btn, styles.singleBtn, { backgroundColor: theme.color }]}
                onPress={onDismiss}
                activeOpacity={0.8}
              >
                <Text style={styles.confirmBtnText}>OK</Text>
              </TouchableOpacity>
            )}
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  card: {
    width: '100%',
    borderRadius: 20,
    borderWidth: 1.5,
    paddingVertical: 28,
    paddingHorizontal: 24,
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  message: {
    fontSize: 14,
    color: '#6B4E2A',
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 8,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    marginTop: 4,
  },
  btn: {
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  singleBtn: {
    width: '100%',
    marginTop: 4,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#F5E6CC',
    borderWidth: 1,
    borderColor: '#E0D0B8',
  },
  confirmBtn: {
    flex: 1,
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#5C3A00',
  },
  confirmBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
});