import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { FILTERS, MACROCOL, RECIPES, THUMB } from '../data/defs';
import { fmt, macros } from '../domain/engine';
import { useStore } from '../store/useStore';
import { C, F, SHADOW } from '../theme/tokens';

function MacroChip({ value, color }: { value: string; color: string }) {
  return (
    <View style={styles.macroChip}>
      <View style={[styles.macroDot, { backgroundColor: color }]} />
      <Text style={styles.macroChipText}>{value}</Text>
    </View>
  );
}

export default function LibraryScreen() {
  const filter = useStore((s) => s.filter);
  const setFilter = useStore((s) => s.setFilter);
  const openRecipe = useStore((s) => s.openRecipe);
  const ings = useStore((s) => s.ings);
  const amounts = useStore((s) => s.amounts);
  const swapped = useStore((s) => s.swapped);

  const recipes = RECIPES.filter((r) => filter === 'All' || r.tag === filter);

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={styles.wordmark}>Crumb</Text>
          <Text style={styles.recipeCount}>{RECIPES.length} recipes</Text>
        </View>
        <Text style={styles.greeting}>Your recipes</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterStrip}
        contentContainerStyle={styles.filterRow}
      >
        {FILTERS.map((f) => {
          const active = filter === f;
          return (
            <Pressable
              key={f}
              onPress={() => setFilter(f)}
              style={[styles.chip, active ? styles.chipActive : styles.chipInactive]}
            >
              <Text style={[styles.chipText, { color: active ? C.card : C.body2 }]}>{f}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
        {recipes.map((r) => {
          const m = macros(ings[r.id], r.id, amounts, swapped);
          const th = THUMB[r.tag] ?? { bg: C.canvas, ink: C.sage };
          return (
            <Pressable key={r.id} onPress={() => openRecipe(r.id)} style={styles.card}>
              <View style={[styles.thumb, { backgroundColor: th.bg }]}>
                <Text style={[styles.thumbInitial, { color: th.ink }]}>{r.name[0]}</Text>
              </View>
              <View style={styles.info}>
                <Text style={styles.tag}>{r.tag.toUpperCase()}</Text>
                <Text style={styles.name}>{r.name}</Text>
                <View style={styles.calRow}>
                  <Text style={styles.calValue}>{fmt(m.cal / r.servings)}</Text>
                  <Text style={styles.calUnit}>cal / {r.unit}</Text>
                </View>
                <View style={styles.macroRow}>
                  <MacroChip value={fmt(m.p / r.servings) + 'g'} color={MACROCOL.p} />
                  <MacroChip value={fmt(m.c / r.servings) + 'g'} color={MACROCOL.c} />
                  <MacroChip value={fmt(m.f / r.servings) + 'g'} color={MACROCOL.f} />
                </View>
              </View>
              <Text style={styles.chevron}>›</Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.screen },
  header: { paddingTop: 58, paddingHorizontal: 22, paddingBottom: 6, backgroundColor: C.screen },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  wordmark: { fontFamily: F.serif600, fontSize: 21, color: C.green, letterSpacing: 0.5 },
  recipeCount: { fontFamily: F.sans700, fontSize: 12, color: C.sage },
  greeting: { fontFamily: F.serif500, fontSize: 29, lineHeight: 32, color: C.ink, marginTop: 10 },

  filterStrip: { flexGrow: 0 },
  filterRow: { gap: 8, paddingHorizontal: 22, paddingTop: 12, paddingBottom: 8 },
  chip: { paddingVertical: 8, paddingHorizontal: 15, borderRadius: 99, borderWidth: 1 },
  chipActive: { backgroundColor: C.green, borderColor: C.green },
  chipInactive: { backgroundColor: C.card, borderColor: C.chipBorder },
  chipText: { fontFamily: F.sans800, fontSize: 13 },

  list: { flex: 1 },
  listContent: { paddingTop: 6, paddingHorizontal: 22, paddingBottom: 40, gap: 12 },
  card: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 20,
    padding: 12,
    boxShadow: SHADOW.libraryCard,
  },
  thumb: {
    width: 76,
    height: 76,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: SHADOW.insetRingThumb,
  },
  thumbInitial: { fontFamily: F.serif400, fontSize: 32 },
  info: { flex: 1, minWidth: 0 },
  tag: { fontFamily: F.sans800, fontSize: 11, letterSpacing: 0.5, color: C.muted },
  name: { fontFamily: F.serif400, fontSize: 18, lineHeight: 21, color: C.ink, marginTop: 2, marginBottom: 6 },
  calRow: { flexDirection: 'row', alignItems: 'baseline', gap: 7 },
  calValue: { fontFamily: F.sans800, fontSize: 17, color: C.heading2 },
  calUnit: { fontFamily: F.sans600, fontSize: 11, color: C.muted },
  macroRow: { flexDirection: 'row', gap: 11, marginTop: 5 },
  macroChip: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  macroDot: { width: 7, height: 7, borderRadius: 4 },
  macroChipText: { fontFamily: F.sans700, fontSize: 11, color: C.body2 },
  chevron: { fontSize: 22, color: C.chevron },
});
