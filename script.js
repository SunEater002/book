 // Contenido de las páginas
 const pages = [
    {
      text: "Todo comenzo con un mensaje, un mensaje que llego de imprevisto y cambio todo.",
      img: "img/img2.jpg"
    },
    {
      text: "Haciendo que conociera a la persona que cambiaría mi vida para siempre y tendriamos multiples aventuras.",
      img: "img/img1.jpg"
    },
    {
      text: "Aunque no todo fue fácil, juntos superamos obstáculos y aprendimos a confiar el uno en el otro.",
      img: "img/img3.jpg"
    },
    {
      text: "Y hasta el dia de hoy, seguimos escribiendo nuestra historia juntos, por mas cosas que nos pasen, regresamos el uno con el otro",
      img: "img/img4.jpg"
    },
    {
      text: "Como dice una pelicula por ahi ...",
      img: "img/img6.jpg"
    },
    {
      text: "'LOS CABALLOS DE MAR son una de esas especies que escogen una pareja para toda la vida. Una vez que uno muere, tarda poco tiempo en morir tambien el otro. No pueden vivir el uno sin el otro. Por eso se dice que los caballos de mar MUEREN DE AMOR.'",
      img: "img/img5.jpg"
    },
    {
        text: "Feliz Cumpleaños mamor, espero que este libro te haya gustado y que lo sigas leyendo cada vez que quieras recordar lo que hemos vivido juntos.",
        img: "img/img7.jpg"
      }

  ];

  const bookPagesDiv = document.getElementById('bookPages');
  const bookCover = document.getElementById('bookCover');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const backToCoverBtn = document.getElementById('backToCoverBtn');
  const pagination = document.getElementById('pagination');
  const flipSound = document.getElementById('flipSound');

  let isOpen = false;
  let currentPage = 0;

  // Crear las páginas del libro
  function renderPages() {
    bookPagesDiv.innerHTML = '';
    for (let i = 0; i < pages.length; i++) {
      const page = document.createElement('div');
      page.className = 'book-page absolute w-full h-full flex';
      page.style.zIndex = pages.length - i;
      page.style.transform = 'rotateY(0deg)';
      page.innerHTML = `
        <div class="w-1/2 h-full flex flex-col justify-center items-center bg-white/90 border-r border-pink-200 px-6">
          <p class="text-lg text-gray-700 font-serif text-center">${pages[i].text}</p>
        </div>
        <div class="w-1/2 h-full flex flex-col justify-center items-center bg-pink-50 px-4">
          <img src="${pages[i].img}" alt="Imagen página ${i+1}" class="rounded-lg shadow-lg max-h-48 border-2 border-pink-200" />
        </div>
      `;
      page.dataset.page = i;
      bookPagesDiv.appendChild(page);
    }
    updatePages();
  }

  // Actualiza el estado visual de las páginas y la paginación
  function updatePages() {
    const allPages = bookPagesDiv.querySelectorAll('.book-page');
    allPages.forEach((page, idx) => {
      if (idx < currentPage) {
        page.classList.add('flipped');
        page.style.transform = 'rotateY(-180deg)';
      } else {
        page.classList.remove('flipped');
        page.style.transform = 'rotateY(0deg)';
      }
      // Z-index para efecto de apilado
      page.style.zIndex = pages.length - Math.abs(currentPage - idx);
    });
    prevBtn.disabled = !isOpen || currentPage === 0;
    nextBtn.disabled = !isOpen || currentPage === pages.length;
    // Paginación visual
    if (isOpen && currentPage < pages.length) {
      pagination.innerHTML = `<span class="bg-pink-500/80 px-3 py-1 rounded shadow">Página ${currentPage + 1} de ${pages.length}</span>`;
    } else {
      pagination.innerHTML = '';
    }
  }

  // Abrir el libro
  bookCover.addEventListener('click', () => {
    if (isOpen) return;
    isOpen = true;
    bookCover.classList.remove('closed');
    bookCover.classList.add('opened');
    bookCover.style.pointerEvents = 'none';
    nextBtn.disabled = false;
    backToCoverBtn.classList.remove('hidden');
    renderPages();
    updatePages();
  });

  // Botón siguiente
  nextBtn.addEventListener('click', () => {
    if (!isOpen || currentPage >= pages.length) return;
    currentPage++;
    playFlipSound();
    updatePages();
  });

  // Botón anterior
  prevBtn.addEventListener('click', () => {
    if (!isOpen || currentPage <= 0) return;
    currentPage--;
    playFlipSound();
    updatePages();
  });

  // Botón volver a portada
  backToCoverBtn.addEventListener('click', () => {
    isOpen = false;
    currentPage = 0;
    bookCover.classList.remove('opened');
    bookCover.classList.add('closed');
    bookCover.style.pointerEvents = 'auto';
    backToCoverBtn.classList.add('hidden');
    prevBtn.disabled = true;
    nextBtn.disabled = true;
    pagination.innerHTML = '';
    // Oculta las páginas
    bookPagesDiv.innerHTML = '';
  });

  // Sonido al pasar página
  function playFlipSound() {
    flipSound.currentTime = 0;
    flipSound.play();
  }

  // Inicial
  renderPages();