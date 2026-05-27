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
import { STANDARD_L_OPTIONS } from '@/shared/constants/trashOptions';
import { colors, spacing } from '@/shared/constants/theme';

export function TrashAmountStandardScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<PloggingStackParamList>>();
  const setTrashDraft = usePloggingSessionStore((s) => s.setTrashDraft);
  const [selected, setSelected] = useState<string | null>('4-6');

  const saveAndComplete = () => {
    if (!selected) return;
    const opt = STANDARD_L_OPTIONS.find((o) => o.value === selected);
    if (!opt) return;

    setTrashDraft({
      bagType: 'STANDARD',
      trashAmountValue: opt.value,
      trashAmountUnit: 'L',
      displayAmount: opt.label.includes('L') ? opt.label : `${opt.label}L`,
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
              label="다음"
              onPress={saveAndComplete}
              disabled={!selected}
            />
          </View>
        </TrashInputFooterRow>
      }
    >
      <View style={styles.grid}>
        {STANDARD_L_OPTIONS.map((opt) => {
          const isSelected = selected === opt.value;
          return (
            <Pressable
              key={opt.value}
              onPress={() => setSelected(opt.value)}
              style={[styles.chip, isSelected && styles.chipSelected]}
            >
              <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                {opt.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </TrashInputLayout>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'space-between',
  },
  chip: {
    width: '31%',
    minWidth: 100,
    flexGrow: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingVertical: spacing.md + 4,
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  chipSelected: {
    borderColor: colors.primary,
    borderWidth: 2,
    backgroundColor: colors.primaryLight,
  },
  chipText: { fontSize: 15, fontWeight: '600', color: colors.text },
  chipTextSelected: { color: colors.primary },
});
