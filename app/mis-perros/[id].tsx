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
import { useAuth } from '@/contexts/AuthContext';
import { Colors } from '@/constants/colors';
import SeccionHistorial from '@/components/SeccionHistorial';

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

const ESTADOS_SALUD: { key: EstadoSalud; label: string }[] = [
  { key: 'saludable',       label: '✅ Saludable' },
  { key: 'en_tratamiento',  label: '💊 En tratamiento' },
  { key: 'en_recuperacion', label: '🩹 En recuperación' },
];

const SECCIONES: { tipo: TipoEstudio; titulo: string; emoji: string; aceptaArchivos: boolean }[] = [
  { tipo: 'laboratorio',              titulo: 'Análisis de Laboratorio',    emoji: '🧪', aceptaArchivos: true },
  { tipo: 'radiografia',              titulo: 'Radiografías',               emoji: '📡', aceptaArchivos: true },
  { tipo: 'ecografia',                titulo: 'Ecografías',                 emoji: '📈', aceptaArchivos: true },
  { tipo: 'certificado_chip',         titulo: 'Certificado de Chip',        emoji: '💾', aceptaArchivos: true },
  { tipo: 'certificado_cvi',          titulo: 'Certificado CVI',            emoji: '📋', aceptaArchivos: true },
  { tipo: 'certificado_antiparasitario', titulo: 'Certificado Antiparasitario', emoji: '💊', aceptaArchivos: true },
  { tipo: 'vacuna_antirrabica',       titulo: 'Vacuna Antirrábica',         emoji: '💉', aceptaArchivos: true },
  { tipo: 'airtag',                   titulo: 'AirTag / Rastreador',        emoji: '📍', aceptaArchivos: false },
];

function fmt(iso: string) {
  if (!iso) return '—';
  const [y, m, d] = iso.slice(0, 10).split('-');
  return `${d}/${m}/${y}`;
}

export default function PerroDetalleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isPro } = useAuth();
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
      Alert.alert('Error', 'No se pudo guardar. Verificá tu conexión.');
    } finally {
      setGuardandoPerfil(false);
    }
  }

  async function elegirFotoGaleria() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') { Alert.alert('Permiso denegado', 'Necesitamos acceso a tu galería'); return; }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: 'images', quality: 0.7 });
    if (result.canceled) return;
    setSubiendoFoto(true);
    try {
      const nombre = result.assets[0].fileName ?? `foto-${Date.now()}.jpg`;
      const url = await subirFotoGaleria(result.assets[0].uri, nombre);
      const nueva = await agregarFoto(id, url);
      setFotos((prev) => [nueva, ...prev]);
    } catch {
      Alert.alert('Error', 'No se pudo subir la foto.');
    } finally {
      setSubiendoFoto(false);
    }
  }

  async function cambiarFotoPerfil() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') { Alert.alert('Permiso denegado', 'Necesitamos acceso a tu galería'); return; }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: 'images', quality: 0.7 });
    if (result.canceled) return;
    setSubiendoFotoPerfil(true);
    try {
      const nombreArchivo = result.assets[0].fileName ?? `perfil-${Date.now()}.jpg`;
      const url = await subirFotoGaleria(result.assets[0].uri, nombreArchivo);
      await actualizarPerro(id, { foto_url: url });
      setPerro((prev) => prev ? { ...prev, foto_url: url } : prev);
    } catch {
      Alert.alert('Error', 'No se pudo cambiar la foto. Verificá tu conexión.');
    } finally {
      setSubiendoFotoPerfil(false);
    }
  }

  function borrarFotoGaleria(foto: FotoPerro) {
    Alert.alert('Eliminar foto', '¿Borrar esta foto de la galería?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar', style: 'destructive',
        onPress: async () => {
          try {
            await eliminarFoto(foto.id);
            setFotos((prev) => prev.filter((f) => f.id !== foto.id));
          } catch {
            Alert.alert('Error', 'No se pudo borrar la foto. Verificá tu conexión.');
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
    Alert.alert(titulo, '¿Seguro que querés borrar este registro?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar', style: 'destructive',
        onPress: async () => {
          try {
            await onConfirm();
          } catch (e) {
            const msg = e instanceof Error && e.message ? e.message : 'No se pudo borrar. Verificá tu conexión.';
            Alert.alert('Error', msg);
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
      Alert.alert('✅ Archivo subido', `${nombre} agregado correctamente.`);
    } catch (e) {
      Alert.alert('Error', 'No se pudo subir el archivo. Verificá tu conexión.');
    } finally {
      setSubiendo(null);
    }
  }

  async function agregarAirtag() {
    Alert.prompt?.(
      'AirTag / Rastreador',
      'Ingresá el número de serie o código del rastreador',
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
          Alert.alert('Error', 'No se pudo guardar el AirTag. Verificá tu conexión.');
        }
      }
    ) ?? Alert.alert('AirTag', 'Función disponible en iPhone');
  }

  async function compartirHistoria() {
    const url = `https://www.mivecindog.com.ar/historia/${id}`;
    await Share.share({
      message: `Historia Clínica de ${perro?.nombre ?? 'mi perro'} 🐾\n${url}`,
      url,
      title:   `Historia Clínica de ${perro?.nombre}`,
    });
  }

  async function borrarEstudio(estudio: Estudio) {
    Alert.alert(
      'Eliminar archivo',
      `¿Borrar "${estudio.nombre}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar', style: 'destructive',
          onPress: async () => {
            try {
              await eliminarEstudio(estudio.id);
              setEstudios((prev) => prev.filter((e) => e.id !== estudio.id));
            } catch {
              Alert.alert('Error', 'No se pudo borrar el archivo. Verificá tu conexión.');
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
        <Text style={{ fontSize: 15, fontWeight: '700', color: Colors.ink, textAlign: 'center' }}>No se pudo cargar</Text>
        <Text style={{ fontSize: 13, color: Colors.inkMuted, textAlign: 'center' }}>Verificá tu conexión e intentá de nuevo.</Text>
        <TouchableOpacity style={styles.guardarPerfilBtn} onPress={cargar}>
          <Text style={styles.guardarPerfilBtnText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }
  if (!perro)  return <Text style={{ textAlign: 'center', marginTop: 80 }}>Perro no encontrado</Text>;

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
        <Text style={styles.historiaBtnText}>📤  Compartir Historia Clínica</Text>
      </TouchableOpacity>

      {/* QR de collar + accesos a herramientas web */}
      <ExtrasSection perro={perro} perroId={id} />

      {/* Perfil extendido: alergias, veterinario, dirección, dieta, estado de salud */}
      <View style={styles.seccion}>
        <View style={styles.seccionHeader}>
          <Text style={styles.seccionTitulo}>📋  Perfil</Text>
          <TouchableOpacity style={styles.subirBtn} onPress={() => setEditandoPerfil((v) => !v)}>
            <Text style={styles.subirBtnText}>{editandoPerfil ? '✕' : 'Editar'}</Text>
          </TouchableOpacity>
        </View>

        {editandoPerfil ? (
          <View style={{ gap: 12 }}>
            <CampoTexto label="Nombre" value={formPerfil.nombre} onChange={(t) => setFormPerfil((f) => ({ ...f, nombre: t }))} placeholder="Ej: Bobby" />

            <View>
              <Text style={styles.campoLabel}>Raza</Text>
              <TextInput
                style={styles.campoInput}
                placeholder="Ej: Labrador, Ovejero, Mestizo…"
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
              <Text style={styles.campoLabel}>Color</Text>
              <TouchableOpacity style={styles.pickerBtn} onPress={() => setShowColorPicker(true)}>
                <Text style={styles.pickerBtnText}>{formPerfil.color || 'No sé / no recuerdo'}</Text>
                <Text style={styles.pickerBtnChevron}>⌄</Text>
              </TouchableOpacity>
            </View>

            <Modal visible={showColorPicker} transparent animationType="slide" onRequestClose={() => setShowColorPicker(false)}>
              <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowColorPicker(false)}>
                <View style={styles.modalSheet}>
                  <Text style={styles.modalTitulo}>Color principal</Text>
                  <TouchableOpacity style={styles.modalOption} onPress={() => { setFormPerfil((f) => ({ ...f, color: '' })); setShowColorPicker(false); }}>
                    <Text style={[styles.modalOptionText, formPerfil.color === '' && styles.modalOptionTextActive]}>No sé / no recuerdo</Text>
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
              <Text style={styles.campoLabel}>Sexo</Text>
              <View style={{ flexDirection: 'row', gap: 8, marginTop: 4 }}>
                {([['macho', 'Macho'], ['hembra', 'Hembra']] as const).map(([v, l]) => (
                  <TouchableOpacity key={v} style={[styles.estadoChip, formPerfil.sexo === v && styles.estadoChipActive]} onPress={() => setFormPerfil((f) => ({ ...f, sexo: f.sexo === v ? '' : v }))}>
                    <Text style={[styles.estadoChipText, formPerfil.sexo === v && styles.estadoChipTextActive]}>{l}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View>
              <Text style={styles.campoLabel}>Tamaño</Text>
              <View style={{ flexDirection: 'row', gap: 8, marginTop: 4 }}>
                {([['pequeño', 'Chico'], ['mediano', 'Mediano'], ['grande', 'Grande']] as const).map(([v, l]) => (
                  <TouchableOpacity key={v} style={[styles.estadoChip, formPerfil.tamano === v && styles.estadoChipActive]} onPress={() => setFormPerfil((f) => ({ ...f, tamano: f.tamano === v ? '' : v }))}>
                    <Text style={[styles.estadoChipText, formPerfil.tamano === v && styles.estadoChipTextActive]}>{l}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <CampoTexto label="Fecha de nacimiento (AAAA-MM-DD)" value={formPerfil.fecha_nac} onChange={(t) => setFormPerfil((f) => ({ ...f, fecha_nac: t }))} placeholder="Ej: 2022-05-14" />
            <CampoTexto label="Nº de microchip" value={formPerfil.chip} onChange={(t) => setFormPerfil((f) => ({ ...f, chip: t }))} />
            <CampoTexto label="Descripción" value={formPerfil.descripcion} onChange={(t) => setFormPerfil((f) => ({ ...f, descripcion: t }))} multiline />

            <CampoTexto label="Alergias" value={formPerfil.alergias} onChange={(t) => setFormPerfil((f) => ({ ...f, alergias: t }))} placeholder="Ej: pollo, polen" />
            <CampoTexto label="Veterinario habitual" value={formPerfil.vet_nombre} onChange={(t) => setFormPerfil((f) => ({ ...f, vet_nombre: t }))} />
            <CampoTexto label="Teléfono del veterinario" value={formPerfil.vet_telefono} onChange={(t) => setFormPerfil((f) => ({ ...f, vet_telefono: t }))} keyboardType="phone-pad" />
            <CampoTexto label="Dirección" value={formPerfil.direccion} onChange={(t) => setFormPerfil((f) => ({ ...f, direccion: t }))} />

            <View>
              <Text style={styles.campoLabel}>Estado de salud</Text>
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

            <Text style={styles.subseccionTitulo}>Dieta</Text>
            <CampoTexto label="Marca" value={formPerfil.dieta_marca} onChange={(t) => setFormPerfil((f) => ({ ...f, dieta_marca: t }))} />
            <CampoTexto label="Cantidad" value={formPerfil.dieta_cantidad} onChange={(t) => setFormPerfil((f) => ({ ...f, dieta_cantidad: t }))} placeholder="Ej: 200g" />
            <CampoTexto label="Frecuencia" value={formPerfil.dieta_frecuencia} onChange={(t) => setFormPerfil((f) => ({ ...f, dieta_frecuencia: t }))} placeholder="Ej: 2 veces al día" />
            <CampoTexto label="Notas de dieta" value={formPerfil.dieta_notas} onChange={(t) => setFormPerfil((f) => ({ ...f, dieta_notas: t }))} multiline />

            <TouchableOpacity style={styles.guardarPerfilBtn} onPress={guardarPerfil} disabled={guardandoPerfil}>
              {guardandoPerfil ? <ActivityIndicator color={Colors.white} size="small" /> : <Text style={styles.guardarPerfilBtnText}>Guardar</Text>}
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ gap: 6 }}>
            {perro.alergias && <InfoLinea label="Alergias" valor={perro.alergias} />}
            {(perro.vet_nombre || perro.vet_telefono) && (
              <InfoLinea label="Veterinario" valor={[perro.vet_nombre, perro.vet_telefono].filter(Boolean).join(' · ')} />
            )}
            {perro.direccion && <InfoLinea label="Dirección" valor={perro.direccion} />}
            {perro.estado_salud && (
              <InfoLinea label="Estado de salud" valor={ESTADOS_SALUD.find((e) => e.key === perro.estado_salud)?.label ?? perro.estado_salud} />
            )}
            {(perro.dieta_marca || perro.dieta_cantidad || perro.dieta_frecuencia) && (
              <InfoLinea label="Dieta" valor={[perro.dieta_marca, perro.dieta_cantidad, perro.dieta_frecuencia].filter(Boolean).join(' · ')} />
            )}
            {!perro.alergias && !perro.vet_nombre && !perro.direccion && !perro.estado_salud && !perro.dieta_marca && (
              <EmptyRow />
            )}
          </View>
        )}
      </View>

      {/* Vacunas */}
      <SeccionHistorial
        titulo="Carnet de Vacunas"
        emoji="💉"
        vacio="Sin vacunas registradas."
        campos={[
          { key: 'nombre',      label: 'Vacuna', requerido: true, placeholder: 'Ej: Antirrábica' },
          { key: 'fecha',       label: 'Fecha', tipo: 'date', requerido: true },
          { key: 'proxima',     label: 'Próxima dosis', tipo: 'date' },
          { key: 'veterinario', label: 'Veterinario' },
          { key: 'notas',       label: 'Notas', tipo: 'textarea' },
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
                  Próx: {fmt(v.proxima)}
                </Text>
              )}
            </View>
            <TouchableOpacity style={{ marginLeft: 10 }} onPress={editar}>
              <Text style={styles.borrarBtn}>✏️</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ marginLeft: 10 }}
              onPress={() => confirmarBorrar('Eliminar vacuna', async () => {
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
        titulo="Desparasitaciones"
        emoji="🐛"
        locked={!isPro}
        vacio="Sin desparasitaciones registradas."
        campos={[
          { key: 'producto',    label: 'Producto', requerido: true, placeholder: 'Ej: NexGard' },
          { key: 'tipo',        label: 'Tipo', tipo: 'select', opciones: ['interna', 'externa', 'ambas'], requerido: true },
          { key: 'fecha',       label: 'Fecha', tipo: 'date', requerido: true },
          { key: 'proxima',     label: 'Próxima dosis', tipo: 'date' },
          { key: 'veterinario', label: 'Veterinario', placeholder: 'Opcional' },
          { key: 'notas',       label: 'Notas', tipo: 'textarea' },
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
                  Próx: {fmt(d.proxima)}
                </Text>
              )}
            </View>
            <TouchableOpacity style={{ marginLeft: 10 }} onPress={editar}>
              <Text style={styles.borrarBtn}>✏️</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ marginLeft: 10 }}
              onPress={() => confirmarBorrar('Eliminar desparasitación', async () => {
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
        titulo="Medicamentos"
        emoji="💊"
        locked={!isPro}
        vacio="Sin medicamentos registrados."
        campos={[
          { key: 'nombre',       label: 'Medicamento', requerido: true },
          { key: 'dosis',        label: 'Dosis' },
          { key: 'frecuencia',   label: 'Frecuencia' },
          { key: 'fecha_inicio', label: 'Fecha inicio', tipo: 'date', requerido: true },
          { key: 'fecha_fin',    label: 'Fecha fin' },
          { key: 'notas',        label: 'Notas', tipo: 'textarea' },
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
              onPress={() => confirmarBorrar('Eliminar medicamento', async () => {
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
        titulo="Peso"
        emoji="⚖️"
        locked={!isPro}
        vacio="Sin registros de peso."
        campos={[
          { key: 'fecha',    label: 'Fecha', tipo: 'date', requerido: true },
          { key: 'valor_kg', label: 'Peso (kg)', tipo: 'numero', requerido: true },
          { key: 'notas',    label: 'Notas', tipo: 'textarea' },
        ]}
        items={pesos}
        onGuardar={async (v) => {
          const kg = Number(v.valor_kg.replace(',', '.'));
          if (!Number.isFinite(kg) || kg <= 0) {
            throw new Error('Ingresá un peso válido en kg (ej: 12.5).');
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
                onPress={() => confirmarBorrar('Eliminar registro de peso', async () => {
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
        titulo="Visitas al veterinario"
        emoji="🩺"
        locked={!isPro}
        vacio="Sin visitas registradas."
        campos={[
          { key: 'fecha',       label: 'Fecha', tipo: 'date', requerido: true },
          { key: 'motivo',      label: 'Motivo', requerido: true },
          { key: 'diagnostico', label: 'Diagnóstico', tipo: 'textarea' },
          { key: 'tratamiento', label: 'Tratamiento', tipo: 'textarea' },
          { key: 'vet_nombre',  label: 'Veterinario' },
          { key: 'notas',       label: 'Notas', tipo: 'textarea' },
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
              onPress={() => confirmarBorrar('Eliminar visita', async () => {
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
        titulo="Procedimientos y cirugías"
        emoji="🏥"
        locked={!isPro}
        vacio="Sin procedimientos registrados."
        campos={[
          { key: 'fecha',       label: 'Fecha', tipo: 'date', requerido: true },
          { key: 'tipo',        label: 'Tipo', tipo: 'select', opciones: TIPOS_PROCEDIMIENTO, requerido: true },
          { key: 'descripcion', label: 'Descripción', tipo: 'textarea', requerido: true },
          { key: 'vet_nombre',  label: 'Veterinario' },
          { key: 'notas',       label: 'Notas', tipo: 'textarea' },
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
              onPress={() => confirmarBorrar('Eliminar procedimiento', async () => {
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
        titulo="Contactos de emergencia"
        emoji="🆘"
        locked={false}
        vacio="Sin contactos de emergencia."
        campos={[
          { key: 'nombre',   label: 'Nombre', requerido: true },
          { key: 'relacion', label: 'Relación', placeholder: 'Ej: Familiar, paseador' },
          { key: 'telefono', label: 'Teléfono', requerido: true, placeholder: '+54 9 ...' },
          { key: 'notas',    label: 'Notas', tipo: 'textarea' },
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
              onPress={() => confirmarBorrar('Eliminar contacto', async () => {
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
          <Text style={styles.seccionTitulo}>🖼️  Galería de fotos</Text>
          {isPro ? (
            <TouchableOpacity style={styles.subirBtn} onPress={elegirFotoGaleria} disabled={subiendoFoto}>
              {subiendoFoto ? <ActivityIndicator color={Colors.primary} size="small" /> : <Text style={styles.subirBtnText}>+ Agregar</Text>}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.subirBtn} onPress={() => Linking.openURL('https://www.mivecindog.com.ar/planes')}>
              <Text style={styles.subirBtnText}>✨ Pro</Text>
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
        {fotos.length > 0 && <Text style={styles.galeriaHint}>Mantené presionada una foto para borrarla</Text>}
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
                  : <Text style={styles.subirBtnText}>{aceptaArchivos ? '+ Subir' : '+ Agregar'}</Text>
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
                          <Text style={styles.verBtnText}>Ver</Text>
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
  return (
    <View style={styles.emptyRow}>
      <Text style={styles.emptyRowText}>✗  Sin datos</Text>
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
  const [editando, setEditando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [borrando, setBorrando] = useState(false);

  function borrar() {
    if (!grooming) return;
    Alert.alert('Eliminar registro', '¿Seguro que querés borrar el registro de grooming?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar', style: 'destructive',
        onPress: async () => {
          setBorrando(true);
          try {
            await eliminarGrooming(grooming.id);
            onEliminado();
          } catch {
            Alert.alert('Error', 'No se pudo borrar. Verificá tu conexión.');
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
      Alert.alert('Fecha inválida', 'La última fecha tiene que tener el formato AAAA-MM-DD.');
      return;
    }
    const dias = parseInt(frecuencia, 10);
    if (!Number.isFinite(dias) || dias <= 0) {
      Alert.alert('Frecuencia inválida', 'Ingresá una cantidad de días válida (ej: 30).');
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
      const msg = e instanceof Error && e.message ? e.message : 'No se pudo guardar. Verificá tu conexión.';
      Alert.alert('Error', msg);
    } finally {
      setGuardando(false);
    }
  }

  return (
    <View style={styles.seccion}>
      <View style={styles.seccionHeader}>
        <Text style={styles.seccionTitulo}>🛁  Grooming</Text>
        {locked ? (
          <TouchableOpacity style={styles.subirBtn} onPress={() => Linking.openURL('https://www.mivecindog.com.ar/planes')}>
            <Text style={styles.subirBtnText}>✨ Pro</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.subirBtn} onPress={() => setEditando((v) => !v)}>
            <Text style={styles.subirBtnText}>{editando ? '✕' : grooming ? 'Editar' : '+ Agregar'}</Text>
          </TouchableOpacity>
        )}
      </View>

      {!locked && editando ? (
        <View style={{ gap: 10 }}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
            {TIPOS_GROOMING.map((t) => (
              <TouchableOpacity key={t} style={[styles.estadoChip, tipo === t && styles.estadoChipActive]} onPress={() => setTipo(t)}>
                <Text style={[styles.estadoChipText, tipo === t && styles.estadoChipTextActive]}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <CampoTexto label="Última fecha" value={ultimaFecha} onChange={setUltimaFecha} placeholder="AAAA-MM-DD" />
          <CampoTexto label="Frecuencia (días)" value={frecuencia} onChange={setFrecuencia} keyboardType="phone-pad" />
          <CampoTexto label="Notas" value={notas} onChange={setNotas} multiline />
          <TouchableOpacity style={styles.guardarPerfilBtn} onPress={guardar} disabled={guardando}>
            {guardando ? <ActivityIndicator color={Colors.white} size="small" /> : <Text style={styles.guardarPerfilBtnText}>Guardar</Text>}
          </TouchableOpacity>
        </View>
      ) : grooming ? (
        <View style={{ gap: 6 }}>
          <InfoLinea label="Tipo" valor={grooming.tipo} />
          <InfoLinea label="Última vez" valor={fmt(grooming.ultima_fecha)} />
          <InfoLinea label="Frecuencia" valor={`cada ${grooming.frecuencia_dias} días`} />
          {grooming.notas && <InfoLinea label="Notas" valor={grooming.notas} />}
          <TouchableOpacity onPress={borrar} disabled={borrando} style={{ marginTop: 4 }}>
            <Text style={{ color: Colors.bad, fontSize: 12, fontWeight: '700' }}>
              {borrando ? 'Borrando…' : '🗑 Borrar registro'}
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
      <Text style={styles.seccionTitulo}>📈  Evolución de peso</Text>
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
        {delta > 0 ? '▲' : delta < 0 ? '▼' : '—'} {Math.abs(delta)} kg vs. registro anterior
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
  const [editando, setEditando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [fecha, setFecha] = useState(turno?.fecha ?? '');
  const [nota,  setNota]  = useState(turno?.nota ?? '');

  const vencido = !!turno && new Date(`${turno.fecha}T00:00:00`) < new Date(new Date().toDateString());

  async function guardar() {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha.trim())) {
      Alert.alert('Fecha inválida', 'El turno tiene que tener el formato AAAA-MM-DD.');
      return;
    }
    setGuardando(true);
    try {
      await onRegistrar(fecha.trim(), nota.trim());
      setEditando(false);
    } catch {
      Alert.alert('Error', 'No se pudo guardar el turno. Verificá tu conexión.');
    } finally {
      setGuardando(false);
    }
  }

  return (
    <View style={styles.turnoWrap}>
      {editando ? (
        <View style={{ gap: 8 }}>
          <CampoTexto label="Fecha del turno" value={fecha} onChange={setFecha} placeholder="AAAA-MM-DD" />
          <CampoTexto label="Notas" value={nota} onChange={setNota} placeholder="Opcional" />
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TouchableOpacity style={[styles.guardarPerfilBtn, { flex: 1 }]} onPress={guardar} disabled={guardando}>
              {guardando ? <ActivityIndicator color={Colors.white} size="small" /> : <Text style={styles.guardarPerfilBtnText}>Guardar turno</Text>}
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelarTurnoBtn} onPress={() => setEditando(false)}>
              <Text style={{ color: Colors.inkMuted, fontWeight: '700', fontSize: 13 }}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : turno ? (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 12, fontWeight: '700', color: Colors.ink }}>
              📅 Próximo turno: {fmt(turno.fecha)}
            </Text>
            {turno.nota && <Text style={styles.itemSub}>{turno.nota}</Text>}
            <Text style={[styles.turnoBadge, { color: vencido ? Colors.bad : Colors.good }]}>
              {vencido ? '⚠️ Vencido' : '✓ Vigente'}
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
          <Text style={{ fontSize: 12, fontWeight: '700', color: Colors.primary }}>📅 + Registrar turno</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

function ExtrasSection({
  perro, perroId,
}: {
  perro: Perro; perroId: string;
}) {
  const [mostrarQR, setMostrarQR] = useState(false);
  const [compartiendoQR, setCompartiendoQR] = useState(false);

  const urlHistoria = `https://www.mivecindog.com.ar/historia/${perroId}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(urlHistoria)}`;

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
      Alert.alert('Error', 'No se pudo compartir el QR.');
    } finally {
      setCompartiendoQR(false);
    }
  }

  return (
    <View style={styles.seccion}>
      <Text style={styles.seccionTitulo}>✨  Extras</Text>

      {/* QR de collar */}
      <View style={{ marginTop: 10 }}>
        <TouchableOpacity style={styles.extraRow} onPress={() => setMostrarQR((v) => !v)}>
          <Text style={styles.extraRowText}>📱  QR para el collar</Text>
          <Text style={styles.extraRowChevron}>{mostrarQR ? '▲' : '▼'}</Text>
        </TouchableOpacity>
        {mostrarQR && (
          <View style={{ alignItems: 'center', paddingVertical: 12 }}>
            <Image source={{ uri: qrUrl }} style={styles.qrImg} />
            <Text style={styles.qrUrlText}>{urlHistoria}</Text>
            <TouchableOpacity style={styles.guardarPerfilBtn} onPress={compartirQR} disabled={compartiendoQR}>
              {compartiendoQR ? <ActivityIndicator color={Colors.white} size="small" /> : <Text style={styles.guardarPerfilBtnText}>Compartir QR</Text>}
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Herramientas que solo están en la web por ahora */}
      <View style={{ marginTop: 14, borderTopWidth: 1, borderTopColor: Colors.border, paddingTop: 14, gap: 8 }}>
        <Text style={styles.extraWebHint}>Estas herramientas por ahora solo están disponibles en la web (te va a pedir iniciar sesión la primera vez):</Text>
        <TouchableOpacity style={styles.extraRow} onPress={() => Linking.openURL(`https://www.mivecindog.com.ar/mis-perros/${perroId}/cartel`)}>
          <Text style={styles.extraRowText}>🚨  Cartel de perdido</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.extraRow} onPress={() => Linking.openURL(`https://www.mivecindog.com.ar/mis-perros/${perroId}/historia`)}>
          <Text style={styles.extraRowText}>📸  Historia para Instagram/Facebook</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.extraRow} onPress={() => Linking.openURL(`https://www.mivecindog.com.ar/mis-perros/${perroId}/timeline`)}>
          <Text style={styles.extraRowText}>🗓️  Línea de tiempo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.extraRow} onPress={() => Linking.openURL(`https://www.mivecindog.com.ar/mis-perros/${perroId}/cartel`)}>
          <Text style={styles.extraRowText}>🪪  Descargar carnet en PDF</Text>
        </TouchableOpacity>
      </View>
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
