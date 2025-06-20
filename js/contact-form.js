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