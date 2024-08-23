document.addEventListener('DOMContentLoaded', () => {
    // Fetch products and display them on the product page
    if (document.getElementById('products')) {
      fetch('https://fakestoreapi.com/products')
        .then(response => response.json())
        .then(data => {
          const productsContainer = document.getElementById('products');
          productsContainer.innerHTML = data.map(product => `
            <div class="product">
              <img src="${product.image}" alt="${product.title}">
              <h2>${product.title}</h2>
              <p class="product-description">${product.description.length > 100 ? product.description.slice(0, 100) + '...' : product.description}</p>
              <p>$${product.price}</p>
              <button class="product-button" onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
          `).join('');
        })
        .catch(error => console.error('Error fetching products:', error));
    }
  
    // Display cart items on the cart page
    if (document.getElementById('cart')) {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      if (cart.length === 0) {
        document.getElementById('cart').innerHTML = '<p>Your cart is empty.</p>';
      } else {
        fetch('https://fakestoreapi.com/products')
          .then(response => response.json())
          .then(products => {
            const cartContainer = document.getElementById('cart');
            cartContainer.innerHTML = cart.map(item => {
              const product = products.find(p => p.id === item.id);
              if (product) {
                return `
                  <div class="cart-item" id="item-${product.id}">
                    <img src="${product.image}" alt="${product.title}">
                    <h2>${product.title}</h2>
                    <p class="product-description">${product.description.length > 100 ? product.description.slice(0, 100) + '...' : product.description}</p>
                    <p>$<span id="price-${product.id}">${item.price || product.price}</span></p>
                    <button class="edit" onclick="showEditForm(${product.id})">Edit</button>
                    <button class="delete" onclick="deleteItem(${product.id})">Delete</button>
                  </div>
                `;
              }
              return '';
            }).join('');
          })
          .catch(error => console.error('Error fetching products:', error));
      }
    }
  
    // Add to Cart functionality
    window.addToCart = (productId) => {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      if (!cart.some(item => item.id === productId)) {
        cart.push({ id: productId, price: 0 }); // Default price
        localStorage.setItem('cart', JSON.stringify(cart));
        alert('Item added to cart!');
      } else {
        alert('Item is already in the cart.');
      }
    };
  
    // Show edit form
    window.showEditForm = (productId) => {
      const productPrice = document.querySelector(`#price-${productId}`).textContent;
      const formHtml = `
        <div class="edit-form">
          <h3>Edit Product Price</h3>
          <label for="new-price">New Price:</label>
          <input type="number" id="new-price" value="${productPrice}" step="0.01" min="0">
          <button onclick="updatePrice(${productId})">Update Price</button>
          <button onclick="hideEditForm()">Cancel</button>
        </div>
      `;
      const formContainer = document.getElementById('edit-form');
      formContainer.innerHTML = formHtml;
      formContainer.style.display = 'block';
    };
  
    // Update product price
    window.updatePrice = (productId) => {
      const newPrice = parseFloat(document.getElementById('new-price').value);
      if (isNaN(newPrice) || newPrice <= 0) {
        alert('Please enter a valid price.');
        return;
      }
  
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      const updatedCart = cart.map(item => item.id === productId ? { id: item.id, price: newPrice } : item);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      hideEditForm();
      location.reload();
    };
  
    // Hide edit form
    window.hideEditForm = () => {
      document.getElementById('edit-form').style.display = 'none';
    };
  
    // Delete item from cart
    window.deleteItem = (productId) => {
      let cart = JSON.parse(localStorage.getItem('cart')) || [];
      cart = cart.filter(item => item.id !== productId);
      localStorage.setItem('cart', JSON.stringify(cart));
      location.reload();
    };
  });
  