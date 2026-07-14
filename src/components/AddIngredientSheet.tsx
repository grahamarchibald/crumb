import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { DEFS } from '../data/defs';
import { domTex } from '../domain/engine';
import { useStore } from '../store/useStore';
import { C, F, SHADOW } from '../theme/tokens';

// Picker sheet: lists every library ingredient not already in the recipe.
// Tapping one adds it (at the default amount) and opens its edit sheet.
export default function AddIngredientSheet() {
  const rid = useStore((s) => s.activeId)!;
  const ings = useStore((s) => s.ings);
  const addIngredient = useStore((s) => s.addIngredient);
  const closeAdd = useStore((s) => s.closeAdd);

  const inRecipe = new Set(ings[rid]);
  const available = Object.keys(DEFS).filter((id) => !inRecipe.has(id));

  return (
    <>
      <Pressable style={styles.scrim} onPress={closeAdd} />
      <View style={styles.sheet}>
        <View style={styles.handle} />
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.title}>Add ingredient</Text>
            <Text style={styles.subtitle}>Pick one to add to this recipe</Text>
          </View>
          <Pressable onPress={closeAdd} style={styles.closeBtn}>
            <Text style={styles.closeGlyph}>✕</Text>
          </Pressable>
        </View>

        <ScrollView style={styles.list} contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
          {available.length === 0 ? (
            <Text style={styles.empty}>Every ingredient is already in this recipe.</Text>
          ) : (
            available.map((id) => {
              const d = DEFS[id];
              return (
                <Pressable key={id} onPress={() => addIngredient(rid, id)} style={styles.row}>
                  <View style={[styles.swatch, { backgroundColor: d.dot }]} />
                  <View style={styles.rowInfo}>
                    <Text style={styles.rowName}>{d.name}</Text>
                    <Text style={styles.rowSub}>
                      {d.per100.cal} cal/100g · {domTex(d)}
                    </Text>
                  </View>
                  <Text style={styles.plus}>+</Text>
                </Pressable>
              );
            })
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
    paddingTop: 12,
    paddingBottom: 12,
  },
  handle: {
    width: 40,
    height: 5,
    borderRadius: 99,
    backgroundColor: C.handle,
    alignSelf: 'center',
    marginBottom: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    marginBottom: 8,
    paddingHorizontal: 22,
  },
  headerText: { flex: 1 },
  title: { fontFamily: F.serif400, fontSize: 21, color: C.ink },
  subtitle: { fontFamily: F.sans600, fontSize: 12.5, color: C.muted },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: C.closeBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeGlyph: { fontSize: 17, color: C.body2 },

  list: { flexGrow: 0 },
  listContent: { paddingHorizontal: 22, paddingTop: 8, paddingBottom: 28, gap: 8 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    paddingVertical: 13,
    paddingHorizontal: 15,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.card,
  },
  swatch: { width: 22, height: 22, borderRadius: 8, boxShadow: SHADOW.insetRing },
  rowInfo: { flex: 1, minWidth: 0 },
  rowName: { fontFamily: F.sans700, fontSize: 15, color: C.ink },
  rowSub: { fontFamily: F.sans600, fontSize: 12, color: C.muted },
  plus: { fontFamily: F.sans600, fontSize: 24, lineHeight: 26, color: C.green, width: 24, textAlign: 'center' },
  empty: {
    fontFamily: F.sans600,
    fontSize: 13,
    lineHeight: 19.5,
    color: C.sage,
    backgroundColor: C.insetPanel,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
});
