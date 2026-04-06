emailjs.init("FDYWFQEexOi4wTDWO");

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
            // FIXED: Changed name to match the submission logic (Song[] and Artist[])
            newRow.innerHTML = `
                <td><input type="text" name="Song[]" placeholder="Song Name" required></td>
                <td><input type="text" name="Artist[]" placeholder="Artist" required></td>
                <td><button type="button" class="remove-btn" style="background:#ff4444; color:white; border:none; padding:5px 10px; cursor:pointer; border-radius:3px;">X</button></td>
            `;
            setlistBody.appendChild(newRow);

            newRow.querySelector('.remove-btn').addEventListener('click', () => {
                newRow.remove();
            });
        });
    }

    // 3. FORM SUBMISSION
   // 3. FORM SUBMISSION (CLEANED & MERGED)
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.onsubmit = async function(e) {
        e.preventDefault();

        // 1. Validate Checkbox
        const termsCheck = document.getElementById('termsCheckbox');
        if (!termsCheck.checked) {
            alert("Please agree to the booking terms and pricing policy before submitting.");
            return;
        }

        // 2. Button Loading State
        const btn = this.querySelector('.submit-button');
        const originalBtnText = btn.innerHTML;
        btn.innerHTML = '<span class="spinner"></span> SENDING...';
        btn.disabled = true;

        try {
            // 3. Collect Data
            const fullPhoneNumber = iti.getNumber();
            
            let setlistItems = "";
            document.querySelectorAll('#setlistBody tr').forEach((row, index) => {
                const songInput = row.querySelector('input[name="Song[]"]');
                const artistInput = row.querySelector('input[name="Artist[]"]');
                if(songInput && artistInput && songInput.value) {
                    setlistItems += `${index + 1}. ${songInput.value} — ${artistInput.value}\n`;
                }
            });

            const soundReqElement = this.querySelector('input[name="Sound_Requirement"]:checked');
            const soundReqValue = soundReqElement ? soundReqElement.value : "Not Specified";
            const guestsValue = document.getElementById('guestCountInput').value || "N/A";
            const fullDate = `${document.getElementById('day').value} ${document.getElementById('month').value} ${document.getElementById('year').value}`;

            const templateParams = {
                name: this.Name.value,
                email: this.Email.value,
                phone: fullPhoneNumber,
                date: fullDate,
                location: this.Event_Location.value,
                sound: soundReqValue,
                lineup: this.querySelector('input[name="Band_Lineup"]:checked').value,
                guests: guestsValue,
                setlist: setlistItems, 
                notes: this.Special_Requests.value
            };

            // 4. Send via EmailJS
            await emailjs.send('service_3sv2b0g', 'template_uzidfe5', templateParams);

            // 5. Success Actions
            this.reset();
            document.getElementById('setlistBody').innerHTML = `<tr><td><input type="text" name="Song[]" placeholder="e.g. Johnny B. Goode" required></td><td><input type="text" name="Artist[]" placeholder="e.g. Chuck Berry" required></td><td></td></tr>`;
            
            const overlay = document.getElementById('successOverlay');
            if(overlay) overlay.style.display = 'flex';

        } catch (error) {
            alert('Oops! Check your internet connection.');
            console.error(error);
        } finally {
            btn.innerHTML = "SEND BOOKING REQUEST";
            btn.disabled = false;
        }
    };
}

  // 4. PRECISE SMOOTH SCROLL
    document.querySelectorAll('.back-to-top, a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            // If it's the back-to-top link, we go to 0. Otherwise, we find the target.
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            
            if (targetId === "#top") {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            } else if (target) {
                window.scrollTo({
                    top: target.offsetTop - 50,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Populate the Days dropdown (1-31)
const daySelect = document.getElementById('day');
if (daySelect) {
    for (let i = 1; i <= 31; i++) {
        const opt = document.createElement('option');
        opt.value = i;
        opt.innerHTML = i;
        daySelect.appendChild(opt);
    }
}

// Populate the Years dropdown (2026 to 2040)
const yearSelect = document.getElementById('year');
if (yearSelect) {
    // Clear any existing hardcoded options first (optional safety)
    yearSelect.innerHTML = '<option value="" disabled selected>Year</option>';
    
    for (let i = 2026; i <= 2040; i++) { // Change this to 2040
        const opt = document.createElement('option');
        opt.value = i;
        opt.textContent = i;
        yearSelect.appendChild(opt);
    }
}

const soundRadios = document.querySelectorAll('input[name="Sound_Requirement"]');
    const guestCountGroup = document.getElementById('guestCountGroup');
    const guestCountInput = document.querySelector('input[name="Guest_Count"]');

    soundRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.value === "Without Sound") {
                // Smoothly hide
                guestCountGroup.classList.add('hidden-field');
                guestCountInput.removeAttribute('required');
                // Optional: Clear the value so it doesn't send 
                // data you don't need
                guestCountInput.value = ""; 
            } else {
                // Smoothly show
                guestCountGroup.classList.remove('hidden-field');
                guestCountInput.setAttribute('required', '');
            }
        });
    });


const phoneInput = document.querySelector("#phone");
const iti = window.intlTelInput(phoneInput, {
    separateDialCode: true,
    initialCountry: "auto",
    geoIpLookup: function(success, failure) {
        fetch("https://ipapi.co/json")
            .then(res => res.json())
            .then(data => success(data.country_code))
            .catch(() => success("US"));
    },
    utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.19/js/utils.js",
    preferredCountries: ['in', 'us', 'gb'], // India, US, UK at the top
    separateDialCode: true
});

// Update your EmailJS templateParams to include the phone
// Inside your contactForm.onsubmit:
const templateParams = {
    name: this.Name.value,
    email: this.Email.value,
    phone: iti.getNumber(), // This sends the full number with +91 etc.
    // ... rest of your params
};

});

// 5. EXTERNAL FUNCTION (MUST BE OUTSIDE DOMContentLoaded)
// Function to hide the Success Screen AND scroll to top
function closeSuccess() {
    const overlay = document.getElementById('successOverlay');
    if (overlay) {
        overlay.style.display = 'none';
        
        // This forces the page to the very top immediately
        window.scrollTo({
            top: 0,
            behavior: 'smooth' 
        });
    }
}

const memberInfo = {
    "MARCIA_MARC": { 
        role: "Main Vocalists", 
        bio: "The unstoppable duo leading the charge. Marcia and Marc bring soaring harmonies and that unmistakable 1950s charisma to every performance. Their chemistry on stage is the heart of the Prophets' authentic sound.", 
        img: "marcia-marc.jpeg" 
    },
    "ISAIAH": { 
        role: "Vocalist & Keyboardist", 
        bio: "The melodic soul of the Prophets. While he provides the essential rhythmic foundation on the keys, Isaiah’s true mastery lies in his vocal range. Bringing a rich, commanding presence to every performance, he breathes new life into classic harmonies and modern hits alike.", 
        img: "isaiah.jpeg" 
    },
    "SAMUEL": { 
       role: "Vocalist & Guitarist", 
        bio: "The ultimate dual-threat on stage. Samuel brings a seamless balance of technical guitar precision and soulful vocal power to the Prophets. Whether he’s driving the rhythm with iconic vintage riffs or leading a modern anthem, his ability to bridge the gap between strings and song is the heartbeat of our live set.", 
        img: "samuel.jpeg" 
    },
    "DANIEL": { 
       role: "Vocalist & Guitarist", 
        bio: "The powerhouse of the Prophets' signature sound. A master of the fretboard, Daniel brings high-octane energy and world-class guitar precision to every stage. While his electrifying lead work drives our biggest hits, his sharp vocal harmonies add that essential layer of depth, making every performance feel truly massive.", 
        img: "daniel.jpeg" 
    }
};

function openMember(name) {
    const data = memberInfo[name];
    if (!data) return;

    // Logic to handle the display name
    const displayName = (name === 'MARCIA_MARC') ? "MARCIA & MARC" : name;

    document.getElementById('modalName').innerText = displayName;
    document.getElementById('modalRole').innerText = data.role;
    document.getElementById('modalBio').innerText = data.bio;
    document.getElementById('modalImg').src = data.img;
    
    document.getElementById('memberModal').style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Prevents scrolling behind popup
}

function closeModal() {
    document.getElementById('memberModal').style.display = 'none';
    document.body.style.overflow = 'auto'; // Restoration of scrolling
}

document.getElementById('copySetlistBtn').addEventListener('click', function() {
    const rows = document.querySelectorAll('#setlistBody tr');
    let setlistText = "🎵 OUR REQUESTED SETLIST:\n\n";
    let hasSongs = false;

    rows.forEach((row, index) => {
        const song = row.querySelector('input[name="Song[]"]').value.trim();
        const artist = row.querySelector('input[name="Artist[]"]').value.trim();

        if (song || artist) {
            setlistText += `${index + 1}. ${song || "TBD"} - ${artist || "TBD"}\n`;
            hasSongs = true;
        }
    });

    if (!hasSongs) {
        alert("Add some songs first, bro!");
        return;
    }

    // Copy to Clipboard
    navigator.clipboard.writeText(setlistText).then(() => {
        const originalText = this.innerHTML;
        this.innerHTML = "✅ COPIED!";
        this.style.color = "#ffd700";
        
        // Reset button text after 2 seconds
        setTimeout(() => {
            this.innerHTML = originalText;
            this.style.color = "";
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
});