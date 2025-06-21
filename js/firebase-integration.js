// Firebase Configuration and Initialization
const firebaseConfig = {
  // Your Firebase configuration will go here
  // Replace with your actual Firebase project configuration
  apiKey: "AIzaSyC-G1rhKKGLDbN2dFF1vbcUVUxumnSC5Lo",
  authDomain: "dr-furniture-pacific.firebaseapp.com",
  projectId: "dr-furniture-pacific",
  storageBucket: "dr-furniture-pacific.firebasestorage.app",
  messagingSenderId: "1076749004365",
  appId: "1:1076749004365:web:c50148abae9ce2904bb604",
  measurementId: "G-FDKC573E1J"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Collection reference
const furnitureCollection = db.collection('furnitureItems');

// ===== HOME PAGE FUNCTIONS =====

// Load featured products on the home page
function loadFeaturedProducts() {
  const productSection = document.getElementById('product-list'); // Target the new div
  
  // Check if we're on the home page and the product section exists
  if (!productSection || !window.location.pathname.includes('index')) return;
  
  console.log('loadFeaturedProducts called'); // Add this line

  // Clear any static content
  productSection.innerHTML = '';
  
  // Get featured furniture items (limit to 3)
  furnitureCollection.where('featured', '==', true).limit(3).get()
    .then(snapshot => {
      if (snapshot.empty) {
        console.log('No featured furniture items found in Firebase.');
        return;
      }
      console.log(`Found ${snapshot.size} featured furniture items.`);
      
      let count = 0;
      snapshot.forEach(doc => {
        if (count < 4) {
          const item = doc.data();
          const furnitureHTML = createFurnitureItemHTML(doc.id, item);
          productSection.innerHTML += furnitureHTML;
          count++;
        }
      });
    })
    .catch(error => {
      console.error('Error getting featured furniture from Firebase:', error);
    });
}

// Load popular products
function loadPopularProducts() {
  const popularSection = document.querySelector('.popular-product .row');
  
  // Check if we're on the home page and the popular section exists
  if (!popularSection || !window.location.pathname.includes('index')) return;
  
  // Get popular furniture items (limit to 3)
  furnitureCollection.orderBy('views', 'desc').limit(3).get()
    .then(snapshot => {
      if (snapshot.empty) {
        console.log('No popular furniture items found');
        return;
      }
      
      snapshot.forEach(doc => {
        const item = doc.data();
        const popularHTML = `
          <div class="col-12 col-md-4 col-lg-4 mb-5 mb-md-0">
            <a class="product-item" href="#">
              <img src="${item.imageUrl}" class="img-fluid product-thumbnail">
              <h3 class="product-title">${item.name}</h3>
              <strong class="product-price">Ksh${item.price.toFixed(2)}</strong>
              <span class="icon-cross add-to-cart-btn" data-id="${doc.id}" data-name="${item.name}" data-price="${item.price}" data-image="${item.imageUrl}">
                <img src="images/cross.svg" class="img-fluid">
              </span>
            </a>
          </div>
        `;
        popularSection.innerHTML += popularHTML;
      });
    })
    .catch(error => {
      console.error('Error getting popular furniture:', error);
    });
}

// ===== SHOP PAGE FUNCTIONS =====

// Load all products on the shop page
function loadShopProducts() {
  const furnitureContainer = document.getElementById('furnitureContainer');
  const loadingIndicator = document.getElementById('loadingIndicator');
  const noResultsMessage = document.getElementById('noResultsMessage');
  
  // Check if we're on the shop page and the container exists
  if (!furnitureContainer) return;
  
  // Show loading indicator
  if (loadingIndicator) loadingIndicator.style.display = 'block';
  if (noResultsMessage) noResultsMessage.style.display = 'none';
  
  // Clear existing content to prevent duplication
  furnitureContainer.innerHTML = '';

  // Get all furniture items, ordered by timestamp descending
  furnitureCollection.orderBy('timestamp', 'desc').get()
    .then(snapshot => {
      // Hide loading indicator
      if (loadingIndicator) loadingIndicator.style.display = 'none';
      
      if (snapshot.empty) {
        if (noResultsMessage) noResultsMessage.style.display = 'block';
        return;
      }
      
      // Create a document fragment to improve performance
      const fragment = document.createDocumentFragment();
      
      snapshot.forEach(doc => {
        const item = doc.data();
        const col = document.createElement('div');
        col.className = 'col-12 col-md-4 col-lg-3 mb-5';
        col.innerHTML = `
          <a class="product-item" href="#">
            <img src="${item.imageUrl}" class="img-fluid product-thumbnail">
            <h3 class="product-title">${item.name}</h3>
            <strong class="product-price">Ksh${item.price.toFixed(2)}</strong>
            <span class="icon-cross add-to-cart-btn" data-id="${doc.id}" data-name="${item.name}" data-price="${item.price}" data-image="${item.imageUrl}">
              <img src="images/cross.svg" class="img-fluid">
            </span>
          </a>
        `;
        fragment.appendChild(col);
      });
      
      // Append all items at once
      furnitureContainer.appendChild(fragment);
    })
    .catch(error => {
      console.error('Error getting furniture items:', error);
      if (loadingIndicator) loadingIndicator.style.display = 'none';
    });
}

// Get filtered furniture items
function getFilteredFurniture(category, priceRange, searchTerm) {
  const furnitureContainer = document.getElementById('furnitureContainer');
  const loadingIndicator = document.getElementById('loadingIndicator');
  const noResultsMessage = document.getElementById('noResultsMessage');
  
  // Clear existing content
  furnitureContainer.innerHTML = '';
  
  // Start with the base query
  let query = furnitureCollection;
  
  // Apply category filter
  if (category && category !== 'all') {
    query = query.where('category', '==', category);
  }
  
  // Get the query results
  query.get()
    .then(snapshot => {
      // Hide loading indicator
      if (loadingIndicator) loadingIndicator.style.display = 'none';
      
      if (snapshot.empty) {
        if (noResultsMessage) noResultsMessage.style.display = 'block';
        return;
      }
      
      // Filter results client-side for price and search term
      let filteredItems = [];
      
      snapshot.forEach(doc => {
        const item = doc.data();
        let matchesPrice = true;
        let matchesSearch = true;
        
        // Apply price filter
        if (priceRange && priceRange !== 'all') {
          const price = item.price;
          if (priceRange === '0-2500' && (price < 0 || price > 2500)) matchesPrice = false;
          else if (priceRange === '2500-10000' && (price < 2500 || price > 10000)) matchesPrice = false;
          else if (priceRange === '15000-20000' && (price < 15000 || price > 20000)) matchesPrice = false;
          else if (priceRange === '20000+' && price < 20000) matchesPrice = false;
        }
        
        // Apply search filter
        if (searchTerm) {
          const nameMatch = item.name.toLowerCase().includes(searchTerm);
          const descMatch = item.description && item.description.toLowerCase().includes(searchTerm);
          const categoryMatch = item.category.toLowerCase().includes(searchTerm);
          
          matchesSearch = nameMatch || descMatch || categoryMatch;
        }
        
        // Add to filtered items if it matches all criteria
        if (matchesPrice && matchesSearch) {
          filteredItems.push({ id: doc.id, ...item });
        }
      });
      
      // Display filtered items or show no results message
      if (filteredItems.length === 0) {
        if (noResultsMessage) noResultsMessage.style.display = 'block';
      } else {
        // Create a document fragment to improve performance
        const fragment = document.createDocumentFragment();
        
        filteredItems.forEach(item => {
          const col = document.createElement('div');
          col.className = 'col-12 col-md-4 col-lg-3 mb-5';
          col.innerHTML = `
            <a class="product-item" href="#">
              <img src="${item.imageUrl}" class="img-fluid product-thumbnail">
              <h3 class="product-title">${item.name}</h3>
              <strong class="product-price">Ksh${item.price.toFixed(2)}</strong>
              <span class="icon-cross add-to-cart-btn" data-id="${doc.id}" data-name="${item.name}" data-price="${item.price}" data-image="${item.imageUrl}">
                <img src="images/cross.svg" class="img-fluid">
              </span>
            </a>
          `;
          fragment.appendChild(col);
        });
        
        // Append all items at once
        furnitureContainer.appendChild(fragment);
      }
    })
    .catch(error => {
      console.error('Error getting filtered furniture:', error);
      if (loadingIndicator) loadingIndicator.style.display = 'none';
    });
}

// Load categories for filter dropdown
function loadCategories() {
  const categoryFilter = document.getElementById('categoryFilter');
  
  // Check if we're on the shop page and the filter exists
  if (!categoryFilter) return;
  
  // Get unique categories from furniture items
  furnitureCollection.get()
    .then(snapshot => {
      if (snapshot.empty) return;
      
      const categories = new Set();
      
      snapshot.forEach(doc => {
        const item = doc.data();
        if (item.category) categories.add(item.category);
      });
      
      // Add categories to dropdown
      categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
      });
    })
    .catch(error => {
      console.error('Error getting categories:', error);
    });
}

// ===== CART PAGE FUNCTIONS =====

// Load single product details on the cart page
function loadProductDetails() {
  // Check if we're on the cart page
  if (!window.location.pathname.includes('cart')) return;
  
  // Get product ID from URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');
  
  if (!productId) return;
  
  // Get product details
  furnitureCollection.doc(productId).get()
    .then(doc => {
      if (!doc.exists) {
        console.log('No such product!');
        return;
      }
      
      const item = doc.data();
      
      // Update product details on the page
      const productImage = document.querySelector('.product-thumbnail');
      const productTitle = document.querySelector('.product-title');
      const productPrice = document.querySelector('.product-price');
      const productDescription = document.querySelector('.product-description');
      
      if (productImage) productImage.src = item.imageUrl;
      if (productTitle) productTitle.textContent = item.name;
      if (productPrice) productPrice.textContent = `Ksh${item.price.toFixed(2)}`;
      if (productDescription) productDescription.textContent = item.description;
      
      // Increment view count
      furnitureCollection.doc(productId).update({
        views: firebase.firestore.FieldValue.increment(1)
      }).catch(error => {
        console.error('Error updating view count:', error);
      });
    })
    .catch(error => {
      console.error('Error getting product details:', error);
    });
}

// Create HTML for a single furniture item
function createFurnitureItemHTML(id, item) {
  return `
    <div class="col-12 col-md-4 col-lg-3 mb-5">
      <a class="product-item" href="#">
        <img src="${item.imageUrl}" class="img-fluid product-thumbnail">
        <h3 class="product-title">${item.name}</h3>
        <strong class="product-price">Ksh${item.price.toFixed(2)}</strong>
        <span class="icon-cross add-to-cart-btn" data-id="${id}" data-name="${item.name}" data-price="${item.price}" data-image="${item.imageUrl}">
          <img src="images/cross.svg" class="img-fluid">
        </span>
      </a>
    </div>
  `;
}

// Initialize functions based on current page
document.addEventListener('DOMContentLoaded', () => {
  // Determine which page we're on
  const currentPath = window.location.pathname;

  if (currentPath.includes('index.html')) {
    // Home page
    loadFeaturedProducts();
    loadPopularProducts();
  } else if (currentPath.includes('shop-firebase.html')) {
    // Shop page
    loadShopProducts();
  } else if (currentPath.includes('cart.html')) {
    // Cart/product detail page
    loadProductDetails();
  }

  // Add event listener for "Add to Cart" buttons using event delegation
  document.body.addEventListener('click', (event) => {
    if (event.target.closest('.add-to-cart-btn')) {
      const button = event.target.closest('.add-to-cart-btn');
      const product = {
        id: button.dataset.id,
        name: button.dataset.name,
        price: parseFloat(button.dataset.price),
        imageUrl: button.dataset.image
      };
      if (window.addToCart) {
        window.addToCart(product);
        alert(`${product.name} added to cart!`);
      } else {
        console.error('addToCart function not found. Make sure cart.js is loaded.');
      }
    }
  });
});