import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { Button } from 'react-daisyui';
import { useTranslation } from 'react-i18next';
import { FaGlobe/*, FaSortDown */} from 'react-icons/fa';
import { useLocalStorage, useOnClickOutside } from 'usehooks-ts';

import { ReactComponent as EnFlag } from '@/svg/flags/en.svg';
import { ReactComponent as TwFlag } from '@/svg/flags/tw.svg';

const LANGUAGES = [
  { code: 'en', name: 'English', icon: <EnFlag width="20" height="20" title={'English'} /> },
  { code: 'zh', name: '繁體中文', icon: <TwFlag width="20" height="20" title={'繁體中文'} /> },
] as const;

type LanguageCode = (typeof LANGUAGES)[number]['code'];

export function SwitchLanguageButton() {
  const { t, i18n } = useTranslation();
  const ref = useRef(null);
  const [lang, setLang] = useLocalStorage<LanguageCode>('langCode', 'zh');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useOnClickOutside(ref, () => setIsMenuOpen(false));

  useEffect(() => {
    document.documentElement.setAttribute('lang', lang);
    i18n.changeLanguage(lang);
  }, [lang]);

  useEffect(() => {
    if (!isMenuOpen && document.activeElement) {
      const elem = document.activeElement as HTMLElement;
      elem.blur();
    }
  }, [isMenuOpen]);
  
  return (
    <div title="Change Language" className={clsx('dropdown', 'dropdown-end', isMenuOpen && 'dropdown-open')} ref={ref}>
      <Button
        type="button"
        title={t('Change Language')}
        tabIndex={0}
        color="ghost"
        className="gap-1 normal-case"
        onClick={() => setIsMenuOpen((prev) => !prev)}
      >
        <FaGlobe size={20} />
      </Button>
      <div className="w-56 mt-16 overflow-y-auto shadow-2xl dropdown-content bg-base-200 text-base-content rounded-t-box rounded-b-box top-px">
        <ul className="gap-1 p-3 menu menu-compact" tabIndex={0}>
          {LANGUAGES.map((language) => (
            <li key={language.code}>
              <a
                className={clsx('flex', i18n.language === language.code && 'active')}
                onClick={() => {
                  setLang(language.code);
                  setIsMenuOpen(false);
                }}
              >
                {language.icon}
                <span className="flex justify-between flex-1">{language.name}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
