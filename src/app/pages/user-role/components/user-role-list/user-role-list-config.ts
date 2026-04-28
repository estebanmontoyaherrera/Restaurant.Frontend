import { MenuFilterTable } from '@app/shared/models/reusables/filter-menu-states.interface';
import { GenericButton } from '@app/shared/models/reusables/generic-button.interface';
import { TableColumns } from '@app/shared/models/reusables/list-table.interface';
import { SplitButton } from '@app/shared/models/reusables/split-button.interface';
import { GenericValidators } from '@app/shared/utils/generic-validators.util';
import {
    SPLIT_BUTTON_ACTIONS,
    STATUS,
    UserRoleFilters,
} from '@app/shared/utils/global-constants.util';
import { UserRoleResponse } from '../../models/user-role-response.interface';

const tableColumns: TableColumns<UserRoleResponse>[] = [
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
    label: 'Usuario',
    cssLabel: ['font-bold', 'text-sm', 'text-am-main-blue-dark'],
    property: 'user',
    cssProperty: ['text-xs', 'font-bold', 'whitespace-normal', 'max-w-120'],
    type: 'text',
    sticky: false,
    sort: true,
    sortProperty: 'user',
    visible: true,
    download: true,
  },
  {
    label: 'Rol',
    cssLabel: ['font-bold', 'text-sm', 'text-am-main-blue-dark'],
    property: 'role',
    cssProperty: ['text-xs', 'font-bold', 'whitespace-normal', 'max-w-120'],
    type: 'text',
    sticky: false,
    sort: true,
    sortProperty: 'role',
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

const actionButtonUserRole: GenericButton = {
  label: 'Crear rol de usuario',
  icon: 'add',
  tooltip: 'Crear nuevo rol de usuario',
};

const searchOptions = [
  {
    label: 'Usuario',
    value: UserRoleFilters.ByUser,
    placeholder: 'Buscar por usuario',
    validation: [GenericValidators.defaultDescription],
    validation_desc: 'Permite búsqueda por las primeras tres letras.',
    icon: 'tune',
  },
  {
    label: 'Rol',
    value: UserRoleFilters.ByRole,
    placeholder: 'Buscar por rol',
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

export const componentUserRoleSetting = {
  tableColumns,
  actionButtonUserRole,
  searchOptions,
  menuItems,
  filterButtons,
  initFilters,
  filters,
  initialSort: 'Id',
  initalSortDir: 'desc',
  getInputs: '',
  filename: 'lista-de-roles-de-usuarios',
};
