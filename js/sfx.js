// ============================================================
// sfx.js — Generador de Efectos de Sonido Procedurales (Web Audio API)
// ============================================================

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// Función auxiliar para tocar un tono
function playTone(frequency, type, duration, vol) {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);
    
    // Fade out suave para evitar "clics" de audio
    gainNode.gain.setValueAtTime(vol, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + duration);
}

// 1. Sonido de Clic (Navegación / Botones)
window.playClick = function() {
    playTone(600, 'sine', 0.1, 0.1);
};

// 2. Sonido de Acierto (Moneda / Campanilla)
window.playCorrect = function() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    
    // Acorde alegre (Arpegio rápido)
    const t = audioCtx.currentTime;
    
    const osc1 = audioCtx.createOscillator();
    const osc2 = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc1.type = 'sine';
    osc2.type = 'sine';
    
    // Frecuencias: Mi (E5) -> Sol# (G#5) -> Si (B5)
    osc1.frequency.setValueAtTime(659.25, t); // E5
    osc1.frequency.setValueAtTime(830.61, t + 0.1); // G#5
    osc1.frequency.setValueAtTime(987.77, t + 0.2); // B5
    
    osc2.frequency.setValueAtTime(1318.51, t); // E6 (octava alta, más brillo)
    
    gain.gain.setValueAtTime(0.15, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.4);
    
    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + 0.4);
    osc2.stop(t + 0.4);
};

// 3. Sonido de Error (Zumbido / Buzzer)
window.playWrong = function() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    
    const t = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    // Onda diente de sierra para un sonido más áspero (zumbido)
    osc.type = 'sawtooth';
    
    // Frecuencia baja y disonante
    osc.frequency.setValueAtTime(150, t);
    osc.frequency.linearRampToValueAtTime(100, t + 0.3);
    
    gain.gain.setValueAtTime(0.2, t);
    gain.gain.linearRampToValueAtTime(0.01, t + 0.3);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start(t);
    osc.stop(t + 0.3);
};
