import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private audio: HTMLAudioElement | null = null;
  private isPlaying = false;
  private isMuted = false;
  
  // Royalty-free gym background music URL
  private musicUrl = 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'; // Placeholder - replace with actual gym music

  constructor() {
    this.initializeAudio();
  }

  private initializeAudio() {
    try {
      this.audio = new Audio();
      this.audio.loop = true;
      this.audio.volume = 0.3; // Start with lower volume
      this.audio.preload = 'auto';
      
      // For production, you would replace this with actual royalty-free gym music
      // This is a placeholder sound file
      this.audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LFeSMFl5nz2ZhWEg1Sp+Xwtmk'; // Simple beep for demo
    } catch (error) {
      console.warn('Audio initialization failed:', error);
    }
  }

  togglePlayback(): boolean {
    if (!this.audio) {
      return false;
    }

    try {
      if (this.isPlaying) {
        this.pause();
      } else {
        this.play();
      }
      return this.isPlaying;
    } catch (error) {
      console.warn('Audio playback toggle failed:', error);
      return false;
    }
  }

  play(): void {
    if (!this.audio) return;
    
    try {
      this.audio.play()
        .then(() => {
          this.isPlaying = true;
        })
        .catch((error) => {
          console.warn('Audio play failed:', error);
          // Modern browsers require user interaction to play audio
          this.isPlaying = false;
        });
    } catch (error) {
      console.warn('Audio play error:', error);
    }
  }

  pause(): void {
    if (!this.audio) return;
    
    try {
      this.audio.pause();
      this.isPlaying = false;
    } catch (error) {
      console.warn('Audio pause error:', error);
    }
  }

  stop(): void {
    if (!this.audio) return;
    
    try {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.isPlaying = false;
    } catch (error) {
      console.warn('Audio stop error:', error);
    }
  }

  setVolume(volume: number): void {
    if (!this.audio) return;
    
    try {
      this.audio.volume = Math.max(0, Math.min(1, volume));
    } catch (error) {
      console.warn('Audio volume set error:', error);
    }
  }

  toggleMute(): boolean {
    if (!this.audio) return false;
    
    try {
      this.isMuted = !this.isMuted;
      this.audio.muted = this.isMuted;
      return this.isMuted;
    } catch (error) {
      console.warn('Audio mute toggle error:', error);
      return false;
    }
  }

  getIsPlaying(): boolean {
    return this.isPlaying;
  }

  getIsMuted(): boolean {
    return this.isMuted;
  }

  // For production, you would load actual royalty-free gym music tracks
  setMusicTrack(trackUrl: string): void {
    if (!this.audio) return;
    
    try {
      const wasPlaying = this.isPlaying;
      this.pause();
      this.audio.src = trackUrl;
      
      if (wasPlaying) {
        this.play();
      }
    } catch (error) {
      console.warn('Audio track change error:', error);
    }
  }

  // Clean up audio resources
  destroy(): void {
    if (this.audio) {
      this.stop();
      this.audio = null;
    }
  }
}
