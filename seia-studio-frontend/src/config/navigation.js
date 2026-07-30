export const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: 'ChartPieIcon' },
  { name: 'Transacción', path: '/transaction', icon: 'PlusCircleIcon', highlight: true },
  { name: 'Historial', path: '/history', icon: 'ClockIcon' },
  { 
    name: 'Gestión', 
    path: '#', 
    icon: 'CogIcon',
    children: [
      { name: 'Catálogo', path: '/catalog' },
      { name: 'Categorías', path: '/categories' }
    ]
  }
];