/**
 * Structured order options (Interior + Logistics) stored in orders.order_options.
 * Display-ready strings so PDF and dashboard don't need i18n.
 */
export type FloorWallsOption = 'felt' | 'carpolan';
export type LogisticsMethod = 'air' | 'sea';

/** Interior block: готовые строки для отображения (Interior) */
export interface OrderInteriorDisplay {
  /** Заголовок секции, напр. "Interior" / "Интерьер" */
  title?: string;
  /** Строки блока: войлок, в наличии, эксклюзив, чехол, сборка */
  lines: string[];
}

/** Logistics block: готовые строки для отображения (Logistics) */
export interface OrderLogisticsDisplay {
  /** Заголовок секции */
  title?: string;
  /** Строки: доставка (авиа/море), установка */
  lines: string[];
}

export interface OrderOptions {
  interior?: OrderInteriorDisplay;
  logistics?: OrderLogisticsDisplay;
  /** Названия выбранных аксессуаров для блока [Selected Accessories] */
  selectedAccessories?: string[];
  /** Произвольный текст от клиента */
  freeMessage?: string;
}
