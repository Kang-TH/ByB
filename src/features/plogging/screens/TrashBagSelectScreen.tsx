import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { PloggingStackParamList } from '@/app/navigation/types';
import { TrashInputLayout } from '@/features/plogging/components/TrashInputLayout';
import { usePloggingSessionStore } from '@/features/plogging/store/ploggingSessionStore';
import { TRASH_BAG_OPTIONS } from '@/shared/constants/trashOptions';
import { PrimaryButton } from '@/shared/components';
import { colors, spacing } from '@/shared/constants/theme';
import type { TrashBagType } from '@/types/plogging';

export function TrashBagSelectScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<PloggingStackParamList>>();
  const setTrashDraft = usePloggingSessionStore((s) => s.setTrashDraft);
  const [selected, setSelected] = useState<TrashBagType | null>(null);

  const goNext = () => {
    if (!selected) return;
    if (selected === 'STANDARD') {
      navigation.navigate('TrashAmountStandard');
      return;
    }
    // 일반 봉투: 종량제(L) 수거량에 합산하지 않음
    setTrashDraft({
      bagType: 'NORMAL',
      trashAmountValue: '0',
      trashAmountUnit: 'L',
      displayAmount: '해당 없음',
    });
    navigation.navigate('PloggingComplete');
  };

  return (
    <TrashInputLayout
      subtitle="사용한 봉투를 선택해주세요"
      footer={
        <PrimaryButton label="다음" onPress={goNext} disabled={!selected} />
      }
    >
      {TRASH_BAG_OPTIONS.map((opt) => {
        const isSelected = selected === opt.type;
        return (
          <Pressable
            key={opt.type}
            onPress={() => setSelected(opt.type)}
            style={[styles.card, isSelected && styles.cardSelected]}
          >
            <View style={styles.iconWrap}>
              {opt.type === 'STANDARD' ? (
                <View style={styles.standardIcon}>
                  <Ionicons name="trash-outline" size={36} color={colors.textSecondary} />
                  <Text style={styles.standardLabel}>20L</Text>
                </View>
              ) : (
                <Ionicons name="trash-outline" size={40} color={colors.textSecondary} />
              )}
            </View>
            <Text style={styles.cardLabel}>{opt.label}</Text>
          </Pressable>
        );
      })}
    </TrashInputLayout>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingVertical: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.md,
    backgroundColor: colors.background,
  },
  cardSelected: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  iconWrap: {
    height: 72,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  standardIcon: { alignItems: 'center' },
  standardLabel: {
    marginTop: spacing.xs,
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  cardLabel: { fontSize: 16, fontWeight: '700', color: colors.text },
});
