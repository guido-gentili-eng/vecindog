import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Linking, Platform } from 'react-native';
import { router } from 'expo-router';
import { getAdForSlot, type Ad, type AdVariant } from '@/lib/ads';
import { Colors } from '@/constants/colors';
import { useLanguage } from '@/contexts/LanguageContext';

function track(adId: string, event_type: string) {
  fetch('https://www.mivecindog.com.ar/api/comercio-stats', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ad_id: adId, event_type }),
  }).catch(() => {});
}

function openAd(ad: Ad) {
  track(ad.id, 'click_link');
  if (ad.variant === 'comercio') router.push(`/comercio/${ad.id}` as any);
  else Linking.openURL(ad.href);
}

export default function AdSlot({ variant }: { variant: AdVariant }) {
  const { t } = useLanguage();
  const [ad, setAd] = useState<Ad | null | undefined>(undefined);
  const tracked = useRef(false);

  useEffect(() => {
    // Guideline 3.1.1: en iOS la app no debe mostrar contenido pago
    // (anuncios/comercios de Red Vecindog) comprado fuera de la app sin IAP.
    // No se pide ni se renderiza nada de /ads en iOS, ni siquiera el house ad.
    if (Platform.OS === 'ios') return;
    getAdForSlot(variant).then(setAd).catch(() => setAd(null));
  }, [variant]);

  useEffect(() => {
    if (ad && !tracked.current) { tracked.current = true; track(ad.id, 'view'); }
  }, [ad]);

  if (Platform.OS === 'ios') return null;

  if (ad === undefined) return null;

  if (!ad) {
    // House ad — auto-promo de Vecindog hacia /publicitate (solo Android, en iOS este componente ya retornó null)
    return (
      <TouchableOpacity
        style={styles.houseAd}
        onPress={() => router.push('/publicitate' as any)}
      >
        <Text style={styles.adBadge}>{t.adPublicidad}</Text>
        <Text style={styles.houseAdTitle}>{t.adHouseTitle}</Text>
        <Text style={styles.houseAdSub}>{t.adHouseSub}</Text>
      </TouchableOpacity>
    );
  }

  if (variant === 'leaderboard') {
    return (
      <TouchableOpacity style={styles.leaderboard} onPress={() => openAd(ad)}>
        <Text style={styles.adBadgeLight}>{t.adPublicidad}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          {ad.imagen_logo_url || ad.imagen_url ? (
            <Image source={{ uri: ad.imagen_logo_url ?? ad.imagen_url ?? '' }} style={styles.leaderboardImg} />
          ) : (
            <View style={[styles.leaderboardImg, { alignItems: 'center', justifyContent: 'center' }]}><Text style={{ fontSize: 20 }}>🐾</Text></View>
          )}
          <View style={{ flex: 1 }}>
            <Text style={styles.leaderboardTitulo}>{ad.titulo}</Text>
            {!!ad.subtitulo && <Text style={styles.leaderboardSub}>{ad.subtitulo}</Text>}
          </View>
          <Text style={styles.leaderboardCta}>{ad.cta || t.adVerMas} →</Text>
        </View>
      </TouchableOpacity>
    );
  }

  if (variant === 'sidebar') {
    return (
      <TouchableOpacity style={styles.sidebar} onPress={() => openAd(ad)}>
        <Text style={styles.adBadge}>{t.adPublicidad}</Text>
        <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', marginTop: 6 }}>
          {ad.imagen_logo_url || ad.imagen_url ? (
            <Image source={{ uri: ad.imagen_logo_url ?? ad.imagen_url ?? '' }} style={styles.sidebarImg} />
          ) : (
            <View style={[styles.sidebarImg, { alignItems: 'center', justifyContent: 'center' }]}><Text style={{ fontSize: 18 }}>🐾</Text></View>
          )}
          <View style={{ flex: 1 }}>
            <Text style={styles.sidebarTitulo}>{ad.titulo}</Text>
            {!!ad.subtitulo && <Text style={styles.sidebarSub} numberOfLines={1}>{ad.subtitulo}</Text>}
          </View>
        </View>
        <Text style={styles.sidebarCta}>{ad.cta || t.adVerMas} →</Text>
      </TouchableOpacity>
    );
  }

  // card
  return (
    <TouchableOpacity style={styles.card} onPress={() => openAd(ad)}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={styles.adBadge}>{t.adPublicidad}</Text>
      </View>
      {ad.imagen_url ? <Image source={{ uri: ad.imagen_url }} style={styles.cardImg} /> : (
        <View style={[styles.cardImg, { alignItems: 'center', justifyContent: 'center' }]}><Text style={{ fontSize: 24 }}>🐾</Text></View>
      )}
      <Text style={styles.cardTitulo}>{ad.titulo}</Text>
      {!!ad.subtitulo && <Text style={styles.cardSub} numberOfLines={1}>{ad.subtitulo}</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  adBadge: { fontSize: 9, fontWeight: '800', color: Colors.inkMuted, textTransform: 'uppercase', letterSpacing: 0.5 },
  adBadgeLight: { fontSize: 9, fontWeight: '800', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 },
  houseAd: { backgroundColor: Colors.white, borderRadius: 18, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: Colors.border },
  houseAdTitle: { fontSize: 14, fontWeight: '800', color: Colors.ink, marginTop: 4 },
  houseAdSub: { fontSize: 12, color: Colors.inkMuted, marginTop: 4 },
  leaderboard: { backgroundColor: Colors.primary, borderRadius: 20, padding: 16, marginBottom: 20 },
  leaderboardImg: { width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)' },
  leaderboardTitulo: { fontSize: 14, fontWeight: '800', color: Colors.white },
  leaderboardSub: { fontSize: 11, color: 'rgba(255,255,255,0.8)', marginTop: 1 },
  leaderboardCta: { fontSize: 11, fontWeight: '800', color: Colors.primary, backgroundColor: Colors.white, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 4, overflow: 'hidden' },
  sidebar: { backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.primary + '30', borderRadius: 16, padding: 12, marginTop: 16 },
  sidebarImg: { width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.cream },
  sidebarTitulo: { fontSize: 13, fontWeight: '800', color: Colors.ink },
  sidebarSub: { fontSize: 11, color: Colors.inkMuted, marginTop: 1 },
  sidebarCta: { fontSize: 11, fontWeight: '800', color: Colors.primary, marginTop: 8, textAlign: 'right' },
  card: { backgroundColor: Colors.white, borderRadius: 18, padding: 10, borderWidth: 1, borderColor: Colors.primary + '20' },
  cardImg: { width: '100%', height: 90, borderRadius: 12, backgroundColor: Colors.cream, marginTop: 4 },
  cardTitulo: { fontSize: 12, fontWeight: '800', color: Colors.ink, marginTop: 6 },
  cardSub: { fontSize: 10, color: Colors.inkMuted, marginTop: 1 },
});
