import React, { useState, useCallback, useMemo, useEffect } from 'react';
import type { Portfolio, Section, Locale, DeviceView, SectionType } from './types';
import { INITIAL_PORTFOLIO_DATA } from './constants';
import { TopBar } from './components/TopBar';
import { Library } from './components/Library';
import { Canvas } from './components/Canvas';
import { InspectorNew } from './components/Inspector/InspectorNew';
import { useProjectStore } from './store/project';
import { aboutSchema } from './schemas/about';
import type { SectionSchema } from './schemas/types';
import { TooltipProvider } from './components/ui/tooltip';
import { Menu, X } from 'lucide-react';

// Map section types to their schemas
const schemaMap: Record<string, SectionSchema> = {
  about: aboutSchema,
  // Add more schemas here as they are created
};

export default function App() {
  const { present: portfolio, setPortfolio, updateSection, addSection, reorderSections } = useProjectStore();
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [activeLocale, setActiveLocale] = useState<Locale>('en');
  const [isLibraryOpen, setLibraryOpen] = useState(false);
  const [isInspectorOpen, setInspectorOpen] = useState(false);
  const [deviceView, setDeviceView] = useState<DeviceView>('desktop');
  const [justAddedSectionId, setJustAddedSectionId] = useState<string | null>(null);

  // Initialize store with initial data on mount
  useEffect(() => {
    setPortfolio(INITIAL_PORTFOLIO_DATA);
    setSelectedSectionId(INITIAL_PORTFOLIO_DATA.sections[0]?.id || null);
    setActiveLocale(INITIAL_PORTFOLIO_DATA.defaultLocale);
  }, [setPortfolio]);

  const selectedSection = useMemo(() => 
    portfolio?.sections?.find((s) => s.id === selectedSectionId), 
    [portfolio?.sections, selectedSectionId]
  );

  const selectedSchema = useMemo(() => {
    if (!selectedSection) return null;
    return schemaMap[selectedSection.type] || null;
  }, [selectedSection]);
  
  const handleUpdateSection = useCallback((sectionId: string, data: any) => {
    updateSection(sectionId, data);
  }, [updateSection]);

  const handleAddSection = useCallback((section: Section) => {
    addSection(section);
    setSelectedSectionId(section.id);
    setJustAddedSectionId(section.id);
    setLibraryOpen(false);
  }, [addSection]);

  const handleReorder = useCallback((startIndex: number, endIndex: number) => {
    reorderSections(startIndex, endIndex);
  }, [reorderSections]);

  const handleSelectSection = (sectionId: string) => {
    setSelectedSectionId(sectionId);
    setInspectorOpen(true); // Open inspector on mobile when a section is selected
  };
  
  useEffect(() => {
    if (justAddedSectionId) {
      const element = document.getElementById(justAddedSectionId);
      if (element) {
        // Use a timeout to ensure the element is rendered before scrolling
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setJustAddedSectionId(null);
        }, 100);
      } else {
        // Reset if element not found for any reason
        setJustAddedSectionId(null);
      }
    }
  }, [justAddedSectionId]);

  // Don't render until portfolio is loaded
  if (!portfolio) {
    return <div className="bg-brand-dark text-brand-light min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <TooltipProvider>
    <div className="bg-brand-dark text-brand-light font-sans min-h-screen flex flex-col">
      <TopBar 
        projectName={portfolio.name} 
        activeLocale={activeLocale} 
        setActiveLocale={setActiveLocale} 
        enabledLocales={portfolio.enabledLocales} 
        portfolio={portfolio}
        deviceView={deviceView}
        setDeviceView={setDeviceView}
      />
      <main className="flex-grow flex w-full h-[calc(100vh-4rem)]">
        {/* Mobile FABs */}
        <div className="md:hidden fixed bottom-4 left-4 z-40">
           <button onClick={() => setLibraryOpen(true)} className="bg-brand-accent text-white p-4 rounded-full shadow-lg">
             <Menu size={24} />
           </button>
        </div>
       
        {/* Library (Desktop Sidebar / Mobile Drawer) */}
        <div className={`fixed md:relative z-50 inset-y-0 left-0 transform ${isLibraryOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out`}>
            <Library onAddSection={handleAddSection} />
             <button onClick={() => setLibraryOpen(false)} className="md:hidden absolute top-4 right-4 text-brand-mist hover:text-white">
                <X size={24} />
            </button>
        </div>
        {isLibraryOpen && <div onClick={()=>setLibraryOpen(false)} className="md:hidden fixed inset-0 bg-black/50 z-40 animate-fade-in" />}
        
        {/* Canvas */}
        <div className="flex-grow h-full overflow-y-auto bg-brand-night transition-all duration-300 ease-in-out">
          <Canvas
            sections={portfolio.sections}
            onSelectSection={handleSelectSection}
            selectedSectionId={selectedSectionId}
            activeLocale={activeLocale}
            onReorder={handleReorder}
            deviceView={deviceView}
          />
        </div>
        
        {/* Inspector (Desktop Sidebar / Mobile Bottom Sheet) */}
        <div className={`fixed z-50 bottom-0 left-0 right-0 md:relative md:inset-y-0 md:right-0 md:transform-none transition-transform duration-300 ease-in-out ${isInspectorOpen ? 'translate-y-0' : 'translate-y-full'} md:translate-y-0`}>
          <div className="bg-brand-dark md:w-[350px] h-[75dvh] md:h-full flex flex-col animate-sheet-in md:animate-none">
            <InspectorNew
                key={selectedSectionId}
                section={selectedSection}
                schema={selectedSchema}
                onUpdate={handleUpdateSection}
                activeLocale={activeLocale}
                onClose={() => setInspectorOpen(false)}
              />
          </div>
        </div>
        {isInspectorOpen && <div onClick={()=>setInspectorOpen(false)} className="md:hidden fixed inset-0 bg-black/50 z-40 animate-fade-in" />}

      </main>
    </div>
    </TooltipProvider>
  );
}