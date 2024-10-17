import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { environment } from '@environment/environment';
import { Class } from '@interfaces/class';
import { Observable, tap } from 'rxjs';

interface State {
  classes: Class[];
  loading: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ClassesService {
  private http = inject(HttpClient);
  #class = signal<State>({
    classes: [],
    loading: true,
  });

  public classes = computed(() => this.#class().classes);
  public loading = computed(() => this.#class().loading);

  constructor() {
    this.loadStorage();
  }

  private saveStorage(classes: Class[]) {
    if (classes.length > 0) {
      localStorage.setItem(
        'classes',
        JSON.stringify(this.#class().classes)
      );
    } else {
      localStorage.removeItem('classes');
    }
  }

  private loadStorage() {
    if (localStorage.getItem('classes')) {
      this.#class.set({
        loading: false,
        classes: JSON.parse(localStorage.getItem('classes')!),
      });
    } else {
      this.getAllClasses();
    }
  }

  public postClass(classes: Partial<Class>): Observable<Class> {
    return this.http
      .post<Class>(`${environment.url_api}/classes/`, classes)
      .pipe(
        tap((resClass) => {
          const oldClass = this.#class().classes;
          oldClass.push(resClass);
          this.#class.set({
            loading: false,
            classes: oldClass,
          });
          this.saveStorage(this.#class().classes);
        })
      );
  }

  public getAllClasses(): void {
    this.#class.set({
      loading: true,
      classes: this.#class().classes,
    });
    this.http.get<Class[]>(`${environment.url_api}/classes/`).subscribe(
      (res) => {
        this.#class.set({
          loading: false,
          classes: res,
        });
      },
      (error) => {
        this.#class.set({
          loading: false,
          classes: [],
        });
      }
    );
  }

  public updateClass(id: number, classes: Partial<Class>) {
    return this.http
      .patch<Class>(`${environment.url_api}/classes/${id}`, classes)
      .pipe(
        tap((resClass) => {
          const oldClass = this.#class().classes;
          const index = oldClass.findIndex(
            (i) => i.id_class === resClass.id_class
          );
          oldClass[index] = resClass;
          this.#class.set({
            loading: false,
            classes: oldClass,
          });
          this.saveStorage(this.#class().classes);
        })
      );
  }

  public deleteClass(id: number) {
    this.#class.set({
      loading: false,
      classes: this.classes().filter((i) => i.id_class !== id),
    });
    this.saveStorage(this.#class().classes);
    return this.http.delete(`${environment.url_api}/classes/${id}`);
  }

  public updateClasses(classes: Class[]) {
    this.#class.set({
      loading: false,
      classes,
    });
  }
}
