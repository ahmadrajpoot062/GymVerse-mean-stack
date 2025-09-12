import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  image: string;
  tags: string[];
  readTime: number;
}

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.scss'
})
export class BlogComponent implements OnInit {
  blogPosts: BlogPost[] = [
    {
      id: 1,
      title: 'The Ultimate Guide to Starting Your Fitness Journey',
      excerpt: 'Learn the essential steps to begin your transformation and build lasting healthy habits.',
      content: 'Starting a fitness journey can feel overwhelming...',
      author: 'Sarah Johnson',
      date: '2024-01-15',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop',
      tags: ['Beginner', 'Fitness', 'Health'],
      readTime: 5
    },
    {
      id: 2,
      title: 'Nutrition Myths Debunked: What Really Works',
      excerpt: 'Separate fact from fiction in the world of nutrition and diet advice.',
      content: 'There are countless nutrition myths circulating...',
      author: 'Dr. Mike Chen',
      date: '2024-01-12',
      image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&h=400&fit=crop',
      tags: ['Nutrition', 'Diet', 'Health'],
      readTime: 7
    },
    {
      id: 3,
      title: 'Building Muscle: A Complete Guide for Beginners',
      excerpt: 'Everything you need to know about gaining muscle mass and strength.',
      content: 'Building muscle requires consistency...',
      author: 'Alex Rodriguez',
      date: '2024-01-10',
      image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&h=400&fit=crop',
      tags: ['Muscle Building', 'Strength', 'Training'],
      readTime: 8
    }
  ];

  featuredPost: BlogPost | null = null;
  categories = ['All', 'Fitness', 'Nutrition', 'Training', 'Health', 'Beginner'];
  selectedCategory = 'All';

  ngOnInit(): void {
    this.featuredPost = this.blogPosts[0];
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category;
  }

  getFilteredPosts(): BlogPost[] {
    if (this.selectedCategory === 'All') {
      return this.blogPosts;
    }
    return this.blogPosts.filter(post => 
      post.tags.some(tag => tag.toLowerCase() === this.selectedCategory.toLowerCase())
    );
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
