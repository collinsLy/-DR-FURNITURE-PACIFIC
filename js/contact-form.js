// Contact form submission handler for contact.html page only
document.addEventListener('DOMContentLoaded', function() {
  // Only run contact form logic if we're on the contact page
  if (!window.location.pathname.includes('contact.html')) {
    return;
  }

  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
      e.preventDefault();

      // Get form data
      const firstName = document.getElementById('fname').value.trim();
      const lastName = document.getElementById('lname').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();

      // Validate form data
      if (!firstName || !lastName || !email || !message) {
        toastError('Please fill in all fields.');
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toastError('Please enter a valid email address.');
        return;
      }

      // Disable submit button to prevent double submission
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;

      try {
        // Show loading toast
        toastInfo('Sending your message...');

        // Save to Firebase
        await db.collection('contactMessages').add({
          firstName: firstName,
          lastName: lastName,
          email: email,
          message: message,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          status: 'new'
        });

        // Show success toast
        toastSuccess('Thank you! Your message has been sent successfully. We will get back to you soon.');

        // Reset form
        contactForm.reset();

      } catch (error) {
        console.error('Error sending message:', error);
        toastError('Sorry, there was an error sending your message. Please try again.');
      } finally {
        // Re-enable submit button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });
  }
});