import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { environment } from '@environment/environment';
import { Subject } from '@interfaces/subject';
import { Observable, tap } from 'rxjs';

interface SubjectService {
  subjects: Subject[];
  loading: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class SubjectsService {
  private http = inject(HttpClient);
  #subject = signal<SubjectService>({
    subjects: [],
    loading: true,
  });

  public subjects = computed(() => this.#subject().subjects);
  public loading = computed(() => this.#subject().loading);

  constructor() {
    this.loadStorage();
  }

  private saveStorage(subjects: Subject[]) {
    if (subjects.length > 0) {
      localStorage.setItem(
        'subjects',
        JSON.stringify(this.#subject().subjects)
      );
    } else {
      localStorage.removeItem('subjects');
    }
  }

  private loadStorage() {
    if (localStorage.getItem('subjects')) {
      this.#subject.set({
        loading: false,
        subjects: JSON.parse(localStorage.getItem('subjects')!),
      });
    } else {
      this.getAllSubjects();
    }
  }

  public postSubject(subject: Partial<Subject>): Observable<Subject> {
    return this.http
      .post<Subject>(`${environment.url_api}/subjects/`, subject)
      .pipe(
        tap((resSubject) => {
          const oldSubject = this.#subject().subjects;
          oldSubject.push(resSubject);
          this.#subject.set({
            loading: false,
            subjects: oldSubject,
          });
          this.saveStorage(this.#subject().subjects);
        })
      );
  }

  public getAllSubjects(): void {
    this.#subject.set({
      loading: true,
      subjects: this.#subject().subjects,
    });
    this.http.get<Subject[]>(`${environment.url_api}/subjects/`).subscribe(
      (res) => {
        this.#subject.set({
          loading: false,
          subjects: res,
        });
      },
      (error) => {
        this.#subject.set({
          loading: false,
          subjects: [],
        });
      }
    );
  }

  public updateSubject(id: number, subject: Partial<Subject>) {
    return this.http
      .patch<Subject>(`${environment.url_api}/subjects/${id}`, subject)
      .pipe(
        tap((resSubject) => {
          const oldSubject = this.#subject().subjects;
          const index = oldSubject.findIndex(
            (i) => i.id_subject === resSubject.id_subject
          );
          oldSubject[index] = resSubject;
          this.#subject.set({
            loading: false,
            subjects: oldSubject,
          });
          this.saveStorage(this.#subject().subjects);
        })
      );
  }

  public deleteSubject(id: number) {
    this.#subject.set({
      loading: false,
      subjects: this.subjects().filter((i) => i.id_subject !== id),
    });
    this.saveStorage(this.#subject().subjects);
    return this.http.delete(`${environment.url_api}/subjects/${id}`);
  }

  public updateSubjects(subjects: Subject[]) {
    this.#subject.set({
      loading: false,
      subjects,
    });
  }
}
