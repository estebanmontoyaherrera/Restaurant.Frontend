import { MenuFilterTable } from '@app/shared/models/reusables/filter-menu-states.interface';
import { GenericButton } from '@app/shared/models/reusables/generic-button.interface';
import { TableColumns } from '@app/shared/models/reusables/list-table.interface';
import { SplitButton } from '@app/shared/models/reusables/split-button.interface';
import { GenericValidators } from '@app/shared/utils/generic-validators.util';
import {
  SPLIT_BUTTON_ACTIONS,
  STATUS,
} from '@app/shared/utils/global-constants.util';
import { OrderResponse } from '../../models/order-response.interface';

const tableColumns: TableColumns<OrderResponse>[] = [
  {
    label: '',
    cssLabel: [],
    property: 'icItems',
    cssProperty: [],
    type: 'icon',
    sticky: true,
    sort: false,
    visible: true,
    action: 'items',
  },
  {
    label: '',
    cssLabel: [],
    property: 'icAdvance',
    cssProperty: [],
    type: 'icon',
    sticky: true,
    sort: false,
    visible: true,
    action: 'advance',
  },
  {
    label: '',
    cssLabel: [],
    property: 'icEdit',
    cssProperty: [],
    type: 'icon',
    sticky: true,
    sort: false,
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
    visible: true,
    action: 'delete',
  },
  {
    label: 'Mesa',
    cssLabel: ['font-bold', 'text-sm', 'text-am-main-blue-dark'],
    property: 'tableNumber',
    cssProperty: ['text-xs', 'font-bold', 'whitespace-normal', 'max-w-120'],
    type: 'number',
    sticky: false,
    sort: true,
    sortProperty: 'tableNumber',
    visible: true,
    download: true,
  },
  {
    label: 'Camarero',
    cssLabel: ['font-bold', 'text-sm', 'text-am-main-blue-dark'],
    property: 'waiterName',
    cssProperty: ['text-xs', 'font-bold', 'whitespace-normal', 'max-w-120'],
    type: 'text',
    sticky: false,
    sort: true,
    sortProperty: 'waiterName',
    visible: true,
    download: true,
  },
  {
    label: 'Estado pedido',
    cssLabel: ['font-bold', 'text-sm', 'text-am-main-blue-dark'],
    property: 'statusDescription',
    cssProperty: [],
    type: 'simpleBadge',
    sticky: false,
    sort: false,
    visible: true,
    download: true,
  },
  {
    label: 'Total',
    cssLabel: ['font-bold', 'text-sm', 'text-am-main-blue-dark'],
    property: 'total',
    cssProperty: ['text-xs', 'font-bold', 'whitespace-normal', 'max-w-120'],
    type: 'number',
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

const actionButtonOrder: GenericButton = {
  label: 'Crear orden',
  icon: 'add',
  tooltip: 'Crear nueva orden',
};

const searchOptions = [
  {
    label: 'Camarero',
    value: 1,
    placeholder: 'Buscar por camarero',
    validation: [GenericValidators.defaultDescription],
    validation_desc: 'Permite busqueda por nombre del camarero.',
    icon: 'tune',
  },
];

const menuItems: MenuFilterTable = {
  label: 'Estados',
  icon: 'filter_list',
  tooltip: 'Estados',
  menuItems: [
    {
      label: 'Activo',
      icon: 'label',
      cssIcon: ['text-am-main-custom4-dark'],
      value: STATUS.ENABLED,
    },
    {
      label: 'Inactivo',
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
  waiterName: '',
  stateFilter: STATUS.ENABLED + '-' + STATUS.DISABLED,
  startDate: '',
  endDate: '',
  refresh: false,
};

const filters = {
  waiterName: '',
  stateFilter: STATUS.ENABLED + '-' + STATUS.DISABLED,
  startDate: '',
  endDate: '',
  refresh: false,
};

export const componentOrderSetting = {
  tableColumns,
  actionButtonOrder,
  searchOptions,
  menuItems,
  filterButtons,
  initFilters,
  filters,
  initialSort: 'Id',
  initalSortDir: 'desc',
  getInputs: '',
  filename: 'lista-de-ordenes',
};
