document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const firstName = document.getElementById('fname').value;
            const lastName = document.getElementById('lname').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            if (!firstName || !lastName || !email || !message) {
                alert('Please fill in all fields.');
                return;
            }

            try {
                const db = firebase.firestore();
                await db.collection('inquiryMessages').add({
                    firstName,
                    lastName,
                    email,
                    message,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                });
                alert('Your message has been sent successfully!');
                contactForm.reset();
            } catch (error) {
                console.error('Error sending message:', error);
                alert('There was an error sending your message. Please try again later.');
            }
        });
    }
});
// Contact form submission handler
document.addEventListener('DOMContentLoaded', function() {
  const contactForm = document.getElementById('contactForm');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form data
      const firstName = document.getElementById('fname').value.trim();
      const lastName = document.getElementById('lname').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();
      
      // Validate form data
      if (!firstName || !lastName || !email || !message) {
        alert('Please fill in all fields.');
        return;
      }
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        alert('Please enter a valid email address.');
        return;
      }
      
      // Disable submit button to prevent double submission
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;
      
      // Save to Firebase
      db.collection('inquiryMessages').add({
        firstName: firstName,
        lastName: lastName,
        email: email,
        message: message,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      })
      .then(() => {
        // Success
        alert('Thank you for your message! We will get back to you soon.');
        contactForm.reset();
      })
      .catch((error) => {
        console.error('Error saving message:', error);
        alert('Sorry, there was an error sending your message. Please try again later.');
      })
      .finally(() => {
        // Re-enable submit button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      });
    });
  }
});
