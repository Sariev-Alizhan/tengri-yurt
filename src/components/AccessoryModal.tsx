'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

interface AccessoryItem {
  id: string;
  name: string;
  description: string;
  history: string;
  price_usd: number;
  category: string;
  photos?: string[];
  name_i18n?: { ru: string; en: string; kk: string };
  description_i18n?: { ru: string; en: string; kk: string };
  history_i18n?: { ru: string; en: string; kk: string };
}

interface AccessoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceed: (selectedAccessories: string[]) => void;
  locale: string;
}

export function AccessoryModal({ isOpen, onClose, onProceed, locale }: AccessoryModalProps) {
  const [selectedAccessories, setSelectedAccessories] = useState<string[]>([]);
  const [expandedHistory, setExpandedHistory] = useState<string | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [accessories, setAccessories] = useState<AccessoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAccessories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/accessories?locale=${locale}`);
      const data = await res.json();
      setAccessories(data.accessories || []);
    } catch (error) {
      console.error('Error fetching accessories:', error);
    } finally {
      setLoading(false);
    }
  }, [locale]);

  useEffect(() => {
    if (isOpen) {
      fetchAccessories();
    }
  }, [isOpen, fetchAccessories]);

  if (!isOpen && !isClosing) return null;

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  };

  const handleProceedWithAnimation = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      handleProceed();
    }, 300);
  };

  const localeKey = locale as 'ru' | 'en' | 'kk';

  const toggleAccessory = (id: string) => {
    setSelectedAccessories(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const toggleHistory = (id: string) => {
    setExpandedHistory(expandedHistory === id ? null : id);
  };

  const handleProceed = () => {
    onProceed(selectedAccessories);
  };

  const translations = {
    ru: {
      title: 'Хотите добавить традиционные аксессуары?',
      subtitle: 'Дополните вашу юрту аутентичными элементами кочевой культуры',
      yes: 'Да, хочу посмотреть',
      no: 'Нет, спасибо',
      selected: 'Выбрано',
      total: 'Итого',
      proceed: 'Продолжить с выбранными',
      showHistory: 'История',
      hideHistory: 'Скрыть',
      noSelection: 'Выберите хотя бы один аксессуар',
    },
    en: {
      title: 'Would you like to add traditional accessories?',
      subtitle: 'Complete your yurt with authentic elements of nomadic culture',
      yes: 'Yes, show me',
      no: 'No, thank you',
      selected: 'Selected',
      total: 'Total',
      proceed: 'Continue with selected',
      showHistory: 'History',
      hideHistory: 'Hide',
      noSelection: 'Select at least one accessory',
    },
    kk: {
      title: 'Дәстүрлі аксессуарлар қосқыңыз келе ме?',
      subtitle: 'Киіз үйіңізді көшпелі мәдениеттің шынайы элементтерімен толықтырыңыз',
      yes: 'Иә, көрсетіңіз',
      no: 'Жоқ, рахмет',
      selected: 'Таңдалды',
      total: 'Барлығы',
      proceed: 'Таңдалғандармен жалғастыру',
      showHistory: 'Тарихы',
      hideHistory: 'Жасыру',
      noSelection: 'Кемінде бір аксессуар таңдаңыз',
    },
  };

  const t = translations[localeKey] || translations.en;

  const totalPrice = accessories
    .filter(acc => selectedAccessories.includes(acc.id))
    .reduce((sum, acc) => sum + (acc.price_usd || 0), 0);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300"
      style={{
        opacity: isClosing ? 0 : 1,
      }}
      onClick={handleClose}
    >
      {/* Background image with blur */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/background.jpg"
          alt=""
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div 
          className="absolute inset-0 z-[1]" 
          style={{ 
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
          }} 
        />
      </div>
      <div 
        className="relative bg-beige-deep/95 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg shadow-2xl scrollbar-hide backdrop-blur-sm"
        style={{
          transform: isClosing ? 'translateY(20px) scale(0.95)' : 'translateY(0) scale(1)',
          opacity: isClosing ? 0 : 1,
          transition: 'all 0.3s ease-out',
          scrollBehavior: 'smooth',
          background: 'rgba(122, 106, 84, 0.95)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-beige-deep border-b border-white/20 p-6 md:p-8">
          <h2 className="font-garamond text-white text-3xl md:text-4xl mb-2">
            {t.title}
          </h2>
          <p className="font-inter text-white/70 text-sm md:text-base">
            {t.subtitle}
          </p>
        </div>

        <div className="p-6 md:p-8 space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <p className="font-inter text-white/60 text-sm">Loading accessories...</p>
            </div>
          ) : accessories.length === 0 ? (
            <div className="text-center py-12">
              <p className="font-inter text-white/60 text-sm">No accessories available</p>
            </div>
          ) : (
            accessories.map((accessory, index) => {
              const isSelected = selectedAccessories.includes(accessory.id);
              const isExpanded = expandedHistory === accessory.id;
              const photo = accessory.photos?.[0];

              return (
                <div
                  key={accessory.id}
                  className={`border rounded-lg p-4 transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? 'border-white/60 bg-white/5 shadow-lg scale-[1.02]'
                      : 'border-white/20 bg-transparent hover:border-white/40 hover:bg-white/[0.02]'
                  }`}
                  style={{
                    animation: `fadeInUp 0.4s ease-out ${index * 0.05}s both`,
                  }}
                  onClick={() => toggleAccessory(accessory.id)}
                >
                  <div className="flex items-start gap-4">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => {
                        e.stopPropagation();
                        toggleAccessory(accessory.id);
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="mt-1 w-5 h-5 accent-white/80 cursor-pointer transition-transform duration-200 hover:scale-110"
                    />
                    {photo && (
                      <div className="shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-md overflow-hidden">
                        <img
                          src={photo}
                          alt={accessory.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-2">
                        <h3 className="font-garamond text-white text-xl">
                          {accessory.name}
                        </h3>
                        <span className="font-inter text-white/90 text-sm md:text-base whitespace-nowrap">
                          ${formatNumber(accessory.price_usd)}
                        </span>
                      </div>
                      <p className="font-inter text-white/70 text-sm mb-3">
                        {accessory.description}
                      </p>
                      {accessory.history && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleHistory(accessory.id);
                            }}
                            className="font-inter text-white/60 text-xs uppercase tracking-wider hover:text-white transition-all duration-200"
                          >
                            {isExpanded ? t.hideHistory : t.showHistory} →
                          </button>
                          <div
                            className="overflow-hidden transition-all duration-500 ease-in-out"
                            style={{
                              maxHeight: isExpanded ? '500px' : '0',
                              opacity: isExpanded ? 1 : 0,
                            }}
                          >
                            <div className="mt-3 pt-3 border-t border-white/10">
                              <p className="font-inter text-white/60 text-sm leading-relaxed">
                                {accessory.history}
                              </p>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="sticky bottom-0 bg-beige-deep border-t border-white/20 p-6 md:p-8">
          <div
            className="transition-all duration-500 ease-out overflow-hidden"
            style={{
              maxHeight: selectedAccessories.length > 0 ? '100px' : '0',
              opacity: selectedAccessories.length > 0 ? 1 : 0,
              marginBottom: selectedAccessories.length > 0 ? '16px' : '0',
            }}
          >
            <div className="flex justify-between items-center">
              <span className="font-inter text-white/70 text-sm">
                {t.selected}: {selectedAccessories.length}
              </span>
              <span className="font-garamond text-white text-xl">
                {t.total}: ${formatNumber(totalPrice)}
              </span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleClose}
              className="flex-1 border border-white/40 text-white py-3 px-6 uppercase font-inter text-xs tracking-[0.15em] hover:bg-white/10 hover:border-white/60 transition-all duration-300"
            >
              {t.no}
            </button>
            <button
              onClick={handleProceedWithAnimation}
              disabled={selectedAccessories.length === 0}
              className="flex-1 border border-white/60 bg-white/10 text-white py-3 px-6 uppercase font-inter text-xs tracking-[0.15em] hover:bg-white/20 hover:border-white/80 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white/10 disabled:hover:border-white/60"
            >
              {selectedAccessories.length > 0 ? t.proceed : t.yes}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
