import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { PloggingStackParamList } from '@/app/navigation/types';
import {
  TrashInputFooterRow,
  TrashInputLayout,
  trashInputFooterItemStyle,
} from '@/features/plogging/components/TrashInputLayout';
import { usePloggingSessionStore } from '@/features/plogging/store/ploggingSessionStore';
import { OutlineButton, PrimaryButton } from '@/shared/components';
import { NORMAL_PERCENT_OPTIONS } from '@/shared/constants/trashOptions';
import { colors, spacing } from '@/shared/constants/theme';

export function TrashAmountNormalScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<PloggingStackParamList>>();
  const setTrashDraft = usePloggingSessionStore((s) => s.setTrashDraft);
  const [selected, setSelected] = useState<string | null>('50');

  const saveAndComplete = () => {
    if (!selected) return;
    const opt = NORMAL_PERCENT_OPTIONS.find((o) => o.value === selected);
    if (!opt) return;

    setTrashDraft({
      bagType: 'NORMAL',
      trashAmountValue: opt.value,
      trashAmountUnit: '%',
      displayAmount: opt.label,
    });
    navigation.navigate('PloggingComplete');
  };

  return (
    <TrashInputLayout
      subtitle="수거량을 선택해주세요"
      footer={
        <TrashInputFooterRow>
          <View style={trashInputFooterItemStyle}>
            <OutlineButton label="이전" onPress={() => navigation.goBack()} />
          </View>
          <View style={trashInputFooterItemStyle}>
            <PrimaryButton
              label="수거량 저장하기"
              onPress={saveAndComplete}
              disabled={!selected}
            />
          </View>
        </TrashInputFooterRow>
      }
    >
      {NORMAL_PERCENT_OPTIONS.map((opt) => {
        const isSelected = selected === opt.value;
        return (
          <Pressable
            key={opt.value}
            onPress={() => setSelected(opt.value)}
            style={[styles.row, isSelected && styles.rowSelected]}
          >
            <Text style={[styles.rowText, isSelected && styles.rowTextSelected]}>
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </TrashInputLayout>
  );
}

const styles = StyleSheet.create({
  row: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingVertical: spacing.md + 4,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  rowSelected: {
    borderColor: colors.primary,
    borderWidth: 2,
    backgroundColor: colors.primaryLight,
  },
  rowText: { fontSize: 15, fontWeight: '600', color: colors.text },
  rowTextSelected: { color: colors.primary },
});
