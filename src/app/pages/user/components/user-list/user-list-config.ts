import { MenuFilterTable } from '@app/shared/models/reusables/filter-menu-states.interface';
import { GenericButton } from '@app/shared/models/reusables/generic-button.interface';
import { TableColumns } from '@app/shared/models/reusables/list-table.interface';
import { SplitButton } from '@app/shared/models/reusables/split-button.interface';
import { GenericValidators } from '@app/shared/utils/generic-validators.util';
import {
  SPLIT_BUTTON_ACTIONS,
  STATUS,
  UsersFilters,
} from '@app/shared/utils/global-constants.util';
import { UserResponse } from '../../models/user-response.interface';

const tableColumns: TableColumns<UserResponse>[] = [
  {
    label: '',
    cssLabel: [],
    property: 'icEdit',
    cssProperty: [],
    type: 'icon',
    sticky: true,
    sort: false,
    sortProperty: '',
    visible: true,
    action: 'edit',
  },
  {
    label: '',
    cssLabel: [],
    property: 'icDelete',
    cssProperty: [],
    type: 'icon',
    sticky: true,
    sort: false,
    sortProperty: '',
    visible: true,
    action: 'delete',
  },
  {
    label: 'Nombre',
    cssLabel: ['font-bold', 'text-sm', 'text-am-main-blue-dark'],
    property: 'fullName',
    cssProperty: ['text-xs', 'font-bold', 'whitespace-normal', 'max-w-120'],
    type: 'text',
    sticky: false,
    sort: true,
    sortProperty: 'firstname',
    visible: true,
    download: true,
  },
  {
    label: 'Email',
    cssLabel: ['font-bold', 'text-sm', 'text-am-main-blue-dark'],
    property: 'email',
    cssProperty: ['text-xs', 'font-bold', 'whitespace-normal', 'max-w-120'],
    type: 'text',
    sticky: false,
    sort: true,
    sortProperty: 'email',
    visible: true,
    download: true,
  },
  {
    label: 'Fecha de creación',
    cssLabel: ['font-bold', 'text-sm', 'text-am-main-blue-dark'],
    property: 'auditCreateDate',
    cssProperty: [
      'text-xs',
      'uppercase',
      'font-bold',
      'whitespace-normal',
      'max-w-120',
    ],
    type: 'datetime',
    sticky: false,
    sort: true,
    visible: true,
    download: true,
  },
  {
    label: 'Estado',
    cssLabel: [
      'font-bold',
      'text-sm',
      'text-am-main-blue-dark',
      'mat-sort-header-text-center',
    ],
    property: 'stateDescription',
    cssProperty: [],
    type: 'simpleBadge',
    sticky: false,
    sort: false,
    visible: true,
    download: true,
  },
];

const actionButtonUser: GenericButton = {
  label: 'Crear usuario',
  icon: 'add',
  tooltip: 'Crear nuevo usuario',
};

const searchOptions = [
  {
    label: 'Nombre',
    value: UsersFilters.ByFirstName,
    placeholder: 'Buscar por nombre',
    validation: [GenericValidators.defaultDescription],
    validation_desc: 'Permite búsqueda por las primeras tres letras.',
    icon: 'tune',
  },
  {
    label: 'Apellidos',
    value: UsersFilters.ByLastName,
    placeholder: 'Buscar por apellidos',
    validation: [GenericValidators.defaultDescription],
    validation_desc: 'Permite búsqueda por las primeras tres letras.',
    icon: 'tune',
  },
];

const menuItems: MenuFilterTable = {
  label: 'Estados',
  icon: 'filter_list',
  tooltip: 'Estados',
  menuItems: [
    {
      label: 'Enabled',
      icon: 'label',
      cssIcon: ['text-am-main-custom4-dark'],
      value: STATUS.ENABLED,
    },
    {
      label: 'Disabled',
      icon: 'label',
      cssIcon: ['text-am-gray-light'],
      value: STATUS.DISABLED,
    },
  ],
};

const filterButtons: SplitButton[] = [
  {
    type: 'button',
    icon: 'refresh',
    label: 'Actualizar listado',
    value: SPLIT_BUTTON_ACTIONS.ACTUALIZAR_DATOS,
  },
  {
    type: 'action',
    id: 'Pendiente',
    icon: 'restart_alt',
    label: 'Refrescar filtros',
    value: SPLIT_BUTTON_ACTIONS.REFRESCAR_FILTROS,
    classes: {
      icon: 'text-am-main-blue-dark text-md',
    },
  },
];

const initFilters = {
  numFilter: 0,
  textFilter: '',
  stateFilter: STATUS.ENABLED + '-' + STATUS.DISABLED,
  startDate: '',
  endDate: '',
  refresh: false,
};

const filters = {
  numFilter: 0,
  textFilter: '',
  stateFilter: STATUS.ENABLED + '-' + STATUS.DISABLED,
  startDate: '',
  endDate: '',
  refresh: false,
};

export const componentUserSetting = {
  tableColumns,
  actionButtonUser,
  searchOptions,
  menuItems,
  filterButtons,
  initFilters,
  filters,
  initialSort: 'Id',
  initalSortDir: 'desc',
  getInputs: '',
  filename: 'lista-de-usuarios',
};
