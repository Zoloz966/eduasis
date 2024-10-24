import { CommonModule } from '@angular/common';
import { Component, inject, type OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Message, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ToastModule } from 'primeng/toast';
import { InputSwitchModule } from 'primeng/inputswitch';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { TasksService } from '@services/tasks.service';
import { Task } from '@interfaces/task';
import { ClassesService } from '@services/classes.service';
import { MessagesModule } from 'primeng/messages';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [
    CommonModule,
    DropdownModule,
    InputNumberModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    FileUploadModule,
    InputTextareaModule,
    ToastModule,
    MessagesModule,
    InputSwitchModule,
    CalendarModule,
  ],
  providers: [MessageService],
  templateUrl: './task.component.html',
})
export default class TaskComponent implements OnInit {
  public messageService = inject(MessageService);
  public dialogService = inject(DialogService);
  public config = inject(DynamicDialogConfig);
  public ref = inject(DynamicDialogRef);
  public tasksServices = inject(TasksService);
  public classesService = inject(ClassesService);

  public task: Task = {
    id_task: 0,
    classIdClass: 1,
    description: '',
    end_date: new Date(),
    studentIdStudent: 1,
    isCompleted: 0,
    task_tittle: '',
  };

  public inputsDirt = {
    class: false,
    student: false,
    tittle: false,
  };

  public classes = this.classesService.classes;
  public classesLoading = this.classesService.loading;

  public messages: Message[] = [
    {
      severity: 'info',
      detail:
        'Se creara a tarea para todos los estudiantes registrados al curso',
    },
  ];

  ngOnInit(): void {
    this.classesService.getAllClasses();
    if (this.config.data) {
      this.task = {
        ...this.config.data.task,
        end_date: (() => {
          let date = new Date(this.config.data.task.end_date);
          date.setHours(date.getHours() + 4);
          return date;
        })(),
      };
    }
  }

  public async saveTask() {
    if (!(await this.passTaskForm())) return;

    const newTask: Partial<Task> = {
      classIdClass: this.task.class?.id_class,
      description: this.task.description,
      end_date: this.task.end_date,
      isCompleted: this.task.isCompleted,
      task_tittle: this.task.task_tittle,
    };

    if (this.task.id_task === 0) {
      this.tasksServices.postTask(newTask).subscribe((resTask) => {
        this.ref.close(resTask);
        console.log('Creacion');
      });
    } else {
      this.tasksServices
        .updateTask(this.task.id_task, newTask)
        .subscribe((resTask) => {
          console.log(resTask);
          console.log(newTask);

          this.ref.close(resTask);
          console.log('Update');
        });
    }
  }

  public passTaskForm(): Promise<boolean> {
    let passForm = true;
    if (!this.task.task_tittle || this.task.task_tittle.length < 4) {
      this.inputsDirt.tittle = true;
      passForm = false;
    } else {
      this.inputsDirt.tittle = false;
    }
    if (!this.task.class) {
      this.inputsDirt.class = true;
      passForm = false;
    } else {
      this.inputsDirt.class = false;
    }

    if (!passForm) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error en el Formulario',
        detail: 'Porfavor complete los campos obligatorios',
      });
    }
    return Promise.resolve(passForm);
  }
}
