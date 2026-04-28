import { HttpHeaders } from '@angular/common/http';
import { SelectResponse } from '../models/core/selects-response.interface';

export const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

export enum STATUS {
  ENABLED = 1,
  DISABLED = 2,
}

export enum STATUS_RESERVATION {
  ABIERTAS = 1,
  CERRADAS = 0,
}

export enum SPLIT_BUTTON_ACTIONS {
  ACTUALIZAR_DATOS = 1,
  REFRESCAR_FILTROS = 2,
}

export const languages = [
  {
    language: 'English',
    flag: 'us',
  },
  {
    language: 'French',
    flag: 'france',
  },
  {
    language: 'German',
    flag: 'germany',
  },
  {
    language: 'Russian',
    flag: 'russia',
  },
  {
    language: 'Spanish',
    flag: 'spain',
  },
];

export const notifications = [
  {
    icon: 'fal fa-cloud-download',
    subject: 'Download complete',
    description: 'Lorem ipsum dolor sit amet, consectetuer.',
  },
  {
    icon: 'fal fa-cloud-upload',
    subject: 'Upload complete',
    description: 'Lorem ipsum dolor sit amet, consectetuer.',
  },
  {
    icon: 'fal fa-trash',
    subject: '350 MB trash files',
    description: 'Lorem ipsum dolor sit amet, consectetuer.',
  },
];

export const userItems = [
  {
    icon: 'fal fa-user',
    label: 'Profile',
  },
  {
    icon: 'fal fa-cog',
    label: 'Settings',
  },
  {
    icon: 'fal fa-unlock-alt',
    label: 'Lock screen',
  },
  {
    icon: 'fal fa-power-off',
    label: 'Logout',
  },
];

export enum COLORS_BADGE {
  main = 'text-am-main-blue bg-am-main-blue-light border-am-main-blue',
  main_dark = 'text-white bg-am-main-blue border-am-main-blue',
  green = 'text-am-new-green-dark bg-am-new-green-light border-am-new-green-dark',
  green2 = 'text-am-new-green-dark bg-am-new-green border-am-new-green-dark',
  custom = 'text-am-main-custom3 bg-am-main-custom3-dark border-am-main-custom3',
  custom2 = 'text-am-main-blue2-dark bg-am-main-blue2 border-am-main-blue2-dark',
  custom3 = 'text-am-main-custom2-dark bg-am-main-custom2 border-am-main-custom2-dark',
  custom4 = 'text-white bg-am-main-custom4-dark border-am-main-custom4',
  orange = 'text-am-new-orange-dark bg-am-new-orange-light border-am-new-orange-dark',
  gray = 'text-am-gray-dark bg-am-gray-light border-am-gray-dark',
  teal = 'text-am-teal-dark bg-am-teal-light border-am-teal-dark',
  purple = 'text-am-new-purple-dark bg-am-new-purple-light border-am-new-purple-dark',
  red = 'text-am-new-red-dark bg-am-new-red-light border-am-new-red-dark',
  yellow = 'text-am-new-yellow-dark bg-am-new-yellow-light border-am-new-yellow-dark',
  pink = 'text-am-new-pink-dark bg-am-new-pink-light border-am-new-pink-dark',
  coral = 'text-am-coral-dark bg-am-coral-light border-am-coral-dark',
  whatsapp = 'text-white bg-am-new-green border-am-new-green',
}

export const statesSelect: SelectResponse[] = [
  { code: '1', description: 'Enabled' },
  { code: '2', description: 'Disabled' },
];

export const errorMessages: Record<
  number,
  { title: string; message: string; logout?: boolean }
> = {
  400: {
    title: 'Solicitud Incorrecta',
    message:
      'La solicitud enviada contiene datos inválidos o está incompleta. Por favor, revise e intente nuevamente. Si el problema persiste, contacte al soporte técnico.',
    logout: false,
  },
  401: {
    title: 'Sesión Expirada',
    message:
      'Su sesión ha expirado. Por favor, inicie sesión nuevamente para continuar utilizando el sistema.',
    logout: true,
  },
  403: {
    title: 'Acceso Denegado',
    message:
      'No tiene los permisos necesarios para acceder a esta funcionalidad. Si cree que esto es un error, contacte al administrador del sistema.',
    logout: false,
  },
  404: {
    title: 'Recurso No Encontrado',
    message:
      'El recurso solicitado no está disponible o no existe. Por favor, verifique la información ingresada o intente más tarde.',
    logout: false,
  },
  500: {
    title: 'Error Interno del Servidor',
    message:
      'Se produjo un error inesperado en el sistema. Por favor, intente nuevamente más tarde. Si el problema persiste, contacte al administrador.',
    logout: true,
  },
};

export const jurisdictions: SelectResponse[] = [
  { code: '154', description: 'MOLLENDO - AGENCIA ADUANERA DE AREQUIPA' },
  { code: '118', description: 'MARITIMA DEL CALLAO' },
  { code: '127', description: 'PISCO' },
  { code: '046', description: 'PAITA' },
  { code: '190', description: 'CUSCO' },
  { code: '145', description: 'MOLLENDO - MATARANI' },
  { code: '992', description: 'LIMA METROPOLITANA' },
  { code: '235', description: 'AEREA Y POSTAL EX-IAAC' },
  { code: '244', description: 'AEREA Y POSTAL EX-IAPC' },
  { code: '172', description: 'TACNA' },
  { code: '082', description: 'SALAVERRY' },
  { code: '091', description: 'CHIMBOTE' },
  { code: '226', description: 'IQUITOS' },
  { code: '163', description: 'ILO' },
  { code: '028', description: 'TALARA' },
  { code: '262', description: 'DESAGUADERO' },
  { code: '181', description: 'PUNO' },
  { code: '280', description: 'PUERTO MALDONADO' },
  { code: '055', description: 'IAT-LAMBAYEQUE' },
  { code: '019', description: 'TUMBES' },
  { code: '983', description: 'A NIVEL NACIONAL' },
  { code: '000', description: 'SEDE CENTRAL - CHUCUITO' },
  { code: '217', description: 'PUCALLPA' },
  { code: '271', description: 'TARAPOTO' },
  { code: '299', description: 'LA TINA' },
];

export enum UsersFilters {
  ByFirstName = 1,
  ByLastName = 2
}

export enum RoleFilters {
  ByName = 1,
  ByDescription = 2,
}

export enum UserRoleFilters {
  ByUser = 1,
  ByRole = 2,
}

export const ValidationTypes = {
  RUC: 'rucNumberValidator',
  SOLO_NUMEROS: 'onlyNumberValidator',
};
