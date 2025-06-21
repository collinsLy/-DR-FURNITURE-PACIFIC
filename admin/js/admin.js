// DOM Elements
const loginScreen = document.getElementById('login-screen');
const adminDashboard = document.getElementById('admin-dashboard');
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const logoutBtn = document.getElementById('logout-btn');
const mobileLogoutBtn = document.getElementById('mobile-logout-btn');
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
const closeMobileMenu = document.getElementById('close-mobile-menu');
const adminEmail = document.getElementById('admin-email');
const pageTitle = document.getElementById('page-title');

// Page elements
const dashboardPage = document.getElementById('dashboard-page');
const furnitureListPage = document.getElementById('furniture-list-page');
const addFurniturePage = document.getElementById('add-furniture-page');
const editFurniturePage = document.getElementById('edit-furniture-page');
const inquiryMessagesPage = document.getElementById('inquiry-messages-page');

// Dashboard elements
const totalFurniture = document.getElementById('total-furniture');
const totalCategories = document.getElementById('total-categories');
const latestUpdate = document.getElementById('latest-update');
const recentFurniture = document.getElementById('recent-furniture');

// Furniture list elements
const furnitureTableBody = document.getElementById('furniture-table-body');

// Forms
const addFurnitureForm = document.getElementById('add-furniture-form');
const editFurnitureForm = document.getElementById('edit-furniture-form');

// Edit furniture elements
const editFurnitureId = document.getElementById('edit-furniture-id');
const editFurnitureName = document.getElementById('edit-furniture-name');
const editFurnitureCategory = document.getElementById('edit-furniture-category');
const editFurniturePrice = document.getElementById('edit-furniture-price');
const editFurnitureImage = document.getElementById('edit-furniture-image');
const editFurnitureDescription = document.getElementById('edit-furniture-description');
const editFurniturePreview = document.getElementById('edit-furniture-preview');
const deleteFurnitureBtn = document.getElementById('delete-furniture-btn');
const cancelEditBtn = document.getElementById('cancel-edit-btn');

// Delete modal
const deleteModal = document.getElementById('delete-modal');
const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
const cancelDeleteBtn = document.getElementById('cancel-delete-btn');

// Notification
const notification = document.getElementById('notification');
const notificationMessage = document.getElementById('notification-message');

// Current furniture ID to delete
let currentDeleteId = null;

// Authentication state observer
auth.onAuthStateChanged(user => {
  if (user) {
    // User is signed in
    loginScreen.classList.add('hidden');
    adminDashboard.classList.remove('hidden');
    adminEmail.textContent = user.email;
    
    // Create inquiry messages page if it doesn't exist
    createInquiryMessagesPage();
    
    // Load dashboard by default
    navigateTo('dashboard');
  } else {
    // User is signed out
    loginScreen.classList.remove('hidden');
    adminDashboard.classList.add('hidden');
    loginForm.reset();
  }
});

// Login form submission
loginForm.addEventListener('submit', e => {
  e.preventDefault();

  const email = document.getElementById('email-address').value;
  const password = document.getElementById('password').value;

  loginError.classList.add('hidden');

  auth.signInWithEmailAndPassword(email, password)
    .catch(error => {
      loginError.textContent = error.message;
      loginError.classList.remove('hidden');
    });
});

// Logout
logoutBtn.addEventListener('click', e => {
  e.preventDefault();
  auth.signOut();
});

mobileLogoutBtn.addEventListener('click', e => {
  e.preventDefault();
  auth.signOut();
});

// Mobile menu toggle
mobileMenuButton.addEventListener('click', () => {
  mobileMenu.classList.remove('hidden');
});

closeMobileMenu.addEventListener('click', () => {
  mobileMenu.classList.add('hidden');
});

// Navigation
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const page = link.getAttribute('data-page');
    navigateTo(page);
  });
});

const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
mobileNavLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const page = link.getAttribute('data-page');
    navigateTo(page);
    mobileMenu.classList.add('hidden');
  });
});

// Navigation function
function navigateTo(page) {
  // Hide all pages
  const allPages = document.querySelectorAll('.page-content');
  allPages.forEach(p => p.classList.add('hidden'));

  // Update page title
  const pageTitles = {
    'dashboard': 'Dashboard',
    'furniture-list': 'Furniture List',
    'add-furniture': 'Add Furniture',
    'edit-furniture': 'Edit Furniture',
    'inquiry-messages': 'Inquiry Messages'
  };

  if (pageTitle) {
    pageTitle.textContent = pageTitles[page] || 'Dashboard';
  }

  // Show selected page
  switch(page) {
    case 'dashboard':
      if (dashboardPage) {
        dashboardPage.classList.remove('hidden');
        loadDashboard();
      }
      break;
    case 'furniture-list':
      if (furnitureListPage) {
        furnitureListPage.classList.remove('hidden');
        loadFurnitureList();
      }
      break;
    case 'add-furniture':
      if (addFurniturePage) {
        addFurniturePage.classList.remove('hidden');
      }
      break;
    case 'edit-furniture':
      if (editFurniturePage) {
        editFurniturePage.classList.remove('hidden');
      }
      break;
    case 'inquiry-messages':
      if (inquiryMessagesPage) {
        inquiryMessagesPage.classList.remove('hidden');
        loadInquiryMessages();
      }
      break;
  }
}

// Create inquiry messages page if it doesn't exist
function createInquiryMessagesPage() {
  if (!inquiryMessagesPage) {
    const mainContent = document.querySelector('main');
    if (mainContent) {
      const inquiryDiv = document.createElement('div');
      inquiryDiv.id = 'inquiry-messages-page';
      inquiryDiv.className = 'page-content hidden';
      inquiryDiv.innerHTML = `
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 class="text-lg font-medium text-gray-900">Inquiry Messages</h2>
            <button id="refresh-messages" class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <i class="fas fa-sync-alt mr-2"></i> Refresh
            </button>
          </div>
          <div class="p-6">
            <div id="inquiryMessagesContainer" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <!-- Inquiry messages will be loaded here -->
              <div class="text-center text-gray-500 py-4">Loading messages...</div>
            </div>
          </div>
        </div>
      `;
      mainContent.appendChild(inquiryDiv);
      
      // Update global reference
      window.inquiryMessagesPage = inquiryDiv;
      
      // Add refresh button event listener
      const refreshBtn = inquiryDiv.querySelector('#refresh-messages');
      if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
          loadInquiryMessages();
          showNotification('Messages refreshed');
        });
      }
    }
  }
}

// Load dashboard data
function loadDashboard() {
  // Get total furniture count
  db.collection('furnitureItems').get().then(snapshot => {
    totalFurniture.textContent = snapshot.size;

    // Get recent furniture items (limit to 3)
    db.collection('furnitureItems')
      .orderBy('timestamp', 'desc')
      .limit(3)
      .get()
      .then(snapshot => {
        if (snapshot.empty) {
          recentFurniture.innerHTML = '<div class="text-center text-gray-500 py-4">No furniture items found</div>';
          return;
        }

        recentFurniture.innerHTML = '';
        snapshot.forEach(doc => {
          const furniture = doc.data();
          const date = furniture.timestamp ? furniture.timestamp.toDate() : new Date();
          const formattedDate = date.toLocaleDateString();

          recentFurniture.innerHTML += `
            <div class="bg-white rounded-lg shadow overflow-hidden">
              <img src="${furniture.imageUrl}" alt="${furniture.name}" class="w-full h-48 object-cover">
              <div class="p-4">
                <h3 class="text-lg font-medium text-gray-900">${furniture.name}</h3>
                <p class="text-sm text-gray-500">${furniture.category}</p>
                <p class="text-lg font-bold text-indigo-600 mt-2">Ksh${furniture.price}</p>
                <p class="text-xs text-gray-400 mt-2">Added on ${formattedDate}</p>
              </div>
            </div>
          `;
        });
      });

    // Get latest update timestamp
    db.collection('furnitureItems')
      .orderBy('timestamp', 'desc')
      .limit(1)
      .get()
      .then(snapshot => {
        if (!snapshot.empty) {
          const latestItem = snapshot.docs[0].data();
          const date = latestItem.timestamp ? latestItem.timestamp.toDate() : new Date();
          latestUpdate.textContent = date.toLocaleDateString();
        }
      });
  });

  // Get unique categories count
  db.collection('furnitureItems').get().then(snapshot => {
    const categories = new Set();
    snapshot.forEach(doc => {
      const furniture = doc.data();
      if (furniture.category) {
        categories.add(furniture.category);
      }
    });
    totalCategories.textContent = categories.size;
  });
}

// Load furniture list
function loadFurnitureList() {
  furnitureTableBody.innerHTML = '<tr><td colspan="5" class="text-center text-gray-500 py-4">Loading furniture items...</td></tr>';

  db.collection('furnitureItems')
    .orderBy('timestamp', 'desc')
    .get()
    .then(snapshot => {
      if (snapshot.empty) {
        furnitureTableBody.innerHTML = '<tr><td colspan="5" class="text-center text-gray-500 py-4">No furniture items found</td></tr>';
        return;
      }

      furnitureTableBody.innerHTML = '';
      snapshot.forEach(doc => {
        const furniture = doc.data();
        const id = doc.id;

        furnitureTableBody.innerHTML += `
          <tr>
            <td class="px-6 py-4 whitespace-nowrap">
              <img src="${furniture.imageUrl}" alt="${furniture.name}" class="h-16 w-16 object-cover rounded-md">
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">${furniture.name}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-500">${furniture.category}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">Ksh${furniture.price}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button class="text-indigo-600 hover:text-indigo-900 mr-3 edit-btn" data-id="${id}">
                <i class="fas fa-edit"></i> Edit
              </button>
              <button class="text-red-600 hover:text-red-900 delete-btn" data-id="${id}">
                <i class="fas fa-trash-alt"></i> Delete
              </button>
            </td>
          </tr>
        `;
      });

      // Add event listeners to edit and delete buttons
      document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-id');
          loadFurnitureForEdit(id);
        });
      });

      document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-id');
          showDeleteModal(id);
        });
      });
    });
}

// Load furniture for editing
function loadFurnitureForEdit(id) {
  db.collection('furnitureItems').doc(id).get().then(doc => {
    if (doc.exists) {
      const furniture = doc.data();

      editFurnitureId.value = id;
      editFurnitureName.value = furniture.name;
      editFurnitureCategory.value = furniture.category;
      editFurniturePrice.value = furniture.price;
      editFurnitureImage.value = furniture.imageUrl;
      editFurnitureDescription.value = furniture.description;
      document.getElementById('edit-furniture-featured').checked = furniture.featured || false;
      editFurniturePreview.src = furniture.imageUrl;

      navigateTo('edit-furniture');
    } else {
      showNotification('Furniture item not found', 'error');
    }
  });
}

// Add furniture form submission
addFurnitureForm.addEventListener('submit', e => {
  e.preventDefault();

  const name = document.getElementById('furniture-name').value;
  const category = document.getElementById('furniture-category').value;
  const price = parseFloat(document.getElementById('furniture-price').value);
  const imageUrl = document.getElementById('furniture-image').value;
  const description = document.getElementById('furniture-description').value;
  const featured = document.getElementById('furniture-featured').checked;

  db.collection('furnitureItems').add({
    name,
    category,
    price,
    imageUrl,
    description,
    featured,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  })
  .then(() => {
    addFurnitureForm.reset();
    showNotification('Furniture added successfully');
    navigateTo('furniture-list');
  })
  .catch(error => {
    showNotification('Error adding furniture: ' + error.message, 'error');
  });
});

// Edit furniture form submission
editFurnitureForm.addEventListener('submit', e => {
  e.preventDefault();

  const id = editFurnitureId.value;
  const name = editFurnitureName.value;
  const category = editFurnitureCategory.value;
  const price = parseFloat(editFurniturePrice.value);
  const imageUrl = editFurnitureImage.value;
  const description = editFurnitureDescription.value;
  const featured = document.getElementById('edit-furniture-featured').checked;

  db.collection('furnitureItems').doc(id).update({
    name,
    category,
    price,
    imageUrl,
    description,
    featured,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  })
  .then(() => {
    showNotification('Furniture updated successfully');
    navigateTo('furniture-list');
  })
  .catch(error => {
    showNotification('Error updating furniture: ' + error.message, 'error');
  });
});

// Cancel edit button
cancelEditBtn.addEventListener('click', () => {
  navigateTo('furniture-list');
});

// Delete furniture button
deleteFurnitureBtn.addEventListener('click', () => {
  const id = editFurnitureId.value;
  showDeleteModal(id);
});

// Show delete confirmation modal
function showDeleteModal(id) {
  currentDeleteId = id;
  deleteModal.classList.remove('hidden');
}

// Confirm delete button
confirmDeleteBtn.addEventListener('click', () => {
  if (currentDeleteId) {
    db.collection('furnitureItems').doc(currentDeleteId).delete()
      .then(() => {
        deleteModal.classList.add('hidden');
        showNotification('Furniture deleted successfully');
        navigateTo('furniture-list');
      })
      .catch(error => {
        deleteModal.classList.add('hidden');
        showNotification('Error deleting furniture: ' + error.message, 'error');
      });
  }
});

// Cancel delete button
cancelDeleteBtn.addEventListener('click', () => {
  deleteModal.classList.add('hidden');
  currentDeleteId = null;
});

// Show notification
function showNotification(message, type = 'success') {
  notificationMessage.textContent = message;

  if (type === 'error') {
    notification.classList.remove('bg-green-500');
    notification.classList.add('bg-red-500');
  } else {
    notification.classList.remove('bg-red-500');
    notification.classList.add('bg-green-500');
  }

  notification.classList.remove('opacity-0', 'translate-y-[-20px]');
  notification.classList.add('opacity-100', 'translate-y-0');

  setTimeout(() => {
    notification.classList.remove('opacity-100', 'translate-y-0');
    notification.classList.add('opacity-0', 'translate-y-[-20px]');
  }, 3000);
}

// Load inquiry messages
function loadInquiryMessages() {
  const inquiryMessagesContainer = document.getElementById('inquiryMessagesContainer');
  if (!inquiryMessagesContainer) return;

  inquiryMessagesContainer.innerHTML = '<div class="text-center text-gray-500 py-4">Loading messages...</div>';

  db.collection('inquiryMessages').orderBy('timestamp', 'desc').get()
    .then(snapshot => {
      if (snapshot.empty) {
        inquiryMessagesContainer.innerHTML = '<div class="text-center text-gray-500 py-4">No inquiry messages found.</div>';
        return;
      }

      inquiryMessagesContainer.innerHTML = '';
      snapshot.forEach(doc => {
        const message = doc.data();
        const date = message.timestamp ? message.timestamp.toDate() : new Date();
        const formattedDate = date.toLocaleString();

        const messageCard = document.createElement('div');
        messageCard.className = 'bg-white rounded-lg shadow overflow-hidden';
        messageCard.innerHTML = `
          <div class="p-6">
            <div class="flex justify-between items-start mb-4">
              <div>
                <h3 class="text-lg font-medium text-gray-900">${message.firstName || 'N/A'} ${message.lastName || ''}</h3>
                <p class="text-sm text-gray-500">${message.email || 'No email'}</p>
              </div>
              <button class="text-red-600 hover:text-red-900 delete-message" data-id="${doc.id}">
                <i class="fas fa-trash-alt"></i>
              </button>
            </div>
            <p class="text-gray-700 mb-4">${message.message || 'No message'}</p>
            <div class="text-xs text-gray-400">
              <i class="far fa-clock mr-1"></i> ${formattedDate}
            </div>
          </div>
        `;

        // Add delete functionality
        const deleteBtn = messageCard.querySelector('.delete-message');
        deleteBtn.addEventListener('click', () => deleteMessage(doc.id));

        inquiryMessagesContainer.appendChild(messageCard);
      });
    })
    .catch(error => {
      console.error("Error loading inquiry messages: ", error);
      inquiryMessagesContainer.innerHTML = 
        '<div class="text-center text-red-500 py-4">Error loading messages. Please try again.</div>';
    });
}

// Delete message function
function deleteMessage(messageId) {
  if (confirm('Are you sure you want to delete this message?')) {
    db.collection('inquiryMessages').doc(messageId).delete()
      .then(() => {
        showNotification('Message deleted successfully');
        loadInquiryMessages(); // Reload the messages
      })
      .catch(error => {
        console.error("Error deleting message: ", error);
        showNotification('Error deleting message', 'error');
      });
  }
}

// Update page references after DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Update global page references
  window.inquiryMessagesPage = document.getElementById('inquiry-messages-page');
  
  // Add refresh messages button event listener
  const refreshBtn = document.getElementById('refresh-messages');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      loadInquiryMessages();
      showNotification('Messages refreshed');
    });
  }
});