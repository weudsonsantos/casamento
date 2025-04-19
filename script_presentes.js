document.addEventListener('DOMContentLoaded', () => {
    /*******************************
       EFEITO DE NEVE (opcional)
    *******************************/
    const canvas = document.getElementById('snowCanvas');
    const ctx = canvas?.getContext('2d');
    
    if (canvas && ctx) {
      function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);
  
      const snowflakes = [];
      const numSnowflakes = 100; // Ajuste se quiser mais/menos flocos
  
      for (let i = 0; i < numSnowflakes; i++) {
        snowflakes.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 3 + 1,
          speed: Math.random() * 1 + 0.5,
          wind: Math.random() * 0.5 - 0.25
        });
      }
  
      function drawSnow() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'rgba(220, 220, 220, 0.6)';
        for (const flake of snowflakes) {
          ctx.beginPath();
          ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
          ctx.fill();
  
          flake.y += flake.speed;
          flake.x += flake.wind;
  
          // Se sair da tela, reaparece em outra posição
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
    }
  
    /*******************************
         LISTA DE PRESENTES
    *******************************/
    const productsContainer = document.getElementById('products-container');
  
    // Modais (descrição e presentear)
    const infoModalProductName = document.getElementById('infoModalProductName');
    const infoModalProductDetails = document.getElementById('infoModalProductDetails');
    const infoModalProductImage = document.getElementById('infoModalProductImage');
  
    const modalProductName = document.getElementById('modalProductName');
    const modalProductDetails = document.getElementById('modalProductDetails');
    const modalProductId = document.getElementById('modalProductId');
  
    const confirmGiftButton = document.getElementById('confirmGiftButton');
    const confirmActionButton = document.getElementById('confirmAction');
  
    const productModal = document.getElementById('productModal');
    const confirmationModal = document.getElementById('confirmationModal');
  
    const userNameInput = document.getElementById('userName');
    const userNameError = document.getElementById('userNameError');
    const spinner = document.getElementById('spinner');
    const successToast = document.getElementById('successToast');
  
    let selectedProductId = null;
    let userName = null;
  
    // Exemplo de fetch de produtos (ajuste conforme seu backend ou arquivo JSON)
    fetch('/api/products')
      .then(response => response.json())
      .then(products => {
        console.log('Produtos carregados:', products);
  
        products.forEach(product => {
          if (product.quantidade > 0) {
            const productCard = `
              <div class="col">
                <div class="card h-100 d-flex flex-column shadow-sm animate__animated animate__fadeInUp">
                  <img src="${product.imagem}" class="card-img-top" alt="${product.nome}">
                  
                  <div class="card-body text-center flex-grow-1">
                    <h5 class="card-title mb-3">${product.nome}</h5>
                  </div>
                  
                  <div class="text-center p-2">
                    <button
                      class="btn btn-select select-btn me-2"
                      data-id="${product.id}"
                      data-name="${product.nome}"
                      data-image="${product.imagem}"
                      data-bs-toggle="modal"
                      data-bs-target="#productModal"
                    >
                      <i class="fas fa-gift"></i> Selecionar
                    </button>
                    
                    <!-- Botão de detalhes com data-image -->
                    <button
                      class="btn btn-info-custom info-btn"
                      data-id="${product.id}"
                      data-name="${product.nome}"
                      data-details="${product.descricao}"
                      data-image="${product.imagem}"
                      data-bs-toggle="modal"
                      data-bs-target="#infoModal"
                    >
                      <i class="fas fa-info-circle"></i>
                    </button>
                  </div>
                </div>
              </div>
            `;
            productsContainer.innerHTML += productCard;
          }
        });
  
        // Botões de descrição (info)
        document.querySelectorAll('.info-btn').forEach(button => {
          button.addEventListener('click', () => {
            const productName = button.getAttribute('data-name');
            const productDetails = button.getAttribute('data-details');
            const productImage = button.getAttribute('data-image'); // pega a URL da imagem
  
            // Preenche o modal
            if (infoModalProductName) {
              infoModalProductName.textContent = productName;
            }
            if (infoModalProductDetails) {
              infoModalProductDetails.textContent = productDetails;
            }
            if (infoModalProductImage) {
              infoModalProductImage.src = productImage;
              infoModalProductImage.alt = 'Imagem do produto: ' + productName;
            }
          });
        });
  
        // Botões de Selecionar (presentear)
        document.querySelectorAll('.select-btn').forEach(button => {
          button.addEventListener('click', () => {
            const productId = button.getAttribute('data-id');
            const productName = button.getAttribute('data-name');
            const productDetails = button.getAttribute('data-details');
  
            if (modalProductName) {
              modalProductName.textContent = productName;
            }
            if (modalProductDetails) {
              modalProductDetails.textContent = productDetails;
            }
            if (modalProductId) {
              modalProductId.value = productId;
            }
  
            console.log('Produto selecionado:', {
              productId,
              productName,
              productDetails,
            });
          });
        });
      })
      .catch(error => {
        console.error('Erro ao carregar produtos:', error);
        alert('Erro ao carregar os produtos. Por favor, tente novamente.');
      });
  
    // Ao clicar em "Presentear" no modal
    if (confirmGiftButton) {
      confirmGiftButton.addEventListener('click', () => {
        userName = userNameInput.value.trim();
        selectedProductId = modalProductId.value.trim();
  
        if (userNameInput && userNameError) {
          userNameError.textContent = '';
          userNameInput.classList.remove('is-invalid');
  
          // Valida o nome
          if (!userName) {
            userNameInput.classList.add('is-invalid');
            userNameError.textContent = 'Por favor, insira seu nome.';
            return;
          }
          if (userName.length < 3) {
            userNameInput.classList.add('is-invalid');
            userNameError.textContent = 'O nome deve ter pelo menos 3 caracteres.';
            return;
          }
        }
        if (!selectedProductId) {
          alert('Nenhum produto selecionado. Por favor, tente novamente.');
          return;
        }
  
        const productModalInstance = bootstrap.Modal.getInstance(productModal);
        if (productModalInstance) productModalInstance.hide();
  
        const confirmationModalInstance = new bootstrap.Modal(confirmationModal);
        if (confirmationModalInstance) confirmationModalInstance.show();
      });
    }
  
    // Ao confirmar no modal de confirmação
    if (confirmActionButton) {
      confirmActionButton.addEventListener('click', () => {
        if (!selectedProductId || !userName) {
          alert('Algo deu errado. Tente novamente.');
          return;
        }
  
        if (spinner) spinner.classList.remove('d-none');
  
        fetch('/select-present', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: selectedProductId, userName })
        })
          .then(response => {
            if (!response.ok) {
              return response.json().then(errorData => {
                throw new Error(errorData.message || 'Erro ao salvar o presente.');
              });
            }
            return response.json();
          })
          .then(data => {
            console.log('Dados do servidor:', data);
            if (spinner) spinner.classList.add('d-none');
  
            const confirmationModalInstance = bootstrap.Modal.getInstance(confirmationModal);
            if (confirmationModalInstance) confirmationModalInstance.hide();
  
            if (successToast) {
              successToast.classList.remove('d-none');
              successToast.classList.add('show');
            }
  
            setTimeout(() => {
              location.reload();
            }, 1000);
          })
          .catch(error => {
            console.error('Erro ao registrar presente:', error.message);
            alert('Erro ao salvar o presente. Por favor, tente novamente.');
            if (spinner) spinner.classList.add('d-none');
          });
      });
    }
  
    
  });
  