import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { UsersService } from '@services/users.service';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-card-empty-list',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './card-empty-list.component.html',
  styles: `
  .drop-shadow {
    filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.106));
  }
  `,
})
export class CardEmptyListComponent {
  @Input()
  public nameEmptyList: string = '';

  public usersService = inject(UsersService);

  public nameUser = this.usersService.user()!.name;

  constructor(){
  }
}
