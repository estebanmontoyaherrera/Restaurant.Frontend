import { NgClass } from '@angular/common';
import {
  Component,
  EventEmitter,
  HostListener,
  Output,
  inject,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MenuResponse } from '@app/shared/models/layout/menu.interface';
import { MenuService } from '@app/shared/services/menu.service';
import { fadeInOutAnimation } from '@shared/animations/fade-in-out.animation';
import { INavbarData } from '@shared/models/layout/navbar-data.interface';
import { ISidebarToggle } from '@shared/models/layout/sidebar-toggle.interface';
import { SublevelMenuComponent } from '../sublevel-menu/sublevel-menu.component';

@Component({
  standalone: true,
  selector: 'app-sidebar',
  imports: [
    NgClass,
    RouterLink,
    RouterLinkActive,
    SublevelMenuComponent,
    MatIconModule,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  animations: [fadeInOutAnimation],
})
export class SidebarComponent {
  private readonly router = inject(Router);
  private readonly menuService = inject(MenuService);

  menu: MenuResponse[] = [];
  menuArray: any[] = [];

  ngOnInit(): void {
    this.screenWidth = window.innerWidth;
    this.toggleCollapsed();
    this.getMenuByRole();
    this.navData = this.menuArray;
  }

  @Output() onToggleSideNav: EventEmitter<ISidebarToggle> = new EventEmitter();
  collapsed: boolean = false;
  screenWidth = 0;
  navData = this.menuArray;
  multiple: boolean = false;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth <= 768) {
      this.collapsed = false;
      this.onToggleSideNav.emit({
        collapsed: this.collapsed,
        screenWidth: this.screenWidth,
      });
    }
  }

  toggleCollapsed(): void {
    this.collapsed = !this.collapsed;
    this.onToggleSideNav.emit({
      collapsed: this.collapsed,
      screenWidth: this.screenWidth,
    });
  }

  handleClick(item: INavbarData): void {
    this.shrinkItems(item);
    item.expanded = !item.expanded;
  }

  getActiveClass(data: INavbarData): string {
    return this.router.url.includes(data.route) ? 'active' : '';
  }

  shrinkItems(item: INavbarData): void {
    if (!this.multiple) {
      for (let subItem of this.navData) {
        if (item !== subItem && subItem.expanded) {
          subItem.expanded = false;
        }
      }
    }
  }

  getMenuByRole(): void {
    this.menuService.getMenuByRole().subscribe((resp) => {
      this.menu = resp.data;
      if (this.menu != null) {
        this.menu.map((m: MenuResponse) => {
          if (m.fatherId == 0 && m.path == null) {
            const obj = {
              menuId: m.menuId,
              route: m.path,
              label: m.item,
              icon: m.icon,
              items: [],
            };

            this.menuArray.push(obj);
          } else if (m.fatherId == 0 && m.path != null) {
            const obj = {
              menuId: m.menuId,
              route: m.path,
              label: m.item,
              icon: m.icon,
              items: [],
            };

            this.menuArray.push(obj);
          }
        });

        this.menu.map((m: MenuResponse) => {
          if (m.fatherId != 0) {
            const index = this.menuArray.findIndex(
              (p) => p.menuId === m.fatherId
            );

            if (index !== -1) {
              const obj: INavbarData = {
                menuId: m.menuId,
                route: m.path,
                label: m.item,
                icon: m.icon,
                items: [],
              };

              this.menuArray[index].items!.push(obj);
            } else {
              console.warn(`No se encontró un padre con MenuId: ${m.fatherId}`);
            }
          }
        });
      }
    });
  }
}
