import { useEffect } from 'react';
import { RouterProvider, useRouter } from './router';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { TelegramFab } from './components/TelegramButton';
import { HomePage } from './pages/HomePage';
import { ContactsPage } from './pages/ContactsPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { MaterialsPage } from './pages/MaterialsPage';
import { ExamindPage } from './pages/ExamindPage';
import { OgeMonologuePage } from './pages/OgeMonologuePage';
import { SpeakPracticePage } from './pages/SpeakPracticePage';
import { OgeLetterWorksheetPage } from './pages/OgeLetterWorksheetPage';
import { OgeMonologueWorksheetPage } from './pages/OgeMonologueWorksheetPage';
import { ServicePage } from './pages/ServicePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { applyNotFoundSeo, applySeoMetadata } from './seo-client';
import { getPageSeo } from './seo';

function PageView() {
  const { page } = useRouter();

  useEffect(() => {
    if (page === null) {
      applyNotFoundSeo();
      return;
    }
    applySeoMetadata(getPageSeo(page));
  }, [page]);

  switch (page) {
    case null:
      return <NotFoundPage />;
    case 'ogePrep':
    case 'egePrep':
    case 'schoolEnglish':
    case 'teenSpeaking':
      return <ServicePage page={page} />;
    case 'contacts':
      return <ContactsPage />;
    case 'materials':
      return <MaterialsPage />;
    case 'examind':
      return <ExamindPage />;
    case 'ogeMonologue':
      return <OgeMonologuePage />;
    case 'speakPractice':
      return <SpeakPracticePage />;
    case 'ogeElectronicLetter':
      return <OgeLetterWorksheetPage />;
    case 'ogeMonologueWorksheet':
      return <OgeMonologueWorksheetPage />;
    case 'privacy':
      return <PrivacyPage />;
    default:
      return <HomePage />;
  }
}

function App({ initialUrl }: { initialUrl?: string }) {
  return (
    <RouterProvider initialUrl={initialUrl}>
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex-1">
          <PageView />
        </div>
        <Footer />
        <TelegramFab />
      </div>
    </RouterProvider>
  );
}

export default App;
