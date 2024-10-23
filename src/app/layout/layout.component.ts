import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { SideMenuComponent } from './side-menu/side-menu.component';
import { Router, RouterModule } from '@angular/router';
import { ProfileMenuComponent } from './profile-menu/profile-menu.component';
import { MobileMenuComponent } from './mobile-menu/mobile-menu.component';
import { LayoutService } from '@services/layout.service';
import { TopBarComponent } from './top-bar/top-bar.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    SideMenuComponent,
    ProfileMenuComponent,
    TopBarComponent,
    MobileMenuComponent,
    RouterModule,
  ],
  templateUrl: './layout.component.html',
})
export default class LayoutComponent {
  public layoutService = inject(LayoutService);
  public router = inject(Router);
}
