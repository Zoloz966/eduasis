import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild, type OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject, TypeSubject } from '@interfaces/subject';
import { LayoutService } from '@services/layout.service';
import { SubjectsService } from '@services/subject.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DropdownChangeEvent, DropdownModule } from 'primeng/dropdown';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { SkeletonModule } from 'primeng/skeleton';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { SidebarModule } from 'primeng/sidebar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { CardEmptyListComponent } from '@shared/card-empty-list/card-empty-list.component';

@Component({
  selector: 'app-subjects-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    OverlayPanelModule,
    DropdownModule,
    ButtonModule,
    TableModule,
    SkeletonModule,
    ToastModule,
    InputTextModule,
    CardEmptyListComponent,
    SidebarModule,
    ConfirmDialogModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './subjects-list.component.html',
})
export default class SubjectsListComponent implements OnInit {
  @ViewChild('dt') dt!: Table;
  public layoutService = inject(LayoutService);
  public messageService = inject(MessageService);
  public confirmationService = inject(ConfirmationService);
  private subjectsService = inject(SubjectsService);

  public subjects = this.subjectsService.subjects;
  public filteredSubjects = [...this.subjectsService.subjects()];
  public loading = this.subjectsService.loading;

  public filterOptions = [
    'Comunidad y Sociedad',
    'Ciencia, Tecnología y Producción',
    'Vida, Tierra y Territorio',
    'Cosmos y Pensamiento',
    'Todo',
  ];
  public selectOptions = [
    'Comunidad y Sociedad',
    'Ciencia, Tecnología y Producción',
    'Vida, Tierra y Territorio',
    'Cosmos y Pensamiento',
  ];
  public valueFilter = this.filterOptions.find((option) => option === 'Todo');

  public selectedSubject: Subject = {
    id_subject: 0,
    subject_name: '',
    type_subject: TypeSubject.COMUNIDAD_Y_SOCIEDAD,
  };

  public inputsDirt = {
    name: false,
    type_subject: false,
  };

  public skeletonTab = [1, 2, 3, 4, 5, 6, 7];

  public showSubject: boolean = false;

  ngOnInit(): void {
    this.subjectsService.getAllSubjects();
    console.log(this.subjects());
  }

  public createSubject() {
    this.selectedSubject = {
      id_subject: 0,
      subject_name: '',
      type_subject: TypeSubject.COMUNIDAD_Y_SOCIEDAD,
    };
    this.showSubject = true;
  }

  public editSubject(subject: Subject) {
    this.selectedSubject = subject;
    this.showSubject = true;
  }

  public deleteSubject(subject: Subject) {
    this.confirmationService.confirm({
      message: 'Esta seguro de eliminar el materia ' + subject.subject_name,
      acceptLabel: 'Si',
      acceptButtonStyleClass: 'p-button-rounded p-button-success w-7rem',
      rejectLabel: 'No',
      rejectButtonStyleClass: 'p-button-rounded p-button-danger w-7rem',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.subjectsService
          .deleteSubject(subject.id_subject)
          .subscribe((_) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Eliminación exitosa',
              detail: `Materia ${subject.subject_name} eliminado exitosamente`,
            });
          });
      },
    });
  }

  public async saveSubject() {
    if (!(await this.passSubjectForm())) return;

    const newSubject: Partial<Subject> = {
      subject_name: this.selectedSubject.subject_name,
      type_subject: this.selectedSubject.type_subject,
    };
    if (this.selectedSubject.id_subject === 0) {
      this.subjectsService.postSubject(newSubject).subscribe((resSubject) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Creación exitosa',
          detail: `El materia ${resSubject.subject_name} se creo exitosamente`,
        });
        this.dt.reset();
        this.showSubject = false;
      });
    } else {
      this.subjectsService
        .updateSubject(this.selectedSubject.id_subject, newSubject)
        .subscribe((resSubject) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Creación exitosa',
            detail: `El materia ${resSubject.subject_name} se actualizo exitosamente`,
          });
          this.dt.reset();
          this.showSubject = false;
        });
    }
  }

  public passSubjectForm(): Promise<boolean> {
    if (!this.selectedSubject.subject_name) {
      this.inputsDirt.name = true;
      return Promise.resolve(false);
    }
    if (!this.selectedSubject.type_subject) {
      this.inputsDirt.type_subject = true;
      return Promise.resolve(false);
    }

    return Promise.resolve(true);
  }

  public filterSubjectsByType(event: DropdownChangeEvent) {
    console.log(event);

    if (!event.value || event.value === 'Todo') {
      this.subjectsService.updateSubjects(this.filteredSubjects);
      console.log(this.subjects());
      this.dt.reset();
    } else {
      const filterSubjects = this.filteredSubjects.filter((user) => {
        return user.type_subject === event.value;
      });
      console.log(filterSubjects);

      this.subjectsService.updateSubjects(filterSubjects);
      this.dt.reset();
    }
  }
}
