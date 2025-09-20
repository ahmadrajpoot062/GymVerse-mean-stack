import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private audio: HTMLAudioElement | null = null;
  private isPlaying = false;
  private isMuted = false;
  private shouldAutoPlay = false; // Flag to indicate music should be off by default
  
  // Single music track - your specific file
  private musicTrack = '/assets/audio/Danny Shields - Smoke  Sizzle.mp3';

  constructor() {
    // Just initialize audio without autoplay
    this.initializeAudio();
  }

  private setupGlobalInteractionListeners() {
    // Listen for any user interaction to start music if it should be playing
    const events = ['click', 'touchstart', 'keydown', 'mousemove', 'scroll'];
    
    const startMusicOnInteraction = () => {
      if (this.shouldAutoPlay && !this.isPlaying) {
        this.startOnInteraction();
        // Remove listeners after first successful start
        if (this.isPlaying) {
          events.forEach(event => {
            document.removeEventListener(event, startMusicOnInteraction);
          });
        }
      }
    };

    events.forEach(event => {
      document.addEventListener(event, startMusicOnInteraction, { passive: true });
    });
  }

  private initializeAudio() {
    try {
      console.log('Initializing audio system');
      
      // Check for any existing audio element to avoid duplication
      if (this.audio) {
        console.log('Audio element already exists, resetting it');
        this.audio.pause();
        this.audio = null;
      }
      
      this.audio = new Audio();
      
      // Apply attributes that might help with autoplay
      this.audio.loop = true; // Enable loop for single track
      this.audio.volume = 0.3; // Start with lower volume
      this.audio.preload = 'auto'; // Preload the audio file
      this.audio.autoplay = true; // Try to use native autoplay attribute
      
      // Add playsinline attribute for iOS (as a property extension)
      (this.audio as any).playsInline = true; // Better mobile compatibility
      
      // Try alternative paths if the file might be in different locations
      const possiblePaths = [
        this.musicTrack,
        `/assets/audio/Danny Shields - Smoke  Sizzle.mp3`,
        `assets/audio/Danny Shields - Smoke  Sizzle.mp3`,
        `./assets/audio/Danny Shields - Smoke  Sizzle.mp3`,
        `../assets/audio/Danny Shields - Smoke  Sizzle.mp3`
      ];
      
      // Set the single track with primary path
      this.audio.src = this.musicTrack;
      console.log(`Loading track: ${this.musicTrack}`);
      
      // Error handling with fallback paths
      this.audio.addEventListener('error', (e) => {
        console.warn(`Failed to load track: ${this.musicTrack}`, e);
        
        // Try alternative paths
        if (this.audio) {
          for (let i = 1; i < possiblePaths.length; i++) {
            console.log(`Trying alternative path: ${possiblePaths[i]}`);
            this.audio.src = possiblePaths[i];
          }
        }
      });
      
      // Try to autoplay when audio can play
      this.audio.addEventListener('canplaythrough', () => {
        console.log('Audio can play through, ready for playback');
        if (this.shouldAutoPlay) {
          this.forceAutoPlay();
        }
      });

      // Also try when metadata is loaded
      this.audio.addEventListener('loadedmetadata', () => {
        console.log('Audio metadata loaded successfully');
        if (this.shouldAutoPlay) {
          this.forceAutoPlay();
        }
      });
      
      // Listen for play event to update state
      this.audio.addEventListener('play', () => {
        console.log('Native play event detected');
        this.isPlaying = true;
      });
      
      // Listen for pause event to update state
      this.audio.addEventListener('pause', () => {
        console.log('Native pause event detected');
        this.isPlaying = false;
      });
      
      // Track loaded successfully
      this.audio.addEventListener('loadeddata', () => {
        console.log('✅ Audio data loaded successfully and ready for playback');
      });
      
    } catch (error) {
      console.warn('Audio initialization failed:', error);
    }
  }

  private forceAutoPlay() {
    if (!this.audio || this.isPlaying) return;
    
    // Set up attributes to maximize autoplay chances
    this.audio.muted = false;
    this.audio.volume = 0.3;
    this.audio.preload = 'auto';
    
    // Use the play() method with additional retry logic
    const attemptPlay = () => {
      this.audio?.play()
        .then(() => {
          this.isPlaying = true;
          this.shouldAutoPlay = false; // Reset flag
          console.log('🎵 Auto-playing background music');
        })
        .catch((error) => {
          console.log('⚠️ Autoplay attempt blocked by browser - trying alternative methods', error);
          
          // Try again with muted audio (more likely to be allowed) then unmute after
          if (this.audio) {
            this.audio.muted = true;
            this.audio.play()
              .then(() => {
                setTimeout(() => {
                  if (this.audio) {
                    this.audio.muted = false;
                    this.isPlaying = true;
                    this.shouldAutoPlay = false;
                    console.log('🎵 Auto-playing background music (with unmute workaround)');
                  }
                }, 1000);
              })
              .catch(() => {
                console.log('⚠️ All autoplay attempts blocked - setting up automatic button click');
                // Keep shouldAutoPlay true but make sure isPlaying is false
                this.isPlaying = false;
                
                // Wait a short moment then automatically trigger a click on the music button
                setTimeout(() => {
                  this.simulateMusicButtonClick();
                }, 1500);
              });
          }
        });
    };
    
    // Attempt to play immediately, and also retry after a short delay
    attemptPlay();
    setTimeout(attemptPlay, 1000);
  }
  
  // Method to find and click the music button automatically
  private simulateMusicButtonClick() {
    try {
      console.log('🔄 Attempting direct play instead of button click');
      
      // Try direct play first - most reliable method
      if (this.audio) {
        this.audio.muted = false; // Ensure not muted
        this.audio.volume = 0.3;  // Set volume
        
        // Force a direct play attempt
        this.audio.play()
          .then(() => {
            this.isPlaying = true;
            this.shouldAutoPlay = false;
            console.log('✅ Direct play successful');
          })
          .catch(error => {
            console.warn('Direct play failed, trying DOM interaction:', error);
            this.tryDOMInteraction();
          });
      } else {
        this.tryDOMInteraction();
      }
    } catch (error) {
      console.warn('Failed to automatically start music:', error);
      this.tryDOMInteraction();
    }
  }
  
  // Backup method that tries various DOM interactions
  private tryDOMInteraction() {
    try {
      // Try multiple selector patterns to find the button
      const selectors = [
        '#musicToggleButton', // First try the ID we added
        '.fixed.top-24.right-4.z-40 button',
        'button svg[viewBox="0 0 24 24"]',
        '[title*="music"]',
        '[title*="Play"]',
        '.fixed button'
      ];
      
      let button: HTMLElement | null = null;
      
      for (const selector of selectors) {
        const element = document.querySelector(selector);
        if (element) {
          button = element as HTMLElement;
          console.log(`Found button with selector: ${selector}`);
          break;
        }
      }
      
      if (button) {
        console.log('🔄 Automatically clicking music button to bypass autoplay restrictions');
        button.click();
        
        // Also dispatch various events to simulate user interaction
        window.dispatchEvent(new Event('click'));
        document.dispatchEvent(new Event('click'));
        document.body.click();
      } else {
        console.warn('Could not find music button - creating a synthetic event');
        
        // Create and dispatch synthetic events on document and body
        ['click', 'touchstart', 'mousedown', 'keydown'].forEach(eventType => {
          document.dispatchEvent(new Event(eventType, { bubbles: true }));
        });
        
        // Try direct play again after events
        setTimeout(() => {
          if (this.audio && !this.isPlaying) {
            this.play();
          }
        }, 500);
      }
    } catch (error) {
      console.warn('DOM interaction failed:', error);
    }
  }

  // This method ensures music starts on any user interaction
  private startOnInteraction() {
    if (!this.shouldAutoPlay || this.isPlaying || !this.audio) return;
    
    this.audio.play()
      .then(() => {
        this.isPlaying = true;
        this.shouldAutoPlay = false;
        console.log('🎵 Background music started on user interaction');
      })
      .catch(() => {
        console.warn('Failed to start music on interaction');
        this.isPlaying = false;
      });
  }

  // Since we're using a single track, these methods just restart the current track
  nextTrack() {
    if (!this.audio) return;
    
    const wasPlaying = this.isPlaying;
    this.audio.currentTime = 0; // Restart the track
    
    if (wasPlaying) {
      this.play();
    }
  }

  previousTrack() {
    if (!this.audio) return;
    
    const wasPlaying = this.isPlaying;
    this.audio.currentTime = 0; // Restart the track
    
    if (wasPlaying) {
      this.play();
    }
  }

  getCurrentTrackName(): string {
    return this.musicTrack.split('/').pop()?.replace('.mp3', '') || 'Unknown Track';
  }

  // Return 1 since we have only one track
  getTotalTracks(): number {
    return 1;
  }

  // Always return 1 since we have only one track
  getCurrentTrackNumber(): number {
    return 1;
  }

  // Method to try starting music (can be called from components)
  tryAutoStart(): void {
    if (!this.audio || this.isPlaying) return;
    
    // Try both normal and forced autoplay for best chance of success
    this.play();
    this.forceAutoPlay();
    
    // If autoplay fails, set a timeout to simulate a click on the music button
    setTimeout(() => {
      if (!this.isPlaying && this.shouldAutoPlay) {
        this.simulateMusicButtonClick();
      }
    }, 2000);
  }
  
  // Public method to trigger the automatic click
  triggerAutomaticPlay(): void {
    if (!this.isPlaying) {
      this.simulateMusicButtonClick();
    }
  }

  togglePlayback(): boolean {
    // If audio isn't initialized, initialize it
    if (!this.audio) {
      console.log('Audio not initialized in toggle, creating it now');
      this.initializeAudio();
      this.play();
      return true;
    }

    try {
      console.log('Toggle playback called, current state:', 
                 this.isPlaying ? 'playing' : 'paused',
                 'shouldAutoPlay:', this.shouldAutoPlay);
      
      // If should auto play but not actually playing, start it
      if (this.shouldAutoPlay && !this.isPlaying) {
        console.log('Starting on interaction via toggle');
        this.startOnInteraction();
        
        // Force the play state for better UX
        setTimeout(() => {
          if (!this.isPlaying && this.audio) {
            console.log('Forcing play after toggle');
            this.play();
          }
        }, 300);
        
        return true; // Return true to update UI immediately
      }

      // Normal toggle behavior
      if (this.isPlaying) {
        console.log('Pausing via toggle');
        this.pause();
        return false; // Return the new state (paused)
      } else {
        console.log('Playing via toggle');
        this.play();
        return true; // Return the new state (playing)
      }
      
    } catch (error) {
      console.warn('Audio playback toggle failed:', error);
      
      // Try recovery
      console.log('Attempting recovery after toggle failure');
      this.initializeAudio();
      this.play();
      
      return true; // Optimistic return for better UX
    }
  }

  play(): void {
    if (!this.audio) {
      console.warn('Audio element not initialized, creating it now');
      this.initializeAudio();
      if (!this.audio) return;
    }
    
    try {
      // Make sure the track is properly loaded
      if (!this.audio.src || !this.audio.src.includes('Smoke')) {
        console.log('Reloading audio source');
        this.audio.src = this.musicTrack;
        this.audio.load();
      }
      
      // Reset any potential issues
      this.audio.muted = false;
      this.audio.volume = 0.3;
      this.audio.loop = true;
      
      console.log('Attempting to play audio...');
      
      this.audio.play()
        .then(() => {
          this.isPlaying = true;
          this.shouldAutoPlay = false; // Reset the flag once manually started
          console.log('✅ Audio playback started successfully');
        })
        .catch((error) => {
          console.warn('Audio play failed:', error);
          this.isPlaying = false;
          
          // If play fails, try the muted approach as a fallback
          console.log('Trying muted approach as fallback...');
          if (this.audio) {
            this.audio.muted = true;
            this.audio.play()
              .then(() => {
                // If muted play works, unmute after a delay
                setTimeout(() => {
                  if (this.audio) {
                    this.audio.muted = false;
                    this.isPlaying = true;
                    console.log('✅ Audio playback started with mute workaround');
                  }
                }, 1000);
              })
              .catch(err => {
                console.warn('Even muted playback failed:', err);
              });
          }
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

  // Returns true if music should be playing (either playing or waiting to autoplay)
  getShouldBePlaying(): boolean {
    return this.isPlaying || this.shouldAutoPlay;
  }

  // Music is never waiting for interaction in this simplified version
  isWaitingForInteraction(): boolean {
    return false;
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
