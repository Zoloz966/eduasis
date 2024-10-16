import { TeachersService } from './../../services/teachers.service';
import { CommonModule } from '@angular/common';
import { Component, inject, type OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardEmptyListComponent } from '@shared/card-empty-list/card-empty-list.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { ImageModule } from 'primeng/image';
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';
import { LayoutService } from '@services/layout.service';
import { Teacher } from '@interfaces/teacher';

@Component({
  selector: 'app-teachers-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    OverlayPanelModule,
    CardEmptyListComponent,
    DropdownModule,
    TagModule,
    TableModule,
    SkeletonModule,
    ToastModule,
    ConfirmDialogModule,
    ImageModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './teachers-list.component.html',
})
export default class TeachersListComponent implements OnInit {
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  public layoutService = inject(LayoutService);
  public teachersService = inject(TeachersService);

  public teachers = this.teachersService.teachers;
  public loading = this.teachersService.loading;

  public selectedTeachers: Teacher[] = [];

  public skeletonTab = [1, 2, 3, 4, 5, 7];

  ngOnInit(): void {
    this.teachersService.getAllTeachers();
  }
}
