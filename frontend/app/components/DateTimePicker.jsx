import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';
import ScrollPicker from './ScrollPicker';

// ── Data generators ──────────────────────────────────────────────────────────
const DAYS = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));
const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];
const YEARS = Array.from({ length: 10 }, (_, i) => String(2025 + i));
const HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));
const PERIODS = ['AM', 'PM'];

// ── Date Picker ───────────────────────────────────────────────────────────────
export function DatePickerModal({ visible, onConfirm, onCancel, initialValue }) {
  const [day, setDay] = useState(initialValue?.day ?? '01');
  const [month, setMonth] = useState(initialValue?.month ?? 'Jan');
  const [year, setYear] = useState(initialValue?.year ?? '2026');

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <Text style={styles.sheetTitle}>Select Date</Text>

          <View style={styles.pickersRow}>
            {/* Day */}
            <View style={styles.pickerCol}>
              <Text style={styles.pickerLabel}>Day</Text>
              <ScrollPicker
                items={DAYS}
                selectedValue={day}
                onValueChange={setDay}
                width={64}
              />
            </View>

            <Text style={styles.separator}>/</Text>

            {/* Month */}
            <View style={styles.pickerCol}>
              <Text style={styles.pickerLabel}>Month</Text>
              <ScrollPicker
                items={MONTHS}
                selectedValue={month}
                onValueChange={setMonth}
                width={72}
              />
            </View>

            <Text style={styles.separator}>/</Text>

            {/* Year */}
            <View style={styles.pickerCol}>
              <Text style={styles.pickerLabel}>Year</Text>
              <ScrollPicker
                items={YEARS}
                selectedValue={year}
                onValueChange={setYear}
                width={80}
              />
            </View>
          </View>

          {/* Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.confirmBtn}
              onPress={() => onConfirm({ day, month, year })}
            >
              <Text style={styles.confirmBtnText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// ── Time Picker ───────────────────────────────────────────────────────────────
export function TimePickerModal({ visible, onConfirm, onCancel, initialValue, title = 'Select Time' }) {
  const [hour, setHour] = useState(initialValue?.hour ?? '12');
  const [minute, setMinute] = useState(initialValue?.minute ?? '00');
  const [period, setPeriod] = useState(initialValue?.period ?? 'AM');

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <Text style={styles.sheetTitle}>{title}</Text>

          <View style={styles.pickersRow}>
            {/* Hour */}
            <View style={styles.pickerCol}>
              <Text style={styles.pickerLabel}>Hour</Text>
              <ScrollPicker
                items={HOURS}
                selectedValue={hour}
                onValueChange={setHour}
                width={64}
              />
            </View>

            <Text style={styles.colonSeparator}>:</Text>

            {/* Minute */}
            <View style={styles.pickerCol}>
              <Text style={styles.pickerLabel}>Min</Text>
              <ScrollPicker
                items={MINUTES}
                selectedValue={minute}
                onValueChange={setMinute}
                width={64}
              />
            </View>

            {/* AM/PM */}
            <View style={styles.pickerCol}>
              <Text style={styles.pickerLabel}>AM/PM</Text>
              <ScrollPicker
                items={PERIODS}
                selectedValue={period}
                onValueChange={setPeriod}
                width={64}
              />
            </View>
          </View>

          {/* Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.confirmBtn}
              onPress={() => onConfirm({ hour, minute, period })}
            >
              <Text style={styles.confirmBtnText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FFFDF5',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
    paddingBottom: 36,
    paddingHorizontal: 24,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#3B1F00',
    textAlign: 'center',
    marginBottom: 24,
  },
  pickersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginBottom: 28,
  },
  pickerCol: {
    alignItems: 'center',
    gap: 6,
  },
  pickerLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#A08060',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  separator: {
    fontSize: 22,
    color: '#C4A882',
    fontWeight: '700',
    marginTop: 20,
    marginHorizontal: 2,
  },
  colonSeparator: {
    fontSize: 28,
    color: '#3B1F00',
    fontWeight: '800',
    marginTop: 20,
    marginHorizontal: 2,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#F5A623',
    alignItems: 'center',
  },
  cancelBtnText: {
    color: '#F5A623',
    fontSize: 14,
    fontWeight: '700',
  },
  confirmBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 10,
    backgroundColor: '#F5A623',
    alignItems: 'center',
  },
  confirmBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
});