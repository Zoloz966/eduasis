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
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import TeacherComponent from '@shared/teacher/teacher.component';

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
  providers: [
    MessageService,
    ConfirmationService,
    DialogService,
    DynamicDialogConfig,
  ],
  templateUrl: './teachers-list.component.html',
})
export default class TeachersListComponent implements OnInit {
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  public layoutService = inject(LayoutService);
  public teachersService = inject(TeachersService);
  public configRef = inject(DynamicDialogConfig);
  public dialogService = inject(DialogService);


  public ref: DynamicDialogRef | undefined;

  public teachers = this.teachersService.teachers;
  public loading = this.teachersService.loading;

  public selectedTeachers: Teacher[] = [];

  public skeletonTab = [1, 2, 3, 4, 5, 7];

  ngOnInit(): void {
    this.teachersService.getAllTeachers();
    if (this.ref) {
      this.ref.close();
    }
  }

  public showTeacher(teacher: Teacher) {
    this.ref = this.dialogService.open(TeacherComponent, {
      header: 'Maestro: ' + teacher.name,
      draggable: true,
      styleClass: 'w-11 md:w-7',
      maximizable: true,
      data: {
        teacher: teacher,
      },
    });

    this.ref.onClose.subscribe((teacher: Teacher) => {
      if (teacher) {
        console.log(teacher);

        this.messageService.add({
          severity: 'success',
          summary: 'Exito!',
          detail: `Teachere ${teacher.name} actualizado exitosamente`,
        });
      }
    });
  }

  public createTeacher() {
    this.ref = this.dialogService.open(TeacherComponent, {
      header: 'Nuevo maestro',
      draggable: true,
      styleClass: 'w-11 md:w-7',
      maximizable: true,
    });

    this.ref.onClose.subscribe((teacher: Teacher) => {
      if (teacher) {
        this.messageService.add({
          severity: 'success',
          summary: 'Exito!',
          detail: `Teachere ${teacher.name} creado exitosamente`,
        });
      }
    });
  }

  public deleteTeacher(teacher: Teacher) {
    this.confirmationService.confirm({
      message: 'Esta seguro de eliminar al maestro ' + teacher.name,
      acceptLabel: 'Si',
      acceptButtonStyleClass: 'p-button-rounded p-button-success w-7rem',
      rejectLabel: 'No',
      rejectButtonStyleClass: 'p-button-rounded p-button-warning w-7rem',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.teachersService.deleteTeacher(teacher.id_teacher).subscribe((_) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Eliminación exitosa',
            detail: `Teachere ${teacher.name} eliminado exitosamente`,
          });
        });
      },
    });
  }
}
