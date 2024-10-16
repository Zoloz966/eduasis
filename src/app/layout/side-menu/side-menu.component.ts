import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LayoutService } from '@services/layout.service';
import { UsersService } from '@services/users.service';

import { ConfirmationService, MenuItem } from 'primeng/api';

import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MenuModule } from 'primeng/menu';

@Component({
  selector: 'app-side-menu',
  standalone: true,
  imports: [CommonModule, ButtonModule, MenuModule, ConfirmDialogModule],
  providers: [ConfirmationService],
  templateUrl: './side-menu.component.html',
  styles: `
    .dot-card {
      width: 2px;
      height: 2px;
    }
  `,
})
export class SideMenuComponent {
  public confirmationService = inject(ConfirmationService);
  public layoutService = inject(LayoutService);
  private usersService = inject(UsersService);
  public router = inject(Router);

  public items = this.usersService.access();

  constructor() {
    console.log(this.items);
  }
}
