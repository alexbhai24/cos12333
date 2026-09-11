import type {
  Course,
  SubjectClass,
  VideoLecture,
  Post,
  DocumentItem,
  Book,
  TestItem,
  BatchItem,
  AIMessage
} from '../types';

export const FEATURED_COURSE: Course = {
  id: 'qc-40',
  title: 'Quantum Computing & Neural Architectures v4.0',
  category: 'Advanced Science',
  level: 'Advanced',
  duration: '48 Hrs',
  enrolledCount: 18420,
  rating: 4.9,
  reviewCount: 1240,
  progress: 64,
  modules: [
    {
      id: 'm1',
      title: 'Module 01: Qubit Superposition & Quantum Gates',
      duration: '45 mins',
      completed: true,
      type: 'video'
    },
    {
      id: 'm2',
      title: 'Module 02: Entanglement & Bell State Tomography',
      duration: '1 hr 15 mins',
      completed: true,
      type: 'video'
    },
    {
      id: 'm3',
      title: 'Module 03: Quantum Neural Network Layer Synthesis',
      duration: '50 mins',
      completed: false,
      type: 'video'
    },
    {
      id: 'm4',
      title: 'Module 04: Variational Quantum Eigensolver (VQE) Lab',
      duration: '1 hr 30 mins',
      completed: false,
      type: 'quiz'
    }
  ]
};

export const MOCK_SUBJECTS: SubjectClass[] = [
  {
    id: 'sub-phy',
    name: 'Quantum & Relativistic Physics',
    code: 'PH',
    progress: 78,
    totalLessons: 32,
    completedLessons: 25,
    category: 'Physics',
    iconGradient: 'from-cyan-500 to-blue-600',
    status: 'In Progress'
  },
  {
    id: 'sub-bot',
    name: 'Cellular & Synthetic Botany',
    code: 'BO',
    progress: 45,
    totalLessons: 24,
    completedLessons: 11,
    category: 'Biology',
    iconGradient: 'from-emerald-400 to-teal-600',
    status: 'In Progress'
  },
  {
    id: 'sub-zoo',
    name: 'Neurobiology & Evolutionary Zoology',
    code: 'ZO',
    progress: 90,
    totalLessons: 28,
    completedLessons: 25,
    category: 'Biology',
    iconGradient: 'from-amber-400 to-orange-600',
    status: 'In Progress'
  },
  {
    id: 'sub-pc',
    name: 'Physical & Quantum Chemistry',
    code: 'PC',
    progress: 100,
    totalLessons: 20,
    completedLessons: 20,
    category: 'Chemistry',
    iconGradient: 'from-violet-500 to-purple-700',
    status: 'Completed'
  },
  {
    id: 'sub-oc',
    name: 'Organic Reaction Mechanisms & AI Synthesis',
    code: 'OC',
    progress: 35,
    totalLessons: 30,
    completedLessons: 10,
    category: 'Chemistry',
    iconGradient: 'from-pink-500 to-rose-600',
    status: 'In Progress'
  },
  {
    id: 'sub-ic',
    name: 'Inorganic Coordination Chemistry',
    code: 'IC',
    progress: 15,
    totalLessons: 18,
    completedLessons: 3,
    category: 'Chemistry',
    iconGradient: 'from-indigo-400 to-blue-700',
    status: 'In Progress'
  }
];

export const MOCK_VIDEOS: VideoLecture[] = [];

export const MOCK_POSTS: Post[] = [];

export const MOCK_DOCUMENTS: DocumentItem[] = [];

export const MOCK_BOOKS: Book[] = [];

export const MOCK_TESTS: TestItem[] = [];

export const MOCK_AI_CONVERSATION: AIMessage[] = [
  {
    id: 'msg-1',
    sender: 'user',
    text: 'Can you explain Faraday Law of Electromagnetic Induction and Lenz Law vector direction?',
    timestamp: '10:42 AM'
  },
  {
    id: 'msg-2',
    sender: 'ai',
    text: 'Faraday Law states that the induced electromotive force (EMF) in a closed circuit is equal to the negative rate of change of magnetic flux through the circuit:\n\n$$\\mathcal{E} = -\\frac{d\\Phi_B}{dt}$$\n\nLenz Law gives the direction of the induced current: the direction of the induced EMF always opposes the change in magnetic flux that produces it (hence the negative sign!).',
    timestamp: '10:42 AM'
  }
];

export const MOCK_BATCHES: BatchItem[] = [];
