// Botones principales
const btn = document.querySelector('button'); // menú hamburguesa
const botonCruz = document.querySelector('#boton_cruz');
const menu = document.querySelector('#menu-mobile');

// Abre menú principal
btn.addEventListener('click', () => {
  menu.classList.remove('translate-x-full', 'opacity-0');
  menu.classList.add('translate-x-0', 'opacity-100');
  botonCruz.classList.toggle('hidden');
  btn.classList.toggle('hidden');
});

// Cierra menú principal
botonCruz.addEventListener('click', () => {
  menu.classList.add('translate-x-full', 'opacity-0');
  menu.classList.remove('translate-x-0', 'opacity-100');
  botonCruz.classList.toggle('hidden');
  btn.classList.toggle('hidden');
});

// --- Menú secundario ---
const btnCategorias = document.querySelector('#btn-categorias');
const btnPerfumeria = document.querySelector('#btn-perfumeria');
const btnProductos = document.querySelector('#btn-productos');
const menu1 = document.querySelector('#menu-mobile');
const menu2 = document.querySelector('#menu-mobile2');
const menu3 = document.querySelector('#menu-mobile3');
const menu4 = document.querySelector('#menu-mobile4');
const btnVolver1 = document.querySelector('#btn-volver1');
const btnVolver2 = document.querySelector('#btn-volver2');
const btnVolver3 = document.querySelector('#btn-volver3');
// Abre el segundo menú
btnCategorias.addEventListener('click', (e) => {
  e.preventDefault();
  menu1.classList.add('translate-x-full', 'opacity-0');
  menu2.classList.remove('translate-x-full', 'opacity-0');
  menu2.classList.add('translate-x-0', 'opacity-100');
});

btnPerfumeria.addEventListener('click', (e) => {
  e.preventDefault();
  menu1.classList.add('translate-x-full', 'opacity-0');
  menu3.classList.remove('translate-x-full', 'opacity-0');
  menu3.classList.add('translate-x-0', 'opacity-100');
});

btnProductos.addEventListener('click', (e) => {
  e.preventDefault();
  menu1.classList.add('translate-x-full', 'opacity-0');
  menu4.classList.remove('translate-x-full', 'opacity-0');
  menu4.classList.add('translate-x-0', 'opacity-100');
});


// Vuelve al primer menú
btnVolver1.addEventListener('click', (e) => {
  e.preventDefault();
  menu2.classList.add('translate-x-full', 'opacity-0');
  menu1.classList.remove('translate-x-full', 'opacity-0');
  menu1.classList.add('translate-x-0', 'opacity-100');
});

btnVolver2.addEventListener('click', (e) => {
  e.preventDefault();
  menu3.classList.add('translate-x-full', 'opacity-0');
  menu1.classList.remove('translate-x-full', 'opacity-0');
  menu1.classList.add('translate-x-0', 'opacity-100');
});
btnVolver3.addEventListener('click', (e) => {
  e.preventDefault();
  menu4.classList.add('translate-x-full', 'opacity-0');
  menu1.classList.remove('translate-x-full', 'opacity-0');
  menu1.classList.add('translate-x-0', 'opacity-100');
});
