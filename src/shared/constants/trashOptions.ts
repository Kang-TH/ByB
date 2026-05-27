import type { TrashBagType } from '@/types/plogging';

export const STANDARD_L_OPTIONS = [
  { label: '0-2L', value: '0-2' },
  { label: '2-4L', value: '2-4' },
  { label: '4-6L', value: '4-6' },
  { label: '6-8L', value: '6-8' },
  { label: '8-10L', value: '8-10' },
  { label: '10L 이상', value: '10+' },
] as const;

export const NORMAL_PERCENT_OPTIONS = [
  { label: '조금 찼어요 (25%)', value: '25' },
  { label: '반 정도 찼어요 (50%)', value: '50' },
  { label: '많이 찼어요 (75%)', value: '75' },
  { label: '가득 찼어요 (100%)', value: '100' },
] as const;

export const TRASH_BAG_OPTIONS: { type: TrashBagType; label: string }[] = [
  { type: 'STANDARD', label: '종량제 봉투' },
  { type: 'NORMAL', label: '일반 봉투' },
];
