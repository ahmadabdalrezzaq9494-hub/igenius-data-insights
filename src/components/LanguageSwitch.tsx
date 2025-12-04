import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Languages } from 'lucide-react';

export const LanguageSwitch = () => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="gap-2"
      aria-label="Switch language"
    >
      <Languages className="h-4 w-4" />
      <span className="font-medium">{language === 'en' ? 'العربية' : 'English'}</span>
    </Button>
  );
};
