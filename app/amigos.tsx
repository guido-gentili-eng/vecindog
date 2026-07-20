import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  ActivityIndicator, FlatList, Image,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import {
  buscarPerrosPorNombre, listarMisAmistades, enviarSolicitud,
  aceptarSolicitud, rechazarEliminarAmistad, type Amistad, type ResultadoBusquedaPerro,
} from '@/lib/amistades';
import { Colors } from '@/constants/colors';

type Perfil = { nombre: string | null; apellido: string | null; foto_url: string | null; ciudad: string | null };

function Avatar({ nombre, fotoUrl }: { nombre?: string | null; fotoUrl?: string | null }) {
  if (fotoUrl) return <Image source={{ uri: fotoUrl }} style={styles.avatar} />;
  return (
    <View style={styles.avatarFallback}>
      <Text style={styles.avatarFallbackText}>{(nombre?.[0] ?? '?').toUpperCase()}</Text>
    </View>
  );
}

export default function AmigosScreen() {
  const { user, profile } = useAuth();
  const [tab, setTab] = useState<'amigos' | 'buscar'>('amigos');
  const [query, setQuery] = useState('');
  const [resultados, setResultados] = useState<ResultadoBusquedaPerro[]>([]);
  const [buscando, setBuscando] = useState(false);
  const [amistades, setAmistades] = useState<Amistad[]>([]);
  const [perfilesMap, setPerfilesMap] = useState<Record<string, Perfil>>({});
  const [accionando, setAccionando] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function cargarAmistades() {
    if (!user) return;
    const amis = await listarMisAmistades(user.id);
    setAmistades(amis);
    const ids = amis.map((a) => (a.solicitante_id === user.id ? a.receptor_id : a.solicitante_id));
    setCargando(false);
    if (!ids.length) return;
    const { data } = await supabase.from('profiles_public').select('id, nombre, apellido, foto_url, ciudad').in('id', ids);
    const map: Record<string, Perfil> = {};
    for (const p of data ?? []) map[p.id] = p as Perfil;
    setPerfilesMap(map);
  }

  useEffect(() => { cargarAmistades(); }, [user]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim()) { setResultados([]); return; }
    debounceRef.current = setTimeout(async () => {
      setBuscando(true);
      try {
        const res = await buscarPerrosPorNombre(query);
        setResultados(res.filter((r) => r.owner_id !== user?.id));
      } finally {
        setBuscando(false);
      }
    }, 400);
  }, [query]);

  const amigoIds = new Set(
    amistades.filter((a) => a.estado === 'aceptada').map((a) => (a.solicitante_id === user?.id ? a.receptor_id : a.solicitante_id)),
  );
  const pendientesEnviadas = new Set(
    amistades.filter((a) => a.estado === 'pendiente' && a.solicitante_id === user?.id).map((a) => a.receptor_id),
  );
  const pendientesRecibidas = amistades.filter((a) => a.estado === 'pendiente' && a.receptor_id === user?.id);
  const amigosAceptados = amistades.filter((a) => a.estado === 'aceptada');

  async function handleEnviar(ownerId: string) {
    if (!user) return;
    setAccionando(ownerId);
    try {
      await enviarSolicitud(user.id, ownerId, profile?.nombre ?? 'Alguien');
      await cargarAmistades();
    } finally {
      setAccionando(null);
    }
  }

  async function handleAceptar(amistadId: string, solicitanteId: string) {
    setAccionando(amistadId);
    try {
      await aceptarSolicitud(amistadId);
      await supabase.from('notifications').insert({
        user_id: solicitanteId, post_id: null, tipo: 'amistad_aceptada',
        mensaje: `${profile?.nombre ?? 'Tu vecino'} aceptó tu solicitud de amistad 🐾`,
        leida: false,
      });
      await cargarAmistades();
    } finally {
      setAccionando(null);
    }
  }

  async function handleEliminar(amistadId: string) {
    setAccionando(amistadId);
    try {
      await rechazarEliminarAmistad(amistadId);
      setAmistades((prev) => prev.filter((a) => a.id !== amistadId));
    } finally {
      setAccionando(null);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Text style={styles.back}>← Volver</Text></TouchableOpacity>
        <Text style={styles.title}>👥 Amigos {amigosAceptados.length > 0 ? `(${amigosAceptados.length})` : ''}</Text>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity style={[styles.tab, tab === 'amigos' && styles.tabActive]} onPress={() => setTab('amigos')}>
          <Text style={[styles.tabText, tab === 'amigos' && styles.tabTextActive]}>Mis amigos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, tab === 'buscar' && styles.tabActive]} onPress={() => setTab('buscar')}>
          <Text style={[styles.tabText, tab === 'buscar' && styles.tabTextActive]}>Buscar perro</Text>
        </TouchableOpacity>
      </View>

      {cargando ? (
        <ActivityIndicator color={Colors.primary} style={{ marginTop: 40 }} size="large" />
      ) : tab === 'amigos' ? (
        <FlatList
          contentContainerStyle={styles.list}
          data={[]}
          renderItem={null}
          ListHeaderComponent={
            <View style={{ gap: 16 }}>
              {pendientesRecibidas.length > 0 && (
                <View style={{ gap: 8 }}>
                  <Text style={styles.sectionLabel}>Solicitudes recibidas ({pendientesRecibidas.length})</Text>
                  {pendientesRecibidas.map((a) => {
                    const p = perfilesMap[a.solicitante_id];
                    return (
                      <View key={a.id} style={styles.rowCard}>
                        <Avatar nombre={p?.nombre} fotoUrl={p?.foto_url} />
                        <View style={{ flex: 1, minWidth: 0 }}>
                          <Text style={styles.nombre}>{p?.nombre ?? 'Usuario'} {p?.apellido ?? ''}</Text>
                          {!!p?.ciudad && <Text style={styles.sub}>{p.ciudad}</Text>}
                        </View>
                        <View style={{ flexDirection: 'row', gap: 6 }}>
                          <TouchableOpacity
                            style={styles.acceptBtn}
                            disabled={accionando === a.id}
                            onPress={() => handleAceptar(a.id, a.solicitante_id)}
                          >
                            {accionando === a.id ? <ActivityIndicator size="small" color={Colors.good} /> : <Text style={styles.acceptBtnText}>✓ Aceptar</Text>}
                          </TouchableOpacity>
                          <TouchableOpacity style={styles.rejectBtn} disabled={accionando === a.id} onPress={() => handleEliminar(a.id)}>
                            <Text style={styles.rejectBtnText}>✕</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    );
                  })}
                </View>
              )}

              {amigosAceptados.length > 0 ? (
                <View style={{ gap: 8 }}>
                  <Text style={styles.sectionLabel}>Amigos ({amigosAceptados.length})</Text>
                  {amigosAceptados.map((a) => {
                    const friendId = a.solicitante_id === user?.id ? a.receptor_id : a.solicitante_id;
                    const p = perfilesMap[friendId];
                    return (
                      <View key={a.id} style={styles.rowCard}>
                        <Avatar nombre={p?.nombre} fotoUrl={p?.foto_url} />
                        <View style={{ flex: 1, minWidth: 0 }}>
                          <Text style={styles.nombre}>{p?.nombre ?? 'Usuario'} {p?.apellido ?? ''}</Text>
                          {!!p?.ciudad && <Text style={styles.sub}>{p.ciudad}</Text>}
                        </View>
                        <TouchableOpacity disabled={accionando === a.id} onPress={() => handleEliminar(a.id)}>
                          <Text style={styles.unfriend}>🗑️</Text>
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </View>
              ) : pendientesRecibidas.length === 0 ? (
                <View style={styles.empty}>
                  <Text style={{ fontSize: 48 }}>👥</Text>
                  <Text style={styles.emptyTitle}>Todavía no tenés amigos</Text>
                  <Text style={styles.emptySub}>Buscá el nombre del perro de tu vecino y mandale una solicitud.</Text>
                  <TouchableOpacity style={styles.emptyBtn} onPress={() => setTab('buscar')}>
                    <Text style={styles.emptyBtnText}>Buscar perro</Text>
                  </TouchableOpacity>
                </View>
              ) : null}
            </View>
          }
        />
      ) : (
        <View style={{ flex: 1 }}>
          <View style={styles.searchWrap}>
            <TextInput
              style={styles.search}
              placeholder="🔍  Nombre del perro o dueño…"
              placeholderTextColor={Colors.inkMuted}
              value={query}
              onChangeText={setQuery}
              autoFocus
            />
            {buscando && <ActivityIndicator size="small" color={Colors.inkMuted} style={styles.searchSpinner} />}
          </View>

          <FlatList
            contentContainerStyle={styles.list}
            data={resultados}
            keyExtractor={(item) => item.perro_id}
            ListEmptyComponent={
              query.trim().length > 0 && !buscando ? (
                <Text style={styles.emptySearch}>No encontramos ningún perro con ese nombre.</Text>
              ) : !query.trim() ? (
                <View style={styles.empty}>
                  <Text style={{ fontSize: 40 }}>🔍</Text>
                  <Text style={styles.emptySub}>Escribí el nombre del perro de tu vecino para buscarlo.</Text>
                </View>
              ) : null
            }
            renderItem={({ item: r }) => {
              const yaAmigo = amigoIds.has(r.owner_id);
              const pendiente = pendientesEnviadas.has(r.owner_id);
              return (
                <View style={styles.rowCard}>
                  {r.foto_url ? <Image source={{ uri: r.foto_url }} style={styles.dogAvatar} /> : (
                    <View style={styles.dogAvatarFallback}><Text style={{ fontSize: 20 }}>🐶</Text></View>
                  )}
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Text style={styles.nombre}>{r.nombre}</Text>
                    <Text style={styles.sub} numberOfLines={1}>
                      de {r.owner_nombre ?? 'Usuario'}{r.raza ? ` · ${r.raza}` : ''}{r.owner_ciudad ? ` · ${r.owner_ciudad}` : ''}
                    </Text>
                  </View>
                  {yaAmigo ? (
                    <View style={styles.badgeGood}><Text style={styles.badgeGoodText}>✓ Amigos</Text></View>
                  ) : pendiente ? (
                    <View style={styles.badgeMuted}><Text style={styles.badgeMutedText}>⏳ Pendiente</Text></View>
                  ) : (
                    <TouchableOpacity style={styles.addFriendBtn} disabled={accionando === r.owner_id} onPress={() => handleEnviar(r.owner_id)}>
                      {accionando === r.owner_id ? <ActivityIndicator size="small" color={Colors.primary} /> : <Text style={styles.addFriendBtnText}>+ Agregar</Text>}
                    </TouchableOpacity>
                  )}
                </View>
              );
            }}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header:    { backgroundColor: Colors.white, paddingHorizontal: 20, paddingTop: 56, paddingBottom: 12, gap: 8 },
  back:      { fontSize: 14, fontWeight: '700', color: Colors.primary },
  title:     { fontSize: 22, fontWeight: '900', color: Colors.ink },
  tabs:      { flexDirection: 'row', backgroundColor: Colors.white, paddingHorizontal: 20, gap: 20, borderBottomWidth: 1, borderBottomColor: Colors.border },
  tab:       { paddingBottom: 10 },
  tabActive: { borderBottomWidth: 2, borderBottomColor: Colors.primary },
  tabText:   { fontSize: 14, fontWeight: '700', color: Colors.inkMuted },
  tabTextActive: { color: Colors.primary },
  list:      { padding: 16 },
  sectionLabel: { fontSize: 11, fontWeight: '800', color: Colors.inkMuted, textTransform: 'uppercase', letterSpacing: 0.5 },
  rowCard:   { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: Colors.white, borderRadius: 16, padding: 12, marginBottom: 8 },
  avatar:    { width: 40, height: 40, borderRadius: 20 },
  avatarFallback: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.primary + '1a', alignItems: 'center', justifyContent: 'center' },
  avatarFallbackText: { fontSize: 15, fontWeight: '800', color: Colors.primary },
  dogAvatar: { width: 44, height: 44, borderRadius: 12 },
  dogAvatarFallback: { width: 44, height: 44, borderRadius: 12, backgroundColor: Colors.cream, alignItems: 'center', justifyContent: 'center' },
  nombre:    { fontSize: 14, fontWeight: '700', color: Colors.ink },
  sub:       { fontSize: 12, color: Colors.inkMuted, marginTop: 1 },
  acceptBtn: { backgroundColor: Colors.good + '1a', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 7 },
  acceptBtnText: { fontSize: 12, fontWeight: '800', color: Colors.good },
  rejectBtn: { backgroundColor: Colors.cream, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 7 },
  rejectBtnText: { fontSize: 12, fontWeight: '800', color: Colors.inkMuted },
  unfriend:  { fontSize: 16 },
  empty:     { alignItems: 'center', gap: 8, marginTop: 40, paddingHorizontal: 24 },
  emptyTitle: { fontSize: 15, fontWeight: '800', color: Colors.ink },
  emptySub:  { fontSize: 13, color: Colors.inkMuted, textAlign: 'center' },
  emptySearch: { fontSize: 13, color: Colors.inkMuted, textAlign: 'center', marginTop: 24 },
  emptyBtn:  { backgroundColor: Colors.primary, borderRadius: 14, paddingHorizontal: 20, paddingVertical: 10, marginTop: 6 },
  emptyBtnText: { color: Colors.white, fontWeight: '800', fontSize: 13 },
  searchWrap: { position: 'relative', backgroundColor: Colors.white, padding: 16, paddingBottom: 8 },
  search:    { backgroundColor: Colors.cream, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, color: Colors.ink },
  searchSpinner: { position: 'absolute', right: 28, top: 28 },
  badgeGood: { backgroundColor: Colors.good + '1a', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5 },
  badgeGoodText: { fontSize: 11, fontWeight: '800', color: Colors.good },
  badgeMuted: { backgroundColor: Colors.cream, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5 },
  badgeMutedText: { fontSize: 11, fontWeight: '800', color: Colors.inkMuted },
  addFriendBtn: { backgroundColor: Colors.primary + '1a', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 },
  addFriendBtnText: { fontSize: 11, fontWeight: '800', color: Colors.primary },
});
