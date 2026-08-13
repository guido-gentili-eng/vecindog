/** Traducciones de vecindog-mobile — es/en/pt, misma idea que patitas-app/contexts/LanguageContext.tsx */

export interface Translations {
  // ── Login ────────────────────────────────────────────
  loginTagline: string;
  loginTabLogin: string;
  loginTabRegister: string;
  loginEmailPh: string;
  loginPasswordPh: string;
  loginConfirmPasswordPh: string;
  loginBtnLogin: string;
  loginBtnRegister: string;
  loginForgot: string;
  loginOr: string;
  loginGoogle: string;
  loginGuest: string;
  loginGuestNote: string;
  loginTermsPrefix: string;
  loginTermsLink: string;
  loginTermsMiddle: string;
  loginPrivacyLink: string;
  loginTermsSuffix: string;
  loginAgeConsent: string;
  loginPendingTitle: string;
  loginPendingBodyPrefix: string;
  loginPendingBodySuffix: string;
  loginCodigoPh: string;
  loginConfirmarBtn: string;
  loginCodigoErr: string;
  loginResend: string;
  loginAlreadyConfirmed: string;
  loginErrFields: string;
  loginErrPasswordMismatch: string;
  loginErrPasswordMismatchSub: string;
  loginErrInvalidCredentials: string;
  loginErrEmailNotConfirmed: string;
  loginErrAlreadyRegistered: string;
  loginErrWeakPassword: string;
  loginErrRateLimit: string;
  loginErrEnterEmail: string;
  loginErrEnterEmailSub: string;
  loginRecoverySuccessTitle: string;
  loginRecoverySuccessSub: string;
  loginResendSuccessTitle: string;
  // ── Inicio ───────────────────────────────────────────
  homeSubGreeting: string;
  homeCatTodos: string;
  homeCatPerdidos: string;
  homeCatVistos: string;
  homeCatAdopcion: string;
  homeCatTransito: string;
  homeCuidadoTitle: string;
  homeCuidadoSub: string;
  homeTransporteTitle: string;
  homeTransporteSub: string;
  homeNuevo: string;
  homeAvisosRecientes: string;
  homeEmpty: string;
  homeErrorTitle: string;
  homeErrorSub: string;
  homeRetry: string;
  homeSinNombre: string;
  // ── Tabs (bottom nav) ────────────────────────────────
  tabInicio: string;
  tabAvisos: string;
  tabMapa: string;
  tabMisPerros: string;
  tabPerfil: string;
  // ── Avisos (listado) ─────────────────────────────────
  avisosTitle: string;
  avisosSearchPh: string;
  avisosCatTodos: string;
  avisosCatPerdido: string;
  avisosCatEncontrado: string;
  avisosCatAdopcion: string;
  avisosCatTransito: string;
  avisosCountSingular: string;
  avisosCountPlural: string;
  avisosErrorText: string;
  avisosEmpty: string;
  avisosPublicar: string;
  avisosBadgeResuelto: string;
  avisosBadgeEnLaCalle: string;
  avisosDiasRestantesSuffix: string;
  avisosVenceHoy: string;
  // ── Mapa ─────────────────────────────────────────────
  mapaLeyendaPerdido: string;
  mapaLeyendaEncontrado: string;
  mapaLeyendaAdopcion: string;
  mapaLeyendaTransito: string;
  mapaVerAviso: string;
  mapaAvisosSuffix: string;
  mapaWebTitle: string;
  mapaWebSub: string;
  mapaWebCargadosSuffix: string;
  // ── Mis perros (listado) ─────────────────────────────
  misPerrosTitle: string;
  misPerrosCountSingular: string;
  misPerrosCountPlural: string;
  misPerrosAmigos: string;
  misPerrosAmigosLocked: string;
  misPerrosAgregar: string;
  misPerrosEmptyTitle: string;
  misPerrosEmptySub: string;
  misPerrosEmptyBtn: string;
  // ── Perfil ───────────────────────────────────────────
  perfilGuestTitle: string;
  perfilGuestSub: string;
  perfilGuestBtn: string;
  perfilDatosPersonales: string;
  perfilEditar: string;
  perfilCancelar: string;
  perfilFieldNombre: string;
  perfilFieldApellido: string;
  perfilFieldTelefono: string;
  perfilFieldTelefonoPh: string;
  perfilFieldCiudad: string;
  perfilFieldCiudadPh: string;
  perfilFieldProvincia: string;
  perfilFieldProvinciaPh: string;
  perfilFieldPais: string;
  perfilFieldPaisPh: string;
  perfilFieldDireccion: string;
  perfilFieldDireccionPh: string;
  perfilGuardarCambios: string;
  perfilCompletarTitle: string;
  perfilCompletarSub: string;
  perfilCompletarBtn: string;
  perfilRowNombre: string;
  perfilRowTelefono: string;
  perfilRowCiudad: string;
  perfilRowProvincia: string;
  perfilRowPais: string;
  perfilRowDireccion: string;
  perfilSosTitle: string;
  perfilSosSub: string;
  perfilSosSubLocked: string;
  perfilLinkMisAvisos: string;
  perfilLinkPublicitate: string;
  perfilLinkAdmin: string;
  perfilLinkWeb: string;
  perfilLinkTerminos: string;
  perfilLinkPrivacidad: string;
  perfilIdioma: string;
  perfilBiometricTitle: string;
  perfilBiometricSub: string;
  perfilBiometricEnableFail: string;
  lockScreenTitle: string;
  lockScreenSub: string;
  lockScreenBtn: string;
  lockScreenSalir: string;
  perfilCerrarSesion: string;
  perfilCerrarSesionConfirm: string;
  perfilCerrarSesionSalir: string;
  perfilEliminarCuenta: string;
  perfilEliminarCuentaConfirmTitle: string;
  perfilEliminarCuentaConfirmSub: string;
  perfilEliminarCuentaBtn: string;
  perfilEliminarCuentaEnCurso: string;
  perfilVersion: string;
  perfilPermisoDenegadoTitle: string;
  perfilPermisoDenegadoSub: string;
  perfilErrorFotoSub: string;
  perfilCamposRequeridosTitle: string;
  perfilCamposRequeridosSub: string;
  perfilGuardadoTitle: string;
  perfilGuardadoSub: string;
  perfilErrorGeneric: string;
  perfilSinDescripcion: string;
  perfilModalSosTitle: string;
  perfilModalSosSub: string;
  perfilModalSinPerros: string;
  perfilModalCualSePerdio: string;
  perfilModalErrorEnvio: string;
  perfilModalAlertarBtn: string;
  perfilModalCerrar: string;
  perfilModalEnviadaTitle: string;
  perfilModalAvisamosPrefix: string;
  perfilModalAmigoSingular: string;
  perfilModalAmigoPlural: string;
  perfilModalAvisamosSuffix: string;
  perfilModalSinAmigos: string;
  perfilModalListo: string;
  // ── Nuevo perro ──────────────────────────────────────
  nuevoPerroFotoAgregar: string;
  nuevoPerroNombre: string;
  nuevoPerroNombrePh: string;
  nuevoPerroRaza: string;
  nuevoPerroRazaPh: string;
  nuevoPerroColor: string;
  nuevoPerroColorNoSe: string;
  nuevoPerroColorModalTitulo: string;
  nuevoPerroSexo: string;
  nuevoPerroSexoMacho: string;
  nuevoPerroSexoHembra: string;
  nuevoPerroTamano: string;
  nuevoPerroFechaNac: string;
  nuevoPerroFechaNacPh: string;
  nuevoPerroChip: string;
  nuevoPerroChipPh: string;
  nuevoPerroEsterilizado: string;
  nuevoPerroDescripcion: string;
  nuevoPerroDescripcionPh: string;
  nuevoPerroGuardar: string;
  nuevoPerroErrPermiso: string;
  nuevoPerroErrFaltaNombreTitle: string;
  nuevoPerroErrFaltaNombreSub: string;
  nuevoPerroListoTitle: string;
  nuevoPerroListoSubSuffix: string;
  nuevoPerroVerMisPerros: string;
  nuevoPerroErrGuardarSub: string;
  // ── Perfil de perro (detalle) — campos compartidos ───
  campoFecha: string;
  campoNotas: string;
  campoVeterinario: string;
  campoTelefono: string;
  campoNombre: string;
  campoTipo: string;
  campoDescripcion: string;
  campoProximaDosis: string;
  campoDosis: string;
  campoFrecuencia: string;
  campoFechaInicio: string;
  campoFechaFin: string;
  campoDiagnostico: string;
  campoTratamiento: string;
  campoMotivo: string;
  campoRelacion: string;
  campoProducto: string;
  campoMedicamento: string;
  campoPesoKg: string;
  campoOpcionalPh: string;
  campoVacunaLabel: string;
  campoVacunaPh: string;
  genericGuardar: string;
  genericGuardarCambios: string;
  genericEliminar: string;
  genericErrGuardarConexion: string;
  genericAgregarBtn: string;
  genericVer: string;
  genericEditar: string;
  errFechaInvalidaTitle: string;
  perroSeccionPerfil: string;
  perroCampoFechaNacLabel: string;
  perroCampoFechaNacPh: string;
  perroCampoChipLabel: string;
  perroCampoAlergiasLabel: string;
  perroCampoAlergiasPh: string;
  perroCampoVetNombreLabel: string;
  perroCampoVetTelefonoLabel: string;
  perroCampoDireccionLabel: string;
  perroCampoEstadoSalud: string;
  estadoSaludSaludable: string;
  estadoSaludEnTratamiento: string;
  estadoSaludEnRecuperacion: string;
  perroDietaTitulo: string;
  perroDietaMarca: string;
  perroDietaCantidad: string;
  perroDietaCantidadPh: string;
  perroDietaFrecuenciaPh: string;
  perroDietaNotas: string;
  perroSexoMachoLabel: string;
  perroSexoHembraLabel: string;
  perroTamanoChico: string;
  perroTamanoMediano: string;
  perroTamanoGrande: string;
  perroSeccionVacunas: string;
  perroVacioVacunas: string;
  perroCampoVacunaNombrePh: string;
  perroSeccionDesparasitaciones: string;
  perroVacioDesparasitaciones: string;
  perroCampoProductoPh: string;
  perroSeccionMedicamentos: string;
  perroVacioMedicamentos: string;
  perroSeccionPeso: string;
  perroVacioPeso: string;
  perroPesoInvalido: string;
  perroSeccionVisitas: string;
  perroVacioVisitas: string;
  perroSeccionProcedimientos: string;
  perroVacioProcedimientos: string;
  perroSeccionGrooming: string;
  perroSeccionContactos: string;
  perroVacioContactos: string;
  perroCampoRelacionPh: string;
  perroCampoTelefonoPh: string;
  perroSeccionGaleria: string;
  perroGaleriaAgregar: string;
  perroGaleriaPro: string;
  perroGaleriaHint: string;
  perroSeccionExtras: string;
  perroQrCollar: string;
  perroCompartirQr: string;
  perroExtraHint: string;
  perroExtraCartel: string;
  perroExtraHistoria: string;
  perroExtraTimeline: string;
  perroExtraCarnetPdf: string;
  perroHistoriaBtn: string;
  perroHistoriaClinicaDePrefix: string;
  perroMiPerroFallback: string;
  perroEstudioLaboratorio: string;
  perroEstudioRadiografia: string;
  perroEstudioEcografia: string;
  perroEstudioCertChip: string;
  perroEstudioCertCvi: string;
  perroEstudioCertAntiparasitario: string;
  perroEstudioVacunaAntirrabica: string;
  perroEstudioAirtag: string;
  perroSubirBtn: string;
  perroArchivoSubidoTitle: string;
  perroArchivoSubidoSuffix: string;
  perroAirtagPrompt: string;
  perroAirtagOnlyIphoneTitle: string;
  perroAirtagOnlyIphoneSub: string;
  perroErrGuardarAirtag: string;
  perroErrSubirArchivo: string;
  perroErrCompartirQr: string;
  perroErrPdf: string;
  perroErrHistoriaImg: string;
  perroTimelineTitle: string;
  perroTimelineVacio: string;
  perroHistoriaTitle: string;
  perroHistoriaMostrarTel: string;
  perroHistoriaCompartir: string;
  perroHistoriaFelizYSano: string;
  perroHistoriaSocio: string;
  perroNoEncontrado: string;
  perroErrCargarTitle: string;
  perroErrCargarSub: string;
  perroErrSubirFoto: string;
  perroErrCambiarFoto: string;
  perroErrBorrarFoto: string;
  perroConfirmBorrarSub: string;
  perroConfirmBorrarFotoTitle: string;
  perroConfirmBorrarFotoSub: string;
  perroEliminarVacuna: string;
  perroEliminarDesparasitacion: string;
  perroEliminarMedicamento: string;
  perroEliminarPeso: string;
  perroEliminarVisita: string;
  perroEliminarProcedimiento: string;
  perroEliminarContacto: string;
  perroProximaDosisPrefix: string;
  groomingUltimaFecha: string;
  groomingFrecuenciaDias: string;
  groomingUltimaVez: string;
  groomingCadaPrefix: string;
  groomingDiasSuffix: string;
  groomingBorrarRegistro: string;
  groomingBorrando: string;
  groomingFechaInvalidaSub: string;
  groomingFrecuenciaInvalidaTitle: string;
  groomingFrecuenciaInvalidaSub: string;
  groomingConfirmBorrarTitle: string;
  groomingConfirmBorrarSub: string;
  groomingTipoBano: string;
  groomingTipoPeluqueria: string;
  groomingTipoAmbos: string;
  turnoFechaInvalida: string;
  turnoErrGuardar: string;
  turnoFechaLabel: string;
  turnoGuardarBtn: string;
  turnoProximoPrefix: string;
  turnoVencido: string;
  turnoVigente: string;
  turnoRegistrarBtn: string;
  perroPesoEvolucion: string;
  perroPesoVsAnterior: string;
  historialEditando: string;
  historialPro: string;
  historialVacioDefault: string;
  historialFaltaDatoTitle: string;
  historialCompletaPrefix: string;
  historialCompletaSuffix: string;
  historialFechaInvalidaMiddle: string;
  historialFechaInvalidaEnd: string;
  dateFormatPh: string;
  perroEliminarArchivoTitle: string;
  perroBorrarArchivoPrefix: string;
  // ── Reset password ───────────────────────────────────
  resetErrPasswordCorta: string;
  resetErrPasswordMismatch: string;
  resetErrLinkInvalido: string;
  resetListoTitle: string;
  resetListoSub: string;
  resetContinuar: string;
  resetTitle: string;
  resetSub: string;
  resetPasswordPh: string;
  resetConfirmPh: string;
  resetGuardarBtn: string;
  // ── Notificaciones ───────────────────────────────────
  notifTitle: string;
  notifNuevaSingular: string;
  notifNuevaPlural: string;
  notifMarcarTodas: string;
  notifEmptyTitle: string;
  notifEmptySub: string;
  notifAceptar: string;
  notifRechazar: string;
  notifLoEncontre: string;
  notifSigoBuscando: string;
  notifErrGeneric: string;
  notifHacePrefix: string;
  notifMinSuffix: string;
  notifHsSuffix: string;
  notifDiasSuffix: string;
  notifTuVecinoFallback: string;
  notifAceptoSolicitudSuffix: string;
  // ── Amigos ───────────────────────────────────────────
  amigosVolver: string;
  amigosTitle: string;
  amigosTabMisAmigos: string;
  amigosTabBuscar: string;
  amigosSolicitudesRecibidas: string;
  amigosUsuarioFallback: string;
  amigosAlguienFallback: string;
  amigosAmigosLabel: string;
  amigosEmptyTitle: string;
  amigosEmptySub: string;
  amigosSearchPh: string;
  amigosNoEncontrado: string;
  amigosEscribeNombre: string;
  amigosDePrefix: string;
  amigosYaAmigos: string;
  amigosPendiente: string;
  // ── Buscar por foto ──────────────────────────────────
  bpfLockedTitle: string;
  bpfLockedSub: string;
  bpfVerPlanes: string;
  bpfSubtitulo: string;
  bpfElegirGaleria: string;
  bpfAnalizando: string;
  bpfTomarFoto: string;
  bpfEmpezarDeNuevo: string;
  bpfColorMatch: string;
  bpfRazaMatch: string;
  bpfTamanoMatch: string;
  bpfConCollar: string;
  bpfSinCollar: string;
  bpfConChapita: string;
  bpfSinChapita: string;
  bpfErrPermisoGaleria: string;
  bpfErrPermisoCamara: string;
  bpfErrIniciarSesionTitle: string;
  bpfErrIniciarSesionSub: string;
  bpfErrAnalizarDefault: string;
  bpfErrAnalizarTitle: string;
  bpfErrAnalizarFotoSub: string;
  bpfErrBuscar: string;
  bpfLabelColor: string;
  bpfLabelTamano: string;
  bpfLabelRaza: string;
  bpfTeniaCollar: string;
  bpfTeniaChapita: string;
  bpfSi: string;
  bpfNo: string;
  bpfNoSe: string;
  bpfBuscarBtn: string;
  bpfSinCoincidencias: string;
  bpfCoincidenciaSingular: string;
  bpfCoincidenciaPlural: string;
  bpfPerdido: string;
  bpfEncontrado: string;
  // ── Detalle de aviso ─────────────────────────────────
  postMotivoFalsa: string;
  postMotivoInapropiado: string;
  postMotivoSpam: string;
  postMotivoMaltrato: string;
  postMotivoOtro: string;
  postErrIniciarSesionReporte: string;
  postReportarPregunta: string;
  postErrReporte: string;
  postReporteEnviadoTitle: string;
  postReporteEnviadoSub: string;
  postErrIniciarSesionContacto: string;
  postPushTuAviso: string;
  postPushTitlePrefix: string;
  postPushQuiereContactarte: string;
  postSolicitudEnviadaTitle: string;
  postSolicitudEnviadaSub: string;
  postErrSolicitud: string;
  postNoEncontrado: string;
  postSharePerroFallback: string;
  postConfirmRenovarTitle: string;
  postConfirmRenovarSub: string;
  postSiRenovar: string;
  postRenovarListoTitle: string;
  postRenovarListoSub: string;
  postErrRenovar: string;
  postConfirmResueltoPerdidoTitle: string;
  postConfirmResueltoOtroTitle: string;
  postConfirmResueltoPerdidoSub: string;
  postConfirmResueltoOtroSub: string;
  postSiMarcarResuelto: string;
  postResueltoListoTitle: string;
  postResueltoListoSub: string;
  postErrResuelto: string;
  postConfirmBorrarTitle: string;
  postBorrarBtnConfirm: string;
  postErrBorrar: string;
  postResuelto: string;
  postActivo: string;
  postDatoEspecie: string;
  postDatoRaza: string;
  postDatoColor: string;
  postDatoTamano: string;
  postDatoZona: string;
  postDatoCiudad: string;
  postDatoFecha: string;
  postDescripcionTitle: string;
  postLoginPromptText: string;
  postLoginLink: string;
  postSinContactoText: string;
  postSolicitudEnviadaTexto: string;
  postSolicitarContactoBtn: string;
  postWhatsappBtn: string;
  postWaMensajeDefault: string;
  postManagePanelAdmin: string;
  postManagePanelDueno: string;
  postRenovarBtn: string;
  postMarcarResueltoAdmin: string;
  postYaLoEncontre: string;
  postMarcarResuelto: string;
  postBorrarAvisoBtn: string;
  postReportado: string;
  postReportarBtn: string;
  // ── Admin: reportes ──────────────────────────────────
  adminAccesoRestringido: string;
  adminSinRevisar: string;
  adminReportesLabel: string;
  adminVerTodos: string;
  adminSoloNuevos: string;
  adminSinPendientes: string;
  adminSinReportes: string;
  adminRevisado: string;
  adminMotivo: string;
  adminVerAviso: string;
  adminDesestimar: string;
  adminEliminar: string;
  adminConfirmEliminarTitle: string;
  adminConfirmEliminarSub: string;
  // ── Headers de Stack (_layout) ───────────────────────
  headerAviso: string;
  headerReportes: string;
  headerBuscarPorFoto: string;
  headerNuevaContrasena: string;
  // ── Cuidado (landing) ────────────────────────────────
  cuidadoCuidadorFallback: string;
  cuidadoBuscaCuidadorFallback: string;
  cuidadoDesactivar: string;
  cuidadoVerPerfil: string;
  cuidadoVolver: string;
  cuidadoComunidad: string;
  cuidadoTitle: string;
  cuidadoSub: string;
  cuidadoWarning: string;
  cuidadoBuscoTitle: string;
  cuidadoBuscoSub: string;
  cuidadoBuscandoSection: string;
  cuidadoEmptyBusco: string;
  cuidadoQuieroTitle: string;
  cuidadoQuieroSub: string;
  cuidadoDisponiblesSection: string;
  cuidadoEmptyCuidadores: string;
  // ── Quiero cuidar ────────────────────────────────────
  qcExp1: string; qcExp2: string; qcExp3: string; qcExp4: string; qcExp5: string;
  qcDisp1: string; qcDisp2: string; qcDisp3: string; qcDisp4: string; qcDisp5: string;
  qcErrLogin: string;
  qcErrNombre: string;
  qcErrZona: string;
  qcErrContacto: string;
  qcErrContactoDigits: string;
  qcExperienciaPrefix: string;
  qcDisponibilidadPrefix: string;
  qcPuedeCuidarPrefix: string;
  qcPerroSingular: string;
  qcPerroPlural: string;
  qcALaVezSuffix: string;
  qcTienePerrosSiTexto: string;
  qcTienePerrosNoTexto: string;
  qcErrRegistrar: string;
  qcLoginRequired: string;
  qcProTitle: string;
  qcProSub: string;
  qcPublicadoTitle: string;
  qcPublicadoSub: string;
  qcTitle: string;
  qcSub: string;
  qcNombreLabel: string;
  qcNombrePh: string;
  qcExperienciaLabel: string;
  qcDisponibilidadLabel: string;
  qcCuantosPerrosLabel: string;
  qcTienesPerrosLabel: string;
  qcInfoAdicionalLabel: string;
  qcInfoAdicionalPh: string;
  qcZonaLabel: string;
  qcZonaPh: string;
  qcContactoLabel: string;
  qcContactoPh: string;
  qcSubmitBtn: string;
  // ── Busco cuidador ───────────────────────────────────
  bcErrLogin: string;
  bcErrZona: string;
  bcErrContacto: string;
  bcErrContactoDigits: string;
  bcErrFechas: string;
  bcFechasPrefix: string;
  bcFechasAlSuffix: string;
  bcDesdeElPrefix: string;
  bcDescDefault: string;
  bcErrPublicar: string;
  bcLoginRequired: string;
  bcLoginBtn: string;
  bcPublicadoTitle: string;
  bcPublicadoSub: string;
  bcTitle: string;
  bcSub: string;
  bcParaCualPerro: string;
  bcSinPerros: string;
  bcRegistrarUno: string;
  bcContinuarSinPerro: string;
  bcFechasLabel: string;
  bcDesdeLabel: string;
  bcHastaLabel: string;
  bcDescLabel: string;
  bcDescPh: string;
  bcSubmitBtn: string;
  // ── Ratings (cuidador/transportador) ─────────────────
  ratingModalPuntuacion: string;
  ratingErrSeleccionaPuntuacion: string;
  ratingComoCuido: string;
  ratingExcelente: string;
  ratingBueno: string;
  ratingRegular: string;
  ratingFuePuntual: string;
  ratingBuenaCom: string;
  ratingLoRecomienda: string;
  ratingComentarioLabel: string;
  ratingComentarioPh: string;
  ratingErrGuardarDefault: string;
  ratingNoEncontrado: string;
  ratingCalificaciones: string;
  ratingCalificar: string;
  ratingGuardadoTexto: string;
  ratingSinCalificaciones: string;
  ratingCuidadoPrefix: string;
  ratingPuntual: string;
  ratingBuenaComBadge: string;
  ratingLoRecomiendaBadge: string;
  ratingContactarWhatsapp: string;
  ratingDisponibilidadPrefix: string;
  ratingCalificacionesSuffix: string;
  ratingSobre: string;
  cuidadorFallbackNombre: string;
  cuidadorModalTitle: string;
  transportadorFallbackNombre: string;
  transportadorModalTitle: string;
  // ── Transporte (landing) ─────────────────────────────
  transportadorFallback: string;
  transporteComunidad: string;
  transporteTitle: string;
  transporteSub: string;
  transporteQuieroTitle: string;
  transporteQuieroSub: string;
  transporteDisponiblesSection: string;
  transporteEmptyDisponibles: string;
  // ── Quiero transportar ───────────────────────────────
  qtDisp5: string;
  qtVehiculoAuto: string;
  qtVehiculoCamioneta: string;
  qtVehiculoCamion: string;
  qtVehiculoPrefix: string;
  qtVehiculoCamionLabel: string;
  qtPuedeTransportarPrefix: string;
  qtLoginRequired: string;
  qtProSub: string;
  qtPublicadoTitle: string;
  qtPublicadoSub: string;
  qtTitle: string;
  qtSub: string;
  qtCuantosPerrosLabel: string;
  qtVehiculoLabel: string;
  qtInfoAdicionalPh: string;
  qtSubmitBtn: string;
  // ── Red Vecindog (landing) ───────────────────────────
  rvBenef1Titulo: string; rvBenef1Desc: string;
  rvBenef2Titulo: string; rvBenef2Desc: string;
  rvBenef3Titulo: string; rvBenef3Desc: string;
  rvBenef4Titulo: string; rvBenef4Desc: string;
  rvList1: string; rvList2: string; rvList3: string; rvList4: string; rvList5: string; rvList6: string;
  rvChipPromo: string;
  rvChipRegularPrefix: string;
  rvChipRegularSuffix: string;
  rvTitle: string;
  rvSub: string;
  rvCtaBtn: string;
  rvElegiRubro: string;
  rvPromoTitulo: string;
  rvPromoDesc: string;
  rvPricingTitulo: string;
  rvPricingPerSuffix: string;
  rvUnirmeBtn: string;
  rvFinalTitulo: string;
  rvFinalSub: string;
  rvModalTitulo: string;
  rvModalSubPromo: string;
  rvErrNombreNegocio: string;
  rvErrCategoria: string;
  rvErrCiudad: string;
  rvErrTelefono: string;
  rvErrDireccion: string;
  rvErrEmail: string;
  rvErrTelefonoDigits: string;
  rvErrLogin: string;
  rvErrSesionExpirada: string;
  rvErrProcesar: string;
  rvErrConexion: string;
  rvRegistradoTitulo: string;
  rvRegistradoSub: string;
  rvCerrarBtn: string;
  rvCambiarFoto: string;
  rvSubirFoto: string;
  rvNombreNegocioLabel: string;
  rvNombreNegocioPh: string;
  rvCategoriaLabel: string;
  rvSeleccionaCategoria: string;
  rvDescBreveLabel: string;
  rvDescBrevePh: string;
  rvDireccionLabel: string;
  rvDireccionPh: string;
  rvPermisoDenegadoMapa: string;
  rvCiudadLabel: string;
  rvCiudadPh: string;
  rvCambiarBtn: string;
  rvDiasAtencionLabel: string;
  rvDia1: string; rvDia2: string; rvDia3: string;
  rvAperturaLabel: string;
  rvCierreLabel: string;
  rvTelefonoLabel: string;
  rvLinkLabel: string;
  rvEmailLabel: string;
  rvTrialNote: string;
  rvActivarBtn: string;
  rvRegistrarBtn: string;
  rvIosActivarBtn: string;
  rvIosPagoNote: string;
  rvIosBrowseSub: string;
  // ── Red Vecindog (categoria) ─────────────────────────
  rvcNoEncontrada: string;
  rvcCompletaCiudad: string;
  rvcCompletaCiudadSub: string;
  rvcIrPerfil: string;
  rvcProSub: string;
  rvcVerPlanes: string;
  rvcSinNegociosPrefix: string;
  rvcSumate: string;
  rvcRegistrarNegocio: string;
  // ── Comercio (detalle) ───────────────────────────────
  comercioCalificarTitle: string;
  comercioComentarioPh: string;
  comercioNoEncontrado: string;
  comercioLlamar: string;
  comercioWhatsapp: string;
  comercioVisitarSitio: string;
  comercioNovedades: string;
  comercioResenas: string;
  comercioGuardadoText: string;
  comercioSinResenas: string;
  // ── Publicitate (landing) ────────────────────────────
  pubParaNegocios: string;
  pubTitle: string;
  pubSub: string;
  pubWhatsapp: string;
  pubEmail: string;
  pubStatVecinosLabel: string;
  pubStatTodoValue: string; pubStatArgentinaLabel: string;
  pubStat100Value: string; pubStatOrganicoLabel: string;
  pubStatDirectoValue: string; pubStatDuenosLabel: string;
  pubFormatosTitle: string;
  pubFormato1Label: string; pubFormato1Badge: string; pubFormato1Desc: string;
  pubFormato2Label: string; pubFormato2Badge: string; pubFormato2Desc: string;
  pubFormato3Label: string; pubFormato3Badge: string; pubFormato3Desc: string;
  pubComoFuncionaTitle: string;
  pubPaso1Titulo: string; pubPaso1Desc: string;
  pubPaso2Titulo: string; pubPaso2Desc: string;
  pubPaso3Titulo: string; pubPaso3Desc: string;
  pubPlanesTitle: string;
  pubPlanesSub: string;
  pubPlanBasico: string; pubPlanEstandar: string; pubPlanPremium: string;
  pubSlotCard: string; pubSlotPanel: string; pubSlotBanner: string;
  pubMasElegido: string;
  pubArsMes: string;
  pubElegirPrefix: string;
  pubNecesitasAlgo: string;
  pubPorQueTitle: string;
  pubPorQueSub: string;
  pubPorQue1Titulo: string; pubPorQue1Desc: string;
  pubPorQue2Titulo: string; pubPorQue2Desc: string;
  pubPorQue3Titulo: string; pubPorQue3Desc: string;
  pubPorQue4Titulo: string; pubPorQue4Desc: string;
  pubFaqTitle: string;
  pubFaq1Q: string; pubFaq1A: string;
  pubFaq2Q: string; pubFaq2A: string;
  pubFaq3Q: string; pubFaq3A: string;
  pubFaq4Q: string; pubFaq4A: string;
  pubFinalTitle: string;
  pubFinalSub: string;
  pubPlanBasicoLabel: string; pubPlanEstandarLabel: string; pubPlanPremiumLabel: string;
  pubPrimerMesGratisPrefix: string;
  pubCampanaActivadaTitle: string;
  pubCampanaActivadaSub: string;
  pubCambiarImagen: string;
  pubSubirLogoFoto: string;
  pubCambiarLogo: string;
  pubSubirLogoCuadrado: string;
  pubTaglineLabel: string;
  pubTaglinePh: string;
  pubLinkLabel: string;
  pubCtaLabel: string;
  pubCtaPh: string;
  pubTelefonoLabel: string;
  pubTrialNote: string;
  pubActivarBtn: string;
  pubErrNombreNegocio: string;
  pubErrLink: string;
  pubErrLogo: string;
  pubErrLinkInvalido: string;
  pubErrProcesar: string;
  // ── Mensajes (hilo) ──────────────────────────────────
  msgTitle: string;
  msgSub: string;
  msgLoginText: string;
  msgIniciarSesion: string;
  msgVolverConversaciones: string;
  msgVacio: string;
  msgInputPh: string;
  msgErrEnviar: string;
  // ── Lo vi (panel) ────────────────────────────────────
  loviCtaLoVi: string;
  loviCtaYoTambien: string;
  loviGraciasEncontrado: string;
  loviGraciasPerdido: string;
  loviReportarOtro: string;
  loviDondeLoViste: string;
  loviMismoLugarBtn: string;
  loviMismoLugarPrefix: string;
  loviGpsCapturado: string;
  loviGpsReintentar: string;
  loviGpsUsar: string;
  loviEscribirManual: string;
  loviCallePh: string;
  loviHoy: string;
  loviOtroDia: string;
  loviHoraPh: string;
  loviErrEnviar: string;
  loviEnviarBtn: string;
  loviNotifAlguienVioPrefix: string;
  loviNotifTuPerroFallback: string;
  loviEnElMismoLugarPrefix: string;
  loviEnElMismoLugarSuffix: string;
  loviEnPrefix: string;
  loviALasPrefix: string;
  loviFechaHoyLabel: string;
  // ── Top escapistas ───────────────────────────────────
  topEscRanking: string;
  topEscTitle: string;
  topEscSubPrefix: string;
  topEscComunidadFallback: string;
  topEscLockedText: string;
  topEscVerPlanes: string;
  topEscFugaSingular: string;
  topEscFugaPlural: string;
  // ── Volvieron a casa ─────────────────────────────────
  vacVolvioACasa: string;
  vacFueAdoptado: string;
  vacReencontrado: string;
  vacHistoriasReales: string;
  vacTitle: string;
  vacSub: string;
  vacVerTodos: string;
  vacCounterPerroSingular: string;
  vacCounterPerroPlural: string;
  vacCounterReencontradoSingular: string;
  vacCounterReencontradoPlural: string;
  vacCounterSuffix: string;
  // ── AdSlot ───────────────────────────────────────────
  adPublicidad: string;
  adHouseTitle: string;
  adHouseSub: string;
  adVerMas: string;
  // ── AiHelpButton ─────────────────────────────────────
  aiHelpSaludo: string;
  aiHelpNecesitasLogin: string;
  aiHelpNoPudeGenerar: string;
  aiHelpErrConexion: string;
  aiHelpTitle: string;
  aiHelpSub: string;
  aiHelpInputPh: string;
  // ── Layouts (headers) ────────────────────────────────
  layoutVolver: string;
  headerPerfilPerro: string;
  headerNuevoPerro: string;
  // ── Publicar aviso ───────────────────────────────────
  pbTitle: string;
  pbTipoAviso: string;
  pbBuscarFotoTitulo: string;
  pbBuscarFotoSub: string;
  pbEsUnoDeTusPerros: string;
  pbOcultarMisPerros: string;
  pbSeleccionarMisPerros: string;
  pbUsarFlecha: string;
  pbFotosLabel: string;
  pbFotoBtnAgregar: string;
  pbFotosElegidasSuffix: string;
  pbNombreAnimalLabel: string;
  pbColorLabel: string;
  pbSexoLabel: string;
  pbOpcional: string;
  pbSexoMacho: string;
  pbSexoHembra: string;
  pbNoSe: string;
  pbTeniaCollar: string;
  pbTeniaChapitaPlaquita: string;
  pbUbicacionLabel: string;
  pbUbicacionConfirmada: string;
  pbUbicacionCambiar: string;
  pbPermisoDenegadoMapa: string;
  pbUsarUbicacionActual: string;
  pbDireccionZonaLabel: string;
  pbDireccionZonaPh: string;
  pbDescripcionLabel: string;
  pbDescripcionPh: string;
  pbContactoPh: string;
  pbMostrarNumeroLabel: string;
  pbNumeroPublicoSub: string;
  pbNumeroPrivadoSub: string;
  pbSubiendoFotosPrefix: string;
  pbGuardandoAviso: string;
  pbPublicarBtn: string;
  pbErrContactoTitle: string;
  pbErrContactoSub: string;
  pbErrZonaTitle: string;
  pbErrZonaSub: string;
  pbErrDescTitle: string;
  pbErrDescSub: string;
  pbErrFotosTitle: string;
  pbErrFotosSub: string;
  pbErrLimiteTitle: string;
  pbErrLimiteSub: string;
  pbErrGuardarTitle: string;
  pbErrGuardarSub: string;
  pbPublicadoTitle: string;
  pbPublicadoSub: string;
  pbVerAvisos: string;
  pbErrGenericoSub: string;
}

export const TRANSLATIONS: Record<'es' | 'en' | 'pt', Translations> = {
  es: {
    loginTagline: 'La red vecinal para encontrar y adoptar perros',
    loginTabLogin: 'Iniciar sesión',
    loginTabRegister: 'Crear cuenta',
    loginEmailPh: 'tu@email.com',
    loginPasswordPh: 'Contraseña (mín. 6 caracteres)',
    loginConfirmPasswordPh: 'Repetir contraseña',
    loginBtnLogin: 'Iniciar sesión',
    loginBtnRegister: 'Crear cuenta gratis',
    loginForgot: '¿Olvidaste tu contraseña?',
    loginOr: 'o',
    loginGoogle: 'Continuar con Google',
    loginGuest: 'Continuar sin cuenta',
    loginGuestNote: 'Podés explorar la app, pero vas a necesitar una cuenta para publicar avisos o contactar vecinos.',
    loginTermsPrefix: 'Leí y acepto los ',
    loginTermsLink: 'Términos y Condiciones',
    loginTermsMiddle: ' y la ',
    loginPrivacyLink: 'Política de Privacidad',
    loginTermsSuffix: ', incluyendo el tratamiento de mis datos personales conforme a la Ley 25.326.',
    loginAgeConsent: 'Confirmo que tengo 13 años o más. Las personas menores de 13 años no pueden registrarse en Vecindog.',
    loginPendingTitle: 'Confirmá tu cuenta',
    loginPendingBodyPrefix: 'Te enviamos un código a',
    loginPendingBodySuffix: 'Ingresá el código de 6 dígitos para activar tu cuenta. Si no lo ves, revisá la carpeta de spam.',
    loginCodigoPh: 'Código de 6 dígitos',
    loginConfirmarBtn: 'Confirmar cuenta',
    loginCodigoErr: 'Código inválido o vencido. Probá reenviarlo.',
    loginResend: 'Reenviar email de confirmación',
    loginAlreadyConfirmed: 'Ya confirmé → Iniciar sesión',
    loginErrFields: 'Completá todos los campos',
    loginErrPasswordMismatch: 'Las contraseñas no coinciden',
    loginErrPasswordMismatchSub: 'Verificá que ambas contraseñas sean iguales.',
    loginErrInvalidCredentials: 'Email o contraseña incorrectos.',
    loginErrEmailNotConfirmed: 'Confirmá tu email antes de iniciar sesión.',
    loginErrAlreadyRegistered: 'Ya existe una cuenta con ese email.',
    loginErrWeakPassword: 'La contraseña debe tener al menos 6 caracteres.',
    loginErrRateLimit: 'Demasiados intentos. Esperá unos minutos.',
    loginErrEnterEmail: 'Ingresá tu email',
    loginErrEnterEmailSub: 'Escribí tu email arriba y luego tocá "Olvidé mi contraseña".',
    loginRecoverySuccessTitle: '¡Revisá tu email!',
    loginRecoverySuccessSub: 'Te enviamos un link para restablecer tu contraseña.',
    loginResendSuccessTitle: 'Email reenviado',
    homeSubGreeting: 'Red vecinal de mascotas',
    homeCatTodos: 'Todos',
    homeCatPerdidos: 'Perdidos',
    homeCatVistos: 'Vistos',
    homeCatAdopcion: 'Adopción',
    homeCatTransito: 'Tránsito',
    homeCuidadoTitle: 'Cuidado de perros',
    homeCuidadoSub: 'Pedí o dá una mano cuidando mascotas',
    homeTransporteTitle: 'Transporte de perros',
    homeTransporteSub: 'Encontrá quién ayude a trasladar tu mascota',
    homeNuevo: 'NUEVO',
    homeAvisosRecientes: 'Avisos recientes',
    homeEmpty: 'No hay avisos en esta categoría.',
    homeErrorTitle: 'Sin conexión',
    homeErrorSub: 'No pudimos cargar los avisos. Verificá tu conexión.',
    homeRetry: 'Reintentar',
    homeSinNombre: 'Sin nombre',
    tabInicio: 'Inicio',
    tabAvisos: 'Avisos',
    tabMapa: 'Mapa',
    tabMisPerros: 'Mis perros',
    tabPerfil: 'Perfil',
    avisosTitle: 'Avisos',
    avisosSearchPh: '🔍  Buscar por nombre, raza, zona…',
    avisosCatTodos: 'Todos',
    avisosCatPerdido: 'Perdido',
    avisosCatEncontrado: 'Encontrado',
    avisosCatAdopcion: 'En adopción',
    avisosCatTransito: 'En tránsito',
    avisosCountSingular: 'aviso',
    avisosCountPlural: 'avisos',
    avisosErrorText: 'No se pudieron cargar los avisos.',
    avisosEmpty: 'No se encontraron avisos.',
    avisosPublicar: 'Publicar un aviso',
    avisosBadgeResuelto: 'Resuelto',
    avisosBadgeEnLaCalle: 'En la calle',
    avisosDiasRestantesSuffix: 'd restantes',
    avisosVenceHoy: 'Vence hoy',
    mapaLeyendaPerdido: 'Perdido',
    mapaLeyendaEncontrado: 'Visto',
    mapaLeyendaAdopcion: 'En adopción',
    mapaLeyendaTransito: 'En la calle',
    mapaVerAviso: 'Ver aviso →',
    mapaAvisosSuffix: 'avisos',
    mapaWebTitle: 'Mapa disponible en la app',
    mapaWebSub: 'El mapa interactivo funciona en iOS y Android.',
    mapaWebCargadosSuffix: 'avisos con ubicación cargados.',
    misPerrosTitle: 'Mis perros 🐶',
    misPerrosCountSingular: 'registrado',
    misPerrosCountPlural: 'registrados',
    misPerrosAmigos: '👥 Amigos',
    misPerrosAmigosLocked: '🔒 Amigos',
    misPerrosAgregar: '+ Agregar',
    misPerrosEmptyTitle: 'Sin perros registrados',
    misPerrosEmptySub: 'Registrá a tu perro para tener toda su información lista.',
    misPerrosEmptyBtn: '+ Registrar perro',
    perfilGuestTitle: 'Estás navegando como invitado',
    perfilGuestSub: 'Creá una cuenta gratis para publicar avisos, contactar vecinos y guardar tus perros.',
    perfilGuestBtn: 'Crear cuenta gratis →',
    perfilDatosPersonales: 'Datos personales',
    perfilEditar: '✏️ Editar',
    perfilCancelar: 'Cancelar',
    perfilFieldNombre: 'Nombre *',
    perfilFieldApellido: 'Apellido *',
    perfilFieldTelefono: 'Teléfono',
    perfilFieldTelefonoPh: '+54 9 291...',
    perfilFieldCiudad: 'Ciudad',
    perfilFieldCiudadPh: 'Bahía Blanca',
    perfilFieldProvincia: 'Provincia',
    perfilFieldProvinciaPh: 'Buenos Aires',
    perfilFieldPais: 'País',
    perfilFieldPaisPh: 'Argentina',
    perfilFieldDireccion: 'Dirección',
    perfilFieldDireccionPh: 'Calle 123',
    perfilGuardarCambios: 'Guardar cambios',
    perfilCompletarTitle: 'Completá tu perfil',
    perfilCompletarSub: 'Agregá tu nombre y teléfono para que los vecinos puedan contactarte cuando encontrés o perdás una mascota.',
    perfilCompletarBtn: 'Completar ahora →',
    perfilRowNombre: 'Nombre',
    perfilRowTelefono: 'Teléfono',
    perfilRowCiudad: 'Ciudad',
    perfilRowProvincia: 'Provincia',
    perfilRowPais: 'País',
    perfilRowDireccion: 'Dirección',
    perfilSosTitle: 'SOS: se me perdió mi perro',
    perfilSosSub: 'Avisá a todos tus amigos de una sola vez',
    perfilSosSubLocked: 'Función de VecindogPro',
    perfilLinkMisAvisos: '🗺️  Ver mis avisos publicados',
    perfilLinkPublicitate: '📣  Publicitate',
    perfilLinkAdmin: '🛡️  Panel de reportes',
    perfilLinkWeb: '🌐  Abrir versión web',
    perfilLinkTerminos: '📄  Términos y Condiciones',
    perfilLinkPrivacidad: '🔒  Política de Privacidad',
    perfilIdioma: '🌐  Idioma',
    perfilBiometricTitle: 'Desbloqueo biométrico',
    perfilBiometricSub: 'Usá Face ID o Touch ID para entrar más rápido la próxima vez.',
    perfilBiometricEnableFail: 'No se pudo verificar tu identidad. Probá de nuevo.',
    lockScreenTitle: 'Vecindog',
    lockScreenSub: 'Desbloqueá con Face ID o Touch ID para continuar.',
    lockScreenBtn: 'Desbloquear',
    lockScreenSalir: 'Cerrar sesión',
    perfilCerrarSesion: 'Cerrar sesión',
    perfilCerrarSesionConfirm: '¿Estás seguro?',
    perfilCerrarSesionSalir: 'Salir',
    perfilEliminarCuenta: 'Eliminar mi cuenta',
    perfilEliminarCuentaConfirmTitle: 'Eliminar tu cuenta',
    perfilEliminarCuentaConfirmSub: 'Se van a borrar tu perfil, tus perros, avisos, mensajes y toda tu información de Vecindog de forma permanente. Esta acción no se puede deshacer.',
    perfilEliminarCuentaBtn: 'Eliminar cuenta',
    perfilEliminarCuentaEnCurso: 'Eliminando tu cuenta…',
    perfilVersion: 'Vecindog v1.0.0 · mivecindog.com.ar',
    perfilPermisoDenegadoTitle: 'Permiso denegado',
    perfilPermisoDenegadoSub: 'Necesitamos acceso a tu galería',
    perfilErrorFotoSub: 'No se pudo actualizar la foto. Verificá tu conexión.',
    perfilCamposRequeridosTitle: 'Campos requeridos',
    perfilCamposRequeridosSub: 'Ingresá nombre y apellido',
    perfilGuardadoTitle: '✅ Guardado',
    perfilGuardadoSub: 'Tu perfil fue actualizado.',
    perfilErrorGeneric: 'Error',
    perfilSinDescripcion: 'Sin descripción',
    perfilModalSosTitle: '🚨 Alerta SOS',
    perfilModalSosSub: 'Se notifica a todos tus amigos con un mensaje y un email',
    perfilModalSinPerros: 'Todavía no tenés perros registrados. Registrá uno para poder usar el SOS.',
    perfilModalCualSePerdio: '¿Cuál se perdió?',
    perfilModalErrorEnvio: 'No se pudo enviar la alerta. Intentá de nuevo.',
    perfilModalAlertarBtn: '🚨 Alertar a mis amigos',
    perfilModalCerrar: 'Cerrar',
    perfilModalEnviadaTitle: '¡Alerta enviada!',
    perfilModalAvisamosPrefix: 'Avisamos a',
    perfilModalAmigoSingular: 'amigo tuyo',
    perfilModalAmigoPlural: 'amigos tuyos',
    perfilModalAvisamosSuffix: 'por notificación y email.',
    perfilModalSinAmigos: 'Todavía no tenés amigos agregados en Vecindog — sumá vecinos desde "Mis perros" > Amigos para que el SOS les llegue.',
    perfilModalListo: 'Listo',
    nuevoPerroFotoAgregar: 'Agregar foto',
    nuevoPerroNombre: 'Nombre *',
    nuevoPerroNombrePh: 'Ej: Bobby',
    nuevoPerroRaza: 'Raza',
    nuevoPerroRazaPh: 'Ej: Labrador, Ovejero, Mestizo…',
    nuevoPerroColor: 'Color',
    nuevoPerroColorNoSe: 'No sé / no recuerdo',
    nuevoPerroColorModalTitulo: 'Color principal',
    nuevoPerroSexo: 'Sexo',
    nuevoPerroSexoMacho: 'macho',
    nuevoPerroSexoHembra: 'hembra',
    nuevoPerroTamano: 'Tamaño',
    nuevoPerroFechaNac: 'Fecha de nacimiento',
    nuevoPerroFechaNacPh: 'AAAA-MM-DD',
    nuevoPerroChip: 'Nº de Microchip',
    nuevoPerroChipPh: 'Nº de chip',
    nuevoPerroEsterilizado: 'Esterilizado/a',
    nuevoPerroDescripcion: 'Descripción',
    nuevoPerroDescripcionPh: 'Marcas especiales, comportamiento…',
    nuevoPerroGuardar: 'Guardar perro',
    nuevoPerroErrPermiso: 'Permiso denegado',
    nuevoPerroErrFaltaNombreTitle: 'Falta el nombre',
    nuevoPerroErrFaltaNombreSub: 'Ingresá el nombre de tu perro',
    nuevoPerroListoTitle: '¡Listo!',
    nuevoPerroListoSubSuffix: 'fue registrado correctamente.',
    nuevoPerroVerMisPerros: 'Ver mis perros',
    nuevoPerroErrGuardarSub: 'No se pudo guardar. Verificá tu conexión.',
    campoFecha: 'Fecha',
    campoNotas: 'Notas',
    campoVeterinario: 'Veterinario',
    campoTelefono: 'Teléfono',
    campoNombre: 'Nombre',
    campoTipo: 'Tipo',
    campoDescripcion: 'Descripción',
    campoProximaDosis: 'Próxima dosis',
    campoDosis: 'Dosis',
    campoFrecuencia: 'Frecuencia',
    campoFechaInicio: 'Fecha inicio',
    campoFechaFin: 'Fecha fin',
    campoDiagnostico: 'Diagnóstico',
    campoTratamiento: 'Tratamiento',
    campoMotivo: 'Motivo',
    campoRelacion: 'Relación',
    campoProducto: 'Producto',
    campoMedicamento: 'Medicamento',
    campoPesoKg: 'Peso (kg)',
    campoOpcionalPh: 'Opcional',
    campoVacunaLabel: 'Vacuna',
    campoVacunaPh: 'Ej: Antirrábica',
    genericGuardar: 'Guardar',
    genericGuardarCambios: 'Guardar cambios',
    genericEliminar: 'Eliminar',
    genericErrGuardarConexion: 'No se pudo guardar. Verificá tu conexión.',
    genericAgregarBtn: '+ Agregar',
    genericVer: 'Ver',
    genericEditar: 'Editar',
    errFechaInvalidaTitle: 'Fecha inválida',
    perroSeccionPerfil: '📋  Perfil',
    perroCampoFechaNacLabel: 'Fecha de nacimiento (AAAA-MM-DD)',
    perroCampoFechaNacPh: 'Ej: 2022-05-14',
    perroCampoChipLabel: 'Nº de microchip',
    perroCampoAlergiasLabel: 'Alergias',
    perroCampoAlergiasPh: 'Ej: pollo, polen',
    perroCampoVetNombreLabel: 'Veterinario habitual',
    perroCampoVetTelefonoLabel: 'Teléfono del veterinario',
    perroCampoDireccionLabel: 'Dirección',
    perroCampoEstadoSalud: 'Estado de salud',
    estadoSaludSaludable: '✅ Saludable',
    estadoSaludEnTratamiento: '💊 En tratamiento',
    estadoSaludEnRecuperacion: '🩹 En recuperación',
    perroDietaTitulo: 'Dieta',
    perroDietaMarca: 'Marca',
    perroDietaCantidad: 'Cantidad',
    perroDietaCantidadPh: 'Ej: 200g',
    perroDietaFrecuenciaPh: 'Ej: 2 veces al día',
    perroDietaNotas: 'Notas de dieta',
    perroSexoMachoLabel: 'Macho',
    perroSexoHembraLabel: 'Hembra',
    perroTamanoChico: 'Chico',
    perroTamanoMediano: 'Mediano',
    perroTamanoGrande: 'Grande',
    perroSeccionVacunas: 'Carnet de Vacunas',
    perroVacioVacunas: 'Sin vacunas registradas.',
    perroCampoVacunaNombrePh: 'Ej: Antirrábica',
    perroSeccionDesparasitaciones: 'Desparasitaciones',
    perroVacioDesparasitaciones: 'Sin desparasitaciones registradas.',
    perroCampoProductoPh: 'Ej: NexGard',
    perroSeccionMedicamentos: 'Medicamentos',
    perroVacioMedicamentos: 'Sin medicamentos registrados.',
    perroSeccionPeso: 'Peso',
    perroVacioPeso: 'Sin registros de peso.',
    perroPesoInvalido: 'Ingresá un peso válido en kg (ej: 12.5).',
    perroSeccionVisitas: 'Visitas al veterinario',
    perroVacioVisitas: 'Sin visitas registradas.',
    perroSeccionProcedimientos: 'Procedimientos y cirugías',
    perroVacioProcedimientos: 'Sin procedimientos registrados.',
    perroSeccionGrooming: 'Grooming',
    perroSeccionContactos: 'Contactos de emergencia',
    perroVacioContactos: 'Sin contactos de emergencia.',
    perroCampoRelacionPh: 'Ej: Familiar, paseador',
    perroCampoTelefonoPh: '+54 9 ...',
    perroSeccionGaleria: '🖼️  Galería de fotos',
    perroGaleriaAgregar: '+ Agregar',
    perroGaleriaPro: '✨ Pro',
    perroGaleriaHint: 'Mantené presionada una foto para borrarla',
    perroSeccionExtras: '✨  Extras',
    perroQrCollar: '📱  QR para el collar',
    perroCompartirQr: 'Compartir QR',
    perroExtraHint: 'Generá y compartí estos documentos directo desde la app:',
    perroExtraCartel: '🚨  Cartel de perdido',
    perroExtraHistoria: '📸  Historia para Instagram/Facebook',
    perroExtraTimeline: '🗓️  Línea de tiempo',
    perroExtraCarnetPdf: '🪪  Descargar carnet en PDF',
    perroHistoriaBtn: '📤  Compartir Historia Clínica',
    perroHistoriaClinicaDePrefix: 'Historia Clínica de',
    perroMiPerroFallback: 'mi perro',
    perroEstudioLaboratorio: 'Análisis de Laboratorio',
    perroEstudioRadiografia: 'Radiografías',
    perroEstudioEcografia: 'Ecografías',
    perroEstudioCertChip: 'Certificado de Chip',
    perroEstudioCertCvi: 'Certificado CVI',
    perroEstudioCertAntiparasitario: 'Certificado Antiparasitario',
    perroEstudioVacunaAntirrabica: 'Vacuna Antirrábica',
    perroEstudioAirtag: 'AirTag / Rastreador',
    perroSubirBtn: '+ Subir',
    perroArchivoSubidoTitle: '✅ Archivo subido',
    perroArchivoSubidoSuffix: 'agregado correctamente.',
    perroAirtagPrompt: 'Ingresá el número de serie o código del rastreador',
    perroAirtagOnlyIphoneTitle: 'AirTag',
    perroAirtagOnlyIphoneSub: 'Función disponible en iPhone',
    perroErrGuardarAirtag: 'No se pudo guardar el AirTag. Verificá tu conexión.',
    perroErrSubirArchivo: 'No se pudo subir el archivo. Verificá tu conexión.',
    perroErrCompartirQr: 'No se pudo compartir el QR.',
    perroErrPdf: 'No se pudo generar el PDF.',
    perroErrHistoriaImg: 'No se pudo generar la imagen.',
    perroTimelineTitle: '🗓️  Línea de tiempo',
    perroTimelineVacio: 'Todavía no hay registros médicos cargados.',
    perroHistoriaTitle: '📸  Historia para Instagram/Facebook',
    perroHistoriaMostrarTel: 'Mostrar teléfono en la imagen',
    perroHistoriaCompartir: 'Compartir',
    perroHistoriaFelizYSano: 'feliz y sano 🎉',
    perroHistoriaSocio: 'Soy socio de Vecindog 🐾',
    perroNoEncontrado: 'Perro no encontrado',
    perroErrCargarTitle: 'No se pudo cargar',
    perroErrCargarSub: 'Verificá tu conexión e intentá de nuevo.',
    perroErrSubirFoto: 'No se pudo subir la foto.',
    perroErrCambiarFoto: 'No se pudo cambiar la foto. Verificá tu conexión.',
    perroErrBorrarFoto: 'No se pudo borrar la foto. Verificá tu conexión.',
    perroConfirmBorrarSub: '¿Seguro que querés borrar este registro?',
    perroConfirmBorrarFotoTitle: 'Eliminar foto',
    perroConfirmBorrarFotoSub: '¿Borrar esta foto de la galería?',
    perroEliminarVacuna: 'Eliminar vacuna',
    perroEliminarDesparasitacion: 'Eliminar desparasitación',
    perroEliminarMedicamento: 'Eliminar medicamento',
    perroEliminarPeso: 'Eliminar registro de peso',
    perroEliminarVisita: 'Eliminar visita',
    perroEliminarProcedimiento: 'Eliminar procedimiento',
    perroEliminarContacto: 'Eliminar contacto',
    perroProximaDosisPrefix: 'Próx:',
    groomingUltimaFecha: 'Última fecha',
    groomingFrecuenciaDias: 'Frecuencia (días)',
    groomingUltimaVez: 'Última vez',
    groomingCadaPrefix: 'cada',
    groomingDiasSuffix: 'días',
    groomingBorrarRegistro: '🗑 Borrar registro',
    groomingBorrando: 'Borrando…',
    groomingFechaInvalidaSub: 'La última fecha tiene que tener el formato AAAA-MM-DD.',
    groomingFrecuenciaInvalidaTitle: 'Frecuencia inválida',
    groomingFrecuenciaInvalidaSub: 'Ingresá una cantidad de días válida (ej: 30).',
    groomingConfirmBorrarTitle: 'Eliminar registro',
    groomingConfirmBorrarSub: '¿Seguro que querés borrar el registro de grooming?',
    groomingTipoBano: 'baño',
    groomingTipoPeluqueria: 'peluquería',
    groomingTipoAmbos: 'ambos',
    turnoFechaInvalida: 'El turno tiene que tener el formato AAAA-MM-DD.',
    turnoErrGuardar: 'No se pudo guardar el turno. Verificá tu conexión.',
    turnoFechaLabel: 'Fecha del turno',
    turnoGuardarBtn: 'Guardar turno',
    turnoProximoPrefix: '📅 Próximo turno:',
    turnoVencido: '⚠️ Vencido',
    turnoVigente: '✓ Vigente',
    turnoRegistrarBtn: '📅 + Registrar turno',
    perroPesoEvolucion: '📈  Evolución de peso',
    perroPesoVsAnterior: 'kg vs. registro anterior',
    historialEditando: 'Editando registro',
    historialPro: '✨ VecindogPro',
    historialVacioDefault: 'Sin datos todavía.',
    historialFaltaDatoTitle: 'Falta un dato',
    historialCompletaPrefix: 'Completá "',
    historialCompletaSuffix: '".',
    historialFechaInvalidaMiddle: 'tiene que tener el formato AAAA-MM-DD (ej:',
    historialFechaInvalidaEnd: ').',
    dateFormatPh: 'AAAA-MM-DD',
    perroEliminarArchivoTitle: 'Eliminar archivo',
    perroBorrarArchivoPrefix: '¿Borrar',
    resetErrPasswordCorta: 'La contraseña debe tener al menos 6 caracteres.',
    resetErrPasswordMismatch: 'Las contraseñas no coinciden.',
    resetErrLinkInvalido: 'El link de recuperación es inválido o expiró. Pedí uno nuevo.',
    resetListoTitle: '¡Contraseña actualizada!',
    resetListoSub: 'Ya podés seguir usando la app con tu nueva contraseña.',
    resetContinuar: 'Continuar',
    resetTitle: 'Nueva contraseña',
    resetSub: 'Ingresá tu nueva contraseña para continuar.',
    resetPasswordPh: 'Nueva contraseña (mín. 6 caracteres)',
    resetConfirmPh: 'Confirmar contraseña',
    resetGuardarBtn: 'Guardar contraseña',
    notifTitle: 'Notificaciones',
    notifNuevaSingular: 'nueva',
    notifNuevaPlural: 'nuevas',
    notifMarcarTodas: 'Marcar todas leídas',
    notifEmptyTitle: 'No tenés notificaciones',
    notifEmptySub: 'Te avisaremos cuando haya avisos cerca de tu casa.',
    notifAceptar: '✓ Aceptar',
    notifRechazar: '✕ Rechazar',
    notifLoEncontre: '¡Lo encontré!',
    notifSigoBuscando: 'Lo sigo buscando',
    notifErrGeneric: 'Ocurrió un error. Probá de nuevo.',
    notifHacePrefix: 'Hace',
    notifMinSuffix: 'min',
    notifHsSuffix: 'h',
    notifDiasSuffix: 'días',
    notifTuVecinoFallback: 'Tu vecino',
    notifAceptoSolicitudSuffix: 'aceptó tu solicitud de amistad 🐾',
    amigosVolver: '← Volver',
    amigosTitle: '👥 Amigos',
    amigosTabMisAmigos: 'Mis amigos',
    amigosTabBuscar: 'Buscar perro',
    amigosSolicitudesRecibidas: 'Solicitudes recibidas',
    amigosUsuarioFallback: 'Usuario',
    amigosAlguienFallback: 'Alguien',
    amigosAmigosLabel: 'Amigos',
    amigosEmptyTitle: 'Todavía no tenés amigos',
    amigosEmptySub: 'Buscá el nombre del perro de tu vecino y mandale una solicitud.',
    amigosSearchPh: '🔍  Nombre del perro o dueño…',
    amigosNoEncontrado: 'No encontramos ningún perro con ese nombre.',
    amigosEscribeNombre: 'Escribí el nombre del perro de tu vecino para buscarlo.',
    amigosDePrefix: 'de',
    amigosYaAmigos: '✓ Amigos',
    amigosPendiente: '⏳ Pendiente',
    bpfLockedTitle: 'Función de VecindogPro',
    bpfLockedSub: 'Buscar por foto usa inteligencia artificial para analizar la foto de un perro y compararla con los avisos activos de la comunidad.',
    bpfVerPlanes: 'Ver planes',
    bpfSubtitulo: 'Subí una foto del perro y la IA va a sugerir color, raza y tamaño para buscarlo entre los avisos activos.',
    bpfElegirGaleria: 'Elegir de la galería',
    bpfAnalizando: 'Analizando con IA…',
    bpfTomarFoto: '📸  Tomar foto',
    bpfEmpezarDeNuevo: '↺  Empezar de nuevo',
    bpfColorMatch: 'Color:',
    bpfRazaMatch: 'Raza:',
    bpfTamanoMatch: 'Tamaño:',
    bpfConCollar: 'Con collar',
    bpfSinCollar: 'Sin collar',
    bpfConChapita: 'Con chapita',
    bpfSinChapita: 'Sin chapita',
    bpfErrPermisoGaleria: 'Necesitamos acceso a tu galería',
    bpfErrPermisoCamara: 'Necesitamos acceso a tu cámara',
    bpfErrIniciarSesionTitle: 'Iniciá sesión',
    bpfErrIniciarSesionSub: 'Necesitás estar logueado para usar esta función.',
    bpfErrAnalizarDefault: 'Error al analizar la foto',
    bpfErrAnalizarTitle: 'No se pudo analizar',
    bpfErrAnalizarFotoSub: 'No se pudo analizar la foto. Verificá tu conexión.',
    bpfErrBuscar: 'No se pudo buscar. Verificá tu conexión.',
    bpfLabelColor: 'Color',
    bpfLabelTamano: 'Tamaño',
    bpfLabelRaza: 'Raza (opcional)',
    bpfTeniaCollar: '¿Tenía collar?',
    bpfTeniaChapita: '¿Tenía chapita?',
    bpfSi: 'Sí',
    bpfNo: 'No',
    bpfNoSe: 'No sé',
    bpfBuscarBtn: '🔍  Buscar en avisos activos',
    bpfSinCoincidencias: 'No encontramos coincidencias',
    bpfCoincidenciaSingular: 'posible coincidencia',
    bpfCoincidenciaPlural: 'posibles coincidencias',
    bpfPerdido: 'Perdido',
    bpfEncontrado: 'Encontrado',
    postMotivoFalsa: 'Información falsa o engañosa',
    postMotivoInapropiado: 'Contenido inapropiado u ofensivo',
    postMotivoSpam: 'Spam o publicidad',
    postMotivoMaltrato: 'Sospecha de maltrato animal',
    postMotivoOtro: 'Otro',
    postErrIniciarSesionReporte: 'Necesitás una cuenta para reportar un aviso.',
    postReportarPregunta: '¿Por qué querés reportar este aviso?',
    postErrReporte: 'No se pudo enviar el reporte. Intentá de nuevo.',
    postReporteEnviadoTitle: 'Reporte enviado',
    postReporteEnviadoSub: 'Gracias. Nuestro equipo revisará este aviso.',
    postErrIniciarSesionContacto: 'Necesitás una cuenta para solicitar el contacto.',
    postPushTuAviso: 'tu aviso',
    postPushTitlePrefix: '📩 Solicitud de contacto —',
    postPushQuiereContactarte: 'quiere contactarte. Sus datos:',
    postSolicitudEnviadaTitle: '✅ Solicitud enviada',
    postSolicitudEnviadaSub: 'El publicador recibirá una notificación con tus datos de contacto.',
    postErrSolicitud: 'No se pudo enviar la solicitud. Intentá de nuevo.',
    postNoEncontrado: 'Aviso no encontrado',
    postSharePerroFallback: 'Perro',
    postConfirmRenovarTitle: '¿Subir este aviso al tope de la lista?',
    postConfirmRenovarSub: 'El aviso va a aparecer primero para más personas.',
    postSiRenovar: 'Sí, renovar',
    postRenovarListoTitle: 'Listo',
    postRenovarListoSub: 'Tu aviso volvió al tope de la lista.',
    postErrRenovar: 'No se pudo renovar el aviso. Intentá de nuevo.',
    postConfirmResueltoPerdidoTitle: '¿Ya encontraste a tu perro?',
    postConfirmResueltoOtroTitle: '¿Marcar este aviso como resuelto?',
    postConfirmResueltoPerdidoSub: 'El aviso va a dejar de mostrarse como activo.',
    postConfirmResueltoOtroSub: 'Esta acción no se puede deshacer.',
    postSiMarcarResuelto: 'Sí, marcar resuelto',
    postResueltoListoTitle: '¡Listo! 🎉',
    postResueltoListoSub: 'Nos alegra que se haya resuelto.',
    postErrResuelto: 'No se pudo actualizar el aviso. Intentá de nuevo.',
    postConfirmBorrarTitle: '¿Borrar este aviso?',
    postBorrarBtnConfirm: 'Borrar',
    postErrBorrar: 'No se pudo borrar el aviso. Intentá de nuevo.',
    postResuelto: 'RESUELTO',
    postActivo: 'ACTIVO',
    postDatoEspecie: 'Especie',
    postDatoRaza: 'Raza',
    postDatoColor: 'Color',
    postDatoTamano: 'Tamaño',
    postDatoZona: 'Zona',
    postDatoCiudad: 'Ciudad',
    postDatoFecha: 'Fecha',
    postDescripcionTitle: 'Descripción',
    postLoginPromptText: 'Iniciá sesión para ver el contacto de este aviso.',
    postLoginLink: 'Iniciar sesión →',
    postSinContactoText: '🙈  Quien publicó este aviso prefirió no dejar contacto. Podés compartirlo para que llegue a más personas.',
    postSolicitudEnviadaTexto: '✅  Solicitud enviada. El publicador te contactará.',
    postSolicitarContactoBtn: '📩  Solicitar contacto',
    postWhatsappBtn: '💬  Escribir por WhatsApp',
    postWaMensajeDefault: 'Hola, te escribo por el aviso de Vecindog.',
    postManagePanelAdmin: '🛡️ Panel de administración',
    postManagePanelDueno: '🐶 Gestionar mi aviso',
    postRenovarBtn: '🔄  Lo sigo buscando (subir al tope)',
    postMarcarResueltoAdmin: 'Marcar resuelto',
    postYaLoEncontre: 'Ya lo encontré',
    postMarcarResuelto: 'Marcar resuelto',
    postBorrarAvisoBtn: '🗑️  Borrar aviso',
    postReportado: '⚑  Aviso reportado',
    postReportarBtn: '⚑  Reportar este aviso',
    adminAccesoRestringido: '⛔  Acceso restringido',
    adminSinRevisar: 'sin revisar',
    adminReportesLabel: 'reportes',
    adminVerTodos: 'Ver todos',
    adminSoloNuevos: 'Solo nuevos',
    adminSinPendientes: '✅ Sin reportes pendientes.',
    adminSinReportes: 'No hay reportes aún.',
    adminRevisado: 'Revisado',
    adminMotivo: 'Motivo',
    adminVerAviso: 'Ver aviso',
    adminDesestimar: '✓ Desestimar',
    adminEliminar: '✕ Eliminar',
    adminConfirmEliminarTitle: 'Eliminar aviso',
    adminConfirmEliminarSub: '¿Estás seguro? Esta acción no se puede deshacer.',
    headerAviso: 'Aviso',
    headerReportes: 'Reportes',
    headerBuscarPorFoto: 'Buscar por foto',
    headerNuevaContrasena: 'Nueva contraseña',
    cuidadoCuidadorFallback: 'Cuidador',
    cuidadoBuscaCuidadorFallback: 'Busca cuidador',
    cuidadoDesactivar: 'Desactivar',
    cuidadoVerPerfil: '⭐ Ver perfil',
    cuidadoVolver: '← Volver',
    cuidadoComunidad: '🤝 Comunidad',
    cuidadoTitle: 'Cuidado de perros',
    cuidadoSub: 'Vecinos que se ayudan a cuidar sus perros.',
    cuidadoWarning: '🚫 Solo intercambios entre vecinos — está prohibido cobrar o ofrecer servicios comerciales en esta sección.',
    cuidadoBuscoTitle: 'Busco cuidador',
    cuidadoBuscoSub: 'Publicá un pedido para que alguien cuide a tu perro',
    cuidadoBuscandoSection: '🔍 Buscando cuidador',
    cuidadoEmptyBusco: 'Todavía no hay pedidos de cuidado.',
    cuidadoQuieroTitle: 'Quiero cuidar',
    cuidadoQuieroSub: 'Registrate como cuidador de tu zona',
    cuidadoDisponiblesSection: '🙋 Cuidadores disponibles',
    cuidadoEmptyCuidadores: 'Todavía no hay cuidadores registrados.',
    qcExp1: 'Soy dueño/a de perros', qcExp2: 'Tuve perros de niño/a', qcExp3: 'Cuidé perros de amigos/familia',
    qcExp4: 'Trabajé con animales', qcExp5: 'Sin experiencia previa',
    qcDisp1: 'De lunes a viernes', qcDisp2: 'Fines de semana', qcDisp3: 'Cualquier día', qcDisp4: 'Solo de día', qcDisp5: 'Con pernocte incluido',
    qcErrLogin: 'Tenés que iniciar sesión para registrarte.',
    qcErrNombre: 'El nombre es obligatorio.',
    qcErrZona: 'La zona es obligatoria.',
    qcErrContacto: 'El contacto de WhatsApp es obligatorio.',
    qcErrContactoDigits: 'El WhatsApp debe tener al menos 10 dígitos.',
    qcExperienciaPrefix: 'Experiencia:',
    qcDisponibilidadPrefix: 'Disponibilidad:',
    qcPuedeCuidarPrefix: 'Puede cuidar hasta',
    qcPerroSingular: 'perro',
    qcPerroPlural: 'perros',
    qcALaVezSuffix: 'a la vez.',
    qcTienePerrosSiTexto: 'Tiene perros propios en casa.',
    qcTienePerrosNoTexto: 'No tiene perros propios.',
    qcErrRegistrar: 'No se pudo registrar. Intentá de nuevo.',
    qcLoginRequired: 'Iniciá sesión para registrarte como cuidador.',
    qcProTitle: 'Función exclusiva VecindogPro',
    qcProSub: 'Para registrarte como cuidador y recibir calificaciones de los dueños, necesitás tener el plan Pro activo.',
    qcPublicadoTitle: '¡Te registraste como cuidador!',
    qcPublicadoSub: 'Tu perfil ya aparece en el listado de cuidadores disponibles.',
    qcTitle: 'Quiero cuidar',
    qcSub: 'Completá tu perfil de cuidador para que los dueños puedan encontrarte.',
    qcNombreLabel: 'Tu nombre o apodo *',
    qcNombrePh: 'Ej: Martina G.',
    qcExperienciaLabel: 'Experiencia con perros',
    qcDisponibilidadLabel: 'Disponibilidad',
    qcCuantosPerrosLabel: '¿Cuántos perros podés cuidar a la vez?',
    qcTienesPerrosLabel: '¿Tenés perros en casa?',
    qcInfoAdicionalLabel: 'Información adicional (opcional)',
    qcInfoAdicionalPh: 'Contá algo más: si tenés patio, si podés hacer pernocte, razas con las que te sentís cómodo/a…',
    qcZonaLabel: 'Zona / Barrio *',
    qcZonaPh: 'Ej: Palermo, Villa Crespo…',
    qcContactoLabel: 'WhatsApp de contacto *',
    qcContactoPh: 'Ej: 1122334455',
    qcSubmitBtn: '🤲 Registrarme como cuidador',
    bcErrLogin: 'Tenés que iniciar sesión para publicar.',
    bcErrZona: 'La zona es obligatoria.',
    bcErrContacto: 'El contacto de WhatsApp es obligatorio.',
    bcErrContactoDigits: 'El WhatsApp debe tener al menos 10 dígitos.',
    bcErrFechas: 'La fecha de fin no puede ser anterior a la de inicio.',
    bcFechasPrefix: 'Fechas: del',
    bcFechasAlSuffix: 'al',
    bcDesdeElPrefix: 'Desde el',
    bcDescDefault: 'Busco cuidador para mi perro.',
    bcErrPublicar: 'No se pudo publicar. Intentá de nuevo.',
    bcLoginRequired: 'Iniciá sesión para publicar un pedido de cuidado.',
    bcLoginBtn: 'Iniciar sesión',
    bcPublicadoTitle: '¡Aviso publicado!',
    bcPublicadoSub: 'Tu pedido ya aparece en el listado de cuidado.',
    bcTitle: 'Busco cuidador',
    bcSub: 'Publicá un aviso para encontrar a alguien que cuide a tu perro.',
    bcParaCualPerro: '¿Para cuál de tus perros?',
    bcSinPerros: 'No tenés perros registrados.',
    bcRegistrarUno: 'Registrá uno →',
    bcContinuarSinPerro: 'También podés continuar sin seleccionar un perro y completar los datos manualmente.',
    bcFechasLabel: '¿Para qué fechas? (opcional)',
    bcDesdeLabel: 'Desde',
    bcHastaLabel: 'Hasta',
    bcDescLabel: 'Descripción (opcional)',
    bcDescPh: 'Necesidades especiales, rutinas, información importante para el cuidador…',
    bcSubmitBtn: 'Publicar aviso',
    ratingModalPuntuacion: 'Puntuación *',
    ratingErrSeleccionaPuntuacion: 'Seleccioná una puntuación.',
    ratingComoCuido: '¿Cómo cuidó al perro?',
    ratingExcelente: 'Excelente',
    ratingBueno: 'Bueno',
    ratingRegular: 'Regular',
    ratingFuePuntual: '¿Fue puntual?',
    ratingBuenaCom: '¿Buena comunicación?',
    ratingLoRecomienda: '¿Lo recomendarías?',
    ratingComentarioLabel: 'Comentario (opcional)',
    ratingComentarioPh: 'Contá tu experiencia…',
    ratingErrGuardarDefault: 'Error al guardar. Intentá de nuevo.',
    ratingNoEncontrado: 'No se encontró este perfil.',
    ratingCalificaciones: '⭐ Calificaciones',
    ratingCalificar: 'Calificar',
    ratingGuardadoTexto: '✓ Calificación guardada',
    ratingSinCalificaciones: 'Todavía no tiene calificaciones.',
    ratingCuidadoPrefix: 'Cuidado:',
    ratingPuntual: '⏰ Puntual',
    ratingBuenaComBadge: '💬 Buena comunicación',
    ratingLoRecomiendaBadge: '👍 Lo recomienda',
    ratingContactarWhatsapp: '📞 Contactar por WhatsApp',
    ratingDisponibilidadPrefix: '📅 Disponibilidad:',
    ratingCalificacionesSuffix: 'calificaciones',
    ratingSobre: 'Sobre',
    cuidadorFallbackNombre: 'Cuidador disponible',
    cuidadorModalTitle: 'Calificar cuidador',
    transportadorFallbackNombre: 'Transportador disponible',
    transportadorModalTitle: 'Calificar transportador',
    transportadorFallback: 'Transportador',
    transporteComunidad: '🚗 Comunidad',
    transporteTitle: 'Transporte de perros',
    transporteSub: 'Vecinos que ayudan a trasladar mascotas.',
    transporteQuieroTitle: 'Quiero transportar',
    transporteQuieroSub: 'Registrate como transportador de tu zona',
    transporteDisponiblesSection: '🚗 Transportadores disponibles',
    transporteEmptyDisponibles: 'Todavía no hay transportadores registrados.',
    qtDisp5: 'Con horario flexible',
    qtVehiculoAuto: '🚗 Auto',
    qtVehiculoCamioneta: '🚐 Camioneta',
    qtVehiculoCamion: '🚛 Camión',
    qtVehiculoPrefix: 'Vehículo:',
    qtVehiculoCamionLabel: 'Camión',
    qtPuedeTransportarPrefix: 'Puede transportar hasta',
    qtLoginRequired: 'Iniciá sesión para registrarte como transportador.',
    qtProSub: 'Para registrarte como transportador y recibir calificaciones de los dueños, necesitás tener el plan Pro activo.',
    qtPublicadoTitle: '¡Te registraste como transportador!',
    qtPublicadoSub: 'Tu perfil ya aparece en el listado de transportadores disponibles.',
    qtTitle: 'Quiero transportar perros',
    qtSub: 'Completá tu perfil de transportador para que los dueños puedan encontrarte.',
    qtCuantosPerrosLabel: '¿Cuántos perros podés transportar a la vez?',
    qtVehiculoLabel: '¿Qué vehículo tenés?',
    qtInfoAdicionalPh: 'Contá algo más: si tenés auto propio, qué zonas cubrís, si hacés traslados al veterinario…',
    qtSubmitBtn: '🚗 Registrarme como transportador',
    rvBenef1Titulo: 'En el mapa', rvBenef1Desc: 'Tu negocio aparece directamente donde los vecinos buscan perros perdidos.',
    rvBenef2Titulo: 'Teléfono visible', rvBenef2Desc: 'Los usuarios ven tu número con un toque desde el mapa.',
    rvBenef3Titulo: 'Horario de atención', rvBenef3Desc: 'Informá tus días y horarios para que lleguen cuando abrís.',
    rvBenef4Titulo: 'Dirección exacta', rvBenef4Desc: 'Tu dirección y localidad visibles para toda la comunidad.',
    rvList1: 'Aparecés en el mapa donde los vecinos buscan perros',
    rvList2: 'Teléfono, dirección y horario siempre visibles',
    rvList3: 'Clasificado en tu rubro (vet, petshop, peluquería…)',
    rvList4: 'Audiencia 100% dueños de mascotas activos',
    rvList5: 'Sin bots — usuarios reales de tu zona',
    rvList6: 'Activación en menos de 24 horas',
    rvChipPromo: '⭐ Promo · 3 meses gratis',
    rvChipRegularPrefix: '⭐ Red · $',
    rvChipRegularSuffix: 'ARS/mes',
    rvTitle: 'Red Vecindog',
    rvSub: 'Sumá tu negocio y aparecé en el mapa donde los vecinos buscan a sus perros — con tu teléfono, horario y dirección siempre visibles.',
    rvCtaBtn: '🏢 Registrar mi negocio',
    rvElegiRubro: 'Elegí tu rubro',
    rvPromoTitulo: 'Primeros 3 meses gratis',
    rvPromoDesc: 'Registrá tu negocio ahora y no pagás nada hasta el 4to mes.',
    rvPricingTitulo: 'Una sola tarifa, sin sorpresas',
    rvPricingPerSuffix: '/ mes desde el 4to mes',
    rvUnirmeBtn: 'Unirme a la red →',
    rvFinalTitulo: '¿Listo para sumarte?',
    rvFinalSub: 'Completá el formulario y tu negocio aparece en el mapa en menos de 24 horas.',
    rvModalTitulo: 'Registrar mi negocio',
    rvModalSubPromo: '🎁 3 meses gratis',
    rvErrNombreNegocio: 'Ingresá el nombre del negocio.',
    rvErrCategoria: 'Seleccioná una categoría.',
    rvErrCiudad: 'Ingresá tu ciudad.',
    rvErrTelefono: 'Ingresá un teléfono de contacto.',
    rvErrDireccion: 'Ingresá la dirección del negocio.',
    rvErrEmail: 'Ingresá tu email.',
    rvErrTelefonoDigits: 'El teléfono debe tener al menos 10 dígitos.',
    rvErrLogin: 'Tenés que iniciar sesión para registrar tu negocio.',
    rvErrSesionExpirada: 'Sesión expirada. Volvé a iniciar sesión.',
    rvErrProcesar: 'No se pudo procesar el registro.',
    rvErrConexion: 'Error de conexión. Intentá de nuevo.',
    rvRegistradoTitulo: '¡Negocio registrado!',
    rvRegistradoSub: 'Ya aparece en la Red Vecindog. Te enviamos un mail con los detalles.',
    rvCerrarBtn: 'Cerrar',
    rvCambiarFoto: 'Cambiar foto',
    rvSubirFoto: 'Subir foto del local',
    rvNombreNegocioLabel: 'Nombre del negocio *',
    rvNombreNegocioPh: 'Veterinaria Central',
    rvCategoriaLabel: 'Categoría *',
    rvSeleccionaCategoria: 'Seleccioná una categoría',
    rvDescBreveLabel: 'Descripción breve',
    rvDescBrevePh: 'Especialistas en razas pequeñas…',
    rvDireccionLabel: 'Dirección *',
    rvDireccionPh: 'Av. San Martín 1234',
    rvPermisoDenegadoMapa: '⚠️  Permiso denegado — escribí la dirección a mano',
    rvCiudadLabel: 'Ciudad *',
    rvCiudadPh: 'Ej: Bahía Blanca',
    rvCambiarBtn: 'Cambiar',
    rvDiasAtencionLabel: 'Días de atención',
    rvDia1: 'Lunes a viernes', rvDia2: 'Lunes a sábado', rvDia3: 'Todos los días',
    rvAperturaLabel: 'Apertura',
    rvCierreLabel: 'Cierre',
    rvTelefonoLabel: 'Teléfono *',
    rvLinkLabel: 'Link del negocio',
    rvEmailLabel: 'Email *',
    rvTrialNote: 'Sin costo los primeros 3 meses · después se renueva mensualmente',
    rvActivarBtn: 'Activar gratis — 3 meses sin costo',
    rvIosActivarBtn: 'Activar suscripción',
    rvIosPagoNote: 'Se cobra a través de tu cuenta de Apple · se renueva mensualmente',
    rvIosBrowseSub: 'Encontrá comercios y servicios para tu perro cerca tuyo.',
    rvRegistrarBtn: 'Registrar mi negocio',
    rvcNoEncontrada: 'Categoría no encontrada.',
    rvcCompletaCiudad: 'Completá tu ciudad',
    rvcCompletaCiudadSub: 'Necesitamos saber tu ciudad para mostrarte los negocios cerca tuyo.',
    rvcIrPerfil: 'Ir a mi perfil',
    rvcProSub: 'Con Pro accedés al directorio completo de negocios de tu ciudad, con teléfono, dirección y horarios.',
    rvcVerPlanes: 'Ver planes',
    rvcSinNegociosPrefix: 'Todavía no hay negocios en',
    rvcSumate: '¿Tenés un negocio de esta categoría? Sumate a la Red Vecindog.',
    rvcRegistrarNegocio: 'Registrar mi negocio',
    comercioCalificarTitle: 'Calificar negocio',
    comercioComentarioPh: 'Contá tu experiencia (opcional)…',
    comercioNoEncontrado: 'No se encontró este negocio.',
    comercioLlamar: '📞 Llamar',
    comercioWhatsapp: '💬 WhatsApp',
    comercioVisitarSitio: '🔗 Visitar sitio / perfil',
    comercioNovedades: '📰 Novedades',
    comercioResenas: '⭐ Reseñas',
    comercioGuardadoText: '✓ Reseña guardada',
    comercioSinResenas: 'Todavía no tiene reseñas.',
    pubParaNegocios: '📣 Para negocios locales',
    pubTitle: 'Llegá a quienes ya cuidan a sus mascotas',
    pubSub: 'Vecindog conecta a dueños de perros de toda Argentina cuando más lo necesitan. Mostrá tu negocio en el momento exacto.',
    pubWhatsapp: '💬 WhatsApp',
    pubEmail: '✉️ Email',
    pubStatVecinosLabel: 'Vecinos activos',
    pubStatTodoValue: 'Todo', pubStatArgentinaLabel: 'Argentina',
    pubStat100Value: '100%', pubStatOrganicoLabel: 'Orgánico · sin bots',
    pubStatDirectoValue: 'Directo', pubStatDuenosLabel: 'A dueños de mascotas',
    pubFormatosTitle: 'Formatos disponibles',
    pubFormato1Label: '🖼️ Banner entre secciones', pubFormato1Badge: 'Más visto', pubFormato1Desc: 'Aparece en el inicio entre secciones. Full width, alta visibilidad.',
    pubFormato2Label: '🗂️ Card en grilla de avisos', pubFormato2Badge: 'Más clics', pubFormato2Desc: 'Aparece integrada cada 4 avisos. El usuario la ve mientras busca su perro.',
    pubFormato3Label: '📋 Panel lateral de contacto', pubFormato3Badge: 'Alta intención', pubFormato3Desc: 'Aparece en el detalle de cada aviso, justo debajo del contacto.',
    pubComoFuncionaTitle: '¿Cómo funciona?',
    pubPaso1Titulo: 'Elegí tu plan', pubPaso1Desc: 'Seleccioná el paquete que mejor se adapte: Básico, Estándar o Premium.',
    pubPaso2Titulo: 'Completá los datos', pubPaso2Desc: 'Nombre, logo, tagline y link a tu web o Instagram. Menos de 2 minutos.',
    pubPaso3Titulo: 'Tu aviso en vivo', pubPaso3Desc: 'En 24 hs tu anuncio ya está visible para cientos de dueños de mascotas.',
    pubPlanesTitle: 'Planes simples, sin letra chica',
    pubPlanesSub: 'Mes a mes. Sin contrato. Cancelás cuando querés.',
    pubPlanBasico: 'Básico', pubPlanEstandar: 'Estándar', pubPlanPremium: 'Premium',
    pubSlotCard: 'Card en grilla de avisos', pubSlotPanel: 'Panel lateral de contacto', pubSlotBanner: 'Banner entre secciones (home)',
    pubMasElegido: '★ Más elegido',
    pubArsMes: 'ARS/mes',
    pubElegirPrefix: 'Elegir',
    pubNecesitasAlgo: '¿Necesitás algo especial? Escribinos y armamos un plan a medida.',
    pubPorQueTitle: 'Publicidad con contexto, no con algoritmos',
    pubPorQueSub: 'Los usuarios de Vecindog ya están pensando en sus mascotas cuando ven tu anuncio.',
    pubPorQue1Titulo: 'Audiencia calificada', pubPorQue1Desc: 'Solo dueños de mascotas activos en tu ciudad.',
    pubPorQue2Titulo: 'Sin bots ni impresiones vacías', pubPorQue2Desc: 'Usuarios reales buscando avisos activos.',
    pubPorQue3Titulo: 'Activación en 24 hs', pubPorQue3Desc: 'Tu ad publicado al día siguiente de pagar.',
    pubPorQue4Titulo: 'Reporte mensual', pubPorQue4Desc: 'Te informamos cuántas veces se vio tu anuncio.',
    pubFaqTitle: 'Preguntas frecuentes',
    pubFaq1Q: '¿Cómo aparece mi negocio?', pubFaq1A: 'Te pedimos logo, nombre, tagline y el link a tu web o Instagram. En 24 hs tu aviso ya está visible.',
    pubFaq2Q: '¿Puedo cambiar el anuncio durante el mes?', pubFaq2A: 'Sí. Podés actualizar el contenido una vez por mes sin costo adicional.',
    pubFaq3Q: '¿Qué negocios pueden publicitar?', pubFaq3A: 'Veterinarias, petshops, peluquerías caninas, adiestradores, refugios, tiendas de accesorios y cualquier servicio relacionado con mascotas.',
    pubFaq4Q: '¿Hay contratos o mínimos?', pubFaq4A: 'No. El pago es mes a mes. Podés discontinuar cuando quieras.',
    pubFinalTitle: '¿Listo para llegar a más clientes?',
    pubFinalSub: 'Escribinos y activamos tu campaña en menos de 24 horas.',
    pubPlanBasicoLabel: 'Plan Básico', pubPlanEstandarLabel: 'Plan Estándar', pubPlanPremiumLabel: 'Plan Premium',
    pubPrimerMesGratisPrefix: '🎁 Primer mes gratis · después',
    pubCampanaActivadaTitle: '¡Campaña activada!',
    pubCampanaActivadaSub: 'Tu anuncio ya está en proceso de activación. Te enviamos un mail con los detalles.',
    pubCambiarImagen: 'Cambiar imagen',
    pubSubirLogoFoto: 'Subir logo o foto',
    pubCambiarLogo: 'Cambiar logo',
    pubSubirLogoCuadrado: 'Subir logo cuadrado *',
    pubTaglineLabel: 'Descripción corta (tagline)',
    pubTaglinePh: 'Vacunas · Bahía Blanca',
    pubLinkLabel: 'Link del negocio *',
    pubCtaLabel: 'Texto del botón',
    pubCtaPh: 'Ver local · Pedir turno',
    pubTelefonoLabel: 'Teléfono / WhatsApp',
    pubTrialNote: 'Sin costo el primer mes · después se renueva',
    pubActivarBtn: 'Activar gratis — primer mes sin costo',
    pubErrNombreNegocio: 'Ingresá el nombre de tu negocio.',
    pubErrLink: 'Ingresá el link de tu negocio.',
    pubErrLogo: 'Subí el logo de tu negocio para este plan.',
    pubErrLinkInvalido: 'El link debe ser una URL válida. Ejemplo: https://instagram.com/tunegocio',
    pubErrProcesar: 'Error al procesar.',
    msgTitle: 'Mensajes privados',
    msgSub: 'Contacto directo con el dueño del aviso',
    msgLoginText: 'Iniciá sesión para enviar mensajes',
    msgIniciarSesion: 'Iniciar sesión',
    msgVolverConversaciones: '← Ver todas las conversaciones',
    msgVacio: 'Todavía no hay mensajes. Sé el primero en escribir.',
    msgInputPh: 'Escribí tu mensaje...',
    msgErrEnviar: 'No se pudo enviar el mensaje. Intentá de nuevo.',
    loviCtaLoVi: '👀 Lo vi',
    loviCtaYoTambien: '👀 Yo también lo vi',
    loviGraciasEncontrado: '✅ Gracias, actualizamos la ubicación en el mapa.',
    loviGraciasPerdido: '✅ Gracias, le avisamos al dueño.',
    loviReportarOtro: 'Reportar otro avistamiento',
    loviDondeLoViste: '¿Dónde lo viste?',
    loviMismoLugarBtn: '📍 Fue en el mismo lugar del aviso',
    loviMismoLugarPrefix: '📍 Mismo lugar:',
    loviGpsCapturado: '✅ Ubicación GPS capturada',
    loviGpsReintentar: '📡 Reintentar ubicación',
    loviGpsUsar: '📡 Usar mi ubicación actual',
    loviEscribirManual: 'Escribir la dirección a mano',
    loviCallePh: 'Ej: Av. Colón y Brandsen',
    loviHoy: 'Hoy',
    loviOtroDia: 'Otro día',
    loviHoraPh: 'Hora aproximada (ej: 18:30)',
    loviErrEnviar: 'No se pudo enviar. Intentá de nuevo.',
    loviEnviarBtn: 'Enviar',
    loviNotifAlguienVioPrefix: '👀 Alguien vio a',
    loviNotifTuPerroFallback: 'tu perro',
    loviEnElMismoLugarPrefix: 'en el mismo lugar (',
    loviEnElMismoLugarSuffix: ')',
    loviEnPrefix: 'en',
    loviALasPrefix: 'a las',
    loviFechaHoyLabel: 'hoy',
    topEscRanking: '⚠️ Ranking',
    topEscTitle: 'Los más escapistas 🏃',
    topEscSubPrefix: 'Los perros con más avisos de pérdida en',
    topEscComunidadFallback: 'la comunidad',
    topEscLockedText: 'Función exclusiva de VecindogPro',
    topEscVerPlanes: '✨ Ver planes',
    topEscFugaSingular: 'fuga',
    topEscFugaPlural: 'fugas',
    vacVolvioACasa: '🏠 Volvió a casa',
    vacFueAdoptado: '❤️ Fue adoptado',
    vacReencontrado: '🏠 Reencontrado',
    vacHistoriasReales: '❤️ Historias reales',
    vacTitle: 'Volvieron a casa 🏠',
    vacSub: 'Gracias a la comunidad, estos perros reencontraron a su familia.',
    vacVerTodos: 'Ver todos →',
    vacCounterPerroSingular: 'perro',
    vacCounterPerroPlural: 'perros',
    vacCounterReencontradoSingular: 'reencontrado',
    vacCounterReencontradoPlural: 'reencontrados',
    vacCounterSuffix: 'con la ayuda de Vecindog.',
    adPublicidad: 'Publicidad',
    adHouseTitle: '📣 ¿Tenés un negocio de mascotas?',
    adHouseSub: 'Publicitate en Vecindog y llegá a miles de dueños de mascotas.',
    adVerMas: 'Ver más',
    aiHelpSaludo: '¡Hola! Soy el asistente de Vecindog 🐾 ¿En qué te puedo ayudar? Puedo explicarte cómo publicar un aviso, usar VecindogPro, o cualquier otra duda sobre la app.',
    aiHelpNecesitasLogin: 'Necesitás iniciar sesión para usar el asistente. Cerrá este chat, iniciá sesión y volvé a intentarlo.',
    aiHelpNoPudeGenerar: 'No pude generar una respuesta, probá de nuevo.',
    aiHelpErrConexion: 'Hubo un problema para conectar con el asistente. Probá de nuevo en un momento.',
    aiHelpTitle: 'Asistente Vecindog',
    aiHelpSub: 'Impulsado por IA',
    aiHelpInputPh: 'Escribí tu pregunta…',
    layoutVolver: '‹ Volver',
    headerPerfilPerro: 'Perfil del perro',
    headerNuevoPerro: 'Nuevo perro',
    pbTitle: 'Nuevo aviso',
    pbTipoAviso: 'Tipo de aviso',
    pbBuscarFotoTitulo: '¿Ya subiste una foto a otro lado?',
    pbBuscarFotoSub: 'Buscá con IA entre los avisos activos antes de publicar uno nuevo',
    pbEsUnoDeTusPerros: '¿Es uno de tus perros?',
    pbOcultarMisPerros: '▲  Ocultar mis perros',
    pbSeleccionarMisPerros: '🐕  Seleccionar de mis perros',
    pbUsarFlecha: 'Usar →',
    pbFotosLabel: 'Fotos',
    pbFotoBtnAgregar: 'Agregar fotos',
    pbFotosElegidasSuffix: 'foto(s) elegida(s)',
    pbNombreAnimalLabel: 'Nombre del animal',
    pbColorLabel: 'Color principal',
    pbSexoLabel: 'Sexo',
    pbOpcional: '(Opcional)',
    pbSexoMacho: '♂ Macho',
    pbSexoHembra: '♀ Hembra',
    pbNoSe: 'No sé',
    pbTeniaCollar: '¿Tenía collar?',
    pbTeniaChapitaPlaquita: '¿Tenía chapita / plaquita identificadora?',
    pbUbicacionLabel: 'Ubicación en el mapa',
    pbUbicacionConfirmada: '✓ Ubicación GPS capturada',
    pbUbicacionCambiar: 'Cambiar',
    pbPermisoDenegadoMapa: '⚠️  Permiso denegado — el aviso no aparecerá en el mapa',
    pbUsarUbicacionActual: '📍  Usar mi ubicación actual',
    pbDireccionZonaLabel: 'Dirección o zona *',
    pbDireccionZonaPh: 'Ej: Barrio Palihue, calle Sarmiento',
    pbDescripcionLabel: 'Descripción adicional *',
    pbDescripcionPh: 'Marcas especiales, manchas, comportamiento, collar rojo con chapita azul…',
    pbContactoPh: '+54 9 291 123 4567',
    pbMostrarNumeroLabel: 'Mostrar número públicamente',
    pbNumeroPublicoSub: 'Cualquier usuario registrado verá tu número.',
    pbNumeroPrivadoSub: 'Los usuarios deberán solicitar el contacto.',
    pbSubiendoFotosPrefix: 'Subiendo fotos',
    pbGuardandoAviso: 'Guardando aviso…',
    pbPublicarBtn: 'Publicar aviso',
    pbErrContactoTitle: 'Falta el contacto',
    pbErrContactoSub: 'Ingresá tu número de WhatsApp',
    pbErrZonaTitle: 'Falta la zona',
    pbErrZonaSub: 'Ingresá el barrio o zona',
    pbErrDescTitle: 'Falta la descripción',
    pbErrDescSub: 'Contanos marcas especiales, comportamiento u otro dato que ayude a identificarlo.',
    pbErrFotosTitle: 'Error al subir fotos',
    pbErrFotosSub: 'No se pudieron subir todas las imágenes. Las parcialmente subidas fueron eliminadas. Intentá de nuevo.',
    pbErrLimiteTitle: 'Límite alcanzado',
    pbErrLimiteSub: 'Podés publicar hasta 5 avisos por hora. Esperá un momento e intentá de nuevo.',
    pbErrGuardarTitle: 'Error al guardar',
    pbErrGuardarSub: 'Las fotos fueron eliminadas. Intentá publicar de nuevo.',
    pbPublicadoTitle: '¡Aviso publicado!',
    pbPublicadoSub: 'Tu aviso ya es visible para los vecinos.',
    pbVerAvisos: 'Ver avisos',
    pbErrGenericoSub: 'No se pudo publicar. Verificá tu conexión.',
  },
  en: {
    loginTagline: 'The neighborhood network to find and adopt dogs',
    loginTabLogin: 'Log in',
    loginTabRegister: 'Create account',
    loginEmailPh: 'you@email.com',
    loginPasswordPh: 'Password (min. 6 characters)',
    loginConfirmPasswordPh: 'Repeat password',
    loginBtnLogin: 'Log in',
    loginBtnRegister: 'Create free account',
    loginForgot: 'Forgot your password?',
    loginOr: 'or',
    loginGoogle: 'Continue with Google',
    loginGuest: 'Continue without an account',
    loginGuestNote: "You can explore the app, but you'll need an account to publish posts or contact neighbors.",
    loginTermsPrefix: 'I have read and accept the ',
    loginTermsLink: 'Terms and Conditions',
    loginTermsMiddle: ' and the ',
    loginPrivacyLink: 'Privacy Policy',
    loginTermsSuffix: ', including the processing of my personal data.',
    loginAgeConsent: 'I confirm I am 13 years or older. People under 13 cannot register on Vecindog.',
    loginPendingTitle: 'Confirm your account',
    loginPendingBodyPrefix: 'We sent a code to',
    loginPendingBodySuffix: "Enter the 6-digit code to activate your account. If you don't see it, check your spam folder.",
    loginCodigoPh: '6-digit code',
    loginConfirmarBtn: 'Confirm account',
    loginCodigoErr: 'Invalid or expired code. Try resending it.',
    loginResend: 'Resend confirmation email',
    loginAlreadyConfirmed: 'Already confirmed → Log in',
    loginErrFields: 'Fill in all the fields',
    loginErrPasswordMismatch: "Passwords don't match",
    loginErrPasswordMismatchSub: 'Check that both passwords are the same.',
    loginErrInvalidCredentials: 'Incorrect email or password.',
    loginErrEmailNotConfirmed: 'Confirm your email before logging in.',
    loginErrAlreadyRegistered: 'An account with that email already exists.',
    loginErrWeakPassword: 'Password must be at least 6 characters.',
    loginErrRateLimit: 'Too many attempts. Wait a few minutes.',
    loginErrEnterEmail: 'Enter your email',
    loginErrEnterEmailSub: 'Write your email above and then tap "Forgot my password".',
    loginRecoverySuccessTitle: 'Check your email!',
    loginRecoverySuccessSub: 'We sent you a link to reset your password.',
    loginResendSuccessTitle: 'Email resent',
    homeSubGreeting: 'Neighborhood pet network',
    homeCatTodos: 'All',
    homeCatPerdidos: 'Lost',
    homeCatVistos: 'Seen',
    homeCatAdopcion: 'Adoption',
    homeCatTransito: 'Fostering',
    homeCuidadoTitle: 'Dog sitting',
    homeCuidadoSub: 'Ask for or offer a hand with pet sitting',
    homeTransporteTitle: 'Dog transport',
    homeTransporteSub: 'Find someone to help move your pet',
    homeNuevo: 'NEW',
    homeAvisosRecientes: 'Recent posts',
    homeEmpty: 'No posts in this category.',
    homeErrorTitle: 'No connection',
    homeErrorSub: "We couldn't load the posts. Check your connection.",
    homeRetry: 'Retry',
    homeSinNombre: 'No name',
    tabInicio: 'Home',
    tabAvisos: 'Posts',
    tabMapa: 'Map',
    tabMisPerros: 'My dogs',
    tabPerfil: 'Profile',
    avisosTitle: 'Posts',
    avisosSearchPh: '🔍  Search by name, breed, area…',
    avisosCatTodos: 'All',
    avisosCatPerdido: 'Lost',
    avisosCatEncontrado: 'Found',
    avisosCatAdopcion: 'Up for adoption',
    avisosCatTransito: 'Fostering',
    avisosCountSingular: 'post',
    avisosCountPlural: 'posts',
    avisosErrorText: "We couldn't load the posts.",
    avisosEmpty: 'No posts found.',
    avisosPublicar: 'Publish a post',
    avisosBadgeResuelto: 'Resolved',
    avisosBadgeEnLaCalle: 'On the street',
    avisosDiasRestantesSuffix: 'd left',
    avisosVenceHoy: 'Due today',
    mapaLeyendaPerdido: 'Lost',
    mapaLeyendaEncontrado: 'Seen',
    mapaLeyendaAdopcion: 'Up for adoption',
    mapaLeyendaTransito: 'On the street',
    mapaVerAviso: 'View post →',
    mapaAvisosSuffix: 'posts',
    mapaWebTitle: 'Map available in the app',
    mapaWebSub: 'The interactive map works on iOS and Android.',
    mapaWebCargadosSuffix: 'posts with location loaded.',
    misPerrosTitle: 'My dogs 🐶',
    misPerrosCountSingular: 'registered',
    misPerrosCountPlural: 'registered',
    misPerrosAmigos: '👥 Friends',
    misPerrosAmigosLocked: '🔒 Friends',
    misPerrosAgregar: '+ Add',
    misPerrosEmptyTitle: 'No dogs registered',
    misPerrosEmptySub: 'Register your dog to have all their info ready.',
    misPerrosEmptyBtn: '+ Register dog',
    perfilGuestTitle: "You're browsing as a guest",
    perfilGuestSub: 'Create a free account to publish posts, contact neighbors and save your dogs.',
    perfilGuestBtn: 'Create free account →',
    perfilDatosPersonales: 'Personal info',
    perfilEditar: '✏️ Edit',
    perfilCancelar: 'Cancel',
    perfilFieldNombre: 'First name *',
    perfilFieldApellido: 'Last name *',
    perfilFieldTelefono: 'Phone',
    perfilFieldTelefonoPh: '+1 555 123...',
    perfilFieldCiudad: 'City',
    perfilFieldCiudadPh: 'Bahía Blanca',
    perfilFieldProvincia: 'State/Province',
    perfilFieldProvinciaPh: 'Buenos Aires',
    perfilFieldPais: 'Country',
    perfilFieldPaisPh: 'Argentina',
    perfilFieldDireccion: 'Address',
    perfilFieldDireccionPh: '123 Main St',
    perfilGuardarCambios: 'Save changes',
    perfilCompletarTitle: 'Complete your profile',
    perfilCompletarSub: 'Add your name and phone so neighbors can contact you when you find or lose a pet.',
    perfilCompletarBtn: 'Complete now →',
    perfilRowNombre: 'Name',
    perfilRowTelefono: 'Phone',
    perfilRowCiudad: 'City',
    perfilRowProvincia: 'State',
    perfilRowPais: 'Country',
    perfilRowDireccion: 'Address',
    perfilSosTitle: 'SOS: my dog is lost',
    perfilSosSub: 'Alert all your friends at once',
    perfilSosSubLocked: 'VecindogPro feature',
    perfilLinkMisAvisos: '🗺️  View my published posts',
    perfilLinkPublicitate: '📣  Advertise',
    perfilLinkAdmin: '🛡️  Reports panel',
    perfilLinkWeb: '🌐  Open web version',
    perfilLinkTerminos: '📄  Terms and Conditions',
    perfilLinkPrivacidad: '🔒  Privacy Policy',
    perfilIdioma: '🌐  Language',
    perfilBiometricTitle: 'Biometric unlock',
    perfilBiometricSub: 'Use Face ID or Touch ID to log in faster next time.',
    perfilBiometricEnableFail: 'We could not verify your identity. Try again.',
    lockScreenTitle: 'Vecindog',
    lockScreenSub: 'Unlock with Face ID or Touch ID to continue.',
    lockScreenBtn: 'Unlock',
    lockScreenSalir: 'Log out',
    perfilCerrarSesion: 'Log out',
    perfilCerrarSesionConfirm: 'Are you sure?',
    perfilCerrarSesionSalir: 'Log out',
    perfilEliminarCuenta: 'Delete my account',
    perfilEliminarCuentaConfirmTitle: 'Delete your account',
    perfilEliminarCuentaConfirmSub: 'Your profile, dogs, posts, messages and all your Vecindog data will be permanently deleted. This action cannot be undone.',
    perfilEliminarCuentaBtn: 'Delete account',
    perfilEliminarCuentaEnCurso: 'Deleting your account…',
    perfilVersion: 'Vecindog v1.0.0 · mivecindog.com.ar',
    perfilPermisoDenegadoTitle: 'Permission denied',
    perfilPermisoDenegadoSub: 'We need access to your gallery',
    perfilErrorFotoSub: "We couldn't update the photo. Check your connection.",
    perfilCamposRequeridosTitle: 'Required fields',
    perfilCamposRequeridosSub: 'Enter your first and last name',
    perfilGuardadoTitle: '✅ Saved',
    perfilGuardadoSub: 'Your profile was updated.',
    perfilErrorGeneric: 'Error',
    perfilSinDescripcion: 'No description',
    perfilModalSosTitle: '🚨 SOS Alert',
    perfilModalSosSub: 'All your friends are notified with a message and an email',
    perfilModalSinPerros: "You don't have any dogs registered yet. Register one to use SOS.",
    perfilModalCualSePerdio: 'Which one got lost?',
    perfilModalErrorEnvio: "We couldn't send the alert. Try again.",
    perfilModalAlertarBtn: '🚨 Alert my friends',
    perfilModalCerrar: 'Close',
    perfilModalEnviadaTitle: 'Alert sent!',
    perfilModalAvisamosPrefix: 'We notified',
    perfilModalAmigoSingular: 'friend of yours',
    perfilModalAmigoPlural: 'friends of yours',
    perfilModalAvisamosSuffix: 'by push notification and email.',
    perfilModalSinAmigos: 'You don\'t have any friends added on Vecindog yet — add neighbors from "My dogs" > Friends so the SOS reaches them.',
    perfilModalListo: 'Done',
    nuevoPerroFotoAgregar: 'Add photo',
    nuevoPerroNombre: 'Name *',
    nuevoPerroNombrePh: 'E.g: Bobby',
    nuevoPerroRaza: 'Breed',
    nuevoPerroRazaPh: 'E.g: Labrador, Shepherd, Mixed…',
    nuevoPerroColor: 'Color',
    nuevoPerroColorNoSe: "Don't know / don't remember",
    nuevoPerroColorModalTitulo: 'Main color',
    nuevoPerroSexo: 'Sex',
    nuevoPerroSexoMacho: 'male',
    nuevoPerroSexoHembra: 'female',
    nuevoPerroTamano: 'Size',
    nuevoPerroFechaNac: 'Date of birth',
    nuevoPerroFechaNacPh: 'YYYY-MM-DD',
    nuevoPerroChip: 'Microchip number',
    nuevoPerroChipPh: 'Chip number',
    nuevoPerroEsterilizado: 'Spayed/neutered',
    nuevoPerroDescripcion: 'Description',
    nuevoPerroDescripcionPh: 'Special markings, behavior…',
    nuevoPerroGuardar: 'Save dog',
    nuevoPerroErrPermiso: 'Permission denied',
    nuevoPerroErrFaltaNombreTitle: 'Name missing',
    nuevoPerroErrFaltaNombreSub: "Enter your dog's name",
    nuevoPerroListoTitle: 'Done!',
    nuevoPerroListoSubSuffix: 'was registered successfully.',
    nuevoPerroVerMisPerros: 'View my dogs',
    nuevoPerroErrGuardarSub: "We couldn't save it. Check your connection.",
    campoFecha: 'Date',
    campoNotas: 'Notes',
    campoVeterinario: 'Vet',
    campoTelefono: 'Phone',
    campoNombre: 'Name',
    campoTipo: 'Type',
    campoDescripcion: 'Description',
    campoProximaDosis: 'Next dose',
    campoDosis: 'Dose',
    campoFrecuencia: 'Frequency',
    campoFechaInicio: 'Start date',
    campoFechaFin: 'End date',
    campoDiagnostico: 'Diagnosis',
    campoTratamiento: 'Treatment',
    campoMotivo: 'Reason',
    campoRelacion: 'Relationship',
    campoProducto: 'Product',
    campoMedicamento: 'Medication',
    campoPesoKg: 'Weight (kg)',
    campoOpcionalPh: 'Optional',
    campoVacunaLabel: 'Vaccine',
    campoVacunaPh: 'E.g: Rabies',
    genericGuardar: 'Save',
    genericGuardarCambios: 'Save changes',
    genericEliminar: 'Delete',
    genericErrGuardarConexion: "We couldn't save it. Check your connection.",
    genericAgregarBtn: '+ Add',
    genericVer: 'View',
    genericEditar: 'Edit',
    errFechaInvalidaTitle: 'Invalid date',
    perroSeccionPerfil: '📋  Profile',
    perroCampoFechaNacLabel: 'Date of birth (YYYY-MM-DD)',
    perroCampoFechaNacPh: 'E.g: 2022-05-14',
    perroCampoChipLabel: 'Microchip number',
    perroCampoAlergiasLabel: 'Allergies',
    perroCampoAlergiasPh: 'E.g: chicken, pollen',
    perroCampoVetNombreLabel: 'Regular vet',
    perroCampoVetTelefonoLabel: "Vet's phone",
    perroCampoDireccionLabel: 'Address',
    perroCampoEstadoSalud: 'Health status',
    estadoSaludSaludable: '✅ Healthy',
    estadoSaludEnTratamiento: '💊 Under treatment',
    estadoSaludEnRecuperacion: '🩹 Recovering',
    perroDietaTitulo: 'Diet',
    perroDietaMarca: 'Brand',
    perroDietaCantidad: 'Amount',
    perroDietaCantidadPh: 'E.g: 200g',
    perroDietaFrecuenciaPh: 'E.g: 2 times a day',
    perroDietaNotas: 'Diet notes',
    perroSexoMachoLabel: 'Male',
    perroSexoHembraLabel: 'Female',
    perroTamanoChico: 'Small',
    perroTamanoMediano: 'Medium',
    perroTamanoGrande: 'Large',
    perroSeccionVacunas: 'Vaccine Record',
    perroVacioVacunas: 'No vaccines registered.',
    perroCampoVacunaNombrePh: 'E.g: Rabies',
    perroSeccionDesparasitaciones: 'Deworming',
    perroVacioDesparasitaciones: 'No deworming records.',
    perroCampoProductoPh: 'E.g: NexGard',
    perroSeccionMedicamentos: 'Medications',
    perroVacioMedicamentos: 'No medications registered.',
    perroSeccionPeso: 'Weight',
    perroVacioPeso: 'No weight records.',
    perroPesoInvalido: 'Enter a valid weight in kg (e.g: 12.5).',
    perroSeccionVisitas: 'Vet visits',
    perroVacioVisitas: 'No visits registered.',
    perroSeccionProcedimientos: 'Procedures and surgeries',
    perroVacioProcedimientos: 'No procedures registered.',
    perroSeccionGrooming: 'Grooming',
    perroSeccionContactos: 'Emergency contacts',
    perroVacioContactos: 'No emergency contacts.',
    perroCampoRelacionPh: 'E.g: Family, dog walker',
    perroCampoTelefonoPh: '+1 555 ...',
    perroSeccionGaleria: '🖼️  Photo gallery',
    perroGaleriaAgregar: '+ Add',
    perroGaleriaPro: '✨ Pro',
    perroGaleriaHint: 'Long press a photo to delete it',
    perroSeccionExtras: '✨  Extras',
    perroQrCollar: '📱  QR for the collar',
    perroCompartirQr: 'Share QR',
    perroExtraHint: 'Generate and share these documents right from the app:',
    perroExtraCartel: '🚨  Lost dog poster',
    perroExtraHistoria: '📸  Story for Instagram/Facebook',
    perroExtraTimeline: '🗓️  Timeline',
    perroExtraCarnetPdf: '🪪  Download PDF record',
    perroHistoriaBtn: '📤  Share Medical Record',
    perroHistoriaClinicaDePrefix: 'Medical Record for',
    perroMiPerroFallback: 'my dog',
    perroEstudioLaboratorio: 'Lab Tests',
    perroEstudioRadiografia: 'X-Rays',
    perroEstudioEcografia: 'Ultrasounds',
    perroEstudioCertChip: 'Chip Certificate',
    perroEstudioCertCvi: 'CVI Certificate',
    perroEstudioCertAntiparasitario: 'Antiparasitic Certificate',
    perroEstudioVacunaAntirrabica: 'Rabies Vaccine',
    perroEstudioAirtag: 'AirTag / Tracker',
    perroSubirBtn: '+ Upload',
    perroArchivoSubidoTitle: '✅ File uploaded',
    perroArchivoSubidoSuffix: 'added successfully.',
    perroAirtagPrompt: "Enter the tracker's serial number or code",
    perroAirtagOnlyIphoneTitle: 'AirTag',
    perroAirtagOnlyIphoneSub: 'Feature available on iPhone',
    perroErrGuardarAirtag: "We couldn't save the AirTag. Check your connection.",
    perroErrSubirArchivo: "We couldn't upload the file. Check your connection.",
    perroErrCompartirQr: "We couldn't share the QR.",
    perroErrPdf: "We couldn't generate the PDF.",
    perroErrHistoriaImg: "We couldn't generate the image.",
    perroTimelineTitle: '🗓️  Timeline',
    perroTimelineVacio: 'No medical records yet.',
    perroHistoriaTitle: '📸  Story for Instagram/Facebook',
    perroHistoriaMostrarTel: 'Show phone number in the image',
    perroHistoriaCompartir: 'Share',
    perroHistoriaFelizYSano: 'happy and healthy 🎉',
    perroHistoriaSocio: "I'm a Vecindog member 🐾",
    perroNoEncontrado: 'Dog not found',
    perroErrCargarTitle: "Couldn't load",
    perroErrCargarSub: 'Check your connection and try again.',
    perroErrSubirFoto: "We couldn't upload the photo.",
    perroErrCambiarFoto: "We couldn't change the photo. Check your connection.",
    perroErrBorrarFoto: "We couldn't delete the photo. Check your connection.",
    perroConfirmBorrarSub: 'Are you sure you want to delete this record?',
    perroConfirmBorrarFotoTitle: 'Delete photo',
    perroConfirmBorrarFotoSub: 'Delete this photo from the gallery?',
    perroEliminarVacuna: 'Delete vaccine',
    perroEliminarDesparasitacion: 'Delete deworming record',
    perroEliminarMedicamento: 'Delete medication',
    perroEliminarPeso: 'Delete weight record',
    perroEliminarVisita: 'Delete visit',
    perroEliminarProcedimiento: 'Delete procedure',
    perroEliminarContacto: 'Delete contact',
    perroProximaDosisPrefix: 'Next:',
    groomingUltimaFecha: 'Last date',
    groomingFrecuenciaDias: 'Frequency (days)',
    groomingUltimaVez: 'Last time',
    groomingCadaPrefix: 'every',
    groomingDiasSuffix: 'days',
    groomingBorrarRegistro: '🗑 Delete record',
    groomingBorrando: 'Deleting…',
    groomingFechaInvalidaSub: 'The last date must be in YYYY-MM-DD format.',
    groomingFrecuenciaInvalidaTitle: 'Invalid frequency',
    groomingFrecuenciaInvalidaSub: 'Enter a valid number of days (e.g: 30).',
    groomingConfirmBorrarTitle: 'Delete record',
    groomingConfirmBorrarSub: 'Are you sure you want to delete the grooming record?',
    groomingTipoBano: 'bath',
    groomingTipoPeluqueria: 'grooming',
    groomingTipoAmbos: 'both',
    turnoFechaInvalida: 'The appointment must be in YYYY-MM-DD format.',
    turnoErrGuardar: "We couldn't save the appointment. Check your connection.",
    turnoFechaLabel: 'Appointment date',
    turnoGuardarBtn: 'Save appointment',
    turnoProximoPrefix: '📅 Next appointment:',
    turnoVencido: '⚠️ Overdue',
    turnoVigente: '✓ Current',
    turnoRegistrarBtn: '📅 + Add appointment',
    perroPesoEvolucion: '📈  Weight progress',
    perroPesoVsAnterior: 'kg vs. previous record',
    historialEditando: 'Editing record',
    historialPro: '✨ VecindogPro',
    historialVacioDefault: 'No data yet.',
    historialFaltaDatoTitle: 'Missing info',
    historialCompletaPrefix: 'Fill in "',
    historialCompletaSuffix: '".',
    historialFechaInvalidaMiddle: 'must be in YYYY-MM-DD format (e.g:',
    historialFechaInvalidaEnd: ').',
    dateFormatPh: 'YYYY-MM-DD',
    perroEliminarArchivoTitle: 'Delete file',
    perroBorrarArchivoPrefix: 'Delete',
    resetErrPasswordCorta: 'Password must be at least 6 characters.',
    resetErrPasswordMismatch: "Passwords don't match.",
    resetErrLinkInvalido: 'The recovery link is invalid or expired. Request a new one.',
    resetListoTitle: 'Password updated!',
    resetListoSub: 'You can now keep using the app with your new password.',
    resetContinuar: 'Continue',
    resetTitle: 'New password',
    resetSub: 'Enter your new password to continue.',
    resetPasswordPh: 'New password (min. 6 characters)',
    resetConfirmPh: 'Confirm password',
    resetGuardarBtn: 'Save password',
    notifTitle: 'Notifications',
    notifNuevaSingular: 'new',
    notifNuevaPlural: 'new',
    notifMarcarTodas: 'Mark all as read',
    notifEmptyTitle: "You don't have any notifications",
    notifEmptySub: "We'll let you know when there are posts near your home.",
    notifAceptar: '✓ Accept',
    notifRechazar: '✕ Decline',
    notifLoEncontre: 'I found it!',
    notifSigoBuscando: "I'm still looking",
    notifErrGeneric: 'Something went wrong. Try again.',
    notifHacePrefix: '',
    notifMinSuffix: 'min ago',
    notifHsSuffix: 'h ago',
    notifDiasSuffix: 'days ago',
    notifTuVecinoFallback: 'Your neighbor',
    notifAceptoSolicitudSuffix: 'accepted your friend request 🐾',
    amigosVolver: '← Back',
    amigosTitle: '👥 Friends',
    amigosTabMisAmigos: 'My friends',
    amigosTabBuscar: 'Find a dog',
    amigosSolicitudesRecibidas: 'Requests received',
    amigosUsuarioFallback: 'User',
    amigosAlguienFallback: 'Someone',
    amigosAmigosLabel: 'Friends',
    amigosEmptyTitle: "You don't have any friends yet",
    amigosEmptySub: "Search your neighbor's dog's name and send them a request.",
    amigosSearchPh: "🔍  Dog's or owner's name…",
    amigosNoEncontrado: 'We couldn\'t find any dog with that name.',
    amigosEscribeNombre: "Type your neighbor's dog's name to search.",
    amigosDePrefix: 'from',
    amigosYaAmigos: '✓ Friends',
    amigosPendiente: '⏳ Pending',
    bpfLockedTitle: 'VecindogPro feature',
    bpfLockedSub: "Search by photo uses AI to analyze a dog's photo and compare it against the community's active posts.",
    bpfVerPlanes: 'View plans',
    bpfSubtitulo: "Upload a photo of the dog and AI will suggest color, breed and size to search it among active posts.",
    bpfElegirGaleria: 'Choose from gallery',
    bpfAnalizando: 'Analyzing with AI…',
    bpfTomarFoto: '📸  Take photo',
    bpfEmpezarDeNuevo: '↺  Start over',
    bpfColorMatch: 'Color:',
    bpfRazaMatch: 'Breed:',
    bpfTamanoMatch: 'Size:',
    bpfConCollar: 'With collar',
    bpfSinCollar: 'Without collar',
    bpfConChapita: 'With ID tag',
    bpfSinChapita: 'Without ID tag',
    bpfErrPermisoGaleria: 'We need access to your gallery',
    bpfErrPermisoCamara: 'We need access to your camera',
    bpfErrIniciarSesionTitle: 'Log in',
    bpfErrIniciarSesionSub: 'You need to be logged in to use this feature.',
    bpfErrAnalizarDefault: 'Error analyzing the photo',
    bpfErrAnalizarTitle: "Couldn't analyze",
    bpfErrAnalizarFotoSub: "We couldn't analyze the photo. Check your connection.",
    bpfErrBuscar: "We couldn't search. Check your connection.",
    bpfLabelColor: 'Color',
    bpfLabelTamano: 'Size',
    bpfLabelRaza: 'Breed (optional)',
    bpfTeniaCollar: 'Did it have a collar?',
    bpfTeniaChapita: 'Did it have an ID tag?',
    bpfSi: 'Yes',
    bpfNo: 'No',
    bpfNoSe: "Don't know",
    bpfBuscarBtn: '🔍  Search active posts',
    bpfSinCoincidencias: 'No matches found',
    bpfCoincidenciaSingular: 'possible match',
    bpfCoincidenciaPlural: 'possible matches',
    bpfPerdido: 'Lost',
    bpfEncontrado: 'Found',
    postMotivoFalsa: 'False or misleading information',
    postMotivoInapropiado: 'Inappropriate or offensive content',
    postMotivoSpam: 'Spam or advertising',
    postMotivoMaltrato: 'Suspected animal abuse',
    postMotivoOtro: 'Other',
    postErrIniciarSesionReporte: 'You need an account to report a post.',
    postReportarPregunta: 'Why do you want to report this post?',
    postErrReporte: "We couldn't send the report. Try again.",
    postReporteEnviadoTitle: 'Report sent',
    postReporteEnviadoSub: 'Thanks. Our team will review this post.',
    postErrIniciarSesionContacto: 'You need an account to request contact.',
    postPushTuAviso: 'your post',
    postPushTitlePrefix: '📩 Contact request —',
    postPushQuiereContactarte: 'wants to contact you. Their info:',
    postSolicitudEnviadaTitle: '✅ Request sent',
    postSolicitudEnviadaSub: 'The poster will receive a notification with your contact info.',
    postErrSolicitud: "We couldn't send the request. Try again.",
    postNoEncontrado: 'Post not found',
    postSharePerroFallback: 'Dog',
    postConfirmRenovarTitle: 'Bump this post to the top of the list?',
    postConfirmRenovarSub: 'The post will show up first for more people.',
    postSiRenovar: 'Yes, bump it',
    postRenovarListoTitle: 'Done',
    postRenovarListoSub: 'Your post is back at the top of the list.',
    postErrRenovar: "We couldn't bump the post. Try again.",
    postConfirmResueltoPerdidoTitle: 'Did you find your dog?',
    postConfirmResueltoOtroTitle: 'Mark this post as resolved?',
    postConfirmResueltoPerdidoSub: 'The post will stop showing as active.',
    postConfirmResueltoOtroSub: "This action can't be undone.",
    postSiMarcarResuelto: 'Yes, mark as resolved',
    postResueltoListoTitle: 'Done! 🎉',
    postResueltoListoSub: "We're glad it got resolved.",
    postErrResuelto: "We couldn't update the post. Try again.",
    postConfirmBorrarTitle: 'Delete this post?',
    postBorrarBtnConfirm: 'Delete',
    postErrBorrar: "We couldn't delete the post. Try again.",
    postResuelto: 'RESOLVED',
    postActivo: 'ACTIVE',
    postDatoEspecie: 'Species',
    postDatoRaza: 'Breed',
    postDatoColor: 'Color',
    postDatoTamano: 'Size',
    postDatoZona: 'Area',
    postDatoCiudad: 'City',
    postDatoFecha: 'Date',
    postDescripcionTitle: 'Description',
    postLoginPromptText: "Log in to see this post's contact info.",
    postLoginLink: 'Log in →',
    postSinContactoText: "🙈  Whoever posted this preferred not to leave contact info. You can share it so it reaches more people.",
    postSolicitudEnviadaTexto: '✅  Request sent. The poster will contact you.',
    postSolicitarContactoBtn: '📩  Request contact',
    postWhatsappBtn: '💬  Message on WhatsApp',
    postWaMensajeDefault: "Hi, I'm writing about the Vecindog post.",
    postManagePanelAdmin: '🛡️ Admin panel',
    postManagePanelDueno: '🐶 Manage my post',
    postRenovarBtn: "🔄  I'm still looking (bump to top)",
    postMarcarResueltoAdmin: 'Mark as resolved',
    postYaLoEncontre: 'I found it',
    postMarcarResuelto: 'Mark as resolved',
    postBorrarAvisoBtn: '🗑️  Delete post',
    postReportado: '⚑  Post reported',
    postReportarBtn: '⚑  Report this post',
    adminAccesoRestringido: '⛔  Restricted access',
    adminSinRevisar: 'unreviewed',
    adminReportesLabel: 'reports',
    adminVerTodos: 'View all',
    adminSoloNuevos: 'New only',
    adminSinPendientes: '✅ No pending reports.',
    adminSinReportes: 'No reports yet.',
    adminRevisado: 'Reviewed',
    adminMotivo: 'Reason',
    adminVerAviso: 'View post',
    adminDesestimar: '✓ Dismiss',
    adminEliminar: '✕ Delete',
    adminConfirmEliminarTitle: 'Delete post',
    adminConfirmEliminarSub: "Are you sure? This action can't be undone.",
    headerAviso: 'Post',
    headerReportes: 'Reports',
    headerBuscarPorFoto: 'Search by photo',
    headerNuevaContrasena: 'New password',
    cuidadoCuidadorFallback: 'Sitter',
    cuidadoBuscaCuidadorFallback: 'Looking for a sitter',
    cuidadoDesactivar: 'Deactivate',
    cuidadoVerPerfil: '⭐ View profile',
    cuidadoVolver: '← Back',
    cuidadoComunidad: '🤝 Community',
    cuidadoTitle: 'Dog sitting',
    cuidadoSub: 'Neighbors helping each other take care of their dogs.',
    cuidadoWarning: '🚫 Neighbor-to-neighbor exchanges only — charging money or offering commercial services in this section is not allowed.',
    cuidadoBuscoTitle: 'Looking for a sitter',
    cuidadoBuscoSub: 'Post a request so someone can watch your dog',
    cuidadoBuscandoSection: '🔍 Looking for a sitter',
    cuidadoEmptyBusco: 'No sitting requests yet.',
    cuidadoQuieroTitle: 'I want to help sit',
    cuidadoQuieroSub: 'Register as a sitter in your area',
    cuidadoDisponiblesSection: '🙋 Available sitters',
    cuidadoEmptyCuidadores: 'No sitters registered yet.',
    qcExp1: 'I own dogs', qcExp2: 'I had dogs as a kid', qcExp3: "I've taken care of friends'/family's dogs",
    qcExp4: 'I worked with animals', qcExp5: 'No previous experience',
    qcDisp1: 'Monday to Friday', qcDisp2: 'Weekends', qcDisp3: 'Any day', qcDisp4: 'Daytime only', qcDisp5: 'Overnight stays included',
    qcErrLogin: 'You need to log in to register.',
    qcErrNombre: 'Name is required.',
    qcErrZona: 'Area is required.',
    qcErrContacto: 'WhatsApp contact is required.',
    qcErrContactoDigits: 'WhatsApp number must have at least 10 digits.',
    qcExperienciaPrefix: 'Experience:',
    qcDisponibilidadPrefix: 'Availability:',
    qcPuedeCuidarPrefix: 'Can watch up to',
    qcPerroSingular: 'dog',
    qcPerroPlural: 'dogs',
    qcALaVezSuffix: 'at a time.',
    qcTienePerrosSiTexto: 'Has their own dogs at home.',
    qcTienePerrosNoTexto: "Doesn't have their own dogs.",
    qcErrRegistrar: "We couldn't register you. Try again.",
    qcLoginRequired: 'Log in to register as a sitter.',
    qcProTitle: 'VecindogPro exclusive feature',
    qcProSub: 'To register as a sitter and receive ratings from owners, you need an active Pro plan.',
    qcPublicadoTitle: "You're registered as a sitter!",
    qcPublicadoSub: 'Your profile now shows up in the list of available sitters.',
    qcTitle: 'I want to help sit',
    qcSub: "Complete your sitter profile so owners can find you.",
    qcNombreLabel: 'Your name or nickname *',
    qcNombrePh: 'E.g: Martina G.',
    qcExperienciaLabel: 'Experience with dogs',
    qcDisponibilidadLabel: 'Availability',
    qcCuantosPerrosLabel: 'How many dogs can you watch at once?',
    qcTienesPerrosLabel: 'Do you have dogs at home?',
    qcInfoAdicionalLabel: 'Additional info (optional)',
    qcInfoAdicionalPh: "Tell us more: if you have a yard, if you can host overnight, breeds you're comfortable with…",
    qcZonaLabel: 'Area / Neighborhood *',
    qcZonaPh: 'E.g: Palermo, Villa Crespo…',
    qcContactoLabel: 'WhatsApp contact *',
    qcContactoPh: 'E.g: 1122334455',
    qcSubmitBtn: '🤲 Register as a sitter',
    bcErrLogin: 'You need to log in to publish.',
    bcErrZona: 'Area is required.',
    bcErrContacto: 'WhatsApp contact is required.',
    bcErrContactoDigits: 'WhatsApp number must have at least 10 digits.',
    bcErrFechas: "The end date can't be before the start date.",
    bcFechasPrefix: 'Dates: from',
    bcFechasAlSuffix: 'to',
    bcDesdeElPrefix: 'Starting',
    bcDescDefault: 'Looking for a sitter for my dog.',
    bcErrPublicar: "We couldn't publish it. Try again.",
    bcLoginRequired: 'Log in to publish a sitting request.',
    bcLoginBtn: 'Log in',
    bcPublicadoTitle: 'Post published!',
    bcPublicadoSub: 'Your request now shows up in the sitting list.',
    bcTitle: 'Looking for a sitter',
    bcSub: 'Post a listing to find someone to watch your dog.',
    bcParaCualPerro: 'Which of your dogs is this for?',
    bcSinPerros: "You don't have any dogs registered.",
    bcRegistrarUno: 'Register one →',
    bcContinuarSinPerro: 'You can also continue without selecting a dog and fill in the details manually.',
    bcFechasLabel: 'For what dates? (optional)',
    bcDesdeLabel: 'From',
    bcHastaLabel: 'To',
    bcDescLabel: 'Description (optional)',
    bcDescPh: 'Special needs, routines, important info for the sitter…',
    bcSubmitBtn: 'Publish post',
    ratingModalPuntuacion: 'Rating *',
    ratingErrSeleccionaPuntuacion: 'Select a rating.',
    ratingComoCuido: 'How did they take care of the dog?',
    ratingExcelente: 'Excellent',
    ratingBueno: 'Good',
    ratingRegular: 'Fair',
    ratingFuePuntual: 'Were they on time?',
    ratingBuenaCom: 'Good communication?',
    ratingLoRecomienda: 'Would you recommend them?',
    ratingComentarioLabel: 'Comment (optional)',
    ratingComentarioPh: 'Tell us about your experience…',
    ratingErrGuardarDefault: "Error saving. Try again.",
    ratingNoEncontrado: "This profile wasn't found.",
    ratingCalificaciones: '⭐ Ratings',
    ratingCalificar: 'Rate',
    ratingGuardadoTexto: '✓ Rating saved',
    ratingSinCalificaciones: "Doesn't have any ratings yet.",
    ratingCuidadoPrefix: 'Care:',
    ratingPuntual: '⏰ On time',
    ratingBuenaComBadge: '💬 Good communication',
    ratingLoRecomiendaBadge: '👍 Recommended',
    ratingContactarWhatsapp: '📞 Contact on WhatsApp',
    ratingDisponibilidadPrefix: '📅 Availability:',
    ratingCalificacionesSuffix: 'ratings',
    ratingSobre: 'About',
    cuidadorFallbackNombre: 'Available sitter',
    cuidadorModalTitle: 'Rate sitter',
    transportadorFallbackNombre: 'Available transporter',
    transportadorModalTitle: 'Rate transporter',
    transportadorFallback: 'Transporter',
    transporteComunidad: '🚗 Community',
    transporteTitle: 'Dog transport',
    transporteSub: 'Neighbors who help move pets around.',
    transporteQuieroTitle: 'I want to transport',
    transporteQuieroSub: 'Register as a transporter in your area',
    transporteDisponiblesSection: '🚗 Available transporters',
    transporteEmptyDisponibles: 'No transporters registered yet.',
    qtDisp5: 'Flexible schedule',
    qtVehiculoAuto: '🚗 Car',
    qtVehiculoCamioneta: '🚐 Van',
    qtVehiculoCamion: '🚛 Truck',
    qtVehiculoPrefix: 'Vehicle:',
    qtVehiculoCamionLabel: 'Truck',
    qtPuedeTransportarPrefix: 'Can transport up to',
    qtLoginRequired: 'Log in to register as a transporter.',
    qtProSub: 'To register as a transporter and receive ratings from owners, you need an active Pro plan.',
    qtPublicadoTitle: "You're registered as a transporter!",
    qtPublicadoSub: 'Your profile now shows up in the list of available transporters.',
    qtTitle: 'I want to transport dogs',
    qtSub: 'Complete your transporter profile so owners can find you.',
    qtCuantosPerrosLabel: 'How many dogs can you transport at once?',
    qtVehiculoLabel: 'What vehicle do you have?',
    qtInfoAdicionalPh: "Tell us more: if you have your own car, what areas you cover, if you do vet trips…",
    qtSubmitBtn: '🚗 Register as a transporter',
    rvBenef1Titulo: 'On the map', rvBenef1Desc: 'Your business shows up right where neighbors search for lost dogs.',
    rvBenef2Titulo: 'Visible phone number', rvBenef2Desc: 'Users can see your number with one tap from the map.',
    rvBenef3Titulo: 'Business hours', rvBenef3Desc: 'List your days and hours so people show up when you\'re open.',
    rvBenef4Titulo: 'Exact address', rvBenef4Desc: 'Your address and location visible to the whole community.',
    rvList1: 'You show up on the map where neighbors search for dogs',
    rvList2: 'Phone, address and hours always visible',
    rvList3: 'Listed under your category (vet, pet shop, groomer…)',
    rvList4: '100% active pet-owner audience',
    rvList5: 'No bots — real users from your area',
    rvList6: 'Live in less than 24 hours',
    rvChipPromo: '⭐ Promo · 3 months free',
    rvChipRegularPrefix: '⭐ Network · $',
    rvChipRegularSuffix: 'ARS/month',
    rvTitle: 'Vecindog Network',
    rvSub: 'Add your business and show up on the map where neighbors search for their dogs — with your phone, hours and address always visible.',
    rvCtaBtn: '🏢 Register my business',
    rvElegiRubro: 'Choose your category',
    rvPromoTitulo: 'First 3 months free',
    rvPromoDesc: "Register your business now and pay nothing until month 4.",
    rvPricingTitulo: 'One flat rate, no surprises',
    rvPricingPerSuffix: '/ month starting month 4',
    rvUnirmeBtn: 'Join the network →',
    rvFinalTitulo: 'Ready to join?',
    rvFinalSub: 'Fill out the form and your business shows up on the map in less than 24 hours.',
    rvModalTitulo: 'Register my business',
    rvModalSubPromo: '🎁 3 months free',
    rvErrNombreNegocio: 'Enter the business name.',
    rvErrCategoria: 'Select a category.',
    rvErrCiudad: 'Enter your city.',
    rvErrTelefono: 'Enter a contact phone number.',
    rvErrDireccion: "Enter the business address.",
    rvErrEmail: 'Enter your email.',
    rvErrTelefonoDigits: 'The phone number must have at least 10 digits.',
    rvErrLogin: 'You need to log in to register your business.',
    rvErrSesionExpirada: 'Session expired. Log in again.',
    rvErrProcesar: "We couldn't process the registration.",
    rvErrConexion: 'Connection error. Try again.',
    rvRegistradoTitulo: 'Business registered!',
    rvRegistradoSub: "It's now live on the Vecindog Network. We sent you an email with the details.",
    rvCerrarBtn: 'Close',
    rvCambiarFoto: 'Change photo',
    rvSubirFoto: 'Upload store photo',
    rvNombreNegocioLabel: 'Business name *',
    rvNombreNegocioPh: 'Central Veterinary Clinic',
    rvCategoriaLabel: 'Category *',
    rvSeleccionaCategoria: 'Select a category',
    rvDescBreveLabel: 'Short description',
    rvDescBrevePh: 'Small breed specialists…',
    rvDireccionLabel: 'Address *',
    rvDireccionPh: '123 Main St',
    rvPermisoDenegadoMapa: "⚠️  Permission denied — type the address manually",
    rvCiudadLabel: 'City *',
    rvCiudadPh: 'E.g: Bahía Blanca',
    rvCambiarBtn: 'Change',
    rvDiasAtencionLabel: 'Business days',
    rvDia1: 'Monday to Friday', rvDia2: 'Monday to Saturday', rvDia3: 'Every day',
    rvAperturaLabel: 'Opens',
    rvCierreLabel: 'Closes',
    rvTelefonoLabel: 'Phone *',
    rvLinkLabel: 'Business link',
    rvEmailLabel: 'Email *',
    rvTrialNote: 'Free for the first 3 months · renews monthly after that',
    rvActivarBtn: 'Activate free — 3 months at no cost',
    rvIosActivarBtn: 'Activate subscription',
    rvIosPagoNote: 'Billed through your Apple account · renews monthly',
    rvIosBrowseSub: 'Find businesses and services for your dog near you.',
    rvRegistrarBtn: 'Register my business',
    rvcNoEncontrada: 'Category not found.',
    rvcCompletaCiudad: 'Complete your city',
    rvcCompletaCiudadSub: 'We need to know your city to show you businesses near you.',
    rvcIrPerfil: 'Go to my profile',
    rvcProSub: 'With Pro you get access to the full directory of businesses in your city, with phone, address and hours.',
    rvcVerPlanes: 'View plans',
    rvcSinNegociosPrefix: 'No businesses in',
    rvcSumate: 'Do you have a business in this category? Join the Vecindog Network.',
    rvcRegistrarNegocio: 'Register my business',
    comercioCalificarTitle: 'Rate business',
    comercioComentarioPh: 'Tell us about your experience (optional)…',
    comercioNoEncontrado: "This business wasn't found.",
    comercioLlamar: '📞 Call',
    comercioWhatsapp: '💬 WhatsApp',
    comercioVisitarSitio: '🔗 Visit site / profile',
    comercioNovedades: '📰 News',
    comercioResenas: '⭐ Reviews',
    comercioGuardadoText: '✓ Review saved',
    comercioSinResenas: "Doesn't have any reviews yet.",
    pubParaNegocios: '📣 For local businesses',
    pubTitle: 'Reach people who already care for their pets',
    pubSub: 'Vecindog connects dog owners across Argentina exactly when they need it most. Show your business at the right moment.',
    pubWhatsapp: '💬 WhatsApp',
    pubEmail: '✉️ Email',
    pubStatVecinosLabel: 'Active neighbors',
    pubStatTodoValue: 'All of', pubStatArgentinaLabel: 'Argentina',
    pubStat100Value: '100%', pubStatOrganicoLabel: 'Organic · no bots',
    pubStatDirectoValue: 'Direct', pubStatDuenosLabel: 'To pet owners',
    pubFormatosTitle: 'Available formats',
    pubFormato1Label: '🖼️ Banner between sections', pubFormato1Badge: 'Most seen', pubFormato1Desc: 'Shows up on the home screen between sections. Full width, high visibility.',
    pubFormato2Label: '🗂️ Card in posts grid', pubFormato2Badge: 'Most clicks', pubFormato2Desc: 'Shows up integrated every 4 posts. Users see it while searching for their dog.',
    pubFormato3Label: '📋 Contact side panel', pubFormato3Badge: 'High intent', pubFormato3Desc: "Shows up on each post's detail page, right below the contact info.",
    pubComoFuncionaTitle: 'How does it work?',
    pubPaso1Titulo: 'Choose your plan', pubPaso1Desc: 'Pick the package that fits best: Basic, Standard or Premium.',
    pubPaso2Titulo: 'Fill in your details', pubPaso2Desc: 'Name, logo, tagline and a link to your site or Instagram. Under 2 minutes.',
    pubPaso3Titulo: 'Your ad goes live', pubPaso3Desc: 'Within 24 hours your ad is visible to hundreds of pet owners.',
    pubPlanesTitle: 'Simple plans, no fine print',
    pubPlanesSub: 'Month to month. No contract. Cancel anytime.',
    pubPlanBasico: 'Basic', pubPlanEstandar: 'Standard', pubPlanPremium: 'Premium',
    pubSlotCard: 'Card in posts grid', pubSlotPanel: 'Contact side panel', pubSlotBanner: 'Banner between sections (home)',
    pubMasElegido: '★ Most chosen',
    pubArsMes: 'ARS/month',
    pubElegirPrefix: 'Choose',
    pubNecesitasAlgo: 'Need something custom? Write to us and we\'ll build a tailored plan.',
    pubPorQueTitle: 'Advertising with context, not algorithms',
    pubPorQueSub: "Vecindog users are already thinking about their pets when they see your ad.",
    pubPorQue1Titulo: 'Qualified audience', pubPorQue1Desc: 'Only active pet owners in your city.',
    pubPorQue2Titulo: 'No bots or empty impressions', pubPorQue2Desc: 'Real users searching active posts.',
    pubPorQue3Titulo: 'Live in 24 hours', pubPorQue3Desc: 'Your ad published the day after payment.',
    pubPorQue4Titulo: 'Monthly report', pubPorQue4Desc: 'We tell you how many times your ad was viewed.',
    pubFaqTitle: 'Frequently asked questions',
    pubFaq1Q: 'How does my business show up?', pubFaq1A: "We'll ask for a logo, name, tagline and a link to your site or Instagram. Your ad is live within 24 hours.",
    pubFaq2Q: 'Can I change the ad during the month?', pubFaq2A: 'Yes. You can update the content once a month at no extra cost.',
    pubFaq3Q: 'What businesses can advertise?', pubFaq3A: 'Vets, pet shops, dog groomers, trainers, shelters, accessory stores and any pet-related service.',
    pubFaq4Q: 'Are there contracts or minimums?', pubFaq4A: 'No. Payment is month to month. You can stop whenever you want.',
    pubFinalTitle: 'Ready to reach more customers?',
    pubFinalSub: "Write to us and we'll activate your campaign in under 24 hours.",
    pubPlanBasicoLabel: 'Basic Plan', pubPlanEstandarLabel: 'Standard Plan', pubPlanPremiumLabel: 'Premium Plan',
    pubPrimerMesGratisPrefix: '🎁 First month free · then',
    pubCampanaActivadaTitle: 'Campaign activated!',
    pubCampanaActivadaSub: 'Your ad is now being activated. We sent you an email with the details.',
    pubCambiarImagen: 'Change image',
    pubSubirLogoFoto: 'Upload logo or photo',
    pubCambiarLogo: 'Change logo',
    pubSubirLogoCuadrado: 'Upload square logo *',
    pubTaglineLabel: 'Short description (tagline)',
    pubTaglinePh: 'Vaccinations · Bahía Blanca',
    pubLinkLabel: 'Business link *',
    pubCtaLabel: 'Button text',
    pubCtaPh: 'View store · Book appointment',
    pubTelefonoLabel: 'Phone / WhatsApp',
    pubTrialNote: 'Free the first month · renews after that',
    pubActivarBtn: 'Activate free — first month at no cost',
    pubErrNombreNegocio: 'Enter your business name.',
    pubErrLink: 'Enter your business link.',
    pubErrLogo: 'Upload your business logo for this plan.',
    pubErrLinkInvalido: 'The link must be a valid URL. Example: https://instagram.com/yourbusiness',
    pubErrProcesar: 'Error processing.',
    msgTitle: 'Private messages',
    msgSub: "Direct contact with the post's owner",
    msgLoginText: 'Log in to send messages',
    msgIniciarSesion: 'Log in',
    msgVolverConversaciones: '← View all conversations',
    msgVacio: 'No messages yet. Be the first to write.',
    msgInputPh: 'Type your message...',
    msgErrEnviar: "We couldn't send the message. Try again.",
    loviCtaLoVi: '👀 I saw it',
    loviCtaYoTambien: '👀 I saw it too',
    loviGraciasEncontrado: '✅ Thanks, we updated the location on the map.',
    loviGraciasPerdido: '✅ Thanks, we let the owner know.',
    loviReportarOtro: 'Report another sighting',
    loviDondeLoViste: 'Where did you see it?',
    loviMismoLugarBtn: '📍 It was in the same place as the post',
    loviMismoLugarPrefix: '📍 Same place:',
    loviGpsCapturado: '✅ GPS location captured',
    loviGpsReintentar: '📡 Retry location',
    loviGpsUsar: '📡 Use my current location',
    loviEscribirManual: 'Type the address manually',
    loviCallePh: 'E.g: Main St & 5th Ave',
    loviHoy: 'Today',
    loviOtroDia: 'Other day',
    loviHoraPh: 'Approximate time (e.g: 18:30)',
    loviErrEnviar: "We couldn't send it. Try again.",
    loviEnviarBtn: 'Send',
    loviNotifAlguienVioPrefix: '👀 Someone saw',
    loviNotifTuPerroFallback: 'your dog',
    loviEnElMismoLugarPrefix: 'in the same place (',
    loviEnElMismoLugarSuffix: ')',
    loviEnPrefix: 'at',
    loviALasPrefix: 'at',
    loviFechaHoyLabel: 'today',
    topEscRanking: '⚠️ Ranking',
    topEscTitle: 'Top escape artists 🏃',
    topEscSubPrefix: 'The dogs with the most lost-pet posts in',
    topEscComunidadFallback: 'the community',
    topEscLockedText: 'VecindogPro exclusive feature',
    topEscVerPlanes: '✨ View plans',
    topEscFugaSingular: 'escape',
    topEscFugaPlural: 'escapes',
    vacVolvioACasa: '🏠 Made it home',
    vacFueAdoptado: '❤️ Got adopted',
    vacReencontrado: '🏠 Reunited',
    vacHistoriasReales: '❤️ Real stories',
    vacTitle: 'Made it home 🏠',
    vacSub: 'Thanks to the community, these dogs found their family again.',
    vacVerTodos: 'View all →',
    vacCounterPerroSingular: 'dog',
    vacCounterPerroPlural: 'dogs',
    vacCounterReencontradoSingular: 'reunited',
    vacCounterReencontradoPlural: 'reunited',
    vacCounterSuffix: 'with the help of Vecindog.',
    adPublicidad: 'Advertisement',
    adHouseTitle: '📣 Do you have a pet business?',
    adHouseSub: 'Advertise on Vecindog and reach thousands of pet owners.',
    adVerMas: 'Learn more',
    aiHelpSaludo: "Hi! I'm the Vecindog assistant 🐾 How can I help? I can explain how to publish a post, use VecindogPro, or answer any other question about the app.",
    aiHelpNecesitasLogin: 'You need to log in to use the assistant. Close this chat, log in and try again.',
    aiHelpNoPudeGenerar: "I couldn't generate a response, try again.",
    aiHelpErrConexion: 'There was a problem connecting to the assistant. Try again in a moment.',
    aiHelpTitle: 'Vecindog Assistant',
    aiHelpSub: 'Powered by AI',
    aiHelpInputPh: 'Type your question…',
    layoutVolver: '‹ Back',
    headerPerfilPerro: "Dog's profile",
    headerNuevoPerro: 'New dog',
    pbTitle: 'New post',
    pbTipoAviso: 'Post type',
    pbBuscarFotoTitulo: 'Already uploaded a photo somewhere else?',
    pbBuscarFotoSub: 'Search with AI among active posts before publishing a new one',
    pbEsUnoDeTusPerros: 'Is it one of your dogs?',
    pbOcultarMisPerros: '▲  Hide my dogs',
    pbSeleccionarMisPerros: '🐕  Select from my dogs',
    pbUsarFlecha: 'Use →',
    pbFotosLabel: 'Photos',
    pbFotoBtnAgregar: 'Add photos',
    pbFotosElegidasSuffix: 'photo(s) selected',
    pbNombreAnimalLabel: "Animal's name",
    pbColorLabel: 'Main color',
    pbSexoLabel: 'Sex',
    pbOpcional: '(Optional)',
    pbSexoMacho: '♂ Male',
    pbSexoHembra: '♀ Female',
    pbNoSe: "Don't know",
    pbTeniaCollar: 'Did it have a collar?',
    pbTeniaChapitaPlaquita: 'Did it have an ID tag?',
    pbUbicacionLabel: 'Location on the map',
    pbUbicacionConfirmada: '✓ GPS location captured',
    pbUbicacionCambiar: 'Change',
    pbPermisoDenegadoMapa: "⚠️  Permission denied — the post won't show up on the map",
    pbUsarUbicacionActual: '📍  Use my current location',
    pbDireccionZonaLabel: 'Address or area *',
    pbDireccionZonaPh: 'E.g: Downtown, Main Street',
    pbDescripcionLabel: 'Additional description *',
    pbDescripcionPh: 'Special markings, spots, behavior, red collar with blue ID tag…',
    pbContactoPh: '+1 555 123 4567',
    pbMostrarNumeroLabel: 'Show number publicly',
    pbNumeroPublicoSub: 'Any registered user will see your number.',
    pbNumeroPrivadoSub: 'Users will have to request contact.',
    pbSubiendoFotosPrefix: 'Uploading photos',
    pbGuardandoAviso: 'Saving post…',
    pbPublicarBtn: 'Publish post',
    pbErrContactoTitle: 'Missing contact',
    pbErrContactoSub: 'Enter your WhatsApp number',
    pbErrZonaTitle: 'Missing area',
    pbErrZonaSub: 'Enter the neighborhood or area',
    pbErrDescTitle: 'Missing description',
    pbErrDescSub: "Tell us about special markings, behavior or other info that helps identify it.",
    pbErrFotosTitle: 'Error uploading photos',
    pbErrFotosSub: "We couldn't upload all the images. The partially uploaded ones were removed. Try again.",
    pbErrLimiteTitle: 'Limit reached',
    pbErrLimiteSub: 'You can publish up to 5 posts per hour. Wait a moment and try again.',
    pbErrGuardarTitle: 'Error saving',
    pbErrGuardarSub: 'The photos were removed. Try publishing again.',
    pbPublicadoTitle: 'Post published!',
    pbPublicadoSub: 'Your post is now visible to neighbors.',
    pbVerAvisos: 'View posts',
    pbErrGenericoSub: "We couldn't publish it. Check your connection.",
  },
  pt: {
    loginTagline: 'A rede de vizinhos para encontrar e adotar cães',
    loginTabLogin: 'Entrar',
    loginTabRegister: 'Criar conta',
    loginEmailPh: 'seu@email.com',
    loginPasswordPh: 'Senha (mín. 6 caracteres)',
    loginConfirmPasswordPh: 'Repetir senha',
    loginBtnLogin: 'Entrar',
    loginBtnRegister: 'Criar conta grátis',
    loginForgot: 'Esqueceu sua senha?',
    loginOr: 'ou',
    loginGoogle: 'Continuar com Google',
    loginGuest: 'Continuar sem conta',
    loginGuestNote: 'Você pode explorar o app, mas vai precisar de uma conta para publicar avisos ou contatar vizinhos.',
    loginTermsPrefix: 'Li e aceito os ',
    loginTermsLink: 'Termos e Condições',
    loginTermsMiddle: ' e a ',
    loginPrivacyLink: 'Política de Privacidade',
    loginTermsSuffix: ', incluindo o tratamento dos meus dados pessoais.',
    loginAgeConsent: 'Confirmo que tenho 13 anos ou mais. Menores de 13 anos não podem se cadastrar no Vecindog.',
    loginPendingTitle: 'Confirme sua conta',
    loginPendingBodyPrefix: 'Enviamos um código para',
    loginPendingBodySuffix: 'Digite o código de 6 dígitos para ativar sua conta. Se não encontrar, verifique a pasta de spam.',
    loginCodigoPh: 'Código de 6 dígitos',
    loginConfirmarBtn: 'Confirmar conta',
    loginCodigoErr: 'Código inválido ou expirado. Tente reenviar.',
    loginResend: 'Reenviar email de confirmação',
    loginAlreadyConfirmed: 'Já confirmei → Entrar',
    loginErrFields: 'Preencha todos os campos',
    loginErrPasswordMismatch: 'As senhas não coincidem',
    loginErrPasswordMismatchSub: 'Verifique se as duas senhas são iguais.',
    loginErrInvalidCredentials: 'Email ou senha incorretos.',
    loginErrEmailNotConfirmed: 'Confirme seu email antes de entrar.',
    loginErrAlreadyRegistered: 'Já existe uma conta com esse email.',
    loginErrWeakPassword: 'A senha deve ter pelo menos 6 caracteres.',
    loginErrRateLimit: 'Muitas tentativas. Aguarde alguns minutos.',
    loginErrEnterEmail: 'Digite seu email',
    loginErrEnterEmailSub: 'Escreva seu email acima e toque em "Esqueci minha senha".',
    loginRecoverySuccessTitle: 'Confira seu email!',
    loginRecoverySuccessSub: 'Enviamos um link para redefinir sua senha.',
    loginResendSuccessTitle: 'Email reenviado',
    homeSubGreeting: 'Rede de vizinhos para pets',
    homeCatTodos: 'Todos',
    homeCatPerdidos: 'Perdidos',
    homeCatVistos: 'Vistos',
    homeCatAdopcion: 'Adoção',
    homeCatTransito: 'Trânsito',
    homeCuidadoTitle: 'Cuidado de cães',
    homeCuidadoSub: 'Peça ou ofereça ajuda cuidando de pets',
    homeTransporteTitle: 'Transporte de cães',
    homeTransporteSub: 'Encontre quem ajude a transportar seu pet',
    homeNuevo: 'NOVO',
    homeAvisosRecientes: 'Avisos recentes',
    homeEmpty: 'Nenhum aviso nesta categoria.',
    homeErrorTitle: 'Sem conexão',
    homeErrorSub: 'Não conseguimos carregar os avisos. Verifique sua conexão.',
    homeRetry: 'Tentar novamente',
    homeSinNombre: 'Sem nome',
    tabInicio: 'Início',
    tabAvisos: 'Avisos',
    tabMapa: 'Mapa',
    tabMisPerros: 'Meus cães',
    tabPerfil: 'Perfil',
    avisosTitle: 'Avisos',
    avisosSearchPh: '🔍  Buscar por nome, raça, zona…',
    avisosCatTodos: 'Todos',
    avisosCatPerdido: 'Perdido',
    avisosCatEncontrado: 'Encontrado',
    avisosCatAdopcion: 'Para adoção',
    avisosCatTransito: 'Em trânsito',
    avisosCountSingular: 'aviso',
    avisosCountPlural: 'avisos',
    avisosErrorText: 'Não foi possível carregar os avisos.',
    avisosEmpty: 'Nenhum aviso encontrado.',
    avisosPublicar: 'Publicar um aviso',
    avisosBadgeResuelto: 'Resolvido',
    avisosBadgeEnLaCalle: 'Na rua',
    avisosDiasRestantesSuffix: 'd restantes',
    avisosVenceHoy: 'Vence hoje',
    mapaLeyendaPerdido: 'Perdido',
    mapaLeyendaEncontrado: 'Visto',
    mapaLeyendaAdopcion: 'Para adoção',
    mapaLeyendaTransito: 'Na rua',
    mapaVerAviso: 'Ver aviso →',
    mapaAvisosSuffix: 'avisos',
    mapaWebTitle: 'Mapa disponível no app',
    mapaWebSub: 'O mapa interativo funciona em iOS e Android.',
    mapaWebCargadosSuffix: 'avisos com localização carregados.',
    misPerrosTitle: 'Meus cães 🐶',
    misPerrosCountSingular: 'registrado',
    misPerrosCountPlural: 'registrados',
    misPerrosAmigos: '👥 Amigos',
    misPerrosAmigosLocked: '🔒 Amigos',
    misPerrosAgregar: '+ Adicionar',
    misPerrosEmptyTitle: 'Nenhum cão registrado',
    misPerrosEmptySub: 'Registre seu cão para ter todas as informações prontas.',
    misPerrosEmptyBtn: '+ Registrar cão',
    perfilGuestTitle: 'Você está navegando como convidado',
    perfilGuestSub: 'Crie uma conta grátis para publicar avisos, contatar vizinhos e salvar seus cães.',
    perfilGuestBtn: 'Criar conta grátis →',
    perfilDatosPersonales: 'Dados pessoais',
    perfilEditar: '✏️ Editar',
    perfilCancelar: 'Cancelar',
    perfilFieldNombre: 'Nome *',
    perfilFieldApellido: 'Sobrenome *',
    perfilFieldTelefono: 'Telefone',
    perfilFieldTelefonoPh: '+54 9 291...',
    perfilFieldCiudad: 'Cidade',
    perfilFieldCiudadPh: 'Bahía Blanca',
    perfilFieldProvincia: 'Província',
    perfilFieldProvinciaPh: 'Buenos Aires',
    perfilFieldPais: 'País',
    perfilFieldPaisPh: 'Argentina',
    perfilFieldDireccion: 'Endereço',
    perfilFieldDireccionPh: 'Rua 123',
    perfilGuardarCambios: 'Salvar alterações',
    perfilCompletarTitle: 'Complete seu perfil',
    perfilCompletarSub: 'Adicione seu nome e telefone para que os vizinhos possam contatá-lo quando encontrar ou perder um pet.',
    perfilCompletarBtn: 'Completar agora →',
    perfilRowNombre: 'Nome',
    perfilRowTelefono: 'Telefone',
    perfilRowCiudad: 'Cidade',
    perfilRowProvincia: 'Província',
    perfilRowPais: 'País',
    perfilRowDireccion: 'Endereço',
    perfilSosTitle: 'SOS: meu cão sumiu',
    perfilSosSub: 'Avise todos os seus amigos de uma vez',
    perfilSosSubLocked: 'Recurso do VecindogPro',
    perfilLinkMisAvisos: '🗺️  Ver meus avisos publicados',
    perfilLinkPublicitate: '📣  Anuncie',
    perfilLinkAdmin: '🛡️  Painel de denúncias',
    perfilLinkWeb: '🌐  Abrir versão web',
    perfilLinkTerminos: '📄  Termos e Condições',
    perfilLinkPrivacidad: '🔒  Política de Privacidade',
    perfilIdioma: '🌐  Idioma',
    perfilBiometricTitle: 'Desbloqueio biométrico',
    perfilBiometricSub: 'Use Face ID ou Touch ID para entrar mais rápido na próxima vez.',
    perfilBiometricEnableFail: 'Não foi possível verificar sua identidade. Tente novamente.',
    lockScreenTitle: 'Vecindog',
    lockScreenSub: 'Desbloqueie com Face ID ou Touch ID para continuar.',
    lockScreenBtn: 'Desbloquear',
    lockScreenSalir: 'Sair',
    perfilCerrarSesion: 'Sair',
    perfilCerrarSesionConfirm: 'Tem certeza?',
    perfilCerrarSesionSalir: 'Sair',
    perfilEliminarCuenta: 'Excluir minha conta',
    perfilEliminarCuentaConfirmTitle: 'Excluir sua conta',
    perfilEliminarCuentaConfirmSub: 'Seu perfil, cães, anúncios, mensagens e todos os seus dados do Vecindog serão excluídos permanentemente. Esta ação não pode ser desfeita.',
    perfilEliminarCuentaBtn: 'Excluir conta',
    perfilEliminarCuentaEnCurso: 'Excluindo sua conta…',
    perfilVersion: 'Vecindog v1.0.0 · mivecindog.com.ar',
    perfilPermisoDenegadoTitle: 'Permissão negada',
    perfilPermisoDenegadoSub: 'Precisamos de acesso à sua galeria',
    perfilErrorFotoSub: 'Não foi possível atualizar a foto. Verifique sua conexão.',
    perfilCamposRequeridosTitle: 'Campos obrigatórios',
    perfilCamposRequeridosSub: 'Digite nome e sobrenome',
    perfilGuardadoTitle: '✅ Salvo',
    perfilGuardadoSub: 'Seu perfil foi atualizado.',
    perfilErrorGeneric: 'Erro',
    perfilSinDescripcion: 'Sem descrição',
    perfilModalSosTitle: '🚨 Alerta SOS',
    perfilModalSosSub: 'Todos os seus amigos são notificados com uma mensagem e um email',
    perfilModalSinPerros: 'Você ainda não tem cães registrados. Registre um para poder usar o SOS.',
    perfilModalCualSePerdio: 'Qual sumiu?',
    perfilModalErrorEnvio: 'Não foi possível enviar o alerta. Tente novamente.',
    perfilModalAlertarBtn: '🚨 Alertar meus amigos',
    perfilModalCerrar: 'Fechar',
    perfilModalEnviadaTitle: 'Alerta enviado!',
    perfilModalAvisamosPrefix: 'Avisamos',
    perfilModalAmigoSingular: 'amigo seu',
    perfilModalAmigoPlural: 'amigos seus',
    perfilModalAvisamosSuffix: 'por notificação e email.',
    perfilModalSinAmigos: 'Você ainda não tem amigos adicionados no Vecindog — adicione vizinhos em "Meus cães" > Amigos para que o SOS chegue até eles.',
    perfilModalListo: 'Pronto',
    nuevoPerroFotoAgregar: 'Adicionar foto',
    nuevoPerroNombre: 'Nome *',
    nuevoPerroNombrePh: 'Ex: Bobby',
    nuevoPerroRaza: 'Raça',
    nuevoPerroRazaPh: 'Ex: Labrador, Pastor, Vira-lata…',
    nuevoPerroColor: 'Cor',
    nuevoPerroColorNoSe: 'Não sei / não lembro',
    nuevoPerroColorModalTitulo: 'Cor principal',
    nuevoPerroSexo: 'Sexo',
    nuevoPerroSexoMacho: 'macho',
    nuevoPerroSexoHembra: 'fêmea',
    nuevoPerroTamano: 'Tamanho',
    nuevoPerroFechaNac: 'Data de nascimento',
    nuevoPerroFechaNacPh: 'AAAA-MM-DD',
    nuevoPerroChip: 'Nº do Microchip',
    nuevoPerroChipPh: 'Nº do chip',
    nuevoPerroEsterilizado: 'Castrado(a)',
    nuevoPerroDescripcion: 'Descrição',
    nuevoPerroDescripcionPh: 'Marcas especiais, comportamento…',
    nuevoPerroGuardar: 'Salvar cão',
    nuevoPerroErrPermiso: 'Permissão negada',
    nuevoPerroErrFaltaNombreTitle: 'Falta o nome',
    nuevoPerroErrFaltaNombreSub: 'Digite o nome do seu cão',
    nuevoPerroListoTitle: 'Pronto!',
    nuevoPerroListoSubSuffix: 'foi registrado com sucesso.',
    nuevoPerroVerMisPerros: 'Ver meus cães',
    nuevoPerroErrGuardarSub: 'Não foi possível salvar. Verifique sua conexão.',
    campoFecha: 'Data',
    campoNotas: 'Notas',
    campoVeterinario: 'Veterinário',
    campoTelefono: 'Telefone',
    campoNombre: 'Nome',
    campoTipo: 'Tipo',
    campoDescripcion: 'Descrição',
    campoProximaDosis: 'Próxima dose',
    campoDosis: 'Dose',
    campoFrecuencia: 'Frequência',
    campoFechaInicio: 'Data de início',
    campoFechaFin: 'Data de fim',
    campoDiagnostico: 'Diagnóstico',
    campoTratamiento: 'Tratamento',
    campoMotivo: 'Motivo',
    campoRelacion: 'Relação',
    campoProducto: 'Produto',
    campoMedicamento: 'Medicamento',
    campoPesoKg: 'Peso (kg)',
    campoOpcionalPh: 'Opcional',
    campoVacunaLabel: 'Vacina',
    campoVacunaPh: 'Ex: Antirrábica',
    genericGuardar: 'Salvar',
    genericGuardarCambios: 'Salvar alterações',
    genericEliminar: 'Excluir',
    genericErrGuardarConexion: 'Não foi possível salvar. Verifique sua conexão.',
    genericAgregarBtn: '+ Adicionar',
    genericVer: 'Ver',
    genericEditar: 'Editar',
    errFechaInvalidaTitle: 'Data inválida',
    perroSeccionPerfil: '📋  Perfil',
    perroCampoFechaNacLabel: 'Data de nascimento (AAAA-MM-DD)',
    perroCampoFechaNacPh: 'Ex: 2022-05-14',
    perroCampoChipLabel: 'Nº do microchip',
    perroCampoAlergiasLabel: 'Alergias',
    perroCampoAlergiasPh: 'Ex: frango, pólen',
    perroCampoVetNombreLabel: 'Veterinário habitual',
    perroCampoVetTelefonoLabel: 'Telefone do veterinário',
    perroCampoDireccionLabel: 'Endereço',
    perroCampoEstadoSalud: 'Estado de saúde',
    estadoSaludSaludable: '✅ Saudável',
    estadoSaludEnTratamiento: '💊 Em tratamento',
    estadoSaludEnRecuperacion: '🩹 Em recuperação',
    perroDietaTitulo: 'Dieta',
    perroDietaMarca: 'Marca',
    perroDietaCantidad: 'Quantidade',
    perroDietaCantidadPh: 'Ex: 200g',
    perroDietaFrecuenciaPh: 'Ex: 2 vezes ao dia',
    perroDietaNotas: 'Notas da dieta',
    perroSexoMachoLabel: 'Macho',
    perroSexoHembraLabel: 'Fêmea',
    perroTamanoChico: 'Pequeno',
    perroTamanoMediano: 'Médio',
    perroTamanoGrande: 'Grande',
    perroSeccionVacunas: 'Carteira de Vacinação',
    perroVacioVacunas: 'Nenhuma vacina registrada.',
    perroCampoVacunaNombrePh: 'Ex: Antirrábica',
    perroSeccionDesparasitaciones: 'Vermifugação',
    perroVacioDesparasitaciones: 'Nenhuma vermifugação registrada.',
    perroCampoProductoPh: 'Ex: NexGard',
    perroSeccionMedicamentos: 'Medicamentos',
    perroVacioMedicamentos: 'Nenhum medicamento registrado.',
    perroSeccionPeso: 'Peso',
    perroVacioPeso: 'Nenhum registro de peso.',
    perroPesoInvalido: 'Digite um peso válido em kg (ex: 12.5).',
    perroSeccionVisitas: 'Visitas ao veterinário',
    perroVacioVisitas: 'Nenhuma visita registrada.',
    perroSeccionProcedimientos: 'Procedimentos e cirurgias',
    perroVacioProcedimientos: 'Nenhum procedimento registrado.',
    perroSeccionGrooming: 'Grooming',
    perroSeccionContactos: 'Contatos de emergência',
    perroVacioContactos: 'Nenhum contato de emergência.',
    perroCampoRelacionPh: 'Ex: Familiar, passeador',
    perroCampoTelefonoPh: '+54 9 ...',
    perroSeccionGaleria: '🖼️  Galeria de fotos',
    perroGaleriaAgregar: '+ Adicionar',
    perroGaleriaPro: '✨ Pro',
    perroGaleriaHint: 'Mantenha pressionada uma foto para excluí-la',
    perroSeccionExtras: '✨  Extras',
    perroQrCollar: '📱  QR para a coleira',
    perroCompartirQr: 'Compartilhar QR',
    perroExtraHint: 'Gere e compartilhe estes documentos direto do app:',
    perroExtraCartel: '🚨  Cartaz de perdido',
    perroExtraHistoria: '📸  História para Instagram/Facebook',
    perroExtraTimeline: '🗓️  Linha do tempo',
    perroExtraCarnetPdf: '🪪  Baixar carteira em PDF',
    perroHistoriaBtn: '📤  Compartilhar Histórico Clínico',
    perroHistoriaClinicaDePrefix: 'Histórico Clínico de',
    perroMiPerroFallback: 'meu cão',
    perroEstudioLaboratorio: 'Exames de Laboratório',
    perroEstudioRadiografia: 'Radiografias',
    perroEstudioEcografia: 'Ecografias',
    perroEstudioCertChip: 'Certificado de Chip',
    perroEstudioCertCvi: 'Certificado CVI',
    perroEstudioCertAntiparasitario: 'Certificado Antiparasitário',
    perroEstudioVacunaAntirrabica: 'Vacina Antirrábica',
    perroEstudioAirtag: 'AirTag / Rastreador',
    perroSubirBtn: '+ Enviar',
    perroArchivoSubidoTitle: '✅ Arquivo enviado',
    perroArchivoSubidoSuffix: 'adicionado com sucesso.',
    perroAirtagPrompt: 'Digite o número de série ou código do rastreador',
    perroAirtagOnlyIphoneTitle: 'AirTag',
    perroAirtagOnlyIphoneSub: 'Recurso disponível no iPhone',
    perroErrGuardarAirtag: 'Não foi possível salvar o AirTag. Verifique sua conexão.',
    perroErrSubirArchivo: 'Não foi possível enviar o arquivo. Verifique sua conexão.',
    perroErrCompartirQr: 'Não foi possível compartilhar o QR.',
    perroErrPdf: 'Não foi possível gerar o PDF.',
    perroErrHistoriaImg: 'Não foi possível gerar a imagem.',
    perroTimelineTitle: '🗓️  Linha do tempo',
    perroTimelineVacio: 'Ainda não há registros médicos.',
    perroHistoriaTitle: '📸  História para Instagram/Facebook',
    perroHistoriaMostrarTel: 'Mostrar telefone na imagem',
    perroHistoriaCompartir: 'Compartilhar',
    perroHistoriaFelizYSano: 'feliz e saudável 🎉',
    perroHistoriaSocio: 'Sou sócio da Vecindog 🐾',
    perroNoEncontrado: 'Cão não encontrado',
    perroErrCargarTitle: 'Não foi possível carregar',
    perroErrCargarSub: 'Verifique sua conexão e tente novamente.',
    perroErrSubirFoto: 'Não foi possível enviar a foto.',
    perroErrCambiarFoto: 'Não foi possível trocar a foto. Verifique sua conexão.',
    perroErrBorrarFoto: 'Não foi possível excluir a foto. Verifique sua conexão.',
    perroConfirmBorrarSub: 'Tem certeza que quer excluir este registro?',
    perroConfirmBorrarFotoTitle: 'Excluir foto',
    perroConfirmBorrarFotoSub: 'Excluir esta foto da galeria?',
    perroEliminarVacuna: 'Excluir vacina',
    perroEliminarDesparasitacion: 'Excluir vermifugação',
    perroEliminarMedicamento: 'Excluir medicamento',
    perroEliminarPeso: 'Excluir registro de peso',
    perroEliminarVisita: 'Excluir visita',
    perroEliminarProcedimiento: 'Excluir procedimento',
    perroEliminarContacto: 'Excluir contato',
    perroProximaDosisPrefix: 'Próx:',
    groomingUltimaFecha: 'Última data',
    groomingFrecuenciaDias: 'Frequência (dias)',
    groomingUltimaVez: 'Última vez',
    groomingCadaPrefix: 'a cada',
    groomingDiasSuffix: 'dias',
    groomingBorrarRegistro: '🗑 Excluir registro',
    groomingBorrando: 'Excluindo…',
    groomingFechaInvalidaSub: 'A última data precisa estar no formato AAAA-MM-DD.',
    groomingFrecuenciaInvalidaTitle: 'Frequência inválida',
    groomingFrecuenciaInvalidaSub: 'Digite uma quantidade de dias válida (ex: 30).',
    groomingConfirmBorrarTitle: 'Excluir registro',
    groomingConfirmBorrarSub: 'Tem certeza que quer excluir o registro de grooming?',
    groomingTipoBano: 'banho',
    groomingTipoPeluqueria: 'tosa',
    groomingTipoAmbos: 'ambos',
    turnoFechaInvalida: 'O agendamento precisa estar no formato AAAA-MM-DD.',
    turnoErrGuardar: 'Não foi possível salvar o agendamento. Verifique sua conexão.',
    turnoFechaLabel: 'Data do agendamento',
    turnoGuardarBtn: 'Salvar agendamento',
    turnoProximoPrefix: '📅 Próximo agendamento:',
    turnoVencido: '⚠️ Vencido',
    turnoVigente: '✓ Em dia',
    turnoRegistrarBtn: '📅 + Registrar agendamento',
    perroPesoEvolucion: '📈  Evolução do peso',
    perroPesoVsAnterior: 'kg vs. registro anterior',
    historialEditando: 'Editando registro',
    historialPro: '✨ VecindogPro',
    historialVacioDefault: 'Nenhum dado ainda.',
    historialFaltaDatoTitle: 'Falta um dado',
    historialCompletaPrefix: 'Preencha "',
    historialCompletaSuffix: '".',
    historialFechaInvalidaMiddle: 'precisa estar no formato AAAA-MM-DD (ex:',
    historialFechaInvalidaEnd: ').',
    dateFormatPh: 'AAAA-MM-DD',
    perroEliminarArchivoTitle: 'Excluir arquivo',
    perroBorrarArchivoPrefix: 'Excluir',
    resetErrPasswordCorta: 'A senha deve ter pelo menos 6 caracteres.',
    resetErrPasswordMismatch: 'As senhas não coincidem.',
    resetErrLinkInvalido: 'O link de recuperação é inválido ou expirou. Solicite um novo.',
    resetListoTitle: 'Senha atualizada!',
    resetListoSub: 'Agora você pode continuar usando o app com sua nova senha.',
    resetContinuar: 'Continuar',
    resetTitle: 'Nova senha',
    resetSub: 'Digite sua nova senha para continuar.',
    resetPasswordPh: 'Nova senha (mín. 6 caracteres)',
    resetConfirmPh: 'Confirmar senha',
    resetGuardarBtn: 'Salvar senha',
    notifTitle: 'Notificações',
    notifNuevaSingular: 'nova',
    notifNuevaPlural: 'novas',
    notifMarcarTodas: 'Marcar todas como lidas',
    notifEmptyTitle: 'Você não tem notificações',
    notifEmptySub: 'Vamos avisar quando houver avisos perto da sua casa.',
    notifAceptar: '✓ Aceitar',
    notifRechazar: '✕ Recusar',
    notifLoEncontre: 'Já encontrei!',
    notifSigoBuscando: 'Ainda estou procurando',
    notifErrGeneric: 'Ocorreu um erro. Tente novamente.',
    notifHacePrefix: 'Há',
    notifMinSuffix: 'min',
    notifHsSuffix: 'h',
    notifDiasSuffix: 'dias',
    notifTuVecinoFallback: 'Seu vizinho',
    notifAceptoSolicitudSuffix: 'aceitou sua solicitação de amizade 🐾',
    amigosVolver: '← Voltar',
    amigosTitle: '👥 Amigos',
    amigosTabMisAmigos: 'Meus amigos',
    amigosTabBuscar: 'Buscar cão',
    amigosSolicitudesRecibidas: 'Solicitações recebidas',
    amigosUsuarioFallback: 'Usuário',
    amigosAlguienFallback: 'Alguém',
    amigosAmigosLabel: 'Amigos',
    amigosEmptyTitle: 'Você ainda não tem amigos',
    amigosEmptySub: 'Busque o nome do cão do seu vizinho e envie uma solicitação.',
    amigosSearchPh: '🔍  Nome do cão ou dono…',
    amigosNoEncontrado: 'Não encontramos nenhum cão com esse nome.',
    amigosEscribeNombre: 'Digite o nome do cão do seu vizinho para buscá-lo.',
    amigosDePrefix: 'de',
    amigosYaAmigos: '✓ Amigos',
    amigosPendiente: '⏳ Pendente',
    bpfLockedTitle: 'Recurso do VecindogPro',
    bpfLockedSub: 'Buscar por foto usa inteligência artificial para analisar a foto de um cão e compará-la com os avisos ativos da comunidade.',
    bpfVerPlanes: 'Ver planos',
    bpfSubtitulo: 'Envie uma foto do cão e a IA vai sugerir cor, raça e tamanho para buscá-lo entre os avisos ativos.',
    bpfElegirGaleria: 'Escolher da galeria',
    bpfAnalizando: 'Analisando com IA…',
    bpfTomarFoto: '📸  Tirar foto',
    bpfEmpezarDeNuevo: '↺  Começar de novo',
    bpfColorMatch: 'Cor:',
    bpfRazaMatch: 'Raça:',
    bpfTamanoMatch: 'Tamanho:',
    bpfConCollar: 'Com coleira',
    bpfSinCollar: 'Sem coleira',
    bpfConChapita: 'Com plaquinha',
    bpfSinChapita: 'Sem plaquinha',
    bpfErrPermisoGaleria: 'Precisamos de acesso à sua galeria',
    bpfErrPermisoCamara: 'Precisamos de acesso à sua câmera',
    bpfErrIniciarSesionTitle: 'Entre na sua conta',
    bpfErrIniciarSesionSub: 'Você precisa estar logado para usar esta função.',
    bpfErrAnalizarDefault: 'Erro ao analisar a foto',
    bpfErrAnalizarTitle: 'Não foi possível analisar',
    bpfErrAnalizarFotoSub: 'Não foi possível analisar a foto. Verifique sua conexão.',
    bpfErrBuscar: 'Não foi possível buscar. Verifique sua conexão.',
    bpfLabelColor: 'Cor',
    bpfLabelTamano: 'Tamanho',
    bpfLabelRaza: 'Raça (opcional)',
    bpfTeniaCollar: 'Tinha coleira?',
    bpfTeniaChapita: 'Tinha plaquinha?',
    bpfSi: 'Sim',
    bpfNo: 'Não',
    bpfNoSe: 'Não sei',
    bpfBuscarBtn: '🔍  Buscar nos avisos ativos',
    bpfSinCoincidencias: 'Não encontramos correspondências',
    bpfCoincidenciaSingular: 'possível correspondência',
    bpfCoincidenciaPlural: 'possíveis correspondências',
    bpfPerdido: 'Perdido',
    bpfEncontrado: 'Encontrado',
    postMotivoFalsa: 'Informação falsa ou enganosa',
    postMotivoInapropiado: 'Conteúdo inapropriado ou ofensivo',
    postMotivoSpam: 'Spam ou publicidade',
    postMotivoMaltrato: 'Suspeita de maus-tratos',
    postMotivoOtro: 'Outro',
    postErrIniciarSesionReporte: 'Você precisa de uma conta para denunciar um aviso.',
    postReportarPregunta: 'Por que você quer denunciar este aviso?',
    postErrReporte: 'Não foi possível enviar a denúncia. Tente novamente.',
    postReporteEnviadoTitle: 'Denúncia enviada',
    postReporteEnviadoSub: 'Obrigado. Nossa equipe vai revisar este aviso.',
    postErrIniciarSesionContacto: 'Você precisa de uma conta para solicitar o contato.',
    postPushTuAviso: 'seu aviso',
    postPushTitlePrefix: '📩 Solicitação de contato —',
    postPushQuiereContactarte: 'quer entrar em contato com você. Seus dados:',
    postSolicitudEnviadaTitle: '✅ Solicitação enviada',
    postSolicitudEnviadaSub: 'Quem publicou vai receber uma notificação com seus dados de contato.',
    postErrSolicitud: 'Não foi possível enviar a solicitação. Tente novamente.',
    postNoEncontrado: 'Aviso não encontrado',
    postSharePerroFallback: 'Cão',
    postConfirmRenovarTitle: 'Colocar este aviso no topo da lista?',
    postConfirmRenovarSub: 'O aviso vai aparecer primeiro para mais pessoas.',
    postSiRenovar: 'Sim, renovar',
    postRenovarListoTitle: 'Pronto',
    postRenovarListoSub: 'Seu aviso voltou ao topo da lista.',
    postErrRenovar: 'Não foi possível renovar o aviso. Tente novamente.',
    postConfirmResueltoPerdidoTitle: 'Você já encontrou seu cão?',
    postConfirmResueltoOtroTitle: 'Marcar este aviso como resolvido?',
    postConfirmResueltoPerdidoSub: 'O aviso vai deixar de aparecer como ativo.',
    postConfirmResueltoOtroSub: 'Esta ação não pode ser desfeita.',
    postSiMarcarResuelto: 'Sim, marcar resolvido',
    postResueltoListoTitle: 'Pronto! 🎉',
    postResueltoListoSub: 'Ficamos felizes que foi resolvido.',
    postErrResuelto: 'Não foi possível atualizar o aviso. Tente novamente.',
    postConfirmBorrarTitle: 'Excluir este aviso?',
    postBorrarBtnConfirm: 'Excluir',
    postErrBorrar: 'Não foi possível excluir o aviso. Tente novamente.',
    postResuelto: 'RESOLVIDO',
    postActivo: 'ATIVO',
    postDatoEspecie: 'Espécie',
    postDatoRaza: 'Raça',
    postDatoColor: 'Cor',
    postDatoTamano: 'Tamanho',
    postDatoZona: 'Zona',
    postDatoCiudad: 'Cidade',
    postDatoFecha: 'Data',
    postDescripcionTitle: 'Descrição',
    postLoginPromptText: 'Entre na sua conta para ver o contato deste aviso.',
    postLoginLink: 'Entrar →',
    postSinContactoText: '🙈  Quem publicou este aviso preferiu não deixar contato. Você pode compartilhá-lo para que chegue a mais pessoas.',
    postSolicitudEnviadaTexto: '✅  Solicitação enviada. Quem publicou vai entrar em contato.',
    postSolicitarContactoBtn: '📩  Solicitar contato',
    postWhatsappBtn: '💬  Escrever pelo WhatsApp',
    postWaMensajeDefault: 'Olá, estou escrevendo sobre o aviso do Vecindog.',
    postManagePanelAdmin: '🛡️ Painel de administração',
    postManagePanelDueno: '🐶 Gerenciar meu aviso',
    postRenovarBtn: '🔄  Ainda estou procurando (subir ao topo)',
    postMarcarResueltoAdmin: 'Marcar resolvido',
    postYaLoEncontre: 'Já encontrei',
    postMarcarResuelto: 'Marcar resolvido',
    postBorrarAvisoBtn: '🗑️  Excluir aviso',
    postReportado: '⚑  Aviso denunciado',
    postReportarBtn: '⚑  Denunciar este aviso',
    adminAccesoRestringido: '⛔  Acesso restrito',
    adminSinRevisar: 'não revisados',
    adminReportesLabel: 'denúncias',
    adminVerTodos: 'Ver todos',
    adminSoloNuevos: 'Somente novos',
    adminSinPendientes: '✅ Nenhuma denúncia pendente.',
    adminSinReportes: 'Ainda não há denúncias.',
    adminRevisado: 'Revisado',
    adminMotivo: 'Motivo',
    adminVerAviso: 'Ver aviso',
    adminDesestimar: '✓ Descartar',
    adminEliminar: '✕ Excluir',
    adminConfirmEliminarTitle: 'Excluir aviso',
    adminConfirmEliminarSub: 'Tem certeza? Esta ação não pode ser desfeita.',
    headerAviso: 'Aviso',
    headerReportes: 'Denúncias',
    headerBuscarPorFoto: 'Buscar por foto',
    headerNuevaContrasena: 'Nova senha',
    cuidadoCuidadorFallback: 'Cuidador',
    cuidadoBuscaCuidadorFallback: 'Procura cuidador',
    cuidadoDesactivar: 'Desativar',
    cuidadoVerPerfil: '⭐ Ver perfil',
    cuidadoVolver: '← Voltar',
    cuidadoComunidad: '🤝 Comunidade',
    cuidadoTitle: 'Cuidado de cães',
    cuidadoSub: 'Vizinhos que se ajudam a cuidar de seus cães.',
    cuidadoWarning: '🚫 Somente trocas entre vizinhos — é proibido cobrar ou oferecer serviços comerciais nesta seção.',
    cuidadoBuscoTitle: 'Procuro cuidador',
    cuidadoBuscoSub: 'Publique um pedido para que alguém cuide do seu cão',
    cuidadoBuscandoSection: '🔍 Procurando cuidador',
    cuidadoEmptyBusco: 'Ainda não há pedidos de cuidado.',
    cuidadoQuieroTitle: 'Quero cuidar',
    cuidadoQuieroSub: 'Cadastre-se como cuidador da sua região',
    cuidadoDisponiblesSection: '🙋 Cuidadores disponíveis',
    cuidadoEmptyCuidadores: 'Ainda não há cuidadores cadastrados.',
    qcExp1: 'Sou dono/a de cães', qcExp2: 'Tive cães quando criança', qcExp3: 'Cuidei de cães de amigos/família',
    qcExp4: 'Trabalhei com animais', qcExp5: 'Sem experiência prévia',
    qcDisp1: 'De segunda a sexta', qcDisp2: 'Fins de semana', qcDisp3: 'Qualquer dia', qcDisp4: 'Somente de dia', qcDisp5: 'Com pernoite incluído',
    qcErrLogin: 'Você precisa entrar na conta para se cadastrar.',
    qcErrNombre: 'O nome é obrigatório.',
    qcErrZona: 'A zona é obrigatória.',
    qcErrContacto: 'O contato de WhatsApp é obrigatório.',
    qcErrContactoDigits: 'O WhatsApp deve ter pelo menos 10 dígitos.',
    qcExperienciaPrefix: 'Experiência:',
    qcDisponibilidadPrefix: 'Disponibilidade:',
    qcPuedeCuidarPrefix: 'Pode cuidar de até',
    qcPerroSingular: 'cão',
    qcPerroPlural: 'cães',
    qcALaVezSuffix: 'por vez.',
    qcTienePerrosSiTexto: 'Tem cães próprios em casa.',
    qcTienePerrosNoTexto: 'Não tem cães próprios.',
    qcErrRegistrar: 'Não foi possível cadastrar. Tente novamente.',
    qcLoginRequired: 'Entre na sua conta para se cadastrar como cuidador.',
    qcProTitle: 'Recurso exclusivo VecindogPro',
    qcProSub: 'Para se cadastrar como cuidador e receber avaliações dos donos, você precisa ter o plano Pro ativo.',
    qcPublicadoTitle: 'Você se cadastrou como cuidador!',
    qcPublicadoSub: 'Seu perfil já aparece na lista de cuidadores disponíveis.',
    qcTitle: 'Quero cuidar',
    qcSub: 'Complete seu perfil de cuidador para que os donos possam te encontrar.',
    qcNombreLabel: 'Seu nome ou apelido *',
    qcNombrePh: 'Ex: Martina G.',
    qcExperienciaLabel: 'Experiência com cães',
    qcDisponibilidadLabel: 'Disponibilidade',
    qcCuantosPerrosLabel: 'Quantos cães você pode cuidar por vez?',
    qcTienesPerrosLabel: 'Você tem cães em casa?',
    qcInfoAdicionalLabel: 'Informação adicional (opcional)',
    qcInfoAdicionalPh: 'Conte mais: se tem quintal, se pode fazer pernoite, raças com as quais se sente confortável…',
    qcZonaLabel: 'Zona / Bairro *',
    qcZonaPh: 'Ex: Palermo, Villa Crespo…',
    qcContactoLabel: 'WhatsApp de contato *',
    qcContactoPh: 'Ex: 1122334455',
    qcSubmitBtn: '🤲 Cadastrar-me como cuidador',
    bcErrLogin: 'Você precisa entrar na conta para publicar.',
    bcErrZona: 'A zona é obrigatória.',
    bcErrContacto: 'O contato de WhatsApp é obrigatório.',
    bcErrContactoDigits: 'O WhatsApp deve ter pelo menos 10 dígitos.',
    bcErrFechas: 'A data final não pode ser anterior à inicial.',
    bcFechasPrefix: 'Datas: de',
    bcFechasAlSuffix: 'até',
    bcDesdeElPrefix: 'A partir de',
    bcDescDefault: 'Procuro cuidador para meu cão.',
    bcErrPublicar: 'Não foi possível publicar. Tente novamente.',
    bcLoginRequired: 'Entre na sua conta para publicar um pedido de cuidado.',
    bcLoginBtn: 'Entrar',
    bcPublicadoTitle: 'Aviso publicado!',
    bcPublicadoSub: 'Seu pedido já aparece na lista de cuidado.',
    bcTitle: 'Procuro cuidador',
    bcSub: 'Publique um aviso para encontrar alguém que cuide do seu cão.',
    bcParaCualPerro: 'Para qual dos seus cães?',
    bcSinPerros: 'Você não tem cães cadastrados.',
    bcRegistrarUno: 'Cadastre um →',
    bcContinuarSinPerro: 'Você também pode continuar sem selecionar um cão e preencher os dados manualmente.',
    bcFechasLabel: 'Para quais datas? (opcional)',
    bcDesdeLabel: 'De',
    bcHastaLabel: 'Até',
    bcDescLabel: 'Descrição (opcional)',
    bcDescPh: 'Necessidades especiais, rotinas, informações importantes para o cuidador…',
    bcSubmitBtn: 'Publicar aviso',
    ratingModalPuntuacion: 'Pontuação *',
    ratingErrSeleccionaPuntuacion: 'Selecione uma pontuação.',
    ratingComoCuido: 'Como cuidou do cão?',
    ratingExcelente: 'Excelente',
    ratingBueno: 'Bom',
    ratingRegular: 'Regular',
    ratingFuePuntual: 'Foi pontual?',
    ratingBuenaCom: 'Boa comunicação?',
    ratingLoRecomienda: 'Você o recomendaria?',
    ratingComentarioLabel: 'Comentário (opcional)',
    ratingComentarioPh: 'Conte sua experiência…',
    ratingErrGuardarDefault: 'Erro ao salvar. Tente novamente.',
    ratingNoEncontrado: 'Este perfil não foi encontrado.',
    ratingCalificaciones: '⭐ Avaliações',
    ratingCalificar: 'Avaliar',
    ratingGuardadoTexto: '✓ Avaliação salva',
    ratingSinCalificaciones: 'Ainda não tem avaliações.',
    ratingCuidadoPrefix: 'Cuidado:',
    ratingPuntual: '⏰ Pontual',
    ratingBuenaComBadge: '💬 Boa comunicação',
    ratingLoRecomiendaBadge: '👍 Recomendado',
    ratingContactarWhatsapp: '📞 Contatar pelo WhatsApp',
    ratingDisponibilidadPrefix: '📅 Disponibilidade:',
    ratingCalificacionesSuffix: 'avaliações',
    ratingSobre: 'Sobre',
    cuidadorFallbackNombre: 'Cuidador disponível',
    cuidadorModalTitle: 'Avaliar cuidador',
    transportadorFallbackNombre: 'Transportador disponível',
    transportadorModalTitle: 'Avaliar transportador',
    transportadorFallback: 'Transportador',
    transporteComunidad: '🚗 Comunidade',
    transporteTitle: 'Transporte de cães',
    transporteSub: 'Vizinhos que ajudam a transportar pets.',
    transporteQuieroTitle: 'Quero transportar',
    transporteQuieroSub: 'Cadastre-se como transportador da sua região',
    transporteDisponiblesSection: '🚗 Transportadores disponíveis',
    transporteEmptyDisponibles: 'Ainda não há transportadores cadastrados.',
    qtDisp5: 'Com horário flexível',
    qtVehiculoAuto: '🚗 Carro',
    qtVehiculoCamioneta: '🚐 Van',
    qtVehiculoCamion: '🚛 Caminhão',
    qtVehiculoPrefix: 'Veículo:',
    qtVehiculoCamionLabel: 'Caminhão',
    qtPuedeTransportarPrefix: 'Pode transportar até',
    qtLoginRequired: 'Entre na sua conta para se cadastrar como transportador.',
    qtProSub: 'Para se cadastrar como transportador e receber avaliações dos donos, você precisa ter o plano Pro ativo.',
    qtPublicadoTitle: 'Você se cadastrou como transportador!',
    qtPublicadoSub: 'Seu perfil já aparece na lista de transportadores disponíveis.',
    qtTitle: 'Quero transportar cães',
    qtSub: 'Complete seu perfil de transportador para que os donos possam te encontrar.',
    qtCuantosPerrosLabel: 'Quantos cães você pode transportar por vez?',
    qtVehiculoLabel: 'Qual veículo você tem?',
    qtInfoAdicionalPh: 'Conte mais: se tem carro próprio, quais zonas cobre, se faz translados ao veterinário…',
    qtSubmitBtn: '🚗 Cadastrar-me como transportador',
    rvBenef1Titulo: 'No mapa', rvBenef1Desc: 'Seu negócio aparece diretamente onde os vizinhos buscam cães perdidos.',
    rvBenef2Titulo: 'Telefone visível', rvBenef2Desc: 'Os usuários veem seu número com um toque a partir do mapa.',
    rvBenef3Titulo: 'Horário de atendimento', rvBenef3Desc: 'Informe seus dias e horários para que cheguem quando você abre.',
    rvBenef4Titulo: 'Endereço exato', rvBenef4Desc: 'Seu endereço e localidade visíveis para toda a comunidade.',
    rvList1: 'Você aparece no mapa onde os vizinhos buscam cães',
    rvList2: 'Telefone, endereço e horário sempre visíveis',
    rvList3: 'Classificado no seu ramo (veterinária, petshop, banho e tosa…)',
    rvList4: 'Público 100% donos de pets ativos',
    rvList5: 'Sem bots — usuários reais da sua região',
    rvList6: 'Ativação em menos de 24 horas',
    rvChipPromo: '⭐ Promoção · 3 meses grátis',
    rvChipRegularPrefix: '⭐ Rede · $',
    rvChipRegularSuffix: 'ARS/mês',
    rvTitle: 'Rede Vecindog',
    rvSub: 'Adicione seu negócio e apareça no mapa onde os vizinhos buscam seus cães — com telefone, horário e endereço sempre visíveis.',
    rvCtaBtn: '🏢 Cadastrar meu negócio',
    rvElegiRubro: 'Escolha seu ramo',
    rvPromoTitulo: 'Primeiros 3 meses grátis',
    rvPromoDesc: 'Cadastre seu negócio agora e não pague nada até o 4º mês.',
    rvPricingTitulo: 'Uma única tarifa, sem surpresas',
    rvPricingPerSuffix: '/ mês a partir do 4º mês',
    rvUnirmeBtn: 'Entrar na rede →',
    rvFinalTitulo: 'Pronto para participar?',
    rvFinalSub: 'Preencha o formulário e seu negócio aparece no mapa em menos de 24 horas.',
    rvModalTitulo: 'Cadastrar meu negócio',
    rvModalSubPromo: '🎁 3 meses grátis',
    rvErrNombreNegocio: 'Digite o nome do negócio.',
    rvErrCategoria: 'Selecione uma categoria.',
    rvErrCiudad: 'Digite sua cidade.',
    rvErrTelefono: 'Digite um telefone de contato.',
    rvErrDireccion: 'Digite o endereço do negócio.',
    rvErrEmail: 'Digite seu email.',
    rvErrTelefonoDigits: 'O telefone deve ter pelo menos 10 dígitos.',
    rvErrLogin: 'Você precisa entrar na conta para cadastrar seu negócio.',
    rvErrSesionExpirada: 'Sessão expirada. Entre novamente.',
    rvErrProcesar: 'Não foi possível processar o cadastro.',
    rvErrConexion: 'Erro de conexão. Tente novamente.',
    rvRegistradoTitulo: 'Negócio cadastrado!',
    rvRegistradoSub: 'Já aparece na Rede Vecindog. Enviamos um email com os detalhes.',
    rvCerrarBtn: 'Fechar',
    rvCambiarFoto: 'Trocar foto',
    rvSubirFoto: 'Enviar foto do local',
    rvNombreNegocioLabel: 'Nome do negócio *',
    rvNombreNegocioPh: 'Veterinária Central',
    rvCategoriaLabel: 'Categoria *',
    rvSeleccionaCategoria: 'Selecione uma categoria',
    rvDescBreveLabel: 'Descrição breve',
    rvDescBrevePh: 'Especialistas em raças pequenas…',
    rvDireccionLabel: 'Endereço *',
    rvDireccionPh: 'Av. San Martín 1234',
    rvPermisoDenegadoMapa: '⚠️  Permissão negada — digite o endereço manualmente',
    rvCiudadLabel: 'Cidade *',
    rvCiudadPh: 'Ex: Bahía Blanca',
    rvCambiarBtn: 'Trocar',
    rvDiasAtencionLabel: 'Dias de atendimento',
    rvDia1: 'Segunda a sexta', rvDia2: 'Segunda a sábado', rvDia3: 'Todos os dias',
    rvAperturaLabel: 'Abertura',
    rvCierreLabel: 'Fechamento',
    rvTelefonoLabel: 'Telefone *',
    rvLinkLabel: 'Link do negócio',
    rvEmailLabel: 'Email *',
    rvTrialNote: 'Sem custo nos primeiros 3 meses · depois renova mensalmente',
    rvActivarBtn: 'Ativar grátis — 3 meses sem custo',
    rvIosActivarBtn: 'Ativar assinatura',
    rvIosPagoNote: 'Cobrado através da sua conta Apple · renova mensalmente',
    rvIosBrowseSub: 'Encontre comércios e serviços para seu cão perto de você.',
    rvRegistrarBtn: 'Cadastrar meu negócio',
    rvcNoEncontrada: 'Categoria não encontrada.',
    rvcCompletaCiudad: 'Complete sua cidade',
    rvcCompletaCiudadSub: 'Precisamos saber sua cidade para mostrar os negócios perto de você.',
    rvcIrPerfil: 'Ir para meu perfil',
    rvcProSub: 'Com o Pro você acessa o diretório completo de negócios da sua cidade, com telefone, endereço e horários.',
    rvcVerPlanes: 'Ver planos',
    rvcSinNegociosPrefix: 'Ainda não há negócios em',
    rvcSumate: 'Você tem um negócio nesta categoria? Participe da Rede Vecindog.',
    rvcRegistrarNegocio: 'Cadastrar meu negócio',
    comercioCalificarTitle: 'Avaliar negócio',
    comercioComentarioPh: 'Conte sua experiência (opcional)…',
    comercioNoEncontrado: 'Este negócio não foi encontrado.',
    comercioLlamar: '📞 Ligar',
    comercioWhatsapp: '💬 WhatsApp',
    comercioVisitarSitio: '🔗 Visitar site / perfil',
    comercioNovedades: '📰 Novidades',
    comercioResenas: '⭐ Avaliações',
    comercioGuardadoText: '✓ Avaliação salva',
    comercioSinResenas: 'Ainda não tem avaliações.',
    pubParaNegocios: '📣 Para negócios locais',
    pubTitle: 'Chegue a quem já cuida dos seus pets',
    pubSub: 'O Vecindog conecta donos de cães de toda a Argentina exatamente quando mais precisam. Mostre seu negócio no momento certo.',
    pubWhatsapp: '💬 WhatsApp',
    pubEmail: '✉️ Email',
    pubStatVecinosLabel: 'Vizinhos ativos',
    pubStatTodoValue: 'Toda a', pubStatArgentinaLabel: 'Argentina',
    pubStat100Value: '100%', pubStatOrganicoLabel: 'Orgânico · sem bots',
    pubStatDirectoValue: 'Direto', pubStatDuenosLabel: 'A donos de pets',
    pubFormatosTitle: 'Formatos disponíveis',
    pubFormato1Label: '🖼️ Banner entre seções', pubFormato1Badge: 'Mais visto', pubFormato1Desc: 'Aparece no início entre seções. Largura total, alta visibilidade.',
    pubFormato2Label: '🗂️ Card na grade de avisos', pubFormato2Badge: 'Mais cliques', pubFormato2Desc: 'Aparece integrado a cada 4 avisos. O usuário vê enquanto busca seu cão.',
    pubFormato3Label: '📋 Painel lateral de contato', pubFormato3Badge: 'Alta intenção', pubFormato3Desc: 'Aparece no detalhe de cada aviso, logo abaixo do contato.',
    pubComoFuncionaTitle: 'Como funciona?',
    pubPaso1Titulo: 'Escolha seu plano', pubPaso1Desc: 'Selecione o pacote que melhor se adapta: Básico, Padrão ou Premium.',
    pubPaso2Titulo: 'Preencha os dados', pubPaso2Desc: 'Nome, logo, tagline e link para seu site ou Instagram. Menos de 2 minutos.',
    pubPaso3Titulo: 'Seu anúncio no ar', pubPaso3Desc: 'Em 24 horas seu anúncio já está visível para centenas de donos de pets.',
    pubPlanesTitle: 'Planos simples, sem letras miúdas',
    pubPlanesSub: 'Mês a mês. Sem contrato. Cancele quando quiser.',
    pubPlanBasico: 'Básico', pubPlanEstandar: 'Padrão', pubPlanPremium: 'Premium',
    pubSlotCard: 'Card na grade de avisos', pubSlotPanel: 'Painel lateral de contato', pubSlotBanner: 'Banner entre seções (início)',
    pubMasElegido: '★ Mais escolhido',
    pubArsMes: 'ARS/mês',
    pubElegirPrefix: 'Escolher',
    pubNecesitasAlgo: 'Precisa de algo especial? Fale conosco e montamos um plano sob medida.',
    pubPorQueTitle: 'Publicidade com contexto, não com algoritmos',
    pubPorQueSub: 'Os usuários do Vecindog já estão pensando nos pets quando veem seu anúncio.',
    pubPorQue1Titulo: 'Público qualificado', pubPorQue1Desc: 'Somente donos de pets ativos na sua cidade.',
    pubPorQue2Titulo: 'Sem bots nem impressões vazias', pubPorQue2Desc: 'Usuários reais buscando avisos ativos.',
    pubPorQue3Titulo: 'Ativação em 24h', pubPorQue3Desc: 'Seu anúncio publicado no dia seguinte ao pagamento.',
    pubPorQue4Titulo: 'Relatório mensal', pubPorQue4Desc: 'Informamos quantas vezes seu anúncio foi visto.',
    pubFaqTitle: 'Perguntas frequentes',
    pubFaq1Q: 'Como meu negócio aparece?', pubFaq1A: 'Pedimos logo, nome, tagline e o link do seu site ou Instagram. Em 24h seu aviso já está visível.',
    pubFaq2Q: 'Posso mudar o anúncio durante o mês?', pubFaq2A: 'Sim. Você pode atualizar o conteúdo uma vez por mês sem custo adicional.',
    pubFaq3Q: 'Quais negócios podem anunciar?', pubFaq3A: 'Veterinárias, petshops, banho e tosa, adestradores, abrigos, lojas de acessórios e qualquer serviço relacionado a pets.',
    pubFaq4Q: 'Há contratos ou mínimos?', pubFaq4A: 'Não. O pagamento é mês a mês. Você pode descontinuar quando quiser.',
    pubFinalTitle: 'Pronto para alcançar mais clientes?',
    pubFinalSub: 'Fale conosco e ativamos sua campanha em menos de 24 horas.',
    pubPlanBasicoLabel: 'Plano Básico', pubPlanEstandarLabel: 'Plano Padrão', pubPlanPremiumLabel: 'Plano Premium',
    pubPrimerMesGratisPrefix: '🎁 Primeiro mês grátis · depois',
    pubCampanaActivadaTitle: 'Campanha ativada!',
    pubCampanaActivadaSub: 'Seu anúncio já está em processo de ativação. Enviamos um email com os detalhes.',
    pubCambiarImagen: 'Trocar imagem',
    pubSubirLogoFoto: 'Enviar logo ou foto',
    pubCambiarLogo: 'Trocar logo',
    pubSubirLogoCuadrado: 'Enviar logo quadrado *',
    pubTaglineLabel: 'Descrição curta (tagline)',
    pubTaglinePh: 'Vacinas · Bahía Blanca',
    pubLinkLabel: 'Link do negócio *',
    pubCtaLabel: 'Texto do botão',
    pubCtaPh: 'Ver local · Marcar horário',
    pubTelefonoLabel: 'Telefone / WhatsApp',
    pubTrialNote: 'Sem custo no primeiro mês · depois renova',
    pubActivarBtn: 'Ativar grátis — primeiro mês sem custo',
    pubErrNombreNegocio: 'Digite o nome do seu negócio.',
    pubErrLink: 'Digite o link do seu negócio.',
    pubErrLogo: 'Envie o logo do seu negócio para este plano.',
    pubErrLinkInvalido: 'O link deve ser uma URL válida. Exemplo: https://instagram.com/seunegocio',
    pubErrProcesar: 'Erro ao processar.',
    msgTitle: 'Mensagens privadas',
    msgSub: 'Contato direto com quem publicou o aviso',
    msgLoginText: 'Entre na sua conta para enviar mensagens',
    msgIniciarSesion: 'Entrar',
    msgVolverConversaciones: '← Ver todas as conversas',
    msgVacio: 'Ainda não há mensagens. Seja o primeiro a escrever.',
    msgInputPh: 'Escreva sua mensagem...',
    msgErrEnviar: 'Não foi possível enviar a mensagem. Tente novamente.',
    loviCtaLoVi: '👀 Eu vi',
    loviCtaYoTambien: '👀 Eu também vi',
    loviGraciasEncontrado: '✅ Obrigado, atualizamos a localização no mapa.',
    loviGraciasPerdido: '✅ Obrigado, avisamos o dono.',
    loviReportarOtro: 'Reportar outro avistamento',
    loviDondeLoViste: 'Onde você viu?',
    loviMismoLugarBtn: '📍 Foi no mesmo lugar do aviso',
    loviMismoLugarPrefix: '📍 Mesmo lugar:',
    loviGpsCapturado: '✅ Localização GPS capturada',
    loviGpsReintentar: '📡 Tentar localização novamente',
    loviGpsUsar: '📡 Usar minha localização atual',
    loviEscribirManual: 'Digitar o endereço manualmente',
    loviCallePh: 'Ex: Av. Colón e Brandsen',
    loviHoy: 'Hoje',
    loviOtroDia: 'Outro dia',
    loviHoraPh: 'Hora aproximada (ex: 18:30)',
    loviErrEnviar: 'Não foi possível enviar. Tente novamente.',
    loviEnviarBtn: 'Enviar',
    loviNotifAlguienVioPrefix: '👀 Alguém viu',
    loviNotifTuPerroFallback: 'seu cão',
    loviEnElMismoLugarPrefix: 'no mesmo lugar (',
    loviEnElMismoLugarSuffix: ')',
    loviEnPrefix: 'em',
    loviALasPrefix: 'às',
    loviFechaHoyLabel: 'hoje',
    topEscRanking: '⚠️ Ranking',
    topEscTitle: 'Os mais fujões 🏃',
    topEscSubPrefix: 'Os cães com mais avisos de perda em',
    topEscComunidadFallback: 'a comunidade',
    topEscLockedText: 'Recurso exclusivo do VecindogPro',
    topEscVerPlanes: '✨ Ver planos',
    topEscFugaSingular: 'fuga',
    topEscFugaPlural: 'fugas',
    vacVolvioACasa: '🏠 Voltou para casa',
    vacFueAdoptado: '❤️ Foi adotado',
    vacReencontrado: '🏠 Reencontrado',
    vacHistoriasReales: '❤️ Histórias reais',
    vacTitle: 'Voltaram para casa 🏠',
    vacSub: 'Graças à comunidade, esses cães reencontraram sua família.',
    vacVerTodos: 'Ver todos →',
    vacCounterPerroSingular: 'cão',
    vacCounterPerroPlural: 'cães',
    vacCounterReencontradoSingular: 'reencontrado',
    vacCounterReencontradoPlural: 'reencontrados',
    vacCounterSuffix: 'com a ajuda do Vecindog.',
    adPublicidad: 'Publicidade',
    adHouseTitle: '📣 Você tem um negócio de pets?',
    adHouseSub: 'Anuncie no Vecindog e alcance milhares de donos de pets.',
    adVerMas: 'Ver mais',
    aiHelpSaludo: 'Olá! Sou o assistente do Vecindog 🐾 Como posso ajudar? Posso explicar como publicar um aviso, usar o VecindogPro, ou qualquer outra dúvida sobre o app.',
    aiHelpNecesitasLogin: 'Você precisa entrar na conta para usar o assistente. Feche este chat, entre na conta e tente novamente.',
    aiHelpNoPudeGenerar: 'Não consegui gerar uma resposta, tente novamente.',
    aiHelpErrConexion: 'Houve um problema ao conectar com o assistente. Tente novamente em instantes.',
    aiHelpTitle: 'Assistente Vecindog',
    aiHelpSub: 'Com tecnologia de IA',
    aiHelpInputPh: 'Escreva sua pergunta…',
    layoutVolver: '‹ Voltar',
    headerPerfilPerro: 'Perfil do cão',
    headerNuevoPerro: 'Novo cão',
    pbTitle: 'Novo aviso',
    pbTipoAviso: 'Tipo de aviso',
    pbBuscarFotoTitulo: 'Já enviou uma foto em outro lugar?',
    pbBuscarFotoSub: 'Busque com IA entre os avisos ativos antes de publicar um novo',
    pbEsUnoDeTusPerros: 'É um dos seus cães?',
    pbOcultarMisPerros: '▲  Ocultar meus cães',
    pbSeleccionarMisPerros: '🐕  Selecionar entre meus cães',
    pbUsarFlecha: 'Usar →',
    pbFotosLabel: 'Fotos',
    pbFotoBtnAgregar: 'Adicionar fotos',
    pbFotosElegidasSuffix: 'foto(s) escolhida(s)',
    pbNombreAnimalLabel: 'Nome do animal',
    pbColorLabel: 'Cor principal',
    pbSexoLabel: 'Sexo',
    pbOpcional: '(Opcional)',
    pbSexoMacho: '♂ Macho',
    pbSexoHembra: '♀ Fêmea',
    pbNoSe: 'Não sei',
    pbTeniaCollar: 'Tinha coleira?',
    pbTeniaChapitaPlaquita: 'Tinha plaquinha identificadora?',
    pbUbicacionLabel: 'Localização no mapa',
    pbUbicacionConfirmada: '✓ Localização GPS capturada',
    pbUbicacionCambiar: 'Alterar',
    pbPermisoDenegadoMapa: '⚠️  Permissão negada — o aviso não aparecerá no mapa',
    pbUsarUbicacionActual: '📍  Usar minha localização atual',
    pbDireccionZonaLabel: 'Endereço ou zona *',
    pbDireccionZonaPh: 'Ex: Bairro Palihue, rua Sarmiento',
    pbDescripcionLabel: 'Descrição adicional *',
    pbDescripcionPh: 'Marcas especiais, manchas, comportamento, coleira vermelha com plaquinha azul…',
    pbContactoPh: '+54 9 291 123 4567',
    pbMostrarNumeroLabel: 'Mostrar número publicamente',
    pbNumeroPublicoSub: 'Qualquer usuário registrado verá seu número.',
    pbNumeroPrivadoSub: 'Os usuários terão que solicitar o contato.',
    pbSubiendoFotosPrefix: 'Enviando fotos',
    pbGuardandoAviso: 'Salvando aviso…',
    pbPublicarBtn: 'Publicar aviso',
    pbErrContactoTitle: 'Falta o contato',
    pbErrContactoSub: 'Digite seu número de WhatsApp',
    pbErrZonaTitle: 'Falta a zona',
    pbErrZonaSub: 'Digite o bairro ou zona',
    pbErrDescTitle: 'Falta a descrição',
    pbErrDescSub: 'Conte marcas especiais, comportamento ou outro dado que ajude a identificá-lo.',
    pbErrFotosTitle: 'Erro ao enviar fotos',
    pbErrFotosSub: 'Não foi possível enviar todas as imagens. As parcialmente enviadas foram removidas. Tente novamente.',
    pbErrLimiteTitle: 'Limite atingido',
    pbErrLimiteSub: 'Você pode publicar até 5 avisos por hora. Aguarde um momento e tente novamente.',
    pbErrGuardarTitle: 'Erro ao salvar',
    pbErrGuardarSub: 'As fotos foram removidas. Tente publicar novamente.',
    pbPublicadoTitle: 'Aviso publicado!',
    pbPublicadoSub: 'Seu aviso já está visível para os vizinhos.',
    pbVerAvisos: 'Ver avisos',
    pbErrGenericoSub: 'Não foi possível publicar. Verifique sua conexão.',
  },
};
