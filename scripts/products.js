document.addEventListener('DOMContentLoaded', function() {
  const productsGrid = document.querySelector('.products-grid');
  
  // Fetch product data
  fetch('api/products.json')
    .then(response => response.json())
    .then(data => {
      if (!data.products || data.products.length === 0) {
        productsGrid.innerHTML = '<p class="text-gray-500 col-span-full">No products available</p>';
        return;
      }

      // Generate product cards
      data.products.forEach(product => {
        const discountPrice = product.discount 
          ? (product.price * (100 - product.discount) / 100).toFixed(2)
          : null;

        const card = document.createElement('div');
        card.className = 'bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow';
        card.innerHTML = `
          <div class="relative">
            <img src="${product.images[0]}" 
                 alt="${product.name}" 
                 class="w-full h-64 object-cover"
                 onerror="this.src='https://via.placeholder.com/300'">
            ${product.soldOut ? 
              '<span class="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">Sold Out</span>' : ''}
          </div>
          <div class="p-4">
            <h3 class="font-semibold text-lg mb-1 truncate">${product.name}</h3>
            <div class="flex items-center mb-2">
              ${Array.from({length: 5}, (_, i) => 
                `<i class="fas fa-star ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}"></i>`
              ).join('')}
              <span class="text-gray-500 text-sm ml-1">(${product.rating})</span>
            </div>
            <div class="flex items-center">
              ${discountPrice ? 
                `<span class="text-gray-500 line-through mr-2">$${product.price}</span>
                 <span class="text-red-500 font-bold">$${discountPrice}</span>` : 
                `<span class="font-bold">$${product.price}</span>`}
            </div>
            <button class="mt-3 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition-colors ${product.soldOut ? 'opacity-50 cursor-not-allowed' : ''}"
                    ${product.soldOut ? 'disabled' : ''}>
              ${product.soldOut ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
        `;
        productsGrid.appendChild(card);
      });
    })
    .catch(error => {
      console.error('Error loading products:', error);
      productsGrid.innerHTML = '<p class="text-red-500 col-span-full">Error loading products. Please try again later.</p>';
    });
});