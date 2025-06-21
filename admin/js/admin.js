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
      editFurnitureDescription.value = furniture.description;
      document.getElementById('edit-furniture-featured').checked = furniture.featured || false;

      // Load media
      loadImagesForEdit(furniture);

      // Set preview based on media type
      setPreviewMedia(furniture);

      navigateTo('edit-furniture');
    } else {
      showNotification('Furniture item not found', 'error');
    }
  });
}

function loadImagesForEdit(furniture) {
  const container = document.getElementById('edit-image-inputs');
  container.innerHTML = '';

  // Handle new media format if available
  if (furniture.mediaData && furniture.mediaData.length > 0) {
    furniture.mediaData.forEach((media, index) => {
      if (media.url && media.url.trim()) {
        const inputGroup = document.createElement('div');
        inputGroup.className = 'image-input-group mb-2 flex';

        if (index === 0) {
          inputGroup.innerHTML = `
            <input type="url" name="imageUrl" placeholder="Main image/video URL" required value="${media.url}" class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
            <select name="mediaType" class="ml-2 mt-1 block w-32 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
              <option value="image" ${media.type === 'image' ? 'selected' : ''}>Image</option>
              <option value="video" ${media.type === 'video' ? 'selected' : ''}>Video</option>
            </select>
          `;
        } else {
          inputGroup.innerHTML = `
            <input type="url" name="imageUrl" placeholder="Additional image/video URL" value="${media.url}" class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
            <select name="mediaType" class="ml-2 mt-1 block w-32 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
              <option value="image" ${media.type === 'image' ? 'selected' : ''}>Image</option>
              <option value="video" ${media.type === 'video' ? 'selected' : ''}>Video</option>
            </select>
            <button type="button" class="ml-2 text-red-600 hover:text-red-900 remove-image-btn" onclick="removeImageInput(this)">
              <i class="fas fa-trash-alt"></i>
            </button>
          `;
        }

        container.appendChild(inputGroup);
      }
    });
  } else {
    // Handle legacy format - treat as images
    const images = furniture.images || [furniture.imageUrl];
    images.forEach((imageUrl, index) => {
      if (imageUrl && imageUrl.trim()) {
        const inputGroup = document.createElement('div');
        inputGroup.className = 'image-input-group mb-2 flex';

        if (index === 0) {
          inputGroup.innerHTML = `
            <input type="url" name="imageUrl" placeholder="Main image/video URL" required value="${imageUrl}" class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
            <select name="mediaType" class="ml-2 mt-1 block w-32 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
              <option value="image" selected>Image</option>
              <option value="video">Video</option>
            </select>
          `;
        } else {
          inputGroup.innerHTML = `
            <input type="url" name="imageUrl" placeholder="Additional image/video URL" value="${imageUrl}" class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
            <select name="mediaType" class="ml-2 mt-1 block w-32 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
              <option value="image" selected>Image</option>
              <option value="video">Video</option>
            </select>
            <button type="button" class="ml-2 text-red-600 hover:text-red-900 remove-image-btn" onclick="removeImageInput(this)">
              <i class="fas fa-trash-alt"></i>
            </button>
          `;
        }

        container.appendChild(inputGroup);
      }
    });
  }

  // Ensure at least one input exists
  if (container.children.length === 0) {
    resetImageInputs('edit-image-inputs');
  }
}

// Add multiple image input functionality
document.addEventListener('DOMContentLoaded', () => {
  // Add image input for add form
  document.getElementById('add-image-btn').addEventListener('click', () => {
    addImageInput('image-inputs');
  });

  // Add image input for edit form
  document.getElementById('edit-add-image-btn').addEventListener('click', () => {
    addImageInput('edit-image-inputs');
  });
});

function addImageInput(containerId) {
  const container = document.getElementById(containerId);
  const inputGroup = document.createElement('div');
  inputGroup.className = 'image-input-group mb-2 flex';
  inputGroup.innerHTML = `
    <input type="url" name="imageUrl" placeholder="Additional image/video URL" class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
    <select name="mediaType" class="ml-2 mt-1 block w-32 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
      <option value="image">Image</option>
      <option value="video">Video</option>
    </select>
    <button type="button" class="ml-2 text-red-600 hover:text-red-900 remove-image-btn" onclick="removeImageInput(this)">
      <i class="fas fa-trash-alt"></i>
    </button>
  `;
  container.appendChild(inputGroup);
}

function removeImageInput(button) {
  button.closest('.image-input-group').remove();
}

function collectImageUrls(containerId) {
  const container = document.getElementById(containerId);
  const inputGroups = container.querySelectorAll('.image-input-group');
  const mediaData = [];

  inputGroups.forEach(group => {
    const urlInput = group.querySelector('input[name="imageUrl"]');
    const typeSelect = group.querySelector('select[name="mediaType"]');

    if (urlInput && urlInput.value.trim()) {
      mediaData.push({
        url: urlInput.value.trim(),
        type: typeSelect ? typeSelect.value : 'image'
      });
    }
  });

  return mediaData;
}

// Add furniture form submission
addFurnitureForm.addEventListener('submit', e => {
  e.preventDefault();

  const name = document.getElementById('furniture-name').value;
  const category = document.getElementById('furniture-category').value;
  const price = parseFloat(document.getElementById('furniture-price').value);
  // Collect image URLs and types
    const imageInputs = document.querySelectorAll('#image-inputs input[name="imageUrl"]');
    const mediaTypeSelects = document.querySelectorAll('#image-inputs select[name="mediaType"]');

    const mediaData = [];
    const images = []; // Keep for backward compatibility

    imageInputs.forEach((input, index) => {
      if (input.value.trim()) {
        const mediaType = mediaTypeSelects[index] ? mediaTypeSelects[index].value : 'image';
        const mediaItem = {
          url: input.value.trim(),
          type: mediaType
        };
        mediaData.push(mediaItem);
        images.push(input.value.trim()); // Backward compatibility

        console.log('Adding media item:', mediaItem);
      }
    });

    console.log('Total media items:', mediaData.length);
  const description = document.getElementById('furniture-description').value;
  const featured = document.getElementById('furniture-featured').checked;

  // Keep backward compatibility and create separate arrays
  const images = mediaData.filter(media => media.type === 'image').map(media => media.url);
  const videos = mediaData.filter(media => media.type === 'video').map(media => media.url);
  const imageUrl = images.length > 0 ? images[0] : (videos.length > 0 ? videos[0] : '');

  db.collection('furnitureItems').add({
    name,
    category,
    price,
    imageUrl,
    images,
    videos,
    mediaData,
    description,
    featured,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  })
  .then(() => {
    addFurnitureForm.reset();
    // Reset image inputs to just one
    resetImageInputs('image-inputs');
    showNotification('Furniture added successfully');
    navigateTo('furniture-list');
  })
  .catch(error => {
    showNotification('Error adding furniture: ' + error.message, 'error');
  });
});

function resetImageInputs(containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = `
    <div class="image-input-group mb-2 flex">
      <input type="url" name="imageUrl" placeholder="Main image/video URL" required class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
      <select name="mediaType" class="ml-2 mt-1 block w-32 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
        <option value="image">Image</option>
        <option value="video">Video</option>
      </select>
    </div>
  `;
}

function setPreviewMedia(furniture) {
  const imagePreview = document.getElementById('edit-furniture-preview');
  const videoPreview = document.getElementById('edit-furniture-video-preview');

  // Hide both previews initially
  imagePreview.classList.add('hidden');
  videoPreview.classList.add('hidden');

  // Check if we have new media format
  if (furniture.mediaData && furniture.mediaData.length > 0) {
    const firstMedia = furniture.mediaData[0];
    if (firstMedia.type === 'video') {
      videoPreview.src = firstMedia.url;
      videoPreview.classList.remove('hidden');
    } else {
      imagePreview.src = firstMedia.url;
      imagePreview.classList.remove('hidden');
    }
  } else {
    // Legacy format - assume it's an image
    const imageUrl = furniture.images && furniture.images.length > 0 ? furniture.images[0] : furniture.imageUrl;
    imagePreview.src = imageUrl;
    imagePreview.classList.remove('hidden');
  }
}

// Edit furniture form submission
editFurnitureForm.addEventListener('submit', e => {
  e.preventDefault();

  const id = editFurnitureId.value;
  const name = editFurnitureName.value;
  const category = editFurnitureCategory.value;
  const price = parseFloat(editFurniturePrice.value);
  const mediaData = collectImageUrls('edit-image-inputs');
  const description = editFurnitureDescription.value;
  const featured = document.getElementById('edit-furniture-featured').checked;

  // Keep backward compatibility and create separate arrays
  const images = mediaData.filter(media => media.type === 'image').map(media => media.url);
  const videos = mediaData.filter(media => media.type === 'video').map(media => media.url);
  const imageUrl = images.length > 0 ? images[0] : (videos.length > 0 ? videos[0] : '');

  db.collection('furnitureItems').doc(id).update({
    name,
    category,
    price,
    imageUrl,
    images,
    videos,
    mediaData,
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
                ${message.phone ? `<p class="text-sm text-gray-500"><i class="fas fa-phone mr-1"></i> ${message.phone}</p>` : ''}
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