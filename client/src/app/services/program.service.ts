import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Program, ExercisePlan, CreateProgramRequest } from '../models/program.model';
import { ApiResponse, PaginationParams } from '../models/common.model';

@Injectable({
  providedIn: 'root'
})
export class ProgramService {
  private baseUrl = `${environment.apiUrl}/programs`;
  private exerciseUrl = `${environment.apiUrl}/exercise-plans`;

  constructor(private http: HttpClient) {}

  // Program methods
  getPrograms(params?: PaginationParams): Observable<ApiResponse<Program[]>> {
    let httpParams = new HttpParams();
    
    if (params) {
      Object.keys(params).forEach(key => {
        const value = (params as any)[key];
        if (value !== null && value !== undefined) {
          httpParams = httpParams.set(key, value.toString());
        }
      });
    }

    return this.http.get<ApiResponse<Program[]>>(this.baseUrl, { params: httpParams });
  }

  getProgram(id: string): Observable<Program> {
    return this.http.get<ApiResponse<Program>>(`${this.baseUrl}/${id}`)
      .pipe(map(response => response.data!));
  }

  createProgram(program: CreateProgramRequest): Observable<Program> {
    return this.http.post<ApiResponse<Program>>(this.baseUrl, program)
      .pipe(map(response => response.data!));
  }

  updateProgram(id: string, program: Partial<CreateProgramRequest>): Observable<Program> {
    return this.http.put<ApiResponse<Program>>(`${this.baseUrl}/${id}`, program)
      .pipe(map(response => response.data!));
  }

  deleteProgram(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  getProgramsByTrainer(trainerId: string): Observable<Program[]> {
    return this.http.get<ApiResponse<Program[]>>(`${this.baseUrl}/trainer/${trainerId}`)
      .pipe(map(response => response.data!));
  }

  searchPrograms(query: string, filters?: any): Observable<Program[]> {
    let params = new HttpParams().set('search', query);
    
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params = params.set(key, filters[key]);
        }
      });
    }

    return this.http.get<ApiResponse<Program[]>>(`${this.baseUrl}/search`, { params })
      .pipe(map(response => response.data!));
  }

  getMyPrograms(): Observable<any> {
    return this.http.get(`${this.baseUrl}/my-programs`);
  }

  enrollInProgram(id: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/${id}/enroll`, {});
  }

  unenrollFromProgram(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}/enroll`);
  }

  // Exercise Plan methods
  getExercisePlans(params?: PaginationParams): Observable<ApiResponse<ExercisePlan[]>> {
    let httpParams = new HttpParams();
    
    if (params) {
      Object.keys(params).forEach(key => {
        const value = (params as any)[key];
        if (value !== null && value !== undefined) {
          httpParams = httpParams.set(key, value.toString());
        }
      });
    }

    return this.http.get<ApiResponse<ExercisePlan[]>>(this.exerciseUrl, { params: httpParams });
  }

  getExercisePlan(id: string): Observable<ExercisePlan> {
    return this.http.get<ApiResponse<ExercisePlan>>(`${this.exerciseUrl}/${id}`)
      .pipe(map(response => response.data!));
  }

  createExercisePlan(exercisePlan: any): Observable<ExercisePlan> {
    return this.http.post<ApiResponse<ExercisePlan>>(this.exerciseUrl, exercisePlan)
      .pipe(map(response => response.data!));
  }

  updateExercisePlan(id: string, exercisePlan: any): Observable<ExercisePlan> {
    return this.http.put<ApiResponse<ExercisePlan>>(`${this.exerciseUrl}/${id}`, exercisePlan)
      .pipe(map(response => response.data!));
  }

  deleteExercisePlan(id: string): Observable<any> {
    return this.http.delete(`${this.exerciseUrl}/${id}`);
  }

  getExercisePlansByTrainer(trainerId: string): Observable<ExercisePlan[]> {
    return this.http.get<ApiResponse<ExercisePlan[]>>(`${this.exerciseUrl}/trainer/${trainerId}`)
      .pipe(map(response => response.data!));
  }
}
