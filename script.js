// Variables globales
let currentAttempt = 0;
let isAuthenticating = false;
let spaceMessageIndex = 0;

// Elementos del DOM
const screens = {
    initial: document.getElementById('initial-screen'),
    loading: document.getElementById('loading-screen'),
    space: document.getElementById('space-screen'),
    final: document.getElementById('final-screen')
};

const elements = {
    progressFill: document.getElementById('progress-fill'),
    progressText: document.getElementById('progress-text'),
    statusMessage: document.getElementById('status-message'),
    retryButton: document.getElementById('retry-button'),
    spaceText: document.getElementById('space-text')
};

// Configuración de intentos
const attempts = [
    { maxProgress: 80, message: "Presiona un poco más fuerte", retryMessage: "Solo llegaste al 80%. Levanta los dedos y vuelve a intentar." },
    { maxProgress: 70, message: "Presiona más fuerte", retryMessage: "Solo llegaste al 70%. Levanta los dedos y vuelve a intentar." },
    { maxProgress: 98, message: "Presiona más fuerte", retryMessage: "Solo llegaste al 98%. Levanta los dedos y vuelve a intentar." },
    { maxProgress: 100, message: "¡Perfecto!", retryMessage: "¡Así de insistente hay que ser con los metros!" }
];

// Mensajes del espacio
const spaceMessages = [
    "Si tienes 2 ojos... ¡sonríe! 😊",
    "Si tienes una nariz... ¡acuerdate de mí! 👃",
    "Si tienes unos labios... ¡como quisiera que fueran míos! 💋",
    "Digo... ¡sonríe otra vez! 😄"
];

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
});

// Configurar event listeners
function setupEventListeners() {
    // Touch area inicial
    const touchArea = document.getElementById('touch-area');
    touchArea.addEventListener('click', startAuthentication);
    touchArea.addEventListener('touchstart', startAuthentication);

    // Touch area del espacio
    const spaceTouchArea = document.getElementById('space-touch-area');
    spaceTouchArea.addEventListener('click', startFinalAuthentication);
    spaceTouchArea.addEventListener('touchstart', startFinalAuthentication);
}

// Iniciar autenticación
function startAuthentication(e) {
    e.preventDefault();
    if (isAuthenticating) return;
    
    isAuthenticating = true;
    currentAttempt = 0;
    
    // Cambiar a pantalla de carga
    showScreen('loading');
    
    // Iniciar proceso de autenticación
    simulateAuthentication();
}

// Simular proceso de autenticación
function simulateAuthentication() {
    const attempt = attempts[currentAttempt];
    let progress = 0;
    
    // Ocultar botón de reintentar
    elements.retryButton.style.display = 'none';
    elements.statusMessage.textContent = '';
    
    // Simular progreso
    const progressInterval = setInterval(() => {
        progress += Math.random() * 3 + 1; // Incremento aleatorio entre 1-4
        
        if (progress >= attempt.maxProgress) {
            progress = attempt.maxProgress;
            clearInterval(progressInterval);
            
            // Mostrar mensaje de error
            setTimeout(() => {
                elements.statusMessage.textContent = attempt.message;
                
                if (currentAttempt < attempts.length - 1) {
                    // Mostrar botón de reintentar después de un delay
                    setTimeout(() => {
                        elements.retryButton.style.display = 'block';
                        elements.statusMessage.textContent = attempt.retryMessage;
                    }, 2000);
                } else {
                    // Último intento exitoso
                    setTimeout(() => {
                        elements.statusMessage.textContent = attempt.retryMessage;
                        setTimeout(() => {
                            showSpaceScreen();
                        }, 2000);
                    }, 1000);
                }
            }, 500);
        }
        
        // Actualizar barra de progreso
        updateProgressBar(progress);
    }, 100);
}

// Actualizar barra de progreso
function updateProgressBar(progress) {
    elements.progressFill.style.width = `${progress}%`;
    elements.progressText.textContent = `${Math.round(progress)}%`;
}

// Reintentar autenticación
function retryAuthentication() {
    currentAttempt++;
    isAuthenticating = false;
    simulateAuthentication();
}

// Mostrar pantalla del espacio
function showSpaceScreen() {
    showScreen('space');
    startSpaceMessages();
}

// Iniciar mensajes del espacio
function startSpaceMessages() {
    spaceMessageIndex = 0;
    showNextSpaceMessage();
}

// Mostrar siguiente mensaje del espacio
function showNextSpaceMessage() {
    if (spaceMessageIndex < spaceMessages.length) {
        const message = spaceMessages[spaceMessageIndex];
        elements.spaceText.textContent = message;
        
        // Efecto de escritura
        typeWriter(elements.spaceText, message, () => {
            spaceMessageIndex++;
            setTimeout(showNextSpaceMessage, 2000);
        });
    }
}

// Efecto de escritura
function typeWriter(element, text, callback) {
    element.textContent = '';
    let i = 0;
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, 100);
        } else {
            if (callback) callback();
        }
    }
    
    type();
}

// Iniciar autenticación final
function startFinalAuthentication(e) {
    e.preventDefault();
    if (isAuthenticating) return;
    
    isAuthenticating = true;
    
    // Simular carga rápida
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += 5;
        
        if (progress >= 100) {
            progress = 100;
            clearInterval(progressInterval);
            
            setTimeout(() => {
                showFinalScreen();
            }, 500);
        }
        
        updateProgressBar(progress);
    }, 50);
}

// Mostrar pantalla final
function showFinalScreen() {
    showScreen('final');
    
    // Efecto de celebración
    setTimeout(() => {
        const celebration = document.querySelector('.celebration');
        celebration.style.animation = 'bounce 0.6s ease-in-out';
    }, 500);
}

// Cambiar pantalla
function showScreen(screenName) {
    // Ocultar todas las pantallas
    Object.values(screens).forEach(screen => {
        screen.classList.remove('active');
        screen.classList.add('fade-out');
    });
    
    // Mostrar pantalla seleccionada
    setTimeout(() => {
        Object.values(screens).forEach(screen => {
            screen.classList.remove('fade-out');
        });
        
        screens[screenName].classList.add('active');
        screens[screenName].classList.add('fade-in');
        
        setTimeout(() => {
            screens[screenName].classList.remove('fade-in');
        }, 500);
    }, 300);
}

// Agregar animación de bounce
const style = document.createElement('style');
style.textContent = `
    @keyframes bounce {
        0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
        }
        40% {
            transform: translateY(-10px);
        }
        60% {
            transform: translateY(-5px);
        }
    }
`;
document.head.appendChild(style);

// Prevenir zoom en dispositivos móviles
document.addEventListener('touchstart', function(e) {
    if (e.touches.length > 1) {
        e.preventDefault();
    }
}, { passive: false });

// Prevenir doble tap para zoom
let lastTouchEnd = 0;
document.addEventListener('touchend', function(e) {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
        e.preventDefault();
    }
    lastTouchEnd = now;
}, false);
