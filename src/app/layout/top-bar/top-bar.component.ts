import { CommonModule } from '@angular/common';
import { Component, inject, type OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { Router } from '@angular/router';
import { LayoutService } from '@services/layout.service';
import { UsersService } from '@services/users.service';

@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    DropdownModule,
  ],
  templateUrl: './top-bar.component.html',
})
export class TopBarComponent implements OnInit {
  public layoutService = inject(LayoutService);
  public usersService = inject(UsersService);
  public router = inject(Router);

  ngOnInit(): void {
    console.log(this.router.url);
  }

  public getTitle(): string {
    if (this.router.url.includes('dashboard')) return 'Dashboard';
    if (this.router.url.includes('students')) return 'Estudiantes';
    if (this.router.url.includes('teachers')) return 'Maestros';
    if (this.router.url.includes('virtual')) return 'Asistente Virtual';
    if (this.router.url.includes('roles')) return 'Roles';
    if (this.router.url.includes('subjects')) return 'Lista de Materias';
    if (this.router.url.includes('class')) return 'Lista de Clases';
    return '';
  }
}
