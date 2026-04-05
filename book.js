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
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.onsubmit = async function(e) {
            e.preventDefault();

            const btn = this.querySelector('.submit-button');
            btn.innerHTML = '<span class="spinner"></span> SENDING...';
            btn.disabled = true;

            // Create the clean setlist string for your email
            let setlistItems = "";
            document.querySelectorAll('#setlistBody tr').forEach((row, index) => {
                const songInput = row.querySelector('input[name="Song[]"]');
                const artistInput = row.querySelector('input[name="Artist[]"]');
                
                if(songInput && artistInput && songInput.value) {
                    setlistItems += `${index + 1}. ${songInput.value} — ${artistInput.value}\n`;
                }
            });
            
            const dayVal = document.getElementById('day').value;
            const monthVal = document.getElementById('month').value;
            const yearVal = document.getElementById('year').value;
            const fullDate = `${dayVal} ${monthVal} ${yearVal}`;

            const templateParams = {
                name: this.Name.value,
                email: this.Email.value,
                date: fullDate,
                location: this.Event_Location.value,
                sound: this.querySelector('input[name="Sound_Requirement"]:checked').value,
                lineup: this.querySelector('input[name="Band_Lineup"]:checked').value,
                guests: this.Guest_Count.value,
                setlist: setlistItems, 
                notes: this.Special_Requests.value
            };

            emailjs.send('service_3sv2b0g', 'template_uzidfe5', templateParams)
                .then(() => {
                    // 1. Clear the form
                    this.reset();
                    document.getElementById('setlistBody').innerHTML = `<tr><td><input type="text" name="Song[]" placeholder="e.g. Johnny B. Goode" required></td><td><input type="text" name="Artist[]" placeholder="e.g. Chuck Berry" required></td><td></td></tr>`;
                    
                    // 2. SHOW THE SUCCESS SCREEN
                    const overlay = document.getElementById('successOverlay');
                    if(overlay) overlay.style.display = 'flex';
                })
                .catch((error) => {
                    alert('Oops! Check your internet connection.');
                    console.log(error);
                })
                .finally(() => {
                    btn.innerText = "SEND BOOKING REQUEST";
                    btn.disabled = false;
                });
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
        bio: "A true virtuoso of the keys. Isaiah brings the thunderous energy of Rock & Roll piano legends, keeping the tempo high and the crowd on their feet with every rhythmic strike.", 
        img: "isaiah.png" 
    },
    "SAMUEL": { 
        role: "Vocalist & Guitarist", 
        bio: "The master of the vintage twang. Samuel’s guitar work defines our 1950s aesthetic, blending sharp riffs with powerful vocal support to round out the band's signature style.", 
        img: "samuel.jpeg" 
    },
    "DANIEL": { 
        role: "Vocalist & Guitarist", 
        bio: "Pure energy on strings. Daniel brings the grit and groove required for high-octane performance, ensuring that every song resonates with the power of original Rock & Roll.", 
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