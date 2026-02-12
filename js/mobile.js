const btn = document.getElementById('menu-btn');
const menu = document.getElementById('mobile-menu');
btn.addEventListener('click', () => menu.classList.toggle('hidden'));

// Navbar scroll effect
const navbar = document.getElementById('navbar');
const navLinks = navbar.querySelectorAll('nav a');
const logo = navbar.querySelector('a');
const menuBtn = document.getElementById('menu-btn');

window.addEventListener('scroll', function() {
  if (window.scrollY > 50) {
    // Scrolled - add background
    navbar.classList.remove('bg-transparent');
    navbar.classList.add('bg-white', 'shadow-lg');
    navbar.style.backgroundColor = '#0B4650';
    
    // Change text colors to light (since background is dark)
    logo.classList.remove('text-white');
    logo.classList.add('text-gray-800');
    
    navLinks.forEach(link => {
      link.classList.remove('text-white', 'hover:text-yellow-400');
      link.classList.add('text-white', 'hover:text-teal-600');
    });
    
    //menuBtn.classList.remove('text-white');
    //menuBtn.classList.add('text-gray-800');
  } else {
    // At top - transparent
    navbar.classList.remove('bg-white', 'shadow-lg');
    navbar.classList.add('bg-transparent');
    navbar.style.backgroundColor = ''; // Clear the inline style
    
    // Change text colors to white
    logo.classList.remove('text-gray-800');
    logo.classList.add('text-white');
    
    navLinks.forEach(link => {
      link.classList.remove('text-gray-800', 'hover:text-teal-600');
      link.classList.add('text-white', 'hover:text-yellow-400');
    });
    
    menuBtn.classList.remove('text-gray-800');
    menuBtn.classList.add('text-white');
  }
});