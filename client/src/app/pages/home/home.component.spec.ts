import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HomeComponent } from './home.component';
import { AudioService } from '../../services/audio.service';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let audioService: jasmine.SpyObj<AudioService>;

  beforeEach(async () => {
    const audioServiceSpy = jasmine.createSpyObj('AudioService', ['play', 'pause', 'isPlaying', 'getIsPlaying', 'togglePlayback']);

    await TestBed.configureTestingModule({
      imports: [HomeComponent, RouterTestingModule],
      providers: [
        { provide: AudioService, useValue: audioServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    audioService = TestBed.inject(AudioService) as jasmine.SpyObj<AudioService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle music', () => {
    audioService.togglePlayback.and.returnValue(true);
    component.isPlaying = false;

    component.toggleMusic();

    expect(audioService.togglePlayback).toHaveBeenCalled();
    expect(component.isPlaying).toBeTrue();
  });

  it('should pause music when playing', () => {
    audioService.togglePlayback.and.returnValue(false);
    component.isPlaying = true;

    component.toggleMusic();

    expect(audioService.togglePlayback).toHaveBeenCalled();
    expect(component.isPlaying).toBeFalse();
  });

  it('should handle ngOnInit', () => {
    audioService.getIsPlaying.and.returnValue(true);
    component.ngOnInit();
    expect(component.isPlaying).toBeTrue();
  });

  it('should handle onDestroy', () => {
    component.ngOnDestroy();
    expect(audioService.pause).toHaveBeenCalled();
  });
});
