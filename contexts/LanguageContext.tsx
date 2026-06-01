'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type Lang = 'es' | 'en' | 'pt';

const LANG_KEY = 'vecindog_lang';

export type Translations = {
  // AuthModal
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
  // Forgot password
  forgotLink: string;
  forgotTitle: string;
  forgotSub: string;
  btnSendReset: string;
  forgotSuccess: string;
  backToLogin: string;
  // Reset password page
  newPasswordTitle: string;
  newPasswordSub: string;
  newPasswordPlaceholder: string;
  confirmPasswordPlaceholder: string;
  btnUpdatePassword: string;
  errPasswordMismatch: string;
  updatePasswordSuccess: string;
  updatePasswordSuccessSub: string;
  invalidResetLink: string;
  // ProfileModal
  profileTitle: string;
  profileSub: string;
  firstName: string;
  lastName: string;
  phone: string;
  selectCity: string;
  province: string;
  country: string;
  btnSave: string;
};

const translations: Record<Lang, Translations> = {
  es: {
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
    profileTitle: 'Completá tu perfil',
    profileSub: 'Necesitamos algunos datos para continuar',
    firstName: 'Nombre',
    lastName: 'Apellido',
    phone: 'Teléfono (ej: 1123456789)',
    selectCity: 'Seleccioná tu ciudad',
    province: 'Provincia',
    country: 'País',
    btnSave: 'Guardar y continuar',
  },
  en: {
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
    profileTitle: 'Complete your profile',
    profileSub: 'We need some information to continue',
    firstName: 'First name',
    lastName: 'Last name',
    phone: 'Phone (e.g.: 1123456789)',
    selectCity: 'Select your city',
    province: 'Province / State',
    country: 'Country',
    btnSave: 'Save and continue',
  },
  pt: {
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
    profileTitle: 'Complete seu perfil',
    profileSub: 'Precisamos de alguns dados para continuar',
    firstName: 'Nome',
    lastName: 'Sobrenome',
    phone: 'Telefone (ex: 1123456789)',
    selectCity: 'Selecione sua cidade',
    province: 'Província / Estado',
    country: 'País',
    btnSave: 'Salvar e continuar',
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
