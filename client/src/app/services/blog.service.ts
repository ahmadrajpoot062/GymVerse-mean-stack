import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface BlogPost {
  _id?: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  author: any;
  category: string;
  tags: string[];
  featuredImage?: string;
  images?: string[];
  published: boolean;
  publishedAt?: Date;
  views?: number;
  likes?: any[];
  comments?: any[];
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  createdAt?: Date;
  updatedAt?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private apiUrl = `${environment.apiUrl}/blogs`;

  constructor(private http: HttpClient) {}

  getBlogs(params?: any): Observable<any> {
    return this.http.get(this.apiUrl, { params });
  }

  getPosts(params?: any): Observable<any> {
    return this.http.get(this.apiUrl, { params });
  }

  getBlog(slug: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${slug}`);
  }

  createBlog(blog: BlogPost): Observable<any> {
    return this.http.post(this.apiUrl, blog);
  }

  updateBlog(id: string, blog: Partial<BlogPost>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, blog);
  }

  deleteBlog(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  toggleLike(id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/like`, {});
  }

  addComment(id: string, content: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/comments`, { content });
  }

  getCategories(): Observable<any> {
    return this.http.get(`${this.apiUrl}/categories`);
  }

  getTags(): Observable<any> {
    return this.http.get(`${this.apiUrl}/tags`);
  }
}
