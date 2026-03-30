// Force page to the top on every reload
window.onbeforeunload = function () {
    window.scrollTo(0, 0);
};

if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
}


// This ensures the script only runs AFTER the HTML is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log("Rock & Roll! The script is running.");

    // 1. SCROLL REVEAL LOGIC
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
            }
        });
    }, observerOptions);

    // Grab all elements with the fade-in class and start watching them
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach((el) => {
        observer.observe(el);
    });

    // 2. DYNAMIC TABLE LOGIC (ADD/REMOVE ROWS)
    const addSongBtn = document.getElementById('addSongBtn');
    const setlistBody = document.getElementById('setlistBody');

    if (addSongBtn && setlistBody) {
        addSongBtn.addEventListener('click', () => {
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td><input type="text" name="song_name[]" placeholder="Song Name" required></td>
                <td><input type="text" name="artist_name[]" placeholder="Artist" required></td>
                <td><button type="button" class="remove-btn" style="background:#ff4444; color:white; border:none; padding:5px 10px; cursor:pointer; border-radius:3px;">X</button></td>
            `;
            setlistBody.appendChild(newRow);

            // Add listener to the 'X' button for the new row
            newRow.querySelector('.remove-btn').addEventListener('click', () => {
                newRow.remove();
            });
        });
    }

    // 3. FORM SUBMISSION (SEND TO GMAIL VIA FORMSPREE)
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.onsubmit = async function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            
            // Show a "Sending..." message so the user knows it's working
            const btn = this.querySelector('.submit-button');
            const originalText = btn.innerText;
            btn.innerText = "SENDING...";
            btn.disabled = true;

            try {
                const response = await fetch(this.action, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    alert('Success! Your request has been sent. We will call you soon!');
                    this.reset();
                    // Reset the table to 1 row
                    setlistBody.innerHTML = `<tr><td><input type="text" name="song_name[]" placeholder="e.g. Johnny B. Goode" required></td><td><input type="text" name="artist_name[]" placeholder="e.g. Chuck Berry" required></td><td></td></tr>`;
                } else {
                    alert('Error: Check your Formspree ID or connection.');
                }
            } catch (error) {
                alert('Oops! Something went wrong. Check your internet.');
            } finally {
                btn.innerText = originalText;
                btn.disabled = false;
            }
        };
    }
});

// Update this line inside your Form Submission logic in book.js
if (response.ok) {
    alert('Rock on! Your request has been sent to Marcia, Marc & The Prophets. We will call you soon!');
    this.reset();
}

// Updated Precise Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 50, // Match the 50px padding
                behavior: 'smooth'
            });
        }
    });
});