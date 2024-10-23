import { StudentsService } from './../../services/students.service';
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
import { Student } from '@interfaces/student';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import StudentComponent from '@shared/student/student.component';
import { Router } from '@angular/router';
import { UsersService } from '@services/users.service';
import { CheckboxModule } from 'primeng/checkbox';
import { ClassesService } from '@services/classes.service';
import { Class } from '@interfaces/class';
import { Grade, TypeGrade } from '@interfaces/grade';
import { InputTextModule } from 'primeng/inputtext';
import { GradesService } from '@services/grades.service';

@Component({
  selector: 'app-students-list',
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
    CheckboxModule,
    SkeletonModule,
    ToastModule,
    ConfirmDialogModule,
    InputTextModule,
    ImageModule,
  ],
  providers: [
    MessageService,
    ConfirmationService,
    DialogService,
    DynamicDialogConfig,
  ],
  templateUrl: './students-list.component.html',
})
export default class StudentsListComponent implements OnInit {
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  public layoutService = inject(LayoutService);
  public studentsService = inject(StudentsService);
  public configRef = inject(DynamicDialogConfig);
  public dialogService = inject(DialogService);
  public gradeService = inject(GradesService);

  public classesService = inject(ClassesService);

  public ref: DynamicDialogRef | undefined;

  public students = this.studentsService.students;
  public loading = this.studentsService.loading;

  public selectedStudents: Student[] = [];

  public skeletonTab = [1, 2, 3, 4, 5, 7];

  public router = inject(Router);

  public classes: Class[] = [];
  public loadingClasses: boolean = false;

  public selectClass?: Class;
  public selectStudent?: Student;

  public typeGradeOption: TypeGrade[] = [
    TypeGrade.PRIMER_TRIMESTRE,
    TypeGrade.SEGUNDO_TRIMESTRE,
    TypeGrade.TERCER_TRIMESTRE,
  ];

  public gradeAmount: number = 0;

  public selectTypeGrade?: TypeGrade = TypeGrade.PRIMER_TRIMESTRE;

  ngOnInit(): void {
    this.studentsService.getAllStudents();

    if (this.ref) {
      this.ref.close();
    }
  }

  public handlePanelStudent(student: Student) {
    this.loadingClasses = true;
    this.classesService.getClassesByCourse(student.courseIdCourse).subscribe(
      (res) => {
        this.classes = res;
        this.selectStudent = student;
        this.loadingClasses = false;
      },
      (error) => {
        this.classes = [];
        this.loadingClasses = false;
      }
    );
  }

  public saveGrade() {
    const newGrade: Partial<Grade> = {
      classIdClass: this.selectClass?.id_class,
      grade: this.gradeAmount,
      studentIdStudent: this.selectStudent?.id_student,
      type_grade: this.selectTypeGrade,
    };

    this.gradeService.postGrade(newGrade).subscribe(
      (res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Nota registrada exitosamente',
          detail: 'La nota de la clase se guardo exitosamente',
        });
        this.selectClass = undefined;
        this.selectTypeGrade = undefined;
        this.gradeAmount = 0;
      },
      (error) => {
        this.selectClass = undefined;
        this.selectTypeGrade = undefined;
        this.gradeAmount = 0;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message
        });
      }
    );
  }

  public showStudent(student: Student) {
    this.ref = this.dialogService.open(StudentComponent, {
      header: 'Maestro: ' + student.name,
      draggable: true,
      styleClass: 'w-11 md:w-7',
      maximizable: true,
      data: {
        student: student,
      },
    });

    this.ref.onClose.subscribe((student: Student) => {
      if (student) {
        console.log(student);

        this.messageService.add({
          severity: 'success',
          summary: 'Exito!',
          detail: `Estudiante ${student.name} actualizado exitosamente`,
        });
      }
    });
  }

  public openWhatsApp(number: string) {
    const formattedNumber = number.replace(/\D/g, '');
    const whatsappUrl = `https://wa.me/${formattedNumber}`;

    window.open(whatsappUrl, '_blank');
  }

  public createStudent() {
    this.ref = this.dialogService.open(StudentComponent, {
      header: 'Nuevo estudiante',
      draggable: true,
      styleClass: 'w-11 md:w-7',
      maximizable: true,
    });

    this.ref.onClose.subscribe((student: Student) => {
      if (student) {
        this.messageService.add({
          severity: 'success',
          summary: 'Exito!',
          detail: `Studente ${student.name} creado exitosamente`,
        });
      }
    });
  }

  public deleteStudent(student: Student) {
    this.confirmationService.confirm({
      message: 'Esta seguro de eliminar al estudiante ' + student.name,
      acceptLabel: 'Si',
      acceptButtonStyleClass: 'p-button-rounded p-button-success w-7rem',
      rejectLabel: 'No',
      rejectButtonStyleClass: 'p-button-rounded p-button-warning w-7rem',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.studentsService
          .deleteStudent(student.id_student)
          .subscribe((_) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Eliminación exitosa',
              detail: `Studente ${student.name} eliminado exitosamente`,
            });
          });
      },
    });
  }
}
