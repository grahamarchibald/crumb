import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import AddIngredientSheet from '../components/AddIngredientSheet';
import IngredientSheet from '../components/IngredientSheet';
import { AXES, MACROCOL } from '../data/defs';
import { domTex, fmt, getRecipe, macros, resolveDef, texture } from '../domain/engine';
import { useStore } from '../store/useStore';
import { C, F, SHADOW } from '../theme/tokens';

// Track-relative fill that animates width changes over 0.3s ease.
function TextureBar({ value, color }: { value: number; color: string }) {
  const [trackW, setTrackW] = useState(0);
  const anim = useRef(new Animated.Value(value)).current;
  useEffect(() => {
    Animated.timing(anim, {
      toValue: value,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start();
  }, [value]);
  const width = anim.interpolate({ inputRange: [0, 100], outputRange: [0, trackW] });
  return (
    <View style={styles.texTrack} onLayout={(e) => setTrackW(e.nativeEvent.layout.width)}>
      <Animated.View style={{ width, height: '100%', backgroundColor: color, borderRadius: 99 }} />
    </View>
  );
}

export default function BuilderScreen() {
  const activeId = useStore((s) => s.activeId)!;
  const ings = useStore((s) => s.ings);
  const amounts = useStore((s) => s.amounts);
  const swapped = useStore((s) => s.swapped);
  const open = useStore((s) => s.open);
  const adding = useStore((s) => s.adding);
  const back = useStore((s) => s.back);
  const openIng = useStore((s) => s.openIng);
  const openAdd = useStore((s) => s.openAdd);

  const r = getRecipe(activeId);
  const ingList = ings[activeId];
  const m = macros(ingList, activeId, amounts, swapped);
  const tex = texture(ingList, activeId, amounts, swapped);

  const pcal = m.p * 4;
  const ccal = m.c * 4;
  const fcal = m.f * 9;
  const tot = pcal + ccal + fcal || 1;

  const macroChips = [
    { label: 'PROTEIN', value: fmt(m.p / r.servings) + 'g', color: MACROCOL.p },
    { label: 'CARBS', value: fmt(m.c / r.servings) + 'g', color: MACROCOL.c },
    { label: 'FAT', value: fmt(m.f / r.servings) + 'g', color: MACROCOL.f },
  ];

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <Pressable onPress={back} style={styles.backBtn}>
              <Text style={styles.backGlyph}>‹</Text>
            </Pressable>
            <Text style={styles.wordmark}>Crumb</Text>
          </View>
          <Text style={styles.servings}>Makes {r.servings}</Text>
        </View>
        <Text style={styles.title}>{r.name}</Text>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>
        <View style={styles.macroCard}>
          <View style={styles.macroTop}>
            <View style={styles.calBlock}>
              <Text style={styles.calNumber}>{fmt(m.cal / r.servings)}</Text>
              <Text style={styles.calUnit}> cal / {r.unit}</Text>
            </View>
            <Text style={styles.calTotal}>{fmt(m.cal)} cal total</Text>
          </View>
          <View style={styles.macroBar}>
            <View style={{ width: `${(pcal / tot) * 100}%`, backgroundColor: MACROCOL.p }} />
            <View style={{ width: `${(ccal / tot) * 100}%`, backgroundColor: MACROCOL.c }} />
            <View style={{ width: `${(fcal / tot) * 100}%`, backgroundColor: MACROCOL.f }} />
          </View>
          <View style={styles.macroChipsRow}>
            {macroChips.map((c) => (
              <View key={c.label} style={styles.macroChipCol}>
                <View style={styles.macroChipLabelRow}>
                  <View style={[styles.macroDot, { backgroundColor: c.color }]} />
                  <Text style={styles.macroChipLabel}>{c.label}</Text>
                </View>
                <Text style={styles.macroChipValue}>{c.value}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.sectionRow}>
          <Text style={styles.sectionLabel}>TEXTURE PROFILE</Text>
          <Text style={styles.sectionMeta}>predicted</Text>
        </View>
        <View style={styles.texList}>
          {AXES.map((ax) => (
            <View key={ax.key} style={styles.texRow}>
              <Text style={styles.texLabel}>{ax.name}</Text>
              <TextureBar value={tex[ax.key]} color={ax.color} />
              <Text style={styles.texValue}>{tex[ax.key]}</Text>
            </View>
          ))}
        </View>

        <View style={[styles.sectionRow, { marginTop: 28, marginBottom: 10 }]}>
          <Text style={styles.sectionLabel}>INGREDIENTS</Text>
          <Text style={styles.sectionMeta}>tap to tune or swap</Text>
        </View>
        <View style={styles.ingList}>
          {ingList.map((ingId) => {
            const d = resolveDef(activeId, ingId, swapped);
            const a = amounts[activeId][ingId];
            const kcal = (d.per100.cal * a) / 100 / r.servings;
            const isOpen = open === ingId;
            return (
              <Pressable
                key={ingId}
                onPress={() => openIng(ingId)}
                style={[styles.ingRow, isOpen ? styles.ingRowOpen : styles.ingRowDefault]}
              >
                <View style={[styles.ingSwatch, { backgroundColor: d.dot }]} />
                <View style={styles.ingInfo}>
                  <Text style={styles.ingName}>{d.name}</Text>
                  <Text style={styles.ingSub}>
                    {fmt(kcal)} cal/{r.unit} · {domTex(d)}
                  </Text>
                </View>
                <Text style={styles.ingAmount}>{a}g</Text>
                <Text style={[styles.ingChevron, { color: isOpen ? C.green : C.chevron }]}>›</Text>
              </Pressable>
            );
          })}

          <Pressable onPress={openAdd} style={styles.addRow}>
            <Text style={styles.addPlus}>+</Text>
            <Text style={styles.addLabel}>Add ingredient</Text>
          </Pressable>
        </View>
      </ScrollView>

      {open != null && <IngredientSheet />}
      {adding && <AddIngredientSheet />}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.screen },
  header: { paddingTop: 58, paddingHorizontal: 22, paddingBottom: 14, backgroundColor: C.screen },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, minWidth: 0 },
  backBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.chipBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backGlyph: { fontSize: 22, lineHeight: 24, color: C.green, marginTop: -3 },
  wordmark: { fontFamily: F.serif600, fontSize: 21, color: C.green, letterSpacing: 0.5 },
  servings: { fontFamily: F.sans700, fontSize: 12, color: C.sage, letterSpacing: 0.5 },
  title: { fontFamily: F.serif500, fontSize: 27, lineHeight: 31, color: C.ink, marginTop: 8 },

  body: { flex: 1 },
  bodyContent: { paddingTop: 4, paddingHorizontal: 22, paddingBottom: 40 },

  macroCard: {
    backgroundColor: C.card,
    borderRadius: 22,
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: C.border,
    boxShadow: SHADOW.card,
  },
  macroTop: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' },
  calBlock: { flexDirection: 'row', alignItems: 'baseline' },
  calNumber: { fontFamily: F.serif500, fontSize: 38, color: C.ink },
  calUnit: { fontFamily: F.sans600, fontSize: 14, color: C.body2, marginLeft: 6 },
  calTotal: { fontFamily: F.sans700, fontSize: 12, color: C.muted },
  macroBar: {
    flexDirection: 'row',
    height: 9,
    borderRadius: 99,
    overflow: 'hidden',
    marginTop: 14,
    marginBottom: 12,
    backgroundColor: C.insetPanelAlt,
  },
  macroChipsRow: { flexDirection: 'row', gap: 10 },
  macroChipCol: { flex: 1, gap: 2 },
  macroChipLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  macroDot: { width: 8, height: 8, borderRadius: 4 },
  macroChipLabel: { fontFamily: F.sans800, fontSize: 11, letterSpacing: 0.5, color: C.sage },
  macroChipValue: { fontFamily: F.sans800, fontSize: 17, color: C.heading2 },

  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 26,
    marginBottom: 12,
    marginHorizontal: 2,
  },
  sectionLabel: { fontFamily: F.sans800, fontSize: 12, letterSpacing: 1.5, color: C.sage },
  sectionMeta: { fontFamily: F.sans700, fontSize: 12, color: C.muted2 },

  texList: { gap: 13 },
  texRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  texLabel: { width: 58, fontFamily: F.sans700, fontSize: 13, color: C.heading2 },
  texTrack: { flex: 1, height: 10, borderRadius: 99, backgroundColor: C.trackTexture, overflow: 'hidden' },
  texValue: { width: 30, textAlign: 'right', fontFamily: F.sans800, fontSize: 12, color: C.muted },

  ingList: { gap: 8 },
  ingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    paddingVertical: 13,
    paddingHorizontal: 15,
    borderRadius: 16,
    borderWidth: 1,
  },
  ingRowDefault: { backgroundColor: C.card, borderColor: C.border },
  ingRowOpen: { backgroundColor: C.positivePanel, borderColor: C.borderGreen },
  ingSwatch: { width: 22, height: 22, borderRadius: 8, boxShadow: SHADOW.insetRing },
  ingInfo: { flex: 1, minWidth: 0 },
  ingName: { fontFamily: F.sans700, fontSize: 15, color: C.ink },
  ingSub: { fontFamily: F.sans600, fontSize: 12, color: C.muted },
  ingAmount: { fontFamily: F.sans800, fontSize: 15, color: C.green },
  ingChevron: { fontSize: 22 },

  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: C.borderGreen,
    backgroundColor: C.positivePanel,
    marginTop: 4,
  },
  addPlus: { fontFamily: F.sans600, fontSize: 20, lineHeight: 22, color: C.green },
  addLabel: { fontFamily: F.sans800, fontSize: 14, color: C.greenDark },
});
