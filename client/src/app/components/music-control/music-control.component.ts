import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudioService } from '../../services/audio.service';

@Component({
  selector: 'app-music-control',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './music-control.component.html',
  styleUrl: './music-control.component.scss'
})
export class MusicControlComponent implements OnInit, OnDestroy {
  isPlaying = false;
  private intervalId: any;

  constructor(private audioService: AudioService) {}

  ngOnInit(): void {
    // Check initial state
    this.updateMusicPlayingState();
    
    // Set up interval to check music state every second
    this.intervalId = setInterval(() => {
      this.updateMusicPlayingState();
    }, 1000);
  }

  ngOnDestroy(): void {
    // Clear interval when component is destroyed
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  updateMusicPlayingState(): void {
    this.isPlaying = this.audioService.getIsPlaying();
  }

  toggleMusic(): void {
    const isNowPlaying = this.audioService.togglePlayback();
    
    // Update UI immediately with the returned state
    this.isPlaying = isNowPlaying;
    
    // Also update after a short delay to ensure sync with actual audio state
    setTimeout(() => this.updateMusicPlayingState(), 300);
  }
}
