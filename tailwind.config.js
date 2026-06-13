/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          coral:           '#B85C4A',
          'coral-dark':    '#8E4232',
          'coral-light':   '#D98876',
          'coral-soft':    '#FDE3DA',
          'coral-bright':  '#D95A4E',

          cream:           '#F5EFE6',
          'cream-soft':    '#FAF6EE',
          charcoal:        '#1A1A1A',

          sage:            '#6FA878',
          'sage-dark':     '#4F8A5A',
          gold:            '#DFA94A',
          'gold-dark':     '#B88931',

          primary:         '#B85C4A',
          'primary-dark':  '#8E4232',
          ink:             '#1A1A1A',

          purple:          '#5b21b6',
          'purple-dark':   '#4c1d95',

          amber:           '#d97706',
          'amber-soft':    '#fffbeb'
        },

        ink:         '#1A1A1A',
        'ink-muted': '#6B6258',

        lost:  '#D7503A',
        found: '#3F8B5C',
        adopt: '#E8A53C',

        warn: '#E8A53C',
        good: '#3F8B5C',
        bad:  '#D7503A'
      },
      fontFamily: {
        sans:    ['Nunito', 'system-ui', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Nunito', 'system-ui', 'Segoe UI', 'sans-serif']
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.5rem'
      },
      boxShadow: {
        'soft': '0 4px 20px -8px rgba(26, 26, 26, 0.10)',
        'card': '0 8px 30px -12px rgba(26, 26, 26, 0.18)'
      }
    }
  },
  plugins: []
};
