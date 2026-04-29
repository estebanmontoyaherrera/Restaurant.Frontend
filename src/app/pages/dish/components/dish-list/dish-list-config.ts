import { MenuFilterTable } from '@app/shared/models/reusables/filter-menu-states.interface';
import { GenericButton } from '@app/shared/models/reusables/generic-button.interface';
import { TableColumns } from '@app/shared/models/reusables/list-table.interface';
import { SplitButton } from '@app/shared/models/reusables/split-button.interface';
import { GenericValidators } from '@app/shared/utils/generic-validators.util';
import {
  SPLIT_BUTTON_ACTIONS,
  STATUS,
} from '@app/shared/utils/global-constants.util';
import { DishResponse } from '../../models/dish-response.interface';

const tableColumns: TableColumns<DishResponse>[] = [
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
    property: 'icToggle',
    cssProperty: [],
    type: 'icon',
    sticky: true,
    sort: false,
    sortProperty: '',
    visible: true,
    action: 'toggle',
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
    property: 'name',
    cssProperty: ['text-xs', 'font-bold', 'whitespace-normal', 'max-w-120'],
    type: 'text',
    sticky: false,
    sort: true,
    sortProperty: 'name',
    visible: true,
    download: true,
  },
  {
    label: 'Descripcion',
    cssLabel: ['font-bold', 'text-sm', 'text-am-main-blue-dark'],
    property: 'description',
    cssProperty: ['text-xs', 'whitespace-normal', 'max-w-120'],
    type: 'text',
    sticky: false,
    sort: false,
    visible: true,
    download: true,
  },
  {
    label: 'Precio',
    cssLabel: ['font-bold', 'text-sm', 'text-am-main-blue-dark'],
    property: 'price',
    cssProperty: ['text-xs', 'font-bold', 'whitespace-normal', 'max-w-120'],
    type: 'number',
    sticky: false,
    sort: true,
    sortProperty: 'price',
    visible: true,
    download: true,
  },
  {
    label: 'Categoria',
    cssLabel: ['font-bold', 'text-sm', 'text-am-main-blue-dark'],
    property: 'category',
    cssProperty: ['text-xs', 'font-bold', 'whitespace-normal', 'max-w-120'],
    type: 'text',
    sticky: false,
    sort: true,
    sortProperty: 'category',
    visible: true,
    download: true,
  },
  {
    label: 'Disponibilidad',
    cssLabel: ['font-bold', 'text-sm', 'text-am-main-blue-dark'],
    property: 'availabilityDescription',
    cssProperty: [],
    type: 'simpleBadge',
    sticky: false,
    sort: false,
    visible: true,
    download: true,
  },
  {
    label: 'Fecha de creacion',
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
 
];

const actionButtonDish: GenericButton = {
  label: 'Crear plato',
  icon: 'add',
  tooltip: 'Crear nuevo plato',
};

const searchOptions = [
  {
    label: 'Nombre',
    value: 1,
    placeholder: 'Buscar por nombre',
    validation: [GenericValidators.defaultDescription],
    validation_desc: 'Permite busqueda por nombre.',
    icon: 'tune',
  },
  {
    label: 'Categoria',
    value: 2,
    placeholder: 'Buscar por categoria',
    validation: [GenericValidators.defaultDescription],
    validation_desc: 'Permite busqueda por categoria.',
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
  name: '',
  category: '',
  stateFilter: STATUS.ENABLED + '-' + STATUS.DISABLED,
  refresh: false,
};

const filters = {
  name: '',
  category: '',
  stateFilter: STATUS.ENABLED + '-' + STATUS.DISABLED,
  refresh: false,
};

export const componentDishSetting = {
  tableColumns,
  actionButtonDish,
  searchOptions,
  menuItems,
  filterButtons,
  initFilters,
  filters,
  initialSort: 'Category',
  initalSortDir: 'asc',
  getInputs: '',
  filename: 'lista-de-platos',
};
