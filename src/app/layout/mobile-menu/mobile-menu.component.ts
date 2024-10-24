import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from '@services/users.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-mobile-menu',
  standalone: true,
  imports: [CommonModule, ButtonModule, ToastModule, ConfirmDialogModule],
  providers: [MessageService, ConfirmationService],
  templateUrl: './mobile-menu.component.html',
})
export class MobileMenuComponent {
  public confirmationService = inject(ConfirmationService);
  public messageService = inject(MessageService);
  public userService = inject(UsersService);

  public router = inject(Router);
  public items = this.userService.access();

  public async redirectTo(path: string) {
    this.router.navigateByUrl(path);
  }
}
