import React, { useState } from 'react';
import { ArrowRight, Calendar, Filter, Layers } from 'lucide-react';
import { useApp } from '../context/AppContext';

type TestTab = 'recommended' | 'mission30' | 'replica2026' | 'other';

interface MockTest {
  id: string;
  title: string;
  questions: number;
  marks: number;
  durationMins: number;
  attempts: number;
  maxCoins: number;
  heldOn: string;
  isFree: boolean;
  tab: TestTab;
}

const MOCK_TESTS: MockTest[] = [
  {
    id: 'mission_30_test_1',
    title: 'MISSION 30 : Test 1',
    questions: 180,
    marks: 720,
    durationMins: 195,
    attempts: 0,
    maxCoins: 540,
    heldOn: '17 May 2026 at 02:00 PM',
    isFree: true,
    tab: 'mission30'
  },
  {
    id: 'mission_30_test_2',
    title: 'MISSION 30 : Test 2',
    questions: 180,
    marks: 720,
    durationMins: 195,
    attempts: 0,
    maxCoins: 540,
    heldOn: '19 May 2026 at 02:00 PM',
    isFree: true,
    tab: 'mission30'
  },
  {
    id: 'mission_30_test_3',
    title: 'MISSION 30 : Test 3',
    questions: 180,
    marks: 720,
    durationMins: 195,
    attempts: 0,
    maxCoins: 540,
    heldOn: '21 May 2026 at 02:00 PM',
    isFree: true,
    tab: 'mission30'
  },
  {
    id: 'mission_30_test_4',
    title: 'MISSION 30 : Test 4',
    questions: 180,
    marks: 720,
    durationMins: 195,
    attempts: 0,
    maxCoins: 540,
    heldOn: '23 May 2026 at 02:00 PM',
    isFree: true,
    tab: 'mission30'
  }
];

export const MockTestsPage: React.FC = () => {
  const { setCurrentRoute } = useApp();
  const [activeTab, setActiveTab] = useState<TestTab>('mission30');

  const filteredTests = MOCK_TESTS.filter(t => t.tab === activeTab);

  const handleStart = (testId: string) => {
    localStorage.setItem('active_test_id', testId);
    setCurrentRoute('test-instructions');
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6 animate-in fade-in duration-300">
      
      {/* Header Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {[
          { id: 'recommended', label: 'Recommended Tests' },
          { id: 'mission30', label: 'MISSION 30' },
          { id: 'replica2026', label: 'NEET Replica Test 2026' },
          { id: 'other', label: 'Other Tests' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TestTab)}
            className="px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all"
            style={activeTab === tab.id
              ? { background: 'rgba(99,102,241,0.15)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.3)' }
              : { background: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.08)' }
            }
          >
            {tab.label}
          </button>
        ))}
        <button className="ml-auto w-10 h-10 shrink-0 flex items-center justify-center rounded-full"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <Filter className="w-4 h-4 text-white/60" />
        </button>
      </div>

      {/* Test List */}
      <div className="space-y-4">
        {filteredTests.map((test) => (
          <div key={test.id} className="relative rounded-2xl p-5 sm:p-6 transition-all"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
            
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div className="space-y-3">
                {test.isFree && (
                  <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Free</span>
                )}
                <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">{test.title}</h3>
                
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-white/50">
                  <div className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" />
                    <span>{test.questions} Questions | {test.marks} Marks | {test.durationMins} Mins | Attempts: {test.attempts} | Earn upto {test.maxCoins} 🪙</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-1.5 text-xs text-white/50">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Held on {test.heldOn}</span>
                </div>
                
                <button className="text-xs font-medium text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1">
                  <BookOpenIcon className="w-3.5 h-3.5" /> View Syllabus
                </button>
              </div>
              
              <div className="flex sm:flex-col items-center justify-between sm:justify-center gap-2 pt-4 sm:pt-0 border-t sm:border-t-0 border-white/5">
                <button onClick={() => handleStart(test.id)}
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                  style={{ background: 'linear-gradient(135deg, #818cf8, #4f46e5)', boxShadow: '0 4px 12px rgba(99,102,241,0.3)' }}>
                  <ArrowRight className="w-5 h-5 text-white" />
                </button>
                <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider">Start</span>
              </div>
            </div>
          </div>
        ))}
        {filteredTests.length === 0 && (
          <div className="text-center py-20 text-white/40">
            No tests found in this category.
          </div>
        )}
      </div>
    </div>
  );
};

const BookOpenIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
  </svg>
);
