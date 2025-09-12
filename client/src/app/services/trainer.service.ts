import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Trainer, CreateTrainerRequest, TrainerReview } from '../models/trainer.model';
import { ApiResponse, PaginationParams } from '../models/common.model';

@Injectable({
  providedIn: 'root'
})
export class TrainerService {
  private baseUrl = `${environment.apiUrl}/trainers`;

  constructor(private http: HttpClient) {}

  getTrainers(params?: PaginationParams): Observable<ApiResponse<Trainer[]>> {
    let httpParams = new HttpParams();
    
    if (params) {
      Object.keys(params).forEach(key => {
        const value = (params as any)[key];
        if (value !== null && value !== undefined) {
          httpParams = httpParams.set(key, value.toString());
        }
      });
    }

    return this.http.get<ApiResponse<Trainer[]>>(this.baseUrl, { params: httpParams });
  }

  getTrainer(id: string): Observable<Trainer> {
    return this.http.get<ApiResponse<Trainer>>(`${this.baseUrl}/${id}`)
      .pipe(map(response => response.data!));
  }

  createTrainerProfile(trainerData: CreateTrainerRequest): Observable<Trainer> {
    return this.http.post<ApiResponse<Trainer>>(this.baseUrl, trainerData)
      .pipe(map(response => response.data!));
  }

  updateTrainerProfile(id: string, trainerData: Partial<CreateTrainerRequest>): Observable<Trainer> {
    return this.http.put<ApiResponse<Trainer>>(`${this.baseUrl}/${id}`, trainerData)
      .pipe(map(response => response.data!));
  }

  deleteTrainerProfile(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  searchTrainers(query: string, filters?: any): Observable<Trainer[]> {
    let params = new HttpParams().set('search', query);
    
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params = params.set(key, filters[key]);
        }
      });
    }

    return this.http.get<ApiResponse<Trainer[]>>(`${this.baseUrl}/search`, { params })
      .pipe(map(response => response.data!));
  }

  getTrainersBySpecialization(specialization: string): Observable<Trainer[]> {
    return this.http.get<ApiResponse<Trainer[]>>(`${this.baseUrl}/specialization/${specialization}`)
      .pipe(map(response => response.data!));
  }

  getTopRatedTrainers(limit: number = 10): Observable<Trainer[]> {
    const params = new HttpParams().set('limit', limit.toString()).set('sort', 'rating');
    return this.http.get<ApiResponse<Trainer[]>>(`${this.baseUrl}/top-rated`, { params })
      .pipe(map(response => response.data!));
  }

  // Review methods
  getTrainerReviews(trainerId: string): Observable<TrainerReview[]> {
    return this.http.get<ApiResponse<TrainerReview[]>>(`${this.baseUrl}/${trainerId}/reviews`)
      .pipe(map(response => response.data!));
  }

  addTrainerReview(trainerId: string, review: { rating: number; comment: string }): Observable<TrainerReview> {
    return this.http.post<ApiResponse<TrainerReview>>(`${this.baseUrl}/${trainerId}/reviews`, review)
      .pipe(map(response => response.data!));
  }

  updateTrainerReview(trainerId: string, reviewId: string, review: { rating: number; comment: string }): Observable<TrainerReview> {
    return this.http.put<ApiResponse<TrainerReview>>(`${this.baseUrl}/${trainerId}/reviews/${reviewId}`, review)
      .pipe(map(response => response.data!));
  }

  deleteTrainerReview(trainerId: string, reviewId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${trainerId}/reviews/${reviewId}`);
  }
}
