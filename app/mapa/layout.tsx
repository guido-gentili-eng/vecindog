import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Mapa de avisos | Vecindog',
  description: 'Mapa interactivo con perros perdidos, vistos y en adopción cerca tuyo.',
};

export default function MapaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        marginLeft:   'calc(-50vw + 50%)',
        marginRight:  'calc(-50vw + 50%)',
        marginBottom: '-9999px',
        width:        '100vw',
        height:       'calc(100svh - 57px)',
        overflow:     'hidden',
      }}
    >
      {children}
    </div>
  );
}
