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
  // ── Publicacion detalle page ──────────────────────────
  pubBack: string;
  pubNotFound: string;
  pubBackToList: string;
  pubDescripcion: string;
  pubResuelto: string;
  pubActivo: string;
  pubSinNombre: string;
  pubShare: string;
  pubLoVi: string;
  pubLoViTambien: string;
  pubLoViQuestion: string;
  pubLoViSamePlace: string;
  pubLoViSamePlaceSelected: string;
  pubLoViChange: string;
  pubLoViGpsOk: string;
  pubLoViGpsLoading: string;
  pubLoViGpsBtn: string;
  pubLoViGpsRetry: string;
  pubLoViManual: string;
  pubLoViConfirmAddr: string;
  pubLoViAddrLabel: string;
  pubLoViWhen: string;
  pubLoViToday: string;
  pubLoViOtherDay: string;
  pubLoViTimeLabel: string;
  pubLoViSend: string;
  pubLoViCancel: string;
  pubLoViSuccessMap: string;
  pubLoViSuccessOwner: string;
  pubLoViReportAnother: string;
  pubLoViSendError: string;
  pubAdoptBtn: string;
  pubAdminPanel: string;
  pubManagePanel: string;
  pubRenovarBuscar: string;
  pubRenovarEncontrado: string;
  pubRenovarAdopcion: string;
  pubRenovarDefault: string;
  pubRenovarHint: string;
  pubRenovarOk: string;
  pubRenovarErr: string;
  pubAdminResuelto: string;
  pubResueltoLost: string;
  pubResueltoFound: string;
  pubResueltoAdopcion: string;
  pubResueltoDefault: string;
  pubConfirmResueltoPerdido: string;
  pubConfirmResueltoOther: string;
  pubConfirmResueltoPerdidoSub: string;
  pubConfirmResueltoOtherSub: string;
  pubConfirm: string;
  pubCancel: string;
  pubDeleteBtn: string;
  pubDeleteConfirm: string;
  pubDeleteConfirmBtn: string;
  pubDeleteErr: string;
  pubUpdateErr: string;
  pubStatusTitle: string;
  pubStatusTipo: string;
  pubStatusZona: string;
  pubStatusPublicado: string;
  pubStatusHorario: string;
  pubStatusEstado: string;
  pubStatusLocked: string;
  pubStatusResuelto: string;
  pubStatusActivo: string;
  pubWaBtn: string;
  pubReportBtn: string;
  pubReportTitle: string;
  pubReportSent: string;
  pubReportSending: string;
  pubReportSend: string;
  pubReportSpam: string;
  pubReportFalso: string;
  pubReportIncorrecto: string;
  pubReportDuplicado: string;
  pubReportOtro: string;
  // ── Mi Perfil page ───────────────────────────────────
  mipChip: string;
  mipObediencia: string;
  mipSosTitle: string;
  mipSosSub: string;
  mipDatosTitle: string;
  mipEditar: string;
  mipNombrePlaceholder: string;
  mipApellidoPlaceholder: string;
  mipTelefonoPlaceholder: string;
  mipCiudadSelect: string;
  mipProvinciaPlaceholder: string;
  mipPaisPlaceholder: string;
  mipBioLabel: string;
  mipBioPlaceholder: string;
  mipInstagramFacebook: string;
  mipRadioLabel: string;
  mipRadioHint: string;
  mipGuardar: string;
  mipLabelEmail: string;
  mipLabelNombre: string;
  mipLabelTelefono: string;
  mipLabelCiudad: string;
  mipLabelProvincia: string;
  mipLabelPais: string;
  mipLabelDireccion: string;
  mipLabelSobreMi: string;
  mipLabelRadio: string;
  mipLabelRedes: string;
  mipAgregar: string;
  mipLinkEnviado: string;
  mipCambiar: string;
  mipVacunasTitle: string;
  mipPendiente: string;
  mipPendientes: string;
  mipVacunaVencida: string;
  mipDias: string;
  mipHoy: string;
  mipEn: string;
  mipVacunaVer: string;
  mipAvisosTitle: string;
  mipVerTodos: string;
  mipAvisosPublicados: string;
  mipSinLimite: string;
  mipDe5Avisos: string;
  mipPasatePro: string;
  mipDisponible: string;
  mipDisponibles: string;
  mipHistorialTitle: string;
  mipSinResueltos: string;
  mipSinNombre: string;
  mipMisPerrosTitle: string;
  mipAgregarDog: string;
  mipSinPerros: string;
  mipRegistrarPerro: string;
  mipSuccessPerfil: string;
  mipErrFotoSize: string;
  mipErrFoto: string;
  mipNotAuth: string;
  mipIrInicio: string;
  mipCatPerdido: string;
  mipCatEncontrado: string;
  mipCatAdopcion: string;
  mipCatTransito: string;
  mipCatBuscoCuidador: string;
  mipCatCuidadorDisp: string;
  mipQrExpires: string;
  mipQrRenews: string;
  mipQrDiscounts: string;
  mipSosModalTitle: string;
  mipSosModalSub: string;
  mipSosSinPerros: string;
  mipSosRegistrar: string;
  mipSosSinPerrosSuffix: string;
  mipSosCualPerro: string;
  mipSosSinDesc: string;
  mipSosEnviando: string;
  mipSosAlertar: string;
  mipSosSoloPublicar: string;
  mipSosErr: string;
  mipSosEnviado: string;
  mipSosAmigosPrefix: string;
  mipSosAmigo: string;
  mipSosAmigos: string;
  mipSosAmigosSuffix: string;
  mipSosSinAmigos: string;
  mipSosPublicar: string;
  mipLabelContrasena: string;
  // ── Red Vecindog page ────────────────────────────────
  rvnPromoChip: string;
  rvnNetworkChip: string;
  rvnHeroSub: string;
  rvnRegisterBtn: string;
  rvnAdminBtn: string;
  rvnBenef1Title: string;
  rvnBenef1Desc: string;
  rvnBenef2Title: string;
  rvnBenef2Desc: string;
  rvnBenef3Title: string;
  rvnBenef3Desc: string;
  rvnBenef4Title: string;
  rvnBenef4Desc: string;
  rvnCatTitle: string;
  rvnCatSub: string;
  rvnCatSeeMore: string;
  rvnCatVetDesc: string;
  rvnCatPetShopDesc: string;
  rvnCatPeluDesc: string;
  rvnCatAdiestrDesc: string;
  rvnCatPaseadorDesc: string;
  rvnCatGuarderiaDesc: string;
  rvnCatRefugioDesc: string;
  rvnCatTiendaDesc: string;
  rvnCatFarmaciaDesc: string;
  rvnPromoSubtitle: string;
  rvnCupo: string;
  rvnCupos: string;
  rvnDisponible: string;
  rvnDisponibles: string;
  rvnPromoBannerTitle: string;
  rvnPromoBannerDesc: string;
  rvnPromoMonths: string;
  rvnPromoLuego: string;
  rvnPricingChip: string;
  rvnPricingTitle: string;
  rvnPricingPromoSub: string;
  rvnPricingPromoStrike: string;
  rvnPricingRegSub: string;
  rvnPricingSub: string;
  rvnJoinBtn: string;
  rvnBenefit1: string;
  rvnBenefit2: string;
  rvnBenefit3: string;
  rvnBenefit4: string;
  rvnBenefit5: string;
  rvnBenefit6: string;
  rvnCtaTitle: string;
  rvnCtaSub: string;
  rvnFormTitle: string;
  rvnFormPhotoLabel: string;
  rvnFormPhotoBtn: string;
  rvnFormPhotoChange: string;
  rvnFormPhotoSize: string;
  rvnFormNameLabel: string;
  rvnFormCatLabel: string;
  rvnFormCatSelect: string;
  rvnFormDescLabel: string;
  rvnFormLocLabel: string;
  rvnFormAddrLabel: string;
  rvnFormCityLabel: string;
  rvnFormHoursLabel: string;
  rvnFormDaysLabel: string;
  rvnFormOpen: string;
  rvnFormClose: string;
  rvnFormPhoneLabel: string;
  rvnFormLinkLabel: string;
  rvnFormLinkHint: string;
  rvnFormEmailLabel: string;
  rvnFormEmailHint: string;
  rvnFormPayNote: string;
  rvnFormSubmitBtn: string;
  rvnErrName: string;
  rvnErrCat: string;
  rvnErrCity: string;
  rvnErrPhone: string;
  rvnErrAddr: string;
  rvnErrEmail: string;
  rvnErrPhoneDigits: string;
  rvnErrPayment: string;
  rvnErrConnection: string;
  rvnErrPhoto: string;
  // ── Adoptar page ─────────────────────────────────────
  adpBack: string;
  adpChip: string;
  adpTitle: string;
  adpSubtitulo: string;
  adpRequired: string;
  adpSi: string;
  adpNo: string;
  adpSec1: string;
  adpNombre: string;
  adpDni: string;
  adpEdad: string;
  adpEdadHint: string;
  adpTelefono: string;
  adpEmail: string;
  adpDireccion: string;
  adpDireccionHint: string;
  adpZona: string;
  adpSec2: string;
  adpSec2Sub: string;
  adpTipoVivienda: string;
  adpCasa: string;
  adpDepto: string;
  adpCasaPatio: string;
  adpOtro: string;
  adpTenencia: string;
  adpPropietario: string;
  adpInquilino: string;
  adpPropPermite: string;
  adpTienePatio: string;
  adpPatioFechado: string;
  adpSec3: string;
  adpSec3Sub: string;
  adpCantPersonas: string;
  adpCantPersonasHint: string;
  adpHayNinos: string;
  adpEdadesNinos: string;
  adpEdadesNinosHint: string;
  adpTodosDeAcuerdo: string;
  adpAlergias: string;
  adpSec4: string;
  adpMascotasActuales: string;
  adpCualesYCuantas: string;
  adpCualesHint: string;
  adpVacunadasCastradas: string;
  adpSiTodas: string;
  adpAlgunas: string;
  adpMascotasAnteriores: string;
  adpQuePaso: string;
  adpHorasSolo: string;
  adpMenos2: string;
  adp2a4: string;
  adp4a6: string;
  adp6a8: string;
  adpMas8: string;
  adpSec5: string;
  adpSec5Sub: string;
  adpTamanoPreferido: string;
  adpChico: string;
  adpMediano: string;
  adpGrande: string;
  adpSinPref: string;
  adpEdadPreferida: string;
  adpCachorro: string;
  adpJoven: string;
  adpAdulto: string;
  adpMayor: string;
  adpPerroEnMente: string;
  adpPerroEnMenteHint: string;
  adpPerroEnMentePh: string;
  adpMotivacion: string;
  adpMotivacionPh: string;
  adpSec6: string;
  adpSec6Sub: string;
  adpComp1: string;
  adpComp2: string;
  adpComp3: string;
  adpComp4: string;
  adpEnviando: string;
  adpEnviar: string;
  adpSuccessTitle: string;
  adpSuccessMsg: string;
  adpVerAdopcion: string;
  adpErrNombre: string;
  adpErrDni: string;
  adpErrEdad: string;
  adpErrTelefono: string;
  adpErrEmail: string;
  adpErrDireccion: string;
  adpErrZona: string;
  adpErrVivienda: string;
  adpErrTenencia: string;
  adpErrPropPermite: string;
  adpErrPatio: string;
  adpErrPatioFechado: string;
  adpErrPersonas: string;
  adpErrNinos: string;
  adpErrEdadesNinos: string;
  adpErrAcuerdo: string;
  adpErrAlergias: string;
  adpErrMascotas: string;
  adpErrDetalle: string;
  adpErrVacunadas: string;
  adpErrAnteriores: string;
  adpErrQuePaso: string;
  adpErrHoras: string;
  adpErrTamano: string;
  adpErrEdadPref: string;
  adpErrMotivacion: string;
  adpErrCompromisos: string;
  adpErrSubmit: string;
  // ── Buscar page ───────────────────────────────────────
  bscBack: string;
  bscChip: string;
  bscTitle: string;
  bscSub: string;
  bscSecCaract: string;
  bscRaza: string;
  bscRazaHint: string;
  bscColor: string;
  bscColorNoSe: string;
  bscTamano: string;
  bscChico: string;
  bscMediano: string;
  bscGrande: string;
  bscSexo: string;
  bscMacho: string;
  bscHembra: string;
  bscNs: string;
  bscCollar: string;
  bscColorCollar: string;
  bscColorCollarPh: string;
  bscChapita: string;
  bscSecDonde: string;
  bscZona: string;
  bscFecha: string;
  bscHorario: string;
  bscBuscar: string;
  bscBuscando: string;
  bscSinCoincidencias: string;
  bscAviso: string;
  bscAvisos: string;
  bscEncontradoS: string;
  bscEncontradosP: string;
  bscNoEncontramos: string;
  bscProbaFiltros: string;
  bscVerTodos: string;
  // ── Publicar page ─────────────────────────────────────
  pbrBack: string;
  pbrGuestTitle: string;
  pbrGuestSub: string;
  pbrGuestBtn: string;
  pbrChipPerdido: string;
  pbrChipEncontrado: string;
  pbrChipTransito: string;
  pbrChipAdopcion: string;
  pbrTitlePerdido: string;
  pbrTitleEncontrado: string;
  pbrTitleTransito: string;
  pbrTitleAdopcion: string;
  pbrSubPerdido: string;
  pbrSubEncontrado: string;
  pbrSubTransito: string;
  pbrSubAdopcion: string;
  pbrPrePerdido: string;
  pbrPreEncontrado: string;
  pbrBuscarCaract: string;
  pbrBuscarCaractSub: string;
  pbrBuscarFoto: string;
  pbrBuscarFotoSub: string;
  pbrSiNoEncontras: string;
  pbrPrefillPre: string;
  pbrPrefillPost: string;
  pbrPrefillSub: string;
  pbrStep1: string;
  pbrStep1Sub: string;
  pbrFotoPerfilDe: string;
  pbrPrincipal: string;
  pbrHacerPrincipal: string;
  pbrStep2Transit: string;
  pbrStep2TransitSub: string;
  pbrLoTengo: string;
  pbrLoTengoDesc: string;
  pbrLoVi: string;
  pbrLoViDesc: string;
  pbrFechaLimite: string;
  pbrFechaLimiteSub: string;
  pbrHoraVisto: string;
  pbrTransitWarning: string;
  pbrStep2DataSub: string;
  pbrStep2DataSubEncontrado: string;
  pbrStep2DataSubTransito: string;
  pbrStep2DataSubAdopcion: string;
  pbrNombre: string;
  pbrRaza: string;
  pbrColor: string;
  pbrColorNoSe: string;
  pbrTamano: string;
  pbrChico: string;
  pbrMediano: string;
  pbrGrande: string;
  pbrCollar: string;
  pbrChapita: string;
  pbrDescripcion: string;
  pbrDescripcionPh: string;
  pbrMatchTitle: string;
  pbrMatchNo: string;
  pbrMatchMismaZona: string;
  pbrMatchOtraZona: string;
  pbrMatchDondeViste: string;
  pbrMatchHora: string;
  pbrMatchConfirm: string;
  pbrStep3Perdido: string;
  pbrStep3Encontrado: string;
  pbrStep3Transito: string;
  pbrStep3Adopcion: string;
  pbrDondePerdio: string;
  pbrEnMiCasa: string;
  pbrEnOtroLugar: string;
  pbrSinDireccion: string;
  pbrAgregarPerfil: string;
  pbrGpsOk: string;
  pbrGpsCambiar: string;
  pbrGpsCargando: string;
  pbrGpsUsar: string;
  pbrGpsError: string;
  pbrGpsManual: string;
  pbrGpsVolver: string;
  pbrConfirmDir: string;
  pbrDireccionZona: string;
  pbrFecha: string;
  pbrHorario: string;
  pbrContactoLabel: string;
  pbrContactoError: string;
  pbrLimiteError: string;
  pbrPublicando: string;
  pbrPublicar: string;
  pbrSi: string;
  pbrNo: string;
  pbrNoSe: string;
  pbrAgregarFotos: string;
  pbrSubirFotos: string;
  pbrGaleria: string;
  pbrSacarFoto: string;
  pbrSuccessTitle: string;
  pbrSuccessMsg: string;
  pbrVerAvisos: string;
  pbrPublicarOtro: string;
  pbrPostMasPrecision: string;
  pbrPostEncontrarDueno: string;
  pbrBuscarFotoProSub: string;
  pbrSoloPro: string;
  pbrBuscarCaractTitle: string;
  pbrBuscarCaractProSub: string;
  pbrPorCaract: string;
  pbrFotoLimit: string;
  pbrFotoInvalida: string;
  pbrFotoPesada: string;
  pbrWhatsappError: string;
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
    // Publicacion detalle
    pubBack: 'Volver a los avisos',
    pubNotFound: 'Aviso no encontrado',
    pubBackToList: 'Volver a los avisos',
    pubDescripcion: 'Descripción',
    pubResuelto: 'Resuelto',
    pubActivo: 'Aviso activo',
    pubSinNombre: 'Perro sin nombre',
    pubShare: 'Compartir aviso',
    pubLoVi: 'Lo vi',
    pubLoViTambien: 'Yo también lo vi',
    pubLoViQuestion: '¿Dónde y cuándo lo viste?',
    pubLoViSamePlace: 'En el mismo lugar',
    pubLoViSamePlaceSelected: 'Mismo lugar que el aviso',
    pubLoViChange: 'Cambiar',
    pubLoViGpsOk: 'Ubicación GPS capturada',
    pubLoViGpsLoading: 'Obteniendo ubicación…',
    pubLoViGpsBtn: 'Usar mi ubicación GPS',
    pubLoViGpsRetry: 'No se pudo obtener GPS — reintentar',
    pubLoViManual: 'Escribir dirección manual',
    pubLoViConfirmAddr: 'Confirmá o ajustá la dirección',
    pubLoViAddrLabel: 'Calle / zona',
    pubLoViWhen: '¿Cuándo lo viste?',
    pubLoViToday: 'Hoy',
    pubLoViOtherDay: 'Otro día',
    pubLoViTimeLabel: 'Hora aproximada',
    pubLoViSend: 'Enviar aviso',
    pubLoViCancel: 'Cancelar',
    pubLoViSuccessMap: '¡Ubicación actualizada en el mapa!',
    pubLoViSuccessOwner: '¡Aviso enviado al dueño!',
    pubLoViReportAnother: 'Reportar otro avistamiento',
    pubLoViSendError: 'No se pudo enviar. Intentá de nuevo.',
    pubAdoptBtn: 'Quiero adoptarlo',
    pubAdminPanel: 'Panel de administrador',
    pubManagePanel: 'Gestionar mi aviso',
    pubRenovarBuscar: 'Lo sigo buscando',
    pubRenovarEncontrado: 'Sigue sin dueño',
    pubRenovarAdopcion: 'Sigue en adopción',
    pubRenovarDefault: 'Renovar aviso',
    pubRenovarHint: 'Sube el aviso al tope',
    pubRenovarOk: '¡Aviso renovado! Aparece primero en la lista.',
    pubRenovarErr: 'No se pudo renovar el aviso.',
    pubAdminResuelto: 'El dueño lo encontró',
    pubResueltoLost: 'Lo encontré',
    pubResueltoFound: 'El dueño lo reclamó',
    pubResueltoAdopcion: 'Ya fue adoptado',
    pubResueltoDefault: 'Marcar como resuelto',
    pubConfirmResueltoPerdido: '¿Confirmás que lo encontraste? El aviso va a pasar al filtro verde de Vistos.',
    pubConfirmResueltoOther: '¿Confirmás que el aviso se resolvió? Se va a ocultar de la lista.',
    pubConfirmResueltoPerdidoSub: 'Vas a poder marcarlo como "Volvió a casa" desde ahí cuando el dueño lo reclame.',
    pubConfirmResueltoOtherSub: 'El perfil del perro en Mis Perros no se borra.',
    pubConfirm: 'Sí, confirmar',
    pubCancel: 'Cancelar',
    pubDeleteBtn: 'Borrar publicación',
    pubDeleteConfirm: '¿Seguro que querés borrar este aviso? Esta acción no se puede deshacer.',
    pubDeleteConfirmBtn: 'Sí, borrar',
    pubDeleteErr: 'No se pudo borrar el aviso.',
    pubUpdateErr: 'No se pudo actualizar el aviso.',
    pubStatusTitle: 'Estado del aviso',
    pubStatusTipo: 'Tipo',
    pubStatusZona: 'Zona',
    pubStatusPublicado: 'Publicado',
    pubStatusHorario: 'Horario',
    pubStatusEstado: 'Estado',
    pubStatusLocked: 'Solo usuarios registrados',
    pubStatusResuelto: 'Resuelto',
    pubStatusActivo: 'Activo',
    pubWaBtn: 'Contactar por WhatsApp',
    pubReportBtn: 'Reportar este aviso',
    pubReportTitle: 'Reportar aviso',
    pubReportSent: 'Reporte enviado. Gracias.',
    pubReportSending: 'Enviando...',
    pubReportSend: 'Enviar reporte',
    pubReportSpam: 'Spam o publicidad',
    pubReportFalso: 'Contenido falso o engañoso',
    pubReportIncorrecto: 'Información incorrecta',
    pubReportDuplicado: 'Duplicado',
    pubReportOtro: 'Otro',
    // Mi Perfil
    mipChip: 'Mi perfil',
    mipObediencia: 'Obediencia',
    mipSosTitle: '🚨 Perro perdido — alertar ahora',
    mipSosSub: 'Notificá a tus amigos y publicá el aviso de emergencia.',
    mipDatosTitle: 'Datos personales',
    mipEditar: 'Editar',
    mipNombrePlaceholder: 'Nombre',
    mipApellidoPlaceholder: 'Apellido',
    mipTelefonoPlaceholder: 'Teléfono',
    mipCiudadSelect: 'Seleccioná tu ciudad',
    mipProvinciaPlaceholder: 'Provincia',
    mipPaisPlaceholder: 'País',
    mipBioLabel: 'Descripción personal',
    mipBioPlaceholder: 'Contá algo sobre vos: experiencia con perros, disponibilidad, patio…',
    mipInstagramFacebook: 'Instagram y Facebook',
    mipRadioLabel: 'Radio de alertas de perros perdidos',
    mipRadioHint: 'Te avisamos cuando hay un perro perdido en este radio desde tu casa.',
    mipGuardar: 'Guardar cambios',
    mipLabelEmail: 'Email',
    mipLabelNombre: 'Nombre',
    mipLabelTelefono: 'Teléfono',
    mipLabelCiudad: 'Ciudad',
    mipLabelProvincia: 'Provincia',
    mipLabelPais: 'País',
    mipLabelDireccion: 'Dirección',
    mipLabelSobreMi: 'Sobre mí',
    mipLabelRadio: 'Radio alertas',
    mipLabelRedes: 'Redes sociales',
    mipAgregar: '+ Agregar',
    mipLinkEnviado: 'Link enviado',
    mipCambiar: 'Cambiar',
    mipVacunasTitle: 'Próximas vacunas',
    mipPendiente: 'pendiente',
    mipPendientes: 'pendientes',
    mipVacunaVencida: 'Vencida hace',
    mipDias: 'días',
    mipHoy: 'Hoy',
    mipEn: 'En',
    mipVacunaVer: 'Ver →',
    mipAvisosTitle: 'Mis avisos activos',
    mipVerTodos: 'Ver todos →',
    mipAvisosPublicados: 'avisos publicados',
    mipSinLimite: 'Sin límite',
    mipDe5Avisos: '/ 5 avisos',
    mipPasatePro: 'Pasate a Pro',
    mipDisponible: 'disponible',
    mipDisponibles: 'disponibles',
    mipHistorialTitle: 'Historial de avisos resueltos',
    mipSinResueltos: 'Todavía no tenés avisos resueltos.',
    mipSinNombre: 'Sin nombre',
    mipMisPerrosTitle: 'Mis perros',
    mipAgregarDog: 'Agregar',
    mipSinPerros: 'Todavía no registraste ningún perro.',
    mipRegistrarPerro: 'Registrar perro',
    mipSuccessPerfil: 'Perfil actualizado correctamente.',
    mipErrFotoSize: 'La foto debe pesar menos de 5 MB.',
    mipErrFoto: 'Error al subir la foto.',
    mipNotAuth: 'Iniciá sesión para ver tu perfil.',
    mipIrInicio: 'Ir al inicio',
    mipCatPerdido: 'Perdido',
    mipCatEncontrado: 'Visto',
    mipCatAdopcion: 'Adopción',
    mipCatTransito: 'Tránsito',
    mipCatBuscoCuidador: 'Busca cuidador',
    mipCatCuidadorDisp: 'Cuidador',
    mipQrExpires: 'Caduca en',
    mipQrRenews: '· se renueva solo',
    mipQrDiscounts: '🏷️ Mostrá este QR para acceder a descuentos exclusivos de socios Vecindog.',
    mipSosModalTitle: 'Alerta de emergencia',
    mipSosModalSub: 'Se notifica a tus amigos',
    mipSosSinPerros: 'No tenés perros registrados.',
    mipSosRegistrar: 'Registrá uno',
    mipSosSinPerrosSuffix: 'para usar esta función.',
    mipSosCualPerro: '¿Cuál de tus perros se perdió?',
    mipSosSinDesc: 'Sin descripción',
    mipSosEnviando: 'Enviando alerta…',
    mipSosAlertar: 'Alertar a mis amigos',
    mipSosSoloPublicar: 'Solo publicar aviso →',
    mipSosErr: 'No se pudo enviar la alerta. Intentá de nuevo.',
    mipSosEnviado: '¡Alerta enviada!',
    mipSosAmigosPrefix: 'Notificamos a',
    mipSosAmigo: 'amigo',
    mipSosAmigos: 'amigos',
    mipSosAmigosSuffix: 'por notificación y email.',
    mipSosSinAmigos: 'Todavía no tenés amigos en Vecindog. Publicá el aviso para que te ayuden los vecinos.',
    mipSosPublicar: 'Publicar aviso completo →',
    mipLabelContrasena: 'Contraseña',
    // Red Vecindog
    rvnPromoChip: 'Oferta de lanzamiento',
    rvnNetworkChip: 'Red de comercios adheridos',
    rvnHeroSub: 'Sumá tu negocio y aparecé en el mapa donde los vecinos buscan a sus perros — con tu teléfono, horario y dirección siempre visibles.',
    rvnRegisterBtn: 'Registrar mi negocio',
    rvnAdminBtn: 'Agregar comercio (admin)',
    rvnBenef1Title: 'En el mapa',
    rvnBenef1Desc: 'Tu negocio aparece directamente donde los vecinos buscan perros perdidos.',
    rvnBenef2Title: 'Teléfono visible',
    rvnBenef2Desc: 'Los usuarios ven tu número con un click desde el mapa.',
    rvnBenef3Title: 'Horario de atención',
    rvnBenef3Desc: 'Informá tus días y horarios para que lleguen cuando abrís.',
    rvnBenef4Title: 'Dirección exacta',
    rvnBenef4Desc: 'Tu dirección y localidad visibles para toda la comunidad.',
    rvnCatTitle: '9 rubros en la red',
    rvnCatSub: 'Encontrá tu categoría y mostrá tu negocio donde importa.',
    rvnCatSeeMore: 'Ver inscriptos',
    rvnCatVetDesc: 'Atención médica, vacunas y urgencias',
    rvnCatPetShopDesc: 'Alimentos, accesorios y juguetes',
    rvnCatPeluDesc: 'Baño, corte y estética canina',
    rvnCatAdiestrDesc: 'Educación, obediencia y conducta',
    rvnCatPaseadorDesc: 'Paseos diarios y actividad física',
    rvnCatGuarderiaDesc: 'Cuidado diurno y hospedaje canino',
    rvnCatRefugioDesc: 'Adopción responsable y rescate animal',
    rvnCatTiendaDesc: 'Ropa, accesorios y artículos para mascotas',
    rvnCatFarmaciaDesc: 'Medicamentos, antiparasitarios y suplementos',
    rvnPromoSubtitle: 'Oferta de lanzamiento · Cupos limitados',
    rvnCupo: 'cupo',
    rvnCupos: 'cupos',
    rvnDisponible: 'disponible',
    rvnDisponibles: 'disponibles',
    rvnPromoBannerTitle: 'Los primeros 50 comercios por ciudad acceden a una tarifa especial',
    rvnPromoBannerDesc: 'En el marco del lanzamiento de la Red Vecindog, los primeros 50 comercios por ciudad en registrarse contarán con una tarifa promocional durante los primeros 6 meses, con acceso completo a todos los beneficios de la plataforma.',
    rvnPromoMonths: '/mes los primeros 6 meses',
    rvnPromoLuego: 'Luego',
    rvnPricingChip: 'Sin contratos · Sin letras chicas',
    rvnPricingTitle: 'Una sola tarifa, sin sorpresas',
    rvnPricingPromoSub: 'ARS / mes · primeros 6 meses',
    rvnPricingPromoStrike: '/mes tarifa regular',
    rvnPricingRegSub: 'ARS / mes',
    rvnPricingSub: 'Mes a mes. Podés cancelar cuando quieras.',
    rvnJoinBtn: 'Unirme a la red',
    rvnBenefit1: 'Aparecés en el mapa donde los vecinos buscan perros',
    rvnBenefit2: 'Teléfono, dirección y horario siempre visibles',
    rvnBenefit3: 'Clasificado en tu rubro (vet, petshop, peluquería…)',
    rvnBenefit4: 'Audiencia 100% dueños de mascotas activos',
    rvnBenefit5: 'Sin bots — usuarios reales de tu zona',
    rvnBenefit6: 'Activación en menos de 24 horas',
    rvnCtaTitle: '¿Listo para sumarte?',
    rvnCtaSub: 'Completá el formulario, pagá y tu negocio aparece en el mapa en menos de 24 horas.',
    rvnFormTitle: 'Registrar mi negocio',
    rvnFormPhotoLabel: 'Foto del negocio',
    rvnFormPhotoBtn: 'Subir foto del local',
    rvnFormPhotoChange: 'Cambiar foto',
    rvnFormPhotoSize: 'PNG, JPG · Máx. 5 MB',
    rvnFormNameLabel: 'Nombre del negocio',
    rvnFormCatLabel: 'Categoría',
    rvnFormCatSelect: 'Seleccioná una categoría',
    rvnFormDescLabel: 'Descripción breve',
    rvnFormLocLabel: 'Ubicación',
    rvnFormAddrLabel: 'Dirección',
    rvnFormCityLabel: 'Localidad / Ciudad',
    rvnFormHoursLabel: 'Horarios de atención',
    rvnFormDaysLabel: 'Días',
    rvnFormOpen: 'Apertura',
    rvnFormClose: 'Cierre',
    rvnFormPhoneLabel: 'Teléfono',
    rvnFormLinkLabel: 'Link del negocio',
    rvnFormLinkHint: 'Web, Instagram, WhatsApp — adonde van los clicks',
    rvnFormEmailLabel: 'Tu email',
    rvnFormEmailHint: 'Para la confirmación de pago y datos de tu membresía.',
    rvnFormPayNote: 'Serás redirigido a Mercado Pago para abonar. Tu negocio se activa en menos de 24 horas.',
    rvnFormSubmitBtn: 'Ir a pagar con Mercado Pago',
    rvnErrName: 'Ingresá el nombre de tu negocio.',
    rvnErrCat: 'Seleccioná una categoría.',
    rvnErrCity: 'Seleccioná la localidad/ciudad de tu negocio.',
    rvnErrPhone: 'Ingresá un teléfono de contacto.',
    rvnErrAddr: 'Ingresá la dirección de tu negocio.',
    rvnErrEmail: 'Ingresá tu email.',
    rvnErrPhoneDigits: 'El teléfono debe tener al menos 10 dígitos. Ejemplo: +54 9 291 4050210',
    rvnErrPayment: 'Error al procesar el pago.',
    rvnErrConnection: 'Error de conexión. Intentá de nuevo.',
    rvnErrPhoto: 'La imagen debe pesar menos de 5 MB.',
    // Adoptar
    adpBack: 'Volver al inicio',
    adpChip: 'Adopción responsable',
    adpTitle: 'Solicitud de adopción',
    adpSubtitulo: 'Completá el formulario con sinceridad. La información es confidencial y nos ayuda a asegurar el bienestar del perro.',
    adpRequired: 'campo obligatorio',
    adpSi: 'Sí',
    adpNo: 'No',
    adpSec1: 'Tus datos personales',
    adpNombre: 'Nombre y apellido',
    adpDni: 'DNI',
    adpEdad: 'Edad',
    adpEdadHint: '(mín. 18 años)',
    adpTelefono: 'Teléfono / WhatsApp',
    adpEmail: 'Email',
    adpDireccion: 'Dirección',
    adpDireccionHint: 'calle y número',
    adpZona: 'Barrio / zona',
    adpSec2: 'Tu vivienda',
    adpSec2Sub: 'El entorno es clave para el bienestar del perro.',
    adpTipoVivienda: 'Tipo de vivienda',
    adpCasa: 'Casa',
    adpDepto: 'Departamento',
    adpCasaPatio: 'Casa con patio',
    adpOtro: 'Otro',
    adpTenencia: '¿Sos propietario o alquilás?',
    adpPropietario: 'Propietario',
    adpInquilino: 'Inquilino',
    adpPropPermite: '¿El propietario permite mascotas?',
    adpTienePatio: '¿Tenés patio o jardín?',
    adpPatioFechado: '¿Está cercado o vallado?',
    adpSec3: 'Tu grupo familiar',
    adpSec3Sub: 'Necesitamos saber quiénes van a convivir con el perro.',
    adpCantPersonas: '¿Cuántas personas viven en tu hogar?',
    adpCantPersonasHint: 'incluíte vos',
    adpHayNinos: '¿Hay niños en el hogar?',
    adpEdadesNinos: 'Edades de los niños',
    adpEdadesNinosHint: 'ej: 3, 7 y 10 años',
    adpTodosDeAcuerdo: '¿Todos en el hogar están de acuerdo con la adopción?',
    adpAlergias: '¿Algún integrante tiene alergia a los animales?',
    adpSec4: 'Tu experiencia con mascotas',
    adpMascotasActuales: '¿Tenés mascotas actualmente?',
    adpCualesYCuantas: '¿Cuáles y cuántas?',
    adpCualesHint: 'tipo, raza y cantidad',
    adpVacunadasCastradas: '¿Están vacunadas y castradas?',
    adpSiTodas: 'Sí, todas',
    adpAlgunas: 'Algunas',
    adpMascotasAnteriores: '¿Tuviste mascotas anteriormente?',
    adpQuePaso: '¿Qué pasó con ellas?',
    adpHorasSolo: '¿Cuántas horas por día estaría solo el perro?',
    adpMenos2: 'Menos de 2 hs',
    adp2a4: '2 a 4 hs',
    adp4a6: '4 a 6 hs',
    adp6a8: '6 a 8 hs',
    adpMas8: 'Más de 8 hs',
    adpSec5: '¿Qué perro buscás?',
    adpSec5Sub: 'Nos ayuda a encontrar la mejor coincidencia para vos y para el perro.',
    adpTamanoPreferido: 'Tamaño preferido',
    adpChico: 'Chico',
    adpMediano: 'Mediano',
    adpGrande: 'Grande',
    adpSinPref: 'Sin preferencia',
    adpEdadPreferida: 'Edad preferida',
    adpCachorro: 'Cachorro',
    adpJoven: 'Joven',
    adpAdulto: 'Adulto',
    adpMayor: 'Mayor',
    adpPerroEnMente: '¿Tenés algún perro en mente?',
    adpPerroEnMenteHint: 'opcional',
    adpPerroEnMentePh: 'Nombre o descripción del perro que te interesa',
    adpMotivacion: '¿Por qué querés adoptar un perro?',
    adpMotivacionPh: 'Contanos tu motivación, tu estilo de vida, cuánto tiempo le podés dedicar, qué esperás de la convivencia…',
    adpSec6: 'Compromisos',
    adpSec6Sub: 'Para garantizar el bienestar del perro necesitamos que aceptes los siguientes puntos. Todos son obligatorios.',
    adpComp1: 'Me comprometo a proveer atención veterinaria regular: vacunas anuales, desparasitación y controles de salud.',
    adpComp2: 'Acepto que se realice una visita previa al hogar antes de confirmar la adopción.',
    adpComp3: 'Si por alguna razón no puedo conservar al perro, me comprometo a devolverlo a la organización y no darlo a terceros sin aviso previo.',
    adpComp4: 'Me comprometo a esterilizar al perro si aún no lo está, en los plazos recomendados por el veterinario.',
    adpEnviando: 'Enviando…',
    adpEnviar: 'Enviar solicitud de adopción',
    adpSuccessTitle: '¡Solicitud enviada!',
    adpSuccessMsg: 'Recibimos tu solicitud. Te contactaremos a la brevedad. Gracias por querer adoptar de forma responsable.',
    adpVerAdopcion: 'Ver perros en adopción',
    adpErrNombre: 'El nombre completo es obligatorio.',
    adpErrDni: 'El DNI es obligatorio.',
    adpErrEdad: 'La edad es obligatoria.',
    adpErrTelefono: 'El teléfono es obligatorio.',
    adpErrEmail: 'El email es obligatorio.',
    adpErrDireccion: 'La dirección es obligatoria.',
    adpErrZona: 'La zona o barrio es obligatoria.',
    adpErrVivienda: 'Indicá el tipo de vivienda.',
    adpErrTenencia: 'Indicá si sos propietario o inquilino.',
    adpErrPropPermite: 'Indicá si el propietario permite mascotas.',
    adpErrPatio: 'Indicá si tenés patio o jardín.',
    adpErrPatioFechado: 'Indicá si el patio está cercado.',
    adpErrPersonas: 'Indicá cuántas personas viven en tu hogar.',
    adpErrNinos: 'Indicá si hay niños en el hogar.',
    adpErrEdadesNinos: 'Escribí las edades de los niños.',
    adpErrAcuerdo: 'Indicá si todos en el hogar están de acuerdo.',
    adpErrAlergias: 'Indicá si alguien tiene alergia a los animales.',
    adpErrMascotas: 'Indicá si tenés mascotas actualmente.',
    adpErrDetalle: 'Describí tus mascotas actuales.',
    adpErrVacunadas: 'Indicá si tus mascotas están vacunadas y castradas.',
    adpErrAnteriores: 'Indicá si tuviste mascotas anteriormente.',
    adpErrQuePaso: 'Contanos qué pasó con tus mascotas anteriores.',
    adpErrHoras: 'Indicá cuántas horas estaría solo el perro.',
    adpErrTamano: 'Elegí el tamaño preferido.',
    adpErrEdadPref: 'Elegí la edad preferida.',
    adpErrMotivacion: 'Contanos por qué querés adoptar.',
    adpErrCompromisos: 'Debés aceptar todos los compromisos para continuar.',
    adpErrSubmit: 'Error al enviar la solicitud: ',
    // Buscar
    bscBack: 'Volver a los avisos',
    bscChip: 'Buscar por características',
    bscTitle: '¿Cómo era el perro?',
    bscSub: 'Completá lo que sepas. Cuanto más datos, mejores las coincidencias.',
    bscSecCaract: 'Características del perro',
    bscRaza: 'Raza',
    bscRazaHint: 'Si especificás raza, solo aparecen perros de esa raza',
    bscColor: 'Color principal',
    bscColorNoSe: 'No sé / no recuerdo',
    bscTamano: 'Tamaño',
    bscChico: 'Chico',
    bscMediano: 'Mediano',
    bscGrande: 'Grande',
    bscSexo: 'Sexo',
    bscMacho: 'Macho',
    bscHembra: 'Hembra',
    bscNs: 'No sé',
    bscCollar: '¿Tenía collar?',
    bscColorCollar: 'Color del collar',
    bscColorCollarPh: 'Rojo, azul, negro…',
    bscChapita: '¿Tenía chapita / plaquita identificadora?',
    bscSecDonde: 'Dónde y cuándo',
    bscZona: 'Zona / barrio',
    bscFecha: 'Fecha aproximada',
    bscHorario: 'Horario aproximado (±3 hs)',
    bscBuscar: 'Buscar coincidencias',
    bscBuscando: 'Buscando…',
    bscSinCoincidencias: 'Sin coincidencias',
    bscAviso: 'aviso',
    bscAvisos: 'avisos',
    bscEncontradoS: 'encontrado',
    bscEncontradosP: 'encontrados',
    bscNoEncontramos: 'No encontramos avisos que coincidan',
    bscProbaFiltros: 'Probá con menos filtros o revisá todos los avisos.',
    bscVerTodos: 'Ver todos los vistos',
    // Publicar
    pbrBack: 'Volver al inicio',
    pbrGuestTitle: 'Necesitás una cuenta',
    pbrGuestSub: 'Para publicar un aviso tenés que estar registrado. Es gratis y tarda menos de un minuto.',
    pbrGuestBtn: 'Crear cuenta gratis',
    pbrChipPerdido: 'Perro perdido',
    pbrChipEncontrado: 'Vi un perro perdido',
    pbrChipTransito: 'Perro en tránsito',
    pbrChipAdopcion: 'Doy en adopción',
    pbrTitlePerdido: 'Perdí a mi perro',
    pbrTitleEncontrado: 'Vi un perro perdido',
    pbrTitleTransito: 'Perro en tránsito',
    pbrTitleAdopcion: 'Doy en adopción',
    pbrSubPerdido: 'Completá los datos y los vecinos te van a ayudar a encontrarlo.',
    pbrSubEncontrado: 'Cargá los datos del perro que viste para que su familia lo encuentre.',
    pbrSubTransito: 'Indicá si lo tenés vos o si lo viste en la calle, y la comunidad puede ayudar.',
    pbrSubAdopcion: 'Completá la información para encontrarle una familia responsable.',
    pbrPrePerdido: '🔍 Antes de publicar: ¿alguien ya lo encontró?',
    pbrPreEncontrado: '🔍 Antes de publicar: ¿el dueño ya puso un aviso?',
    pbrBuscarCaract: 'Buscar por características',
    pbrBuscarCaractSub: 'Color, tamaño, collar…',
    pbrBuscarFoto: 'Buscar por foto',
    pbrBuscarFotoSub: 'Subí una foto y comparamos',
    pbrSiNoEncontras: 'Si no encontrás nada, completá el formulario de abajo para publicar tu aviso.',
    pbrPrefillPre: 'Reportando a',
    pbrPrefillPost: 'como perdido/a',
    pbrPrefillSub: 'Cargamos los datos del perfil. Revisá y completá si necesitás.',
    pbrStep1: 'Fotos del perro',
    pbrStep1Sub: 'Subí hasta {max} fotos. La primera se usa como imagen principal.',
    pbrFotoPerfilDe: 'Foto del perfil de',
    pbrPrincipal: 'Principal',
    pbrHacerPrincipal: 'Hacer principal',
    pbrStep2Transit: 'Situación del animal',
    pbrStep2TransitSub: 'Contanos cómo encontraste o cómo estás con el perro.',
    pbrLoTengo: '🏠 Lo tengo yo temporalmente',
    pbrLoTengoDesc: 'Lo encontraste y lo cuidás hasta encontrarle dueño',
    pbrLoVi: '🚨 Lo vi en la calle',
    pbrLoViDesc: 'Necesita ayuda pero no pudiste llevártelo',
    pbrFechaLimite: '¿Hasta cuándo lo podés tener? (fecha límite)',
    pbrFechaLimiteSub: 'Aparecerá como cuenta regresiva en tu aviso. Genera urgencia para que alguien lo adopte.',
    pbrHoraVisto: '¿A qué hora lo viste?',
    pbrTransitWarning: '⚠️ Este aviso aparecerá en el mapa en color violeta para que los vecinos cercanos puedan ayudar.',
    pbrStep2DataSub: 'Completá lo que sepas. Más datos = más chances de encontrarlo.',
    pbrStep2DataSubEncontrado: 'Describí el perro que viste para que su familia lo reconozca.',
    pbrStep2DataSubTransito: 'Describí el animal para que alguien lo reconozca o decida ayudar.',
    pbrStep2DataSubAdopcion: 'Contanos cómo es el perro que das en adopción.',
    pbrNombre: 'Nombre (si lo sabés)',
    pbrRaza: 'Raza',
    pbrColor: 'Color principal',
    pbrColorNoSe: 'No sé / no recuerdo',
    pbrTamano: 'Tamaño',
    pbrChico: 'Chico',
    pbrMediano: 'Mediano',
    pbrGrande: 'Grande',
    pbrCollar: '¿Tenía collar?',
    pbrChapita: '¿Tenía chapita / plaquita identificadora?',
    pbrDescripcion: 'Descripción adicional',
    pbrDescripcionPh: 'Marcas especiales, manchas, comportamiento, collar rojo con chapita azul…',
    pbrMatchTitle: '¿Es alguno de estos perros que estaban buscando?',
    pbrMatchNo: 'No, es otro perro',
    pbrMatchMismaZona: '¿Lo viste en la misma zona donde se perdió?',
    pbrMatchOtraZona: 'No, otra zona',
    pbrMatchDondeViste: '¿En qué zona lo viste?',
    pbrMatchHora: '¿A qué hora lo viste? (opcional)',
    pbrMatchConfirm: '✓ Al publicar, el aviso de búsqueda se va a actualizar a la nueva zona.',
    pbrStep3Perdido: '¿Dónde y cuándo se perdió?',
    pbrStep3Encontrado: '¿Dónde y cuándo lo viste?',
    pbrStep3Transito: '¿Dónde está o dónde lo viste?',
    pbrStep3Adopcion: '¿Dónde está el perro?',
    pbrDondePerdio: '¿Dónde se perdió?',
    pbrEnMiCasa: 'En mi casa',
    pbrEnOtroLugar: 'En otro lugar',
    pbrSinDireccion: 'No tenés dirección guardada.',
    pbrAgregarPerfil: 'Agregarla al perfil',
    pbrGpsOk: 'Ubicación GPS capturada',
    pbrGpsCambiar: 'Cambiar',
    pbrGpsCargando: 'Obteniendo ubicación…',
    pbrGpsUsar: 'Usar mi ubicación GPS',
    pbrGpsError: 'No se pudo obtener el GPS — reintentar',
    pbrGpsManual: 'No tengo GPS / prefiero escribir la dirección',
    pbrGpsVolver: '← Volver a usar GPS',
    pbrConfirmDir: 'Confirmá o ajustá la dirección',
    pbrDireccionZona: 'Dirección o zona',
    pbrFecha: 'Fecha',
    pbrHorario: 'Horario aproximado',
    pbrContactoLabel: 'WhatsApp de contacto',
    pbrContactoError: 'Número incompleto — ingresá el número completo con código de área. Ej: +54 9 291 4050210',
    pbrLimiteError: 'Llegaste al límite de 5 publicaciones activas del plan Gratis. Pasate a VecindogPro para publicaciones ilimitadas.',
    pbrPublicando: 'Publicando…',
    pbrPublicar: 'Publicar aviso',
    pbrSi: 'Sí',
    pbrNo: 'No',
    pbrNoSe: 'No sé',
    pbrAgregarFotos: 'Agregar más fotos',
    pbrSubirFotos: 'Subir fotos',
    pbrGaleria: 'Galería',
    pbrSacarFoto: 'Sacar foto',
    pbrSuccessTitle: '¡Aviso publicado!',
    pbrSuccessMsg: 'Tu aviso ya está publicado y los vecinos de {city} pueden verlo.',
    pbrVerAvisos: 'Ver todos los avisos',
    pbrPublicarOtro: 'Publicar otro',
    pbrPostMasPrecision: '¿Querés buscar al perro con más precisión?',
    pbrPostEncontrarDueno: '¿Querés encontrar al dueño más rápido?',
    pbrBuscarFotoProSub: 'Subí una foto y usamos IA',
    pbrSoloPro: 'Solo Pro',
    pbrBuscarCaractTitle: 'Buscar por características',
    pbrBuscarCaractProSub: 'Raza, color, tamaño',
    pbrPorCaract: 'Por características',
    pbrFotoLimit: 'Ya subiste el máximo de {max} fotos.',
    pbrFotoInvalida: 'no es una imagen válida (JPG, PNG o WEBP).',
    pbrFotoPesada: 'pesa {mb} MB.',
    pbrWhatsappError: 'El WhatsApp debe tener al menos 10 dígitos. Ejemplo: +54 9 291 4050210',
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
    // Publicacion detalle
    pubBack: 'Back to listings',
    pubNotFound: 'Post not found',
    pubBackToList: 'Back to listings',
    pubDescripcion: 'Description',
    pubResuelto: 'Resolved',
    pubActivo: 'Active post',
    pubSinNombre: 'Unnamed dog',
    pubShare: 'Share post',
    pubLoVi: 'I saw it',
    pubLoViTambien: 'I saw it too',
    pubLoViQuestion: 'Where and when did you see it?',
    pubLoViSamePlace: 'Same location',
    pubLoViSamePlaceSelected: 'Same place as the post',
    pubLoViChange: 'Change',
    pubLoViGpsOk: 'GPS location captured',
    pubLoViGpsLoading: 'Getting location…',
    pubLoViGpsBtn: 'Use my GPS location',
    pubLoViGpsRetry: 'Could not get GPS — retry',
    pubLoViManual: 'Enter address manually',
    pubLoViConfirmAddr: 'Confirm or adjust address',
    pubLoViAddrLabel: 'Street / area',
    pubLoViWhen: 'When did you see it?',
    pubLoViToday: 'Today',
    pubLoViOtherDay: 'Another day',
    pubLoViTimeLabel: 'Approximate time',
    pubLoViSend: 'Send report',
    pubLoViCancel: 'Cancel',
    pubLoViSuccessMap: 'Location updated on the map!',
    pubLoViSuccessOwner: 'Report sent to the owner!',
    pubLoViReportAnother: 'Report another sighting',
    pubLoViSendError: 'Could not send. Please try again.',
    pubAdoptBtn: 'I want to adopt',
    pubAdminPanel: 'Admin panel',
    pubManagePanel: 'Manage my post',
    pubRenovarBuscar: 'Still looking',
    pubRenovarEncontrado: 'Still no owner',
    pubRenovarAdopcion: 'Still for adoption',
    pubRenovarDefault: 'Renew post',
    pubRenovarHint: 'Moves post to the top',
    pubRenovarOk: 'Post renewed! It now appears first in the list.',
    pubRenovarErr: 'Could not renew the post.',
    pubAdminResuelto: 'Owner reclaimed it',
    pubResueltoLost: 'I found it',
    pubResueltoFound: 'Owner reclaimed it',
    pubResueltoAdopcion: 'Already adopted',
    pubResueltoDefault: 'Mark as resolved',
    pubConfirmResueltoPerdido: 'Confirm that you found it? The post will move to the green Seen filter.',
    pubConfirmResueltoOther: 'Confirm that the post is resolved? It will be hidden from the list.',
    pubConfirmResueltoPerdidoSub: 'You can mark it as "Came home" from there when the owner claims it.',
    pubConfirmResueltoOtherSub: 'The dog profile in My Dogs will not be deleted.',
    pubConfirm: 'Yes, confirm',
    pubCancel: 'Cancel',
    pubDeleteBtn: 'Delete post',
    pubDeleteConfirm: 'Are you sure you want to delete this post? This action cannot be undone.',
    pubDeleteConfirmBtn: 'Yes, delete',
    pubDeleteErr: 'Could not delete the post.',
    pubUpdateErr: 'Could not update the post.',
    pubStatusTitle: 'Post status',
    pubStatusTipo: 'Type',
    pubStatusZona: 'Area',
    pubStatusPublicado: 'Published',
    pubStatusHorario: 'Time',
    pubStatusEstado: 'Status',
    pubStatusLocked: 'Registered users only',
    pubStatusResuelto: 'Resolved',
    pubStatusActivo: 'Active',
    pubWaBtn: 'Contact via WhatsApp',
    pubReportBtn: 'Report this post',
    pubReportTitle: 'Report post',
    pubReportSent: 'Report sent. Thank you.',
    pubReportSending: 'Sending...',
    pubReportSend: 'Send report',
    pubReportSpam: 'Spam or advertising',
    pubReportFalso: 'False or misleading content',
    pubReportIncorrecto: 'Incorrect information',
    pubReportDuplicado: 'Duplicate',
    pubReportOtro: 'Other',
    // Mi Perfil
    mipChip: 'My profile',
    mipObediencia: 'Obedience',
    mipSosTitle: '🚨 Lost dog — alert now',
    mipSosSub: 'Notify your friends and post the emergency listing.',
    mipDatosTitle: 'Personal details',
    mipEditar: 'Edit',
    mipNombrePlaceholder: 'First name',
    mipApellidoPlaceholder: 'Last name',
    mipTelefonoPlaceholder: 'Phone',
    mipCiudadSelect: 'Select your city',
    mipProvinciaPlaceholder: 'Province',
    mipPaisPlaceholder: 'Country',
    mipBioLabel: 'Personal description',
    mipBioPlaceholder: 'Tell us about yourself: experience with dogs, availability, yard…',
    mipInstagramFacebook: 'Instagram and Facebook',
    mipRadioLabel: 'Lost dog alert radius',
    mipRadioHint: 'We notify you when there is a lost dog within this radius from your home.',
    mipGuardar: 'Save changes',
    mipLabelEmail: 'Email',
    mipLabelNombre: 'Name',
    mipLabelTelefono: 'Phone',
    mipLabelCiudad: 'City',
    mipLabelProvincia: 'Province',
    mipLabelPais: 'Country',
    mipLabelDireccion: 'Address',
    mipLabelSobreMi: 'About me',
    mipLabelRadio: 'Alert radius',
    mipLabelRedes: 'Social media',
    mipAgregar: '+ Add',
    mipLinkEnviado: 'Link sent',
    mipCambiar: 'Change',
    mipVacunasTitle: 'Upcoming vaccines',
    mipPendiente: 'pending',
    mipPendientes: 'pending',
    mipVacunaVencida: 'Overdue by',
    mipDias: 'days',
    mipHoy: 'Today',
    mipEn: 'In',
    mipVacunaVer: 'View →',
    mipAvisosTitle: 'My active listings',
    mipVerTodos: 'See all →',
    mipAvisosPublicados: 'listings posted',
    mipSinLimite: 'No limit',
    mipDe5Avisos: '/ 5 listings',
    mipPasatePro: 'Go Pro',
    mipDisponible: 'available',
    mipDisponibles: 'available',
    mipHistorialTitle: 'Resolved listings history',
    mipSinResueltos: 'No resolved listings yet.',
    mipSinNombre: 'Unnamed',
    mipMisPerrosTitle: 'My dogs',
    mipAgregarDog: 'Add',
    mipSinPerros: "You haven't registered any dogs yet.",
    mipRegistrarPerro: 'Register dog',
    mipSuccessPerfil: 'Profile updated successfully.',
    mipErrFotoSize: 'Photo must be smaller than 5 MB.',
    mipErrFoto: 'Error uploading photo.',
    mipNotAuth: 'Sign in to view your profile.',
    mipIrInicio: 'Go to home',
    mipCatPerdido: 'Lost',
    mipCatEncontrado: 'Seen',
    mipCatAdopcion: 'Adoption',
    mipCatTransito: 'Transit',
    mipCatBuscoCuidador: 'Needs carer',
    mipCatCuidadorDisp: 'Carer',
    mipQrExpires: 'Expires in',
    mipQrRenews: '· renews automatically',
    mipQrDiscounts: '🏷️ Show this QR to access exclusive discounts for Vecindog members.',
    mipSosModalTitle: 'Emergency alert',
    mipSosModalSub: 'Your friends will be notified',
    mipSosSinPerros: 'No registered dogs.',
    mipSosRegistrar: 'Register one',
    mipSosSinPerrosSuffix: 'to use this feature.',
    mipSosCualPerro: 'Which of your dogs is lost?',
    mipSosSinDesc: 'No description',
    mipSosEnviando: 'Sending alert…',
    mipSosAlertar: 'Alert my friends',
    mipSosSoloPublicar: 'Just post listing →',
    mipSosErr: 'Could not send the alert. Please try again.',
    mipSosEnviado: 'Alert sent!',
    mipSosAmigosPrefix: 'We notified',
    mipSosAmigo: 'friend',
    mipSosAmigos: 'friends',
    mipSosAmigosSuffix: 'by notification and email.',
    mipSosSinAmigos: 'You have no friends on Vecindog yet. Post the listing so neighbors can help.',
    mipSosPublicar: 'Post full listing →',
    mipLabelContrasena: 'Password',
    // Red Vecindog
    rvnPromoChip: 'Launch offer',
    rvnNetworkChip: 'Business network',
    rvnHeroSub: 'Add your business and appear on the map where neighbours search for their dogs — with your phone, hours and address always visible.',
    rvnRegisterBtn: 'Register my business',
    rvnAdminBtn: 'Add business (admin)',
    rvnBenef1Title: 'On the map',
    rvnBenef1Desc: 'Your business appears directly where neighbours search for lost dogs.',
    rvnBenef2Title: 'Visible phone',
    rvnBenef2Desc: 'Users see your number with one click from the map.',
    rvnBenef3Title: 'Opening hours',
    rvnBenef3Desc: 'Share your days and hours so people arrive when you are open.',
    rvnBenef4Title: 'Exact address',
    rvnBenef4Desc: 'Your address and city visible to the whole community.',
    rvnCatTitle: '9 categories in the network',
    rvnCatSub: 'Find your category and show your business where it matters.',
    rvnCatSeeMore: 'See members',
    rvnCatVetDesc: 'Medical care, vaccines and emergencies',
    rvnCatPetShopDesc: 'Food, accessories and toys',
    rvnCatPeluDesc: 'Bath, grooming and canine aesthetics',
    rvnCatAdiestrDesc: 'Education, obedience and behaviour',
    rvnCatPaseadorDesc: 'Daily walks and physical activity',
    rvnCatGuarderiaDesc: 'Day care and canine boarding',
    rvnCatRefugioDesc: 'Responsible adoption and animal rescue',
    rvnCatTiendaDesc: 'Clothing, accessories and pet supplies',
    rvnCatFarmaciaDesc: 'Medicines, antiparasitics and supplements',
    rvnPromoSubtitle: 'Launch offer · Limited spots',
    rvnCupo: 'spot',
    rvnCupos: 'spots',
    rvnDisponible: 'available',
    rvnDisponibles: 'available',
    rvnPromoBannerTitle: 'The first 50 businesses per city get a special rate',
    rvnPromoBannerDesc: 'As part of the Red Vecindog launch, the first 50 businesses per city to register will get a promotional rate for the first 6 months, with full access to all platform benefits.',
    rvnPromoMonths: '/month for the first 6 months',
    rvnPromoLuego: 'Then',
    rvnPricingChip: 'No contracts · No fine print',
    rvnPricingTitle: 'One flat rate, no surprises',
    rvnPricingPromoSub: 'ARS / month · first 6 months',
    rvnPricingPromoStrike: '/month standard rate',
    rvnPricingRegSub: 'ARS / month',
    rvnPricingSub: 'Month to month. Cancel any time.',
    rvnJoinBtn: 'Join the network',
    rvnBenefit1: 'You appear on the map where neighbours look for dogs',
    rvnBenefit2: 'Phone, address and hours always visible',
    rvnBenefit3: 'Listed in your category (vet, pet shop, groomer…)',
    rvnBenefit4: '100% active pet owner audience',
    rvnBenefit5: 'No bots — real users from your area',
    rvnBenefit6: 'Activation in less than 24 hours',
    rvnCtaTitle: 'Ready to join?',
    rvnCtaSub: 'Fill in the form, pay and your business appears on the map in less than 24 hours.',
    rvnFormTitle: 'Register my business',
    rvnFormPhotoLabel: 'Business photo',
    rvnFormPhotoBtn: 'Upload shop photo',
    rvnFormPhotoChange: 'Change photo',
    rvnFormPhotoSize: 'PNG, JPG · Max. 5 MB',
    rvnFormNameLabel: 'Business name',
    rvnFormCatLabel: 'Category',
    rvnFormCatSelect: 'Select a category',
    rvnFormDescLabel: 'Brief description',
    rvnFormLocLabel: 'Location',
    rvnFormAddrLabel: 'Address',
    rvnFormCityLabel: 'City / Town',
    rvnFormHoursLabel: 'Opening hours',
    rvnFormDaysLabel: 'Days',
    rvnFormOpen: 'Opens',
    rvnFormClose: 'Closes',
    rvnFormPhoneLabel: 'Phone',
    rvnFormLinkLabel: 'Business link',
    rvnFormLinkHint: 'Website, Instagram, WhatsApp — where clicks go',
    rvnFormEmailLabel: 'Your email',
    rvnFormEmailHint: 'For payment confirmation and membership details.',
    rvnFormPayNote: 'You will be redirected to Mercado Pago to pay. Your business activates in less than 24 hours.',
    rvnFormSubmitBtn: 'Pay with Mercado Pago',
    rvnErrName: 'Enter your business name.',
    rvnErrCat: 'Select a category.',
    rvnErrCity: 'Select your business city.',
    rvnErrPhone: 'Enter a contact phone number.',
    rvnErrAddr: 'Enter your business address.',
    rvnErrEmail: 'Enter your email.',
    rvnErrPhoneDigits: 'Phone must have at least 10 digits. Example: +54 9 291 4050210',
    rvnErrPayment: 'Error processing payment.',
    rvnErrConnection: 'Connection error. Please try again.',
    rvnErrPhoto: 'Image must be smaller than 5 MB.',
    // Adoptar
    adpBack: 'Back to home',
    adpChip: 'Responsible adoption',
    adpTitle: 'Adoption request',
    adpSubtitulo: "Fill out the form honestly. The information is confidential and helps us ensure the dog's wellbeing.",
    adpRequired: 'required field',
    adpSi: 'Yes',
    adpNo: 'No',
    adpSec1: 'Your personal data',
    adpNombre: 'Full name',
    adpDni: 'ID number',
    adpEdad: 'Age',
    adpEdadHint: '(min. 18 years)',
    adpTelefono: 'Phone / WhatsApp',
    adpEmail: 'Email',
    adpDireccion: 'Address',
    adpDireccionHint: 'street and number',
    adpZona: 'Neighborhood / area',
    adpSec2: 'Your home',
    adpSec2Sub: "The environment is key to the dog's wellbeing.",
    adpTipoVivienda: 'Type of housing',
    adpCasa: 'House',
    adpDepto: 'Apartment',
    adpCasaPatio: 'House with yard',
    adpOtro: 'Other',
    adpTenencia: 'Do you own or rent?',
    adpPropietario: 'Owner',
    adpInquilino: 'Tenant',
    adpPropPermite: 'Does the landlord allow pets?',
    adpTienePatio: 'Do you have a yard or garden?',
    adpPatioFechado: 'Is it fenced?',
    adpSec3: 'Your household',
    adpSec3Sub: 'We need to know who will live with the dog.',
    adpCantPersonas: 'How many people live in your home?',
    adpCantPersonasHint: 'include yourself',
    adpHayNinos: 'Are there children at home?',
    adpEdadesNinos: "Children's ages",
    adpEdadesNinosHint: 'e.g.: 3, 7 and 10',
    adpTodosDeAcuerdo: 'Is everyone at home okay with the adoption?',
    adpAlergias: 'Does anyone have animal allergies?',
    adpSec4: 'Your experience with pets',
    adpMascotasActuales: 'Do you currently have pets?',
    adpCualesYCuantas: 'Which and how many?',
    adpCualesHint: 'type, breed and amount',
    adpVacunadasCastradas: 'Are they vaccinated and neutered?',
    adpSiTodas: 'Yes, all',
    adpAlgunas: 'Some',
    adpMascotasAnteriores: 'Have you had pets before?',
    adpQuePaso: 'What happened to them?',
    adpHorasSolo: 'How many hours a day would the dog be alone?',
    adpMenos2: 'Less than 2 h',
    adp2a4: '2 to 4 h',
    adp4a6: '4 to 6 h',
    adp6a8: '6 to 8 h',
    adpMas8: 'More than 8 h',
    adpSec5: 'What dog are you looking for?',
    adpSec5Sub: 'Helps us find the best match for you and the dog.',
    adpTamanoPreferido: 'Preferred size',
    adpChico: 'Small',
    adpMediano: 'Medium',
    adpGrande: 'Large',
    adpSinPref: 'No preference',
    adpEdadPreferida: 'Preferred age',
    adpCachorro: 'Puppy',
    adpJoven: 'Young',
    adpAdulto: 'Adult',
    adpMayor: 'Senior',
    adpPerroEnMente: 'Do you have a specific dog in mind?',
    adpPerroEnMenteHint: 'optional',
    adpPerroEnMentePh: 'Name or description of the dog you are interested in',
    adpMotivacion: 'Why do you want to adopt a dog?',
    adpMotivacionPh: "Tell us your motivation, lifestyle, how much time you can dedicate, what you expect from living together…",
    adpSec6: 'Commitments',
    adpSec6Sub: "To guarantee the dog's wellbeing, you must accept the following points. All are mandatory.",
    adpComp1: 'I commit to providing regular veterinary care: annual vaccines, deworming and health checkups.',
    adpComp2: 'I accept that a home visit will be conducted before confirming the adoption.',
    adpComp3: "If for any reason I can't keep the dog, I commit to returning it to the organization and not giving it to third parties without prior notice.",
    adpComp4: 'I commit to neutering the dog if not already done, within the timeframe recommended by the vet.',
    adpEnviando: 'Sending…',
    adpEnviar: 'Send adoption request',
    adpSuccessTitle: 'Request sent!',
    adpSuccessMsg: 'We received your request. We will contact you shortly. Thank you for wanting to adopt responsibly.',
    adpVerAdopcion: 'View dogs for adoption',
    adpErrNombre: 'Full name is required.',
    adpErrDni: 'ID number is required.',
    adpErrEdad: 'Age is required.',
    adpErrTelefono: 'Phone is required.',
    adpErrEmail: 'Email is required.',
    adpErrDireccion: 'Address is required.',
    adpErrZona: 'Neighborhood is required.',
    adpErrVivienda: 'Indicate the type of housing.',
    adpErrTenencia: 'Indicate if you own or rent.',
    adpErrPropPermite: 'Indicate if the landlord allows pets.',
    adpErrPatio: 'Indicate if you have a yard.',
    adpErrPatioFechado: 'Indicate if the yard is fenced.',
    adpErrPersonas: 'Indicate how many people live in your home.',
    adpErrNinos: 'Indicate if there are children at home.',
    adpErrEdadesNinos: "Write the children's ages.",
    adpErrAcuerdo: 'Indicate if everyone at home agrees.',
    adpErrAlergias: 'Indicate if anyone has animal allergies.',
    adpErrMascotas: 'Indicate if you currently have pets.',
    adpErrDetalle: 'Describe your current pets.',
    adpErrVacunadas: 'Indicate if your pets are vaccinated and neutered.',
    adpErrAnteriores: 'Indicate if you have had pets before.',
    adpErrQuePaso: 'Tell us what happened to your previous pets.',
    adpErrHoras: 'Indicate how many hours the dog would be alone.',
    adpErrTamano: 'Choose the preferred size.',
    adpErrEdadPref: 'Choose the preferred age.',
    adpErrMotivacion: 'Tell us why you want to adopt.',
    adpErrCompromisos: 'You must accept all commitments to continue.',
    adpErrSubmit: 'Error sending the request: ',
    // Buscar
    bscBack: 'Back to notices',
    bscChip: 'Search by characteristics',
    bscTitle: 'What did the dog look like?',
    bscSub: 'Fill in what you know. The more details, the better the matches.',
    bscSecCaract: 'Dog characteristics',
    bscRaza: 'Breed',
    bscRazaHint: 'If you specify a breed, only dogs of that breed appear',
    bscColor: 'Main color',
    bscColorNoSe: "Don't know / don't remember",
    bscTamano: 'Size',
    bscChico: 'Small',
    bscMediano: 'Medium',
    bscGrande: 'Large',
    bscSexo: 'Sex',
    bscMacho: 'Male',
    bscHembra: 'Female',
    bscNs: "Don't know",
    bscCollar: 'Did it have a collar?',
    bscColorCollar: 'Collar color',
    bscColorCollarPh: 'Red, blue, black…',
    bscChapita: 'Did it have an ID tag?',
    bscSecDonde: 'Where and when',
    bscZona: 'Area / neighborhood',
    bscFecha: 'Approximate date',
    bscHorario: 'Approximate time (±3 h)',
    bscBuscar: 'Search matches',
    bscBuscando: 'Searching…',
    bscSinCoincidencias: 'No matches',
    bscAviso: 'notice',
    bscAvisos: 'notices',
    bscEncontradoS: 'found',
    bscEncontradosP: 'found',
    bscNoEncontramos: 'No matching notices found',
    bscProbaFiltros: 'Try with fewer filters or view all notices.',
    bscVerTodos: 'View all found',
    // Publicar
    pbrBack: 'Back to home',
    pbrGuestTitle: 'You need an account',
    pbrGuestSub: 'To post a notice you need to be registered. It is free and takes less than a minute.',
    pbrGuestBtn: 'Create free account',
    pbrChipPerdido: 'Lost dog',
    pbrChipEncontrado: 'I saw a lost dog',
    pbrChipTransito: 'Dog in transit',
    pbrChipAdopcion: 'Giving for adoption',
    pbrTitlePerdido: 'I lost my dog',
    pbrTitleEncontrado: 'I saw a lost dog',
    pbrTitleTransito: 'Dog in transit',
    pbrTitleAdopcion: 'Giving for adoption',
    pbrSubPerdido: 'Fill in the details and neighbors will help you find it.',
    pbrSubEncontrado: 'Enter the details of the dog you saw so its family can find it.',
    pbrSubTransito: 'Indicate if you have it or saw it on the street, and the community can help.',
    pbrSubAdopcion: 'Fill in the information to find it a responsible family.',
    pbrPrePerdido: '🔍 Before posting: did someone already find it?',
    pbrPreEncontrado: '🔍 Before posting: did the owner already post a notice?',
    pbrBuscarCaract: 'Search by characteristics',
    pbrBuscarCaractSub: 'Color, size, collar…',
    pbrBuscarFoto: 'Search by photo',
    pbrBuscarFotoSub: 'Upload a photo and we compare',
    pbrSiNoEncontras: "If you don't find anything, fill in the form below to post your notice.",
    pbrPrefillPre: 'Reporting',
    pbrPrefillPost: 'as lost',
    pbrPrefillSub: 'We loaded the profile data. Review and complete if needed.',
    pbrStep1: 'Dog photos',
    pbrStep1Sub: 'Upload up to {max} photos. The first is used as the main image.',
    pbrFotoPerfilDe: 'Profile photo of',
    pbrPrincipal: 'Main',
    pbrHacerPrincipal: 'Make main',
    pbrStep2Transit: 'Animal situation',
    pbrStep2TransitSub: 'Tell us how you found or how you are with the dog.',
    pbrLoTengo: '🏠 I have it temporarily',
    pbrLoTengoDesc: 'You found it and are caring for it until an owner is found',
    pbrLoVi: '🚨 I saw it on the street',
    pbrLoViDesc: "It needs help but you couldn't take it",
    pbrFechaLimite: 'Until when can you keep it? (deadline)',
    pbrFechaLimiteSub: 'Will appear as a countdown on your notice. Creates urgency for someone to adopt it.',
    pbrHoraVisto: 'What time did you see it?',
    pbrTransitWarning: '⚠️ This notice will appear on the map in purple so nearby neighbors can help.',
    pbrStep2DataSub: 'Fill in what you know. More data = more chances of finding it.',
    pbrStep2DataSubEncontrado: 'Describe the dog you saw so its family can recognize it.',
    pbrStep2DataSubTransito: 'Describe the animal so someone can recognize it or decide to help.',
    pbrStep2DataSubAdopcion: 'Tell us about the dog you are giving for adoption.',
    pbrNombre: 'Name (if you know it)',
    pbrRaza: 'Breed',
    pbrColor: 'Main color',
    pbrColorNoSe: "Don't know / don't remember",
    pbrTamano: 'Size',
    pbrChico: 'Small',
    pbrMediano: 'Medium',
    pbrGrande: 'Large',
    pbrCollar: 'Did it have a collar?',
    pbrChapita: 'Did it have an ID tag?',
    pbrDescripcion: 'Additional description',
    pbrDescripcionPh: 'Special marks, spots, behavior, red collar with blue tag…',
    pbrMatchTitle: 'Is it one of these dogs that were being searched for?',
    pbrMatchNo: 'No, it is another dog',
    pbrMatchMismaZona: 'Did you see it in the same area where it was lost?',
    pbrMatchOtraZona: 'No, different area',
    pbrMatchDondeViste: 'In which area did you see it?',
    pbrMatchHora: 'What time did you see it? (optional)',
    pbrMatchConfirm: '✓ When posting, the search notice will be updated to the new area.',
    pbrStep3Perdido: 'Where and when was it lost?',
    pbrStep3Encontrado: 'Where and when did you see it?',
    pbrStep3Transito: 'Where is it or where did you see it?',
    pbrStep3Adopcion: 'Where is the dog?',
    pbrDondePerdio: 'Where was it lost?',
    pbrEnMiCasa: 'At my home',
    pbrEnOtroLugar: 'Somewhere else',
    pbrSinDireccion: "You don't have a saved address.",
    pbrAgregarPerfil: 'Add it to profile',
    pbrGpsOk: 'GPS location captured',
    pbrGpsCambiar: 'Change',
    pbrGpsCargando: 'Getting location…',
    pbrGpsUsar: 'Use my GPS location',
    pbrGpsError: 'Could not get GPS — retry',
    pbrGpsManual: 'No GPS / prefer to type the address',
    pbrGpsVolver: '← Back to GPS',
    pbrConfirmDir: 'Confirm or adjust the address',
    pbrDireccionZona: 'Address or area',
    pbrFecha: 'Date',
    pbrHorario: 'Approximate time',
    pbrContactoLabel: 'Contact WhatsApp',
    pbrContactoError: 'Incomplete number — enter the full number with area code. E.g.: +54 9 291 4050210',
    pbrLimiteError: 'You reached the limit of 5 active notices on the Free plan. Upgrade to VecindogPro for unlimited notices.',
    pbrPublicando: 'Publishing…',
    pbrPublicar: 'Post notice',
    pbrSi: 'Yes',
    pbrNo: 'No',
    pbrNoSe: "Don't know",
    pbrAgregarFotos: 'Add more photos',
    pbrSubirFotos: 'Upload photos',
    pbrGaleria: 'Gallery',
    pbrSacarFoto: 'Take photo',
    pbrSuccessTitle: 'Notice posted!',
    pbrSuccessMsg: 'Your notice is now published and neighbors in {city} can see it.',
    pbrVerAvisos: 'View all notices',
    pbrPublicarOtro: 'Post another',
    pbrPostMasPrecision: 'Do you want to search for the dog more precisely?',
    pbrPostEncontrarDueno: 'Do you want to find the owner faster?',
    pbrBuscarFotoProSub: 'Upload a photo and we use AI',
    pbrSoloPro: 'Pro only',
    pbrBuscarCaractTitle: 'Search by characteristics',
    pbrBuscarCaractProSub: 'Breed, color, size',
    pbrPorCaract: 'By characteristics',
    pbrFotoLimit: 'You already uploaded the maximum of {max} photos.',
    pbrFotoInvalida: 'is not a valid image (JPG, PNG or WEBP).',
    pbrFotoPesada: 'weighs {mb} MB.',
    pbrWhatsappError: 'WhatsApp must have at least 10 digits. Example: +54 9 291 4050210',
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
    // Publicacion detalle
    pubBack: 'Voltar aos avisos',
    pubNotFound: 'Aviso não encontrado',
    pubBackToList: 'Voltar aos avisos',
    pubDescripcion: 'Descrição',
    pubResuelto: 'Resolvido',
    pubActivo: 'Aviso ativo',
    pubSinNombre: 'Cão sem nome',
    pubShare: 'Compartilhar aviso',
    pubLoVi: 'Eu vi',
    pubLoViTambien: 'Eu também vi',
    pubLoViQuestion: 'Onde e quando você o viu?',
    pubLoViSamePlace: 'Mesmo local',
    pubLoViSamePlaceSelected: 'Mesmo lugar do aviso',
    pubLoViChange: 'Alterar',
    pubLoViGpsOk: 'Localização GPS capturada',
    pubLoViGpsLoading: 'Obtendo localização…',
    pubLoViGpsBtn: 'Usar minha localização GPS',
    pubLoViGpsRetry: 'Não foi possível obter GPS — tentar novamente',
    pubLoViManual: 'Digitar endereço manualmente',
    pubLoViConfirmAddr: 'Confirme ou ajuste o endereço',
    pubLoViAddrLabel: 'Rua / bairro',
    pubLoViWhen: 'Quando você o viu?',
    pubLoViToday: 'Hoje',
    pubLoViOtherDay: 'Outro dia',
    pubLoViTimeLabel: 'Horário aproximado',
    pubLoViSend: 'Enviar aviso',
    pubLoViCancel: 'Cancelar',
    pubLoViSuccessMap: 'Localização atualizada no mapa!',
    pubLoViSuccessOwner: 'Aviso enviado ao dono!',
    pubLoViReportAnother: 'Reportar outro avistamento',
    pubLoViSendError: 'Não foi possível enviar. Tente novamente.',
    pubAdoptBtn: 'Quero adotar',
    pubAdminPanel: 'Painel de administrador',
    pubManagePanel: 'Gerenciar meu aviso',
    pubRenovarBuscar: 'Ainda procurando',
    pubRenovarEncontrado: 'Ainda sem dono',
    pubRenovarAdopcion: 'Ainda para adoção',
    pubRenovarDefault: 'Renovar aviso',
    pubRenovarHint: 'Coloca o aviso no topo',
    pubRenovarOk: 'Aviso renovado! Aparece primeiro na lista.',
    pubRenovarErr: 'Não foi possível renovar o aviso.',
    pubAdminResuelto: 'Dono o reclamou',
    pubResueltoLost: 'Eu o encontrei',
    pubResueltoFound: 'Dono o reclamou',
    pubResueltoAdopcion: 'Já foi adotado',
    pubResueltoDefault: 'Marcar como resolvido',
    pubConfirmResueltoPerdido: 'Confirma que o encontrou? O aviso passará para o filtro verde de Vistos.',
    pubConfirmResueltoOther: 'Confirma que o aviso foi resolvido? Será ocultado da lista.',
    pubConfirmResueltoPerdidoSub: 'Você poderá marcá-lo como "Voltou para casa" quando o dono o reclamar.',
    pubConfirmResueltoOtherSub: 'O perfil do cão em Meus Cães não será excluído.',
    pubConfirm: 'Sim, confirmar',
    pubCancel: 'Cancelar',
    pubDeleteBtn: 'Excluir publicação',
    pubDeleteConfirm: 'Tem certeza que deseja excluir este aviso? Esta ação não pode ser desfeita.',
    pubDeleteConfirmBtn: 'Sim, excluir',
    pubDeleteErr: 'Não foi possível excluir o aviso.',
    pubUpdateErr: 'Não foi possível atualizar o aviso.',
    pubStatusTitle: 'Status do aviso',
    pubStatusTipo: 'Tipo',
    pubStatusZona: 'Área',
    pubStatusPublicado: 'Publicado',
    pubStatusHorario: 'Horário',
    pubStatusEstado: 'Status',
    pubStatusLocked: 'Apenas usuários registrados',
    pubStatusResuelto: 'Resolvido',
    pubStatusActivo: 'Ativo',
    pubWaBtn: 'Contatar via WhatsApp',
    pubReportBtn: 'Reportar este aviso',
    pubReportTitle: 'Reportar aviso',
    pubReportSent: 'Reporte enviado. Obrigado.',
    pubReportSending: 'Enviando...',
    pubReportSend: 'Enviar reporte',
    pubReportSpam: 'Spam ou publicidade',
    pubReportFalso: 'Conteúdo falso ou enganoso',
    pubReportIncorrecto: 'Informação incorreta',
    pubReportDuplicado: 'Duplicado',
    pubReportOtro: 'Outro',
    // Mi Perfil
    mipChip: 'Meu perfil',
    mipObediencia: 'Obediência',
    mipSosTitle: '🚨 Cão perdido — alertar agora',
    mipSosSub: 'Notifique seus amigos e publique o aviso de emergência.',
    mipDatosTitle: 'Dados pessoais',
    mipEditar: 'Editar',
    mipNombrePlaceholder: 'Nome',
    mipApellidoPlaceholder: 'Sobrenome',
    mipTelefonoPlaceholder: 'Telefone',
    mipCiudadSelect: 'Selecione sua cidade',
    mipProvinciaPlaceholder: 'Província',
    mipPaisPlaceholder: 'País',
    mipBioLabel: 'Descrição pessoal',
    mipBioPlaceholder: 'Conte algo sobre você: experiência com cães, disponibilidade, quintal…',
    mipInstagramFacebook: 'Instagram e Facebook',
    mipRadioLabel: 'Raio de alertas de cães perdidos',
    mipRadioHint: 'Avisamos quando há um cão perdido neste raio da sua casa.',
    mipGuardar: 'Salvar alterações',
    mipLabelEmail: 'Email',
    mipLabelNombre: 'Nome',
    mipLabelTelefono: 'Telefone',
    mipLabelCiudad: 'Cidade',
    mipLabelProvincia: 'Província',
    mipLabelPais: 'País',
    mipLabelDireccion: 'Endereço',
    mipLabelSobreMi: 'Sobre mim',
    mipLabelRadio: 'Raio de alertas',
    mipLabelRedes: 'Redes sociais',
    mipAgregar: '+ Adicionar',
    mipLinkEnviado: 'Link enviado',
    mipCambiar: 'Alterar',
    mipVacunasTitle: 'Próximas vacinas',
    mipPendiente: 'pendente',
    mipPendientes: 'pendentes',
    mipVacunaVencida: 'Vencida há',
    mipDias: 'dias',
    mipHoy: 'Hoje',
    mipEn: 'Em',
    mipVacunaVer: 'Ver →',
    mipAvisosTitle: 'Meus avisos ativos',
    mipVerTodos: 'Ver todos →',
    mipAvisosPublicados: 'avisos publicados',
    mipSinLimite: 'Sem limite',
    mipDe5Avisos: '/ 5 avisos',
    mipPasatePro: 'Ir para Pro',
    mipDisponible: 'disponível',
    mipDisponibles: 'disponíveis',
    mipHistorialTitle: 'Histórico de avisos resolvidos',
    mipSinResueltos: 'Ainda não há avisos resolvidos.',
    mipSinNombre: 'Sem nome',
    mipMisPerrosTitle: 'Meus cães',
    mipAgregarDog: 'Adicionar',
    mipSinPerros: 'Você ainda não registrou nenhum cão.',
    mipRegistrarPerro: 'Registrar cão',
    mipSuccessPerfil: 'Perfil atualizado com sucesso.',
    mipErrFotoSize: 'A foto deve ter menos de 5 MB.',
    mipErrFoto: 'Erro ao enviar a foto.',
    mipNotAuth: 'Faça login para ver seu perfil.',
    mipIrInicio: 'Ir ao início',
    mipCatPerdido: 'Perdido',
    mipCatEncontrado: 'Visto',
    mipCatAdopcion: 'Adoção',
    mipCatTransito: 'Trânsito',
    mipCatBuscoCuidador: 'Busca cuidador',
    mipCatCuidadorDisp: 'Cuidador',
    mipQrExpires: 'Expira em',
    mipQrRenews: '· renova automaticamente',
    mipQrDiscounts: '🏷️ Mostre este QR para acessar descontos exclusivos de membros Vecindog.',
    mipSosModalTitle: 'Alerta de emergência',
    mipSosModalSub: 'Seus amigos serão notificados',
    mipSosSinPerros: 'Nenhum cão registrado.',
    mipSosRegistrar: 'Registre um',
    mipSosSinPerrosSuffix: 'para usar esta função.',
    mipSosCualPerro: 'Qual dos seus cães se perdeu?',
    mipSosSinDesc: 'Sem descrição',
    mipSosEnviando: 'Enviando alerta…',
    mipSosAlertar: 'Alertar meus amigos',
    mipSosSoloPublicar: 'Só publicar aviso →',
    mipSosErr: 'Não foi possível enviar o alerta. Tente novamente.',
    mipSosEnviado: 'Alerta enviado!',
    mipSosAmigosPrefix: 'Notificamos',
    mipSosAmigo: 'amigo',
    mipSosAmigos: 'amigos',
    mipSosAmigosSuffix: 'por notificação e email.',
    mipSosSinAmigos: 'Você ainda não tem amigos no Vecindog. Publique o aviso para que os vizinhos possam ajudar.',
    mipSosPublicar: 'Publicar aviso completo →',
    mipLabelContrasena: 'Senha',
    // Red Vecindog
    rvnPromoChip: 'Oferta de lançamento',
    rvnNetworkChip: 'Rede de negócios',
    rvnHeroSub: 'Adicione seu negócio e apareça no mapa onde os vizinhos buscam seus cães — com telefone, horário e endereço sempre visíveis.',
    rvnRegisterBtn: 'Registrar meu negócio',
    rvnAdminBtn: 'Adicionar negócio (admin)',
    rvnBenef1Title: 'No mapa',
    rvnBenef1Desc: 'Seu negócio aparece diretamente onde os vizinhos buscam cães perdidos.',
    rvnBenef2Title: 'Telefone visível',
    rvnBenef2Desc: 'Os usuários veem seu número com um clique no mapa.',
    rvnBenef3Title: 'Horário de atendimento',
    rvnBenef3Desc: 'Informe seus dias e horários para que cheguem quando você está aberto.',
    rvnBenef4Title: 'Endereço exato',
    rvnBenef4Desc: 'Seu endereço e cidade visíveis para toda a comunidade.',
    rvnCatTitle: '9 categorias na rede',
    rvnCatSub: 'Encontre sua categoria e mostre seu negócio onde importa.',
    rvnCatSeeMore: 'Ver membros',
    rvnCatVetDesc: 'Atendimento médico, vacinas e urgências',
    rvnCatPetShopDesc: 'Alimentos, acessórios e brinquedos',
    rvnCatPeluDesc: 'Banho, tosa e estética canina',
    rvnCatAdiestrDesc: 'Educação, obediência e comportamento',
    rvnCatPaseadorDesc: 'Passeios diários e atividade física',
    rvnCatGuarderiaDesc: 'Creche e hospedagem canina',
    rvnCatRefugioDesc: 'Adoção responsável e resgate animal',
    rvnCatTiendaDesc: 'Roupas, acessórios e artigos para pets',
    rvnCatFarmaciaDesc: 'Medicamentos, antiparasitários e suplementos',
    rvnPromoSubtitle: 'Oferta de lançamento · Vagas limitadas',
    rvnCupo: 'vaga',
    rvnCupos: 'vagas',
    rvnDisponible: 'disponível',
    rvnDisponibles: 'disponíveis',
    rvnPromoBannerTitle: 'Os primeiros 50 negócios por cidade têm tarifa especial',
    rvnPromoBannerDesc: 'Como parte do lançamento da Red Vecindog, os primeiros 50 negócios por cidade a se registrarem terão uma tarifa promocional pelos primeiros 6 meses, com acesso completo a todos os benefícios da plataforma.',
    rvnPromoMonths: '/mês pelos primeiros 6 meses',
    rvnPromoLuego: 'Depois',
    rvnPricingChip: 'Sem contratos · Sem letras miúdas',
    rvnPricingTitle: 'Uma só tarifa, sem surpresas',
    rvnPricingPromoSub: 'ARS / mês · primeiros 6 meses',
    rvnPricingPromoStrike: '/mês tarifa regular',
    rvnPricingRegSub: 'ARS / mês',
    rvnPricingSub: 'Mês a mês. Cancele quando quiser.',
    rvnJoinBtn: 'Entrar na rede',
    rvnBenefit1: 'Você aparece no mapa onde vizinhos procuram cães',
    rvnBenefit2: 'Telefone, endereço e horário sempre visíveis',
    rvnBenefit3: 'Listado na sua categoria (vet, pet shop, banho…)',
    rvnBenefit4: 'Audiência 100% donos de pets ativos',
    rvnBenefit5: 'Sem bots — usuários reais da sua região',
    rvnBenefit6: 'Ativação em menos de 24 horas',
    rvnCtaTitle: 'Pronto para entrar?',
    rvnCtaSub: 'Preencha o formulário, pague e seu negócio aparece no mapa em menos de 24 horas.',
    rvnFormTitle: 'Registrar meu negócio',
    rvnFormPhotoLabel: 'Foto do negócio',
    rvnFormPhotoBtn: 'Enviar foto do local',
    rvnFormPhotoChange: 'Alterar foto',
    rvnFormPhotoSize: 'PNG, JPG · Máx. 5 MB',
    rvnFormNameLabel: 'Nome do negócio',
    rvnFormCatLabel: 'Categoria',
    rvnFormCatSelect: 'Selecione uma categoria',
    rvnFormDescLabel: 'Descrição breve',
    rvnFormLocLabel: 'Localização',
    rvnFormAddrLabel: 'Endereço',
    rvnFormCityLabel: 'Cidade / Localidade',
    rvnFormHoursLabel: 'Horários de atendimento',
    rvnFormDaysLabel: 'Dias',
    rvnFormOpen: 'Abre',
    rvnFormClose: 'Fecha',
    rvnFormPhoneLabel: 'Telefone',
    rvnFormLinkLabel: 'Link do negócio',
    rvnFormLinkHint: 'Site, Instagram, WhatsApp — para onde vão os cliques',
    rvnFormEmailLabel: 'Seu email',
    rvnFormEmailHint: 'Para confirmação de pagamento e dados de sua assinatura.',
    rvnFormPayNote: 'Você será redirecionado ao Mercado Pago para pagar. Seu negócio é ativado em menos de 24 horas.',
    rvnFormSubmitBtn: 'Pagar com Mercado Pago',
    rvnErrName: 'Informe o nome do seu negócio.',
    rvnErrCat: 'Selecione uma categoria.',
    rvnErrCity: 'Selecione a cidade do seu negócio.',
    rvnErrPhone: 'Informe um telefone de contato.',
    rvnErrAddr: 'Informe o endereço do seu negócio.',
    rvnErrEmail: 'Informe seu email.',
    rvnErrPhoneDigits: 'O telefone deve ter pelo menos 10 dígitos. Exemplo: +54 9 291 4050210',
    rvnErrPayment: 'Erro ao processar o pagamento.',
    rvnErrConnection: 'Erro de conexão. Tente novamente.',
    rvnErrPhoto: 'A imagem deve ter menos de 5 MB.',
    // Adoptar
    adpBack: 'Voltar ao início',
    adpChip: 'Adoção responsável',
    adpTitle: 'Pedido de adoção',
    adpSubtitulo: 'Preencha o formulário com sinceridade. As informações são confidenciais e nos ajudam a garantir o bem-estar do cão.',
    adpRequired: 'campo obrigatório',
    adpSi: 'Sim',
    adpNo: 'Não',
    adpSec1: 'Seus dados pessoais',
    adpNombre: 'Nome completo',
    adpDni: 'CPF/ID',
    adpEdad: 'Idade',
    adpEdadHint: '(mín. 18 anos)',
    adpTelefono: 'Telefone / WhatsApp',
    adpEmail: 'Email',
    adpDireccion: 'Endereço',
    adpDireccionHint: 'rua e número',
    adpZona: 'Bairro / zona',
    adpSec2: 'Sua moradia',
    adpSec2Sub: 'O ambiente é fundamental para o bem-estar do cão.',
    adpTipoVivienda: 'Tipo de moradia',
    adpCasa: 'Casa',
    adpDepto: 'Apartamento',
    adpCasaPatio: 'Casa com quintal',
    adpOtro: 'Outro',
    adpTenencia: 'Você é proprietário ou inquilino?',
    adpPropietario: 'Proprietário',
    adpInquilino: 'Inquilino',
    adpPropPermite: 'O proprietário permite animais?',
    adpTienePatio: 'Você tem quintal ou jardim?',
    adpPatioFechado: 'É cercado?',
    adpSec3: 'Sua família',
    adpSec3Sub: 'Precisamos saber quem vai conviver com o cão.',
    adpCantPersonas: 'Quantas pessoas moram na sua casa?',
    adpCantPersonasHint: 'incluindo você',
    adpHayNinos: 'Há crianças em casa?',
    adpEdadesNinos: 'Idades das crianças',
    adpEdadesNinosHint: 'ex.: 3, 7 e 10 anos',
    adpTodosDeAcuerdo: 'Todos em casa concordam com a adoção?',
    adpAlergias: 'Alguém tem alergia a animais?',
    adpSec4: 'Sua experiência com animais',
    adpMascotasActuales: 'Você tem animais atualmente?',
    adpCualesYCuantas: 'Quais e quantos?',
    adpCualesHint: 'tipo, raça e quantidade',
    adpVacunadasCastradas: 'Estão vacinados e castrados?',
    adpSiTodas: 'Sim, todos',
    adpAlgunas: 'Alguns',
    adpMascotasAnteriores: 'Você já teve animais antes?',
    adpQuePaso: 'O que aconteceu com eles?',
    adpHorasSolo: 'Quantas horas por dia o cão ficaria sozinho?',
    adpMenos2: 'Menos de 2 h',
    adp2a4: '2 a 4 h',
    adp4a6: '4 a 6 h',
    adp6a8: '6 a 8 h',
    adpMas8: 'Mais de 8 h',
    adpSec5: 'Que cão você procura?',
    adpSec5Sub: 'Nos ajuda a encontrar a melhor combinação para você e para o cão.',
    adpTamanoPreferido: 'Tamanho preferido',
    adpChico: 'Pequeno',
    adpMediano: 'Médio',
    adpGrande: 'Grande',
    adpSinPref: 'Sem preferência',
    adpEdadPreferida: 'Idade preferida',
    adpCachorro: 'Filhote',
    adpJoven: 'Jovem',
    adpAdulto: 'Adulto',
    adpMayor: 'Idoso',
    adpPerroEnMente: 'Você tem algum cão em mente?',
    adpPerroEnMenteHint: 'opcional',
    adpPerroEnMentePh: 'Nome ou descrição do cão que te interessa',
    adpMotivacion: 'Por que você quer adotar um cão?',
    adpMotivacionPh: 'Conte sua motivação, estilo de vida, quanto tempo pode dedicar, o que espera da convivência…',
    adpSec6: 'Compromissos',
    adpSec6Sub: 'Para garantir o bem-estar do cão precisamos que você aceite os seguintes pontos. Todos são obrigatórios.',
    adpComp1: 'Comprometo-me a fornecer cuidados veterinários regulares: vacinas anuais, vermifugação e checkups de saúde.',
    adpComp2: 'Aceito que seja realizada uma visita prévia à minha casa antes de confirmar a adoção.',
    adpComp3: 'Se por algum motivo não puder ficar com o cão, comprometo-me a devolvê-lo à organização e não dá-lo a terceiros sem aviso prévio.',
    adpComp4: 'Comprometo-me a castrar o cão se ainda não estiver, dentro dos prazos recomendados pelo veterinário.',
    adpEnviando: 'Enviando…',
    adpEnviar: 'Enviar pedido de adoção',
    adpSuccessTitle: 'Pedido enviado!',
    adpSuccessMsg: 'Recebemos seu pedido. Entraremos em contato em breve. Obrigado por querer adotar de forma responsável.',
    adpVerAdopcion: 'Ver cães para adoção',
    adpErrNombre: 'O nome completo é obrigatório.',
    adpErrDni: 'O CPF/ID é obrigatório.',
    adpErrEdad: 'A idade é obrigatória.',
    adpErrTelefono: 'O telefone é obrigatório.',
    adpErrEmail: 'O email é obrigatório.',
    adpErrDireccion: 'O endereço é obrigatório.',
    adpErrZona: 'O bairro ou zona é obrigatório.',
    adpErrVivienda: 'Indique o tipo de moradia.',
    adpErrTenencia: 'Indique se é proprietário ou inquilino.',
    adpErrPropPermite: 'Indique se o proprietário permite animais.',
    adpErrPatio: 'Indique se tem quintal ou jardim.',
    adpErrPatioFechado: 'Indique se o quintal é cercado.',
    adpErrPersonas: 'Indique quantas pessoas moram na sua casa.',
    adpErrNinos: 'Indique se há crianças em casa.',
    adpErrEdadesNinos: 'Escreva as idades das crianças.',
    adpErrAcuerdo: 'Indique se todos em casa concordam.',
    adpErrAlergias: 'Indique se alguém tem alergia a animais.',
    adpErrMascotas: 'Indique se tem animais atualmente.',
    adpErrDetalle: 'Descreva seus animais atuais.',
    adpErrVacunadas: 'Indique se seus animais estão vacinados e castrados.',
    adpErrAnteriores: 'Indique se já teve animais antes.',
    adpErrQuePaso: 'Conte o que aconteceu com seus animais anteriores.',
    adpErrHoras: 'Indique quantas horas o cão ficaria sozinho.',
    adpErrTamano: 'Escolha o tamanho preferido.',
    adpErrEdadPref: 'Escolha a idade preferida.',
    adpErrMotivacion: 'Conte por que você quer adotar.',
    adpErrCompromisos: 'Você deve aceitar todos os compromissos para continuar.',
    adpErrSubmit: 'Erro ao enviar o pedido: ',
    // Buscar
    bscBack: 'Voltar aos avisos',
    bscChip: 'Buscar por características',
    bscTitle: 'Como era o cão?',
    bscSub: 'Preencha o que souber. Quanto mais dados, melhores as coincidências.',
    bscSecCaract: 'Características do cão',
    bscRaza: 'Raça',
    bscRazaHint: 'Se especificar raça, aparecem apenas cães dessa raça',
    bscColor: 'Cor principal',
    bscColorNoSe: 'Não sei / não lembro',
    bscTamano: 'Tamanho',
    bscChico: 'Pequeno',
    bscMediano: 'Médio',
    bscGrande: 'Grande',
    bscSexo: 'Sexo',
    bscMacho: 'Macho',
    bscHembra: 'Fêmea',
    bscNs: 'Não sei',
    bscCollar: 'Tinha coleira?',
    bscColorCollar: 'Cor da coleira',
    bscColorCollarPh: 'Vermelho, azul, preto…',
    bscChapita: 'Tinha plaquinha de identificação?',
    bscSecDonde: 'Onde e quando',
    bscZona: 'Zona / bairro',
    bscFecha: 'Data aproximada',
    bscHorario: 'Horário aproximado (±3 h)',
    bscBuscar: 'Buscar coincidências',
    bscBuscando: 'Buscando…',
    bscSinCoincidencias: 'Sem coincidências',
    bscAviso: 'aviso',
    bscAvisos: 'avisos',
    bscEncontradoS: 'encontrado',
    bscEncontradosP: 'encontrados',
    bscNoEncontramos: 'Não encontramos avisos correspondentes',
    bscProbaFiltros: 'Tente com menos filtros ou veja todos os avisos.',
    bscVerTodos: 'Ver todos os avistados',
    // Publicar
    pbrBack: 'Voltar ao início',
    pbrGuestTitle: 'Você precisa de uma conta',
    pbrGuestSub: 'Para publicar um aviso você precisa estar cadastrado. É grátis e leva menos de um minuto.',
    pbrGuestBtn: 'Criar conta grátis',
    pbrChipPerdido: 'Cão perdido',
    pbrChipEncontrado: 'Vi um cão perdido',
    pbrChipTransito: 'Cão em trânsito',
    pbrChipAdopcion: 'Dou para adoção',
    pbrTitlePerdido: 'Perdi meu cão',
    pbrTitleEncontrado: 'Vi um cão perdido',
    pbrTitleTransito: 'Cão em trânsito',
    pbrTitleAdopcion: 'Dou para adoção',
    pbrSubPerdido: 'Preencha os dados e os vizinhos vão te ajudar a encontrá-lo.',
    pbrSubEncontrado: 'Insira os dados do cão que viu para que sua família o encontre.',
    pbrSubTransito: 'Indique se você tem ou se viu na rua, e a comunidade pode ajudar.',
    pbrSubAdopcion: 'Preencha as informações para encontrar uma família responsável.',
    pbrPrePerdido: '🔍 Antes de publicar: alguém já encontrou?',
    pbrPreEncontrado: '🔍 Antes de publicar: o dono já publicou um aviso?',
    pbrBuscarCaract: 'Buscar por características',
    pbrBuscarCaractSub: 'Cor, tamanho, coleira…',
    pbrBuscarFoto: 'Buscar por foto',
    pbrBuscarFotoSub: 'Envie uma foto e comparamos',
    pbrSiNoEncontras: 'Se não encontrar nada, preencha o formulário abaixo para publicar seu aviso.',
    pbrPrefillPre: 'Reportando',
    pbrPrefillPost: 'como perdido/a',
    pbrPrefillSub: 'Carregamos os dados do perfil. Revise e complete se necessário.',
    pbrStep1: 'Fotos do cão',
    pbrStep1Sub: 'Envie até {max} fotos. A primeira é usada como imagem principal.',
    pbrFotoPerfilDe: 'Foto do perfil de',
    pbrPrincipal: 'Principal',
    pbrHacerPrincipal: 'Tornar principal',
    pbrStep2Transit: 'Situação do animal',
    pbrStep2TransitSub: 'Conte como encontrou ou como está com o cão.',
    pbrLoTengo: '🏠 Estou com ele temporariamente',
    pbrLoTengoDesc: 'Você o encontrou e cuida até encontrar o dono',
    pbrLoVi: '🚨 Vi na rua',
    pbrLoViDesc: 'Precisa de ajuda mas você não pôde levá-lo',
    pbrFechaLimite: 'Até quando pode ficar com ele? (prazo limite)',
    pbrFechaLimiteSub: 'Aparecerá como contagem regressiva no seu aviso. Gera urgência para alguém adotá-lo.',
    pbrHoraVisto: 'Que horas você o viu?',
    pbrTransitWarning: '⚠️ Este aviso aparecerá no mapa em roxo para que os vizinhos próximos possam ajudar.',
    pbrStep2DataSub: 'Preencha o que sabe. Mais dados = mais chances de encontrá-lo.',
    pbrStep2DataSubEncontrado: 'Descreva o cão que viu para que sua família o reconheça.',
    pbrStep2DataSubTransito: 'Descreva o animal para que alguém o reconheça ou decida ajudar.',
    pbrStep2DataSubAdopcion: 'Conte como é o cão que dá para adoção.',
    pbrNombre: 'Nome (se souber)',
    pbrRaza: 'Raça',
    pbrColor: 'Cor principal',
    pbrColorNoSe: 'Não sei / não lembro',
    pbrTamano: 'Tamanho',
    pbrChico: 'Pequeno',
    pbrMediano: 'Médio',
    pbrGrande: 'Grande',
    pbrCollar: 'Tinha coleira?',
    pbrChapita: 'Tinha plaquinha de identificação?',
    pbrDescripcion: 'Descrição adicional',
    pbrDescripcionPh: 'Marcas especiais, manchas, comportamento, coleira vermelha com plaquinha azul…',
    pbrMatchTitle: 'É algum desses cães que estavam procurando?',
    pbrMatchNo: 'Não, é outro cão',
    pbrMatchMismaZona: 'Você o viu na mesma área onde se perdeu?',
    pbrMatchOtraZona: 'Não, outra área',
    pbrMatchDondeViste: 'Em qual área você o viu?',
    pbrMatchHora: 'Que horas você o viu? (opcional)',
    pbrMatchConfirm: '✓ Ao publicar, o aviso de busca será atualizado para a nova área.',
    pbrStep3Perdido: 'Onde e quando se perdeu?',
    pbrStep3Encontrado: 'Onde e quando você o viu?',
    pbrStep3Transito: 'Onde está ou onde o viu?',
    pbrStep3Adopcion: 'Onde está o cão?',
    pbrDondePerdio: 'Onde se perdeu?',
    pbrEnMiCasa: 'Na minha casa',
    pbrEnOtroLugar: 'Em outro lugar',
    pbrSinDireccion: 'Você não tem endereço salvo.',
    pbrAgregarPerfil: 'Adicionar ao perfil',
    pbrGpsOk: 'Localização GPS capturada',
    pbrGpsCambiar: 'Alterar',
    pbrGpsCargando: 'Obtendo localização…',
    pbrGpsUsar: 'Usar minha localização GPS',
    pbrGpsError: 'Não foi possível obter o GPS — tentar novamente',
    pbrGpsManual: 'Sem GPS / prefiro digitar o endereço',
    pbrGpsVolver: '← Voltar ao GPS',
    pbrConfirmDir: 'Confirme ou ajuste o endereço',
    pbrDireccionZona: 'Endereço ou zona',
    pbrFecha: 'Data',
    pbrHorario: 'Horário aproximado',
    pbrContactoLabel: 'WhatsApp de contato',
    pbrContactoError: 'Número incompleto — insira o número completo com código de área. Ex.: +54 9 291 4050210',
    pbrLimiteError: 'Você atingiu o limite de 5 avisos ativos do plano Grátis. Assine o VecindogPro para avisos ilimitados.',
    pbrPublicando: 'Publicando…',
    pbrPublicar: 'Publicar aviso',
    pbrSi: 'Sim',
    pbrNo: 'Não',
    pbrNoSe: 'Não sei',
    pbrAgregarFotos: 'Adicionar mais fotos',
    pbrSubirFotos: 'Enviar fotos',
    pbrGaleria: 'Galeria',
    pbrSacarFoto: 'Tirar foto',
    pbrSuccessTitle: 'Aviso publicado!',
    pbrSuccessMsg: 'Seu aviso já está publicado e os vizinhos de {city} podem vê-lo.',
    pbrVerAvisos: 'Ver todos os avisos',
    pbrPublicarOtro: 'Publicar outro',
    pbrPostMasPrecision: 'Quer buscar o cão com mais precisão?',
    pbrPostEncontrarDueno: 'Quer encontrar o dono mais rápido?',
    pbrBuscarFotoProSub: 'Envie uma foto e usamos IA',
    pbrSoloPro: 'Só Pro',
    pbrBuscarCaractTitle: 'Buscar por características',
    pbrBuscarCaractProSub: 'Raça, cor, tamanho',
    pbrPorCaract: 'Por características',
    pbrFotoLimit: 'Você já enviou o máximo de {max} fotos.',
    pbrFotoInvalida: 'não é uma imagem válida (JPG, PNG ou WEBP).',
    pbrFotoPesada: 'pesa {mb} MB.',
    pbrWhatsappError: 'O WhatsApp deve ter pelo menos 10 dígitos. Exemplo: +54 9 291 4050210',
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
