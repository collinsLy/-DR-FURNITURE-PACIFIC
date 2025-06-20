# DR FURNITURE PACIFIC - Admin Dashboard

This is the admin dashboard for DR FURNITURE PACIFIC website. It allows you to manage furniture listings that will be displayed on the main website.

## Features

- Secure authentication for admin access
- Dashboard with overview statistics
- View all furniture items in a table
- Add new furniture items
- Edit existing furniture details
- Delete furniture items
- Real-time updates to the main website

## Setup Instructions

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" and follow the setup steps
3. Once your project is created, click on "Web" to add a web app to your project
4. Register your app with a nickname (e.g., "DR FURNITURE ADMIN")
5. Copy the Firebase configuration object

### 2. Update Firebase Configuration

1. Open `js/firebase-config.js`
2. Replace the placeholder configuration with your Firebase project configuration:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 3. Set Up Firebase Authentication

1. In the Firebase Console, go to "Authentication"
2. Click "Get started"
3. Enable "Email/Password" sign-in method
4. Go to "Users" tab and click "Add user"
5. Create an admin user with email and password

### 4. Set Up Firestore Database

1. In the Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Start in production mode
4. Choose a location closest to your target audience
5. Set up security rules to restrict access:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /furnitureItems/{itemId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### 5. Deploy the Admin Dashboard

1. Upload the admin folder to your web hosting
2. Access the admin dashboard via your domain (e.g., `https://yourwebsite.com/admin`)
3. Log in with the admin credentials you created in Firebase Authentication

## Using the Admin Dashboard

### Adding Furniture

1. Click on "Add Furniture" in the sidebar
2. Fill in the furniture details:
   - Name
   - Category
   - Price
   - Image URL (direct link to an image)
   - Description
3. Click "Save Furniture"

### Editing Furniture

1. Go to "Furniture List"
2. Find the furniture item you want to edit
3. Click the "Edit" button
4. Update the details as needed
5. Click "Update Furniture"

### Deleting Furniture

1. Go to "Furniture List"
2. Find the furniture item you want to delete
3. Click the "Delete" button
4. Confirm deletion in the popup

## Integrating with the Main Website

The main website should be updated to fetch furniture data from Firebase Firestore. Here's a basic example of how to do this:

1. Add Firebase SDK to your main website
2. Initialize Firebase with the same configuration
3. Fetch furniture items from the "furnitureItems" collection
4. Display the items on your website

Example code for the main website:

```javascript
// Initialize Firebase (same config as admin)
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Fetch furniture items
function loadFurnitureItems() {
  const furnitureContainer = document.querySelector('.product-section .row');
  
  db.collection('furnitureItems')
    .orderBy('timestamp', 'desc')
    .get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        const furniture = doc.data();
        
        // Create HTML for each furniture item
        const furnitureHTML = `
          <div class="col-12 col-md-4 col-lg-3 mb-5">
            <a class="product-item" href="#">
              <img src="${furniture.imageUrl}" class="img-fluid product-thumbnail">
              <h3 class="product-title">${furniture.name}</h3>
              <strong class="product-price">Ksh${furniture.price}</strong>
              <span class="icon-cross">
                <img src="images/cross.svg" class="img-fluid">
              </span>
            </a>
          </div>
        `;
        
        // Add to the container
        furnitureContainer.innerHTML += furnitureHTML;
      });
    });
}

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', loadFurnitureItems);
```

## Support

If you need assistance with the admin dashboard, please contact the developer.