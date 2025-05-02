// --- Configuración inicial ---
const book = document.getElementById('book');
const prevBtn = document.getElementById('prevPageBtn');
const nextBtn = document.getElementById('nextPageBtn');
const addPageBtn = document.getElementById('addPageBtn');
const imageInput = document.getElementById('imageInput');

// Cada página es un objeto {content, image, isCover}
let pages = [
  { // Portada
    content: '<h1 contenteditable="true" spellcheck="true" class="text-3xl font-bold text-white text-center mb-4">Mi Libro Digital</h1>',
    image: null,
    isCover: true
  },
  { // Página 1
    content: '<div contenteditable="true" class="editable min-h-[6em] bg-gray-50 rounded p-2 mb-2" spellcheck="true">¡Escribe aquí tu historia, poema, receta, recuerdos, etc!</div>',
    image: null
  }
];
let currentPage = 0;

// --- Funciones para renderizar y navegar ---
function renderBook() {
  book.innerHTML = '';
  pages.forEach((page, idx) => {
    const pageDiv = document.createElement('div');
    pageDiv.className = `absolute inset-0 w-full h-full rounded-xl flex flex-col items-stretch justify-start p-6 page-shadow transition-opacity duration-500 bg-white ${idx === currentPage ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'}`;
    if (page.isCover) {
      pageDiv.classList.add('cover-gradient');
      pageDiv.classList.add('bg-blend-multiply');
    }

    // Imagen decorativa
    if (page.image) {
      const img = document.createElement('img');
      img.src = page.image;
      img.alt = "Imagen decorativa";
      img.className = "block max-w-full max-h-48 mx-auto mb-2 rounded shadow";
      pageDiv.appendChild(img);

      // Botón para quitar imagen
      const removeBtn = document.createElement('button');
      removeBtn.textContent = "Quitar imagen";
      removeBtn.className = "ml-auto mb-2 px-2 py-1 rounded bg-pink-600 text-white text-xs hover:bg-pink-700";
      removeBtn.onclick = (e) => {
        e.stopPropagation();
        page.image = null;
        saveBook();
        renderBook();
      };
      pageDiv.appendChild(removeBtn);
    }

    // Botón para añadir imagen (si no hay imagen)
    if (!page.image) {
      const addImgBtn = document.createElement('button');
      addImgBtn.textContent = "Agregar imagen";
      addImgBtn.className = "mb-2 px-2 py-1 rounded border border-pink-400 bg-white text-pink-500 text-xs hover:bg-pink-50";
      addImgBtn.onclick = (e) => {
        e.stopPropagation();
        imageInput.onchange = (event) => {
          const file = event.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = function(evt) {
              page.image = evt.target.result;
              saveBook();
              renderBook();
            };
            reader.readAsDataURL(file);
          }
          imageInput.value = '';
        };
        imageInput.click();
      };
      pageDiv.appendChild(addImgBtn);
    }

    // Contenido editable
    const contentDiv = document.createElement('div');
    contentDiv.innerHTML = page.content;
    // Permitir edición en todos los campos contenteditable
    contentDiv.querySelectorAll('[contenteditable]').forEach(editable => {
      editable.oninput = () => {
        // Guardar el HTML actualizado en la página
        page.content = contentDiv.innerHTML;
        saveBook();
      };
    });
    pageDiv.appendChild(contentDiv);

    // Número de página (no en portada)
    if (!page.isCover) {
      const pageNum = document.createElement('div');
      pageNum.className = 'absolute bottom-4 right-6 text-xs text-gray-400';
      pageNum.textContent = idx;
      pageDiv.appendChild(pageNum);
    }

    book.appendChild(pageDiv);
  });

  // Botones de navegación
  prevBtn.disabled = currentPage === 0;
  nextBtn.disabled = currentPage === pages.length - 1;
}

prevBtn.onclick = () => {
  if (currentPage > 0) {
    currentPage--;
    renderBook();
  }
};
nextBtn.onclick = () => {
  if (currentPage < pages.length - 1) {
    currentPage++;
    renderBook();
  }
};
addPageBtn.onclick = () => {
  pages.push({
    content: '<div contenteditable="true" class="editable min-h-[6em] bg-gray-50 rounded p-2 mb-2" spellcheck="true">Nueva página. Haz click aquí para escribir.</div>',
    image: null
  });
  currentPage = pages.length - 1;
  saveBook();
  renderBook();
};

// Permite pasar página con flechas del teclado
document.addEventListener('keydown', (e) => {
  if (e.target.closest('[contenteditable]')) return; // No interferir al escribir
  if (e.key === 'ArrowRight') nextBtn.click();
  if (e.key === 'ArrowLeft') prevBtn.click();
});

// Permite pasar página haciendo click en los bordes
book.addEventListener('click', (e) => {
  if (e.target.classList.contains('mb-2')) return; // No interferir con botones de imagen
  const rect = book.getBoundingClientRect();
  const x = e.clientX - rect.left;
  if (x < rect.width * 0.25 && currentPage > 0) prevBtn.click();
  else if (x > rect.width * 0.75 && currentPage < pages.length - 1) nextBtn.click();
});

// Guardado local (puedes quitar esto si no quieres persistencia local)
function saveBook() {
  localStorage.setItem('editableBookPages', JSON.stringify(pages));
}
function loadBook() {
  const data = localStorage.getItem('editableBookPages');
  if (data) {
    try {
      pages = JSON.parse(data);
    } catch {}
  }
}

// Render inicial y carga local
loadBook();
renderBook();