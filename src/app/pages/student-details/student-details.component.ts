import { CommonModule } from '@angular/common';
import { Component, inject, type OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StudentsService } from '@services/students.service';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';
import { ChipModule } from 'primeng/chip';
import { TabViewModule } from 'primeng/tabview';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import { TasksService } from '@services/tasks.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Student } from '@interfaces/student';
import { Task } from '@interfaces/task';
import StudentComponent from '@shared/student/student.component';
import { LayoutService } from '@services/layout.service';
import { UsersService } from '@services/users.service';
import { CheckboxModule } from 'primeng/checkbox';
import { Class } from '@interfaces/class';
import { ClassesService } from '@services/classes.service';
import { TableModule } from 'primeng/table';
import { GradesService } from '@services/grades.service';
import { Grade, TypeGrade } from '@interfaces/grade';
import { FileUploadModule } from 'primeng/fileupload';
import { UploadService } from '@services/upload.service';
import { environment } from '@environment/environment';
import { MessagesModule } from 'primeng/messages';

@Component({
  selector: 'app-student-details',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TagModule,
    ChipModule,
    ButtonModule,
    SkeletonModule,
    TabViewModule,
    InputTextareaModule,
    TableModule,
    FileUploadModule,
    SkeletonModule,
    ToastModule,
    ConfirmDialogModule,
    CheckboxModule,
    MessagesModule,
  ],
  providers: [
    ConfirmationService,
    MessageService,
    DialogService,
    DynamicDialogConfig,
  ],
  templateUrl: './student-details.component.html',
})
export default class StudentDetailsComponent implements OnInit {
  private confirmationService = inject(ConfirmationService);
  public layoutService = inject(LayoutService);
  public configRef = inject(DynamicDialogConfig);
  public dialogService = inject(DialogService);
  public messageService = inject(MessageService);
  public studentsService = inject(StudentsService);
  public tasksService = inject(TasksService);
  public classesService = inject(ClassesService);
  public uploadService = inject(UploadService);
  public usersService = inject(UsersService);
  public gradesService = inject(GradesService);
  public router = inject(Router);
  public route = inject(ActivatedRoute);

  public idStudent: string | null = this.route.snapshot.paramMap.get('id');
  public student!: Student;
  public loading: boolean = false;
  public loadingDetails: boolean = false;

  public ref: DynamicDialogRef | undefined;

  public tasks: Task[] = [];
  public classes: Class[] = [];

  public skeletons = [1, 2, 3];

  public grades: Grade[] = [];

  public messages: Message[] = [
    {
      severity: 'info',
      detail: 'El código QR proporcionará acceso sin requerir credenciales.',
      contentStyleClass: 'text-xs',
    },
  ];

  ngOnInit(): void {
    this.loading = true;
    this.loadingDetails = true;
    this.studentsService.getOneStudent(+this.idStudent!).subscribe(
      (res) => {
        this.student = res;
        this.loading = false;
        this.tasksService.getAllTasksByStudent(+this.idStudent!).subscribe(
          (res) => {
            console.log(res);

            this.tasks = res;

            this.classesService
              .getClassesByCourse(+this.student.courseIdCourse)
              .subscribe(
                (res) => {
                  this.classes = res;
                  this.classes.forEach((c) => {
                    c.tasks = [];
                    c.grades = [];
                    this.tasks.forEach((task) => {
                      if (c.id_class === task.classIdClass) {
                        c.tasks?.push(task);
                      }
                    });
                  });
                  this.gradesService
                    .getAllByStudent(+this.idStudent!)
                    .subscribe(
                      (res) => {
                        this.grades = res;
                        this.loadingDetails = false;
                        this.classes.forEach((c) => {
                          this.grades.forEach((g) => {
                            if (c.id_class === g.classIdClass) {
                              c.grades?.push(g);
                            }
                          });
                        });
                        console.log(this.classes);
                      },
                      (error) => {
                        this.loadingDetails = false;
                      }
                    );
                },
                (error) => {
                  this.loadingDetails = false;
                }
              );
          },
          (error) => {
            this.loadingDetails = false;
          }
        );
      },
      (error) => {
        this.loading = false;
        this.loadingDetails = false;
      }
    );
  }

  public onUpload(event: any) {
    console.log(event);

    if (event.files.length > 0) {
      const file = event.files[0];
      const formData = new FormData();
      formData.append('file', file);

      this.uploadService.uploadfile(formData).subscribe((res) => {
        this.student.qr_image =
          environment.url_public + '/uploads/' + res['filename'];
      });
    }
  }

  public saveQR() {
    const studentUpdate: Partial<Student> = {
      qr_image: this.student.qr_image,
    };

    this.studentsService
      .updateStudent(+this.idStudent!, studentUpdate)
      .subscribe((res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'exito!'
        });
      });
  }

  public goBack(): void {
    window.history.back();
  }

  public sendEmail() {
    const mailtoLink = `mailto:${this.student.email}`;
    window.open(mailtoLink, '_self');
  }

  public sendWhatsapp() {
    // Crear un ejemplo de la contraseña sin dar la real
    const examplePassword = 'RAM010112'; // Ejemplo: "ABC" por las primeras tres letras del apellido, y una fecha de nacimiento "01/01/2000"

    // Crear el mensaje con el correo y el ejemplo del formato de la contraseña
    const message = `Estimado tutor(a), por favor ingrese a la plataforma para revisar las notas de su hijo. Aquí están sus credenciales de acceso:

Te invitamos a ingresar a la plataforma para revisar el rendimiento de su hijo. Aquí tienes las credenciales de acceso:

*Correo:* ${this.student.email}
*Contraseña:* Recuerda que se forma con las primeras 3 letras del apellido en mayúsculas, seguido de la fecha de nacimiento en formato DD/MM/AAAA.

Por ejemplo, si el apellido es "Ramirez" y la fecha de nacimiento es "01/01/2012", la contraseña será: ${examplePassword}.
  `;

    const urlWhatsApp = `https://wa.me/${this.student.code_country}${
      this.student.tutor_phone
    }?text=${encodeURIComponent(message)}`;

    window.open(urlWhatsApp, '_blank');
  }

  public showStudent() {
    this.ref = this.dialogService.open(StudentComponent, {
      header: 'Estudiante: ' + this.student.name + ', ID: ' + this.idStudent,
      draggable: true,
      styleClass: 'w-11 md:w-7',
      data: {
        student: this.student,
      },
    });

    this.ref.onClose.subscribe((student: Student) => {
      if (student) {
        this.student = student;
        this.messageService.add({
          severity: 'success',
          summary: 'Exito!',
          detail: `Estudiante ${student.name} actualizado exitosamente`,
        });
      }
    });
  }

  public truncateString(str: string, maxLength: number = 12): string {
    if (str.length > maxLength) {
      return str.slice(0, maxLength) + '...';
    }
    return str;
  }

  public getTaskCompleted(tasks: Task[]): number {
    return tasks.filter((t) => t.isCompleted === 1).length;
  }

  public getRandomNumber() {
    return Math.floor(Math.random() * (95 - 35 + 1)) + 35;
  }

  public getFirstgrade(grades: Grade[]): number {
    const grade = grades.find(
      (g) => g.type_grade === TypeGrade.PRIMER_TRIMESTRE
    );
    return grade ? grade.grade : 0;
  }

  public getSecondgrade(grades: Grade[]): number {
    const grade = grades.find(
      (g) => g.type_grade === TypeGrade.SEGUNDO_TRIMESTRE
    );
    return grade ? grade.grade : 0;
  }

  public getThirdgrade(grades: Grade[]): number {
    const grade = grades.find(
      (g) => g.type_grade === TypeGrade.TERCER_TRIMESTRE
    );
    return grade ? grade.grade : 0;
  }

  public getAverageGrade(grades: Grade[]): number {
    if (grades.length > 0) {
      const total = grades.reduce((sum, grade) => sum + +grade.grade, 0); // Suponiendo que cada objeto "Grade" tiene una propiedad "value" que contiene la calificación
      const average = total / grades.length;
      return average;
    } else {
      return 0;
    }
  }

  public handleCompletedTask(task: Task) {
    const updateTask: Partial<Task> = {
      isCompleted: 1,
    };

    this.tasksService.updateTask(task.id_task, updateTask).subscribe((res) => {
      this.messageService.add({
        severity: 'success',
        summary: 'Exito!',
        detail: `Tarea ${task.task_tittle} completada exitosamente`,
      });
    });
  }
}
