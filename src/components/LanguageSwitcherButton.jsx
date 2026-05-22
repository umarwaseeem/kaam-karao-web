import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext.jsx';
import { Dropdown } from './ui/Dropdown.jsx';

const LANG_OPTIONS = [
  { value: 'en',    label: 'English' },
  { value: 'ur',    label: 'اردو' },
  { value: 'ur-RO', label: 'Roman Urdu' },
];

export function LanguageSwitcherButton({ className }) {
  const { lang, setLanguage } = useLanguage();
  return (
    <Dropdown
      value={lang}
      onChange={setLanguage}
      options={LANG_OPTIONS}
      className={className}
    />
  );
}
