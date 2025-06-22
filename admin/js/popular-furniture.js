
// Firebase configuration and initialization
let db;
let furnitureCollection;

// Initialize Firebase
window.addEventListener('load', function() {
  if (typeof firebase !== 'undefined') {
    try {
      // Initialize Firebase with config from firebase-config.js
      firebase.initializeApp(firebaseConfig);
      db = firebase.firestore();
      furnitureCollection = db.collection('furnitureItems');
      
      // Check authentication
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          loadAllFurniture();
          loadCurrentPopularItems();
        } else {
          window.location.href = 'index.html';
        }
      });
    } catch (error) {
      console.error('Error initializing Firebase:', error);
    }
  }
});

// Load all furniture items for selection
function loadAllFurniture() {
  const furnitureGrid = document.getElementById('furnitureGrid');
  furnitureGrid.innerHTML = '<div class="text-center text-gray-500 py-4">Loading furniture items...</div>';

  furnitureCollection.get()
    .then(snapshot => {
      if (snapshot.empty) {
        furnitureGrid.innerHTML = '<div class="text-center text-gray-500 py-4">No furniture items found</div>';
        return;
      }

      furnitureGrid.innerHTML = '';
      snapshot.forEach(doc => {
        const furniture = doc.data();
        const id = doc.id;
        
        let mainMediaUrl = furniture.imageUrl || '';
        let isVideo = false;

        // Check for new media format
        if (furniture.mediaData && furniture.mediaData.length > 0) {
          mainMediaUrl = furniture.mediaData[0].url;
          isVideo = furniture.mediaData[0].type === 'video';
        } else if (furniture.images && furniture.images.length > 0) {
          mainMediaUrl = furniture.images[0];
        }

        const mediaElement = isVideo ? 
          `<video src="${mainMediaUrl}" class="w-full h-48 object-cover rounded-md" muted></video>` :
          `<img src="${mainMediaUrl}" alt="${furniture.name}" class="w-full h-48 object-cover rounded-md">`;

        const furnitureCard = `
          <div class="border rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer furniture-card ${furniture.isPopular ? 'ring-2 ring-indigo-500 bg-indigo-50' : ''}" 
               data-id="${id}" onclick="togglePopular('${id}', this)">
            ${mediaElement}
            <h3 class="font-semibold text-gray-900 mt-2">${furniture.name}</h3>
            <p class="text-gray-600">Ksh${furniture.price?.toFixed(2) || '0.00'}</p>
            <p class="text-sm text-gray-500 mt-1">${furniture.category || 'Uncategorized'}</p>
            <div class="mt-3">
              <span class="inline-block px-3 py-1 text-sm rounded-full ${furniture.isPopular ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-800'}">
                ${furniture.isPopular ? 'Popular' : 'Not Popular'}
              </span>
            </div>
          </div>
        `;
        
        furnitureGrid.innerHTML += furnitureCard;
      });
    })
    .catch(error => {
      console.error('Error loading furniture:', error);
      furnitureGrid.innerHTML = '<div class="text-center text-red-500 py-4">Error loading furniture items</div>';
    });
}

// Load current popular items
function loadCurrentPopularItems() {
  const currentPopularGrid = document.getElementById('currentPopularGrid');
  currentPopularGrid.innerHTML = '<div class="text-center text-gray-500 py-4">Loading current popular items...</div>';

  furnitureCollection.where('isPopular', '==', true).limit(3).get()
    .then(snapshot => {
      if (snapshot.empty) {
        currentPopularGrid.innerHTML = '<div class="text-center text-gray-500 py-4">No popular items selected</div>';
        return;
      }

      currentPopularGrid.innerHTML = '';
      snapshot.forEach(doc => {
        const furniture = doc.data();
        const id = doc.id;
        
        let mainMediaUrl = furniture.imageUrl || '';
        let isVideo = false;

        if (furniture.mediaData && furniture.mediaData.length > 0) {
          mainMediaUrl = furniture.mediaData[0].url;
          isVideo = furniture.mediaData[0].type === 'video';
        } else if (furniture.images && furniture.images.length > 0) {
          mainMediaUrl = furniture.images[0];
        }

        const mediaElement = isVideo ? 
          `<video src="${mainMediaUrl}" class="w-full h-48 object-cover rounded-md" muted></video>` :
          `<img src="${mainMediaUrl}" alt="${furniture.name}" class="w-full h-48 object-cover rounded-md">`;

        const popularCard = `
          <div class="border rounded-lg p-4 bg-indigo-50 border-indigo-200">
            ${mediaElement}
            <h3 class="font-semibold text-gray-900 mt-2">${furniture.name}</h3>
            <p class="text-gray-600">Ksh${furniture.price?.toFixed(2) || '0.00'}</p>
            <p class="text-sm text-gray-500 mt-1">${furniture.category || 'Uncategorized'}</p>
            <button onclick="removeFromPopular('${id}')" 
                    class="mt-3 w-full bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 text-sm">
              Remove from Popular
            </button>
          </div>
        `;
        
        currentPopularGrid.innerHTML += popularCard;
      });
    })
    .catch(error => {
      console.error('Error loading popular items:', error);
      currentPopularGrid.innerHTML = '<div class="text-center text-red-500 py-4">Error loading popular items</div>';
    });
}

// Toggle popular status
async function togglePopular(furnitureId, cardElement) {
  try {
    // First check how many popular items exist
    const popularSnapshot = await furnitureCollection.where('isPopular', '==', true).get();
    const currentFurniture = await furnitureCollection.doc(furnitureId).get();
    const isCurrentlyPopular = currentFurniture.data().isPopular;

    // If trying to add and already have 3 popular items
    if (!isCurrentlyPopular && popularSnapshot.size >= 3) {
      showNotification('Maximum 3 popular items allowed. Remove one first.', 'error');
      return;
    }

    // Toggle the popular status
    await furnitureCollection.doc(furnitureId).update({
      isPopular: !isCurrentlyPopular,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    // Refresh both grids
    loadAllFurniture();
    loadCurrentPopularItems();
    
    showNotification(!isCurrentlyPopular ? 'Added to popular items' : 'Removed from popular items');
  } catch (error) {
    console.error('Error updating popular status:', error);
    showNotification('Error updating popular status', 'error');
  }
}

// Remove from popular
async function removeFromPopular(furnitureId) {
  try {
    await furnitureCollection.doc(furnitureId).update({
      isPopular: false,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    loadAllFurniture();
    loadCurrentPopularItems();
    showNotification('Removed from popular items');
  } catch (error) {
    console.error('Error removing from popular:', error);
    showNotification('Error removing from popular items', 'error');
  }
}

// Show notification
function showNotification(message, type = 'success') {
  const notification = document.getElementById('notification');
  const messageElement = document.getElementById('notification-message');
  
  messageElement.textContent = message;
  
  // Set colors based on type
  if (type === 'error') {
    notification.className = notification.className.replace('bg-green-500', 'bg-red-500');
  } else {
    notification.className = notification.className.replace('bg-red-500', 'bg-green-500');
  }
  
  // Show notification
  notification.style.opacity = '1';
  notification.style.transform = 'translateY(0)';
  
  // Hide after 3 seconds
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateY(-20px)';
  }, 3000);
}
