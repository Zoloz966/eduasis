import { TasksService } from './../../services/tasks.service';
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
import { Task } from '@interfaces/task';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import TaskComponent from '@shared/task/task.component';

@Component({
  selector: 'app-activity',
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
  templateUrl: './activity.component.html',
})
export default class ActivityComponent implements OnInit {
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  public layoutService = inject(LayoutService);
  public tasksService = inject(TasksService);
  public configRef = inject(DynamicDialogConfig);
  public dialogService = inject(DialogService);


  public ref: DynamicDialogRef | undefined;

  public tasks = this.tasksService.tasks;
  public loading = this.tasksService.loading;

  public selectedTasks: Task[] = [];

  public skeletonTab = [1, 2, 3, 4, 5, 7];

  ngOnInit(): void {
    this.tasksService.getAllTasks();

    if (this.ref) {
      this.ref.close();
    }
  }

  public showTask(task: Task) {
    this.ref = this.dialogService.open(TaskComponent, {
      header: 'Tarea: ' + task.task_tittle,
      draggable: true,
      styleClass: 'w-11 md:w-4',
      maximizable: true,
      data: {
        task: task,
        disabled: true
      },
    });

    this.ref.onClose.subscribe((task: Task) => {
      if (task) {
        console.log(task);

        this.messageService.add({
          severity: 'success',
          summary: 'Exito!',
          detail: `Tarea ${task.task_tittle} actualizado exitosamente`,
        });
      }
    });
  }

  public createTask() {
    this.ref = this.dialogService.open(TaskComponent, {
      header: 'Nueva tarea',
      draggable: true,
      styleClass: 'w-11 md:w-4',
      maximizable: true,
    });

    this.ref.onClose.subscribe((task: Task) => {
      if (task) {
        this.messageService.add({
          severity: 'success',
          summary: 'Exito!',
          detail: `Tarea ${task.task_tittle} creado exitosamente`,
        });
      }
    });
  }

  public deleteTask(task: Task) {
    this.confirmationService.confirm({
      message: 'Esta seguro de eliminar al tarea ' + task.task_tittle,
      acceptLabel: 'Si',
      acceptButtonStyleClass: 'p-button-rounded p-button-success w-7rem',
      rejectLabel: 'No',
      rejectButtonStyleClass: 'p-button-rounded p-button-warning w-7rem',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.tasksService.deleteTask(task.id_task).subscribe((_) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Eliminación exitosa',
            detail: `Tarea ${task.task_tittle} eliminado exitosamente`,
          });
        });
      },
    });
  }
}
