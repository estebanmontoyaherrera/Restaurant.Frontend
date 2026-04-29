import { COLORS_BADGE } from '@app/shared/utils/global-constants.util';

export const ORDER_STATUSES = [
  'Abierto',
  'En Preparación',
  'Listo',
  'Entregado',
  'Cerrado',
];

export const orderStatusSelect = ORDER_STATUSES.map((status) => ({
  code: status,
  description: status,
}));

export function getOrderStatusBadge(status: string) {
  let css =
    'max-w-36 overflow-hidden truncate text-center font-medium p-1.5 rounded-lg text-xs border m-auto ';

  const badge = {
    label: status,
    tooltip: status,
    css: css + COLORS_BADGE.main,
  };

  if (status === 'Abierto') badge.css = css + COLORS_BADGE.green;
  if (status === 'En Preparación') badge.css = css + COLORS_BADGE.orange;
  if (status === 'Listo') badge.css = css + COLORS_BADGE.teal;
  if (status === 'Entregado') badge.css = css + COLORS_BADGE.custom4;
  if (status === 'Cerrado') badge.css = css + COLORS_BADGE.gray;

  return badge;
}

export function getNextOrderStatus(status: string): string | null {
  const index = ORDER_STATUSES.indexOf(status);
  return index >= 0 && index < ORDER_STATUSES.length - 1
    ? ORDER_STATUSES[index + 1]
    : null;
}

export function canEditOrderItems(status: string): boolean {
  return status === 'Abierto';
}
