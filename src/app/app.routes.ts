import { Routes } from '@angular/router';
import { LayoutComponent } from './pages/layout/layout.component';
import { authGuard } from './shared/guards/auth.guard';
import { RoleManagementComponent } from './pages/role/components/role-management/role-management.component';

const childrenRoutes: Routes = [
  {
    path: 'users',
    loadComponent: () =>
      import('./pages/user/components/user-list/user-list.component').then(
        (c) => c.UserListComponent
      ),
  },
  {
    path: 'roles',
    loadComponent: () =>
      import('./pages/role/components/role-list/role-list.component').then(
        (c) => c.RoleListComponent
      ),
  },
  {
    path: 'roles/crear',
    loadComponent: () =>
      import(
        './pages/role/components/role-management/role-management.component'
      ).then((c) => c.RoleManagementComponent),
  },
  {
    path: 'roles/editar/:roleId',
    loadComponent: () =>
      import(
        './pages/role/components/role-management/role-management.component'
      ).then((c) => c.RoleManagementComponent),
  },
  {
    path: 'role-users',
    loadComponent: () =>
      import(
        './pages/user-role/components/user-role-list/user-role-list.component'
      ).then((c) => c.UserRoleListComponent),
  },
  {
    path: 'dishes',
    loadComponent: () =>
      import('./pages/dish/components/dish-list/dish-list.component').then(
        (c) => c.DishListComponent
      ),
  },
  {
    path: 'orders',
    loadComponent: () =>
      import('./pages/order/components/order-list/order-list.component').then(
        (c) => c.OrderListComponent
      ),
  },
  {
    path: 'reports',
    loadComponent: () =>
      import('./pages/report/components/sales-report/sales-report.component').then(
        (c) => c.SalesReportComponent
      ),
  },
];

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/auth/components/login/login.component').then(
        (c) => c.LoginComponent
      ),
  },
  {
    path: '',
    component: LayoutComponent,
    children: childrenRoutes,
    canActivate: [authGuard],
  },
];
