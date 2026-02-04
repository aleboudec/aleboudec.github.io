tailwind.config = {
      theme: {
        extend: {
          colors: {
            primary: '#2F4A40',
            accent: '#5EC19E',
            highlight: '#A7E6C4',
            contrast: '#FFFFFF'
          },
          boxShadow: {
            soft: '0 4px 12px rgba(0,0,0,0.08)',
            card: '0 8px 20px rgba(0,0,0,0.12)',
            hover: '0 12px 24px rgba(0,0,0,0.15)'
          },
          borderRadius: {
            xl2: '1.25rem'
          },
          animation: {
            'fade-in': 'fadeIn 0.6s ease-out forwards',
            'pulse-once': 'pulse 1.5s ease-out 1'
          },
          keyframes: {
            fadeIn: {
              '0%': { opacity: '0', transform: 'translateY(12px)' },
              '100%': { opacity: '1', transform: 'translateY(0)' }
            }
          }
        }
      }
    }


