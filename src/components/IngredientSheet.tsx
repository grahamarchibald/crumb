import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AXES, DEFS, SWAPS } from '../data/defs';
import { domTex, fmt, getRecipe, resolveDef } from '../domain/engine';
import { useStore } from '../store/useStore';
import { C, F, SHADOW } from '../theme/tokens';

// Signed impact meter: fill grows from the center tick, right for positive
// (axis color), left for negative (#C9BFA6). Width = min(48, |coef|·48)%.
function ImpactMeter({ name, coef, color }: { name: string; coef: number; color: string }) {
  const pos = coef >= 0;
  const pct = Math.min(48, Math.abs(coef) * 48);
  const tag = (pos ? '+ ' : '– ') + Math.round(Math.abs(coef) * 10) / 10;
  return (
    <View style={styles.impactRow}>
      <Text style={styles.impactLabel}>{name}</Text>
      <View style={styles.impactTrack}>
        <View style={styles.impactTick} />
        <View
          style={[
            styles.impactFill,
            pos ? { left: '50%', backgroundColor: color } : { right: '50%', backgroundColor: C.negFill },
            { width: `${pct}%` },
          ]}
        />
      </View>
      <Text style={[styles.impactTag, { color: pos ? color : C.negTag }]}>{tag}</Text>
    </View>
  );
}

export default function IngredientSheet() {
  const rid = useStore((s) => s.activeId)!;
  const openId = useStore((s) => s.open)!;
  const amounts = useStore((s) => s.amounts);
  const swapped = useStore((s) => s.swapped);
  const setAmt = useStore((s) => s.setAmt);
  const toggleSwap = useStore((s) => s.toggleSwap);
  const closeSheet = useStore((s) => s.closeSheet);

  const r = getRecipe(rid);
  const def = DEFS[openId];
  const d = resolveDef(rid, openId, swapped);
  const a = amounts[rid][openId];

  const strong = [...AXES].sort((x, y) => Math.abs(d.tex[y.key]) - Math.abs(d.tex[x.key]))[0];
  const tip = `More ${d.name.toLowerCase()} makes these noticeably ${
    d.tex[strong.key] >= 0 ? 'more' : 'less'
  } ${strong.name.toLowerCase()}. Every +5g adds about ${fmt(
    (d.per100.cal * 5) / 100 / r.servings
  )} cal per ${r.unit}.`;

  const swap = SWAPS[openId];
  const applied = !!swapped[rid][openId];

  let deltaChips: { label: string; good: boolean }[] = [];
  if (swap) {
    const dCal = ((swap.per100.cal - def.per100.cal) * a) / 100 / r.servings;
    const dFat = ((swap.per100.f - def.per100.f) * a) / 100 / r.servings;
    const dProt = ((swap.per100.p - def.per100.p) * a) / 100 / r.servings;
    deltaChips = [
      { label: (dCal <= 0 ? '' : '+') + fmt(dCal) + ' cal/' + r.unit, good: dCal <= 0 },
      { label: (dFat <= 0 ? '' : '+') + Math.round(dFat * 10) / 10 + 'g fat', good: dFat <= 0 },
      { label: (dProt >= 0 ? '+' : '') + Math.round(dProt * 10) / 10 + 'g protein', good: dProt >= 0 },
    ];
  }

  return (
    <>
      <Pressable style={styles.scrim} onPress={closeSheet} />
      <View style={styles.sheet}>
        <ScrollView contentContainerStyle={styles.sheetContent} showsVerticalScrollIndicator={false}>
          <View style={styles.handle} />

          <View style={styles.sheetHeader}>
            <View style={[styles.headerSwatch, { backgroundColor: d.dot }]} />
            <View style={styles.headerText}>
              <Text style={styles.headerTitle}>{d.name}</Text>
              <Text style={styles.headerSubtitle}>Adjust it, or swap for something lighter</Text>
            </View>
            <Pressable onPress={closeSheet} style={styles.closeBtn}>
              <Text style={styles.closeGlyph}>✕</Text>
            </Pressable>
          </View>

          <View style={styles.amountPill}>
            <View>
              <Text style={styles.amountLabel}>AMOUNT</Text>
              <Text style={styles.amountValue}>{a} grams</Text>
            </View>
            <View style={styles.stepperRow}>
              <Pressable onPress={() => setAmt(rid, openId, -5)} style={styles.stepMinus}>
                <Text style={styles.stepMinusGlyph}>−</Text>
              </Pressable>
              <Pressable onPress={() => setAmt(rid, openId, 5)} style={styles.stepPlus}>
                <Text style={styles.stepPlusGlyph}>+</Text>
              </Pressable>
            </View>
          </View>

          <Text style={styles.impactHeading}>THIS INGREDIENT PUSHES TEXTURE</Text>
          <View style={styles.impactList}>
            {AXES.map((ax) => (
              <ImpactMeter key={ax.key} name={ax.name} coef={d.tex[ax.key]} color={ax.color} />
            ))}
          </View>

          <Text style={styles.tip}>{tip}</Text>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerLabel}>OR SWAP IT OUT</Text>
            <View style={styles.dividerLine} />
          </View>

          {swap ? (
            <>
              <View style={styles.compareRow}>
                <View style={styles.nowCard}>
                  <Text style={styles.nowLabel}>NOW</Text>
                  <Text style={styles.nowName}>{def.name}</Text>
                </View>
                <Text style={styles.arrow}>→</Text>
                <View style={styles.swapCard}>
                  <Text style={styles.swapLabel}>SWAP TO</Text>
                  <Text style={styles.swapName}>{swap.name}</Text>
                </View>
              </View>

              <View style={styles.deltaRow}>
                {deltaChips.map((c) => (
                  <View
                    key={c.label}
                    style={[styles.deltaChip, { backgroundColor: c.good ? C.positivePanel : C.negativePanel }]}
                  >
                    <Text style={[styles.deltaChipText, { color: c.good ? C.greenDark : C.clay }]}>
                      {c.label}
                    </Text>
                  </View>
                ))}
              </View>

              <Text style={styles.note}>{swap.note}</Text>

              <Pressable
                onPress={() => toggleSwap(rid, openId)}
                style={[styles.swapBtn, applied ? styles.swapBtnApplied : styles.swapBtnApply]}
              >
                <Text style={[styles.swapBtnText, { color: applied ? C.body2 : C.card }]}>
                  {applied ? 'Undo swap' : 'Apply swap'}
                </Text>
              </Pressable>
            </>
          ) : (
            <Text style={styles.noSwap}>
              No lighter swap — {d.name.toLowerCase()} is already a wholesome pick.
            </Text>
          )}
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  scrim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(40,45,30,0.32)',
    zIndex: 39,
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 40,
    maxHeight: '82%',
    backgroundColor: C.card,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    boxShadow: SHADOW.sheet,
  },
  sheetContent: { paddingTop: 12, paddingHorizontal: 22, paddingBottom: 40 },
  handle: {
    width: 40,
    height: 5,
    borderRadius: 99,
    backgroundColor: C.handle,
    alignSelf: 'center',
    marginBottom: 14,
  },

  sheetHeader: { flexDirection: 'row', alignItems: 'center', gap: 11, marginBottom: 4 },
  headerSwatch: { width: 26, height: 26, borderRadius: 9, boxShadow: SHADOW.insetRing },
  headerText: { flex: 1 },
  headerTitle: { fontFamily: F.serif400, fontSize: 21, color: C.ink },
  headerSubtitle: { fontFamily: F.sans600, fontSize: 12.5, color: C.muted },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: C.closeBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeGlyph: { fontSize: 17, color: C.body2 },

  amountPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: C.insetPanel,
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 20,
  },
  amountLabel: { fontFamily: F.sans800, fontSize: 11, letterSpacing: 1, color: C.muted },
  amountValue: { fontFamily: F.serif400, fontSize: 26, color: C.ink, marginTop: 2 },
  stepperRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  stepMinus: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: C.card,
    borderWidth: 1.5,
    borderColor: C.border4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepMinusGlyph: { fontFamily: F.sans600, fontSize: 26, lineHeight: 30, color: C.green },
  stepPlus: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: C.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepPlusGlyph: { fontFamily: F.sans600, fontSize: 26, lineHeight: 30, color: C.card },

  impactHeading: { fontFamily: F.sans800, fontSize: 12, letterSpacing: 1, color: C.sage, marginBottom: 12 },
  impactList: { gap: 15 },
  impactRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  impactLabel: { width: 54, fontFamily: F.sans700, fontSize: 13, color: C.heading2 },
  impactTrack: { flex: 1, height: 12, borderRadius: 99, backgroundColor: C.insetPanelAlt },
  impactTick: {
    position: 'absolute',
    left: '50%',
    top: 0,
    bottom: 0,
    width: 1.5,
    backgroundColor: C.chevron,
  },
  impactFill: { position: 'absolute', top: 0, bottom: 0, borderRadius: 99 },
  impactTag: { width: 44, textAlign: 'right', fontFamily: F.sans800, fontSize: 12 },

  tip: {
    marginTop: 20,
    fontFamily: F.sans400,
    fontSize: 13,
    lineHeight: 20,
    color: C.body2,
    backgroundColor: C.insetPanel,
    borderRadius: 14,
    paddingVertical: 13,
    paddingHorizontal: 15,
  },

  divider: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 24, marginBottom: 6 },
  dividerLine: { flex: 1, height: 1, backgroundColor: C.border3 },
  dividerLabel: { fontFamily: F.sans800, fontSize: 11, letterSpacing: 1.5, color: C.muted2 },

  compareRow: { flexDirection: 'row', alignItems: 'stretch', gap: 10, marginTop: 14, marginBottom: 16 },
  nowCard: { flex: 1, backgroundColor: C.insetPanel, borderRadius: 16, paddingVertical: 13, paddingHorizontal: 14 },
  nowLabel: { fontFamily: F.sans800, fontSize: 11, letterSpacing: 0.5, color: C.muted2 },
  nowName: { fontFamily: F.sans800, fontSize: 15, color: C.body2, marginTop: 4 },
  arrow: { alignSelf: 'center', fontFamily: F.sans700, fontSize: 22, color: C.wheat },
  swapCard: {
    flex: 1,
    backgroundColor: C.positivePanel,
    borderRadius: 16,
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderWidth: 1.5,
    borderColor: C.borderGreen,
  },
  swapLabel: { fontFamily: F.sans800, fontSize: 11, letterSpacing: 0.5, color: C.green },
  swapName: { fontFamily: F.sans800, fontSize: 15, color: C.heading2, marginTop: 4 },

  deltaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  deltaChip: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 99 },
  deltaChipText: { fontFamily: F.sans800, fontSize: 12 },

  note: {
    fontFamily: F.sans400,
    fontSize: 13,
    lineHeight: 20,
    color: C.body2,
    backgroundColor: C.insetPanel,
    borderRadius: 14,
    paddingVertical: 13,
    paddingHorizontal: 15,
    marginBottom: 18,
  },

  swapBtn: { alignItems: 'center', padding: 15, borderRadius: 16 },
  swapBtnApply: { backgroundColor: C.green },
  swapBtnApplied: { backgroundColor: C.card, borderWidth: 1.5, borderColor: C.border4 },
  swapBtnText: { fontFamily: F.sans800, fontSize: 15 },

  noSwap: {
    fontFamily: F.sans600,
    fontSize: 13,
    lineHeight: 19.5,
    color: C.sage,
    backgroundColor: C.insetPanel,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginTop: 12,
  },
});
