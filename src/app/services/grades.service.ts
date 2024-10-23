import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { environment } from '@environment/environment';
import { Grade } from '@interfaces/grade';
import { Observable, tap } from 'rxjs';

interface GradeService {
  grades: Grade[];
  loading: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class GradesService {
  private http = inject(HttpClient);
  #grade = signal<GradeService>({
    grades: [],
    loading: true,
  });

  public grades = computed(() => this.#grade().grades);
  public loading = computed(() => this.#grade().loading);

  constructor() {
    this.loadStorage();
  }

  private saveStorage(grades: Grade[]) {
    if (grades.length > 0) {
      localStorage.setItem('grades', JSON.stringify(this.#grade().grades));
    } else {
      localStorage.removeItem('grades');
    }
  }

  private loadStorage() {
    if (localStorage.getItem('grades')) {
      this.#grade.set({
        loading: false,
        grades: JSON.parse(localStorage.getItem('grades')!),
      });
    } else {
      this.getAllGrades();
    }
  }

  public postGrade(grade: Partial<Grade>): Observable<Grade> {
    return this.http.post<Grade>(`${environment.url_api}/grades/`, grade).pipe(
      tap((resGrade) => {
        const oldGrade = this.#grade().grades;
        oldGrade.push(resGrade);
        this.#grade.set({
          loading: false,
          grades: oldGrade,
        });
        this.saveStorage(this.#grade().grades);
      })
    );
  }

  public getAllGrades(): void {
    this.#grade.set({
      loading: true,
      grades: this.#grade().grades,
    });
    this.http.get<Grade[]>(`${environment.url_api}/grades/`).subscribe(
      (res) => {
        this.#grade.set({
          loading: false,
          grades: res,
        });
      },
      (error) => {
        this.#grade.set({
          loading: false,
          grades: [],
        });
      }
    );
  }

  public getAllByStudent(id: number): Observable<Grade[]> {
    return this.http.get<Grade[]>(
      `${environment.url_api}/grades/byStudent/${id}`
    );
  }

  public updateGrade(id: number, grade: Partial<Grade>) {
    return this.http
      .patch<Grade>(`${environment.url_api}/grades/${id}`, grade)
      .pipe(
        tap((resGrade) => {
          const oldGrade = this.#grade().grades;
          const index = oldGrade.findIndex(
            (i) => i.id_grade === resGrade.id_grade
          );
          oldGrade[index] = resGrade;
          this.#grade.set({
            loading: false,
            grades: oldGrade,
          });
          this.saveStorage(this.#grade().grades);
        })
      );
  }

  public deleteGrade(id: number) {
    this.#grade.set({
      loading: false,
      grades: this.grades().filter((i) => i.id_grade !== id),
    });
    this.saveStorage(this.#grade().grades);
    return this.http.delete(`${environment.url_api}/grades/${id}`);
  }

  public updateGrades(grades: Grade[]) {
    this.#grade.set({
      loading: false,
      grades,
    });
  }
}
