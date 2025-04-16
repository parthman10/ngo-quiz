// In a real app, you would import actual sound files
// For now, we'll use the Web Audio API to generate simple sounds

let audioContext;

// Initialize audio context on first user interaction
const initAudio = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
};

// Play a correct answer sound (happy sound)
export const playCorrectSound = () => {
  try {
    initAudio();
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
    oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
    oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.5);
  } catch (error) {
    console.error('Error playing sound:', error);
  }
};

// Play an incorrect answer sound (sad sound)
export const playIncorrectSound = () => {
  try {
    initAudio();
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(392.00, audioContext.currentTime); // G4
    oscillator.frequency.setValueAtTime(349.23, audioContext.currentTime + 0.2); // F4
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.4);
  } catch (error) {
    console.error('Error playing sound:', error);
  }
};

// Background music (simple looping tone)
let bgMusicOscillator = null;
let bgMusicGain = null;

export const startBackgroundMusic = () => {
  try {
    if (bgMusicOscillator) return; // Already playing
    
    initAudio();
    
    bgMusicOscillator = audioContext.createOscillator();
    bgMusicGain = audioContext.createGain();
    
    bgMusicOscillator.connect(bgMusicGain);
    bgMusicGain.connect(audioContext.destination);
    
    bgMusicOscillator.type = 'sine';
    bgMusicOscillator.frequency.setValueAtTime(220, audioContext.currentTime); // A3
    
    bgMusicGain.gain.setValueAtTime(0.05, audioContext.currentTime); // Very quiet
    
    bgMusicOscillator.start();
  } catch (error) {
    console.error('Error playing background music:', error);
  }
};

export const stopBackgroundMusic = () => {
  if (bgMusicOscillator) {
    bgMusicOscillator.stop();
    bgMusicOscillator = null;
    bgMusicGain = null;
  }
};