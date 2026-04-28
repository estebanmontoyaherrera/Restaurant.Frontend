import { Component, HostListener, inject, Input } from '@angular/core';
import {
  languages,
  notifications,
  userItems,
} from '@shared/utils/global-constants.util';
import { NgClass } from '@angular/common';
import { CdkMenuTrigger } from '@angular/cdk/menu';
import { Router } from '@angular/router';
import { AuthService } from '@app/pages/auth/services/auth.service';

@Component({
  selector: 'app-header',
  imports: [NgClass, CdkMenuTrigger],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  @Input() collapsed = false;
  @Input() screenWidth = 0;

  canShowSearchAsOverlay = false;
  selectedLanguage: any;

  languages = languages;
  notifications = notifications;
  userItems = userItems;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkCanShowSearchAsOverlay(window.innerWidth);
  }

  ngOnInit(): void {
    this.checkCanShowSearchAsOverlay(window.innerWidth);
    this.selectedLanguage = this.languages[0];
  }

  getHeadClass(): string {
    let styleClass = '';
    if (this.collapsed && this.screenWidth > 768) {
      styleClass = 'head-trimmed';
    } else {
      styleClass = 'head-md-screen';
    }

    return styleClass;
  }

  checkCanShowSearchAsOverlay(innerWidth: number): void {
    if (innerWidth < 845) {
      this.canShowSearchAsOverlay = true;
    } else {
      this.canShowSearchAsOverlay = false;
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login'], { replaceUrl: true });
  }
}
