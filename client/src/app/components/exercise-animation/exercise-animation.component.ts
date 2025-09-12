import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-exercise-animation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './exercise-animation.component.html',
  styleUrl: './exercise-animation.component.scss'
})
export class ExerciseAnimationComponent implements OnInit, OnDestroy {
  @Input() exerciseName: string = '';
  @Input() exerciseType: string = '';
  @Input() category: string = '';
  @Input() difficulty: string = '';

  animationClass = '';
  armClass = '';
  legClass = '';
  equipmentClass = '';
  containerClass = '';
  showEquipment = false;
  isAnimating = true;

  private animationInterval: any;

  ngOnInit() {
    this.setupAnimation();
    this.startAnimation();
  }

  ngOnDestroy() {
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
    }
  }

  private setupAnimation() {
    const category = this.category.toLowerCase();
    const exerciseName = this.exerciseName.toLowerCase();

    // Determine animation type based on exercise
    if (exerciseName.includes('pushup') || exerciseName.includes('plank')) {
      this.animationClass = 'pushup-animation';
      this.containerClass = 'bg-gradient-to-b from-blue-50 to-blue-100';
    } else if (exerciseName.includes('squat') || exerciseName.includes('lunge')) {
      this.animationClass = 'squat-animation';
      this.containerClass = 'bg-gradient-to-b from-green-50 to-green-100';
    } else if (category === 'cardio' || exerciseName.includes('running') || exerciseName.includes('jumping')) {
      this.animationClass = 'cardio-animation';
      this.legClass = 'cardio-legs';
      this.containerClass = 'bg-gradient-to-b from-orange-50 to-orange-100';
    } else if (category === 'strength' || exerciseName.includes('weight') || exerciseName.includes('dumbbell')) {
      this.armClass = 'strength-arms';
      this.equipmentClass = 'equipment-animation';
      this.showEquipment = true;
      this.containerClass = 'bg-gradient-to-b from-red-50 to-red-100';
    } else {
      this.animationClass = 'pushup-animation';
      this.containerClass = 'bg-gradient-to-b from-gray-50 to-gray-100';
    }
  }

  private startAnimation() {
    // Add variation to animation timing for more realistic movement
    this.animationInterval = setInterval(() => {
      this.isAnimating = !this.isAnimating;
      setTimeout(() => {
        this.isAnimating = true;
      }, 500);
    }, 3000);
  }
}
