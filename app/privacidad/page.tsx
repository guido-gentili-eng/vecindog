import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Política de Privacidad — Vecindog',
  description: 'Política de privacidad y tratamiento de datos personales de Vecindog.',
};

export default function PrivacidadPage() {
  return (
    <div className="mx-auto max-w-3xl py-10 px-4">
      <div className="mb-8">
        <Link href="/" className="text-sm text-brand-primary hover:underline">← Volver al inicio</Link>
      </div>

      <h1 className="font-display text-4xl font-black text-ink mb-2">Política de Privacidad</h1>
      <p className="text-ink-muted text-sm mb-8">Última actualización: 31 de mayo de 2025</p>

      <div className="space-y-8 text-ink">

        <Section title="1. Responsable del tratamiento">
          <p>Vecindog, operado bajo el dominio <strong>mivecindog.com.ar</strong>, es responsable del tratamiento de los datos personales que los usuarios proporcionan al registrarse y utilizar la Plataforma, en cumplimiento de la Ley 25.326 de Protección de Datos Personales de la República Argentina.</p>
        </Section>

        <Section title="2. Datos que recopilamos">
          <p>Recopilamos los siguientes datos personales:</p>
          <ul>
            <li><strong>Datos de registro:</strong> nombre, apellido, dirección de correo electrónico y contraseña (almacenada de forma encriptada).</li>
            <li><strong>Datos de perfil:</strong> número de teléfono, dirección, ciudad, provincia y país.</li>
            <li><strong>Datos de publicaciones:</strong> información sobre mascotas (nombre, raza, color, fotos) y datos de ubicación (zona o coordenadas GPS, si el usuario los proporciona voluntariamente).</li>
            <li><strong>Datos técnicos:</strong> dirección IP, tipo de dispositivo y navegador, con fines de seguridad y mejora del servicio.</li>
          </ul>
        </Section>

        <Section title="3. Finalidad del tratamiento">
          <p>Los datos personales son utilizados exclusivamente para:</p>
          <ul>
            <li>Gestionar el registro y la cuenta del usuario en la Plataforma.</li>
            <li>Permitir la publicación y visualización de avisos sobre mascotas.</li>
            <li>Enviar notificaciones relacionadas con la actividad del usuario (alertas de mascotas cercanas, recordatorios de vacunas, vencimiento de avisos).</li>
            <li>Mejorar la funcionalidad y experiencia de uso de la Plataforma.</li>
            <li>Cumplir con obligaciones legales cuando corresponda.</li>
          </ul>
          <p><strong>Vecindog no vende, cede ni comercializa datos personales a terceros bajo ninguna circunstancia.</strong></p>
        </Section>

        <Section title="4. Datos visibles para otros usuarios">
          <p>Al publicar un aviso, el número de teléfono de contacto que el usuario ingrese será visible para otros usuarios registrados de la Plataforma. El usuario acepta y consiente expresamente esta visibilidad al momento de publicar. Vecindog no se responsabiliza por el uso que terceros hagan de dicha información.</p>
        </Section>

        <Section title="5. Almacenamiento y seguridad">
          <p>Los datos son almacenados de forma segura en servidores provistos por Supabase, con encriptación en tránsito (HTTPS/TLS) y en reposo. Las contraseñas nunca son almacenadas en texto plano.</p>
          <p>No obstante, ningún sistema de seguridad es infalible. Vecindog adopta medidas razonables para proteger los datos pero no puede garantizar la seguridad absoluta frente a accesos no autorizados.</p>
        </Section>

        <Section title="6. Retención de datos">
          <p>Los datos personales se conservan mientras la cuenta del usuario permanezca activa. El usuario puede solicitar la eliminación de su cuenta y datos en cualquier momento escribiendo a <strong>contacto@mivecindog.com.ar</strong>. Ciertos datos podrán conservarse por el tiempo que establezca la legislación aplicable.</p>
        </Section>

        <Section title="7. Derechos del usuario">
          <p>En virtud de la Ley 25.326, el usuario tiene derecho a:</p>
          <ul>
            <li><strong>Acceso:</strong> conocer qué datos suyos están almacenados en la Plataforma.</li>
            <li><strong>Rectificación:</strong> corregir datos inexactos o incompletos.</li>
            <li><strong>Supresión:</strong> solicitar la eliminación de sus datos personales.</li>
            <li><strong>Confidencialidad:</strong> oponerse al tratamiento de sus datos para determinadas finalidades.</li>
          </ul>
          <p>Para ejercer estos derechos, el usuario debe contactar a Vecindog mediante el correo <strong>contacto@mivecindog.com.ar</strong>. La respuesta se brindará dentro de los plazos establecidos por la legislación vigente.</p>
          <p>La Dirección Nacional de Protección de Datos Personales (DNPDP) es el organismo de control competente en la materia.</p>
        </Section>

        <Section title="8. Cookies y tecnologías similares">
          <p>La Plataforma puede utilizar cookies y tecnologías similares para mejorar la experiencia del usuario, mantener sesiones activas y analizar el uso del servicio. El usuario puede configurar su navegador para rechazar cookies, aunque esto puede afectar el correcto funcionamiento de la Plataforma.</p>
        </Section>

        <Section title="9. Servicios de terceros">
          <p>La Plataforma utiliza los siguientes servicios de terceros para su funcionamiento:</p>
          <ul>
            <li><strong>Supabase</strong> — base de datos y autenticación.</li>
            <li><strong>Vercel</strong> — alojamiento web.</li>
            <li><strong>Resend</strong> — envío de correos electrónicos transaccionales.</li>
            <li><strong>OpenStreetMap / Nominatim</strong> — geolocalización de direcciones.</li>
            <li><strong>MercadoPago</strong> — procesamiento de pagos (para publicidad).</li>
          </ul>
          <p>Cada uno de estos servicios cuenta con sus propias políticas de privacidad, las cuales son independientes de la presente.</p>
        </Section>

        <Section title="10. Modificaciones">
          <p>Vecindog podrá actualizar esta Política de Privacidad en cualquier momento. Los cambios se publicarán en esta página con la fecha de actualización correspondiente. El uso continuado de la Plataforma tras la publicación de cambios implica la aceptación de la nueva Política.</p>
        </Section>

        <Section title="11. Contacto">
          <p>Para cualquier consulta sobre privacidad y protección de datos: <strong>contacto@mivecindog.com.ar</strong></p>
        </Section>

      </div>

      <div className="mt-10 pt-6 border-t border-black/10 flex gap-4 text-sm">
        <Link href="/terminos" className="text-brand-primary hover:underline">Términos y Condiciones</Link>
        <Link href="/" className="text-ink-muted hover:underline">Volver al inicio</Link>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-display text-xl font-extrabold text-ink mb-3">{title}</h2>
      <div className="space-y-3 text-sm text-ink leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5">{children}</div>
    </div>
  );
}
