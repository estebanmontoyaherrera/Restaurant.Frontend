export interface INavbarData {
  menuId?: number;
  route: string;
  icon: string;
  label: string;
  expanded?: boolean;
  items?: INavbarData[];
}

// export const navbarData: INavbarData[] = [
//   {
//     path: 'dashboard',
//     icon: 'dashboard',
//     label: 'Dashboard',
//   },
//   {
//     path: 'catalogo',
//     icon: 'fal fa-users',
//     label: 'Catálogo',
//     items: [
//       {
//         path: 'catalogo/agentes',
//         icon: 'edit',
//         label: 'Agentes',
//         items: [
//           {
//             path: 'providers/level2.1',
//             icon: 'flight_takeoff',
//             label: 'Agente de aduana',
//           },
//           {
//             path: 'agentes/agente-carga',
//             icon: 'local_shipping',
//             label: 'Agente de carga'
//           },
//           {
//             path: 'providers/level2.2',
//             icon: 'diversity_3',
//             label: 'Agente exterior / local'
//           },
//           {
//             path: 'providers/level2.2',
//             icon: 'directions_boat',
//             label: 'Agente marítimo'
//           },
//         ],
//       },
//       {
//         path: 'providers/level1.1',
//         icon: 'edit',
//         label: 'Transportes',
//         items: [
//           {
//             path: 'providers/level2.1',
//             icon: 'flight_takeoff',
//             label: 'Transporte marítimo - aéreo',
//           },
//           {
//             path: 'providers/level2.2',
//             icon: 'local_shipping',
//             label: 'Transporte local terrestre'
//           }
//         ],
//       },
//     ],
//   },
// ];
