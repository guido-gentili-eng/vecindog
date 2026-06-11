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
  navMiPerfil: string;
  topEscapistasTitle: string;
  adBannerTitle: string;
  adBannerSub: string;
  adBannerCta: string;
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
  pbrStep2Data: string;
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
  // planes/pago-exitoso
  ppxCargando: string;
  ppxOkTitle: string;
  ppxOkSub: string;
  ppxIrMisPerros: string;
  ppxVolver: string;
  ppxPendienteTitle: string;
  ppxPendienteSub: string;
  ppxErrorTitle: string;
  ppxErrorSub: string;
  ppxVolverPlanes: string;
  // red-vecindog/pago-exitoso
  rvpxCargando: string;
  rvpxErrorTitle: string;
  rvpxPendienteTitle: string;
  rvpxBienvenidoTitle: string;
  rvpxPagoTitle: string;
  rvpxErrorSub: string;
  rvpxPendienteSub: string;
  rvpxActivadoSub: string;
  rvpxPagoSub: string;
  rvpxNegocioTiene: string;
  rvpxBenef1: string;
  rvpxBenef2: string;
  rvpxPlan: string;
  rvpxActualizar: string;
  rvpxIrApp: string;
  // publicitate/pago-exitoso
  pubpxCargando: string;
  pubpxErrorTitle: string;
  pubpxPendienteTitle: string;
  pubpxRenovadoTitle: string;
  pubpxActivadoTitle: string;
  pubpxPagoTitle: string;
  pubpxErrorSub: string;
  pubpxPendienteSub: string;
  pubpxRenovadoSub: string;
  pubpxActivadoSub: string;
  pubpxPagoSub: string;
  pubpxEspacios: string;
  pubpxActualizar: string;
  pubpxIrApp: string;
  // publicitate/renovar
  pubrvChip: string;
  pubrvVencida: string;
  pubrvExtender: string;
  pubrvPlan: string;
  pubrvVencimientoActual: string;
  pubrvVencido: string;
  pubrvNuevoVencimiento: string;
  pubrvTotal: string;
  pubrvPagoFallido: string;
  pubrvNoEncontrado: string;
  pubrvNoEncontradoSub: string;
  pubrvVerPlanes: string;
  pubrvCargando: string;
  pubrvBtn: string;
  pubrvPagoCon: string;
  pubrvVerTodos: string;
  // shared service options (cuidado/transporte)
  svcExp1: string;
  svcExp2: string;
  svcExp3: string;
  svcExp4: string;
  svcExp5: string;
  svcDisp1: string;
  svcDisp2: string;
  svcDisp3: string;
  svcDisp4: string;
  // busco-cuidador
  cubcTitle: string;
  cubcSub: string;
  cubcCualPerro: string;
  cubcCargandoPerros: string;
  cubcSinPerros: string;
  cubcRegistra: string;
  cubcSinPerroSub: string;
  cubcFechas: string;
  cubcOpcional: string;
  cubcDesde: string;
  cubcHasta: string;
  cubcZona: string;
  cubcDescripcion: string;
  cubcDescripcionPh: string;
  cubcContacto: string;
  cubcContactoPh: string;
  cubcContactoError: string;
  cubcPublicar: string;
  cubcErrLogin: string;
  cubcErrZona: string;
  cubcErrContacto: string;
  cubcErrContactoShort: string;
  cubcErrPublicar: string;
  cubcLoginSub: string;
  cubcLoginBtn: string;
  cubcOkTitle: string;
  cubcOkSub: string;
  // quiero-cuidar
  qqcTitle: string;
  qqcSub: string;
  qqcNombre: string;
  qqcNombrePh: string;
  qqcExperiencia: string;
  qqcDisponibilidad: string;
  qqcCuantos: string;
  qqcTienePerros: string;
  qqcDisp5: string;
  qqcInfo: string;
  qqcInfoPh: string;
  qqcZona: string;
  qqcContacto: string;
  qqcRegistrar: string;
  qqcProTitle: string;
  qqcProSub: string;
  qqcVerPlanes: string;
  qqcLoginSub: string;
  qqcOkTitle: string;
  qqcOkSub: string;
  qqcErrLogin: string;
  qqcErrNombre: string;
  qqcErrZona: string;
  qqcErrContacto: string;
  qqcErrContactoShort: string;
  qqcErrRegistrar: string;
  // quiero-transportar
  qqtTitle: string;
  qqtSub: string;
  qqtCuantos: string;
  qqtVehiculo: string;
  qqtDisp5: string;
  qqtInfoPh: string;
  qqtRegistrar: string;
  qqtProSub: string;
  qqtLoginSub: string;
  qqtOkTitle: string;
  qqtOkSub: string;
  qqtErrRegistrar: string;
  // cuidador/[id] rating
  quidBack: string;
  quidSobre: string;
  quidContactar: string;
  quidDisponibilidad: string;
  quidCalificaciones: string;
  quidCalificar: string;
  quidEditarCal: string;
  quidCalGuardada: string;
  quidSinCal: string;
  quidSePrimero: string;
  quidNoEncontrado: string;
  quidModalTitle: string;
  quidPuntuacion: string;
  quidCuidadoPerro: string;
  quidFuePuntual: string;
  quidBuenaCom: string;
  quidRecomienda: string;
  quidComentario: string;
  quidComentarioPh: string;
  quidCancelar: string;
  quidGuardar: string;
  quidErrEstrella: string;
  quidExcelente: string;
  quidBueno: string;
  quidRegular: string;
  quidPuntual: string;
  quidBuenaComunicacion: string;
  quidLoRecomienda: string;
  quidCuidadoBadge: string;
  quidRecomendaciones: string;
  // transportador/[id] rating
  tridBack: string;
  tridSobre: string;
  tridNoEncontrado: string;
  tridModalTitle: string;
  tridCuidadoPerro: string;
  tridTratoBadge: string;
  tridCuidadoBadge: string;
  tridSinCal: string;
  // red-vecindog/[categoria]
  rvcatBack: string;
  rvcatNoEncontrado: string;
  rvcatVolverRvn: string;
  rvcatSinInscrip: string;
  rvcatProTitle: string;
  rvcatVerPro: string;
  rvcatVerNegocio: string;
  rvcatCiudadTitle: string;
  rvcatCiudadSub: string;
  rvcatCiudadPh: string;
  rvcatUsarDeTodas: string;
  rvcatEmptySub: string;
  rvcatRegistrar: string;
  rvcatVolver: string;
  rvcatConfirmar: string;
  rvcatProSub: string;
  rvcatProBeneficios: string;
  rvcatEmptyTitle: string;
  // cartel
  cartelVolver: string;
  cartelImprimir: string;
  // timeline
  tlineVolver: string;
  tlineDiario: string;
  tlineEventos: string;
  tlineSinEventos: string;
  tlineSinEventosSub: string;
  tlineVacuna: string;
  tlineDesparasitacion: string;
  tlineMedicamento: string;
  tlinePeso: string;
  tlineEstudio: string;
  tlineGrooming: string;
  tlineTurno: string;
  tlineAviso: string;
  tlineActivo: string;
  tlineResuelto: string;
  tlineProxima: string;
  // historia (social sharing)
  histVolver: string;
  histCompartirRedes: string;
  histConectar: string;
  histConectarLabel: string;
  histEmailLabel: string;
  histEmailPh: string;
  histGuardar: string;
  histCambiar: string;
  histEmailDe: string;
  histGenerando: string;
  histListaIg: string;
  histListaFb: string;
  histCompartirIg: string;
  histCompartirFb: string;
  histEnCelular: string;
  histPasoIg: string;
  histPasoFb: string;
  histDescargar: string;
  // mis-perros/nuevo
  mpnVolver: string;
  mpnNuevoChip: string;
  mpnTitle: string;
  mpnSub: string;
  mpnLoginSub: string;
  mpnLimiteTitle: string;
  mpnLimiteSub: string;
  mpnVerPro: string;
  mpnVolverLista: string;
  mpnErrNombre: string;
  mpnGuardando: string;
  mpnGuardar: string;
  mpnSecDatos: string;
  mpnSecFotos: string;
  mpnSecFotosSub: string;
  mpnSecVet: string;
  mpnSecVetOpcional: string;
  mpnSecVacunas: string;
  mpnSecVacunasSub: string;
  mpnNombre: string;
  mpnRaza: string;
  mpnColor: string;
  mpnColorPh: string;
  mpnSexo: string;
  mpnSexoMacho: string;
  mpnSexoHembra: string;
  mpnTamano: string;
  mpnFechaNac: string;
  mpnChip: string;
  mpnEsterilizado: string;
  mpnDescripcion: string;
  mpnDescripcionPh: string;
  mpnAlergias: string;
  mpnAlergiasPh: string;
  mpnAlergiasInfo: string;
  mpnDireccion: string;
  mpnDireccionPh: string;
  mpnDireccionInfo: string;
  mpnFotoSubir: string;
  mpnFotoFormato: string;
  mpnFotoErrImagen: string;
  mpnFotoErrTamano: string;
  mpnFotoErrMax: string;
  mpnFotoPrincipal: string;
  mpnVetNombre: string;
  mpnVetNombrePh: string;
  mpnVetTel: string;
  mpnVacunaAgregar: string;
  mpnVacunaNum: string;
  mpnVacunaNombre: string;
  mpnVacunaFecha: string;
  mpnVacunaVet: string;
  mpnVacunaProxima: string;
  mpnVacunaNotas: string;
  mpnVacunaNombrePh: string;
  mpnVacunaVetPh: string;
  mpnVacunaNotasPh: string;
  mpnVacunaSinVacunas: string;
  // publicitate landing
  publVolver: string;
  publHeroChip: string;
  publHeroTitle: string;
  publHeroSub: string;
  publHeroWa: string;
  publHeroMail: string;
  publFormatosTitle: string;
  publFormatosSub: string;
  publPreciosTitle: string;
  publPreciosSub: string;
  publMasElegido: string;
  publPrecioEspecial: string;
  publPorQueTitle: string;
  publPorQueSub: string;
  publPorQueChip: string;
  publFaqTitle: string;
  publCtaTitle: string;
  publCtaSub: string;
  publModalFotolabel: string;
  publModalFotoCambiar: string;
  publModalFotoSubir: string;
  publModalLogoLabel: string;
  publModalLogoCambiar: string;
  publModalLogoSubir: string;
  publModalNegocioLabel: string;
  publModalTaglineLabel: string;
  publModalLinkLabel: string;
  publModalLinkInfo: string;
  publModalCtaLabel: string;
  publModalContactoLabel: string;
  publModalEmailLabel: string;
  publModalTelLabel: string;
  publModalErrFotoTam: string;
  publModalErrLogoTam: string;
  publModalErrNegocio: string;
  publModalErrEmail: string;
  publModalErrLink: string;
  publModalErrLinkFmt: string;
  publModalErrTel: string;
  publModalPagandoCon: string;
  publModalPagar: string;
  publVistaPrevia: string;
  publStats0label: string;
  publStats1label: string;
  publStats2label: string;
  publStats3label: string;
  // mi-comercio
  mcomVolver: string;
  mcomVerPerfil: string;
  mcomSinComercioTitle: string;
  mcomSinComercioSub: string;
  mcomRegistrar: string;
  mcomActivo: string;
  mcomPendiente: string;
  mcomReviews: string;
  mcomVence: string;
  mcomEditar: string;
  mcomStatsTitle: string;
  mcomStatsVistas30: string;
  mcomStatsVistas7: string;
  mcomStatsTelefono: string;
  mcomStatsMapa: string;
  mcomStatsLink: string;
  mcomStatsCargando: string;
  mcomNovedadesTitle: string;
  mcomNueva: string;
  mcomNovTituloPlaceholder: string;
  mcomNovDescPlaceholder: string;
  mcomNovError: string;
  mcomPublicando: string;
  mcomPublicar: string;
  mcomCancelar: string;
  mcomNovVacia: string;
  mcomDatosActualizados: string;
  mcomEditarTitle: string;
  mcomFotoLabel: string;
  mcomSubirFoto: string;
  mcomNombreLabel: string;
  mcomCategoriaLabel: string;
  mcomCategoriaPlaceholder: string;
  mcomTelefonoLabel: string;
  mcomDescripcionLabel: string;
  mcomDescripcionPlaceholder: string;
  mcomDireccionLabel: string;
  mcomApertura: string;
  mcomCierre: string;
  mcomDiasLabel: string;
  mcomDiasPlaceholder: string;
  mcomLinkLabel: string;
  mcomGuardando: string;
  mcomGuardarCambios: string;
  // mis-perros/[id]
  mpdMisPerros: string;
  mpdGenerarCartel: string;
  mpdPublicarRedes: string;
  mpdQrCollar: string;
  mpdDiario: string;
  mpdEditarPerfil: string;
  mpdRegistrado: string;
  mpdRegistradoSub: string;
  mpdSaludable: string;
  mpdEnTratamiento: string;
  mpdEnRecuperacion: string;
  mpdBannerProText: string;
  mpdVerPro: string;
  mpdVencidoUno: string;
  mpdVencidosN: string;
  mpdProximaUna: string;
  mpdProximasN: string;
  mpdIdentificacion: string;
  mpdGuardarPDF: string;
  mpdMicrochip: string;
  mpdFechaNacLabel: string;
  mpdEdadLabel: string;
  mpdCiudadLabel: string;
  mpdEsterilizadoLabel: string;
  mpdAlergiasLabel: string;
  mpdVetHabitual: string;
  mpdCarnetVacunas: string;
  mpdVacunasRegistradas: string;
  mpdSinVacunas: string;
  mpdEncontrarVet: string;
  mpdRedVetSub: string;
  mpdVerVets: string;
  mpdAvisoActivo: string;
  mpdAvisoActivoSub: string;
  mpdAvisoRenovado: string;
  mpdRenovarAviso: string;
  mpdVerAviso: string;
  mpdPerdiste: string;
  mpdPerdistesSub: string;
  mpdPublicarAviso: string;
  mpdPerroNoEncontrado: string;
  mpdVolverListado: string;
  mpdEsterilizado: string;
  // EditForm
  mpdSubirFoto: string;
  mpdCambiarFoto: string;
  mpdFotoError: string;
  mpdNombreLabel: string;
  mpdRazaLabel: string;
  mpdColorLabel: string;
  mpdColorPlaceholder: string;
  mpdSexoLabel: string;
  mpdTamanoLabel: string;
  mpdFechaNacFormLabel: string;
  mpdChipPlaceholder: string;
  mpdEsterilizadoCheck: string;
  mpdDescripcionLabel: string;
  mpdDescripcionPlaceholder: string;
  mpdAlergiasCond: string;
  mpdAlergiasPlaceholder: string;
  mpdVetNombreLabel: string;
  mpdVetTelefonoLabel: string;
  mpdErrGuardar: string;
  mpdCancelar: string;
  mpdGuardarCambios: string;
  mpdEliminarPerfil: string;
  mpdEliminarConfirm: string;
  mpdEliminarWarning: string;
  mpdSiEliminar: string;
  mpdEnviarCarnet: string;
  // VacunaItem/Form
  mpdVacunaVencida: string;
  mpdVacunaVigente: string;
  mpdVacunaProxima: string;
  mpdVacunaLabel: string;
  mpdVacunaPlaceholder: string;
  mpdFechaReqLabel: string;
  mpdProximaDosis: string;
  mpdVetFormLabel: string;
  mpdNotasLabel: string;
  mpdVacunaErrReq: string;
  mpdAgregarVacuna: string;
  // Shared form
  mpdGuardar: string;
  mpdAgregar: string;
  mpdEnviar: string;
  mpdVer: string;
  mpdEditar: string;
  mpdCerrar: string;
  mpdRegistrar: string;
  mpdConfirmarSubir: string;
  mpdErrSubir: string;
  // AirTag
  mpdAirTagTitle: string;
  mpdAirTagLabel: string;
  mpdAirTagErrReq: string;
  mpdAirTagTip: string;
  mpdAirTagNSerie: string;
  mpdAirTagPerdidoTitle: string;
  mpdAirTagPerdidoDesc: string;
  mpdAirTagModoLink: string;
  mpdAirTagVacio: string;
  // Chip / Certificados
  mpdChipCertTitle: string;
  mpdSubirCertificado: string;
  mpdNumeroChip: string;
  mpdSinRegistrar: string;
  mpdEditarBtn: string;
  mpdAgregarBtn: string;
  mpdChipPlaceholderForm: string;
  mpdSinCertificados: string;
  mpdVerBtn: string;
  // CVI
  mpdCVITitle: string;
  mpdCVIPaises: string;
  mpdCVIBuscar: string;
  mpdCVISinDestino: string;
  mpdCVIFuente: string;
  // Estudios
  mpdSubirArchivo: string;
  mpdPorVencer: string;
  mpdSinArchivos: string;
  mpdCotizacionSub: string;
  mpdCotizacionLink: string;
  mpdTurnoRegistrado: string;
  mpdRegistrarTurnoEco: string;
  mpdRegistrarTurnoRad: string;
  mpdTurnoNotaPlaceholder: string;
  mpdRegistrarBtn: string;
  mpdTeneTurnoEco: string;
  mpdTeneTurnoRad: string;
  mpdRegistraAvisamos: string;
  // Enviar estudio modal
  mpdEnviarEstudio: string;
  mpdEnviarEmail: string;
  mpdEnviarWA: string;
  // Cotizacion lab
  mpdCotizOk: string;
  mpdCotizOkSub: string;
  mpdCotizTitle: string;
  mpdCotizSub: string;
  mpdCotizNombreLabel: string;
  mpdCotizEmailLabel: string;
  mpdCotizPerroLabel: string;
  mpdCotizRecetaLabel: string;
  mpdCotizSubirReceta: string;
  mpdCotizErrCampos: string;
  mpdCotizErrEmail: string;
  mpdCotizEnviar: string;
  // QR Modal
  mpdQRTitle: string;
  mpdQRDesc: string;
  mpdQRDescargar: string;
  // Medicamentos
  mpdMedicamentosTitle: string;
  mpdMedActivos: string;
  mpdMedLabel: string;
  mpdMedPlaceholder: string;
  mpdMedDosis: string;
  mpdMedDosisPlaceholder: string;
  mpdMedFrecuencia: string;
  mpdMedFrecuenciaPlaceholder: string;
  mpdMedInicio: string;
  mpdMedFin: string;
  mpdMedErrReq: string;
  mpdSinMedActivos: string;
  mpdMedDesde: string;
  mpdMedHasta: string;
  mpdMedAnteriores: string;
  mpdEnviarMed: string;
  // Historia Clínica
  mpdHistoriaTitle: string;
  mpdHistoriaResumen: string;
  mpdSinDatos: string;
  mpdHCPerfil: string;
  mpdHCVacunas: string;
  mpdHCAnalisis: string;
  mpdHCRadios: string;
  mpdHCEcos: string;
  mpdHCDesparas: string;
  mpdHCPeso: string;
  mpdHCPesoMas: string;
  mpdEnviarHistoria: string;
  mpdEnviarHistoriaSub: string;
  // Desparasitaciones
  mpdDesparasTitle: string;
  mpdDesparasRegistradas: string;
  mpdEnviarDesparas: string;
  mpdSinDesparas: string;
  mpdDesparasProductoLabel: string;
  mpdDesparasProductoPlaceholder: string;
  mpdDesparasTipoLabel: string;
  mpdDesparasProxima: string;
  mpdDesparasErrReq: string;
  // Peso
  mpdPesoTitle: string;
  mpdPesoRegistros: string;
  mpdPesoRegistrar: string;
  mpdPesoUltimo: string;
  mpdPesoVsAnterior: string;
  mpdPesoKgLabel: string;
  mpdPesoErrReq: string;
  mpdPesoEvolucion: string;
  mpdSinPeso: string;
  mpdEnviarPeso: string;
  // Visitas vet
  mpdVisitasTitle: string;
  mpdVisitaMotivo: string;
  mpdVisitaMotivoPlaceholder: string;
  mpdVisitaDiagnostico: string;
  mpdVisitaDiagPlaceholder: string;
  mpdVisitaTratamiento: string;
  mpdVisitaTratPlaceholder: string;
  mpdVisitaErrReq: string;
  mpdSinVisitas: string;
  // Procedimientos
  mpdProcedimientosTitle: string;
  mpdProcDescLabel: string;
  mpdProcDescPlaceholder: string;
  mpdProcVetLabel: string;
  mpdProcErrReq: string;
  mpdSinProcedimientos: string;
  // Dieta
  mpdDietaTitle: string;
  mpdDietaMarca: string;
  mpdDietaMarcaPlaceholder: string;
  mpdDietaCantidad: string;
  mpdDietaCantidadPlaceholder: string;
  mpdDietaFrecuencia: string;
  mpdDietaFrecuenciaPlaceholder: string;
  mpdDietaNotasLabel: string;
  mpdDietaNotasPlaceholder: string;
  mpdDietaAlimentoLabel: string;
  mpdDietaRestriccionesLabel: string;
  mpdSinDieta: string;
  // Grooming
  mpdGroomingTitle: string;
  mpdGroomingConfigurar: string;
  mpdGroomingUltimo: string;
  mpdGroomingCadaCuantos: string;
  mpdGroomingUltimoLabel: string;
  mpdGroomingProximoLabel: string;
  mpdSinGrooming: string;
  // Galería
  mpdGaleriaTitle: string;
  mpdAgregarFoto: string;
  mpdSinFotos: string;
  // Contactos emergencia
  mpdContactosTitle: string;
  mpdContactoRelacion: string;
  mpdContactoRelacionPlaceholder: string;
  mpdContactoNotasPlaceholder: string;
  mpdContactoErrReq: string;
  mpdSinContactos: string;
  // calcularEdad
  mpdCachorro: string;
  mpdMes: string;
  mpdMeses: string;
  mpdAnio: string;
  mpdAnios: string;

  // ── EncontrePerroButton ──────────────────────────────────
  encPregunta: string;
  encDuenio: string;
  encAvisar: string;
  encLlamar: string;
  encEnviado: string;
  encEnviadoDesc: string;
  encLlamarTambien: string;
  encEncontreA: string;
  encEnviarDesc: string;
  encMensaje: string;
  encTelefono: string;
  encEnviando: string;
  encAvisarBtn: string;
  encErrEnviar: string;

  // ── PrintButton ──────────────────────────────────────────
  hpbImprimir: string;

  // ── NovedadesComercio / ReviewsComercio ──────────────────
  revNovedades: string;
  revReviews: string;
  revSinReviews: string;
  revPrimero: string;
  revEditarReview: string;
  revEscribirReview: string;
  revGracias: string;
  revOpinion: string;
  revPlaceholder: string;
  revPublicar: string;
  revErrReview: string;
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
    navMiPerfil: 'Mi perfil',
    topEscapistasTitle: 'Los más escapistas 🏃',
    adBannerTitle: '¿Tenés un negocio local para dueños de mascotas?',
    adBannerSub: 'Llegá a vecinos que ya están buscando productos y servicios para sus mascotas.',
    adBannerCta: 'Publicitate aquí',
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
    rvnPromoBannerTitle: 'Los primeros 50 comercios por ciudad: 3 meses completamente gratis',
    rvnPromoBannerDesc: 'En el marco del lanzamiento de la Red Vecindog, los primeros 50 comercios por ciudad en registrarse obtienen los primeros 3 meses sin costo, con acceso completo a todos los beneficios de la plataforma.',
    rvnPromoMonths: '/mes a partir del 4.° mes',
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
    pbrStep2Data: 'Datos del perro',
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
    ppxCargando: 'Confirmando tu pago…',
    ppxOkTitle: '¡Bienvenido a VecindogPro!',
    ppxOkSub: 'Tu cuenta ya tiene acceso a todas las funciones Pro por 30 días.',
    ppxIrMisPerros: 'Ir a Mis perros',
    ppxVolver: 'Volver al inicio',
    ppxPendienteTitle: 'Pago en proceso',
    ppxPendienteSub: 'Tu pago está siendo procesado. Te avisaremos por email cuando se confirme.',
    ppxErrorTitle: 'No pudimos confirmar',
    ppxErrorSub: 'Hubo un problema al verificar tu pago. Si el cobro se realizó, escribinos a',
    ppxVolverPlanes: 'Volver a planes',
    rvpxCargando: 'Verificando pago y activando tu negocio…',
    rvpxErrorTitle: 'Hubo un problema',
    rvpxPendienteTitle: '¡Pago en proceso!',
    rvpxBienvenidoTitle: '¡Bienvenido a la Red!',
    rvpxPagoTitle: '¡Pago recibido!',
    rvpxErrorSub: 'Escribinos a hola@mivecindog.com.ar y lo resolvemos rápido.',
    rvpxPendienteSub: 'Tu pago está siendo procesado. Tu negocio se activa automáticamente al confirmarse.',
    rvpxActivadoSub: 'Tu negocio ya es parte de la Red Vecindog y aparece en el mapa para los vecinos dueños de perros.',
    rvpxPagoSub: 'Recibirás una confirmación por email cuando tu negocio esté activo en el mapa.',
    rvpxNegocioTiene: 'Tu negocio ahora tiene',
    rvpxBenef1: 'Presencia en el mapa de búsqueda de perros',
    rvpxBenef2: 'Teléfono y dirección visibles para los vecinos',
    rvpxPlan: 'Red Vecindog · 30 días',
    rvpxActualizar: '¿Necesitás actualizar algún dato? Escribinos a',
    rvpxIrApp: 'Ir a la app',
    pubpxCargando: 'Verificando pago y activando tu anuncio…',
    pubpxErrorTitle: 'Hubo un problema',
    pubpxPendienteTitle: '¡Pago en proceso!',
    pubpxRenovadoTitle: '¡Publicidad renovada!',
    pubpxActivadoTitle: '¡Tu anuncio está activo!',
    pubpxPagoTitle: '¡Pago recibido!',
    pubpxErrorSub: 'Escribinos a hola@mivecindog.com.ar y lo resolvemos rápido.',
    pubpxPendienteSub: 'Tu pago está siendo procesado. Tu anuncio se activa automáticamente al confirmarse.',
    pubpxRenovadoSub: 'Tu publicidad fue renovada por 30 días más. No tuviste que reingresar ningún dato.',
    pubpxActivadoSub: 'Tu publicidad en Vecindog quedó activada para los próximos 30 días.',
    pubpxPagoSub: 'Recibirás una confirmación por email cuando tu anuncio esté activo.',
    pubpxEspacios: 'Espacios activados',
    pubpxActualizar: '¿Necesitás hacer un cambio en tu anuncio? Escribinos a',
    pubpxIrApp: 'Ir a la app',
    pubrvChip: 'Renovar publicidad',
    pubrvVencida: 'Tu publicidad venció. Renovar la reactiva por 30 días más.',
    pubrvExtender: 'Extendé tu publicidad 30 días más.',
    pubrvPlan: 'Plan',
    pubrvVencimientoActual: 'Vencimiento actual',
    pubrvVencido: '(vencido)',
    pubrvNuevoVencimiento: 'Nuevo vencimiento',
    pubrvTotal: 'Total',
    pubrvPagoFallido: 'El pago no se procesó. Intentá de nuevo.',
    pubrvNoEncontrado: 'Anuncio no encontrado',
    pubrvNoEncontradoSub: 'El link de renovación es inválido o expiró.',
    pubrvVerPlanes: 'Ver planes de publicidad',
    pubrvCargando: 'Cargando…',
    pubrvBtn: 'Renovar con Mercado Pago',
    pubrvPagoCon: 'Podés pagar con tarjeta de débito, crédito o cuenta de Mercado Pago.',
    pubrvVerTodos: 'Ver todos los planes',
    svcExp1: 'Soy dueño/a de perros',
    svcExp2: 'Tuve perros de niño/a',
    svcExp3: 'Cuidé perros de amigos/familia',
    svcExp4: 'Trabajé con animales',
    svcExp5: 'Sin experiencia previa',
    svcDisp1: 'De lunes a viernes',
    svcDisp2: 'Fines de semana',
    svcDisp3: 'Cualquier día',
    svcDisp4: 'Solo de día',
    cubcTitle: 'Busco cuidador',
    cubcSub: 'Publicá un aviso para encontrar a alguien que cuide a tu perro.',
    cubcCualPerro: '¿Para cuál de tus perros?',
    cubcCargandoPerros: 'Cargando tus perros…',
    cubcSinPerros: 'No tenés perros registrados.',
    cubcRegistra: 'Registrá uno →',
    cubcSinPerroSub: 'También podés continuar sin seleccionar un perro y completar los datos manualmente.',
    cubcFechas: '¿Para qué fechas?',
    cubcOpcional: '(opcional)',
    cubcDesde: 'Desde',
    cubcHasta: 'Hasta',
    cubcZona: 'Zona / Barrio',
    cubcDescripcion: 'Descripción',
    cubcDescripcionPh: 'Necesidades especiales, rutinas, información importante para el cuidador…',
    cubcContacto: 'WhatsApp de contacto',
    cubcContactoPh: 'Ej: 1122334455',
    cubcContactoError: 'Número incompleto — ingresá el número completo con código de área. Ej: +54 9 291 4050210',
    cubcPublicar: 'Publicar aviso',
    cubcErrLogin: 'Tenés que iniciar sesión para publicar.',
    cubcErrZona: 'La zona es obligatoria.',
    cubcErrContacto: 'El contacto de WhatsApp es obligatorio.',
    cubcErrContactoShort: 'El WhatsApp debe tener al menos 10 dígitos. Ejemplo: +54 9 291 4050210',
    cubcErrPublicar: 'No se pudo publicar. Intentá de nuevo.',
    cubcLoginSub: 'Iniciá sesión para publicar un pedido de cuidado.',
    cubcLoginBtn: 'Iniciar sesión',
    cubcOkTitle: '¡Aviso publicado!',
    cubcOkSub: 'Tu pedido ya aparece en el listado de cuidado.',
    qqcTitle: 'Quiero cuidar',
    qqcSub: 'Completá tu perfil de cuidador para que los dueños puedan encontrarte.',
    qqcNombre: 'Tu nombre o apodo',
    qqcNombrePh: 'Ej: Martina G.',
    qqcExperiencia: 'Experiencia con perros',
    qqcDisponibilidad: 'Disponibilidad',
    qqcCuantos: '¿Cuántos perros podés cuidar a la vez?',
    qqcTienePerros: '¿Tenés perros en casa?',
    qqcDisp5: 'Con pernocte incluido',
    qqcInfo: 'Información adicional',
    qqcInfoPh: 'Contá algo más: si tenés patio, si podés hacer pernocte, razas con las que te sentís cómodo/a…',
    qqcZona: 'Zona / Barrio',
    qqcContacto: 'WhatsApp de contacto',
    qqcRegistrar: 'Registrarme como cuidador',
    qqcProTitle: 'Función exclusiva VecindogPro',
    qqcProSub: 'Para registrarte como cuidador y recibir calificaciones de los dueños, necesitás tener el plan Pro activo.',
    qqcVerPlanes: 'Ver planes',
    qqcLoginSub: 'Iniciá sesión para registrarte como cuidador.',
    qqcOkTitle: '¡Te registraste como cuidador!',
    qqcOkSub: 'Tu perfil ya aparece en el listado de cuidadores disponibles.',
    qqcErrLogin: 'Tenés que iniciar sesión para registrarte.',
    qqcErrNombre: 'El nombre es obligatorio.',
    qqcErrZona: 'La zona es obligatoria.',
    qqcErrContacto: 'El contacto de WhatsApp es obligatorio.',
    qqcErrContactoShort: 'El WhatsApp debe tener al menos 10 dígitos. Ejemplo: +54 9 291 4050210',
    qqcErrRegistrar: 'No se pudo registrar. Intentá de nuevo.',
    qqtTitle: 'Quiero transportar perros',
    qqtSub: 'Completá tu perfil de transportador para que los dueños puedan encontrarte.',
    qqtCuantos: '¿Cuántos perros podés transportar a la vez?',
    qqtVehiculo: '¿Qué vehículo tenés?',
    qqtDisp5: 'Con horario flexible',
    qqtInfoPh: 'Contá algo más: si tenés auto propio, qué zonas cubrís, si hacés traslados al veterinario…',
    qqtRegistrar: 'Registrarme como transportador',
    qqtProSub: 'Para registrarte como transportador y recibir calificaciones de los dueños, necesitás tener el plan Pro activo.',
    qqtLoginSub: 'Iniciá sesión para registrarte como transportador.',
    qqtOkTitle: '¡Te registraste como transportador!',
    qqtOkSub: 'Tu perfil ya aparece en el listado de transportadores disponibles.',
    qqtErrRegistrar: 'No se pudo registrar. Intentá de nuevo.',
    quidBack: 'Cuidadores disponibles',
    quidSobre: 'Sobre este cuidador',
    quidContactar: 'Contactar',
    quidDisponibilidad: 'Disponibilidad:',
    quidCalificaciones: 'Calificaciones',
    quidCalificar: 'Calificar',
    quidEditarCal: 'Editar calificación',
    quidCalGuardada: '¡Calificación guardada! Gracias por tu opinión.',
    quidSinCal: 'Todavía no hay calificaciones para este cuidador.',
    quidSePrimero: '¡Sé el primero!',
    quidNoEncontrado: 'No se encontró el perfil de este cuidador.',
    quidModalTitle: 'Calificar cuidador',
    quidPuntuacion: 'Puntuación general',
    quidCuidadoPerro: '¿Cómo fue el cuidado de tu perro?',
    quidFuePuntual: '¿Fue puntual?',
    quidBuenaCom: '¿La comunicación fue fluida?',
    quidRecomienda: '¿Lo recomendarías a otros dueños?',
    quidComentario: 'Comentario',
    quidComentarioPh: 'Contá cómo fue la experiencia…',
    quidCancelar: 'Cancelar',
    quidGuardar: 'Guardar',
    quidErrEstrella: 'Seleccioná al menos una estrella.',
    quidExcelente: 'Excelente 🐾',
    quidBueno: 'Bueno 👍',
    quidRegular: 'Regular 😐',
    quidPuntual: 'Puntual',
    quidBuenaComunicacion: 'Buena comunicación',
    quidLoRecomienda: 'Lo recomienda',
    quidCuidadoBadge: '🐾 Cuidado',
    quidRecomendaciones: '% lo recomienda',
    tridBack: 'Transportadores disponibles',
    tridSobre: 'Sobre este transportador',
    tridNoEncontrado: 'No se encontró el perfil de este transportador.',
    tridModalTitle: 'Calificar transportador',
    tridCuidadoPerro: '¿Cómo fue el trato hacia tu perro?',
    tridTratoBadge: '🐾 Trato',
    tridCuidadoBadge: '🐾 Trato',
    tridSinCal: 'Todavía no hay calificaciones para este transportador.',
    rvcatBack: 'Red Vecindog',
    rvcatNoEncontrado: 'Categoría no encontrada.',
    rvcatVolverRvn: 'Volver a Red Vecindog',
    rvcatSinInscrip: 'Sin inscriptos todavía',
    rvcatProTitle: 'Exclusivo VecindogPro',
    rvcatVerPro: 'Ver Pro',
    rvcatVerNegocio: 'Ver negocio',
    rvcatCiudadTitle: '¿En qué ciudad estás?',
    rvcatCiudadSub: 'Tenés que elegir tu ciudad para ver los negocios de tu zona.',
    rvcatCiudadPh: 'Escribí tu ciudad…',
    rvcatUsarDeTodas: 'Usar "{q}" igual',
    rvcatEmptySub: '¿Tenés un negocio de este rubro? Sé el primero en sumarte.',
    rvcatRegistrar: 'Registrar mi negocio',
    rvcatVolver: 'Volver',
    rvcatConfirmar: 'Confirmar',
    rvcatProSub: 'Activá el plan Pro para ver los datos de cada negocio.',
    rvcatProBeneficios: 'Con VecindogPro tenés',
    rvcatEmptyTitle: 'Todavía no hay inscriptos en esta categoría',
    cartelVolver: 'Volver',
    cartelImprimir: 'Imprimir / Guardar PDF',
    tlineVolver: 'Volver al perfil',
    tlineDiario: 'Diario',
    tlineEventos: '{n} eventos registrados',
    tlineSinEventos: 'Todavía no hay eventos',
    tlineSinEventosSub: 'Registrá vacunas, pesos y más para ver el historial aquí.',
    tlineVacuna: 'Vacuna',
    tlineDesparasitacion: 'Desparasitación',
    tlineMedicamento: 'Medicamento',
    tlinePeso: 'Peso',
    tlineEstudio: 'Estudio',
    tlineGrooming: 'Grooming',
    tlineTurno: 'Turno',
    tlineAviso: 'Aviso',
    tlineActivo: 'Activo',
    tlineResuelto: '✓ Resuelto',
    tlineProxima: 'Próxima: {fecha}',
    histVolver: 'Volver',
    histCompartirRedes: 'Compartir en redes',
    histConectar: 'Conectar',
    histConectarLabel: 'Conectar {red}',
    histEmailLabel: 'Tu email aparecerá en la historia.',
    histEmailPh: 'tucorreo@ejemplo.com',
    histGuardar: 'Guardar',
    histCambiar: 'Cambiar',
    histEmailDe: 'Email de {red}',
    histGenerando: 'Generando…',
    histListaIg: '¡Lista para Instagram!',
    histListaFb: '¡Lista para Facebook!',
    histCompartirIg: 'Compartir en Instagram Stories',
    histCompartirFb: 'Compartir en Facebook',
    histEnCelular: '📱 En el celular:',
    histPasoIg: 'Abrí Instagram → ➕ Nueva historia → elegí la imagen',
    histPasoFb: 'Abrí Facebook → ➕ Nueva historia → elegí la imagen',
    histDescargar: 'Solo descargar imagen',
    mpnVolver: 'Volver',
    mpnNuevoChip: 'Nuevo perro',
    mpnTitle: 'Registrá a tu perro',
    mpnSub: 'Guardá todos sus datos. Si algún día se pierde, ya tenés todo listo.',
    mpnLoginSub: 'Iniciá sesión para registrar tu perro.',
    mpnLimiteTitle: 'Límite del plan Gratis',
    mpnLimiteSub: 'Con el plan Gratis podés registrar 1 perro. Pasate a VecindogPro para perros ilimitados.',
    mpnVerPro: 'Ver plan Pro',
    mpnVolverLista: 'Volver a Mis perros',
    mpnErrNombre: 'El nombre es obligatorio.',
    mpnGuardando: 'Guardando…',
    mpnGuardar: 'Guardar perfil de {nombre}',
    mpnSecDatos: 'Datos básicos',
    mpnSecFotos: 'Fotos',
    mpnSecFotosSub: 'Subí hasta {max} fotos. La primera será la principal.',
    mpnSecVet: 'Veterinario habitual',
    mpnSecVetOpcional: 'Opcional. Útil si el perro se pierde y alguien lo encuentra.',
    mpnSecVacunas: 'Carnet de vacunas',
    mpnSecVacunasSub: 'Agregá todas las vacunas que tenga registradas.',
    mpnNombre: 'Nombre',
    mpnRaza: 'Raza',
    mpnColor: 'Color principal',
    mpnColorPh: 'Seleccioná un color',
    mpnSexo: 'Sexo',
    mpnSexoMacho: 'macho',
    mpnSexoHembra: 'hembra',
    mpnTamano: 'Tamaño',
    mpnFechaNac: 'Fecha de nacimiento',
    mpnChip: 'N° de microchip',
    mpnEsterilizado: 'Está esterilizado/a (castrado o ligado)',
    mpnDescripcion: 'Descripción / características',
    mpnDescripcionPh: 'Marcas especiales, manchas, cicatrices, collar habitual, comportamiento…',
    mpnAlergias: 'Alergias / condiciones especiales',
    mpnAlergiasPh: 'Alérgico a X antibiótico, condición crónica, dieta especial…',
    mpnAlergiasInfo: 'Se mostrará en la identificación del perro.',
    mpnDireccion: 'Dirección de tu casa',
    mpnDireccionPh: 'Ej: Av. Alem 1200, Villa Mitre',
    mpnDireccionInfo: 'Si algún día lo perdés, se usará para completar el aviso automáticamente.',
    mpnFotoSubir: 'Subir fotos',
    mpnFotoFormato: 'JPG, PNG o WebP · Máx. 5 MB c/u',
    mpnFotoErrImagen: 'Solo se permiten imágenes.',
    mpnFotoErrTamano: 'Cada foto debe pesar menos de 5 MB.',
    mpnFotoErrMax: 'Máximo {max} fotos.',
    mpnFotoPrincipal: 'Principal',
    mpnVetNombre: 'Nombre / clínica',
    mpnVetNombrePh: 'Dr. García / Clínica Mascotas',
    mpnVetTel: 'Teléfono',
    mpnVacunaAgregar: 'Agregar vacuna',
    mpnVacunaNum: 'Vacuna #{n}',
    mpnVacunaNombre: 'Nombre',
    mpnVacunaFecha: 'Fecha',
    mpnVacunaVet: 'Veterinario/a',
    mpnVacunaProxima: 'Próxima dosis',
    mpnVacunaNotas: 'Notas',
    mpnVacunaNombrePh: 'Séxtuple, Antirrábica…',
    mpnVacunaVetPh: 'Nombre o clínica',
    mpnVacunaNotasPh: 'Lote, observaciones del veterinario…',
    mpnVacunaSinVacunas: 'Todavía no agregaste vacunas.',
    publVolver: 'Volver',
    publHeroChip: 'Para negocios locales',
    publHeroTitle: 'Llegá a quienes ya cuidan a sus mascotas',
    publHeroSub: 'Vecindog conecta a dueños de perros de toda Argentina cuando más lo necesitan. Mostrá tu negocio en el momento exacto.',
    publHeroWa: 'Hablar por WhatsApp',
    publHeroMail: 'Escribir por email',
    publFormatosTitle: 'Formatos disponibles',
    publFormatosSub: 'Así se ve tu negocio en Vecindog. Cada formato está diseñado para un momento distinto.',
    publPreciosTitle: 'Planes simples, sin letra chica',
    publPreciosSub: 'Mes a mes. Sin contrato. Cancelás cuando querés.',
    publMasElegido: '★ Más elegido',
    publPrecioEspecial: '¿Necesitás algo especial? {link} y armamos un plan a medida.',
    publPorQueTitle: 'Publicidad con contexto, no con algoritmos',
    publPorQueSub: 'Los usuarios de Vecindog ya están pensando en sus mascotas cuando ven tu anuncio. No compite con redes sociales ni con publicidad genérica — aparecés cuando más importa.',
    publPorQueChip: 'Por qué Vecindog',
    publFaqTitle: 'Preguntas frecuentes',
    publCtaTitle: '¿Listo para llegar a más clientes?',
    publCtaSub: 'Escribinos y activamos tu campaña en menos de 24 horas.',
    publModalFotolabel: 'Logo o foto del negocio',
    publModalFotoCambiar: 'Cambiar imagen',
    publModalFotoSubir: 'Subir logo o foto',
    publModalLogoLabel: 'Logo cuadrado',
    publModalLogoCambiar: 'Cambiar logo',
    publModalLogoSubir: 'Subir logo cuadrado',
    publModalNegocioLabel: 'Nombre del negocio',
    publModalTaglineLabel: 'Descripción corta (tagline)',
    publModalLinkLabel: 'Link del negocio',
    publModalLinkInfo: 'Web, Instagram, WhatsApp — adonde van los clicks',
    publModalCtaLabel: 'Texto del botón',
    publModalContactoLabel: 'Tus datos de contacto',
    publModalEmailLabel: 'Email',
    publModalTelLabel: 'Teléfono / WhatsApp',
    publModalErrFotoTam: 'La imagen debe pesar menos de 5 MB.',
    publModalErrLogoTam: 'El logo debe pesar menos de 5 MB.',
    publModalErrNegocio: 'Ingresá el nombre de tu negocio.',
    publModalErrEmail: 'Ingresá tu email.',
    publModalErrLink: 'Ingresá el link de tu negocio.',
    publModalErrLinkFmt: 'El link debe ser una URL válida. Ejemplo: https://instagram.com/tunegocio',
    publModalErrTel: 'El teléfono debe tener al menos 10 dígitos. Ejemplo: +54 9 291 4050210',
    publModalPagandoCon: 'Serás redirigido a Mercado Pago. Tu anuncio se activa automáticamente al confirmar el pago.',
    publModalPagar: 'Ir a pagar con Mercado Pago',
    publVistaPrevia: 'Vista previa',
    publStats0label: 'Vecinos activos',
    publStats1label: 'Argentina',
    publStats2label: 'Orgánico · sin bots',
    publStats3label: 'A dueños de mascotas',
    // mi-comercio
    mcomVolver: 'Mi perfil',
    mcomVerPerfil: 'Ver perfil público',
    mcomSinComercioTitle: 'No tenés un comercio registrado',
    mcomSinComercioSub: 'Unite a la Red Vecindog y aparecé en el mapa de dueños de mascotas.',
    mcomRegistrar: 'Registrar mi comercio',
    mcomActivo: 'Activo',
    mcomPendiente: 'Pendiente activación',
    mcomReviews: 'Reviews',
    mcomVence: 'Vence',
    mcomEditar: 'Editar datos del comercio',
    mcomStatsTitle: 'Estadísticas (últimos 30 días)',
    mcomStatsVistas30: 'Visitas',
    mcomStatsVistas7: 'Esta semana',
    mcomStatsTelefono: 'Clicks teléfono',
    mcomStatsMapa: 'Clicks mapa',
    mcomStatsLink: 'Clicks link',
    mcomStatsCargando: 'Cargando estadísticas…',
    mcomNovedadesTitle: 'Novedades y Ofertas',
    mcomNueva: 'Nueva',
    mcomNovTituloPlaceholder: 'Título de la novedad (ej: Promoción de baño + corte)',
    mcomNovDescPlaceholder: 'Descripción (opcional)',
    mcomNovError: 'No se pudo publicar la novedad.',
    mcomPublicando: 'Publicando...',
    mcomPublicar: 'Publicar',
    mcomCancelar: 'Cancelar',
    mcomNovVacia: 'Publicá novedades, ofertas o turnos disponibles para que los clientes las vean.',
    mcomDatosActualizados: '¡Datos actualizados!',
    mcomEditarTitle: 'Editar comercio',
    mcomFotoLabel: 'Foto del comercio',
    mcomSubirFoto: 'Subir foto',
    mcomNombreLabel: 'Nombre del comercio *',
    mcomCategoriaLabel: 'Categoría *',
    mcomCategoriaPlaceholder: 'Seleccioná una categoría',
    mcomTelefonoLabel: 'Teléfono de contacto *',
    mcomDescripcionLabel: 'Descripción (opcional)',
    mcomDescripcionPlaceholder: 'Describí brevemente tus servicios',
    mcomDireccionLabel: 'Dirección',
    mcomApertura: 'Apertura',
    mcomCierre: 'Cierre',
    mcomDiasLabel: 'Días de atención',
    mcomDiasPlaceholder: 'Seleccioná los días',
    mcomLinkLabel: 'Sitio web / Instagram / WhatsApp (opcional)',
    mcomGuardando: 'Guardando...',
    mcomGuardarCambios: 'Guardar cambios',
    // mis-perros/[id]
    mpdMisPerros: 'Mis perros',
    mpdGenerarCartel: 'Generar cartel',
    mpdPublicarRedes: 'Publicar en Redes Sociales',
    mpdQrCollar: 'QR Collar',
    mpdDiario: 'Diario',
    mpdEditarPerfil: 'Editar perfil',
    mpdRegistrado: '¡{nombre} está registrado!',
    mpdRegistradoSub: 'Si algún día se pierde, ya tenés toda su info guardada. También podés publicar un aviso desde Perdidos.',
    mpdSaludable: '💚 Saludable',
    mpdEnTratamiento: '🟡 En tratamiento',
    mpdEnRecuperacion: '🔵 En recuperación',
    mpdBannerProText: 'Identificación, vacunas y estudios son funciones de VecindogPro',
    mpdVerPro: 'Ver Pro',
    mpdVencidoUno: 'Vencido/a: {nombre}',
    mpdVencidosN: '{n} vencidos/as: {lista}',
    mpdProximaUna: '{nombre} vence en los próximos 30 días',
    mpdProximasN: '{n} vencen en los próximos 30 días: {lista}',
    mpdIdentificacion: 'Identificación',
    mpdGuardarPDF: 'Guardar / Enviar PDF',
    mpdMicrochip: 'Microchip',
    mpdFechaNacLabel: 'Fecha de nac.',
    mpdEdadLabel: 'Edad',
    mpdCiudadLabel: 'Ciudad',
    mpdEsterilizadoLabel: 'Esterilizado/a',
    mpdAlergiasLabel: 'Alergias / condiciones',
    mpdVetHabitual: 'Veterinario habitual',
    mpdCarnetVacunas: 'Carnet de vacunas',
    mpdVacunasRegistradas: '{n} registrada{s}',
    mpdSinVacunas: 'No hay vacunas registradas.',
    mpdEncontrarVet: 'Encontrá un veterinario',
    mpdRedVetSub: 'Clínicas y vets en la Red Vecindog',
    mpdVerVets: 'Ver vets →',
    mpdAvisoActivo: 'Aviso activo — en búsqueda',
    mpdAvisoActivoSub: 'Ya hay un aviso publicado para {nombre}. ¿Lo seguís buscando? Renovalo para que aparezca primero.',
    mpdAvisoRenovado: '¡Aviso renovado!',
    mpdRenovarAviso: '¿Seguís buscando? Renovar aviso',
    mpdVerAviso: 'Ver aviso',
    mpdPerdiste: '¿Perdiste a {nombre}?',
    mpdPerdistesSub: 'Publicá un aviso ahora con toda esta información para que los vecinos te ayuden.',
    mpdPublicarAviso: 'Publicar aviso de búsqueda',
    mpdPerroNoEncontrado: 'Perro no encontrado',
    mpdVolverListado: 'Volver',
    mpdEsterilizado: 'Esterilizado/a',
    mpdSubirFoto: 'Subir foto',
    mpdCambiarFoto: 'Cambiar foto',
    mpdFotoError: 'La foto debe pesar menos de 5 MB.',
    mpdNombreLabel: 'Nombre',
    mpdRazaLabel: 'Raza',
    mpdColorLabel: 'Color',
    mpdColorPlaceholder: 'Negro, marrón…',
    mpdSexoLabel: 'Sexo',
    mpdTamanoLabel: 'Tamaño',
    mpdFechaNacFormLabel: 'Fecha de nacimiento',
    mpdChipPlaceholder: 'Nº de chip',
    mpdEsterilizadoCheck: 'Esterilizado/a',
    mpdDescripcionLabel: 'Descripción',
    mpdDescripcionPlaceholder: 'Marcas especiales, comportamiento…',
    mpdAlergiasCond: 'Alergias / condiciones especiales',
    mpdAlergiasPlaceholder: 'Alérgico a X, condición crónica, dieta especial…',
    mpdVetNombreLabel: 'Nombre / clínica',
    mpdVetTelefonoLabel: 'Teléfono',
    mpdErrGuardar: 'No se pudo guardar. Intentá de nuevo.',
    mpdCancelar: 'Cancelar',
    mpdGuardarCambios: 'Guardar cambios',
    mpdEliminarPerfil: 'Eliminar perfil de {nombre}',
    mpdEliminarConfirm: '¿Eliminar a {nombre}?',
    mpdEliminarWarning: 'Esta acción es irreversible. Se borrará el perfil, las vacunas y todos los archivos de {nombre}.',
    mpdSiEliminar: 'Sí, eliminar',
    mpdEnviarCarnet: 'Enviar carnet de vacunas',
    mpdVacunaVencida: 'Vencida',
    mpdVacunaVigente: 'Vigente',
    mpdVacunaProxima: 'Próxima:',
    mpdVacunaLabel: 'Vacuna',
    mpdVacunaPlaceholder: 'Séxtuple, Antirrábica…',
    mpdFechaReqLabel: 'Fecha',
    mpdProximaDosis: 'Próxima dosis',
    mpdVetFormLabel: 'Veterinario',
    mpdNotasLabel: 'Notas',
    mpdVacunaErrReq: 'Nombre y fecha son obligatorios.',
    mpdAgregarVacuna: 'Agregar vacuna',
    mpdGuardar: 'Guardar',
    mpdAgregar: '+ Agregar',
    mpdEnviar: 'Enviar',
    mpdVer: 'Ver',
    mpdEditar: 'Editar',
    mpdCerrar: 'Cerrar',
    mpdRegistrar: 'Registrar',
    mpdConfirmarSubir: 'Confirmar y subir',
    mpdErrSubir: 'No se pudo subir el archivo. Verificá tu conexión e intentá de nuevo.',
    mpdAirTagTitle: 'AirTag de Apple',
    mpdAirTagLabel: 'Número de serie del AirTag',
    mpdAirTagErrReq: 'Ingresá el número de serie.',
    mpdAirTagTip: 'Lo encontrás en Ajustes → Apple ID → Buscar → tu AirTag, o en la caja.',
    mpdAirTagNSerie: 'N° de serie',
    mpdAirTagPerdidoTitle: '💡 Si se perdió tu perro',
    mpdAirTagPerdidoDesc: 'Activá el Modo Perdido en la app Buscar de tu iPhone. Así cualquier iPhone cercano que detecte el AirTag te manda su ubicación automáticamente.',
    mpdAirTagModoLink: 'Cómo activar Modo Perdido',
    mpdAirTagVacio: 'No hay AirTag registrado.',
    mpdChipCertTitle: 'Certificado de Chip',
    mpdSubirCertificado: 'Subir certificado',
    mpdNumeroChip: 'Número de chip',
    mpdSinRegistrar: 'Sin registrar',
    mpdEditarBtn: 'Editar',
    mpdAgregarBtn: 'Agregar',
    mpdChipPlaceholderForm: 'Nº de chip (15 dígitos)',
    mpdSinCertificados: 'No hay certificados subidos.',
    mpdVerBtn: 'Ver',
    mpdCVITitle: 'Certificado CVI',
    mpdCVIPaises: 'Consultá los requisitos por país',
    mpdCVIBuscar: 'Buscar país de destino…',
    mpdCVISinDestino: 'No se encontró ese destino.',
    mpdCVIFuente: 'Fuente: SENASA · Los requisitos pueden cambiar sin previo aviso.',
    mpdSubirArchivo: 'Subir archivo',
    mpdPorVencer: 'Por vencer',
    mpdSinArchivos: 'No hay archivos subidos.',
    mpdCotizacionSub: '¿Necesitás una cotización?',
    mpdCotizacionLink: 'Solicitá aquí',
    mpdTurnoRegistrado: 'Turno registrado',
    mpdRegistrarTurnoEco: 'Registrar turno de ecografía',
    mpdRegistrarTurnoRad: 'Registrar turno de radiografía',
    mpdTurnoNotaPlaceholder: 'Nota opcional (ej: Dr. García, Clínica San Roque)',
    mpdRegistrarBtn: 'Registrar',
    mpdTeneTurnoEco: '¿Tenés turno de ecografía?',
    mpdTeneTurnoRad: '¿Tenés turno de radiografía?',
    mpdRegistraAvisamos: 'Registrá y te avisamos',
    mpdEnviarEstudio: 'Enviar estudio',
    mpdEnviarEmail: 'Enviar por email',
    mpdEnviarWA: 'Enviar por WhatsApp',
    mpdCotizOk: '¡Solicitud enviada!',
    mpdCotizOkSub: 'Nos contactaremos con vos a la brevedad para darte la cotización.',
    mpdCotizTitle: 'Solicitar cotización',
    mpdCotizSub: 'Análisis de laboratorio para tu perro',
    mpdCotizNombreLabel: 'Nombre y Apellido',
    mpdCotizEmailLabel: 'Email',
    mpdCotizPerroLabel: 'Nombre del perro',
    mpdCotizRecetaLabel: 'Receta del veterinario',
    mpdCotizSubirReceta: 'Subir receta del veterinario',
    mpdCotizErrCampos: 'Completá todos los campos requeridos.',
    mpdCotizErrEmail: 'Ingresá un email válido.',
    mpdCotizEnviar: 'Enviar solicitud',
    mpdQRTitle: 'QR para el collar',
    mpdQRDesc: 'Imprimilo y colgalo del collar de {nombre}. Si se pierde, cualquiera puede escanearlo.',
    mpdQRDescargar: 'Descargar PNG',
    mpdMedicamentosTitle: 'Medicamentos',
    mpdMedActivos: '{n} activo{s}',
    mpdMedLabel: 'Medicamento',
    mpdMedPlaceholder: 'Ej: Tramadol, Amoxicilina',
    mpdMedDosis: 'Dosis',
    mpdMedDosisPlaceholder: 'Ej: 5mg',
    mpdMedFrecuencia: 'Frecuencia',
    mpdMedFrecuenciaPlaceholder: 'Ej: Cada 8hs',
    mpdMedInicio: 'Inicio',
    mpdMedFin: 'Fin (opcional)',
    mpdMedErrReq: 'Ingresá al menos el nombre y la fecha de inicio.',
    mpdSinMedActivos: 'No hay medicamentos activos.',
    mpdMedDesde: 'Desde',
    mpdMedHasta: 'hasta',
    mpdMedAnteriores: 'Anteriores',
    mpdEnviarMed: 'Enviar medicamentos',
    mpdHistoriaTitle: 'Historia Clínica',
    mpdHistoriaResumen: 'resumen completo',
    mpdSinDatos: 'Sin datos',
    mpdHCPerfil: 'Perfil',
    mpdHCVacunas: 'Carnet de Vacunas',
    mpdHCAnalisis: 'Análisis de Laboratorio',
    mpdHCRadios: 'Radiografías',
    mpdHCEcos: 'Ecografías',
    mpdHCDesparas: 'Desparasitaciones',
    mpdHCPeso: 'Historial de Peso',
    mpdHCPesoMas: '+ {n} registros anteriores',
    mpdEnviarHistoria: 'Enviar Historia Clínica',
    mpdEnviarHistoriaSub: 'El destinatario puede verla sin cuenta',
    mpdDesparasTitle: 'Desparasitaciones',
    mpdDesparasRegistradas: '{n} registrada{s}',
    mpdEnviarDesparas: 'Enviar desparasitaciones',
    mpdSinDesparas: 'No hay desparasitaciones registradas.',
    mpdDesparasProductoLabel: 'Producto',
    mpdDesparasProductoPlaceholder: 'NexGard, Frontline…',
    mpdDesparasTipoLabel: 'Tipo',
    mpdDesparasProxima: 'Próxima aplicación',
    mpdDesparasErrReq: 'Producto y fecha son obligatorios.',
    mpdPesoTitle: 'Historial de peso',
    mpdPesoRegistros: '{n} registro{s}',
    mpdPesoRegistrar: '+ Registrar',
    mpdPesoUltimo: 'Último peso',
    mpdPesoVsAnterior: 'vs anterior',
    mpdPesoKgLabel: 'Peso (kg)',
    mpdPesoErrReq: 'Ingresá una fecha y un peso válido.',
    mpdPesoEvolucion: 'Evolución',
    mpdSinPeso: 'No hay registros de peso.',
    mpdEnviarPeso: 'Enviar historial de peso',
    mpdVisitasTitle: 'Visitas al veterinario',
    mpdVisitaMotivo: 'Motivo',
    mpdVisitaMotivoPlaceholder: 'Control de rutina, fiebre, etc.',
    mpdVisitaDiagnostico: 'Diagnóstico',
    mpdVisitaDiagPlaceholder: 'Gastroenteritis, dermatitis, etc.',
    mpdVisitaTratamiento: 'Tratamiento',
    mpdVisitaTratPlaceholder: 'Antibiótico 5 días, reposo, etc.',
    mpdVisitaErrReq: 'Fecha y motivo son obligatorios.',
    mpdSinVisitas: 'No hay visitas registradas.',
    mpdProcedimientosTitle: 'Procedimientos y cirugías',
    mpdProcDescLabel: 'Descripción',
    mpdProcDescPlaceholder: 'Castración, limpieza dental, etc.',
    mpdProcVetLabel: 'Veterinario / Clínica',
    mpdProcErrReq: 'Fecha y descripción son obligatorias.',
    mpdSinProcedimientos: 'No hay procedimientos registrados.',
    mpdDietaTitle: 'Dieta y alimentación',
    mpdDietaMarca: 'Marca / alimento',
    mpdDietaMarcaPlaceholder: 'Royal Canin, Purina, etc.',
    mpdDietaCantidad: 'Cantidad',
    mpdDietaCantidadPlaceholder: '250g por comida',
    mpdDietaFrecuencia: 'Frecuencia',
    mpdDietaFrecuenciaPlaceholder: '2 veces al día',
    mpdDietaNotasLabel: 'Notas / restricciones',
    mpdDietaNotasPlaceholder: 'Sin pollo, bajo en sodio...',
    mpdDietaAlimentoLabel: 'Alimento',
    mpdDietaRestriccionesLabel: 'Restricciones / notas',
    mpdSinDieta: 'No hay información de dieta cargada.',
    mpdGroomingTitle: 'Baño y peluquería',
    mpdGroomingConfigurar: 'Configurar',
    mpdGroomingUltimo: 'Último baño/peluquería',
    mpdGroomingCadaCuantos: 'Cada cuántos días',
    mpdGroomingUltimoLabel: 'Último',
    mpdGroomingProximoLabel: 'Próximo',
    mpdSinGrooming: 'Configurá el recordatorio de baño y peluquería.',
    mpdGaleriaTitle: 'Galería de fotos',
    mpdAgregarFoto: 'Agregar foto',
    mpdSinFotos: 'No hay fotos en la galería.',
    mpdContactosTitle: 'Contactos de emergencia',
    mpdContactoRelacion: 'Relación',
    mpdContactoRelacionPlaceholder: 'Paseador, familiar, etc.',
    mpdContactoNotasPlaceholder: 'Solo para emergencias, etc.',
    mpdContactoErrReq: 'Nombre y teléfono son obligatorios.',
    mpdSinContactos: 'No hay contactos de emergencia cargados.',
    mpdCachorro: 'Cachorro',
    mpdMes: 'mes',
    mpdMeses: 'meses',
    mpdAnio: 'año',
    mpdAnios: 'años',

    encPregunta: '¿Encontraste a este perro?',
    encDuenio: 'Dueño: {nombre}',
    encAvisar: 'Avisarle al dueño que lo encontré',
    encLlamar: 'Llamar al dueño: {tel}',
    encEnviado: '¡Aviso enviado!',
    encEnviadoDesc: 'Le avisamos al dueño de {nombre} que lo encontraste.',
    encLlamarTambien: 'También podés llamar al {tel}.',
    encEncontreA: 'Encontré a {nombre}',
    encEnviarDesc: 'Le avisamos al dueño por email y notificación.',
    encMensaje: 'Mensaje (opcional)',
    encTelefono: 'Tu teléfono (opcional)',
    encEnviando: 'Enviando...',
    encAvisarBtn: 'Avisar al dueño',
    encErrEnviar: 'No se pudo enviar el aviso. Intentá de nuevo.',

    hpbImprimir: 'Imprimir / Exportar PDF',

    revNovedades: 'Novedades y Ofertas',
    revReviews: 'Reviews',
    revSinReviews: 'Todavía no hay reviews',
    revPrimero: 'Sé el primero en valorar {nombre}.',
    revEditarReview: 'Editar mi review',
    revEscribirReview: 'Escribir review',
    revGracias: '¡Gracias por tu review!',
    revOpinion: 'Tu opinión',
    revPlaceholder: 'Contanos tu experiencia (opcional)...',
    revPublicar: 'Publicar review',
    revErrReview: 'No se pudo guardar la review. Intentá de nuevo.',
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
    navMiPerfil: 'My profile',
    topEscapistasTitle: 'Most frequent escapees 🏃',
    adBannerTitle: 'Do you have a local business for pet owners?',
    adBannerSub: 'Reach neighbors already looking for products and services for their pets.',
    adBannerCta: 'Advertise here',
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
    rvnPromoBannerTitle: 'First 50 businesses per city: 3 months completely free',
    rvnPromoBannerDesc: 'As part of the Red Vecindog launch, the first 50 businesses per city to register get the first 3 months at no cost, with full access to all platform benefits.',
    rvnPromoMonths: '/month from the 4th month',
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
    pbrStep2Data: 'Dog details',
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
    ppxCargando: 'Confirming your payment…',
    ppxOkTitle: 'Welcome to VecindogPro!',
    ppxOkSub: 'Your account now has access to all Pro features for 30 days.',
    ppxIrMisPerros: 'Go to My dogs',
    ppxVolver: 'Back to home',
    ppxPendienteTitle: 'Payment in progress',
    ppxPendienteSub: 'Your payment is being processed. We will notify you by email when confirmed.',
    ppxErrorTitle: "We couldn't confirm",
    ppxErrorSub: 'There was an issue verifying your payment. If you were charged, contact us at',
    ppxVolverPlanes: 'Back to plans',
    rvpxCargando: 'Verifying payment and activating your business…',
    rvpxErrorTitle: 'There was a problem',
    rvpxPendienteTitle: 'Payment in progress!',
    rvpxBienvenidoTitle: 'Welcome to the Network!',
    rvpxPagoTitle: 'Payment received!',
    rvpxErrorSub: 'Contact us at hola@mivecindog.com.ar and we\'ll sort it out.',
    rvpxPendienteSub: 'Your payment is being processed. Your business activates automatically once confirmed.',
    rvpxActivadoSub: 'Your business is now part of the Vecindog Network and appears on the map for dog owners.',
    rvpxPagoSub: 'You\'ll receive an email confirmation when your business is active on the map.',
    rvpxNegocioTiene: 'Your business now has',
    rvpxBenef1: 'Presence on the dog search map',
    rvpxBenef2: 'Phone and address visible to neighbors',
    rvpxPlan: 'Vecindog Network · 30 days',
    rvpxActualizar: 'Need to update any details? Contact us at',
    rvpxIrApp: 'Go to app',
    pubpxCargando: 'Verifying payment and activating your ad…',
    pubpxErrorTitle: 'There was a problem',
    pubpxPendienteTitle: 'Payment in progress!',
    pubpxRenovadoTitle: 'Ad renewed!',
    pubpxActivadoTitle: 'Your ad is active!',
    pubpxPagoTitle: 'Payment received!',
    pubpxErrorSub: 'Contact us at hola@mivecindog.com.ar and we\'ll sort it out.',
    pubpxPendienteSub: 'Your payment is being processed. Your ad activates automatically once confirmed.',
    pubpxRenovadoSub: 'Your ad was renewed for 30 more days. No need to re-enter any details.',
    pubpxActivadoSub: 'Your Vecindog ad is active for the next 30 days.',
    pubpxPagoSub: 'You\'ll receive an email confirmation when your ad is active.',
    pubpxEspacios: 'Active placements',
    pubpxActualizar: 'Need to change something? Contact us at',
    pubpxIrApp: 'Go to app',
    pubrvChip: 'Renew advertising',
    pubrvVencida: 'Your ad has expired. Renewing reactivates it for 30 more days.',
    pubrvExtender: 'Extend your ad for 30 more days.',
    pubrvPlan: 'Plan',
    pubrvVencimientoActual: 'Current expiry',
    pubrvVencido: '(expired)',
    pubrvNuevoVencimiento: 'New expiry',
    pubrvTotal: 'Total',
    pubrvPagoFallido: 'Payment was not processed. Please try again.',
    pubrvNoEncontrado: 'Ad not found',
    pubrvNoEncontradoSub: 'The renewal link is invalid or has expired.',
    pubrvVerPlanes: 'View advertising plans',
    pubrvCargando: 'Loading…',
    pubrvBtn: 'Renew with Mercado Pago',
    pubrvPagoCon: 'You can pay with debit, credit card or Mercado Pago account.',
    pubrvVerTodos: 'View all plans',
    svcExp1: "I'm a dog owner",
    svcExp2: 'I had dogs as a child',
    svcExp3: "I've cared for friends' / family's dogs",
    svcExp4: 'I worked with animals',
    svcExp5: 'No prior experience',
    svcDisp1: 'Monday to Friday',
    svcDisp2: 'Weekends',
    svcDisp3: 'Any day',
    svcDisp4: 'Daytime only',
    cubcTitle: 'Looking for a sitter',
    cubcSub: 'Post an ad to find someone to look after your dog.',
    cubcCualPerro: 'Which of your dogs?',
    cubcCargandoPerros: 'Loading your dogs…',
    cubcSinPerros: "You don't have any registered dogs.",
    cubcRegistra: 'Register one →',
    cubcSinPerroSub: 'You can also continue without selecting a dog and fill in the details manually.',
    cubcFechas: 'For which dates?',
    cubcOpcional: '(optional)',
    cubcDesde: 'From',
    cubcHasta: 'To',
    cubcZona: 'Area / Neighborhood',
    cubcDescripcion: 'Description',
    cubcDescripcionPh: 'Special needs, routines, important info for the sitter…',
    cubcContacto: 'WhatsApp contact',
    cubcContactoPh: 'e.g. 1122334455',
    cubcContactoError: 'Incomplete number — enter the full number with area code. e.g. +54 9 291 4050210',
    cubcPublicar: 'Post ad',
    cubcErrLogin: 'You need to sign in to post.',
    cubcErrZona: 'Area is required.',
    cubcErrContacto: 'WhatsApp contact is required.',
    cubcErrContactoShort: 'WhatsApp must have at least 10 digits. Example: +54 9 291 4050210',
    cubcErrPublicar: "Couldn't post. Please try again.",
    cubcLoginSub: 'Sign in to post a care request.',
    cubcLoginBtn: 'Sign in',
    cubcOkTitle: 'Ad posted!',
    cubcOkSub: 'Your request is now listed in the care section.',
    qqcTitle: 'I want to be a sitter',
    qqcSub: 'Complete your sitter profile so owners can find you.',
    qqcNombre: 'Your name or nickname',
    qqcNombrePh: 'e.g. Martina G.',
    qqcExperiencia: 'Experience with dogs',
    qqcDisponibilidad: 'Availability',
    qqcCuantos: 'How many dogs can you look after at once?',
    qqcTienePerros: 'Do you have dogs at home?',
    qqcDisp5: 'Overnight stays included',
    qqcInfo: 'Additional info',
    qqcInfoPh: 'Tell us more: do you have a yard, can you do overnights, breeds you\'re comfortable with…',
    qqcZona: 'Area / Neighborhood',
    qqcContacto: 'WhatsApp contact',
    qqcRegistrar: 'Register as sitter',
    qqcProTitle: 'Exclusive VecindogPro feature',
    qqcProSub: 'To register as a sitter and receive ratings from owners, you need an active Pro plan.',
    qqcVerPlanes: 'View plans',
    qqcLoginSub: 'Sign in to register as a sitter.',
    qqcOkTitle: 'You registered as a sitter!',
    qqcOkSub: 'Your profile is now listed among available sitters.',
    qqcErrLogin: 'You need to sign in to register.',
    qqcErrNombre: 'Name is required.',
    qqcErrZona: 'Area is required.',
    qqcErrContacto: 'WhatsApp contact is required.',
    qqcErrContactoShort: 'WhatsApp must have at least 10 digits. Example: +54 9 291 4050210',
    qqcErrRegistrar: "Couldn't register. Please try again.",
    qqtTitle: 'I want to transport dogs',
    qqtSub: 'Complete your transporter profile so owners can find you.',
    qqtCuantos: 'How many dogs can you transport at once?',
    qqtVehiculo: 'What vehicle do you have?',
    qqtDisp5: 'Flexible schedule',
    qqtInfoPh: 'Tell us more: your own vehicle, areas you cover, vet trips…',
    qqtRegistrar: 'Register as transporter',
    qqtProSub: 'To register as a transporter and receive ratings from owners, you need an active Pro plan.',
    qqtLoginSub: 'Sign in to register as a transporter.',
    qqtOkTitle: 'You registered as a transporter!',
    qqtOkSub: 'Your profile is now listed among available transporters.',
    qqtErrRegistrar: "Couldn't register. Please try again.",
    quidBack: 'Available sitters',
    quidSobre: 'About this sitter',
    quidContactar: 'Contact',
    quidDisponibilidad: 'Availability:',
    quidCalificaciones: 'Ratings',
    quidCalificar: 'Rate',
    quidEditarCal: 'Edit rating',
    quidCalGuardada: 'Rating saved! Thanks for your feedback.',
    quidSinCal: 'No ratings for this sitter yet.',
    quidSePrimero: 'Be the first!',
    quidNoEncontrado: "This sitter's profile was not found.",
    quidModalTitle: 'Rate sitter',
    quidPuntuacion: 'Overall rating',
    quidCuidadoPerro: 'How was the care of your dog?',
    quidFuePuntual: 'Were they on time?',
    quidBuenaCom: 'Was communication good?',
    quidRecomienda: 'Would you recommend them to other owners?',
    quidComentario: 'Comment',
    quidComentarioPh: 'Share how the experience went…',
    quidCancelar: 'Cancel',
    quidGuardar: 'Save',
    quidErrEstrella: 'Select at least one star.',
    quidExcelente: 'Excellent 🐾',
    quidBueno: 'Good 👍',
    quidRegular: 'OK 😐',
    quidPuntual: 'On time',
    quidBuenaComunicacion: 'Good communication',
    quidLoRecomienda: 'Recommends them',
    quidCuidadoBadge: '🐾 Care',
    quidRecomendaciones: '% recommend',
    tridBack: 'Available transporters',
    tridSobre: 'About this transporter',
    tridNoEncontrado: "This transporter's profile was not found.",
    tridModalTitle: 'Rate transporter',
    tridCuidadoPerro: 'How was the treatment of your dog?',
    tridTratoBadge: '🐾 Treatment',
    tridCuidadoBadge: '🐾 Treatment',
    tridSinCal: 'No ratings for this transporter yet.',
    rvcatBack: 'Vecindog Network',
    rvcatNoEncontrado: 'Category not found.',
    rvcatVolverRvn: 'Back to Vecindog Network',
    rvcatSinInscrip: 'No members yet',
    rvcatProTitle: 'Exclusive VecindogPro',
    rvcatVerPro: 'View Pro',
    rvcatVerNegocio: 'View business',
    rvcatCiudadTitle: 'What city are you in?',
    rvcatCiudadSub: 'You need to choose your city to see local businesses.',
    rvcatCiudadPh: 'Type your city…',
    rvcatUsarDeTodas: 'Use "{q}" anyway',
    rvcatEmptySub: 'Do you have a business in this category? Be the first to join.',
    rvcatRegistrar: 'Register my business',
    rvcatVolver: 'Back',
    rvcatConfirmar: 'Confirm',
    rvcatProSub: 'Activate Pro to view the details of each business.',
    rvcatProBeneficios: 'With VecindogPro you get',
    rvcatEmptyTitle: 'No members yet in this category',
    cartelVolver: 'Back',
    cartelImprimir: 'Print / Save PDF',
    tlineVolver: 'Back to profile',
    tlineDiario: 'Journal',
    tlineEventos: '{n} events recorded',
    tlineSinEventos: 'No events yet',
    tlineSinEventosSub: 'Record vaccines, weights and more to see the history here.',
    tlineVacuna: 'Vaccine',
    tlineDesparasitacion: 'Deworming',
    tlineMedicamento: 'Medication',
    tlinePeso: 'Weight',
    tlineEstudio: 'Study',
    tlineGrooming: 'Grooming',
    tlineTurno: 'Appointment',
    tlineAviso: 'Post',
    tlineActivo: 'Active',
    tlineResuelto: '✓ Resolved',
    tlineProxima: 'Next: {fecha}',
    histVolver: 'Back',
    histCompartirRedes: 'Share on social media',
    histConectar: 'Connect',
    histConectarLabel: 'Connect {red}',
    histEmailLabel: 'Your email will appear in the story.',
    histEmailPh: 'youremail@example.com',
    histGuardar: 'Save',
    histCambiar: 'Change',
    histEmailDe: '{red} email',
    histGenerando: 'Generating…',
    histListaIg: 'Ready for Instagram!',
    histListaFb: 'Ready for Facebook!',
    histCompartirIg: 'Share on Instagram Stories',
    histCompartirFb: 'Share on Facebook',
    histEnCelular: '📱 On your phone:',
    histPasoIg: 'Open Instagram → ➕ New story → pick the image',
    histPasoFb: 'Open Facebook → ➕ New story → pick the image',
    histDescargar: 'Just download the image',
    mpnVolver: 'Back',
    mpnNuevoChip: 'New dog',
    mpnTitle: 'Register your dog',
    mpnSub: 'Save all their info. If they ever get lost, you\'ll have everything ready.',
    mpnLoginSub: 'Sign in to register your dog.',
    mpnLimiteTitle: 'Free plan limit',
    mpnLimiteSub: 'With the Free plan you can register 1 dog. Upgrade to VecindogPro for unlimited dogs.',
    mpnVerPro: 'View Pro plan',
    mpnVolverLista: 'Back to My dogs',
    mpnErrNombre: 'Name is required.',
    mpnGuardando: 'Saving…',
    mpnGuardar: 'Save {nombre}\'s profile',
    mpnSecDatos: 'Basic info',
    mpnSecFotos: 'Photos',
    mpnSecFotosSub: 'Upload up to {max} photos. The first will be the main one.',
    mpnSecVet: 'Regular vet',
    mpnSecVetOpcional: 'Optional. Useful if the dog gets lost and someone finds them.',
    mpnSecVacunas: 'Vaccination record',
    mpnSecVacunasSub: 'Add all the vaccines on record.',
    mpnNombre: 'Name',
    mpnRaza: 'Breed',
    mpnColor: 'Main color',
    mpnColorPh: 'Select a color',
    mpnSexo: 'Sex',
    mpnSexoMacho: 'male',
    mpnSexoHembra: 'female',
    mpnTamano: 'Size',
    mpnFechaNac: 'Date of birth',
    mpnChip: 'Microchip number',
    mpnEsterilizado: 'Is spayed/neutered',
    mpnDescripcion: 'Description / characteristics',
    mpnDescripcionPh: 'Special marks, spots, scars, usual collar, behavior…',
    mpnAlergias: 'Allergies / special conditions',
    mpnAlergiasPh: 'Allergic to X antibiotic, chronic condition, special diet…',
    mpnAlergiasInfo: 'Will be shown on the dog\'s ID card.',
    mpnDireccion: 'Your home address',
    mpnDireccionPh: 'e.g. 123 Main St, Springfield',
    mpnDireccionInfo: 'If they ever get lost, this will be used to auto-fill the alert.',
    mpnFotoSubir: 'Upload photos',
    mpnFotoFormato: 'JPG, PNG or WebP · Max 5 MB each',
    mpnFotoErrImagen: 'Only image files are allowed.',
    mpnFotoErrTamano: 'Each photo must be under 5 MB.',
    mpnFotoErrMax: 'Maximum {max} photos.',
    mpnFotoPrincipal: 'Main',
    mpnVetNombre: 'Name / clinic',
    mpnVetNombrePh: 'Dr. Smith / Pet Clinic',
    mpnVetTel: 'Phone',
    mpnVacunaAgregar: 'Add vaccine',
    mpnVacunaNum: 'Vaccine #{n}',
    mpnVacunaNombre: 'Name',
    mpnVacunaFecha: 'Date',
    mpnVacunaVet: 'Vet',
    mpnVacunaProxima: 'Next dose',
    mpnVacunaNotas: 'Notes',
    mpnVacunaNombrePh: 'Rabies, Distemper…',
    mpnVacunaVetPh: 'Name or clinic',
    mpnVacunaNotasPh: 'Batch, vet observations…',
    mpnVacunaSinVacunas: 'No vaccines added yet.',
    publVolver: 'Back',
    publHeroChip: 'For local businesses',
    publHeroTitle: 'Reach dog owners when it matters most',
    publHeroSub: 'Vecindog connects dog owners across Argentina when they need help most. Show your business at the right moment.',
    publHeroWa: 'Chat on WhatsApp',
    publHeroMail: 'Send an email',
    publFormatosTitle: 'Available formats',
    publFormatosSub: 'Here\'s how your business looks in Vecindog. Each format targets a different moment.',
    publPreciosTitle: 'Simple plans, no hidden fees',
    publPreciosSub: 'Month to month. No contract. Cancel anytime.',
    publMasElegido: '★ Most popular',
    publPrecioEspecial: 'Need something special? {link} and we\'ll build a custom plan.',
    publPorQueTitle: 'Ads with context, not algorithms',
    publPorQueSub: 'Vecindog users are already thinking about their pets when they see your ad. No competition with social media or generic ads — you appear when it matters.',
    publPorQueChip: 'Why Vecindog',
    publFaqTitle: 'Frequently asked questions',
    publCtaTitle: 'Ready to reach more customers?',
    publCtaSub: 'Message us and we\'ll activate your campaign within 24 hours.',
    publModalFotolabel: 'Logo or business photo',
    publModalFotoCambiar: 'Change image',
    publModalFotoSubir: 'Upload logo or photo',
    publModalLogoLabel: 'Square logo',
    publModalLogoCambiar: 'Change logo',
    publModalLogoSubir: 'Upload square logo',
    publModalNegocioLabel: 'Business name',
    publModalTaglineLabel: 'Short description (tagline)',
    publModalLinkLabel: 'Business link',
    publModalLinkInfo: 'Website, Instagram, WhatsApp — where clicks go',
    publModalCtaLabel: 'Button text',
    publModalContactoLabel: 'Your contact info',
    publModalEmailLabel: 'Email',
    publModalTelLabel: 'Phone / WhatsApp',
    publModalErrFotoTam: 'Image must be under 5 MB.',
    publModalErrLogoTam: 'Logo must be under 5 MB.',
    publModalErrNegocio: 'Enter your business name.',
    publModalErrEmail: 'Enter your email.',
    publModalErrLink: 'Enter your business link.',
    publModalErrLinkFmt: 'Link must be a valid URL. Example: https://instagram.com/yourbusiness',
    publModalErrTel: 'Phone must have at least 10 digits. Example: +1 555 123 4567',
    publModalPagandoCon: 'You\'ll be redirected to Mercado Pago. Your ad activates automatically after payment.',
    publModalPagar: 'Pay with Mercado Pago',
    publVistaPrevia: 'Preview',
    publStats0label: 'Active neighbors',
    publStats1label: 'Argentina',
    publStats2label: 'Organic · no bots',
    publStats3label: 'Dog owners',
    // mi-comercio
    mcomVolver: 'My profile',
    mcomVerPerfil: 'View public profile',
    mcomSinComercioTitle: "You don't have a registered business",
    mcomSinComercioSub: 'Join the Vecindog Network and appear on the pet owners map.',
    mcomRegistrar: 'Register my business',
    mcomActivo: 'Active',
    mcomPendiente: 'Pending activation',
    mcomReviews: 'Reviews',
    mcomVence: 'Expires',
    mcomEditar: 'Edit business details',
    mcomStatsTitle: 'Statistics (last 30 days)',
    mcomStatsVistas30: 'Visits',
    mcomStatsVistas7: 'This week',
    mcomStatsTelefono: 'Phone clicks',
    mcomStatsMapa: 'Map clicks',
    mcomStatsLink: 'Link clicks',
    mcomStatsCargando: 'Loading statistics…',
    mcomNovedadesTitle: 'News & Offers',
    mcomNueva: 'New',
    mcomNovTituloPlaceholder: 'Post title (e.g. Bath + cut promotion)',
    mcomNovDescPlaceholder: 'Description (optional)',
    mcomNovError: 'Could not publish the post.',
    mcomPublicando: 'Publishing...',
    mcomPublicar: 'Publish',
    mcomCancelar: 'Cancel',
    mcomNovVacia: 'Post news, offers or available appointments so customers can see them.',
    mcomDatosActualizados: 'Details updated!',
    mcomEditarTitle: 'Edit business',
    mcomFotoLabel: 'Business photo',
    mcomSubirFoto: 'Upload photo',
    mcomNombreLabel: 'Business name *',
    mcomCategoriaLabel: 'Category *',
    mcomCategoriaPlaceholder: 'Select a category',
    mcomTelefonoLabel: 'Contact phone *',
    mcomDescripcionLabel: 'Description (optional)',
    mcomDescripcionPlaceholder: 'Briefly describe your services',
    mcomDireccionLabel: 'Address',
    mcomApertura: 'Opening',
    mcomCierre: 'Closing',
    mcomDiasLabel: 'Opening days',
    mcomDiasPlaceholder: 'Select days',
    mcomLinkLabel: 'Website / Instagram / WhatsApp (optional)',
    mcomGuardando: 'Saving...',
    mcomGuardarCambios: 'Save changes',
    // mis-perros/[id]
    mpdMisPerros: 'My dogs',
    mpdGenerarCartel: 'Generate poster',
    mpdPublicarRedes: 'Share on Social Media',
    mpdQrCollar: 'QR Collar',
    mpdDiario: 'Journal',
    mpdEditarPerfil: 'Edit profile',
    mpdRegistrado: '{nombre} is registered!',
    mpdRegistradoSub: 'If they ever get lost, all their info is saved. You can also post a listing from Lost pets.',
    mpdSaludable: '💚 Healthy',
    mpdEnTratamiento: '🟡 Under treatment',
    mpdEnRecuperacion: '🔵 Recovering',
    mpdBannerProText: 'Identification, vaccines and records are VecindogPro features',
    mpdVerPro: 'See Pro',
    mpdVencidoUno: 'Expired: {nombre}',
    mpdVencidosN: '{n} expired: {lista}',
    mpdProximaUna: '{nombre} expires in the next 30 days',
    mpdProximasN: '{n} expire in the next 30 days: {lista}',
    mpdIdentificacion: 'Identification',
    mpdGuardarPDF: 'Save / Send PDF',
    mpdMicrochip: 'Microchip',
    mpdFechaNacLabel: 'Date of birth',
    mpdEdadLabel: 'Age',
    mpdCiudadLabel: 'City',
    mpdEsterilizadoLabel: 'Neutered/Spayed',
    mpdAlergiasLabel: 'Allergies / conditions',
    mpdVetHabitual: 'Regular vet',
    mpdCarnetVacunas: 'Vaccination record',
    mpdVacunasRegistradas: '{n} registered',
    mpdSinVacunas: 'No vaccines registered.',
    mpdEncontrarVet: 'Find a vet',
    mpdRedVetSub: 'Clinics and vets in the Vecindog Network',
    mpdVerVets: 'See vets →',
    mpdAvisoActivo: 'Active listing — searching',
    mpdAvisoActivoSub: 'There is an active listing for {nombre}. Still looking? Renew it so it appears first.',
    mpdAvisoRenovado: 'Listing renewed!',
    mpdRenovarAviso: 'Still searching? Renew listing',
    mpdVerAviso: 'View listing',
    mpdPerdiste: 'Did you lose {nombre}?',
    mpdPerdistesSub: 'Post a listing now with all this information so neighbors can help you.',
    mpdPublicarAviso: 'Post search listing',
    mpdPerroNoEncontrado: 'Dog not found',
    mpdVolverListado: 'Back',
    mpdEsterilizado: 'Neutered/Spayed',
    mpdSubirFoto: 'Upload photo',
    mpdCambiarFoto: 'Change photo',
    mpdFotoError: 'Photo must be under 5 MB.',
    mpdNombreLabel: 'Name',
    mpdRazaLabel: 'Breed',
    mpdColorLabel: 'Color',
    mpdColorPlaceholder: 'Black, brown…',
    mpdSexoLabel: 'Sex',
    mpdTamanoLabel: 'Size',
    mpdFechaNacFormLabel: 'Date of birth',
    mpdChipPlaceholder: 'Chip no.',
    mpdEsterilizadoCheck: 'Neutered/Spayed',
    mpdDescripcionLabel: 'Description',
    mpdDescripcionPlaceholder: 'Special markings, behavior…',
    mpdAlergiasCond: 'Allergies / special conditions',
    mpdAlergiasPlaceholder: 'Allergic to X, chronic condition, special diet…',
    mpdVetNombreLabel: 'Name / clinic',
    mpdVetTelefonoLabel: 'Phone',
    mpdErrGuardar: "Couldn't save. Please try again.",
    mpdCancelar: 'Cancel',
    mpdGuardarCambios: 'Save changes',
    mpdEliminarPerfil: 'Delete {nombre}\'s profile',
    mpdEliminarConfirm: 'Delete {nombre}?',
    mpdEliminarWarning: 'This action is irreversible. The profile, vaccines and all files for {nombre} will be deleted.',
    mpdSiEliminar: 'Yes, delete',
    mpdEnviarCarnet: 'Send vaccination record',
    mpdVacunaVencida: 'Expired',
    mpdVacunaVigente: 'Active',
    mpdVacunaProxima: 'Next:',
    mpdVacunaLabel: 'Vaccine',
    mpdVacunaPlaceholder: 'Sextuple, Rabies…',
    mpdFechaReqLabel: 'Date',
    mpdProximaDosis: 'Next dose',
    mpdVetFormLabel: 'Vet',
    mpdNotasLabel: 'Notes',
    mpdVacunaErrReq: 'Name and date are required.',
    mpdAgregarVacuna: 'Add vaccine',
    mpdGuardar: 'Save',
    mpdAgregar: '+ Add',
    mpdEnviar: 'Send',
    mpdVer: 'View',
    mpdEditar: 'Edit',
    mpdCerrar: 'Close',
    mpdRegistrar: 'Register',
    mpdConfirmarSubir: 'Confirm & upload',
    mpdErrSubir: "Couldn't upload the file. Check your connection and try again.",
    mpdAirTagTitle: 'Apple AirTag',
    mpdAirTagLabel: 'AirTag serial number',
    mpdAirTagErrReq: 'Enter the serial number.',
    mpdAirTagTip: 'Find it in Settings → Apple ID → Find My → your AirTag, or on the box.',
    mpdAirTagNSerie: 'Serial no.',
    mpdAirTagPerdidoTitle: '💡 If your dog is lost',
    mpdAirTagPerdidoDesc: 'Enable Lost Mode in the Find My app on your iPhone. Any nearby iPhone that detects the AirTag will automatically send you its location.',
    mpdAirTagModoLink: 'How to enable Lost Mode',
    mpdAirTagVacio: 'No AirTag registered.',
    mpdChipCertTitle: 'Chip Certificate',
    mpdSubirCertificado: 'Upload certificate',
    mpdNumeroChip: 'Chip number',
    mpdSinRegistrar: 'Not registered',
    mpdEditarBtn: 'Edit',
    mpdAgregarBtn: 'Add',
    mpdChipPlaceholderForm: 'Chip no. (15 digits)',
    mpdSinCertificados: 'No certificates uploaded.',
    mpdVerBtn: 'View',
    mpdCVITitle: 'CVI Certificate',
    mpdCVIPaises: 'Check requirements by country',
    mpdCVIBuscar: 'Search destination country…',
    mpdCVISinDestino: 'Destination not found.',
    mpdCVIFuente: 'Source: SENASA · Requirements may change without notice.',
    mpdSubirArchivo: 'Upload file',
    mpdPorVencer: 'Expiring soon',
    mpdSinArchivos: 'No files uploaded.',
    mpdCotizacionSub: 'Need a quote?',
    mpdCotizacionLink: 'Request here',
    mpdTurnoRegistrado: 'Appointment registered',
    mpdRegistrarTurnoEco: 'Register ultrasound appointment',
    mpdRegistrarTurnoRad: 'Register X-ray appointment',
    mpdTurnoNotaPlaceholder: 'Optional note (e.g. Dr. García, San Roque Clinic)',
    mpdRegistrarBtn: 'Register',
    mpdTeneTurnoEco: 'Do you have an ultrasound appointment?',
    mpdTeneTurnoRad: 'Do you have an X-ray appointment?',
    mpdRegistraAvisamos: "Register and we'll remind you",
    mpdEnviarEstudio: 'Send study',
    mpdEnviarEmail: 'Send by email',
    mpdEnviarWA: 'Send via WhatsApp',
    mpdCotizOk: 'Request sent!',
    mpdCotizOkSub: "We'll contact you shortly with the quote.",
    mpdCotizTitle: 'Request a quote',
    mpdCotizSub: 'Lab tests for your dog',
    mpdCotizNombreLabel: 'Full name',
    mpdCotizEmailLabel: 'Email',
    mpdCotizPerroLabel: "Dog's name",
    mpdCotizRecetaLabel: "Vet's prescription",
    mpdCotizSubirReceta: "Upload vet's prescription",
    mpdCotizErrCampos: 'Please fill in all required fields.',
    mpdCotizErrEmail: 'Enter a valid email.',
    mpdCotizEnviar: 'Send request',
    mpdQRTitle: 'QR for the collar',
    mpdQRDesc: 'Print it and hang it on {nombre}\'s collar. If lost, anyone can scan it.',
    mpdQRDescargar: 'Download PNG',
    mpdMedicamentosTitle: 'Medications',
    mpdMedActivos: '{n} active',
    mpdMedLabel: 'Medication',
    mpdMedPlaceholder: 'E.g. Tramadol, Amoxicillin',
    mpdMedDosis: 'Dose',
    mpdMedDosisPlaceholder: 'E.g. 5mg',
    mpdMedFrecuencia: 'Frequency',
    mpdMedFrecuenciaPlaceholder: 'E.g. Every 8h',
    mpdMedInicio: 'Start',
    mpdMedFin: 'End (optional)',
    mpdMedErrReq: 'Enter at least the name and start date.',
    mpdSinMedActivos: 'No active medications.',
    mpdMedDesde: 'From',
    mpdMedHasta: 'to',
    mpdMedAnteriores: 'Previous',
    mpdEnviarMed: 'Send medications',
    mpdHistoriaTitle: 'Medical Record',
    mpdHistoriaResumen: 'full summary',
    mpdSinDatos: 'No data',
    mpdHCPerfil: 'Profile',
    mpdHCVacunas: 'Vaccination Record',
    mpdHCAnalisis: 'Lab Tests',
    mpdHCRadios: 'X-rays',
    mpdHCEcos: 'Ultrasounds',
    mpdHCDesparas: 'Dewormings',
    mpdHCPeso: 'Weight History',
    mpdHCPesoMas: '+ {n} earlier records',
    mpdEnviarHistoria: 'Send Medical Record',
    mpdEnviarHistoriaSub: 'The recipient can view it without an account',
    mpdDesparasTitle: 'Dewormings',
    mpdDesparasRegistradas: '{n} registered',
    mpdEnviarDesparas: 'Send dewormings',
    mpdSinDesparas: 'No dewormings registered.',
    mpdDesparasProductoLabel: 'Product',
    mpdDesparasProductoPlaceholder: 'NexGard, Frontline…',
    mpdDesparasTipoLabel: 'Type',
    mpdDesparasProxima: 'Next application',
    mpdDesparasErrReq: 'Product and date are required.',
    mpdPesoTitle: 'Weight history',
    mpdPesoRegistros: '{n} record{s}',
    mpdPesoRegistrar: '+ Record',
    mpdPesoUltimo: 'Latest weight',
    mpdPesoVsAnterior: 'vs previous',
    mpdPesoKgLabel: 'Weight (kg)',
    mpdPesoErrReq: 'Enter a valid date and weight.',
    mpdPesoEvolucion: 'Trend',
    mpdSinPeso: 'No weight records.',
    mpdEnviarPeso: 'Send weight history',
    mpdVisitasTitle: 'Vet visits',
    mpdVisitaMotivo: 'Reason',
    mpdVisitaMotivoPlaceholder: 'Routine check, fever, etc.',
    mpdVisitaDiagnostico: 'Diagnosis',
    mpdVisitaDiagPlaceholder: 'Gastroenteritis, dermatitis, etc.',
    mpdVisitaTratamiento: 'Treatment',
    mpdVisitaTratPlaceholder: 'Antibiotic 5 days, rest, etc.',
    mpdVisitaErrReq: 'Date and reason are required.',
    mpdSinVisitas: 'No visits registered.',
    mpdProcedimientosTitle: 'Procedures & surgeries',
    mpdProcDescLabel: 'Description',
    mpdProcDescPlaceholder: 'Neutering, dental cleaning, etc.',
    mpdProcVetLabel: 'Vet / Clinic',
    mpdProcErrReq: 'Date and description are required.',
    mpdSinProcedimientos: 'No procedures registered.',
    mpdDietaTitle: 'Diet & feeding',
    mpdDietaMarca: 'Brand / food',
    mpdDietaMarcaPlaceholder: 'Royal Canin, Purina, etc.',
    mpdDietaCantidad: 'Amount',
    mpdDietaCantidadPlaceholder: '250g per meal',
    mpdDietaFrecuencia: 'Frequency',
    mpdDietaFrecuenciaPlaceholder: 'Twice a day',
    mpdDietaNotasLabel: 'Notes / restrictions',
    mpdDietaNotasPlaceholder: 'No chicken, low sodium...',
    mpdDietaAlimentoLabel: 'Food',
    mpdDietaRestriccionesLabel: 'Restrictions / notes',
    mpdSinDieta: 'No diet information loaded.',
    mpdGroomingTitle: 'Bath & grooming',
    mpdGroomingConfigurar: 'Configure',
    mpdGroomingUltimo: 'Last bath/grooming',
    mpdGroomingCadaCuantos: 'Every how many days',
    mpdGroomingUltimoLabel: 'Last',
    mpdGroomingProximoLabel: 'Next',
    mpdSinGrooming: 'Set up your bath & grooming reminder.',
    mpdGaleriaTitle: 'Photo gallery',
    mpdAgregarFoto: 'Add photo',
    mpdSinFotos: 'No photos in the gallery.',
    mpdContactosTitle: 'Emergency contacts',
    mpdContactoRelacion: 'Relationship',
    mpdContactoRelacionPlaceholder: 'Walker, family member, etc.',
    mpdContactoNotasPlaceholder: 'For emergencies only, etc.',
    mpdContactoErrReq: 'Name and phone are required.',
    mpdSinContactos: 'No emergency contacts loaded.',
    mpdCachorro: 'Puppy',
    mpdMes: 'month',
    mpdMeses: 'months',
    mpdAnio: 'year',
    mpdAnios: 'years',

    encPregunta: 'Did you find this dog?',
    encDuenio: 'Owner: {nombre}',
    encAvisar: 'Notify the owner that I found the dog',
    encLlamar: 'Call the owner: {tel}',
    encEnviado: 'Notice sent!',
    encEnviadoDesc: 'We notified the owner of {nombre} that you found the dog.',
    encLlamarTambien: 'You can also call {tel}.',
    encEncontreA: 'I found {nombre}',
    encEnviarDesc: 'We will notify the owner by email and notification.',
    encMensaje: 'Message (optional)',
    encTelefono: 'Your phone (optional)',
    encEnviando: 'Sending...',
    encAvisarBtn: 'Notify the owner',
    encErrEnviar: 'Could not send the notice. Please try again.',

    hpbImprimir: 'Print / Export PDF',

    revNovedades: 'News & Offers',
    revReviews: 'Reviews',
    revSinReviews: 'No reviews yet',
    revPrimero: 'Be the first to review {nombre}.',
    revEditarReview: 'Edit my review',
    revEscribirReview: 'Write a review',
    revGracias: 'Thanks for your review!',
    revOpinion: 'Your opinion',
    revPlaceholder: 'Tell us about your experience (optional)...',
    revPublicar: 'Post review',
    revErrReview: 'Could not save the review. Please try again.',
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
    navMiPerfil: 'Meu perfil',
    topEscapistasTitle: 'Os mais escapistas 🏃',
    adBannerTitle: 'Tem um negócio local para donos de pets?',
    adBannerSub: 'Alcance vizinhos que já buscam produtos e serviços para seus pets.',
    adBannerCta: 'Anuncie aqui',
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
    rvnPromoBannerTitle: 'Primeiros 50 negócios por cidade: 3 meses completamente grátis',
    rvnPromoBannerDesc: 'Como parte do lançamento da Red Vecindog, os primeiros 50 negócios por cidade a se registrarem obtêm os primeiros 3 meses sem custo, com acesso completo a todos os benefícios da plataforma.',
    rvnPromoMonths: '/mês a partir do 4.° mês',
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
    pbrStep2Data: 'Dados do cão',
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
    ppxCargando: 'Confirmando seu pagamento…',
    ppxOkTitle: 'Bem-vindo ao VecindogPro!',
    ppxOkSub: 'Sua conta já tem acesso a todas as funções Pro por 30 dias.',
    ppxIrMisPerros: 'Ir para Meus cachorros',
    ppxVolver: 'Voltar ao início',
    ppxPendienteTitle: 'Pagamento em andamento',
    ppxPendienteSub: 'Seu pagamento está sendo processado. Avisaremos por e-mail quando confirmado.',
    ppxErrorTitle: 'Não conseguimos confirmar',
    ppxErrorSub: 'Houve um problema ao verificar seu pagamento. Se foi cobrado, entre em contato em',
    ppxVolverPlanes: 'Voltar aos planos',
    rvpxCargando: 'Verificando pagamento e ativando seu negócio…',
    rvpxErrorTitle: 'Houve um problema',
    rvpxPendienteTitle: 'Pagamento em andamento!',
    rvpxBienvenidoTitle: 'Bem-vindo à Rede!',
    rvpxPagoTitle: 'Pagamento recebido!',
    rvpxErrorSub: 'Entre em contato em hola@mivecindog.com.ar e resolveremos rápido.',
    rvpxPendienteSub: 'Seu pagamento está sendo processado. Seu negócio é ativado automaticamente ao confirmar.',
    rvpxActivadoSub: 'Seu negócio já faz parte da Rede Vecindog e aparece no mapa para donos de cães.',
    rvpxPagoSub: 'Você receberá uma confirmação por e-mail quando seu negócio estiver ativo no mapa.',
    rvpxNegocioTiene: 'Seu negócio agora tem',
    rvpxBenef1: 'Presença no mapa de busca de cães',
    rvpxBenef2: 'Telefone e endereço visíveis para os vizinhos',
    rvpxPlan: 'Rede Vecindog · 30 dias',
    rvpxActualizar: 'Precisa atualizar algum dado? Entre em contato em',
    rvpxIrApp: 'Ir para o app',
    pubpxCargando: 'Verificando pagamento e ativando seu anúncio…',
    pubpxErrorTitle: 'Houve um problema',
    pubpxPendienteTitle: 'Pagamento em andamento!',
    pubpxRenovadoTitle: 'Publicidade renovada!',
    pubpxActivadoTitle: 'Seu anúncio está ativo!',
    pubpxPagoTitle: 'Pagamento recebido!',
    pubpxErrorSub: 'Entre em contato em hola@mivecindog.com.ar e resolveremos rápido.',
    pubpxPendienteSub: 'Seu pagamento está sendo processado. Seu anúncio é ativado automaticamente ao confirmar.',
    pubpxRenovadoSub: 'Sua publicidade foi renovada por mais 30 dias. Não foi necessário reinserir nenhum dado.',
    pubpxActivadoSub: 'Sua publicidade no Vecindog está ativa pelos próximos 30 dias.',
    pubpxPagoSub: 'Você receberá uma confirmação por e-mail quando seu anúncio estiver ativo.',
    pubpxEspacios: 'Espaços ativados',
    pubpxActualizar: 'Precisa fazer uma alteração no seu anúncio? Entre em contato em',
    pubpxIrApp: 'Ir para o app',
    pubrvChip: 'Renovar publicidade',
    pubrvVencida: 'Sua publicidade venceu. Renovar reativa por mais 30 dias.',
    pubrvExtender: 'Estenda sua publicidade por mais 30 dias.',
    pubrvPlan: 'Plano',
    pubrvVencimientoActual: 'Vencimento atual',
    pubrvVencido: '(vencido)',
    pubrvNuevoVencimiento: 'Novo vencimento',
    pubrvTotal: 'Total',
    pubrvPagoFallido: 'O pagamento não foi processado. Tente novamente.',
    pubrvNoEncontrado: 'Anúncio não encontrado',
    pubrvNoEncontradoSub: 'O link de renovação é inválido ou expirou.',
    pubrvVerPlanes: 'Ver planos de publicidade',
    pubrvCargando: 'Carregando…',
    pubrvBtn: 'Renovar com Mercado Pago',
    pubrvPagoCon: 'Você pode pagar com cartão de débito, crédito ou conta do Mercado Pago.',
    pubrvVerTodos: 'Ver todos os planos',
    svcExp1: 'Sou dono/a de cachorros',
    svcExp2: 'Tive cachorros quando criança',
    svcExp3: 'Cuidei de cachorros de amigos/família',
    svcExp4: 'Trabalhei com animais',
    svcExp5: 'Sem experiência prévia',
    svcDisp1: 'Segunda a sexta',
    svcDisp2: 'Fins de semana',
    svcDisp3: 'Qualquer dia',
    svcDisp4: 'Somente durante o dia',
    cubcTitle: 'Procuro cuidador',
    cubcSub: 'Publique um aviso para encontrar alguém que cuide do seu cachorro.',
    cubcCualPerro: 'Para qual dos seus cachorros?',
    cubcCargandoPerros: 'Carregando seus cachorros…',
    cubcSinPerros: 'Você não tem cachorros cadastrados.',
    cubcRegistra: 'Cadastre um →',
    cubcSinPerroSub: 'Você também pode continuar sem selecionar um cachorro e preencher os dados manualmente.',
    cubcFechas: 'Para quais datas?',
    cubcOpcional: '(opcional)',
    cubcDesde: 'De',
    cubcHasta: 'Até',
    cubcZona: 'Zona / Bairro',
    cubcDescripcion: 'Descrição',
    cubcDescripcionPh: 'Necessidades especiais, rotinas, informações importantes para o cuidador…',
    cubcContacto: 'WhatsApp de contato',
    cubcContactoPh: 'Ex.: 1122334455',
    cubcContactoError: 'Número incompleto — insira o número completo com DDD. Ex.: +54 9 291 4050210',
    cubcPublicar: 'Publicar aviso',
    cubcErrLogin: 'Você precisa fazer login para publicar.',
    cubcErrZona: 'A zona é obrigatória.',
    cubcErrContacto: 'O contato WhatsApp é obrigatório.',
    cubcErrContactoShort: 'O WhatsApp deve ter pelo menos 10 dígitos. Exemplo: +54 9 291 4050210',
    cubcErrPublicar: 'Não foi possível publicar. Tente novamente.',
    cubcLoginSub: 'Faça login para publicar um pedido de cuidado.',
    cubcLoginBtn: 'Fazer login',
    cubcOkTitle: 'Aviso publicado!',
    cubcOkSub: 'Seu pedido já aparece na listagem de cuidado.',
    qqcTitle: 'Quero cuidar',
    qqcSub: 'Complete seu perfil de cuidador para que os donos possam te encontrar.',
    qqcNombre: 'Seu nome ou apelido',
    qqcNombrePh: 'Ex.: Martina G.',
    qqcExperiencia: 'Experiência com cachorros',
    qqcDisponibilidad: 'Disponibilidade',
    qqcCuantos: 'Quantos cachorros você consegue cuidar ao mesmo tempo?',
    qqcTienePerros: 'Você tem cachorros em casa?',
    qqcDisp5: 'Com pernoite incluído',
    qqcInfo: 'Informações adicionais',
    qqcInfoPh: 'Conte mais: se tem quintal, se pode fazer pernoite, raças com as quais se sente confortável…',
    qqcZona: 'Zona / Bairro',
    qqcContacto: 'WhatsApp de contato',
    qqcRegistrar: 'Cadastrar como cuidador',
    qqcProTitle: 'Função exclusiva VecindogPro',
    qqcProSub: 'Para se cadastrar como cuidador e receber avaliações dos donos, você precisa ter o plano Pro ativo.',
    qqcVerPlanes: 'Ver planos',
    qqcLoginSub: 'Faça login para se cadastrar como cuidador.',
    qqcOkTitle: 'Você se cadastrou como cuidador!',
    qqcOkSub: 'Seu perfil já aparece na listagem de cuidadores disponíveis.',
    qqcErrLogin: 'Você precisa fazer login para se cadastrar.',
    qqcErrNombre: 'O nome é obrigatório.',
    qqcErrZona: 'A zona é obrigatória.',
    qqcErrContacto: 'O contato WhatsApp é obrigatório.',
    qqcErrContactoShort: 'O WhatsApp deve ter pelo menos 10 dígitos. Exemplo: +54 9 291 4050210',
    qqcErrRegistrar: 'Não foi possível cadastrar. Tente novamente.',
    qqtTitle: 'Quero transportar cachorros',
    qqtSub: 'Complete seu perfil de transportador para que os donos possam te encontrar.',
    qqtCuantos: 'Quantos cachorros você consegue transportar ao mesmo tempo?',
    qqtVehiculo: 'Que veículo você tem?',
    qqtDisp5: 'Horário flexível',
    qqtInfoPh: 'Conte mais: se tem carro próprio, quais zonas cobre, se faz traslados ao veterinário…',
    qqtRegistrar: 'Cadastrar como transportador',
    qqtProSub: 'Para se cadastrar como transportador e receber avaliações dos donos, você precisa ter o plano Pro ativo.',
    qqtLoginSub: 'Faça login para se cadastrar como transportador.',
    qqtOkTitle: 'Você se cadastrou como transportador!',
    qqtOkSub: 'Seu perfil já aparece na listagem de transportadores disponíveis.',
    qqtErrRegistrar: 'Não foi possível cadastrar. Tente novamente.',
    quidBack: 'Cuidadores disponíveis',
    quidSobre: 'Sobre este cuidador',
    quidContactar: 'Contatar',
    quidDisponibilidad: 'Disponibilidade:',
    quidCalificaciones: 'Avaliações',
    quidCalificar: 'Avaliar',
    quidEditarCal: 'Editar avaliação',
    quidCalGuardada: 'Avaliação salva! Obrigado pela sua opinião.',
    quidSinCal: 'Ainda não há avaliações para este cuidador.',
    quidSePrimero: 'Seja o primeiro!',
    quidNoEncontrado: 'Perfil deste cuidador não encontrado.',
    quidModalTitle: 'Avaliar cuidador',
    quidPuntuacion: 'Avaliação geral',
    quidCuidadoPerro: 'Como foi o cuidado do seu cachorro?',
    quidFuePuntual: 'Foi pontual?',
    quidBuenaCom: 'A comunicação foi boa?',
    quidRecomienda: 'Você recomendaria para outros donos?',
    quidComentario: 'Comentário',
    quidComentarioPh: 'Conta como foi a experiência…',
    quidCancelar: 'Cancelar',
    quidGuardar: 'Salvar',
    quidErrEstrella: 'Selecione pelo menos uma estrela.',
    quidExcelente: 'Excelente 🐾',
    quidBueno: 'Bom 👍',
    quidRegular: 'Regular 😐',
    quidPuntual: 'Pontual',
    quidBuenaComunicacion: 'Boa comunicação',
    quidLoRecomienda: 'Recomenda',
    quidCuidadoBadge: '🐾 Cuidado',
    quidRecomendaciones: '% recomenda',
    tridBack: 'Transportadores disponíveis',
    tridSobre: 'Sobre este transportador',
    tridNoEncontrado: 'Perfil deste transportador não encontrado.',
    tridModalTitle: 'Avaliar transportador',
    tridCuidadoPerro: 'Como foi o trato com seu cachorro?',
    tridTratoBadge: '🐾 Trato',
    tridCuidadoBadge: '🐾 Trato',
    tridSinCal: 'Ainda não há avaliações para este transportador.',
    rvcatBack: 'Rede Vecindog',
    rvcatNoEncontrado: 'Categoria não encontrada.',
    rvcatVolverRvn: 'Voltar à Rede Vecindog',
    rvcatSinInscrip: 'Sem inscritos ainda',
    rvcatProTitle: 'Exclusivo VecindogPro',
    rvcatVerPro: 'Ver Pro',
    rvcatVerNegocio: 'Ver negócio',
    rvcatCiudadTitle: 'Em que cidade você está?',
    rvcatCiudadSub: 'Você precisa escolher sua cidade para ver os negócios da sua região.',
    rvcatCiudadPh: 'Digite sua cidade…',
    rvcatUsarDeTodas: 'Usar "{q}" assim mesmo',
    rvcatEmptySub: 'Tem um negócio nesta categoria? Seja o primeiro a participar.',
    rvcatRegistrar: 'Cadastrar meu negócio',
    rvcatVolver: 'Voltar',
    rvcatConfirmar: 'Confirmar',
    rvcatProSub: 'Ative o Pro para ver os dados de cada negócio.',
    rvcatProBeneficios: 'Com VecindogPro você tem',
    rvcatEmptyTitle: 'Ainda não há inscritos nesta categoria',
    cartelVolver: 'Voltar',
    cartelImprimir: 'Imprimir / Salvar PDF',
    tlineVolver: 'Voltar ao perfil',
    tlineDiario: 'Diário',
    tlineEventos: '{n} eventos registrados',
    tlineSinEventos: 'Ainda não há eventos',
    tlineSinEventosSub: 'Registre vacinas, pesos e mais para ver o histórico aqui.',
    tlineVacuna: 'Vacina',
    tlineDesparasitacion: 'Vermifugação',
    tlineMedicamento: 'Medicamento',
    tlinePeso: 'Peso',
    tlineEstudio: 'Exame',
    tlineGrooming: 'Banho e tosa',
    tlineTurno: 'Consulta',
    tlineAviso: 'Aviso',
    tlineActivo: 'Ativo',
    tlineResuelto: '✓ Resolvido',
    tlineProxima: 'Próxima: {fecha}',
    histVolver: 'Voltar',
    histCompartirRedes: 'Compartilhar nas redes',
    histConectar: 'Conectar',
    histConectarLabel: 'Conectar {red}',
    histEmailLabel: 'Seu e-mail aparecerá na história.',
    histEmailPh: 'seuemail@exemplo.com',
    histGuardar: 'Salvar',
    histCambiar: 'Alterar',
    histEmailDe: 'E-mail do {red}',
    histGenerando: 'Gerando…',
    histListaIg: 'Pronta para o Instagram!',
    histListaFb: 'Pronta para o Facebook!',
    histCompartirIg: 'Compartilhar no Instagram Stories',
    histCompartirFb: 'Compartilhar no Facebook',
    histEnCelular: '📱 No celular:',
    histPasoIg: 'Abra o Instagram → ➕ Nova história → escolha a imagem',
    histPasoFb: 'Abra o Facebook → ➕ Nova história → escolha a imagem',
    histDescargar: 'Apenas baixar a imagem',
    mpnVolver: 'Voltar',
    mpnNuevoChip: 'Novo cachorro',
    mpnTitle: 'Cadastre seu cachorro',
    mpnSub: 'Salve todos os dados. Se um dia ele se perder, você já terá tudo pronto.',
    mpnLoginSub: 'Entre para cadastrar seu cachorro.',
    mpnLimiteTitle: 'Limite do plano Grátis',
    mpnLimiteSub: 'Com o plano Grátis você pode cadastrar 1 cachorro. Mude para o VecindogPro para cachorros ilimitados.',
    mpnVerPro: 'Ver plano Pro',
    mpnVolverLista: 'Voltar a Meus cachorros',
    mpnErrNombre: 'O nome é obrigatório.',
    mpnGuardando: 'Salvando…',
    mpnGuardar: 'Salvar perfil de {nombre}',
    mpnSecDatos: 'Dados básicos',
    mpnSecFotos: 'Fotos',
    mpnSecFotosSub: 'Envie até {max} fotos. A primeira será a principal.',
    mpnSecVet: 'Veterinário habitual',
    mpnSecVetOpcional: 'Opcional. Útil se o cachorro se perder e alguém encontrar.',
    mpnSecVacunas: 'Carteira de vacinação',
    mpnSecVacunasSub: 'Adicione todas as vacinas registradas.',
    mpnNombre: 'Nome',
    mpnRaza: 'Raça',
    mpnColor: 'Cor principal',
    mpnColorPh: 'Selecione uma cor',
    mpnSexo: 'Sexo',
    mpnSexoMacho: 'macho',
    mpnSexoHembra: 'fêmea',
    mpnTamano: 'Porte',
    mpnFechaNac: 'Data de nascimento',
    mpnChip: 'N° do microchip',
    mpnEsterilizado: 'É castrado/a',
    mpnDescripcion: 'Descrição / características',
    mpnDescripcionPh: 'Marcas especiais, manchas, cicatrizes, coleira habitual, comportamento…',
    mpnAlergias: 'Alergias / condições especiais',
    mpnAlergiasPh: 'Alérgico a X antibiótico, condição crônica, dieta especial…',
    mpnAlergiasInfo: 'Será exibido na identificação do cachorro.',
    mpnDireccion: 'Endereço da sua casa',
    mpnDireccionPh: 'Ex: Rua das Flores 123, São Paulo',
    mpnDireccionInfo: 'Se ele se perder, será usado para preencher o aviso automaticamente.',
    mpnFotoSubir: 'Enviar fotos',
    mpnFotoFormato: 'JPG, PNG ou WebP · Máx. 5 MB cada',
    mpnFotoErrImagen: 'Apenas imagens são permitidas.',
    mpnFotoErrTamano: 'Cada foto deve ter menos de 5 MB.',
    mpnFotoErrMax: 'Máximo de {max} fotos.',
    mpnFotoPrincipal: 'Principal',
    mpnVetNombre: 'Nome / clínica',
    mpnVetNombrePh: 'Dr. Silva / Clínica Pet',
    mpnVetTel: 'Telefone',
    mpnVacunaAgregar: 'Adicionar vacina',
    mpnVacunaNum: 'Vacina #{n}',
    mpnVacunaNombre: 'Nome',
    mpnVacunaFecha: 'Data',
    mpnVacunaVet: 'Veterinário/a',
    mpnVacunaProxima: 'Próxima dose',
    mpnVacunaNotas: 'Observações',
    mpnVacunaNombrePh: 'Antirrábica, Múltipla…',
    mpnVacunaVetPh: 'Nome ou clínica',
    mpnVacunaNotasPh: 'Lote, observações do veterinário…',
    mpnVacunaSinVacunas: 'Nenhuma vacina adicionada ainda.',
    publVolver: 'Voltar',
    publHeroChip: 'Para negócios locais',
    publHeroTitle: 'Alcance quem já cuida dos seus pets',
    publHeroSub: 'Vecindog conecta donos de cachorros em toda a Argentina quando mais precisam. Mostre seu negócio no momento certo.',
    publHeroWa: 'Falar pelo WhatsApp',
    publHeroMail: 'Enviar por email',
    publFormatosTitle: 'Formatos disponíveis',
    publFormatosSub: 'Veja como seu negócio aparece no Vecindog. Cada formato é pensado para um momento diferente.',
    publPreciosTitle: 'Planos simples, sem letras miúdas',
    publPreciosSub: 'Mês a mês. Sem contrato. Cancele quando quiser.',
    publMasElegido: '★ Mais escolhido',
    publPrecioEspecial: 'Precisa de algo especial? {link} e criamos um plano personalizado.',
    publPorQueTitle: 'Publicidade com contexto, não com algoritmos',
    publPorQueSub: 'Os usuários do Vecindog já estão pensando em seus pets quando veem seu anúncio. Sem competir com redes sociais ou publicidade genérica — você aparece quando importa.',
    publPorQueChip: 'Por que Vecindog',
    publFaqTitle: 'Perguntas frequentes',
    publCtaTitle: 'Pronto para alcançar mais clientes?',
    publCtaSub: 'Fale com a gente e ativamos sua campanha em menos de 24 horas.',
    publModalFotolabel: 'Logo ou foto do negócio',
    publModalFotoCambiar: 'Trocar imagem',
    publModalFotoSubir: 'Enviar logo ou foto',
    publModalLogoLabel: 'Logo quadrado',
    publModalLogoCambiar: 'Trocar logo',
    publModalLogoSubir: 'Enviar logo quadrado',
    publModalNegocioLabel: 'Nome do negócio',
    publModalTaglineLabel: 'Descrição curta (tagline)',
    publModalLinkLabel: 'Link do negócio',
    publModalLinkInfo: 'Site, Instagram, WhatsApp — para onde vão os cliques',
    publModalCtaLabel: 'Texto do botão',
    publModalContactoLabel: 'Seus dados de contato',
    publModalEmailLabel: 'Email',
    publModalTelLabel: 'Telefone / WhatsApp',
    publModalErrFotoTam: 'A imagem deve ter menos de 5 MB.',
    publModalErrLogoTam: 'O logo deve ter menos de 5 MB.',
    publModalErrNegocio: 'Informe o nome do seu negócio.',
    publModalErrEmail: 'Informe seu email.',
    publModalErrLink: 'Informe o link do seu negócio.',
    publModalErrLinkFmt: 'O link deve ser uma URL válida. Exemplo: https://instagram.com/seunegocio',
    publModalErrTel: 'O telefone deve ter pelo menos 10 dígitos.',
    publModalPagandoCon: 'Você será redirecionado ao Mercado Pago. Seu anúncio é ativado automaticamente após o pagamento.',
    publModalPagar: 'Pagar com Mercado Pago',
    publVistaPrevia: 'Pré-visualização',
    publStats0label: 'Vizinhos ativos',
    publStats1label: 'Argentina',
    publStats2label: 'Orgânico · sem bots',
    publStats3label: 'Donos de pets',
    // mi-comercio
    mcomVolver: 'Meu perfil',
    mcomVerPerfil: 'Ver perfil público',
    mcomSinComercioTitle: 'Você não tem um comércio registrado',
    mcomSinComercioSub: 'Entre na Rede Vecindog e apareça no mapa de donos de pets.',
    mcomRegistrar: 'Registrar meu comércio',
    mcomActivo: 'Ativo',
    mcomPendiente: 'Aguardando ativação',
    mcomReviews: 'Avaliações',
    mcomVence: 'Vence',
    mcomEditar: 'Editar dados do comércio',
    mcomStatsTitle: 'Estatísticas (últimos 30 dias)',
    mcomStatsVistas30: 'Visitas',
    mcomStatsVistas7: 'Esta semana',
    mcomStatsTelefono: 'Cliques no telefone',
    mcomStatsMapa: 'Cliques no mapa',
    mcomStatsLink: 'Cliques no link',
    mcomStatsCargando: 'Carregando estatísticas…',
    mcomNovedadesTitle: 'Novidades e Ofertas',
    mcomNueva: 'Nova',
    mcomNovTituloPlaceholder: 'Título da novidade (ex: Promoção banho + tosa)',
    mcomNovDescPlaceholder: 'Descrição (opcional)',
    mcomNovError: 'Não foi possível publicar a novidade.',
    mcomPublicando: 'Publicando...',
    mcomPublicar: 'Publicar',
    mcomCancelar: 'Cancelar',
    mcomNovVacia: 'Publique novidades, ofertas ou horários disponíveis para que os clientes vejam.',
    mcomDatosActualizados: 'Dados atualizados!',
    mcomEditarTitle: 'Editar comércio',
    mcomFotoLabel: 'Foto do comércio',
    mcomSubirFoto: 'Enviar foto',
    mcomNombreLabel: 'Nome do comércio *',
    mcomCategoriaLabel: 'Categoria *',
    mcomCategoriaPlaceholder: 'Selecione uma categoria',
    mcomTelefonoLabel: 'Telefone de contato *',
    mcomDescripcionLabel: 'Descrição (opcional)',
    mcomDescripcionPlaceholder: 'Descreva brevemente seus serviços',
    mcomDireccionLabel: 'Endereço',
    mcomApertura: 'Abertura',
    mcomCierre: 'Fechamento',
    mcomDiasLabel: 'Dias de atendimento',
    mcomDiasPlaceholder: 'Selecione os dias',
    mcomLinkLabel: 'Site / Instagram / WhatsApp (opcional)',
    mcomGuardando: 'Salvando...',
    mcomGuardarCambios: 'Salvar alterações',
    // mis-perros/[id]
    mpdMisPerros: 'Meus cachorros',
    mpdGenerarCartel: 'Gerar cartaz',
    mpdPublicarRedes: 'Publicar nas Redes Sociais',
    mpdQrCollar: 'QR Coleira',
    mpdDiario: 'Diário',
    mpdEditarPerfil: 'Editar perfil',
    mpdRegistrado: '{nombre} está registrado!',
    mpdRegistradoSub: 'Se algum dia ele se perder, todas as informações estão salvas. Você também pode publicar um aviso em Cachorros perdidos.',
    mpdSaludable: '💚 Saudável',
    mpdEnTratamiento: '🟡 Em tratamento',
    mpdEnRecuperacion: '🔵 Em recuperação',
    mpdBannerProText: 'Identificação, vacinas e estudos são funções do VecindogPro',
    mpdVerPro: 'Ver Pro',
    mpdVencidoUno: 'Vencido/a: {nombre}',
    mpdVencidosN: '{n} vencidos/as: {lista}',
    mpdProximaUna: '{nombre} vence nos próximos 30 dias',
    mpdProximasN: '{n} vencem nos próximos 30 dias: {lista}',
    mpdIdentificacion: 'Identificação',
    mpdGuardarPDF: 'Salvar / Enviar PDF',
    mpdMicrochip: 'Microchip',
    mpdFechaNacLabel: 'Data de nasc.',
    mpdEdadLabel: 'Idade',
    mpdCiudadLabel: 'Cidade',
    mpdEsterilizadoLabel: 'Castrado/a',
    mpdAlergiasLabel: 'Alergias / condições',
    mpdVetHabitual: 'Veterinário habitual',
    mpdCarnetVacunas: 'Carteira de vacinação',
    mpdVacunasRegistradas: '{n} registrada{s}',
    mpdSinVacunas: 'Nenhuma vacina registrada.',
    mpdEncontrarVet: 'Encontre um veterinário',
    mpdRedVetSub: 'Clínicas e vets na Rede Vecindog',
    mpdVerVets: 'Ver vets →',
    mpdAvisoActivo: 'Aviso ativo — em busca',
    mpdAvisoActivoSub: 'Há um aviso ativo para {nombre}. Ainda procurando? Renove para que apareça primeiro.',
    mpdAvisoRenovado: 'Aviso renovado!',
    mpdRenovarAviso: 'Ainda procurando? Renovar aviso',
    mpdVerAviso: 'Ver aviso',
    mpdPerdiste: 'Você perdeu {nombre}?',
    mpdPerdistesSub: 'Publique um aviso agora com todas essas informações para que vizinhos possam ajudar.',
    mpdPublicarAviso: 'Publicar aviso de busca',
    mpdPerroNoEncontrado: 'Cachorro não encontrado',
    mpdVolverListado: 'Voltar',
    mpdEsterilizado: 'Castrado/a',
    mpdSubirFoto: 'Enviar foto',
    mpdCambiarFoto: 'Mudar foto',
    mpdFotoError: 'A foto deve ter menos de 5 MB.',
    mpdNombreLabel: 'Nome',
    mpdRazaLabel: 'Raça',
    mpdColorLabel: 'Cor',
    mpdColorPlaceholder: 'Preto, marrom…',
    mpdSexoLabel: 'Sexo',
    mpdTamanoLabel: 'Porte',
    mpdFechaNacFormLabel: 'Data de nascimento',
    mpdChipPlaceholder: 'Nº do chip',
    mpdEsterilizadoCheck: 'Castrado/a',
    mpdDescripcionLabel: 'Descrição',
    mpdDescripcionPlaceholder: 'Marcas especiais, comportamento…',
    mpdAlergiasCond: 'Alergias / condições especiais',
    mpdAlergiasPlaceholder: 'Alérgico a X, condição crônica, dieta especial…',
    mpdVetNombreLabel: 'Nome / clínica',
    mpdVetTelefonoLabel: 'Telefone',
    mpdErrGuardar: 'Não foi possível salvar. Tente novamente.',
    mpdCancelar: 'Cancelar',
    mpdGuardarCambios: 'Salvar alterações',
    mpdEliminarPerfil: 'Excluir perfil de {nombre}',
    mpdEliminarConfirm: 'Excluir {nombre}?',
    mpdEliminarWarning: 'Esta ação é irreversível. O perfil, vacinas e todos os arquivos de {nombre} serão excluídos.',
    mpdSiEliminar: 'Sim, excluir',
    mpdEnviarCarnet: 'Enviar carteira de vacinação',
    mpdVacunaVencida: 'Vencida',
    mpdVacunaVigente: 'Vigente',
    mpdVacunaProxima: 'Próxima:',
    mpdVacunaLabel: 'Vacina',
    mpdVacunaPlaceholder: 'Sêxtupla, Raiva…',
    mpdFechaReqLabel: 'Data',
    mpdProximaDosis: 'Próxima dose',
    mpdVetFormLabel: 'Veterinário',
    mpdNotasLabel: 'Notas',
    mpdVacunaErrReq: 'Nome e data são obrigatórios.',
    mpdAgregarVacuna: 'Adicionar vacina',
    mpdGuardar: 'Salvar',
    mpdAgregar: '+ Adicionar',
    mpdEnviar: 'Enviar',
    mpdVer: 'Ver',
    mpdEditar: 'Editar',
    mpdCerrar: 'Fechar',
    mpdRegistrar: 'Registrar',
    mpdConfirmarSubir: 'Confirmar e enviar',
    mpdErrSubir: 'Não foi possível enviar o arquivo. Verifique a conexão e tente novamente.',
    mpdAirTagTitle: 'Apple AirTag',
    mpdAirTagLabel: 'Número de série do AirTag',
    mpdAirTagErrReq: 'Digite o número de série.',
    mpdAirTagTip: 'Encontre em Ajustes → Apple ID → Buscar → seu AirTag, ou na caixa.',
    mpdAirTagNSerie: 'Nº de série',
    mpdAirTagPerdidoTitle: '💡 Se o seu cachorro se perder',
    mpdAirTagPerdidoDesc: 'Ative o Modo Perdido no app Buscar do seu iPhone. Qualquer iPhone próximo que detectar o AirTag enviará automaticamente a localização para você.',
    mpdAirTagModoLink: 'Como ativar o Modo Perdido',
    mpdAirTagVacio: 'Nenhum AirTag registrado.',
    mpdChipCertTitle: 'Certificado de Chip',
    mpdSubirCertificado: 'Enviar certificado',
    mpdNumeroChip: 'Número do chip',
    mpdSinRegistrar: 'Não registrado',
    mpdEditarBtn: 'Editar',
    mpdAgregarBtn: 'Adicionar',
    mpdChipPlaceholderForm: 'Nº do chip (15 dígitos)',
    mpdSinCertificados: 'Nenhum certificado enviado.',
    mpdVerBtn: 'Ver',
    mpdCVITitle: 'Certificado CVI',
    mpdCVIPaises: 'Consulte os requisitos por país',
    mpdCVIBuscar: 'Pesquisar país de destino…',
    mpdCVISinDestino: 'Destino não encontrado.',
    mpdCVIFuente: 'Fonte: SENASA · Os requisitos podem mudar sem aviso.',
    mpdSubirArchivo: 'Enviar arquivo',
    mpdPorVencer: 'Prestes a vencer',
    mpdSinArchivos: 'Nenhum arquivo enviado.',
    mpdCotizacionSub: 'Precisa de um orçamento?',
    mpdCotizacionLink: 'Solicite aqui',
    mpdTurnoRegistrado: 'Consulta registrada',
    mpdRegistrarTurnoEco: 'Registrar consulta de ultrassom',
    mpdRegistrarTurnoRad: 'Registrar consulta de raio-x',
    mpdTurnoNotaPlaceholder: 'Nota opcional (ex.: Dr. García, Clínica São Roque)',
    mpdRegistrarBtn: 'Registrar',
    mpdTeneTurnoEco: 'Você tem consulta de ultrassom?',
    mpdTeneTurnoRad: 'Você tem consulta de raio-x?',
    mpdRegistraAvisamos: 'Registre e avisamos você',
    mpdEnviarEstudio: 'Enviar exame',
    mpdEnviarEmail: 'Enviar por e-mail',
    mpdEnviarWA: 'Enviar via WhatsApp',
    mpdCotizOk: 'Solicitação enviada!',
    mpdCotizOkSub: 'Entraremos em contato em breve com o orçamento.',
    mpdCotizTitle: 'Solicitar orçamento',
    mpdCotizSub: 'Exames laboratoriais para o seu cachorro',
    mpdCotizNombreLabel: 'Nome completo',
    mpdCotizEmailLabel: 'E-mail',
    mpdCotizPerroLabel: 'Nome do cachorro',
    mpdCotizRecetaLabel: 'Receita do veterinário',
    mpdCotizSubirReceta: 'Enviar receita do veterinário',
    mpdCotizErrCampos: 'Por favor, preencha todos os campos obrigatórios.',
    mpdCotizErrEmail: 'Digite um e-mail válido.',
    mpdCotizEnviar: 'Enviar solicitação',
    mpdQRTitle: 'QR para a coleira',
    mpdQRDesc: 'Imprima e coloque na coleira de {nombre}. Se ele se perder, qualquer pessoa pode escanear.',
    mpdQRDescargar: 'Baixar PNG',
    mpdMedicamentosTitle: 'Medicamentos',
    mpdMedActivos: '{n} ativo{s}',
    mpdMedLabel: 'Medicamento',
    mpdMedPlaceholder: 'Ex.: Tramadol, Amoxicilina',
    mpdMedDosis: 'Dose',
    mpdMedDosisPlaceholder: 'Ex.: 5mg',
    mpdMedFrecuencia: 'Frequência',
    mpdMedFrecuenciaPlaceholder: 'Ex.: A cada 8h',
    mpdMedInicio: 'Início',
    mpdMedFin: 'Fim (opcional)',
    mpdMedErrReq: 'Informe pelo menos o nome e a data de início.',
    mpdSinMedActivos: 'Nenhum medicamento ativo.',
    mpdMedDesde: 'De',
    mpdMedHasta: 'até',
    mpdMedAnteriores: 'Anteriores',
    mpdEnviarMed: 'Enviar medicamentos',
    mpdHistoriaTitle: 'Prontuário Médico',
    mpdHistoriaResumen: 'resumo completo',
    mpdSinDatos: 'Sem dados',
    mpdHCPerfil: 'Perfil',
    mpdHCVacunas: 'Carteira de Vacinação',
    mpdHCAnalisis: 'Análises',
    mpdHCRadios: 'Raios-x',
    mpdHCEcos: 'Ultrassons',
    mpdHCDesparas: 'Desparasitações',
    mpdHCPeso: 'Histórico de Peso',
    mpdHCPesoMas: '+ {n} registros anteriores',
    mpdEnviarHistoria: 'Enviar Prontuário',
    mpdEnviarHistoriaSub: 'O destinatário pode visualizá-lo sem criar conta',
    mpdDesparasTitle: 'Desparasitações',
    mpdDesparasRegistradas: '{n} registrada{s}',
    mpdEnviarDesparas: 'Enviar desparasitações',
    mpdSinDesparas: 'Nenhuma desparasitação registrada.',
    mpdDesparasProductoLabel: 'Produto',
    mpdDesparasProductoPlaceholder: 'NexGard, Frontline…',
    mpdDesparasTipoLabel: 'Tipo',
    mpdDesparasProxima: 'Próxima aplicação',
    mpdDesparasErrReq: 'Produto e data são obrigatórios.',
    mpdPesoTitle: 'Histórico de peso',
    mpdPesoRegistros: '{n} registro{s}',
    mpdPesoRegistrar: '+ Registrar',
    mpdPesoUltimo: 'Último peso',
    mpdPesoVsAnterior: 'vs anterior',
    mpdPesoKgLabel: 'Peso (kg)',
    mpdPesoErrReq: 'Informe uma data e peso válidos.',
    mpdPesoEvolucion: 'Evolução',
    mpdSinPeso: 'Nenhum registro de peso.',
    mpdEnviarPeso: 'Enviar histórico de peso',
    mpdVisitasTitle: 'Visitas ao veterinário',
    mpdVisitaMotivo: 'Motivo',
    mpdVisitaMotivoPlaceholder: 'Consulta de rotina, febre, etc.',
    mpdVisitaDiagnostico: 'Diagnóstico',
    mpdVisitaDiagPlaceholder: 'Gastroenterite, dermatite, etc.',
    mpdVisitaTratamiento: 'Tratamento',
    mpdVisitaTratPlaceholder: 'Antibiótico 5 dias, repouso, etc.',
    mpdVisitaErrReq: 'Data e motivo são obrigatórios.',
    mpdSinVisitas: 'Nenhuma visita registrada.',
    mpdProcedimientosTitle: 'Procedimentos e cirurgias',
    mpdProcDescLabel: 'Descrição',
    mpdProcDescPlaceholder: 'Castração, limpeza dental, etc.',
    mpdProcVetLabel: 'Veterinário / Clínica',
    mpdProcErrReq: 'Data e descrição são obrigatórios.',
    mpdSinProcedimientos: 'Nenhum procedimento registrado.',
    mpdDietaTitle: 'Dieta e alimentação',
    mpdDietaMarca: 'Marca / ração',
    mpdDietaMarcaPlaceholder: 'Royal Canin, Purina, etc.',
    mpdDietaCantidad: 'Quantidade',
    mpdDietaCantidadPlaceholder: '250g por refeição',
    mpdDietaFrecuencia: 'Frequência',
    mpdDietaFrecuenciaPlaceholder: 'Duas vezes ao dia',
    mpdDietaNotasLabel: 'Notas / restrições',
    mpdDietaNotasPlaceholder: 'Sem frango, baixo sódio...',
    mpdDietaAlimentoLabel: 'Alimento',
    mpdDietaRestriccionesLabel: 'Restrições / notas',
    mpdSinDieta: 'Nenhuma informação de dieta carregada.',
    mpdGroomingTitle: 'Banho e tosa',
    mpdGroomingConfigurar: 'Configurar',
    mpdGroomingUltimo: 'Último banho/tosa',
    mpdGroomingCadaCuantos: 'A cada quantos dias',
    mpdGroomingUltimoLabel: 'Último',
    mpdGroomingProximoLabel: 'Próximo',
    mpdSinGrooming: 'Configure seu lembrete de banho e tosa.',
    mpdGaleriaTitle: 'Galeria de fotos',
    mpdAgregarFoto: 'Adicionar foto',
    mpdSinFotos: 'Nenhuma foto na galeria.',
    mpdContactosTitle: 'Contatos de emergência',
    mpdContactoRelacion: 'Relação',
    mpdContactoRelacionPlaceholder: 'Passeador, familiar, etc.',
    mpdContactoNotasPlaceholder: 'Apenas para emergências, etc.',
    mpdContactoErrReq: 'Nome e telefone são obrigatórios.',
    mpdSinContactos: 'Nenhum contato de emergência carregado.',
    mpdCachorro: 'Filhote',
    mpdMes: 'mês',
    mpdMeses: 'meses',
    mpdAnio: 'ano',
    mpdAnios: 'anos',

    encPregunta: 'Você encontrou este cachorro?',
    encDuenio: 'Dono: {nombre}',
    encAvisar: 'Avisar o dono que encontrei o cachorro',
    encLlamar: 'Ligar para o dono: {tel}',
    encEnviado: 'Aviso enviado!',
    encEnviadoDesc: 'Avisamos o dono de {nombre} que você encontrou o cachorro.',
    encLlamarTambien: 'Você também pode ligar para {tel}.',
    encEncontreA: 'Encontrei {nombre}',
    encEnviarDesc: 'Vamos notificar o dono por e-mail e notificação.',
    encMensaje: 'Mensagem (opcional)',
    encTelefono: 'Seu telefone (opcional)',
    encEnviando: 'Enviando...',
    encAvisarBtn: 'Avisar o dono',
    encErrEnviar: 'Não foi possível enviar o aviso. Tente novamente.',

    hpbImprimir: 'Imprimir / Exportar PDF',

    revNovedades: 'Novidades e Ofertas',
    revReviews: 'Avaliações',
    revSinReviews: 'Ainda não há avaliações',
    revPrimero: 'Seja o primeiro a avaliar {nombre}.',
    revEditarReview: 'Editar minha avaliação',
    revEscribirReview: 'Escrever avaliação',
    revGracias: 'Obrigado pela sua avaliação!',
    revOpinion: 'Sua opinião',
    revPlaceholder: 'Conte-nos sua experiência (opcional)...',
    revPublicar: 'Publicar avaliação',
    revErrReview: 'Não foi possível salvar a avaliação. Tente novamente.',
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
