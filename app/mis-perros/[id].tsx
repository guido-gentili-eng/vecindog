import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Image, TouchableOpacity,
  ActivityIndicator, Alert, Linking, Share, Platform, TextInput, Modal,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '@/lib/supabase';
import {
  listarEstudios, subirArchivoEstudio, agregarEstudio, eliminarEstudio,
  type Estudio, type TipoEstudio,
} from '@/lib/estudios';
import {
  listarDesparasitaciones, agregarDesparasitacion, actualizarDesparasitacion, eliminarDesparasitacion,
  type Desparasitacion,
} from '@/lib/desparasitaciones';
import {
  listarMedicamentos, agregarMedicamento, eliminarMedicamento,
  type Medicamento,
} from '@/lib/medicamentos';
import { listarPesos, agregarPeso, eliminarPeso, type Peso } from '@/lib/pesos';
import {
  listarVisitasVet, agregarVisitaVet, eliminarVisitaVet,
  type VisitaVet,
} from '@/lib/visitasVet';
import {
  listarProcedimientos, agregarProcedimiento, eliminarProcedimiento,
  TIPOS_PROCEDIMIENTO, type Procedimiento,
} from '@/lib/procedimientos';
import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';
import { captureRef } from 'react-native-view-shot';
import { actualizarPerro, type EstadoSalud } from '@/lib/perros';
import { buscarRazas, COLORES_PERRO } from '@/lib/razas';
import { agregarVacuna, actualizarVacuna, eliminarVacuna, type Vacuna } from '@/lib/vacunas';
import { obtenerGrooming, guardarGrooming, eliminarGrooming, type Grooming, type TipoGrooming } from '@/lib/grooming';
import { listarTurnos, agregarTurno, eliminarTurno, type Turno, type TipoTurno } from '@/lib/turnos';
import {
  listarContactos, agregarContacto, eliminarContacto, type ContactoEmergencia,
} from '@/lib/contactosEmergencia';
import {
  listarFotos, subirFotoGaleria, agregarFoto, eliminarFoto, type FotoPerro,
} from '@/lib/fotosPerro';
import { useAuth, type Profile } from '@/contexts/AuthContext';
import { Colors } from '@/constants/colors';
import SeccionHistorial from '@/components/SeccionHistorial';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Translations } from '@/lib/translations';

interface Perro {
  id: string; nombre: string; raza?: string; color?: string;
  tamano?: string; sexo?: string; fecha_nac?: string; chip?: string;
  esterilizado?: boolean; descripcion?: string; foto_url?: string;
  alergias?: string | null; vet_nombre?: string | null; vet_telefono?: string | null;
  direccion?: string | null; estado_salud?: EstadoSalud | null;
  dieta_marca?: string | null; dieta_cantidad?: string | null;
  dieta_frecuencia?: string | null; dieta_notas?: string | null;
  numero_registro?: number | null;
}

function estadosSalud(t: Translations): { key: EstadoSalud; label: string }[] {
  return [
    { key: 'saludable',       label: t.estadoSaludSaludable },
    { key: 'en_tratamiento',  label: t.estadoSaludEnTratamiento },
    { key: 'en_recuperacion', label: t.estadoSaludEnRecuperacion },
  ];
}

function secciones(t: Translations): { tipo: TipoEstudio; titulo: string; emoji: string; aceptaArchivos: boolean }[] {
  return [
    { tipo: 'laboratorio',              titulo: t.perroEstudioLaboratorio,    emoji: '🧪', aceptaArchivos: true },
    { tipo: 'radiografia',              titulo: t.perroEstudioRadiografia,               emoji: '📡', aceptaArchivos: true },
    { tipo: 'ecografia',                titulo: t.perroEstudioEcografia,                 emoji: '📈', aceptaArchivos: true },
    { tipo: 'certificado_chip',         titulo: t.perroEstudioCertChip,        emoji: '💾', aceptaArchivos: true },
    { tipo: 'certificado_cvi',          titulo: t.perroEstudioCertCvi,            emoji: '📋', aceptaArchivos: true },
    { tipo: 'certificado_antiparasitario', titulo: t.perroEstudioCertAntiparasitario, emoji: '💊', aceptaArchivos: true },
    { tipo: 'vacuna_antirrabica',       titulo: t.perroEstudioVacunaAntirrabica,         emoji: '💉', aceptaArchivos: true },
    { tipo: 'airtag',                   titulo: t.perroEstudioAirtag,        emoji: '📍', aceptaArchivos: false },
  ];
}

function fmt(iso: string) {
  if (!iso) return '—';
  const [y, m, d] = iso.slice(0, 10).split('-');
  return `${d}/${m}/${y}`;
}

export default function PerroDetalleScreen() {
  const { t } = useLanguage();
  const ESTADOS_SALUD = estadosSalud(t);
  const SECCIONES = secciones(t);
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isPro, profile } = useAuth();
  const [perro,    setPerro]    = useState<Perro | null>(null);
  const [vacunas,  setVacunas]  = useState<Vacuna[]>([]);
  const [estudios, setEstudios] = useState<Estudio[]>([]);
  const [desparasitaciones, setDesparasitaciones] = useState<Desparasitacion[]>([]);
  const [medicamentos,      setMedicamentos]      = useState<Medicamento[]>([]);
  const [pesos,             setPesos]             = useState<Peso[]>([]);
  const [visitasVet,        setVisitasVet]        = useState<VisitaVet[]>([]);
  const [procedimientos,    setProcedimientos]    = useState<Procedimiento[]>([]);
  const [grooming,          setGrooming]          = useState<Grooming | null>(null);
  const [turnos,            setTurnos]            = useState<Turno[]>([]);
  const [contactos,         setContactos]         = useState<ContactoEmergencia[]>([]);
  const [fotos,             setFotos]             = useState<FotoPerro[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [errorCarga, setErrorCarga] = useState(false);
  const [subiendo, setSubiendo] = useState<TipoEstudio | null>(null);
  const [subiendoFoto, setSubiendoFoto] = useState(false);

  const [editandoPerfil, setEditandoPerfil] = useState(false);
  const [guardandoPerfil, setGuardandoPerfil] = useState(false);
  const [formPerfil, setFormPerfil] = useState({
    nombre: '', raza: '', color: '', sexo: '', tamano: '', fecha_nac: '', chip: '', descripcion: '',
    alergias: '', vet_nombre: '', vet_telefono: '', direccion: '',
    estado_salud: '' as EstadoSalud | '', dieta_marca: '', dieta_cantidad: '',
    dieta_frecuencia: '', dieta_notas: '',
  });
  const [razaSugerencias, setRazaSugerencias] = useState<string[]>([]);
  const [mostrarRazaSug,  setMostrarRazaSug]  = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [subiendoFotoPerfil, setSubiendoFotoPerfil] = useState(false);

  function handleRazaChange(v: string) {
    setFormPerfil((f) => ({ ...f, raza: v }));
    const found = buscarRazas(v);
    setRazaSugerencias(found);
    setMostrarRazaSug(found.length > 0);
  }

  function seleccionarRaza(r: string) {
    setFormPerfil((f) => ({ ...f, raza: r }));
    setRazaSugerencias([]);
    setMostrarRazaSug(false);
  }

  const cargar = useCallback(async () => {
    setLoading(true);
    setErrorCarga(false);
    try {
      const [{ data: p }, { data: v }, e, d, m, pe, vv, pr, g, c, f, tu] = await Promise.all([
        supabase.from('perros').select('*').eq('id', id).single(),
        supabase.from('vacunas').select('*').eq('perro_id', id).order('fecha', { ascending: false }),
        listarEstudios(id),
        listarDesparasitaciones(id),
        listarMedicamentos(id),
        listarPesos(id),
        listarVisitasVet(id),
        listarProcedimientos(id),
        obtenerGrooming(id),
        listarContactos(id),
        listarFotos(id),
        listarTurnos(id),
      ]);
      setPerro(p);
      setVacunas(v ?? []);
      setEstudios(e);
      setDesparasitaciones(d);
      setMedicamentos(m);
      setPesos(pe);
      setVisitasVet(vv);
      setProcedimientos(pr);
      setTurnos(tu);
      setGrooming(g);
      setContactos(c);
      setFotos(f);
      if (p) {
        setFormPerfil({
          nombre:           p.nombre ?? '',
          raza:             p.raza ?? '',
          color:            p.color ?? '',
          sexo:             p.sexo ?? '',
          tamano:           p.tamano ?? '',
          fecha_nac:        p.fecha_nac ?? '',
          chip:             p.chip ?? '',
          descripcion:      p.descripcion ?? '',
          alergias:         p.alergias ?? '',
          vet_nombre:       p.vet_nombre ?? '',
          vet_telefono:     p.vet_telefono ?? '',
          direccion:        p.direccion ?? '',
          estado_salud:     p.estado_salud ?? '',
          dieta_marca:      p.dieta_marca ?? '',
          dieta_cantidad:   p.dieta_cantidad ?? '',
          dieta_frecuencia: p.dieta_frecuencia ?? '',
          dieta_notas:      p.dieta_notas ?? '',
        });
      }
    } catch {
      setErrorCarga(true);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { cargar(); }, [cargar]);

  async function guardarPerfil() {
    setGuardandoPerfil(true);
    try {
      await actualizarPerro(id, formPerfil);
      setPerro((prev) => prev ? { ...prev, ...formPerfil, estado_salud: formPerfil.estado_salud || null } : prev);
      setEditandoPerfil(false);
    } catch {
      Alert.alert(t.perfilErrorGeneric, t.genericErrGuardarConexion);
    } finally {
      setGuardandoPerfil(false);
    }
  }

  async function elegirFotoGaleria() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') { Alert.alert(t.perfilPermisoDenegadoTitle, t.perfilPermisoDenegadoSub); return; }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: 'images', quality: 0.7 });
    if (result.canceled) return;
    setSubiendoFoto(true);
    try {
      const nombre = result.assets[0].fileName ?? `foto-${Date.now()}.jpg`;
      const url = await subirFotoGaleria(result.assets[0].uri, nombre);
      const nueva = await agregarFoto(id, url);
      setFotos((prev) => [nueva, ...prev]);
    } catch {
      Alert.alert(t.perfilErrorGeneric, t.perroErrSubirFoto);
    } finally {
      setSubiendoFoto(false);
    }
  }

  async function cambiarFotoPerfil() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') { Alert.alert(t.perfilPermisoDenegadoTitle, t.perfilPermisoDenegadoSub); return; }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: 'images', quality: 0.7 });
    if (result.canceled) return;
    setSubiendoFotoPerfil(true);
    try {
      const nombreArchivo = result.assets[0].fileName ?? `perfil-${Date.now()}.jpg`;
      const url = await subirFotoGaleria(result.assets[0].uri, nombreArchivo);
      await actualizarPerro(id, { foto_url: url });
      setPerro((prev) => prev ? { ...prev, foto_url: url } : prev);
    } catch {
      Alert.alert(t.perfilErrorGeneric, t.perroErrCambiarFoto);
    } finally {
      setSubiendoFotoPerfil(false);
    }
  }

  function borrarFotoGaleria(foto: FotoPerro) {
    Alert.alert(t.perroConfirmBorrarFotoTitle, t.perroConfirmBorrarFotoSub, [
      { text: t.perfilCancelar, style: 'cancel' },
      {
        text: t.genericEliminar, style: 'destructive',
        onPress: async () => {
          try {
            await eliminarFoto(foto.id);
            setFotos((prev) => prev.filter((f) => f.id !== foto.id));
          } catch {
            Alert.alert(t.perfilErrorGeneric, t.perroErrBorrarFoto);
          }
        },
      },
    ]);
  }

  async function registrarTurno(tipo: TipoTurno, fecha: string, nota: string) {
    const existente = turnos.find((t) => t.tipo === tipo);
    const nuevo = await agregarTurno({ perro_id: id, tipo, fecha, nota: nota || null });
    if (existente) await eliminarTurno(existente.id);
    setTurnos((prev) => [...prev.filter((t) => t.tipo !== tipo), nuevo]);
  }

  async function borrarTurno(turnoId: string) {
    await eliminarTurno(turnoId);
    setTurnos((prev) => prev.filter((t) => t.id !== turnoId));
  }

  function confirmarBorrar(titulo: string, onConfirm: () => Promise<void>) {
    Alert.alert(titulo, t.perroConfirmBorrarSub, [
      { text: t.perfilCancelar, style: 'cancel' },
      {
        text: t.genericEliminar, style: 'destructive',
        onPress: async () => {
          try {
            await onConfirm();
          } catch (e) {
            const msg = e instanceof Error && e.message ? e.message : t.genericErrGuardarConexion;
            Alert.alert(t.perfilErrorGeneric, msg);
          }
        },
      },
    ]);
  }

  async function subirArchivo(tipo: TipoEstudio) {
    try {
      let uri = '';
      let nombre = '';

      if (tipo === 'ecografia' || tipo === 'radiografia') {
        // Permitir foto/video/doc
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images', 'videos'],
          quality: 0.8,
        });
        if (result.canceled) return;
        uri    = result.assets[0].uri;
        nombre = result.assets[0].fileName ?? `${tipo}-${Date.now()}.jpg`;
      } else {
        // PDF u otro documento
        const result = await DocumentPicker.getDocumentAsync({
          type: ['application/pdf', 'image/*'],
          copyToCacheDirectory: true,
        });
        if (result.canceled) return;
        uri    = result.assets[0].uri;
        nombre = result.assets[0].name;
      }

      setSubiendo(tipo);
      const url   = await subirArchivoEstudio(uri, nombre);
      const nuevo = await agregarEstudio({
        perro_id:    id,
        tipo,
        nombre,
        archivo_url: url,
        fecha:       new Date().toISOString().slice(0, 10),
        notas:       null,
      });
      setEstudios((prev) => [nuevo, ...prev]);
      Alert.alert(t.perroArchivoSubidoTitle, `${nombre} ${t.perroArchivoSubidoSuffix}`);
    } catch (e) {
      Alert.alert(t.perfilErrorGeneric, t.perroErrSubirArchivo);
    } finally {
      setSubiendo(null);
    }
  }

  async function agregarAirtag() {
    Alert.prompt?.(
      t.perroEstudioAirtag,
      t.perroAirtagPrompt,
      async (texto) => {
        if (!texto?.trim()) return;
        try {
          const nuevo = await agregarEstudio({
            perro_id:    id,
            tipo:        'airtag',
            nombre:      texto.trim(),
            archivo_url: null,
            fecha:       new Date().toISOString().slice(0, 10),
            notas:       null,
          });
          setEstudios((prev) => [nuevo, ...prev]);
        } catch {
          Alert.alert(t.perfilErrorGeneric, t.perroErrGuardarAirtag);
        }
      }
    ) ?? Alert.alert(t.perroAirtagOnlyIphoneTitle, t.perroAirtagOnlyIphoneSub);
  }

  async function compartirHistoria() {
    const url = `https://www.mivecindog.com.ar/historia/${id}`;
    await Share.share({
      message: `${t.perroHistoriaClinicaDePrefix} ${perro?.nombre ?? t.perroMiPerroFallback} 🐾\n${url}`,
      url,
      title:   `${t.perroHistoriaClinicaDePrefix} ${perro?.nombre}`,
    });
  }

  async function borrarEstudio(estudio: Estudio) {
    Alert.alert(
      t.perroEliminarArchivoTitle,
      `${t.perroBorrarArchivoPrefix} "${estudio.nombre}"?`,
      [
        { text: t.perfilCancelar, style: 'cancel' },
        {
          text: t.genericEliminar, style: 'destructive',
          onPress: async () => {
            try {
              await eliminarEstudio(estudio.id);
              setEstudios((prev) => prev.filter((e) => e.id !== estudio.id));
            } catch {
              Alert.alert(t.perfilErrorGeneric, t.perroErrSubirArchivo);
            }
          },
        },
      ]
    );
  }

  if (loading) return <ActivityIndicator color={Colors.primary} style={{ flex: 1, marginTop: 80 }} size="large" />;
  if (errorCarga) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 12 }}>
        <Text style={{ fontSize: 15, fontWeight: '700', color: Colors.ink, textAlign: 'center' }}>{t.perroErrCargarTitle}</Text>
        <Text style={{ fontSize: 13, color: Colors.inkMuted, textAlign: 'center' }}>{t.perroErrCargarSub}</Text>
        <TouchableOpacity style={styles.guardarPerfilBtn} onPress={cargar}>
          <Text style={styles.guardarPerfilBtnText}>{t.homeRetry}</Text>
        </TouchableOpacity>
      </View>
    );
  }
  if (!perro)  return <Text style={{ textAlign: 'center', marginTop: 80 }}>{t.perroNoEncontrado}</Text>;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.inner}>

      {/* Header del perro */}
      <View style={styles.header}>
        <TouchableOpacity onPress={cambiarFotoPerfil} disabled={subiendoFotoPerfil} style={{ position: 'relative' }}>
          {perro.foto_url
            ? <Image source={{ uri: perro.foto_url }} style={styles.foto} />
            : <View style={[styles.foto, styles.fotoPlaceholder]}><Text style={{ fontSize: 48 }}>🐶</Text></View>
          }
          <View style={styles.fotoEditBadge}>
            {subiendoFotoPerfil
              ? <ActivityIndicator color={Colors.white} size="small" />
              : <Text style={{ fontSize: 13 }}>📷</Text>}
          </View>
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.nombre}>{perro.nombre}</Text>
          <Text style={styles.sub}>
            {[perro.raza, perro.color, perro.tamano, perro.sexo].filter(Boolean).join(' · ')}
          </Text>
          {perro.chip && <Text style={styles.chip}>💾 Chip: {perro.chip}</Text>}
        </View>
      </View>

      {/* Botón Historia Clínica */}
      <TouchableOpacity style={styles.historiaBtn} onPress={compartirHistoria}>
        <Text style={styles.historiaBtnText}>{t.perroHistoriaBtn}</Text>
      </TouchableOpacity>

      {/* QR de collar + cartel/PDF/historia/timeline */}
      <ExtrasSection
        perro={perro}
        perroId={id}
        profile={profile}
        registros={{ vacunas, desparasitaciones, medicamentos, pesos, visitasVet, procedimientos }}
      />

      {/* Perfil extendido: alergias, veterinario, dirección, dieta, estado de salud */}
      <View style={styles.seccion}>
        <View style={styles.seccionHeader}>
          <Text style={styles.seccionTitulo}>{t.perroSeccionPerfil}</Text>
          <TouchableOpacity style={styles.subirBtn} onPress={() => setEditandoPerfil((v) => !v)}>
            <Text style={styles.subirBtnText}>{editandoPerfil ? '✕' : t.genericEditar}</Text>
          </TouchableOpacity>
        </View>

        {editandoPerfil ? (
          <View style={{ gap: 12 }}>
            <CampoTexto label={t.campoNombre} value={formPerfil.nombre} onChange={(v) => setFormPerfil((f) => ({ ...f, nombre: v }))} placeholder={t.nuevoPerroNombrePh} />

            <View>
              <Text style={styles.campoLabel}>{t.nuevoPerroRaza}</Text>
              <TextInput
                style={styles.campoInput}
                placeholder={t.nuevoPerroRazaPh}
                placeholderTextColor={Colors.inkMuted}
                value={formPerfil.raza}
                onChangeText={handleRazaChange}
                onFocus={() => handleRazaChange(formPerfil.raza)}
              />
              {mostrarRazaSug && razaSugerencias.length > 0 && (
                <View style={styles.sugerenciaList}>
                  {razaSugerencias.slice(0, 8).map((r) => (
                    <TouchableOpacity key={r} style={styles.sugerenciaItem} onPress={() => seleccionarRaza(r)}>
                      <Text style={styles.sugerenciaText}>🐕  {r}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <View>
              <Text style={styles.campoLabel}>{t.nuevoPerroColor}</Text>
              <TouchableOpacity style={styles.pickerBtn} onPress={() => setShowColorPicker(true)}>
                <Text style={styles.pickerBtnText}>{formPerfil.color || t.nuevoPerroColorNoSe}</Text>
                <Text style={styles.pickerBtnChevron}>⌄</Text>
              </TouchableOpacity>
            </View>

            <Modal visible={showColorPicker} transparent animationType="slide" onRequestClose={() => setShowColorPicker(false)}>
              <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowColorPicker(false)}>
                <View style={styles.modalSheet}>
                  <Text style={styles.modalTitulo}>{t.nuevoPerroColorModalTitulo}</Text>
                  <TouchableOpacity style={styles.modalOption} onPress={() => { setFormPerfil((f) => ({ ...f, color: '' })); setShowColorPicker(false); }}>
                    <Text style={[styles.modalOptionText, formPerfil.color === '' && styles.modalOptionTextActive]}>{t.nuevoPerroColorNoSe}</Text>
                  </TouchableOpacity>
                  {COLORES_PERRO.map((c) => (
                    <TouchableOpacity key={c} style={styles.modalOption} onPress={() => { setFormPerfil((f) => ({ ...f, color: c })); setShowColorPicker(false); }}>
                      <Text style={[styles.modalOptionText, formPerfil.color === c && styles.modalOptionTextActive]}>{c}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </TouchableOpacity>
            </Modal>

            <View>
              <Text style={styles.campoLabel}>{t.nuevoPerroSexo}</Text>
              <View style={{ flexDirection: 'row', gap: 8, marginTop: 4 }}>
                {([['macho', t.perroSexoMachoLabel], ['hembra', t.perroSexoHembraLabel]] as const).map(([v, l]) => (
                  <TouchableOpacity key={v} style={[styles.estadoChip, formPerfil.sexo === v && styles.estadoChipActive]} onPress={() => setFormPerfil((f) => ({ ...f, sexo: f.sexo === v ? '' : v }))}>
                    <Text style={[styles.estadoChipText, formPerfil.sexo === v && styles.estadoChipTextActive]}>{l}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View>
              <Text style={styles.campoLabel}>{t.nuevoPerroTamano}</Text>
              <View style={{ flexDirection: 'row', gap: 8, marginTop: 4 }}>
                {([['pequeño', t.perroTamanoChico], ['mediano', t.perroTamanoMediano], ['grande', t.perroTamanoGrande]] as const).map(([v, l]) => (
                  <TouchableOpacity key={v} style={[styles.estadoChip, formPerfil.tamano === v && styles.estadoChipActive]} onPress={() => setFormPerfil((f) => ({ ...f, tamano: f.tamano === v ? '' : v }))}>
                    <Text style={[styles.estadoChipText, formPerfil.tamano === v && styles.estadoChipTextActive]}>{l}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <CampoTexto label={t.perroCampoFechaNacLabel} value={formPerfil.fecha_nac} onChange={(v) => setFormPerfil((f) => ({ ...f, fecha_nac: v }))} placeholder={t.perroCampoFechaNacPh} />
            <CampoTexto label={t.perroCampoChipLabel} value={formPerfil.chip} onChange={(v) => setFormPerfil((f) => ({ ...f, chip: v }))} />
            <CampoTexto label={t.campoDescripcion} value={formPerfil.descripcion} onChange={(v) => setFormPerfil((f) => ({ ...f, descripcion: v }))} multiline />

            <CampoTexto label={t.perroCampoAlergiasLabel} value={formPerfil.alergias} onChange={(v) => setFormPerfil((f) => ({ ...f, alergias: v }))} placeholder={t.perroCampoAlergiasPh} />
            <CampoTexto label={t.perroCampoVetNombreLabel} value={formPerfil.vet_nombre} onChange={(v) => setFormPerfil((f) => ({ ...f, vet_nombre: v }))} />
            <CampoTexto label={t.perroCampoVetTelefonoLabel} value={formPerfil.vet_telefono} onChange={(v) => setFormPerfil((f) => ({ ...f, vet_telefono: v }))} keyboardType="phone-pad" />
            <CampoTexto label={t.perroCampoDireccionLabel} value={formPerfil.direccion} onChange={(v) => setFormPerfil((f) => ({ ...f, direccion: v }))} />

            <View>
              <Text style={styles.campoLabel}>{t.perroCampoEstadoSalud}</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
                {ESTADOS_SALUD.map((e) => (
                  <TouchableOpacity
                    key={e.key}
                    style={[styles.estadoChip, formPerfil.estado_salud === e.key && styles.estadoChipActive]}
                    onPress={() => setFormPerfil((f) => ({ ...f, estado_salud: f.estado_salud === e.key ? '' : e.key }))}
                  >
                    <Text style={[styles.estadoChipText, formPerfil.estado_salud === e.key && styles.estadoChipTextActive]}>{e.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <Text style={styles.subseccionTitulo}>{t.perroDietaTitulo}</Text>
            <CampoTexto label={t.perroDietaMarca} value={formPerfil.dieta_marca} onChange={(v) => setFormPerfil((f) => ({ ...f, dieta_marca: v }))} />
            <CampoTexto label={t.perroDietaCantidad} value={formPerfil.dieta_cantidad} onChange={(v) => setFormPerfil((f) => ({ ...f, dieta_cantidad: v }))} placeholder={t.perroDietaCantidadPh} />
            <CampoTexto label={t.campoFrecuencia} value={formPerfil.dieta_frecuencia} onChange={(v) => setFormPerfil((f) => ({ ...f, dieta_frecuencia: v }))} placeholder={t.perroDietaFrecuenciaPh} />
            <CampoTexto label={t.perroDietaNotas} value={formPerfil.dieta_notas} onChange={(v) => setFormPerfil((f) => ({ ...f, dieta_notas: v }))} multiline />

            <TouchableOpacity style={styles.guardarPerfilBtn} onPress={guardarPerfil} disabled={guardandoPerfil}>
              {guardandoPerfil ? <ActivityIndicator color={Colors.white} size="small" /> : <Text style={styles.guardarPerfilBtnText}>{t.genericGuardar}</Text>}
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ gap: 6 }}>
            {perro.alergias && <InfoLinea label={t.perroCampoAlergiasLabel} valor={perro.alergias} />}
            {(perro.vet_nombre || perro.vet_telefono) && (
              <InfoLinea label={t.campoVeterinario} valor={[perro.vet_nombre, perro.vet_telefono].filter(Boolean).join(' · ')} />
            )}
            {perro.direccion && <InfoLinea label={t.perroCampoDireccionLabel} valor={perro.direccion} />}
            {perro.estado_salud && (
              <InfoLinea label={t.perroCampoEstadoSalud} valor={ESTADOS_SALUD.find((e) => e.key === perro.estado_salud)?.label ?? perro.estado_salud} />
            )}
            {(perro.dieta_marca || perro.dieta_cantidad || perro.dieta_frecuencia) && (
              <InfoLinea label={t.perroDietaTitulo} valor={[perro.dieta_marca, perro.dieta_cantidad, perro.dieta_frecuencia].filter(Boolean).join(' · ')} />
            )}
            {!perro.alergias && !perro.vet_nombre && !perro.direccion && !perro.estado_salud && !perro.dieta_marca && (
              <EmptyRow />
            )}
          </View>
        )}
      </View>

      {/* Vacunas */}
      <SeccionHistorial
        titulo={t.perroSeccionVacunas}
        emoji="💉"
        vacio={t.perroVacioVacunas}
        campos={[
          { key: 'nombre',      label: t.campoVacunaLabel, requerido: true, placeholder: t.campoVacunaPh },
          { key: 'fecha',       label: t.campoFecha, tipo: 'date', requerido: true },
          { key: 'proxima',     label: t.campoProximaDosis, tipo: 'date' },
          { key: 'veterinario', label: t.campoVeterinario },
          { key: 'notas',       label: t.campoNotas, tipo: 'textarea' },
        ]}
        items={vacunas}
        onGuardar={async (v) => {
          const nueva = await agregarVacuna(id, {
            nombre: v.nombre, fecha: v.fecha, proxima: v.proxima,
            veterinario: v.veterinario, notas: v.notas,
          });
          setVacunas((prev) => [nueva, ...prev]);
        }}
        onEditar={async (vacunaId, v) => {
          const actualizada = await actualizarVacuna(vacunaId, {
            nombre: v.nombre, fecha: v.fecha, proxima: v.proxima,
            veterinario: v.veterinario, notas: v.notas,
          });
          setVacunas((prev) => prev.map((x) => x.id === vacunaId ? actualizada : x));
        }}
        renderItem={(v: Vacuna, { editar }) => (
          <View key={v.id} style={styles.item}>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemNombre}>{v.nombre}</Text>
              {v.veterinario && <Text style={styles.itemSub}>{v.veterinario}</Text>}
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.itemFecha}>{fmt(v.fecha)}</Text>
              {v.proxima && (
                <Text style={[styles.itemFecha, { color: new Date(v.proxima) < new Date() ? Colors.bad : Colors.good }]}>
                  {t.perroProximaDosisPrefix} {fmt(v.proxima)}
                </Text>
              )}
            </View>
            <TouchableOpacity style={{ marginLeft: 10 }} onPress={editar}>
              <Text style={styles.borrarBtn}>✏️</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ marginLeft: 10 }}
              onPress={() => confirmarBorrar(t.perroEliminarVacuna, async () => {
                await eliminarVacuna(v.id);
                setVacunas((prev) => prev.filter((x) => x.id !== v.id));
              })}
            >
              <Text style={styles.borrarBtn}>🗑</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Desparasitaciones */}
      <SeccionHistorial
        titulo={t.perroSeccionDesparasitaciones}
        emoji="🐛"
        locked={!isPro}
        vacio={t.perroVacioDesparasitaciones}
        campos={[
          { key: 'producto',    label: t.campoProducto, requerido: true, placeholder: t.perroCampoProductoPh },
          { key: 'tipo',        label: t.campoTipo, tipo: 'select', opciones: ['interna', 'externa', 'ambas'], requerido: true },
          { key: 'fecha',       label: t.campoFecha, tipo: 'date', requerido: true },
          { key: 'proxima',     label: t.campoProximaDosis, tipo: 'date' },
          { key: 'veterinario', label: t.campoVeterinario, placeholder: t.campoOpcionalPh },
          { key: 'notas',       label: t.campoNotas, tipo: 'textarea' },
        ]}
        items={desparasitaciones}
        onGuardar={async (v) => {
          const nuevo = await agregarDesparasitacion(id, {
            producto: v.producto, tipo: (v.tipo || 'ambas') as any, fecha: v.fecha,
            proxima: v.proxima, veterinario: v.veterinario, notas: v.notas,
          });
          setDesparasitaciones((prev) => [nuevo, ...prev]);
        }}
        onEditar={async (despId, v) => {
          const actualizado = await actualizarDesparasitacion(despId, {
            producto: v.producto, tipo: (v.tipo || 'ambas') as any, fecha: v.fecha,
            proxima: v.proxima, veterinario: v.veterinario, notas: v.notas,
          });
          setDesparasitaciones((prev) => prev.map((x) => x.id === despId ? actualizado : x));
        }}
        renderItem={(d: Desparasitacion, { editar }) => (
          <View key={d.id} style={styles.item}>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemNombre}>{d.producto}</Text>
              <Text style={styles.itemSub}>{d.tipo}{d.veterinario ? ` · ${d.veterinario}` : ''}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.itemFecha}>{fmt(d.fecha)}</Text>
              {d.proxima && (
                <Text style={[styles.itemFecha, { color: new Date(d.proxima) < new Date() ? Colors.bad : Colors.good }]}>
                  {t.perroProximaDosisPrefix} {fmt(d.proxima)}
                </Text>
              )}
            </View>
            <TouchableOpacity style={{ marginLeft: 10 }} onPress={editar}>
              <Text style={styles.borrarBtn}>✏️</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ marginLeft: 10 }}
              onPress={() => confirmarBorrar(t.perroEliminarDesparasitacion, async () => {
                await eliminarDesparasitacion(d.id);
                setDesparasitaciones((prev) => prev.filter((x) => x.id !== d.id));
              })}
            >
              <Text style={styles.borrarBtn}>🗑</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Medicamentos */}
      <SeccionHistorial
        titulo={t.perroSeccionMedicamentos}
        emoji="💊"
        locked={!isPro}
        vacio={t.perroVacioMedicamentos}
        campos={[
          { key: 'nombre',       label: t.campoMedicamento, requerido: true },
          { key: 'dosis',        label: t.campoDosis },
          { key: 'frecuencia',   label: t.campoFrecuencia },
          { key: 'fecha_inicio', label: t.campoFechaInicio, tipo: 'date', requerido: true },
          { key: 'fecha_fin',    label: t.campoFechaFin },
          { key: 'notas',        label: t.campoNotas, tipo: 'textarea' },
        ]}
        items={medicamentos}
        onGuardar={async (v) => {
          const nuevo = await agregarMedicamento(id, {
            nombre: v.nombre, dosis: v.dosis, frecuencia: v.frecuencia,
            fecha_inicio: v.fecha_inicio, fecha_fin: v.fecha_fin || null, notas: v.notas,
          });
          setMedicamentos((prev) => [nuevo, ...prev]);
        }}
        renderItem={(m: Medicamento) => (
          <View key={m.id} style={styles.item}>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemNombre}>{m.nombre}</Text>
              {(m.dosis || m.frecuencia) && (
                <Text style={styles.itemSub}>{[m.dosis, m.frecuencia].filter(Boolean).join(' · ')}</Text>
              )}
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.itemFecha}>{fmt(m.fecha_inicio)}{m.fecha_fin ? ` – ${fmt(m.fecha_fin)}` : ''}</Text>
            </View>
            <TouchableOpacity
              style={{ marginLeft: 10 }}
              onPress={() => confirmarBorrar(t.perroEliminarMedicamento, async () => {
                await eliminarMedicamento(m.id);
                setMedicamentos((prev) => prev.filter((x) => x.id !== m.id));
              })}
            >
              <Text style={styles.borrarBtn}>🗑</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Pesos */}
      {isPro && <PesoChart pesos={pesos} />}
      <SeccionHistorial
        titulo={t.perroSeccionPeso}
        emoji="⚖️"
        locked={!isPro}
        vacio={t.perroVacioPeso}
        campos={[
          { key: 'fecha',    label: t.campoFecha, tipo: 'date', requerido: true },
          { key: 'valor_kg', label: t.campoPesoKg, tipo: 'numero', requerido: true },
          { key: 'notas',    label: t.campoNotas, tipo: 'textarea' },
        ]}
        items={pesos}
        onGuardar={async (v) => {
          const kg = Number(v.valor_kg.replace(',', '.'));
          if (!Number.isFinite(kg) || kg <= 0) {
            throw new Error(t.perroPesoInvalido);
          }
          const nuevo = await agregarPeso(id, { fecha: v.fecha, valor_kg: kg, notas: v.notas });
          setPesos((prev) => [nuevo, ...prev]);
        }}
        renderItem={(p: Peso) => {
          const idx = pesos.findIndex((x) => x.id === p.id);
          const anterior = pesos[idx + 1];
          const delta = anterior ? +(p.valor_kg - anterior.valor_kg).toFixed(1) : null;
          return (
            <View key={p.id} style={styles.item}>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemNombre}>{p.valor_kg} kg</Text>
                {p.notas && <Text style={styles.itemSub}>{p.notas}</Text>}
              </View>
              {delta != null && delta !== 0 && (
                <Text style={{ fontSize: 11, fontWeight: '700', color: delta > 0 ? Colors.bad : Colors.good, marginRight: 8 }}>
                  {delta > 0 ? '▲' : '▼'} {Math.abs(delta)}
                </Text>
              )}
              <Text style={styles.itemFecha}>{fmt(p.fecha)}</Text>
              <TouchableOpacity
                style={{ marginLeft: 10 }}
                onPress={() => confirmarBorrar(t.perroEliminarPeso, async () => {
                  await eliminarPeso(p.id);
                  setPesos((prev) => prev.filter((x) => x.id !== p.id));
                })}
              >
                <Text style={styles.borrarBtn}>🗑</Text>
              </TouchableOpacity>
            </View>
          );
        }}
      />

      {/* Visitas al veterinario */}
      <SeccionHistorial
        titulo={t.perroSeccionVisitas}
        emoji="🩺"
        locked={!isPro}
        vacio={t.perroVacioVisitas}
        campos={[
          { key: 'fecha',       label: t.campoFecha, tipo: 'date', requerido: true },
          { key: 'motivo',      label: t.campoMotivo, requerido: true },
          { key: 'diagnostico', label: t.campoDiagnostico, tipo: 'textarea' },
          { key: 'tratamiento', label: t.campoTratamiento, tipo: 'textarea' },
          { key: 'vet_nombre',  label: t.campoVeterinario },
          { key: 'notas',       label: t.campoNotas, tipo: 'textarea' },
        ]}
        items={visitasVet}
        onGuardar={async (v) => {
          const nuevo = await agregarVisitaVet(id, {
            fecha: v.fecha, motivo: v.motivo, diagnostico: v.diagnostico,
            tratamiento: v.tratamiento, vet_nombre: v.vet_nombre, notas: v.notas,
          });
          setVisitasVet((prev) => [nuevo, ...prev]);
        }}
        renderItem={(vv: VisitaVet) => (
          <View key={vv.id} style={styles.item}>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemNombre} numberOfLines={1}>{vv.motivo}</Text>
              {vv.vet_nombre && <Text style={styles.itemSub}>{vv.vet_nombre}</Text>}
            </View>
            <Text style={styles.itemFecha}>{fmt(vv.fecha)}</Text>
            <TouchableOpacity
              style={{ marginLeft: 10 }}
              onPress={() => confirmarBorrar(t.perroEliminarVisita, async () => {
                await eliminarVisitaVet(vv.id);
                setVisitasVet((prev) => prev.filter((x) => x.id !== vv.id));
              })}
            >
              <Text style={styles.borrarBtn}>🗑</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Procedimientos / cirugías */}
      <SeccionHistorial
        titulo={t.perroSeccionProcedimientos}
        emoji="🏥"
        locked={!isPro}
        vacio={t.perroVacioProcedimientos}
        campos={[
          { key: 'fecha',       label: t.campoFecha, tipo: 'date', requerido: true },
          { key: 'tipo',        label: t.campoTipo, tipo: 'select', opciones: TIPOS_PROCEDIMIENTO, requerido: true },
          { key: 'descripcion', label: t.campoDescripcion, tipo: 'textarea', requerido: true },
          { key: 'vet_nombre',  label: t.campoVeterinario },
          { key: 'notas',       label: t.campoNotas, tipo: 'textarea' },
        ]}
        items={procedimientos}
        onGuardar={async (v) => {
          const nuevo = await agregarProcedimiento(id, {
            fecha: v.fecha, tipo: v.tipo || TIPOS_PROCEDIMIENTO[0], descripcion: v.descripcion,
            vet_nombre: v.vet_nombre, notas: v.notas,
          });
          setProcedimientos((prev) => [nuevo, ...prev]);
        }}
        renderItem={(p: Procedimiento) => (
          <View key={p.id} style={styles.item}>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemNombre}>{p.tipo}</Text>
              <Text style={styles.itemSub} numberOfLines={1}>{p.descripcion}</Text>
            </View>
            <Text style={styles.itemFecha}>{fmt(p.fecha)}</Text>
            <TouchableOpacity
              style={{ marginLeft: 10 }}
              onPress={() => confirmarBorrar(t.perroEliminarProcedimiento, async () => {
                await eliminarProcedimiento(p.id);
                setProcedimientos((prev) => prev.filter((x) => x.id !== p.id));
              })}
            >
              <Text style={styles.borrarBtn}>🗑</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Grooming */}
      <GroomingSection perroId={id} grooming={grooming} locked={!isPro} onGuardado={setGrooming} onEliminado={() => setGrooming(null)} />

      {/* Contactos de emergencia — gratis para todos, igual que en la web */}
      <SeccionHistorial
        titulo={t.perroSeccionContactos}
        emoji="🆘"
        locked={false}
        vacio={t.perroVacioContactos}
        campos={[
          { key: 'nombre',   label: t.campoNombre, requerido: true },
          { key: 'relacion', label: t.campoRelacion, placeholder: t.perroCampoRelacionPh },
          { key: 'telefono', label: t.campoTelefono, requerido: true, placeholder: t.perroCampoTelefonoPh },
          { key: 'notas',    label: t.campoNotas, tipo: 'textarea' },
        ]}
        items={contactos}
        onGuardar={async (v) => {
          const nuevo = await agregarContacto(id, {
            nombre: v.nombre, relacion: v.relacion, telefono: v.telefono, notas: v.notas,
          });
          setContactos((prev) => [...prev, nuevo]);
        }}
        renderItem={(c: ContactoEmergencia) => (
          <View key={c.id} style={styles.item}>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemNombre}>{c.nombre}</Text>
              <Text style={styles.itemSub}>{[c.relacion, c.telefono].filter(Boolean).join(' · ')}</Text>
            </View>
            <TouchableOpacity
              onPress={() => confirmarBorrar(t.perroEliminarContacto, async () => {
                await eliminarContacto(c.id);
                setContactos((prev) => prev.filter((x) => x.id !== c.id));
              })}
            >
              <Text style={styles.borrarBtn}>🗑</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Galería de fotos */}
      <View style={styles.seccion}>
        <View style={styles.seccionHeader}>
          <Text style={styles.seccionTitulo}>{t.perroSeccionGaleria}</Text>
          {isPro ? (
            <TouchableOpacity style={styles.subirBtn} onPress={elegirFotoGaleria} disabled={subiendoFoto}>
              {subiendoFoto ? <ActivityIndicator color={Colors.primary} size="small" /> : <Text style={styles.subirBtnText}>{t.perroGaleriaAgregar}</Text>}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.subirBtn} onPress={() => Linking.openURL('https://www.mivecindog.com.ar/planes')}>
              <Text style={styles.subirBtnText}>{t.perroGaleriaPro}</Text>
            </TouchableOpacity>
          )}
        </View>
        {fotos.length === 0 ? <EmptyRow /> : (
          <View style={styles.galeriaGrid}>
            {fotos.map((f) => (
              <TouchableOpacity key={f.id} style={styles.galeriaItem} onLongPress={() => borrarFotoGaleria(f)}>
                <Image source={{ uri: f.url }} style={styles.galeriaImg} />
              </TouchableOpacity>
            ))}
          </View>
        )}
        {fotos.length > 0 && <Text style={styles.galeriaHint}>{t.perroGaleriaHint}</Text>}
      </View>

      {/* Secciones de estudios */}
      {SECCIONES.map(({ tipo, titulo, emoji, aceptaArchivos }) => {
        const items = estudios.filter((e) => e.tipo === tipo);
        return (
          <View key={tipo} style={styles.seccion}>
            <View style={styles.seccionHeader}>
              <Text style={styles.seccionTitulo}>{emoji}  {titulo}</Text>
              <TouchableOpacity
                style={[styles.subirBtn, subiendo === tipo && styles.subirBtnDisabled]}
                onPress={() => aceptaArchivos ? subirArchivo(tipo) : agregarAirtag()}
                disabled={subiendo !== null}
              >
                {subiendo === tipo
                  ? <ActivityIndicator color={Colors.primary} size="small" />
                  : <Text style={styles.subirBtnText}>{aceptaArchivos ? t.perroSubirBtn : t.genericAgregarBtn}</Text>
                }
              </TouchableOpacity>
            </View>

            {items.length === 0
              ? <EmptyRow />
              : items.map((e) => (
                  <View key={e.id} style={styles.item}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.itemNombre} numberOfLines={1}>{e.nombre}</Text>
                      {e.fecha && <Text style={styles.itemSub}>{fmt(e.fecha)}</Text>}
                    </View>
                    <View style={styles.itemActions}>
                      {e.archivo_url && (
                        <TouchableOpacity
                          style={styles.verBtn}
                          onPress={() => Linking.openURL(e.archivo_url!)}
                        >
                          <Text style={styles.verBtnText}>{t.genericVer}</Text>
                        </TouchableOpacity>
                      )}
                      <TouchableOpacity onPress={() => borrarEstudio(e)}>
                        <Text style={styles.borrarBtn}>🗑</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
            }
            {(tipo === 'radiografia' || tipo === 'ecografia') && (
              <TurnoWidget
                turno={turnos.find((t) => t.tipo === tipo) ?? null}
                onRegistrar={(fecha, nota) => registrarTurno(tipo as TipoTurno, fecha, nota)}
                onEliminar={borrarTurno}
              />
            )}
          </View>
        );
      })}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

function EmptyRow() {
  const { t } = useLanguage();
  return (
    <View style={styles.emptyRow}>
      <Text style={styles.emptyRowText}>✗  {t.historialVacioDefault}</Text>
    </View>
  );
}

function CampoTexto({
  label, value, onChange, placeholder, multiline, keyboardType,
}: {
  label: string; value: string; onChange: (t: string) => void;
  placeholder?: string; multiline?: boolean; keyboardType?: 'default' | 'phone-pad';
}) {
  return (
    <View>
      <Text style={styles.campoLabel}>{label}</Text>
      <TextInput
        style={[styles.campoInput, multiline && styles.campoInputArea]}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={Colors.inkMuted}
        multiline={multiline}
        keyboardType={keyboardType}
      />
    </View>
  );
}

function InfoLinea({ label, valor }: { label: string; valor: string }) {
  return (
    <View style={styles.infoLinea}>
      <Text style={styles.infoLineaLabel}>{label}</Text>
      <Text style={styles.infoLineaValor}>{valor}</Text>
    </View>
  );
}

const TIPOS_GROOMING: TipoGrooming[] = ['baño', 'peluquería', 'ambos'];

function GroomingSection({
  perroId, grooming, locked, onGuardado, onEliminado,
}: {
  perroId: string; grooming: Grooming | null; locked: boolean;
  onGuardado: (g: Grooming) => void; onEliminado: () => void;
}) {
  const { t } = useLanguage();
  const GROOMING_LABEL: Record<TipoGrooming, string> = { 'baño': t.groomingTipoBano, 'peluquería': t.groomingTipoPeluqueria, 'ambos': t.groomingTipoAmbos };
  const [editando, setEditando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [borrando, setBorrando] = useState(false);

  function borrar() {
    if (!grooming) return;
    Alert.alert(t.groomingConfirmBorrarTitle, t.groomingConfirmBorrarSub, [
      { text: t.perfilCancelar, style: 'cancel' },
      {
        text: t.genericEliminar, style: 'destructive',
        onPress: async () => {
          setBorrando(true);
          try {
            await eliminarGrooming(grooming.id);
            onEliminado();
          } catch {
            Alert.alert(t.perfilErrorGeneric, t.genericErrGuardarConexion);
          } finally {
            setBorrando(false);
          }
        },
      },
    ]);
  }
  const [tipo, setTipo] = useState<TipoGrooming>(grooming?.tipo ?? 'baño');
  const [ultimaFecha, setUltimaFecha] = useState(grooming?.ultima_fecha ?? new Date().toISOString().slice(0, 10));
  const [frecuencia, setFrecuencia] = useState(String(grooming?.frecuencia_dias ?? '30'));
  const [notas, setNotas] = useState(grooming?.notas ?? '');

  async function guardar() {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(ultimaFecha.trim())) {
      Alert.alert(t.errFechaInvalidaTitle, t.groomingFechaInvalidaSub);
      return;
    }
    const dias = parseInt(frecuencia, 10);
    if (!Number.isFinite(dias) || dias <= 0) {
      Alert.alert(t.groomingFrecuenciaInvalidaTitle, t.groomingFrecuenciaInvalidaSub);
      return;
    }
    setGuardando(true);
    try {
      const nuevo = await guardarGrooming(perroId, {
        ultima_fecha: ultimaFecha.trim(),
        frecuencia_dias: dias,
        tipo,
        notas: notas || null,
      });
      onGuardado(nuevo);
      setEditando(false);
    } catch (e) {
      const msg = e instanceof Error && e.message ? e.message : t.genericErrGuardarConexion;
      Alert.alert(t.perfilErrorGeneric, msg);
    } finally {
      setGuardando(false);
    }
  }

  return (
    <View style={styles.seccion}>
      <View style={styles.seccionHeader}>
        <Text style={styles.seccionTitulo}>🛁  {t.perroSeccionGrooming}</Text>
        {locked ? (
          <TouchableOpacity style={styles.subirBtn} onPress={() => Linking.openURL('https://www.mivecindog.com.ar/planes')}>
            <Text style={styles.subirBtnText}>{t.perroGaleriaPro}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.subirBtn} onPress={() => setEditando((v) => !v)}>
            <Text style={styles.subirBtnText}>{editando ? '✕' : grooming ? t.genericEditar : t.genericAgregarBtn}</Text>
          </TouchableOpacity>
        )}
      </View>

      {!locked && editando ? (
        <View style={{ gap: 10 }}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
            {TIPOS_GROOMING.map((g) => (
              <TouchableOpacity key={g} style={[styles.estadoChip, tipo === g && styles.estadoChipActive]} onPress={() => setTipo(g)}>
                <Text style={[styles.estadoChipText, tipo === g && styles.estadoChipTextActive]}>{GROOMING_LABEL[g]}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <CampoTexto label={t.groomingUltimaFecha} value={ultimaFecha} onChange={setUltimaFecha} placeholder={t.dateFormatPh} />
          <CampoTexto label={t.groomingFrecuenciaDias} value={frecuencia} onChange={setFrecuencia} keyboardType="phone-pad" />
          <CampoTexto label={t.campoNotas} value={notas} onChange={setNotas} multiline />
          <TouchableOpacity style={styles.guardarPerfilBtn} onPress={guardar} disabled={guardando}>
            {guardando ? <ActivityIndicator color={Colors.white} size="small" /> : <Text style={styles.guardarPerfilBtnText}>{t.genericGuardar}</Text>}
          </TouchableOpacity>
        </View>
      ) : grooming ? (
        <View style={{ gap: 6 }}>
          <InfoLinea label={t.campoTipo} valor={GROOMING_LABEL[grooming.tipo]} />
          <InfoLinea label={t.groomingUltimaVez} valor={fmt(grooming.ultima_fecha)} />
          <InfoLinea label={t.campoFrecuencia} valor={`${t.groomingCadaPrefix} ${grooming.frecuencia_dias} ${t.groomingDiasSuffix}`} />
          {grooming.notas && <InfoLinea label={t.campoNotas} valor={grooming.notas} />}
          <TouchableOpacity onPress={borrar} disabled={borrando} style={{ marginTop: 4 }}>
            <Text style={{ color: Colors.bad, fontSize: 12, fontWeight: '700' }}>
              {borrando ? t.groomingBorrando : t.groomingBorrarRegistro}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <EmptyRow />
      )}
    </View>
  );
}

function PesoChart({ pesos }: { pesos: Peso[] }) {
  const { t } = useLanguage();
  if (pesos.length < 2) return null;
  const asc = [...pesos].reverse(); // mas viejo -> mas nuevo
  const valores = asc.map((p) => p.valor_kg);
  const min = Math.min(...valores);
  const max = Math.max(...valores);
  const rango = max - min || 1;
  const ultimo = asc[asc.length - 1].valor_kg;
  const anterior = asc[asc.length - 2].valor_kg;
  const delta = +(ultimo - anterior).toFixed(1);
  const colorDelta = delta > 0 ? Colors.bad : delta < 0 ? Colors.good : Colors.inkMuted;

  return (
    <View style={styles.seccion}>
      <Text style={styles.seccionTitulo}>{t.perroPesoEvolucion}</Text>
      <View style={styles.pesoChartRow}>
        {asc.map((p) => {
          const alto = 24 + ((p.valor_kg - min) / rango) * 56;
          return (
            <View key={p.id} style={styles.pesoBarCol}>
              <Text style={styles.pesoBarValor}>{p.valor_kg}</Text>
              <View style={[styles.pesoBar, { height: alto }]} />
              <Text style={styles.pesoBarFecha}>{fmt(p.fecha).slice(0, 5)}</Text>
            </View>
          );
        })}
      </View>
      <Text style={[styles.pesoDelta, { color: colorDelta }]}>
        {delta > 0 ? '▲' : delta < 0 ? '▼' : '—'} {Math.abs(delta)} {t.perroPesoVsAnterior}
      </Text>
    </View>
  );
}

function TurnoWidget({
  turno, onRegistrar, onEliminar,
}: {
  turno: Turno | null;
  onRegistrar: (fecha: string, nota: string) => Promise<void>;
  onEliminar: (id: string) => void;
}) {
  const { t } = useLanguage();
  const [editando, setEditando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [fecha, setFecha] = useState(turno?.fecha ?? '');
  const [nota,  setNota]  = useState(turno?.nota ?? '');

  const vencido = !!turno && new Date(`${turno.fecha}T00:00:00`) < new Date(new Date().toDateString());

  async function guardar() {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha.trim())) {
      Alert.alert(t.errFechaInvalidaTitle, t.turnoFechaInvalida);
      return;
    }
    setGuardando(true);
    try {
      await onRegistrar(fecha.trim(), nota.trim());
      setEditando(false);
    } catch {
      Alert.alert(t.perfilErrorGeneric, t.turnoErrGuardar);
    } finally {
      setGuardando(false);
    }
  }

  return (
    <View style={styles.turnoWrap}>
      {editando ? (
        <View style={{ gap: 8 }}>
          <CampoTexto label={t.turnoFechaLabel} value={fecha} onChange={setFecha} placeholder={t.dateFormatPh} />
          <CampoTexto label={t.campoNotas} value={nota} onChange={setNota} placeholder={t.campoOpcionalPh} />
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TouchableOpacity style={[styles.guardarPerfilBtn, { flex: 1 }]} onPress={guardar} disabled={guardando}>
              {guardando ? <ActivityIndicator color={Colors.white} size="small" /> : <Text style={styles.guardarPerfilBtnText}>{t.turnoGuardarBtn}</Text>}
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelarTurnoBtn} onPress={() => setEditando(false)}>
              <Text style={{ color: Colors.inkMuted, fontWeight: '700', fontSize: 13 }}>{t.perfilCancelar}</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : turno ? (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 12, fontWeight: '700', color: Colors.ink }}>
              {t.turnoProximoPrefix} {fmt(turno.fecha)}
            </Text>
            {turno.nota && <Text style={styles.itemSub}>{turno.nota}</Text>}
            <Text style={[styles.turnoBadge, { color: vencido ? Colors.bad : Colors.good }]}>
              {vencido ? t.turnoVencido : t.turnoVigente}
            </Text>
          </View>
          <TouchableOpacity onPress={() => { setFecha(turno.fecha); setNota(turno.nota ?? ''); setEditando(true); }}>
            <Text style={styles.borrarBtn}>✏️</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ marginLeft: 8 }} onPress={() => onEliminar(turno.id)}>
            <Text style={styles.borrarBtn}>🗑</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity onPress={() => { setFecha(''); setNota(''); setEditando(true); }}>
          <Text style={{ fontSize: 12, fontWeight: '700', color: Colors.primary }}>{t.turnoRegistrarBtn}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

type RegistrosMedicos = {
  vacunas: Vacuna[]; desparasitaciones: Desparasitacion[]; medicamentos: Medicamento[];
  pesos: Peso[]; visitasVet: VisitaVet[]; procedimientos: Procedimiento[];
};

type EventoTimeline = { fecha: string; emoji: string; titulo: string; sub?: string };

function construirTimeline(r: RegistrosMedicos): EventoTimeline[] {
  const eventos: EventoTimeline[] = [];
  r.vacunas.forEach((v) => eventos.push({ fecha: v.fecha, emoji: '💉', titulo: `Vacuna: ${v.nombre}`, sub: v.veterinario || undefined }));
  r.desparasitaciones.forEach((d) => eventos.push({ fecha: d.fecha, emoji: '🐛', titulo: `Desparasitación: ${d.producto}`, sub: d.veterinario || undefined }));
  r.medicamentos.forEach((m) => eventos.push({ fecha: m.fecha_inicio, emoji: '💊', titulo: `Medicamento: ${m.nombre}`, sub: m.dosis || undefined }));
  r.pesos.forEach((p) => eventos.push({ fecha: p.fecha, emoji: '⚖️', titulo: `Peso: ${p.valor_kg} kg` }));
  r.visitasVet.forEach((vv) => eventos.push({ fecha: vv.fecha, emoji: '🏥', titulo: `Visita al veterinario: ${vv.motivo}`, sub: vv.diagnostico ?? undefined }));
  r.procedimientos.forEach((pr) => eventos.push({ fecha: pr.fecha, emoji: '🔧', titulo: pr.tipo, sub: pr.descripcion || undefined }));
  return eventos.filter((e) => e.fecha).sort((a, b) => b.fecha.localeCompare(a.fecha));
}

function construirCartelHTML(perro: Perro, profile: Profile | null, perdido: boolean): string {
  const accent = perdido ? '#dc2626' : '#1e3a5f';
  const accentBg = perdido ? '#fef2f2' : '#eff6ff';
  const accentLight = perdido ? '#fee2e2' : '#dbeafe';
  const nombreDuenio = profile ? `${profile.nombre} ${profile.apellido}` : '';
  const telefono = profile?.telefono ?? '';
  const digits = telefono.replace(/\D/g, '');
  const waNum = digits ? (digits.startsWith('54') ? digits : `54${digits}`) : '';
  const qrUrl = waNum ? `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(`https://wa.me/${waNum}`)}` : '';
  const caracteristicas = ([
    ['Raza', perro.raza], ['Color', perro.color], ['Tamaño', perro.tamano],
    ['Sexo', perro.sexo], ['Microchip', perro.chip],
  ] as [string, string | undefined][]).filter(([, v]) => v);

  return `<!DOCTYPE html><html><head><meta charset="utf-8" />
  <style>body{font-family:Arial,sans-serif;margin:0;}</style></head><body>
  <div>
    <div style="height:8px;background:${accent};"></div>
    <div style="padding:20px 24px 16px;border-bottom:2px solid ${accentLight};display:flex;align-items:center;justify-content:space-between;">
      <div>
        <p style="margin:0;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#888;">Vecindog · mivecindog.com.ar</p>
        <p style="margin:2px 0 0;font-size:${perdido ? '28px' : '18px'};font-weight:900;color:${accent};letter-spacing:-0.5px;">
          ${perdido ? '⚠ SE BUSCA · PERRO PERDIDO' : 'IDENTIFICACIÓN DE MASCOTA'}
        </p>
      </div>
      <div style="background:${accent};color:#fff;border-radius:8px;padding:6px 14px;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:1px;">
        ${perdido ? 'PERDIDO' : 'REGISTRADO'}
      </div>
    </div>
    <div style="padding:20px 24px;display:flex;gap:20px;">
      <div style="flex:0 0 auto;width:160px;">
        ${perro.foto_url
          ? `<img src="${perro.foto_url}" style="width:160px;height:190px;object-fit:cover;border-radius:10px;border:3px solid ${accent};display:block;" />`
          : `<div style="width:160px;height:190px;background:${accentBg};border-radius:10px;border:3px solid ${accentLight};display:flex;align-items:center;justify-content:center;font-size:56px;">🐶</div>`
        }
        <div style="margin-top:8px;background:${accent};border-radius:8px;padding:6px 10px;text-align:center;">
          <p style="margin:0;font-size:20px;font-weight:900;color:#fff;">${perro.nombre}</p>
        </div>
      </div>
      <div style="flex:1;">
        <div style="background:${accentBg};border-radius:10px;padding:12px 14px;margin-bottom:12px;">
          <p style="margin:0 0 8px;font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:${accent};">Características</p>
          <table style="width:100%;border-collapse:collapse;font-size:13px;">
            ${caracteristicas.map(([label, value]) => `
              <tr>
                <td style="padding:3px 8px 3px 0;color:#666;font-weight:600;width:90px;font-size:12px;">${label}</td>
                <td style="padding:3px 0;color:#1a1a1a;font-weight:700;text-transform:capitalize;">${value}</td>
              </tr>`).join('')}
          </table>
        </div>
        ${perro.descripcion ? `
        <div style="background:#f9f9f9;border-radius:8px;padding:10px 12px;margin-bottom:12px;border-left:3px solid ${accent};">
          <p style="margin:0 0 4px;font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:${accent};">Descripción</p>
          <p style="margin:0;font-size:12px;color:#444;line-height:1.5;">${perro.descripcion}</p>
        </div>` : ''}
        ${perro.direccion ? `
        <div style="background:#f9f9f9;border-radius:8px;padding:8px 12px;font-size:12px;color:#555;">
          📍 <strong>Zona:</strong> ${perro.direccion}
        </div>` : ''}
      </div>
    </div>
    <div style="margin:0 24px 20px;background:${accent};border-radius:12px;padding:16px 20px;display:flex;align-items:center;gap:20px;">
      ${qrUrl ? `
      <div style="flex:0 0 auto;text-align:center;">
        <img src="${qrUrl}" style="width:90px;height:90px;border-radius:8px;background:#fff;padding:4px;display:block;" />
        <p style="color:rgba(255,255,255,0.7);font-size:9px;margin:4px 0 0;text-align:center;font-weight:700;letter-spacing:1px;text-transform:uppercase;">WhatsApp</p>
      </div>` : ''}
      <div style="flex:1;">
        <p style="color:rgba(255,255,255,0.7);font-size:10px;margin:0 0 2px;text-transform:uppercase;letter-spacing:1.5px;font-weight:700;">Si lo encontraste, contactate</p>
        ${nombreDuenio ? `<p style="color:#fff;font-size:15px;font-weight:800;margin:0 0 4px;">${nombreDuenio}</p>` : ''}
        ${telefono ? `<p style="color:#fff;font-size:24px;font-weight:900;margin:0;letter-spacing:-0.5px;">${telefono}</p>` : ''}
      </div>
      <div style="flex:0 0 auto;text-align:center;opacity:0.4;">
        <p style="color:#fff;font-size:22px;margin:0;">🐾</p>
        <p style="color:#fff;font-size:8px;font-weight:700;letter-spacing:1px;margin:2px 0 0;">VECINDOG</p>
      </div>
    </div>
    <div style="border-top:1px solid ${accentLight};padding:10px 24px;display:flex;justify-content:space-between;align-items:center;">
      <p style="margin:0;font-size:10px;color:#bbb;">Generado en <strong>mivecindog.com.ar</strong> · Red vecinal de mascotas · Argentina</p>
      <div style="height:4px;width:80px;background:${accent};border-radius:2px;"></div>
    </div>
    <div style="height:8px;background:${accent};"></div>
  </div>
  </body></html>`;
}

async function perroEstaPerdido(perroId: string): Promise<boolean> {
  const { data } = await supabase
    .from('posts')
    .select('id')
    .eq('perro_id', perroId)
    .eq('categoria', 'perdido')
    .neq('estado', 'resuelto')
    .limit(1)
    .maybeSingle();
  return !!data;
}

function ExtrasSection({
  perro, perroId, profile, registros,
}: {
  perro: Perro; perroId: string; profile: Profile | null; registros: RegistrosMedicos;
}) {
  const { t } = useLanguage();
  const [mostrarQR, setMostrarQR] = useState(false);
  const [compartiendoQR, setCompartiendoQR] = useState(false);
  const [generandoPdf, setGenerandoPdf] = useState(false);
  const [timelineOpen, setTimelineOpen] = useState(false);
  const [historiaOpen, setHistoriaOpen] = useState(false);
  const [perdidoHistoria, setPerdidoHistoria] = useState(false);
  const [mostrarTelHistoria, setMostrarTelHistoria] = useState(true);
  const [compartiendoHistoria, setCompartiendoHistoria] = useState(false);
  const storyRef = useRef<View>(null);

  const urlHistoria = `https://www.mivecindog.com.ar/historia/${perroId}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(urlHistoria)}`;
  const timeline = construirTimeline(registros);
  const accentHistoria = perdidoHistoria ? Colors.bad : Colors.primary;
  const caracteristicasHistoria = ([
    ['Raza', perro.raza], ['Color', perro.color], ['Tamaño', perro.tamano], ['Sexo', perro.sexo],
  ] as [string, string | undefined][]).filter(([, v]) => v);

  async function compartirQR() {
    setCompartiendoQR(true);
    try {
      const destino = new File(Paths.cache, `qr-${perro.nombre}-${Date.now()}.png`);
      const archivo = await File.downloadFileAsync(qrUrl, destino, { idempotent: true });
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(archivo.uri);
      } else {
        Alert.alert('QR', urlHistoria);
      }
    } catch {
      Alert.alert(t.perfilErrorGeneric, t.perroErrCompartirQr);
    } finally {
      setCompartiendoQR(false);
    }
  }

  async function handleCartelPDF() {
    setGenerandoPdf(true);
    try {
      const perdido = await perroEstaPerdido(perroId);
      const html = construirCartelHTML(perro, profile, perdido);
      const { uri } = await Print.printToFileAsync({ html, base64: false });
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, { mimeType: 'application/pdf', UTI: 'com.adobe.pdf' });
      }
    } catch {
      Alert.alert(t.perfilErrorGeneric, t.perroErrPdf);
    } finally {
      setGenerandoPdf(false);
    }
  }

  async function abrirHistoria() {
    const perdido = await perroEstaPerdido(perroId);
    setPerdidoHistoria(perdido);
    setHistoriaOpen(true);
  }

  async function handleCompartirHistoria() {
    if (!storyRef.current) return;
    setCompartiendoHistoria(true);
    try {
      const uri = await captureRef(storyRef, { format: 'png', quality: 1 });
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, { mimeType: 'image/png', UTI: 'public.png' });
      }
    } catch {
      Alert.alert(t.perfilErrorGeneric, t.perroErrHistoriaImg);
    } finally {
      setCompartiendoHistoria(false);
    }
  }

  return (
    <View style={styles.seccion}>
      <Text style={styles.seccionTitulo}>{t.perroSeccionExtras}</Text>

      {/* QR de collar */}
      <View style={{ marginTop: 10 }}>
        <TouchableOpacity style={styles.extraRow} onPress={() => setMostrarQR((v) => !v)}>
          <Text style={styles.extraRowText}>{t.perroQrCollar}</Text>
          <Text style={styles.extraRowChevron}>{mostrarQR ? '▲' : '▼'}</Text>
        </TouchableOpacity>
        {mostrarQR && (
          <View style={{ alignItems: 'center', paddingVertical: 12 }}>
            <Image source={{ uri: qrUrl }} style={styles.qrImg} />
            <Text style={styles.qrUrlText}>{urlHistoria}</Text>
            <TouchableOpacity style={styles.guardarPerfilBtn} onPress={compartirQR} disabled={compartiendoQR}>
              {compartiendoQR ? <ActivityIndicator color={Colors.white} size="small" /> : <Text style={styles.guardarPerfilBtnText}>{t.perroCompartirQr}</Text>}
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Cartel / historia / timeline / PDF — generados nativamente */}
      <View style={{ marginTop: 14, borderTopWidth: 1, borderTopColor: Colors.border, paddingTop: 14, gap: 8 }}>
        <Text style={styles.extraWebHint}>{t.perroExtraHint}</Text>
        <TouchableOpacity style={styles.extraRow} onPress={handleCartelPDF} disabled={generandoPdf}>
          <Text style={styles.extraRowText}>{t.perroExtraCartel}</Text>
          {generandoPdf && <ActivityIndicator size="small" color={Colors.primary} />}
        </TouchableOpacity>
        <TouchableOpacity style={styles.extraRow} onPress={abrirHistoria}>
          <Text style={styles.extraRowText}>{t.perroExtraHistoria}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.extraRow} onPress={() => setTimelineOpen(true)}>
          <Text style={styles.extraRowText}>{t.perroExtraTimeline}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.extraRow} onPress={handleCartelPDF} disabled={generandoPdf}>
          <Text style={styles.extraRowText}>{t.perroExtraCarnetPdf}</Text>
          {generandoPdf && <ActivityIndicator size="small" color={Colors.primary} />}
        </TouchableOpacity>
      </View>

      {/* Modal: línea de tiempo */}
      <Modal visible={timelineOpen} transparent animationType="slide" onRequestClose={() => setTimelineOpen(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheet, { maxHeight: '75%' }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <Text style={{ fontSize: 16, fontWeight: '900', color: Colors.ink }}>{t.perroTimelineTitle}</Text>
              <TouchableOpacity onPress={() => setTimelineOpen(false)}>
                <Text style={{ fontSize: 20, color: Colors.inkMuted }}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={{ maxHeight: 420 }}>
              {timeline.length === 0 ? (
                <Text style={styles.emptyRowText}>{t.perroTimelineVacio}</Text>
              ) : (
                timeline.map((ev, i) => (
                  <View key={i} style={{ flexDirection: 'row', gap: 10, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: Colors.border }}>
                    <Text style={{ fontSize: 18 }}>{ev.emoji}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 13, fontWeight: '700', color: Colors.ink }}>{ev.titulo}</Text>
                      {ev.sub ? <Text style={{ fontSize: 11, color: Colors.inkMuted, marginTop: 1 }}>{ev.sub}</Text> : null}
                      <Text style={{ fontSize: 11, color: Colors.inkMuted, marginTop: 2, fontWeight: '600' }}>{fmt(ev.fecha)}</Text>
                    </View>
                  </View>
                ))
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal: historia para Instagram/Facebook */}
      <Modal visible={historiaOpen} transparent animationType="slide" onRequestClose={() => setHistoriaOpen(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheet, { maxHeight: '90%' }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, width: '100%' }}>
              <Text style={{ fontSize: 16, fontWeight: '900', color: Colors.ink }}>{t.perroHistoriaTitle}</Text>
              <TouchableOpacity onPress={() => setHistoriaOpen(false)}>
                <Text style={{ fontSize: 20, color: Colors.inkMuted }}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={{ alignItems: 'center', paddingBottom: 24 }} showsVerticalScrollIndicator={false}>

            <View ref={storyRef} collapsable={false} style={{ width: 300, height: 533, backgroundColor: '#0a0a0a', borderRadius: 20, overflow: 'hidden' }}>
              <View style={{ height: 4, backgroundColor: accentHistoria }} />
              <View style={{ padding: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 8, fontWeight: '700', letterSpacing: 1.5, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>mivecindog.com.ar</Text>
                  <Text style={{ fontSize: perdidoHistoria ? 15 : 12, fontWeight: '900', color: accentHistoria, marginTop: 2 }}>
                    {perdidoHistoria ? '⚠ SE BUSCA · PERDIDO' : 'IDENTIFICACIÓN DE MASCOTA'}
                  </Text>
                </View>
                <View style={{ backgroundColor: accentHistoria, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 }}>
                  <Text style={{ fontSize: 8, fontWeight: '800', color: '#fff', textTransform: 'uppercase' }}>{perdidoHistoria ? 'PERDIDO' : 'REGISTRADO'}</Text>
                </View>
              </View>
              <View style={{ paddingHorizontal: 16, flexDirection: 'row', gap: 12 }}>
                {perro.foto_url
                  ? <Image source={{ uri: perro.foto_url }} style={{ width: 100, height: 116, borderRadius: 10, borderWidth: 2, borderColor: accentHistoria }} />
                  : <View style={{ width: 100, height: 116, borderRadius: 10, backgroundColor: accentHistoria + '33', alignItems: 'center', justifyContent: 'center' }}><Text style={{ fontSize: 32 }}>🐶</Text></View>
                }
                <View style={{ flex: 1, backgroundColor: accentHistoria + '22', borderRadius: 8, padding: 8 }}>
                  <Text style={{ fontSize: 7, fontWeight: '700', letterSpacing: 1.2, color: accentHistoria, textTransform: 'uppercase', marginBottom: 4 }}>Características</Text>
                  {caracteristicasHistoria.map(([label, value]) => (
                    <View key={label} style={{ flexDirection: 'row', marginBottom: 2 }}>
                      <Text style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)', fontWeight: '600', width: 44 }}>{label}</Text>
                      <Text style={{ fontSize: 9, color: '#fff', fontWeight: '700', flexShrink: 1 }}>{value}</Text>
                    </View>
                  ))}
                </View>
              </View>
              <View style={{ margin: 12, backgroundColor: accentHistoria, borderRadius: 8, padding: 10, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 7, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: 1.2, fontWeight: '700' }}>
                    {perdidoHistoria ? 'Si lo encontraste, avisá' : 'Dueño'}
                  </Text>
                  {profile?.nombre && (
                    <Text style={{ color: '#fff', fontSize: 11, fontWeight: '800', marginTop: 2 }}>{profile.nombre} {profile.apellido}</Text>
                  )}
                  {profile?.telefono && (
                    <Text style={{ color: '#fff', fontSize: 15, fontWeight: '900', letterSpacing: 0.5, marginTop: 2 }}>
                      {mostrarTelHistoria ? profile.telefono : profile.telefono.replace(/\d/g, '✱')}
                    </Text>
                  )}
                </View>
                <Text style={{ fontSize: 18, opacity: 0.5 }}>🐾</Text>
              </View>
              <View style={{ paddingVertical: 8, alignItems: 'center' }}>
                <Text style={{ fontSize: 10, fontWeight: '700', color: 'rgba(255,255,255,0.7)' }}>{t.perroHistoriaFelizYSano}</Text>
                <Text style={{ fontSize: 12, fontWeight: '900', color: '#fff', marginTop: 2 }}>{t.perroHistoriaSocio}</Text>
                <Text style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)', fontWeight: '800', marginTop: 6 }}>www.mivecindog.com.ar</Text>
              </View>
            </View>

            <TouchableOpacity
              style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 14 }}
              onPress={() => setMostrarTelHistoria((v) => !v)}
            >
              <View style={[styles.estadoChip, mostrarTelHistoria && styles.estadoChipActive]}>
                <Text style={[styles.estadoChipText, mostrarTelHistoria && styles.estadoChipTextActive]}>{t.perroHistoriaMostrarTel}</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.guardarPerfilBtn, { width: '100%', marginTop: 14 }]}
              onPress={handleCompartirHistoria}
              disabled={compartiendoHistoria}
            >
              {compartiendoHistoria
                ? <ActivityIndicator color={Colors.white} size="small" />
                : <Text style={styles.guardarPerfilBtnText}>{t.perroHistoriaCompartir}</Text>
              }
            </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container:         { flex: 1, backgroundColor: Colors.bg },
  inner:             { padding: 16, paddingTop: 8 },
  header:            { flexDirection: 'row', gap: 14, alignItems: 'center', backgroundColor: Colors.white, borderRadius: 20, padding: 14, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  foto:              { width: 80, height: 80, borderRadius: 16 },
  fotoPlaceholder:   { backgroundColor: Colors.cream, alignItems: 'center', justifyContent: 'center' },
  fotoEditBadge:     { position: 'absolute', bottom: -4, right: -4, width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: Colors.white },
  headerInfo:        { flex: 1 },
  nombre:            { fontSize: 20, fontWeight: '900', color: Colors.ink },
  sub:               { fontSize: 13, color: Colors.inkMuted, marginTop: 2 },
  chip:              { fontSize: 11, color: Colors.primary, marginTop: 4, fontWeight: '700' },
  historiaBtn:       { backgroundColor: Colors.primary, borderRadius: 16, paddingVertical: 13, alignItems: 'center', marginBottom: 16 },
  historiaBtnText:   { color: Colors.white, fontWeight: '800', fontSize: 15 },
  seccion:           { backgroundColor: Colors.white, borderRadius: 18, padding: 14, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 },
  seccionHeader:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  seccionTitulo:     { fontSize: 13, fontWeight: '800', color: Colors.ink },
  subirBtn:          { backgroundColor: Colors.primary + '20', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  subirBtnDisabled:  { opacity: 0.5 },
  subirBtnText:      { fontSize: 12, fontWeight: '800', color: Colors.primary },
  item:              { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: Colors.border },
  itemNombre:        { fontSize: 14, fontWeight: '600', color: Colors.ink, maxWidth: 180 },
  itemSub:           { fontSize: 11, color: Colors.inkMuted, marginTop: 2 },
  itemFecha:         { fontSize: 11, color: Colors.inkMuted, fontWeight: '600' },
  itemActions:       { flexDirection: 'row', alignItems: 'center', gap: 10 },
  verBtn:            { backgroundColor: Colors.primary, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  verBtnText:        { color: Colors.white, fontSize: 12, fontWeight: '700' },
  borrarBtn:         { fontSize: 18 },
  emptyRow:          { paddingVertical: 10 },
  emptyRowText:      { fontSize: 13, color: Colors.inkMuted + '80', fontWeight: '600' },
  campoLabel:        { fontSize: 11, fontWeight: '700', color: Colors.inkMuted, marginBottom: 4 },
  campoInput:        { backgroundColor: Colors.cream, borderRadius: 10, borderWidth: 1, borderColor: Colors.border, paddingHorizontal: 12, paddingVertical: 9, fontSize: 13, color: Colors.ink },
  campoInputArea:    { minHeight: 60, textAlignVertical: 'top' },
  subseccionTitulo:  { fontSize: 12, fontWeight: '800', color: Colors.ink, marginTop: 4, textTransform: 'uppercase' },
  estadoChip:        { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 10, backgroundColor: Colors.cream, borderWidth: 1, borderColor: Colors.border },
  estadoChipActive:  { backgroundColor: Colors.primary, borderColor: Colors.primary },
  estadoChipText:    { fontSize: 12, fontWeight: '600', color: Colors.inkMuted, textTransform: 'capitalize' },
  estadoChipTextActive: { color: Colors.white },
  guardarPerfilBtn:      { backgroundColor: Colors.primary, borderRadius: 12, paddingVertical: 11, alignItems: 'center', marginTop: 4 },
  guardarPerfilBtnText:  { color: Colors.white, fontWeight: '800', fontSize: 13 },
  infoLinea:         { flexDirection: 'row', gap: 6 },
  infoLineaLabel:    { fontSize: 12, fontWeight: '700', color: Colors.inkMuted, minWidth: 90 },
  infoLineaValor:    { fontSize: 12, color: Colors.ink, flex: 1 },
  galeriaGrid:       { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  galeriaItem:       { width: '31%', aspectRatio: 1 },
  galeriaImg:        { width: '100%', height: '100%', borderRadius: 12 },
  galeriaHint:       { fontSize: 10, color: Colors.inkMuted, marginTop: 8, fontStyle: 'italic' },
  extraRow:          { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 },
  extraRowText:      { fontSize: 13, fontWeight: '700', color: Colors.ink },
  extraRowChevron:   { fontSize: 11, color: Colors.inkMuted },
  qrImg:             { width: 180, height: 180, borderRadius: 16, backgroundColor: Colors.cream },
  qrUrlText:         { fontSize: 10, color: Colors.inkMuted, marginTop: 8, marginBottom: 4, textAlign: 'center' },
  extraWebHint:      { fontSize: 11, color: Colors.inkMuted, fontStyle: 'italic', marginBottom: 4 },
  sugerenciaList:     { borderWidth: 1, borderColor: Colors.border, borderRadius: 14, overflow: 'hidden', marginTop: 4, backgroundColor: Colors.white },
  sugerenciaItem:     { paddingHorizontal: 14, paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: Colors.border },
  sugerenciaText:     { fontSize: 14, color: Colors.ink, fontWeight: '600' },
  pickerBtn:          { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: Colors.white, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, borderWidth: 1, borderColor: Colors.border, marginTop: 4 },
  pickerBtnText:      { fontSize: 14, color: Colors.ink, fontWeight: '600' },
  pickerBtnChevron:   { fontSize: 16, color: Colors.inkMuted },
  modalOverlay:       { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalSheet:         { backgroundColor: Colors.white, borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingTop: 8, paddingBottom: 24, maxHeight: '70%' },
  modalTitulo:        { fontSize: 13, fontWeight: '800', color: Colors.inkMuted, paddingHorizontal: 18, paddingVertical: 10 },
  modalOption:        { paddingHorizontal: 18, paddingVertical: 14, borderTopWidth: 1, borderTopColor: Colors.border },
  modalOptionText:    { fontSize: 15, color: Colors.ink },
  modalOptionTextActive: { color: Colors.primary, fontWeight: '700' },
  pesoChartRow:       { flexDirection: 'row', alignItems: 'flex-end', gap: 10, marginTop: 10, paddingHorizontal: 4, minHeight: 100 },
  pesoBarCol:         { alignItems: 'center', gap: 4 },
  pesoBar:            { width: 20, borderRadius: 6, backgroundColor: Colors.primary },
  pesoBarValor:       { fontSize: 10, fontWeight: '700', color: Colors.ink },
  pesoBarFecha:       { fontSize: 9, color: Colors.inkMuted },
  pesoDelta:          { fontSize: 12, fontWeight: '700', marginTop: 10, textAlign: 'center' },
  turnoWrap:          { marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: Colors.border },
  turnoBadge:         { fontSize: 10, fontWeight: '800', marginTop: 2 },
  cancelarTurnoBtn:   { paddingHorizontal: 14, paddingVertical: 11, borderRadius: 12, borderWidth: 1, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center' },
});
