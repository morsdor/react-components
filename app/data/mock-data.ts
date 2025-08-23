/**
 * Mock data for various components
 */

// Countries and capitals for autocomplete and game
export const COUNTRIES_DATA = [
  { id: '1', label: 'United States', value: 'Washington, D.C.', capital: 'Washington, D.C.' },
  { id: '2', label: 'United Kingdom', value: 'London', capital: 'London' },
  { id: '3', label: 'France', value: 'Paris', capital: 'Paris' },
  { id: '4', label: 'Germany', value: 'Berlin', capital: 'Berlin' },
  { id: '5', label: 'Italy', value: 'Rome', capital: 'Rome' },
  { id: '6', label: 'Spain', value: 'Madrid', capital: 'Madrid' },
  { id: '7', label: 'Japan', value: 'Tokyo', capital: 'Tokyo' },
  { id: '8', label: 'China', value: 'Beijing', capital: 'Beijing' },
  { id: '9', label: 'India', value: 'New Delhi', capital: 'New Delhi' },
  { id: '10', label: 'Brazil', value: 'Brasília', capital: 'Brasília' },
  { id: '11', label: 'Canada', value: 'Ottawa', capital: 'Ottawa' },
  { id: '12', label: 'Australia', value: 'Canberra', capital: 'Canberra' },
  { id: '13', label: 'Russia', value: 'Moscow', capital: 'Moscow' },
  { id: '14', label: 'Mexico', value: 'Mexico City', capital: 'Mexico City' },
  { id: '15', label: 'Argentina', value: 'Buenos Aires', capital: 'Buenos Aires' },
  { id: '16', label: 'South Africa', value: 'Cape Town', capital: 'Cape Town' },
  { id: '17', label: 'Egypt', value: 'Cairo', capital: 'Cairo' },
  { id: '18', label: 'Turkey', value: 'Ankara', capital: 'Ankara' },
  { id: '19', label: 'Thailand', value: 'Bangkok', capital: 'Bangkok' },
  { id: '20', label: 'South Korea', value: 'Seoul', capital: 'Seoul' }
]

// Large dataset for data grid (1000+ rows)
export const generateLargeDataset = (count: number = 1000) => {
  const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'Chris', 'Lisa', 'Robert', 'Maria']
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez']
  const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'Design', 'Support']
  const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego']

  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
    lastName: lastNames[Math.floor(Math.random() * lastNames.length)],
    email: `user${index + 1}@example.com`,
    department: departments[Math.floor(Math.random() * departments.length)],
    salary: Math.floor(Math.random() * 100000) + 40000,
    city: cities[Math.floor(Math.random() * cities.length)],
    joinDate: new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
    isActive: Math.random() > 0.1
  }))
}

// Sample images for carousel
export const CAROUSEL_IMAGES = [
  {
    id: '1',
    src: '/majestic-mountain-vista.png',
    alt: 'Beautiful mountain landscape',
    caption: 'Majestic mountain peaks at sunrise'
  },
  {
    id: '2',
    src: '/ocean-sunset.png',
    alt: 'Ocean sunset view',
    caption: 'Golden sunset over the ocean'
  },
  {
    id: '3',
    src: '/forest-path.png',
    alt: 'Forest hiking path',
    caption: 'Peaceful forest trail in autumn'
  },
  {
    id: '4',
    src: '/vibrant-city-skyline.png',
    alt: 'Modern city skyline',
    caption: 'Urban skyline at night'
  },
  {
    id: '5',
    src: '/vast-desert.png',
    alt: 'Desert landscape',
    caption: 'Vast desert under starry sky'
  }
]

// File system structure for tree view
export const FILE_SYSTEM_DATA = {
  id: 'root',
  name: 'Project Root',
  type: 'folder' as const,
  children: [
    {
      id: 'src',
      name: 'src',
      type: 'folder' as const,
      children: [
        {
          id: 'components',
          name: 'components',
          type: 'folder' as const,
          children: [
            { id: 'header', name: 'Header.tsx', type: 'file' as const },
            { id: 'footer', name: 'Footer.tsx', type: 'file' as const },
            {
              id: 'ui',
              name: 'ui',
              type: 'folder' as const,
              children: [
                { id: 'button', name: 'Button.tsx', type: 'file' as const },
                { id: 'modal', name: 'Modal.tsx', type: 'file' as const },
                { id: 'input', name: 'Input.tsx', type: 'file' as const }
              ]
            }
          ]
        },
        {
          id: 'pages',
          name: 'pages',
          type: 'folder' as const,
          children: [
            { id: 'home', name: 'Home.tsx', type: 'file' as const },
            { id: 'about', name: 'About.tsx', type: 'file' as const },
            { id: 'contact', name: 'Contact.tsx', type: 'file' as const }
          ]
        },
        {
          id: 'utils',
          name: 'utils',
          type: 'folder' as const,
          children: [
            { id: 'helpers', name: 'helpers.ts', type: 'file' as const },
            { id: 'constants', name: 'constants.ts', type: 'file' as const }
          ]
        }
      ]
    },
    {
      id: 'public',
      name: 'public',
      type: 'folder' as const,
      children: [
        { id: 'favicon', name: 'favicon.ico', type: 'file' as const },
        { id: 'logo', name: 'logo.png', type: 'file' as const }
      ]
    },
    { id: 'package', name: 'package.json', type: 'file' as const },
    { id: 'readme', name: 'README.md', type: 'file' as const },
    { id: 'gitignore', name: '.gitignore', type: 'file' as const }
  ]
}

// Transfer list data
export const TRANSFER_LIST_DATA = {
  available: [
    { id: '1', label: 'React', category: 'Frontend' },
    { id: '2', label: 'Vue.js', category: 'Frontend' },
    { id: '3', label: 'Angular', category: 'Frontend' },
    { id: '4', label: 'Node.js', category: 'Backend' },
    { id: '5', label: 'Express', category: 'Backend' },
    { id: '6', label: 'Django', category: 'Backend' },
    { id: '7', label: 'PostgreSQL', category: 'Database' },
    { id: '8', label: 'MongoDB', category: 'Database' },
    { id: '9', label: 'Redis', category: 'Database' },
    { id: '10', label: 'Docker', category: 'DevOps' },
    { id: '11', label: 'Kubernetes', category: 'DevOps' },
    { id: '12', label: 'AWS', category: 'Cloud' }
  ],
  selected: [
    { id: '13', label: 'TypeScript', category: 'Language' },
    { id: '14', label: 'JavaScript', category: 'Language' }
  ]
}

// Kanban board data
export const KANBAN_DATA = {
  columns: [
    {
      id: 'todo',
      title: 'To Do',
      cards: [
        { id: '1', title: 'Design new homepage', description: 'Create wireframes and mockups', priority: 'high' },
        { id: '2', title: 'Set up CI/CD pipeline', description: 'Configure automated deployment', priority: 'medium' },
        { id: '3', title: 'Write unit tests', description: 'Add test coverage for components', priority: 'low' }
      ]
    },
    {
      id: 'inprogress',
      title: 'In Progress',
      cards: [
        { id: '4', title: 'Implement user authentication', description: 'Add login and registration', priority: 'high' },
        { id: '5', title: 'Optimize database queries', description: 'Improve performance', priority: 'medium' }
      ]
    },
    {
      id: 'review',
      title: 'Review',
      cards: [
        { id: '6', title: 'Code review for API endpoints', description: 'Review REST API implementation', priority: 'medium' }
      ]
    },
    {
      id: 'done',
      title: 'Done',
      cards: [
        { id: '7', title: 'Setup project structure', description: 'Initialize React project', priority: 'high' },
        { id: '8', title: 'Install dependencies', description: 'Add required packages', priority: 'low' }
      ]
    }
  ]
}
