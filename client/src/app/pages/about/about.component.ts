import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('800ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('slideInLeft', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-50px)' }),
        animate('800ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ]),
    trigger('slideInRight', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(50px)' }),
        animate('800ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ]),
    trigger('slideInTimeline', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(50px)' }),
        animate('600ms {{ delay }} ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('staggerIn', [
      transition(':enter', [
        query(':scope > *', [
          style({ opacity: 0, transform: 'translateY(30px)' }),
          stagger(100, [
            animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ]),
    trigger('countUp', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('800ms {{ delay }} ease-out', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class AboutComponent {
  values = [
    {
      icon: 'fas fa-heart',
      title: 'Passion',
      description: 'We are passionate about fitness and helping others achieve their goals through dedication and expertise.'
    },
    {
      icon: 'fas fa-users',
      title: 'Community',
      description: 'Building a supportive community where everyone feels welcome and motivated to pursue their fitness journey.'
    },
    {
      icon: 'fas fa-star',
      title: 'Excellence',
      description: 'Striving for excellence in everything we do, from our platform to our customer service.'
    },
    {
      icon: 'fas fa-lightbulb',
      title: 'Innovation',
      description: 'Continuously innovating to provide cutting-edge solutions for modern fitness challenges.'
    },
    {
      icon: 'fas fa-shield-alt',
      title: 'Integrity',
      description: 'Operating with honesty, transparency, and ethical practices in all our business relationships.'
    },
    {
      icon: 'fas fa-rocket',
      title: 'Growth',
      description: 'Committed to continuous improvement and helping our users achieve sustainable growth.'
    }
  ];

  timeline = [
    {
      year: '2024',
      title: 'GymVerse Launch',
      description: 'Official launch of the GymVerse platform with comprehensive training programs and trainer marketplace.'
    },
    {
      year: '2023',
      title: 'Beta Testing Phase',
      description: 'Extensive beta testing with select trainers and fitness enthusiasts to refine the platform.'
    },
    {
      year: '2022',
      title: 'Platform Development',
      description: 'Started developing the MEAN stack platform with focus on user experience and scalability.'
    },
    {
      year: '2021',
      title: 'Concept & Planning',
      description: 'Initial concept development and market research to identify gaps in the fitness industry.'
    }
  ];

  team = [
    {
      name: 'Sarah Johnson',
      position: 'CEO & Founder',
      bio: 'Former fitness trainer with 10+ years of experience in the industry.',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&crop=face'
    },
    {
      name: 'Mike Chen',
      position: 'CTO',
      bio: 'Full-stack developer passionate about creating innovative fitness solutions.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face'
    },
    {
      name: 'Emily Rodriguez',
      position: 'Head of Fitness',
      bio: 'Certified nutritionist and fitness expert with expertise in program development.',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face'
    },
    {
      name: 'David Thompson',
      position: 'Lead Trainer',
      bio: 'Professional bodybuilder and certified personal trainer with 15+ years experience.',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face'
    },
    {
      name: 'Lisa Wang',
      position: 'Marketing Director',
      bio: 'Digital marketing specialist focused on building fitness communities.',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop&crop=face'
    },
    {
      name: 'Alex Kumar',
      position: 'UX Designer',
      bio: 'User experience designer creating intuitive and engaging fitness applications.',
      image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&h=300&fit=crop&crop=face'
    }
  ];

  stats = [
    { value: '10K+', label: 'Active Users' },
    { value: '500+', label: 'Certified Trainers' },
    { value: '1000+', label: 'Training Programs' },
    { value: '50K+', label: 'Workouts Completed' }
  ];
}
