import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

interface MembershipPlan {
  id: number;
  name: string;
  price: number;
  duration: string;
  description: string;
  features: string[];
  popular?: boolean;
  color: string;
  icon: string;
}

interface FAQ {
  question: string;
  answer: string;
  open?: boolean;
}

@Component({
  selector: 'app-memberships',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './memberships.component.html',
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('slideInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(50px)' }),
        animate('600ms {{ delay }} ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('staggerIn', [
      transition(':enter', [
        query(':scope > *', [
          style({ opacity: 0, transform: 'translateY(30px)' }),
          stagger(200, [
            animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ]),
    trigger('slideDown', [
      transition(':enter', [
        style({ height: '0', opacity: 0 }),
        animate('300ms ease-out', style({ height: '*', opacity: 1 }))
      ])
    ])
  ]
})
export class MembershipsComponent implements OnInit {
  membershipPlans: MembershipPlan[] = [
    {
      id: 1,
      name: 'Basic',
      price: 29,
      duration: 'month',
      description: 'Perfect for getting started with your fitness journey',
      color: 'bg-gray-500',
      icon: 'fas fa-dumbbell',
      features: [
        'Access to gym equipment',
        'Locker room access',
        'Mobile app access',
        'Basic workout tracking',
        '24/7 gym access'
      ]
    },
    {
      id: 2,
      name: 'Premium',
      price: 59,
      duration: 'month',
      description: 'Most popular choice with comprehensive features',
      color: 'bg-red-500',
      icon: 'fas fa-crown',
      popular: true,
      features: [
        'Everything in Basic',
        'Group fitness classes',
        'Personal trainer consultation',
        'Nutrition guidance',
        'Advanced workout tracking',
        'Guest passes (2 per month)',
        'Pool and sauna access'
      ]
    },
    {
      id: 3,
      name: 'Elite',
      price: 99,
      duration: 'month',
      description: 'Ultimate fitness experience with premium perks',
      color: 'bg-purple-500',
      icon: 'fas fa-gem',
      features: [
        'Everything in Premium',
        'Unlimited personal training',
        'Custom meal plans',
        'Priority class booking',
        'Unlimited guest passes',
        'Massage therapy sessions',
        'VIP locker room access',
        'Exclusive member events'
      ]
    }
  ];

  comparisonFeatures = [
    { feature: 'Gym Equipment Access', included: [true, true, true] },
    { feature: 'Locker Room', included: [true, true, true] },
    { feature: 'Mobile App', included: [true, true, true] },
    { feature: 'Group Classes', included: [false, true, true] },
    { feature: 'Personal Training', included: [false, '1 session', 'Unlimited'] },
    { feature: 'Nutrition Guidance', included: [false, true, true] },
    { feature: 'Guest Passes', included: [false, '2/month', 'Unlimited'] },
    { feature: 'Pool & Sauna', included: [false, true, true] },
    { feature: 'Massage Therapy', included: [false, false, true] },
    { feature: 'VIP Amenities', included: [false, false, true] }
  ];

  testimonials = [
    {
      name: 'Sarah Johnson',
      plan: 'Premium',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      review: 'GymVerse has completely transformed my fitness routine. The trainers are amazing and the facilities are top-notch!'
    },
    {
      name: 'Mike Chen',
      plan: 'Elite',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      review: 'The Elite membership is worth every penny. Having unlimited personal training has helped me achieve goals I never thought possible.'
    },
    {
      name: 'Emily Rodriguez',
      plan: 'Basic',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      review: 'Even the Basic plan gives you everything you need to get started. Great value for money and excellent facilities.'
    }
  ];

  faqs: FAQ[] = [
    {
      question: 'Can I cancel my membership anytime?',
      answer: 'Yes, you can cancel your membership at any time with 30 days notice. We also offer a 30-day money-back guarantee for new members.',
      open: false
    },
    {
      question: 'Are there any hidden fees or contracts?',
      answer: 'No hidden fees! Our pricing is transparent and includes everything listed in your plan. No long-term contracts required.',
      open: false
    },
    {
      question: 'Can I freeze my membership?',
      answer: 'Yes, you can freeze your membership for up to 3 months per year for medical reasons or extended travel.',
      open: false
    },
    {
      question: 'Do you offer family discounts?',
      answer: 'Yes! We offer 15% discount for families with 2+ members and 20% discount for families with 4+ members.',
      open: false
    },
    {
      question: 'What if I want to upgrade or downgrade my plan?',
      answer: 'You can change your membership plan at any time. Upgrades take effect immediately, downgrades take effect at your next billing cycle.',
      open: false
    },
    {
      question: 'Is there a free trial available?',
      answer: 'Yes! We offer a 7-day free trial for all new members to experience our facilities and services.',
      open: false
    }
  ];

  ngOnInit() {
    // Component initialization
  }

  getPlanCardClass(plan: MembershipPlan): string {
    const baseClasses = 'relative bg-white rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105';
    if (plan.popular) {
      return `${baseClasses} border-4 border-yellow-400 transform scale-105`;
    }
    return `${baseClasses} border border-gray-200`;
  }

  getButtonClass(plan: MembershipPlan): string {
    if (plan.popular) {
      return 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 shadow-lg';
    }
    return 'bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-300';
  }

  selectPlan(plan: MembershipPlan) {
    // Simulate plan selection
    alert(`You've selected the ${plan.name} plan for $${plan.price}/${plan.duration}. Redirecting to checkout...`);
    // In a real app, this would navigate to a checkout page
    // this.router.navigate(['/checkout'], { queryParams: { plan: plan.id } });
  }

  startFreeTrial() {
    // Simulate free trial signup
    alert('Starting your 7-day free trial! Please complete the registration process.');
    // In a real app, this would navigate to registration
    // this.router.navigate(['/auth/register'], { queryParams: { trial: true } });
  }

  toggleFAQ(index: number) {
    this.faqs[index].open = !this.faqs[index].open;
  }
}
