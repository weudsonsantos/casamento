/*******************************
   MENU HAMBÚRGUER (MOBILE)
*******************************/
function toggleMobileNav() {
  const mobileNav = document.getElementById('mobileNav');
  mobileNav.classList.toggle('active');
}

/*******************************
       EFEITO DE NEVE
*******************************/
const canvas = document.getElementById('snowCanvas');
const ctx = canv.getContext('2d');

// Ajusta o tamanho do canvas para a janela
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Cria partículas de neve
const snowflakes = [];
const numSnowflakes = 100; // Número de partículas, ajuste conforme necessário

for (let i = 0; i < numSnowflakes; i++) {
  snowflakes.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 3 + 1,
    speed: Math.random() * 1 + 0.5,
    wind: Math.random() * 0.5 - 0.25
  });
}

// Função de animação
function drawSnow() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'rgba(220, 220, 220, 0.6)';
  for (const flake of snowflakes) {
    ctx.beginPath();
    ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
    ctx.fill();
    
    // Atualiza a posição
    flake.y += flake.speed;
    flake.x += flake.wind;
    
    // Reseta a partícula se sair da tela
    if (flake.y > canvas.height) {
      flake.y = -flake.radius;
      flake.x = Math.random() * canvas.width;
    }
    if (flake.x > canvas.width) {
      flake.x = 0;
    }
    if (flake.x < 0) {
      flake.x = canvas.width;
    }
  }
  requestAnimationFrame(drawSnow);
}
drawSnow();

/*******************************
    CONTAGEM REGRESSIVA
*******************************/
const weddingDate = new Date("2025-05-14T19:00:00").getTime();
const countdownFunction = setInterval(() => {
  const now = new Date().getTime();
  const distance = weddingDate - now;

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  document.getElementById("days").textContent = days;
  document.getElementById("hours").textContent = hours;
  document.getElementById("minutes").textContent = minutes;
  document.getElementById("seconds").textContent = seconds;

  if (distance < 0) {
    clearInterval(countdownFunction);
    document.querySelector(".countdown").innerHTML =
      "<p>O grande dia chegou!</p>";
  }
}, 1000);

/*******************************
      POPUP DE PRESENÇA
*******************************/
// Seleciona os elementos já existentes
const presenceForm = document.getElementById('presence-form');
const presenceSubmit = document.getElementById('presence-submit');
const presenceCancel = document.getElementById('presence-cancel');
const presenceNameInput = document.getElementById('presence-name');
// const presenceMessage = document.getElementById('presence-message'); // se não usar, pode ser removido

// Exibe o popup ao clicar no botão "Confirmar Presença"
document.getElementById('confirm-presence-btn').addEventListener('click', () => {
  presenceForm.classList.add('modal-active');
});

// Fecha o popup ao clicar no botão "Fechar"
presenceCancel.addEventListener('click', () => {
  presenceForm.classList.remove('modal-active');
});

// Envia os dados para o servidor ao clicar em "Confirmar" dentro do popup
presenceSubmit.addEventListener('click', () => {
  const name = presenceNameInput.value.trim();
  if (!name) {
    alert('Por favor, insira seu nome.');
    return;
  }

  fetch('/confirm-presence', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name })
  })
    .then(response => response.json())
    .then(data => {
      // Removida a exibição do alert
      presenceForm.classList.remove('modal-active');
      presenceNameInput.value = '';
      // Se desejar, pode atualizar algum elemento na página para indicar sucesso
    })
    .catch(error => {
      console.error('Erro:', error);
      alert('Ocorreu um erro ao confirmar sua presença.');
    });
});

//caixa coleta dados
document.getElementById('confirm-presence-btn').addEventListener('click', function() {
    document.getElementById('presence-form').style.display = 'block';
    this.style.display = 'none';
  });
  
  document.getElementById('presence-form').addEventListener('submit', function(e) {
    e.preventDefault();
    // Simulação de envio (substitua por AJAX/API real)
    setTimeout(() => {
      this.style.display = 'none';
      document.getElementById('presence-message').style.display = 'block';
    }, 1000);
  });




/*******************************
  REVELAR ELEMENTOS AO SCROLL
*******************************/
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.3 }
);

document.querySelectorAll(".reveal").forEach((el) => {
  observer.observe(el);
});
