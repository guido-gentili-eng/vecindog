export default function MapaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        marginLeft:   'calc(-50vw + 50%)',
        marginRight:  'calc(-50vw + 50%)',
        marginBottom: '-4rem',
        width:        '100vw',
        height:       'calc(100vh - 65px)',
        overflow:     'hidden',
      }}
    >
      {children}
    </div>
  );
}
