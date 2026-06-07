'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type Lang = 'es' | 'en' | 'pt';

const LANG_KEY = 'vecindog_lang';

export type Translations = {
  // ── AuthModal ────────────────────────────────────────
  welcome: string;
  welcomeSub: string;
  confirmEmail: string;
  confirmEmailSub: string;
  tabRegister: string;
  tabLogin: string;
  emailPlaceholder: string;
  passwordPlaceholder: string;
  showPassword: string;
  hidePassword: string;
  termsPrefix: string;
  termsLink: string;
  termsMiddle: string;
  privacyLink: string;
  termsSuffix: string;
  btnRegister: string;
  btnLogin: string;
  or: string;
  continueGoogle: string;
  enterGuest: string;
  guestNote: string;
  codeLabel: string;
  codeError: string;
  btnConfirm: string;
  resendCode: string;
  changeEmail: string;
  infoResent: string;
  infoResentOk: string;
  errInvalidCredentials: string;
  errEmailNotConfirmed: string;
  errAlreadyRegistered: string;
  errWeakPassword: string;
  errInvalidEmail: string;
  errRateLimit: string;
  errTokenExpired: string;
  errTokenNotFound: string;
  errSignupDisabled: string;
  errNetwork: string;
  forgotLink: string;
  forgotTitle: string;
  forgotSub: string;
  btnSendReset: string;
  forgotSuccess: string;
  backToLogin: string;
  newPasswordTitle: string;
  newPasswordSub: string;
  newPasswordPlaceholder: string;
  confirmPasswordPlaceholder: string;
  btnUpdatePassword: string;
  errPasswordMismatch: string;
  updatePasswordSuccess: string;
  updatePasswordSuccessSub: string;
  invalidResetLink: string;
  // ── ProfileModal ─────────────────────────────────────
  profileTitle: string;
  profileSub: string;
  firstName: string;
  lastName: string;
  phone: string;
  selectCity: string;
  province: string;
  country: string;
  btnSave: string;
  // ── Navigation ───────────────────────────────────────
  navInicio: string;
  navMapa: string;
  navAvisos: string;
  navMisPerros: string;
  navPublicar: string;
  navEnterPerfil: string;
  navMiPlanPro: string;
  navPlanes: string;
  navMiComercio: string;
  navCambiarUbicacion: string;
  navPanelAdmin: string;
  navCerrarSesion: string;
  navDescargas: string;
  navInvitado: string;
  navModoInvitado: string;
  navSalirCrearCuenta: string;
  navSalir: string;
  navCambiarCiudad: string;
  navRedVecindog: string;
  navPublicitate: string;
  // ── Hero ─────────────────────────────────────────────
  heroChip: string;
  heroTitle: string;
  heroTitleAccent: string;
  heroSub: string;
  heroSubBold: string;
  // ── ActionCards ──────────────────────────────────────
  accionBuscando: string;
  accionBuscandoText: string;
  accionViPerdido: string;
  accionViPerdidoText: string;
  accionDoyAdopcion: string;
  accionDoyAdopcionText: string;
  accionTransito: string;
  accionTransitoText: string;
  accionCuidado: string;
  accionCuidadoText: string;
  accionTransporte: string;
  accionTransporteText: string;
  accionEmpezar: string;
  accionNuevo: string;
  chipPerdidos: string;
  chipTarda1Min: string;
  chipComunidadCuidada: string;
  chipComunidad: string;
  // ── HowItWorks ───────────────────────────────────────
  how4Steps: string;
  howTitle: string;
  howSub: string;
  howStep1Title: string;
  howStep1Text: string;
  howStep2Title: string;
  howStep2Text: string;
  howStep3Title: string;
  howStep3Text: string;
  howStep4Title: string;
  howStep4Text: string;
  calcTitle: string;
  calcSub: string;
  calcCta: string;
  // ── TrustSection ─────────────────────────────────────
  trustTitle: string;
  trustSub: string;
  trust1Title: string;
  trust1Text: string;
  trust2Title: string;
  trust2Text: string;
  trust3Title: string;
  trust3Text: string;
  trust4Title: string;
  trust4Text: string;
  trust5Title: string;
  trust5Text: string;
  trust6Title: string;
  trust6Text: string;
  // ── Footer ───────────────────────────────────────────
  footerSub: string;
  footerAvailableIn: string;
  footerAppSection: string;
  footerComunidadSection: string;
  footerNegociosSection: string;
  footerTerms: string;
  footerPrivacy: string;
  footerMadeWith: string;
  footerLinkInicio: string;
  footerLinkAvisos: string;
  footerLinkPublicar: string;
  footerLinkBuscarFoto: string;
  footerLinkPerdidos: string;
  footerLinkVistos: string;
  footerLinkAdopcion: string;
  footerLinkTransito: string;
  // ── Categories ───────────────────────────────────────
  catPerdido: string;
  catEncontrado: string;
  catAdopcion: string;
  catTransito: string;
  catBuscoCuidador: string;
  catCuidadorDisponible: string;
  // ── AnimalCard ───────────────────────────────────────
  cardNoName: string;
  cardTapInfo: string;
  cardSeePost: string;
  cardNoPhoto: string;
  cardStreetSighting: string;
  cardRewardPrefix: string;
  cardLastDay: string;
  cardOneDayLeft: string;
  cardDaysLeft: string;
  cardExpired: string;
  // ── Filters ──────────────────────────────────────────
  filterTitle: string;
  filterClear: string;
  filterMyPosts: string;
  filterType: string;
  filterAll: string;
  filterLostAndFound: string;
  filterLost: string;
  filterFound: string;
  filterAdoption: string;
  filterTransit: string;
  filterCaretaker: string;
  filterCaretakerAvail: string;
  filterZone: string;
  filterZonePlaceholder: string;
  // ── Publicaciones page ───────────────────────────────
  pubTitleAll: string;
  pubSubAll: string;
  pubTitleBuscar: string;
  pubSubBuscar: string;
  pubTitlePerdido: string;
  pubSubPerdido: string;
  pubTitleEncontrado: string;
  pubSubEncontrado: string;
  pubTitleAdopcion: string;
  pubSubAdopcion: string;
  pubTitleTransito: string;
  pubSubTransito: string;
  pubTitleCuidador: string;
  pubSubCuidador: string;
  pubTitleCuidadorDisp: string;
  pubSubCuidadorDisp: string;
  pubMyPosts: string;
  pubLoading: string;
  pubError: string;
  pubEmpty: string;
  pubEmptySub: string;
  pubPostWord: string;
  pubPostWordPlural: string;
  pubSearchPlaceholder: string;
  pubShowMore: string;
  pubBuscarFotoTitle: string;
  pubBuscarFotoCTA: string;
  pubBuscarCaractTitle: string;
  pubBuscarCaractCTA: string;
  // ── Planes page ──────────────────────────────────────
  plansTitle: string;
  plansSub: string;
  plansBack: string;
  plansFreeLabel: string;
  plansFreePrice: string;
  plansFreeSub: string;
  plansCurrentPlan: string;
  plansGoHome: string;
  plansProLabel: string;
  plansProPrice: string;
  plansProSub: string;
  plansRecommended: string;
  plansPerMonth: string;
  plansActive: string;
  plansActiveUntil: string;
  plansLoginFirst: string;
  plansSubscribe: string;
  plansMpNote: string;
  // ── Common ───────────────────────────────────────────
  commonBack: string;
  commonSave: string;
  commonCancel: string;
  commonLoading: string;
  commonError: string;
  commonClose: string;
  commonRequired: string;
  commonOptional: string;
  commonSeeAll: string;
  commonSeeMore: string;
  commonRetry: string;
  // ── Mapa page ────────────────────────────────────────
  mapLoading: string;
  mapLegendSeen: string;
  mapLegendStreet: string;
  mapLegendVecindog: string;
  mapMyLocation: string;
  // ── Buscar por foto page ──────────────────────────────
  bpfBack: string;
  bpfChip: string;
  bpfTitle: string;
  bpfSub: string;
  bpfPhotoSection: string;
  bpfRequired: string;
  bpfUploadTap: string;
  bpfUploadSub: string;
  bpfGallery: string;
  bpfTakePhoto: string;
  bpfAnalyzingIA: string;
  bpfIADetected: string;
  bpfIAAutofilled: string;
  bpfColorTitle: string;
  bpfRazaTitle: string;
  bpfRazaPlaceholder: string;
  bpfSizeTitle: string;
  bpfSizeSmall: string;
  bpfSizeMedium: string;
  bpfSizeLarge: string;
  bpfAccessories: string;
  bpfCollar: string;
  bpfTag: string;
  bpfYes: string;
  bpfNo: string;
  bpfSearchBtn: string;
  bpfSearching: string;
  bpfAnalyzingPhoto: string;
  bpfBestMatch: string;
  bpfNoMatches: string;
  bpfNoMatchesSub: string;
  bpfOtherPossibilities: string;
  bpfNoPostsYet: string;
  bpfSeeAllPosts: string;
  bpfSeePost: string;
  bpfWithCollar: string;
  bpfNoCollar: string;
  bpfWithTag: string;
  bpfNoTag: string;
  bpfPaywallTitle: string;
  bpfPaywallSub: string;
  bpfPaywallBtn: string;
  bpfPaywallLink: string;
  bpfSimilar: string;
  // ── Mis Perros page ──────────────────────────────────
  mpChip: string;
  mpTitle: string;
  mpSub: string;
  mpFriends: string;
  mpAddDog: string;
  mpAddAnother: string;
  mpMoreWithPro: string;
  mpSeePlans: string;
  mpSeeProfile: string;
  mpDeleteTitle: string;
  mpDeleteSub: string;
  mpDeleteBtn: string;
  mpCancel: string;
  mpDeleteError: string;
  mpLoadError: string;
  mpNotAuth: string;
  mpGoHome: string;
  mpResolvedTitle: string;
  mpResolvedSub: string;
  mpEmptyTitle: string;
  mpEmptySub: string;
  mpRegisterDog: string;
  mpVaccine: string;
  mpVaccines: string;
  mpPuppy: string;
  mpMonth: string;
  mpMonths: string;
  mpYear: string;
  mpYears: string;
  // ── Reencontrados page ────────────────────────────────
  reBack: string;
  reChip: string;
  reTitle: string;
  reSub: string;
  reDogSingular: string;
  reDogPlural: string;
  reEmpty: string;
  reEmptySub: string;
  reActiveListings: string;
  reCtaTitle: string;
  reCtaSub: string;
  reLostBtn: string;
  reFoundBtn: string;
  reLabelHome: string;
  reLabelAdopted: string;
  reLabelDefault: string;
  // ── Cuidado page ─────────────────────────────────────
  cuidadoBack: string;
  cuidadoChip: string;
  cuidadoTitle: string;
  cuidadoSub: string;
  cuidadoWarning: string;
  cuidadoSeekTitle: string;
  cuidadoSeekSub: string;
  cuidadoSeekBtn: string;
  cuidadoSeekHeader: string;
  cuidadoSeekEmpty: string;
  cuidadoCareTitle: string;
  cuidadoCareSub: string;
  cuidadoCareBtn: string;
  cuidadoCareHeader: string;
  cuidadoCareEmpty: string;
  cuidadoDeactivate: string;
  cuidadoSeeProfile: string;
  cuidadoCuidadorLabel: string;
  cuidadoBuscarLabel: string;
  // ── Transporte page ───────────────────────────────────
  transpBack: string;
  transpChip: string;
  transpTitle: string;
  transpSub: string;
  transpWarning: string;
  transpCTATitle: string;
  transpCTASub: string;
  transpCTABtn: string;
  transpHeader: string;
  transpEmpty: string;
  transpDeactivate: string;
  transpSeeProfile: string;
  transpLabel: string;
  // ── Calculadora page ──────────────────────────────────
  calcBack: string;
  calcChip: string;
  calcYearsLabel: string;
  calcMonthsLabel: string;
  calcSizeLabel: string;
  calcSmall: string;
  calcSmallDesc: string;
  calcMedium: string;
  calcMediumDesc: string;
  calcLarge: string;
  calcLargeDesc: string;
  calcEquivalent: string;
  calcHumanYears: string;
  calcStageLabel: string;
  calcPuppy: string;
  calcPuppyText: string;
  calcJuvenil: string;
  calcJuvenilText: string;
  calcAdult: string;
  calcAdultText: string;
  calcSenior: string;
  calcSeniorText: string;
  calcElder: string;
  calcElderText: string;
  calcFormula: string;
  calcEmpty: string;
  calcNote: string;
};

const translations: Record<Lang, Translations> = {
  // ═══════════════════════════════════════════════════════
  //  ESPAÑOL
  // ═══════════════════════════════════════════════════════
  es: {
    // AuthModal
    welcome: 'Bienvenido a Vecindog',
    welcomeSub: 'Registrate para ver los datos de contacto de los avisos.',
    confirmEmail: 'Confirmá tu email',
    confirmEmailSub: 'Te enviamos un código de verificación a',
    tabRegister: 'Crear cuenta',
    tabLogin: 'Iniciar sesión',
    emailPlaceholder: 'tu@email.com',
    passwordPlaceholder: 'Contraseña (mín. 6 caracteres)',
    showPassword: 'Mostrar contraseña',
    hidePassword: 'Ocultar contraseña',
    termsPrefix: 'Acepto los',
    termsLink: 'Términos y Condiciones',
    termsMiddle: 'y la',
    privacyLink: 'Política de Privacidad',
    termsSuffix: 'de Vecindog.',
    btnRegister: 'Crear cuenta gratis',
    btnLogin: 'Iniciar sesión',
    or: 'o',
    continueGoogle: 'Continuar con Google',
    enterGuest: 'Entrar como invitado',
    guestNote: 'Como invitado no podrás ver el WhatsApp de contacto.',
    codeLabel: 'Código de verificación',
    codeError: 'Ingresá el código de verificación.',
    btnConfirm: 'Confirmar y entrar',
    resendCode: 'Reenviar código',
    changeEmail: 'Cambiar email',
    infoResent: 'Te reenviamos el código de confirmación al email.',
    infoResentOk: 'Código reenviado. Revisá tu bandeja de entrada (y spam).',
    errInvalidCredentials: 'Email o contraseña incorrectos.',
    errEmailNotConfirmed: 'Confirmá tu email antes de iniciar sesión.',
    errAlreadyRegistered: 'Ya existe una cuenta con ese email. Iniciá sesión.',
    errWeakPassword: 'La contraseña debe tener al menos 6 caracteres.',
    errInvalidEmail: 'Email inválido. Revisá que esté bien escrito.',
    errRateLimit: 'Demasiados intentos. Esperá unos minutos y volvé a intentar.',
    errTokenExpired: 'El código expiró. Pedí uno nuevo.',
    errTokenNotFound: 'Código incorrecto. Revisá el email o pedí uno nuevo.',
    errSignupDisabled: 'El registro está deshabilitado temporalmente.',
    errNetwork: 'Error de conexión. Verificá tu internet.',
    forgotLink: '¿Olvidaste tu contraseña?',
    forgotTitle: 'Recuperar contraseña',
    forgotSub: 'Ingresá tu email y te enviamos un link para crear una nueva contraseña.',
    btnSendReset: 'Enviar link de recuperación',
    forgotSuccess: 'Revisá tu email. Te enviamos el link para recuperar tu contraseña (también revisá spam).',
    backToLogin: 'Volver al inicio de sesión',
    newPasswordTitle: 'Nueva contraseña',
    newPasswordSub: 'Ingresá tu nueva contraseña para continuar.',
    newPasswordPlaceholder: 'Nueva contraseña (mín. 6 caracteres)',
    confirmPasswordPlaceholder: 'Confirmar contraseña',
    btnUpdatePassword: 'Guardar contraseña',
    errPasswordMismatch: 'Las contraseñas no coinciden.',
    updatePasswordSuccess: '¡Contraseña actualizada!',
    updatePasswordSuccessSub: 'Ya podés iniciar sesión con tu nueva contraseña.',
    invalidResetLink: 'El link de recuperación es inválido o expiró. Pedí uno nuevo.',
    // ProfileModal
    profileTitle: 'Completá tu perfil',
    profileSub: 'Necesitamos algunos datos para continuar',
    firstName: 'Nombre',
    lastName: 'Apellido',
    phone: 'Teléfono (ej: 1123456789)',
    selectCity: 'Seleccioná tu ciudad',
    province: 'Provincia',
    country: 'País',
    btnSave: 'Guardar y continuar',
    // Navigation
    navInicio: 'Inicio',
    navMapa: 'Mapa',
    navAvisos: 'Avisos',
    navMisPerros: 'Mis perros',
    navPublicar: 'Publicar',
    navEnterPerfil: 'Entrar al perfil',
    navMiPlanPro: 'Mi plan Pro',
    navPlanes: 'Planes',
    navMiComercio: 'Mi comercio',
    navCambiarUbicacion: 'Cambiar ubicación',
    navPanelAdmin: 'Panel admin',
    navCerrarSesion: 'Cerrar sesión',
    navDescargas: 'Descargas',
    navInvitado: 'Invitado',
    navModoInvitado: 'Modo invitado',
    navSalirCrearCuenta: 'Salir y crear cuenta',
    navSalir: 'Salir',
    navCambiarCiudad: 'Cambiar ciudad',
    navRedVecindog: 'Red Vecindog',
    navPublicitate: 'Publicitate',
    // Hero
    heroChip: 'Red vecinal',
    heroTitle: 'Buscá. Encontrá.',
    heroTitleAccent: 'Adoptá.',
    heroSub: 'La red vecinal para encontrar y adoptar',
    heroSubBold: 'perros cerca de vos',
    // ActionCards
    accionBuscando: 'Estoy buscando',
    accionBuscandoText: 'Publicá un aviso para que la comunidad te ayude a encontrarlo.',
    accionViPerdido: 'Vi uno perdido',
    accionViPerdidoText: 'Avisá a la comunidad para ayudarlo a volver a casa.',
    accionDoyAdopcion: 'Doy en adopción',
    accionDoyAdopcionText: 'Publicá un perro que necesita un nuevo hogar.',
    accionTransito: 'En tránsito',
    accionTransitoText: 'Lo tenés temporalmente o lo viste en la calle. La comunidad puede ayudar.',
    accionCuidado: 'Cuidado',
    accionCuidadoText: 'Buscá un cuidador o anotate para cuidar perros de otros vecinos.',
    accionTransporte: 'Transporte',
    accionTransporteText: 'Encontrá quien lleve a tu perro o anotate para transportar perros de vecinos.',
    accionEmpezar: 'Empezar',
    accionNuevo: 'Nuevo',
    chipPerdidos: 'Perdidos',
    chipTarda1Min: 'Tarda 1 minuto',
    chipComunidadCuidada: 'Comunidad cuidada',
    chipComunidad: 'Comunidad',
    // HowItWorks
    how4Steps: 'En 4 pasos',
    howTitle: '¿Cómo funciona Vecindog?',
    howSub: 'Tarda menos de un minuto.',
    howStep1Title: 'Publicás',
    howStep1Text: 'Subís fotos y los datos clave en menos de un minuto.',
    howStep2Title: 'Vecinos lo ven',
    howStep2Text: 'Tu aviso aparece en el tablón de tu ciudad.',
    howStep3Title: 'Te contactan',
    howStep3Text: 'Cuando alguien tiene una pista, te escribe por WhatsApp.',
    howStep4Title: 'Reencuentro',
    howStep4Text: 'O la familia ideal aparece para adoptar.',
    calcTitle: 'Calculadora de edad canina',
    calcSub: '¿Cuántos años tiene tu perro en años humanos?',
    calcCta: 'Calcular ahora',
    // TrustSection
    trustTitle: 'Una comunidad cuidada',
    trustSub: 'Reglas claras para que ayudar sea seguro para todos.',
    trust1Title: 'Publicaciones por ciudad',
    trust1Text: 'Los avisos se filtran por tu barrio y ciudad.',
    trust2Title: 'Contacto rápido',
    trust2Text: 'Directo por WhatsApp, sin intermediarios.',
    trust3Title: 'No venta de animales',
    trust3Text: 'Vecindog es solo para reunir y adoptar.',
    trust4Title: 'Adopción responsable',
    trust4Text: 'Recomendaciones claras para nuevas familias.',
    trust5Title: 'Comunidad vecinal',
    trust5Text: 'Hecho entre vecinos que se ayudan.',
    trust6Title: 'Avisos claros',
    trust6Text: 'Foto, barrio y datos verificables siempre.',
    // Footer
    footerSub: 'La red vecinal para encontrar y adoptar perros cerca de vos. Hecho entre vecinos, gratis y sin venta de animales.',
    footerAvailableIn: 'Disponible en todo Argentina',
    footerAppSection: 'La app',
    footerComunidadSection: 'Comunidad',
    footerNegociosSection: 'Negocios',
    footerTerms: 'Términos y Condiciones',
    footerPrivacy: 'Política de Privacidad',
    footerMadeWith: 'Hecho con cariño en Argentina 🐾',
    footerLinkInicio: 'Inicio',
    footerLinkAvisos: 'Avisos',
    footerLinkPublicar: 'Publicar',
    footerLinkBuscarFoto: 'Buscar por foto',
    footerLinkPerdidos: 'Perdidos',
    footerLinkVistos: 'Vistos',
    footerLinkAdopcion: 'En adopción',
    footerLinkTransito: 'En tránsito',
    // Categories
    catPerdido: 'Perdido',
    catEncontrado: 'Visto',
    catAdopcion: 'En adopción',
    catTransito: 'En tránsito',
    catBuscoCuidador: 'Busca cuidador',
    catCuidadorDisponible: 'Cuidador disponible',
    // AnimalCard
    cardNoName: 'Perro sin nombre',
    cardTapInfo: 'Tocá para más info',
    cardSeePost: 'Ver aviso',
    cardNoPhoto: 'Aviso sin foto',
    cardStreetSighting: 'Visto en la calle — necesita ayuda',
    cardRewardPrefix: 'Recompensa $',
    cardLastDay: 'Último día',
    cardOneDayLeft: 'Queda 1 día',
    cardDaysLeft: 'Quedan {n} días',
    cardExpired: 'Plazo vencido',
    // Filters
    filterTitle: 'Filtros',
    filterClear: 'Limpiar',
    filterMyPosts: 'Mis publicaciones',
    filterType: 'Tipo de aviso',
    filterAll: 'Todos',
    filterLostAndFound: 'Perdidos y vistos',
    filterLost: 'Perdidos',
    filterFound: 'Vistos',
    filterAdoption: 'En adopción',
    filterTransit: 'En tránsito',
    filterCaretaker: 'Busca cuidador',
    filterCaretakerAvail: 'Cuidadores disponibles',
    filterZone: 'Zona / barrio',
    filterZonePlaceholder: 'Centro, Villa Mitre, Palihue…',
    // Publicaciones
    pubTitleAll: 'Todos los avisos',
    pubSubAll: 'Los perros publicados por los vecinos de tu ciudad.',
    pubTitleBuscar: 'Perdidos y vistos',
    pubSubBuscar: 'Perros perdidos y vistos cerca tuyo.',
    pubTitlePerdido: 'Perros perdidos',
    pubSubPerdido: 'Familias buscando a su perro. ¿Lo viste?',
    pubTitleEncontrado: 'Perros vistos',
    pubSubEncontrado: 'Perros vistos en la calle que buscan a su familia.',
    pubTitleAdopcion: 'Perros en adopción',
    pubSubAdopcion: 'Perros que buscan una familia responsable.',
    pubTitleTransito: 'Perros en tránsito',
    pubSubTransito: 'Perros que alguien tiene temporalmente o vio en la calle.',
    pubTitleCuidador: 'Buscan cuidador',
    pubSubCuidador: 'Dueños que buscan alguien de confianza para cuidar a su perro.',
    pubTitleCuidadorDisp: 'Cuidadores disponibles',
    pubSubCuidadorDisp: 'Vecinos disponibles para cuidar perros de la comunidad.',
    pubMyPosts: 'Mis publicaciones',
    pubLoading: 'Cargando avisos…',
    pubError: 'Error al cargar los avisos.',
    pubEmpty: 'No hay avisos todavía.',
    pubEmptySub: 'Sé el primero en publicar.',
    pubPostWord: 'aviso',
    pubPostWordPlural: 'avisos',
    pubSearchPlaceholder: 'Buscar por nombre, descripción o zona…',
    pubShowMore: 'Ver más',
    pubBuscarFotoTitle: 'Buscar por foto con IA',
    pubBuscarFotoCTA: 'Subí una foto · La IA hace el matching',
    pubBuscarCaractTitle: 'Buscar por características',
    pubBuscarCaractCTA: 'Color, tamaño, collar, chapita…',
    // Planes
    plansTitle: 'Elegí tu plan',
    plansSub: 'Vecindog es gratis para empezar. Pasate a Pro para la experiencia completa.',
    plansBack: 'Volver',
    plansFreeLabel: 'Gratis',
    plansFreePrice: '$0',
    plansFreeSub: 'Para empezar a buscar y registrar a tu perro.',
    plansCurrentPlan: 'Plan actual',
    plansGoHome: 'Volver al inicio',
    plansProLabel: 'VecindogPro',
    plansProPrice: '$1.000',
    plansProSub: 'La experiencia completa para encontrar y cuidar a tu perro.',
    plansRecommended: 'RECOMENDADO',
    plansPerMonth: '/ mes',
    plansActive: 'Plan activo',
    plansActiveUntil: 'Plan activo hasta el',
    plansLoginFirst: 'Iniciá sesión para suscribirte',
    plansSubscribe: 'Suscribirme',
    plansMpNote: 'Podés pagar con Mercado Pago (saldo, efectivo), tarjeta de débito o crédito.',
    // Common
    commonBack: 'Volver',
    commonSave: 'Guardar',
    commonCancel: 'Cancelar',
    commonLoading: 'Cargando…',
    commonError: 'Ocurrió un error. Intentá de nuevo.',
    commonClose: 'Cerrar',
    commonRequired: 'Requerido',
    commonOptional: 'Opcional',
    commonSeeAll: 'Ver todos',
    commonSeeMore: 'Ver más',
    commonRetry: 'Intentar de nuevo',
    // Mapa
    mapLoading: 'Cargando avisos…',
    mapLegendSeen: 'Visto',
    mapLegendStreet: 'En la calle',
    mapLegendVecindog: 'Red Vecindog',
    mapMyLocation: 'Mi ubicación',
    // Buscar por foto
    bpfBack: 'Volver a los avisos',
    bpfChip: 'Búsqueda con IA',
    bpfTitle: 'Buscar por foto',
    bpfSub: 'Subí una foto — la IA detecta la raza, color y tamaño automáticamente.',
    bpfPhotoSection: 'Foto del perro',
    bpfRequired: 'Requerida',
    bpfUploadTap: 'Tocá para subir una foto',
    bpfUploadSub: 'La IA detecta raza, color y tamaño automáticamente',
    bpfGallery: 'Galería',
    bpfTakePhoto: 'Sacar foto',
    bpfAnalyzingIA: 'Analizando con IA…',
    bpfIADetected: 'IA detectó',
    bpfIAAutofilled: 'Los filtros se completaron automáticamente. Podés ajustarlos abajo.',
    bpfColorTitle: 'Color principal',
    bpfRazaTitle: 'Raza',
    bpfRazaPlaceholder: 'Ej: Labrador, Golden, Mestizo…',
    bpfSizeTitle: 'Tamaño',
    bpfSizeSmall: 'Chico',
    bpfSizeMedium: 'Mediano',
    bpfSizeLarge: 'Grande',
    bpfAccessories: 'Accesorios',
    bpfCollar: 'Collar',
    bpfTag: 'Chapita',
    bpfYes: 'Sí',
    bpfNo: 'No',
    bpfSearchBtn: 'Buscar coincidencias',
    bpfSearching: 'Buscando…',
    bpfAnalyzingPhoto: 'Analizando foto…',
    bpfBestMatch: 'Mejor coincidencia',
    bpfNoMatches: 'No encontramos coincidencias relevantes.',
    bpfNoMatchesSub: 'Intentá ajustar los filtros o subir una foto más clara del perro.',
    bpfOtherPossibilities: 'Otras posibilidades',
    bpfNoPostsYet: 'No hay avisos publicados todavía.',
    bpfSeeAllPosts: 'Ver todos los avisos',
    bpfSeePost: 'Ver aviso',
    bpfWithCollar: 'Con collar',
    bpfNoCollar: 'Sin collar',
    bpfWithTag: 'Con chapita',
    bpfNoTag: 'Sin chapita',
    bpfPaywallTitle: 'Búsqueda por foto',
    bpfPaywallSub: 'Subí una foto y encontramos al perro usando IA. Función exclusiva de VecindogPro.',
    bpfPaywallBtn: 'Ver plan Pro',
    bpfPaywallLink: 'Ver avisos',
    bpfSimilar: '% similar',
    // Mis Perros
    mpChip: 'Mis perros',
    mpTitle: 'Tu familia canina',
    mpSub: 'Guardá los datos de tus perros. Si alguno se pierde, ya tenés todo listo.',
    mpFriends: 'Amigos',
    mpAddDog: 'Agregar perro',
    mpAddAnother: 'Agregar otro perro',
    mpMoreWithPro: 'Más perros con Pro',
    mpSeePlans: 'Ver planes',
    mpSeeProfile: 'Ver perfil completo',
    mpDeleteTitle: '¿Eliminás a ',
    mpDeleteSub: 'Esta acción no se puede deshacer.',
    mpDeleteBtn: 'Eliminar',
    mpCancel: 'Cancelar',
    mpDeleteError: 'No se pudo eliminar. Intentá de nuevo.',
    mpLoadError: 'No pudimos cargar tus perros.',
    mpNotAuth: 'Iniciá sesión para ver tus perros.',
    mpGoHome: 'Ir al inicio',
    mpResolvedTitle: '¡El aviso se marcó como resuelto! 🎉',
    mpResolvedSub: 'El aviso ya no aparece en la lista. Los perfiles de acá no se borran — si alguno se vuelve a perder, entrá a su perfil y reportalo de nuevo con un click.',
    mpEmptyTitle: 'Todavía no registraste ningún perro',
    mpEmptySub: 'Guardá sus datos, fotos y vacunas. Si algún día se pierde, ya vas a tener todo listo para buscarlo.',
    mpRegisterDog: 'Registrar mi perro',
    mpVaccine: 'vacuna',
    mpVaccines: 'vacunas',
    mpPuppy: 'Cachorro',
    mpMonth: 'mes',
    mpMonths: 'meses',
    mpYear: 'año',
    mpYears: 'años',
    // Reencontrados
    reBack: 'Volver al inicio',
    reChip: 'Historias reales',
    reTitle: 'Volvieron a casa 🏠',
    reSub: 'Cada historia acá es una familia que volvió a estar completa. Gracias a vecinos como vos que se tomaron un minuto para ayudar.',
    reDogSingular: 'perro reencontrado',
    reDogPlural: 'perros reencontrados',
    reEmpty: 'Todavía no hay historias',
    reEmptySub: 'Cuando un aviso se resuelva, va a aparecer acá. ¡Ayudá a que pase!',
    reActiveListings: 'Ver avisos activos',
    reCtaTitle: '¿Perdiste o encontraste un perro?',
    reCtaSub: 'La comunidad de Vecindog puede ayudarte.',
    reLostBtn: 'Perdí a mi perro',
    reFoundBtn: 'Encontré un perro',
    reLabelHome: '🏠 Volvió a casa',
    reLabelAdopted: '❤️ Fue adoptado',
    reLabelDefault: '🏠 Reencontrado',
    // Cuidado
    cuidadoBack: 'Volver',
    cuidadoChip: 'Cuidado de perros',
    cuidadoTitle: 'Cuidado de perros',
    cuidadoSub: 'Encontrá un vecino de confianza para cuidar a tu perro, o anotate para cuidar perros de la comunidad.',
    cuidadoWarning: '🚫 Solo intercambios entre vecinos — está prohibido cobrar o ofrecer servicios comerciales en esta sección.',
    cuidadoSeekTitle: 'Busco cuidador',
    cuidadoSeekSub: 'Publicá un aviso con los datos de tu perro y encontrá a alguien que lo cuide.',
    cuidadoSeekBtn: 'Publicar pedido',
    cuidadoSeekHeader: 'Buscan cuidador',
    cuidadoSeekEmpty: 'Todavía no hay avisos. ¡Publicá el primero!',
    cuidadoCareTitle: 'Quiero cuidar',
    cuidadoCareSub: 'Anotate como cuidador disponible para ayudar a vecinos que lo necesiten.',
    cuidadoCareBtn: 'Registrarme',
    cuidadoCareHeader: 'Cuidadores disponibles',
    cuidadoCareEmpty: 'Todavía no hay cuidadores. ¡Sé el primero!',
    cuidadoDeactivate: 'Dar de baja',
    cuidadoSeeProfile: 'Ver perfil y calificaciones',
    cuidadoCuidadorLabel: 'Cuidador disponible',
    cuidadoBuscarLabel: 'Busca cuidador',
    // Transporte
    transpBack: 'Volver',
    transpChip: 'Transporte de perros',
    transpTitle: 'Transporte de perros',
    transpSub: 'Encontrá un vecino de confianza para transportar a tu perro, o anotate para ayudar a otros.',
    transpWarning: '🚫 Solo intercambios entre vecinos — está prohibido cobrar o ofrecer servicios comerciales en esta sección.',
    transpCTATitle: 'Quiero transportar perros',
    transpCTASub: 'Anotate como transportador disponible para ayudar a vecinos que lo necesiten.',
    transpCTABtn: 'Registrarme',
    transpHeader: 'Transportadores disponibles',
    transpEmpty: 'Todavía no hay transportadores. ¡Sé el primero!',
    transpDeactivate: 'Dar de baja',
    transpSeeProfile: 'Ver perfil y calificaciones',
    transpLabel: 'Transportador disponible',
    // Calculadora
    calcBack: 'Volver al inicio',
    calcChip: 'Herramienta gratuita',
    calcYearsLabel: 'Años',
    calcMonthsLabel: 'Meses adicionales',
    calcSizeLabel: 'Tamaño del perro',
    calcSmall: 'Pequeño',
    calcSmallDesc: 'menos de 10 kg',
    calcMedium: 'Mediano',
    calcMediumDesc: '10 – 25 kg',
    calcLarge: 'Grande',
    calcLargeDesc: 'más de 25 kg',
    calcEquivalent: 'Tu perro equivale a',
    calcHumanYears: 'años humanos',
    calcStageLabel: 'Etapa',
    calcPuppy: 'Cachorro',
    calcPuppyText: 'Todavía está descubriendo el mundo. ¡Todo es nuevo y emocionante!',
    calcJuvenil: 'Juvenil',
    calcJuvenilText: 'Lleno de energía y curiosidad. Es la etapa perfecta para el entrenamiento.',
    calcAdult: 'Adulto',
    calcAdultText: 'En su mejor momento: equilibrado, leal y con mucho amor para dar.',
    calcSenior: 'Senior',
    calcSeniorText: 'Con la experiencia de años vividos. Merece mimos y cuidados especiales.',
    calcElder: 'Anciano',
    calcElderText: 'Un veterano lleno de sabiduría y amor incondicional. ¡Un tesoro!',
    calcFormula: 'Fórmula aplicada para perro',
    calcEmpty: 'Ingresá la edad de tu perro para ver el resultado.',
    calcNote: 'Esta calculadora es orientativa. Para un seguimiento preciso de la salud de tu perro, consultá siempre a tu veterinario de confianza.',
  },

  // ═══════════════════════════════════════════════════════
  //  ENGLISH
  // ═══════════════════════════════════════════════════════
  en: {
    // AuthModal
    welcome: 'Welcome to Vecindog',
    welcomeSub: 'Sign up to see contact details of listings.',
    confirmEmail: 'Confirm your email',
    confirmEmailSub: 'We sent a verification code to',
    tabRegister: 'Create account',
    tabLogin: 'Sign in',
    emailPlaceholder: 'your@email.com',
    passwordPlaceholder: 'Password (min. 6 characters)',
    showPassword: 'Show password',
    hidePassword: 'Hide password',
    termsPrefix: 'I accept the',
    termsLink: 'Terms and Conditions',
    termsMiddle: 'and the',
    privacyLink: 'Privacy Policy',
    termsSuffix: 'of Vecindog.',
    btnRegister: 'Create free account',
    btnLogin: 'Sign in',
    or: 'or',
    continueGoogle: 'Continue with Google',
    enterGuest: 'Enter as guest',
    guestNote: "As a guest you won't be able to see the contact WhatsApp.",
    codeLabel: 'Verification code',
    codeError: 'Enter the verification code.',
    btnConfirm: 'Confirm and enter',
    resendCode: 'Resend code',
    changeEmail: 'Change email',
    infoResent: 'We resent the confirmation code to your email.',
    infoResentOk: 'Code resent. Check your inbox (and spam).',
    errInvalidCredentials: 'Incorrect email or password.',
    errEmailNotConfirmed: 'Confirm your email before signing in.',
    errAlreadyRegistered: 'An account with this email already exists. Sign in.',
    errWeakPassword: 'Password must be at least 6 characters.',
    errInvalidEmail: 'Invalid email. Check that it is written correctly.',
    errRateLimit: 'Too many attempts. Wait a few minutes and try again.',
    errTokenExpired: 'The code has expired. Request a new one.',
    errTokenNotFound: 'Incorrect code. Check your email or request a new one.',
    errSignupDisabled: 'Registration is temporarily disabled.',
    errNetwork: 'Connection error. Check your internet.',
    forgotLink: 'Forgot your password?',
    forgotTitle: 'Reset password',
    forgotSub: 'Enter your email and we will send you a link to create a new password.',
    btnSendReset: 'Send reset link',
    forgotSuccess: 'Check your email. We sent you a link to reset your password (also check spam).',
    backToLogin: 'Back to sign in',
    newPasswordTitle: 'New password',
    newPasswordSub: 'Enter your new password to continue.',
    newPasswordPlaceholder: 'New password (min. 6 characters)',
    confirmPasswordPlaceholder: 'Confirm password',
    btnUpdatePassword: 'Save password',
    errPasswordMismatch: 'Passwords do not match.',
    updatePasswordSuccess: 'Password updated!',
    updatePasswordSuccessSub: 'You can now sign in with your new password.',
    invalidResetLink: 'The reset link is invalid or has expired. Request a new one.',
    // ProfileModal
    profileTitle: 'Complete your profile',
    profileSub: 'We need some information to continue',
    firstName: 'First name',
    lastName: 'Last name',
    phone: 'Phone (e.g.: 1123456789)',
    selectCity: 'Select your city',
    province: 'Province / State',
    country: 'Country',
    btnSave: 'Save and continue',
    // Navigation
    navInicio: 'Home',
    navMapa: 'Map',
    navAvisos: 'Listings',
    navMisPerros: 'My dogs',
    navPublicar: 'Post',
    navEnterPerfil: 'My profile',
    navMiPlanPro: 'My Pro plan',
    navPlanes: 'Plans',
    navMiComercio: 'My business',
    navCambiarUbicacion: 'Change location',
    navPanelAdmin: 'Admin panel',
    navCerrarSesion: 'Sign out',
    navDescargas: 'Downloads',
    navInvitado: 'Guest',
    navModoInvitado: 'Guest mode',
    navSalirCrearCuenta: 'Leave and create account',
    navSalir: 'Leave',
    navCambiarCiudad: 'Change city',
    navRedVecindog: 'Vecindog Network',
    navPublicitate: 'Advertise',
    // Hero
    heroChip: 'Neighborhood network',
    heroTitle: 'Search. Find.',
    heroTitleAccent: 'Adopt.',
    heroSub: 'The neighborhood network to find and adopt',
    heroSubBold: 'dogs near you',
    // ActionCards
    accionBuscando: 'I\'m looking',
    accionBuscandoText: 'Post a listing so the community can help you find them.',
    accionViPerdido: 'I saw one lost',
    accionViPerdidoText: 'Alert the community to help them get home.',
    accionDoyAdopcion: 'Giving for adoption',
    accionDoyAdopcionText: 'Post a dog that needs a new home.',
    accionTransito: 'In transit',
    accionTransitoText: 'You have them temporarily or saw them on the street. The community can help.',
    accionCuidado: 'Dog care',
    accionCuidadoText: 'Find a caretaker or sign up to take care of neighbors\' dogs.',
    accionTransporte: 'Transport',
    accionTransporteText: 'Find someone to take your dog or sign up to transport neighbors\' dogs.',
    accionEmpezar: 'Start',
    accionNuevo: 'New',
    chipPerdidos: 'Lost',
    chipTarda1Min: 'Takes 1 minute',
    chipComunidadCuidada: 'Safe community',
    chipComunidad: 'Community',
    // HowItWorks
    how4Steps: 'In 4 steps',
    howTitle: 'How does Vecindog work?',
    howSub: 'Takes less than a minute.',
    howStep1Title: 'You post',
    howStep1Text: 'Upload photos and key details in less than a minute.',
    howStep2Title: 'Neighbors see it',
    howStep2Text: 'Your listing appears on your city\'s board.',
    howStep3Title: 'They contact you',
    howStep3Text: 'When someone has a lead, they write to you via WhatsApp.',
    howStep4Title: 'Reunion',
    howStep4Text: 'Or the perfect family appears to adopt.',
    calcTitle: 'Dog age calculator',
    calcSub: 'How old is your dog in human years?',
    calcCta: 'Calculate now',
    // TrustSection
    trustTitle: 'A cared-for community',
    trustSub: 'Clear rules so that helping is safe for everyone.',
    trust1Title: 'Listings by city',
    trust1Text: 'Posts are filtered by your neighborhood and city.',
    trust2Title: 'Quick contact',
    trust2Text: 'Directly via WhatsApp, no middlemen.',
    trust3Title: 'No animal sales',
    trust3Text: 'Vecindog is only for reuniting and adopting.',
    trust4Title: 'Responsible adoption',
    trust4Text: 'Clear recommendations for new families.',
    trust5Title: 'Neighborhood community',
    trust5Text: 'Built by neighbors who help each other.',
    trust6Title: 'Clear listings',
    trust6Text: 'Photo, neighborhood and verifiable details always.',
    // Footer
    footerSub: 'The neighborhood network to find and adopt dogs near you. Made by neighbors, free and without animal sales.',
    footerAvailableIn: 'Available throughout Argentina',
    footerAppSection: 'The app',
    footerComunidadSection: 'Community',
    footerNegociosSection: 'Business',
    footerTerms: 'Terms and Conditions',
    footerPrivacy: 'Privacy Policy',
    footerMadeWith: 'Made with love in Argentina 🐾',
    footerLinkInicio: 'Home',
    footerLinkAvisos: 'Listings',
    footerLinkPublicar: 'Post',
    footerLinkBuscarFoto: 'Search by photo',
    footerLinkPerdidos: 'Lost',
    footerLinkVistos: 'Found',
    footerLinkAdopcion: 'For adoption',
    footerLinkTransito: 'In transit',
    // Categories
    catPerdido: 'Lost',
    catEncontrado: 'Found',
    catAdopcion: 'For adoption',
    catTransito: 'In transit',
    catBuscoCuidador: 'Needs caretaker',
    catCuidadorDisponible: 'Caretaker available',
    // AnimalCard
    cardNoName: 'Unnamed dog',
    cardTapInfo: 'Tap for more info',
    cardSeePost: 'See listing',
    cardNoPhoto: 'No photo',
    cardStreetSighting: 'Seen on the street — needs help',
    cardRewardPrefix: 'Reward $',
    cardLastDay: 'Last day',
    cardOneDayLeft: '1 day left',
    cardDaysLeft: '{n} days left',
    cardExpired: 'Deadline passed',
    // Filters
    filterTitle: 'Filters',
    filterClear: 'Clear',
    filterMyPosts: 'My listings',
    filterType: 'Listing type',
    filterAll: 'All',
    filterLostAndFound: 'Lost and found',
    filterLost: 'Lost',
    filterFound: 'Found',
    filterAdoption: 'For adoption',
    filterTransit: 'In transit',
    filterCaretaker: 'Needs caretaker',
    filterCaretakerAvail: 'Caretakers available',
    filterZone: 'Zone / neighborhood',
    filterZonePlaceholder: 'Downtown, Riverside, etc.',
    // Publicaciones
    pubTitleAll: 'All listings',
    pubSubAll: 'Dogs posted by neighbors in your city.',
    pubTitleBuscar: 'Lost and found',
    pubSubBuscar: 'Lost and found dogs near you.',
    pubTitlePerdido: 'Lost dogs',
    pubSubPerdido: 'Families looking for their dog. Have you seen them?',
    pubTitleEncontrado: 'Found dogs',
    pubSubEncontrado: 'Dogs seen on the street looking for their family.',
    pubTitleAdopcion: 'Dogs for adoption',
    pubSubAdopcion: 'Dogs looking for a responsible family.',
    pubTitleTransito: 'Dogs in transit',
    pubSubTransito: 'Dogs someone has temporarily or saw on the street.',
    pubTitleCuidador: 'Looking for caretaker',
    pubSubCuidador: 'Owners looking for a trusted person to care for their dog.',
    pubTitleCuidadorDisp: 'Caretakers available',
    pubSubCuidadorDisp: 'Neighbors available to care for community dogs.',
    pubMyPosts: 'My listings',
    pubLoading: 'Loading listings…',
    pubError: 'Error loading listings.',
    pubEmpty: 'No listings yet.',
    pubEmptySub: 'Be the first to post.',
    pubPostWord: 'listing',
    pubPostWordPlural: 'listings',
    pubSearchPlaceholder: 'Search by name, description or area…',
    pubShowMore: 'Show more',
    pubBuscarFotoTitle: 'AI photo search',
    pubBuscarFotoCTA: 'Upload a photo · AI does the matching',
    pubBuscarCaractTitle: 'Search by characteristics',
    pubBuscarCaractCTA: 'Color, size, collar, tag…',
    // Planes
    plansTitle: 'Choose your plan',
    plansSub: 'Vecindog is free to start. Upgrade to Pro for the full experience.',
    plansBack: 'Back',
    plansFreeLabel: 'Free',
    plansFreePrice: '$0',
    plansFreeSub: 'To start searching and registering your dog.',
    plansCurrentPlan: 'Current plan',
    plansGoHome: 'Go to home',
    plansProLabel: 'VecindogPro',
    plansProPrice: '$1,000',
    plansProSub: 'The full experience to find and care for your dog.',
    plansRecommended: 'RECOMMENDED',
    plansPerMonth: '/ month',
    plansActive: 'Plan active',
    plansActiveUntil: 'Plan active until',
    plansLoginFirst: 'Sign in to subscribe',
    plansSubscribe: 'Subscribe',
    plansMpNote: 'You can pay with Mercado Pago (balance, cash), debit or credit card.',
    // Common
    commonBack: 'Back',
    commonSave: 'Save',
    commonCancel: 'Cancel',
    commonLoading: 'Loading…',
    commonError: 'An error occurred. Please try again.',
    commonClose: 'Close',
    commonRequired: 'Required',
    commonOptional: 'Optional',
    commonSeeAll: 'See all',
    commonSeeMore: 'See more',
    commonRetry: 'Try again',
    // Mapa
    mapLoading: 'Loading posts…',
    mapLegendSeen: 'Seen',
    mapLegendStreet: 'On the street',
    mapLegendVecindog: 'Red Vecindog',
    mapMyLocation: 'My location',
    // Buscar por foto
    bpfBack: 'Back to posts',
    bpfChip: 'AI Search',
    bpfTitle: 'Search by photo',
    bpfSub: 'Upload a photo — AI detects breed, color and size automatically.',
    bpfPhotoSection: 'Dog photo',
    bpfRequired: 'Required',
    bpfUploadTap: 'Tap to upload a photo',
    bpfUploadSub: 'AI detects breed, color and size automatically',
    bpfGallery: 'Gallery',
    bpfTakePhoto: 'Take photo',
    bpfAnalyzingIA: 'Analyzing with AI…',
    bpfIADetected: 'AI detected',
    bpfIAAutofilled: 'Filters were filled automatically. You can adjust them below.',
    bpfColorTitle: 'Main color',
    bpfRazaTitle: 'Breed',
    bpfRazaPlaceholder: 'E.g.: Labrador, Golden, Mixed…',
    bpfSizeTitle: 'Size',
    bpfSizeSmall: 'Small',
    bpfSizeMedium: 'Medium',
    bpfSizeLarge: 'Large',
    bpfAccessories: 'Accessories',
    bpfCollar: 'Collar',
    bpfTag: 'Tag',
    bpfYes: 'Yes',
    bpfNo: 'No',
    bpfSearchBtn: 'Search matches',
    bpfSearching: 'Searching…',
    bpfAnalyzingPhoto: 'Analyzing photo…',
    bpfBestMatch: 'Best match',
    bpfNoMatches: 'No relevant matches found.',
    bpfNoMatchesSub: 'Try adjusting the filters or uploading a clearer photo of the dog.',
    bpfOtherPossibilities: 'Other possibilities',
    bpfNoPostsYet: 'No posts published yet.',
    bpfSeeAllPosts: 'See all posts',
    bpfSeePost: 'See post',
    bpfWithCollar: 'With collar',
    bpfNoCollar: 'No collar',
    bpfWithTag: 'With tag',
    bpfNoTag: 'No tag',
    bpfPaywallTitle: 'Photo search',
    bpfPaywallSub: 'Upload a photo and we find the dog using AI. Exclusive feature of VecindogPro.',
    bpfPaywallBtn: 'See Pro plan',
    bpfPaywallLink: 'See posts',
    bpfSimilar: '% match',
    // Mis Perros
    mpChip: 'My dogs',
    mpTitle: 'Your canine family',
    mpSub: 'Save your dogs\' info. If one goes missing, you\'ll have everything ready.',
    mpFriends: 'Friends',
    mpAddDog: 'Add dog',
    mpAddAnother: 'Add another dog',
    mpMoreWithPro: 'More dogs with Pro',
    mpSeePlans: 'See plans',
    mpSeeProfile: 'See full profile',
    mpDeleteTitle: 'Delete ',
    mpDeleteSub: 'This action cannot be undone.',
    mpDeleteBtn: 'Delete',
    mpCancel: 'Cancel',
    mpDeleteError: 'Could not delete. Please try again.',
    mpLoadError: 'Could not load your dogs.',
    mpNotAuth: 'Sign in to see your dogs.',
    mpGoHome: 'Go home',
    mpResolvedTitle: 'Post marked as resolved! 🎉',
    mpResolvedSub: 'The post no longer appears in the list. Profiles here are not deleted — if one goes missing again, open its profile and report it with one click.',
    mpEmptyTitle: 'You haven\'t registered any dogs yet',
    mpEmptySub: 'Save their info, photos and vaccines. If they ever go missing, you\'ll have everything ready to find them.',
    mpRegisterDog: 'Register my dog',
    mpVaccine: 'vaccine',
    mpVaccines: 'vaccines',
    mpPuppy: 'Puppy',
    mpMonth: 'month',
    mpMonths: 'months',
    mpYear: 'year',
    mpYears: 'years',
    // Reencontrados
    reBack: 'Back to home',
    reChip: 'Real stories',
    reTitle: 'They came home 🏠',
    reSub: 'Every story here is a family made whole again. Thanks to neighbours like you who took a minute to help.',
    reDogSingular: 'dog reunited',
    reDogPlural: 'dogs reunited',
    reEmpty: 'No stories yet',
    reEmptySub: 'When a post is resolved, it will appear here. Help make it happen!',
    reActiveListings: 'See active posts',
    reCtaTitle: 'Did you lose or find a dog?',
    reCtaSub: 'The Vecindog community can help you.',
    reLostBtn: 'I lost my dog',
    reFoundBtn: 'I found a dog',
    reLabelHome: '🏠 Came home',
    reLabelAdopted: '❤️ Was adopted',
    reLabelDefault: '🏠 Reunited',
    // Cuidado
    cuidadoBack: 'Back',
    cuidadoChip: 'Dog care',
    cuidadoTitle: 'Dog care',
    cuidadoSub: 'Find a trusted neighbour to look after your dog, or sign up to care for dogs in the community.',
    cuidadoWarning: '🚫 Neighbour exchanges only — offering commercial services in this section is prohibited.',
    cuidadoSeekTitle: 'Looking for a carer',
    cuidadoSeekSub: 'Post a listing with your dog\'s details and find someone to care for them.',
    cuidadoSeekBtn: 'Post request',
    cuidadoSeekHeader: 'Looking for a carer',
    cuidadoSeekEmpty: 'No posts yet. Be the first to post!',
    cuidadoCareTitle: 'I want to care',
    cuidadoCareSub: 'Sign up as an available carer to help neighbours in need.',
    cuidadoCareBtn: 'Sign up',
    cuidadoCareHeader: 'Available carers',
    cuidadoCareEmpty: 'No carers yet. Be the first!',
    cuidadoDeactivate: 'Deactivate',
    cuidadoSeeProfile: 'See profile and ratings',
    cuidadoCuidadorLabel: 'Available carer',
    cuidadoBuscarLabel: 'Looking for carer',
    // Transporte
    transpBack: 'Back',
    transpChip: 'Dog transport',
    transpTitle: 'Dog transport',
    transpSub: 'Find a trusted neighbour to transport your dog, or sign up to help others.',
    transpWarning: '🚫 Neighbour exchanges only — offering commercial services in this section is prohibited.',
    transpCTATitle: 'I want to transport dogs',
    transpCTASub: 'Sign up as an available transporter to help neighbours in need.',
    transpCTABtn: 'Sign up',
    transpHeader: 'Available transporters',
    transpEmpty: 'No transporters yet. Be the first!',
    transpDeactivate: 'Deactivate',
    transpSeeProfile: 'See profile and ratings',
    transpLabel: 'Available transporter',
    // Calculadora
    calcBack: 'Back to home',
    calcChip: 'Free tool',
    calcYearsLabel: 'Years',
    calcMonthsLabel: 'Additional months',
    calcSizeLabel: 'Dog size',
    calcSmall: 'Small',
    calcSmallDesc: 'under 10 kg',
    calcMedium: 'Medium',
    calcMediumDesc: '10 – 25 kg',
    calcLarge: 'Large',
    calcLargeDesc: 'over 25 kg',
    calcEquivalent: 'Your dog is equivalent to',
    calcHumanYears: 'human years',
    calcStageLabel: 'Stage',
    calcPuppy: 'Puppy',
    calcPuppyText: 'Still discovering the world. Everything is new and exciting!',
    calcJuvenil: 'Juvenile',
    calcJuvenilText: 'Full of energy and curiosity. The perfect stage for training.',
    calcAdult: 'Adult',
    calcAdultText: 'At their best: balanced, loyal and with lots of love to give.',
    calcSenior: 'Senior',
    calcSeniorText: 'With years of experience. Deserves extra pampering and care.',
    calcElder: 'Elder',
    calcElderText: 'A veteran full of wisdom and unconditional love. A treasure!',
    calcFormula: 'Formula applied for',
    calcEmpty: 'Enter your dog\'s age to see the result.',
    calcNote: 'This calculator is a guide. For precise health monitoring, always consult your vet.',
  },

  // ═══════════════════════════════════════════════════════
  //  PORTUGUÊS
  // ═══════════════════════════════════════════════════════
  pt: {
    // AuthModal
    welcome: 'Bem-vindo ao Vecindog',
    welcomeSub: 'Cadastre-se para ver os dados de contato dos anúncios.',
    confirmEmail: 'Confirme seu email',
    confirmEmailSub: 'Enviamos um código de verificação para',
    tabRegister: 'Criar conta',
    tabLogin: 'Entrar',
    emailPlaceholder: 'seu@email.com',
    passwordPlaceholder: 'Senha (mín. 6 caracteres)',
    showPassword: 'Mostrar senha',
    hidePassword: 'Ocultar senha',
    termsPrefix: 'Aceito os',
    termsLink: 'Termos e Condições',
    termsMiddle: 'e a',
    privacyLink: 'Política de Privacidade',
    termsSuffix: 'do Vecindog.',
    btnRegister: 'Criar conta grátis',
    btnLogin: 'Entrar',
    or: 'ou',
    continueGoogle: 'Continuar com Google',
    enterGuest: 'Entrar como convidado',
    guestNote: 'Como convidado você não poderá ver o WhatsApp de contato.',
    codeLabel: 'Código de verificação',
    codeError: 'Digite o código de verificação.',
    btnConfirm: 'Confirmar e entrar',
    resendCode: 'Reenviar código',
    changeEmail: 'Alterar email',
    infoResent: 'Reenviamos o código de confirmação para o email.',
    infoResentOk: 'Código reenviado. Verifique sua caixa de entrada (e spam).',
    errInvalidCredentials: 'Email ou senha incorretos.',
    errEmailNotConfirmed: 'Confirme seu email antes de entrar.',
    errAlreadyRegistered: 'Já existe uma conta com esse email. Entre.',
    errWeakPassword: 'A senha deve ter pelo menos 6 caracteres.',
    errInvalidEmail: 'Email inválido. Verifique se está escrito corretamente.',
    errRateLimit: 'Muitas tentativas. Aguarde alguns minutos e tente novamente.',
    errTokenExpired: 'O código expirou. Solicite um novo.',
    errTokenNotFound: 'Código incorreto. Verifique o email ou solicite um novo.',
    errSignupDisabled: 'O cadastro está temporariamente desabilitado.',
    errNetwork: 'Erro de conexão. Verifique sua internet.',
    forgotLink: 'Esqueceu sua senha?',
    forgotTitle: 'Recuperar senha',
    forgotSub: 'Digite seu email e enviaremos um link para criar uma nova senha.',
    btnSendReset: 'Enviar link de recuperação',
    forgotSuccess: 'Verifique seu email. Enviamos um link para recuperar sua senha (verifique também o spam).',
    backToLogin: 'Voltar ao login',
    newPasswordTitle: 'Nova senha',
    newPasswordSub: 'Digite sua nova senha para continuar.',
    newPasswordPlaceholder: 'Nova senha (mín. 6 caracteres)',
    confirmPasswordPlaceholder: 'Confirmar senha',
    btnUpdatePassword: 'Salvar senha',
    errPasswordMismatch: 'As senhas não coincidem.',
    updatePasswordSuccess: 'Senha atualizada!',
    updatePasswordSuccessSub: 'Agora você pode entrar com sua nova senha.',
    invalidResetLink: 'O link de recuperação é inválido ou expirou. Solicite um novo.',
    // ProfileModal
    profileTitle: 'Complete seu perfil',
    profileSub: 'Precisamos de alguns dados para continuar',
    firstName: 'Nome',
    lastName: 'Sobrenome',
    phone: 'Telefone (ex: 1123456789)',
    selectCity: 'Selecione sua cidade',
    province: 'Província / Estado',
    country: 'País',
    btnSave: 'Salvar e continuar',
    // Navigation
    navInicio: 'Início',
    navMapa: 'Mapa',
    navAvisos: 'Anúncios',
    navMisPerros: 'Meus cães',
    navPublicar: 'Publicar',
    navEnterPerfil: 'Meu perfil',
    navMiPlanPro: 'Meu plano Pro',
    navPlanes: 'Planos',
    navMiComercio: 'Meu negócio',
    navCambiarUbicacion: 'Mudar localização',
    navPanelAdmin: 'Painel admin',
    navCerrarSesion: 'Sair',
    navDescargas: 'Downloads',
    navInvitado: 'Convidado',
    navModoInvitado: 'Modo convidado',
    navSalirCrearCuenta: 'Sair e criar conta',
    navSalir: 'Sair',
    navCambiarCiudad: 'Mudar cidade',
    navRedVecindog: 'Rede Vecindog',
    navPublicitate: 'Anuncie',
    // Hero
    heroChip: 'Rede de vizinhança',
    heroTitle: 'Busque. Encontre.',
    heroTitleAccent: 'Adote.',
    heroSub: 'A rede de vizinhança para encontrar e adotar',
    heroSubBold: 'cães perto de você',
    // ActionCards
    accionBuscando: 'Estou procurando',
    accionBuscandoText: 'Publique um anúncio para que a comunidade ajude a encontrá-lo.',
    accionViPerdido: 'Vi um perdido',
    accionViPerdidoText: 'Avise a comunidade para ajudá-lo a voltar para casa.',
    accionDoyAdopcion: 'Dou para adoção',
    accionDoyAdopcionText: 'Publique um cão que precisa de um novo lar.',
    accionTransito: 'Em trânsito',
    accionTransitoText: 'Está com ele temporariamente ou o viu na rua. A comunidade pode ajudar.',
    accionCuidado: 'Cuidado',
    accionCuidadoText: 'Encontre um cuidador ou se cadastre para cuidar dos cães dos vizinhos.',
    accionTransporte: 'Transporte',
    accionTransporteText: 'Encontre quem leve seu cão ou se cadastre para transportar cães de vizinhos.',
    accionEmpezar: 'Começar',
    accionNuevo: 'Novo',
    chipPerdidos: 'Perdidos',
    chipTarda1Min: 'Leva 1 minuto',
    chipComunidadCuidada: 'Comunidade cuidada',
    chipComunidad: 'Comunidade',
    // HowItWorks
    how4Steps: 'Em 4 passos',
    howTitle: 'Como funciona o Vecindog?',
    howSub: 'Leva menos de um minuto.',
    howStep1Title: 'Você publica',
    howStep1Text: 'Sobe fotos e os dados principais em menos de um minuto.',
    howStep2Title: 'Vizinhos veem',
    howStep2Text: 'Seu anúncio aparece no mural da sua cidade.',
    howStep3Title: 'Te contactam',
    howStep3Text: 'Quando alguém tem uma pista, te escreve pelo WhatsApp.',
    howStep4Title: 'Reencontro',
    howStep4Text: 'Ou a família ideal aparece para adotar.',
    calcTitle: 'Calculadora de idade canina',
    calcSub: 'Quantos anos tem seu cão em anos humanos?',
    calcCta: 'Calcular agora',
    // TrustSection
    trustTitle: 'Uma comunidade cuidada',
    trustSub: 'Regras claras para que ajudar seja seguro para todos.',
    trust1Title: 'Anúncios por cidade',
    trust1Text: 'Os anúncios são filtrados pelo seu bairro e cidade.',
    trust2Title: 'Contato rápido',
    trust2Text: 'Direto pelo WhatsApp, sem intermediários.',
    trust3Title: 'Sem venda de animais',
    trust3Text: 'O Vecindog é apenas para reunir e adotar.',
    trust4Title: 'Adoção responsável',
    trust4Text: 'Recomendações claras para novas famílias.',
    trust5Title: 'Comunidade de vizinhos',
    trust5Text: 'Feito entre vizinhos que se ajudam.',
    trust6Title: 'Anúncios claros',
    trust6Text: 'Foto, bairro e dados verificáveis sempre.',
    // Footer
    footerSub: 'A rede de vizinhança para encontrar e adotar cães perto de você. Feito entre vizinhos, grátis e sem venda de animais.',
    footerAvailableIn: 'Disponível em toda a Argentina',
    footerAppSection: 'O app',
    footerComunidadSection: 'Comunidade',
    footerNegociosSection: 'Negócios',
    footerTerms: 'Termos e Condições',
    footerPrivacy: 'Política de Privacidade',
    footerMadeWith: 'Feito com carinho na Argentina 🐾',
    footerLinkInicio: 'Início',
    footerLinkAvisos: 'Anúncios',
    footerLinkPublicar: 'Publicar',
    footerLinkBuscarFoto: 'Buscar por foto',
    footerLinkPerdidos: 'Perdidos',
    footerLinkVistos: 'Encontrados',
    footerLinkAdopcion: 'Para adoção',
    footerLinkTransito: 'Em trânsito',
    // Categories
    catPerdido: 'Perdido',
    catEncontrado: 'Encontrado',
    catAdopcion: 'Para adoção',
    catTransito: 'Em trânsito',
    catBuscoCuidador: 'Precisa de cuidador',
    catCuidadorDisponible: 'Cuidador disponível',
    // AnimalCard
    cardNoName: 'Cão sem nome',
    cardTapInfo: 'Toque para mais info',
    cardSeePost: 'Ver anúncio',
    cardNoPhoto: 'Anúncio sem foto',
    cardStreetSighting: 'Visto na rua — precisa de ajuda',
    cardRewardPrefix: 'Recompensa $',
    cardLastDay: 'Último dia',
    cardOneDayLeft: 'Falta 1 dia',
    cardDaysLeft: 'Faltam {n} dias',
    cardExpired: 'Prazo vencido',
    // Filters
    filterTitle: 'Filtros',
    filterClear: 'Limpar',
    filterMyPosts: 'Meus anúncios',
    filterType: 'Tipo de anúncio',
    filterAll: 'Todos',
    filterLostAndFound: 'Perdidos e encontrados',
    filterLost: 'Perdidos',
    filterFound: 'Encontrados',
    filterAdoption: 'Para adoção',
    filterTransit: 'Em trânsito',
    filterCaretaker: 'Precisa de cuidador',
    filterCaretakerAvail: 'Cuidadores disponíveis',
    filterZone: 'Zona / bairro',
    filterZonePlaceholder: 'Centro, Vila Madalena, etc.',
    // Publicaciones
    pubTitleAll: 'Todos os anúncios',
    pubSubAll: 'Cães publicados pelos vizinhos da sua cidade.',
    pubTitleBuscar: 'Perdidos e encontrados',
    pubSubBuscar: 'Cães perdidos e vistos perto de você.',
    pubTitlePerdido: 'Cães perdidos',
    pubSubPerdido: 'Famílias procurando seu cão. Você viu?',
    pubTitleEncontrado: 'Cães encontrados',
    pubSubEncontrado: 'Cães vistos na rua procurando sua família.',
    pubTitleAdopcion: 'Cães para adoção',
    pubSubAdopcion: 'Cães procurando uma família responsável.',
    pubTitleTransito: 'Cães em trânsito',
    pubSubTransito: 'Cães que alguém tem temporariamente ou viu na rua.',
    pubTitleCuidador: 'Procurando cuidador',
    pubSubCuidador: 'Donos procurando alguém de confiança para cuidar do cão.',
    pubTitleCuidadorDisp: 'Cuidadores disponíveis',
    pubSubCuidadorDisp: 'Vizinhos disponíveis para cuidar de cães da comunidade.',
    pubMyPosts: 'Meus anúncios',
    pubLoading: 'Carregando anúncios…',
    pubError: 'Erro ao carregar os anúncios.',
    pubEmpty: 'Nenhum anúncio ainda.',
    pubEmptySub: 'Seja o primeiro a publicar.',
    pubPostWord: 'anúncio',
    pubPostWordPlural: 'anúncios',
    pubSearchPlaceholder: 'Buscar por nome, descrição ou zona…',
    pubShowMore: 'Ver mais',
    pubBuscarFotoTitle: 'Busca por foto com IA',
    pubBuscarFotoCTA: 'Suba uma foto · A IA faz o matching',
    pubBuscarCaractTitle: 'Buscar por características',
    pubBuscarCaractCTA: 'Cor, tamanho, coleira, plaquinha…',
    // Planes
    plansTitle: 'Escolha seu plano',
    plansSub: 'O Vecindog é gratuito para começar. Atualize para Pro para a experiência completa.',
    plansBack: 'Voltar',
    plansFreeLabel: 'Grátis',
    plansFreePrice: '$0',
    plansFreeSub: 'Para começar a buscar e registrar seu cão.',
    plansCurrentPlan: 'Plano atual',
    plansGoHome: 'Voltar ao início',
    plansProLabel: 'VecindogPro',
    plansProPrice: '$1.000',
    plansProSub: 'A experiência completa para encontrar e cuidar do seu cão.',
    plansRecommended: 'RECOMENDADO',
    plansPerMonth: '/ mês',
    plansActive: 'Plano ativo',
    plansActiveUntil: 'Plano ativo até',
    plansLoginFirst: 'Entre para se inscrever',
    plansSubscribe: 'Assinar',
    plansMpNote: 'Você pode pagar com Mercado Pago (saldo, dinheiro), cartão de débito ou crédito.',
    // Common
    commonBack: 'Voltar',
    commonSave: 'Salvar',
    commonCancel: 'Cancelar',
    commonLoading: 'Carregando…',
    commonError: 'Ocorreu um erro. Tente novamente.',
    commonClose: 'Fechar',
    commonRequired: 'Obrigatório',
    commonOptional: 'Opcional',
    commonSeeAll: 'Ver todos',
    commonSeeMore: 'Ver mais',
    commonRetry: 'Tentar novamente',
    // Mapa
    mapLoading: 'Carregando avisos…',
    mapLegendSeen: 'Visto',
    mapLegendStreet: 'Na rua',
    mapLegendVecindog: 'Red Vecindog',
    mapMyLocation: 'Minha localização',
    // Buscar por foto
    bpfBack: 'Voltar aos avisos',
    bpfChip: 'Busca com IA',
    bpfTitle: 'Buscar por foto',
    bpfSub: 'Envie uma foto — a IA detecta raça, cor e tamanho automaticamente.',
    bpfPhotoSection: 'Foto do cão',
    bpfRequired: 'Obrigatória',
    bpfUploadTap: 'Toque para enviar uma foto',
    bpfUploadSub: 'A IA detecta raça, cor e tamanho automaticamente',
    bpfGallery: 'Galeria',
    bpfTakePhoto: 'Tirar foto',
    bpfAnalyzingIA: 'Analisando com IA…',
    bpfIADetected: 'IA detectou',
    bpfIAAutofilled: 'Os filtros foram preenchidos automaticamente. Você pode ajustá-los abaixo.',
    bpfColorTitle: 'Cor principal',
    bpfRazaTitle: 'Raça',
    bpfRazaPlaceholder: 'Ex: Labrador, Golden, Vira-lata…',
    bpfSizeTitle: 'Tamanho',
    bpfSizeSmall: 'Pequeno',
    bpfSizeMedium: 'Médio',
    bpfSizeLarge: 'Grande',
    bpfAccessories: 'Acessórios',
    bpfCollar: 'Coleira',
    bpfTag: 'Plaquinha',
    bpfYes: 'Sim',
    bpfNo: 'Não',
    bpfSearchBtn: 'Buscar coincidências',
    bpfSearching: 'Buscando…',
    bpfAnalyzingPhoto: 'Analisando foto…',
    bpfBestMatch: 'Melhor coincidência',
    bpfNoMatches: 'Não encontramos coincidências relevantes.',
    bpfNoMatchesSub: 'Tente ajustar os filtros ou enviar uma foto mais clara do cão.',
    bpfOtherPossibilities: 'Outras possibilidades',
    bpfNoPostsYet: 'Ainda não há avisos publicados.',
    bpfSeeAllPosts: 'Ver todos os avisos',
    bpfSeePost: 'Ver aviso',
    bpfWithCollar: 'Com coleira',
    bpfNoCollar: 'Sem coleira',
    bpfWithTag: 'Com plaquinha',
    bpfNoTag: 'Sem plaquinha',
    bpfPaywallTitle: 'Busca por foto',
    bpfPaywallSub: 'Envie uma foto e encontramos o cão usando IA. Função exclusiva do VecindogPro.',
    bpfPaywallBtn: 'Ver plano Pro',
    bpfPaywallLink: 'Ver avisos',
    bpfSimilar: '% similar',
    // Mis Perros
    mpChip: 'Meus cachorros',
    mpTitle: 'Sua família canina',
    mpSub: 'Salve os dados dos seus cachorros. Se algum se perder, você já tem tudo pronto.',
    mpFriends: 'Amigos',
    mpAddDog: 'Adicionar cachorro',
    mpAddAnother: 'Adicionar outro cachorro',
    mpMoreWithPro: 'Mais cachorros com Pro',
    mpSeePlans: 'Ver planos',
    mpSeeProfile: 'Ver perfil completo',
    mpDeleteTitle: 'Excluir ',
    mpDeleteSub: 'Esta ação não pode ser desfeita.',
    mpDeleteBtn: 'Excluir',
    mpCancel: 'Cancelar',
    mpDeleteError: 'Não foi possível excluir. Tente novamente.',
    mpLoadError: 'Não foi possível carregar seus cachorros.',
    mpNotAuth: 'Faça login para ver seus cachorros.',
    mpGoHome: 'Ir ao início',
    mpResolvedTitle: 'Aviso marcado como resolvido! 🎉',
    mpResolvedSub: 'O aviso não aparece mais na lista. Os perfis aqui não são excluídos — se algum se perder novamente, acesse o perfil e reporte com um clique.',
    mpEmptyTitle: 'Você ainda não registrou nenhum cachorro',
    mpEmptySub: 'Salve dados, fotos e vacinas. Se algum dia se perder, você já terá tudo pronto para encontrá-lo.',
    mpRegisterDog: 'Registrar meu cachorro',
    mpVaccine: 'vacina',
    mpVaccines: 'vacinas',
    mpPuppy: 'Filhote',
    mpMonth: 'mês',
    mpMonths: 'meses',
    mpYear: 'ano',
    mpYears: 'anos',
    // Reencontrados
    reBack: 'Voltar ao início',
    reChip: 'Histórias reais',
    reTitle: 'Voltaram para casa 🏠',
    reSub: 'Cada história aqui é uma família que voltou a ficar completa. Obrigado a vizinhos como você que tiraram um minuto para ajudar.',
    reDogSingular: 'cão reencontrado',
    reDogPlural: 'cães reencontrados',
    reEmpty: 'Ainda não há histórias',
    reEmptySub: 'Quando um aviso for resolvido, aparecerá aqui. Ajude a fazer isso acontecer!',
    reActiveListings: 'Ver avisos ativos',
    reCtaTitle: 'Perdeu ou encontrou um cão?',
    reCtaSub: 'A comunidade Vecindog pode ajudá-lo.',
    reLostBtn: 'Perdi meu cão',
    reFoundBtn: 'Encontrei um cão',
    reLabelHome: '🏠 Voltou para casa',
    reLabelAdopted: '❤️ Foi adotado',
    reLabelDefault: '🏠 Reencontrado',
    // Cuidado
    cuidadoBack: 'Voltar',
    cuidadoChip: 'Cuidado de cães',
    cuidadoTitle: 'Cuidado de cães',
    cuidadoSub: 'Encontre um vizinho de confiança para cuidar do seu cão, ou cadastre-se para cuidar de cães da comunidade.',
    cuidadoWarning: '🚫 Apenas trocas entre vizinhos — é proibido cobrar ou oferecer serviços comerciais nesta seção.',
    cuidadoSeekTitle: 'Procuro cuidador',
    cuidadoSeekSub: 'Publique um aviso com os dados do seu cão e encontre alguém para cuidar dele.',
    cuidadoSeekBtn: 'Publicar pedido',
    cuidadoSeekHeader: 'Procuram cuidador',
    cuidadoSeekEmpty: 'Ainda não há avisos. Seja o primeiro a publicar!',
    cuidadoCareTitle: 'Quero cuidar',
    cuidadoCareSub: 'Cadastre-se como cuidador disponível para ajudar vizinhos que precisam.',
    cuidadoCareBtn: 'Cadastrar-me',
    cuidadoCareHeader: 'Cuidadores disponíveis',
    cuidadoCareEmpty: 'Ainda não há cuidadores. Seja o primeiro!',
    cuidadoDeactivate: 'Desativar',
    cuidadoSeeProfile: 'Ver perfil e avaliações',
    cuidadoCuidadorLabel: 'Cuidador disponível',
    cuidadoBuscarLabel: 'Procura cuidador',
    // Transporte
    transpBack: 'Voltar',
    transpChip: 'Transporte de cães',
    transpTitle: 'Transporte de cães',
    transpSub: 'Encontre um vizinho de confiança para transportar seu cão, ou cadastre-se para ajudar outros.',
    transpWarning: '🚫 Apenas trocas entre vizinhos — é proibido cobrar ou oferecer serviços comerciais nesta seção.',
    transpCTATitle: 'Quero transportar cães',
    transpCTASub: 'Cadastre-se como transportador disponível para ajudar vizinhos que precisam.',
    transpCTABtn: 'Cadastrar-me',
    transpHeader: 'Transportadores disponíveis',
    transpEmpty: 'Ainda não há transportadores. Seja o primeiro!',
    transpDeactivate: 'Desativar',
    transpSeeProfile: 'Ver perfil e avaliações',
    transpLabel: 'Transportador disponível',
    // Calculadora
    calcBack: 'Voltar ao início',
    calcChip: 'Ferramenta gratuita',
    calcYearsLabel: 'Anos',
    calcMonthsLabel: 'Meses adicionais',
    calcSizeLabel: 'Tamanho do cão',
    calcSmall: 'Pequeno',
    calcSmallDesc: 'menos de 10 kg',
    calcMedium: 'Médio',
    calcMediumDesc: '10 – 25 kg',
    calcLarge: 'Grande',
    calcLargeDesc: 'mais de 25 kg',
    calcEquivalent: 'Seu cão equivale a',
    calcHumanYears: 'anos humanos',
    calcStageLabel: 'Fase',
    calcPuppy: 'Filhote',
    calcPuppyText: 'Ainda descobrindo o mundo. Tudo é novo e emocionante!',
    calcJuvenil: 'Juvenil',
    calcJuvenilText: 'Cheio de energia e curiosidade. A fase perfeita para o treinamento.',
    calcAdult: 'Adulto',
    calcAdultText: 'No seu melhor momento: equilibrado, leal e com muito amor para dar.',
    calcSenior: 'Sênior',
    calcSeniorText: 'Com a experiência de anos vividos. Merece mimos e cuidados especiais.',
    calcElder: 'Idoso',
    calcElderText: 'Um veterano cheio de sabedoria e amor incondicional. Um tesouro!',
    calcFormula: 'Fórmula aplicada para cão',
    calcEmpty: 'Insira a idade do seu cão para ver o resultado.',
    calcNote: 'Esta calculadora é orientativa. Para acompanhamento preciso da saúde do seu cão, consulte sempre seu veterinário.',
  },
};

const LANG_OPTIONS: { lang: Lang; flag: string; label: string }[] = [
  { lang: 'es', flag: '🇦🇷', label: 'Español' },
  { lang: 'en', flag: '🇺🇸', label: 'English' },
  { lang: 'pt', flag: '🇧🇷', label: 'Português' },
];

interface LangCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Translations;
}

const LanguageContext = createContext<LangCtx | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('es');

  useEffect(() => {
    const saved = localStorage.getItem(LANG_KEY) as Lang | null;
    if (saved && ['es', 'en', 'pt'].includes(saved)) setLangState(saved);
  }, []);

  function setLang(l: Lang) {
    localStorage.setItem(LANG_KEY, l);
    setLangState(l);
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider');
  return ctx;
}

export function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();
  return (
    <div className="flex justify-center gap-1.5 mb-5">
      {LANG_OPTIONS.map(({ lang: l, flag, label }) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          className={`flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-bold transition ${
            lang === l
              ? 'bg-brand-primary text-white shadow-soft'
              : 'bg-brand-cream text-ink-muted hover:text-ink'
          }`}
        >
          <span>{flag}</span>
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}
