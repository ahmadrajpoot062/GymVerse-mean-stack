import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AudioService } from '../../services/audio.service';
import { NewsletterComponent } from '../../components/newsletter/newsletter.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, NewsletterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy {
  isPlaying = false;

  constructor(private audioService: AudioService) {}

  ngOnInit() {
    // Initialize audio service but don't auto-play (browser restrictions)
    this.isPlaying = this.audioService.getIsPlaying();
  }

  ngOnDestroy() {
    // Clean up audio if component is destroyed
    this.audioService.pause();
  }

  toggleMusic() {
    this.isPlaying = this.audioService.togglePlayback();
    
    if (this.isPlaying) {
      console.log('🎵 Background music started');
    } else {
      console.log('🔇 Background music paused');
    }
  }
}