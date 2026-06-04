import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type AlertType = 'success' | 'error' | 'warning' | 'info' | 'confirm';

interface AlertConfig {
  type:         AlertType;
  title:        string;
  message:      string;
  confirmText?: string;
  cancelText?:  string;
  onConfirm?:   () => void;
  onCancel?:    () => void;
}

interface AlertContextType {
  showAlert:   (type: Exclude<AlertType, 'confirm'>, title: string, message: string) => void;
  showConfirm: (title: string, message: string, onConfirm: () => void, onCancel?: () => void, confirmText?: string, cancelText?: string) => void;
}

const ALERT_THEME: Record<AlertType, {
  icon:       string;
  iconColor:  string;
  iconBg:     string;
  titleColor: string;
  border:     string;
  cardBg:     string;
  confirmBg:  string;
}> = {
  success: {
    icon:       'checkmark-circle',
    iconColor:  '#3B1F00',
    iconBg:     '#F5A623',
    titleColor: '#3B1F00',
    border:     '#F5A623',
    cardBg:     '#FFFDF5',
    confirmBg:  '#F5A623',
  },
  error: {
    icon:       'close-circle',
    iconColor:  '#fff',
    iconBg:     '#3B1F00',
    titleColor: '#3B1F00',
    border:     '#3B1F00',
    cardBg:     '#FFFDF5',
    confirmBg:  '#3B1F00',
  },
  warning: {
    icon:       'warning',
    iconColor:  '#3B1F00',
    iconBg:     '#F5C070',
    titleColor: '#3B1F00',
    border:     '#F5C070',
    cardBg:     '#FFFDF5',
    confirmBg:  '#985100',
  },
  info: {
    icon:       'information-circle',
    iconColor:  '#F5A623',
    iconBg:     '#FFF3E0',
    titleColor: '#3B1F00',
    border:     '#F5A623',
    cardBg:     '#FFFDF5',
    confirmBg:  '#F5A623',
  },
  confirm: {
    icon:       'help-circle',
    iconColor:  '#F5A623',
    iconBg:     '#FFF3E0',
    titleColor: '#3B1F00',
    border:     '#F5A623',
    cardBg:     '#FFFDF5',
    confirmBg:  '#985100',
  },
};

const AlertContext = createContext<AlertContextType>({
  showAlert:   () => {},
  showConfirm: () => {},
});

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
    title:        string,
    message:      string,
    onConfirm:    () => void,
    onCancel?:    () => void,
    confirmText?: string,
    cancelText?:  string,
  ) => {
    setConfig({ type: 'confirm', title, message, confirmText, cancelText, onConfirm, onCancel });
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

export function useAlert(): AlertContextType {
  return useContext(AlertContext);
}

function AlertModal({ visible, config, onDismiss, onConfirm, onCancel }: {
  visible:   boolean;
  config:    AlertConfig;
  onDismiss: () => void;
  onConfirm: () => void;
  onCancel:  () => void;
}) {
  const theme     = ALERT_THEME[config.type];
  const isConfirm = config.type === 'confirm';

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      statusBarTranslucent
      onRequestClose={isConfirm ? undefined : onDismiss}
    >
      <View style={styles.backdrop}>
        <TouchableOpacity activeOpacity={1} onPress={() => {}} style={styles.cardWrapper}>
          <View style={[styles.card, { borderColor: theme.border, backgroundColor: theme.cardBg }]}>

            {/* Icon circle */}
            <View style={[styles.iconCircle, { backgroundColor: theme.iconBg }]}>
              <Ionicons name={theme.icon as any} size={40} color={theme.iconColor} />
            </View>

            {/* Title */}
            <Text style={[styles.title, { color: theme.titleColor }]}>{config.title}</Text>

            {/* Message */}
            <Text style={styles.message}>{config.message}</Text>

            {/* Buttons */}
            {isConfirm ? (
              <View style={styles.btnRow}>
                {/* Cancel — cream background */}
                <TouchableOpacity
                  style={[styles.btn, styles.cancelBtn]}
                  onPress={onCancel}
                  activeOpacity={0.8}
                >
                  <Text style={styles.cancelBtnText}>{config.cancelText ?? 'No'}</Text>
                </TouchableOpacity>
                {/* Confirm — uses theme confirm background */}
                <TouchableOpacity
                  style={[styles.btn, { backgroundColor: theme.confirmBg }]}
                  onPress={onConfirm}
                  activeOpacity={0.8}
                >
                  <Text style={styles.confirmBtnText}>{config.confirmText ?? 'Yes'}</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={[styles.okBtn, { backgroundColor: theme.confirmBg }]}
                onPress={onDismiss}
                activeOpacity={0.8}
              >
                <Text style={styles.okBtnText}>OK</Text>
              </TouchableOpacity>
            )}
          </View>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: '#cc6d008c', 
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  cardWrapper: {
    width: '100%',
  },
  card: {
    width: '100%',
    borderRadius: 24,
    borderWidth: 2,
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
    gap: 14,
    shadowColor: '#3B1F00',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 12,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  message: {
    fontSize: 14,
    color: '#6B4E2A',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 4,
  },

  okBtn: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  okBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.5,
  },

  btnRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    marginTop: 4,
  },
  btn: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtn: {
    backgroundColor: '#F5E6CC',
    borderWidth: 1.5,
    borderColor: '#E0D0B8',
  },
  cancelBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#5C3A00',
  },
  confirmBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
});