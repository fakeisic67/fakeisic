function updateTime() {
    const now = new Date();
    const formattedTime = now.toLocaleString('cs-CZ', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    }).replace(/\. /g, '-').replace(',', '');
    document.getElementById('date-time').textContent = formattedTime;
}

setInterval(updateTime, 1000);


function loadPhoto(event) {
    const photoFrame = document.getElementById('photo-frame');
    const photoPlaceholder = document.getElementById('photo-placeholder');
    const reader = new FileReader();
    
    reader.onload = function() {
        const photoUpload = document.getElementById('photo-upload');
        const img = new Image();
        img.src = reader.result;
        // Poměr 33:40
        img.style.width = '132px';
        img.style.height = '160px';
        img.style.objectFit = 'cover';
        img.style.borderRadius = '5px';
        
        // Vymazat placeholder, ale zachovat input
        const placeholder = document.getElementById('photo-placeholder');
        if (placeholder) {
            placeholder.style.display = 'none';
        }
        
        // Přidat fotku
        photoFrame.innerHTML = '';
        photoFrame.appendChild(photoUpload);
        photoFrame.appendChild(img);
        
        // Přidat možnost kliknout na fotku pro změnu
        photoFrame.style.cursor = 'pointer';
        photoFrame.onclick = function(e) {
            e.stopPropagation();
            photoUpload.click();
        };
        
        // Uložit fotku do localStorage
        localStorage.setItem('userPhoto', reader.result);

        // Aktualizovat fotku i na "karta" zobrazení
        const kartaImg = document.getElementById('karta-user-photo-img');
        if (kartaImg) {
            kartaImg.src = reader.result;
        }
    };
    
    reader.readAsDataURL(event.target.files[0]);
}

// Načíst uloženou fotku při načtení stránky
function loadSavedPhoto() {
    const savedPhoto = localStorage.getItem('userPhoto');
    if (savedPhoto) {
        const photoFrame = document.getElementById('photo-frame');
        const photoUpload = document.getElementById('photo-upload');
        const placeholder = document.getElementById('photo-placeholder');
        
        const img = new Image();
        img.src = savedPhoto;
        // Poměr 33:40
        img.style.width = '115px';
        img.style.height = '145px';
        img.style.objectFit = 'cover';
        img.style.borderRadius = '5px';
        
        // Skrýt placeholder
        if (placeholder) {
            placeholder.style.display = 'none';
        }
        
        // Přidat fotku, ale zachovat input
        photoFrame.innerHTML = '';
        photoFrame.appendChild(photoUpload);
        photoFrame.appendChild(img);
        
        // Přidat možnost kliknout na fotku pro změnu
        photoFrame.style.cursor = 'pointer';
        photoFrame.onclick = function(e) {
            e.stopPropagation();
            photoUpload.click();
        };

        // Načíst fotku i do "karta" zobrazení
        const kartaImg = document.getElementById('karta-user-photo-img');
        if (kartaImg) {
            kartaImg.src = savedPhoto;
        }
    }
}

// Ukládání jména při změně
function saveUserName() {
    const nameInput = document.getElementById('name');
    if (nameInput) {
        // Ukládání při změně
        nameInput.addEventListener('input', function() {
            localStorage.setItem('userName', this.value);
        });
        
        // Aktivovat focus při kliknutí (pro mobilní zařízení)
        nameInput.addEventListener('click', function() {
            this.focus();
        });
    }
}

// Načíst uložené jméno při načtení stránky
function loadSavedName() {
    const savedName = localStorage.getItem('userName');
    if (savedName) {
        const nameInput = document.getElementById('name');
        if (nameInput) {
            nameInput.value = savedName;
        }
    }
}

// Automaticky aktualizovat platnost podle aktuálního roku
function updateValidity() {
    const now = new Date();
    const currentYear = now.getFullYear();
    const startYear = currentYear - 4;
    const endYearShort = currentYear.toString().slice(-2);
    
    const validityText = `04/${startYear} - 12/${endYearShort}`;
    const validityInput = document.getElementById('validity');
    if (validityInput) {
        validityInput.value = validityText;
    }
}

// Funkce pro načtení fotky v setup modalu
function loadSetupPhoto(event) {
    const photoFrame = document.getElementById('setup-photo-frame');
    const reader = new FileReader();
    
    reader.onload = function() {
        const img = new Image();
        img.src = reader.result;
        // Poměr 33:40 pro náhled v modalu
        img.style.width = '165px';
        img.style.height = '200px';
        img.style.objectFit = 'cover';
        img.style.borderRadius = '5px';
        photoFrame.innerHTML = '';
        photoFrame.appendChild(img);
        
        // Uložit fotku do localStorage
        localStorage.setItem('userPhoto', reader.result);

        // Aktualizovat fotku i na "karta" zobrazení
        const kartaImg = document.getElementById('karta-user-photo-img');
        if (kartaImg) {
            kartaImg.src = reader.result;
        }
        
        // Zkontrolovat, zda lze aktivovat tlačítko Done
        checkSetupForm();
    };
    
    reader.readAsDataURL(event.target.files[0]);
}

// Kontrola, zda je formulář vyplněný
function checkSetupForm() {
    const nameInput = document.getElementById('setup-name');
    const photoFrame = document.getElementById('setup-photo-frame');
    const doneBtn = document.getElementById('setup-done-btn');
    
    if (!nameInput || !photoFrame || !doneBtn) return;
    
    const hasPhoto = photoFrame.querySelector('img') !== null || localStorage.getItem('userPhoto') !== null;
    const hasName = nameInput.value.trim().length > 0;
    
    doneBtn.disabled = !(hasPhoto && hasName);
}

// Inicializace při načtení stránky
document.addEventListener('DOMContentLoaded', function() {
    // Přepínání mezi dvěma "kartami" přes icon selector
    const iconMain = document.getElementById('icon-main');
    const iconKarta = document.getElementById('icon-karta');
    const cardMain = document.getElementById('id-card-main');
    const cardKarta = document.getElementById('id-card-karta');

    function setActiveView(view) {
        if (!iconMain || !iconKarta || !cardMain || !cardKarta) return;

        const isMain = view === 'main';
        iconMain.classList.toggle('active', isMain);
        iconKarta.classList.toggle('active', !isMain);

        cardMain.classList.toggle('is-hidden', !isMain);
        cardKarta.classList.toggle('is-hidden', isMain);
    }

    function bindIcon(el, view) {
        if (!el) return;
        el.addEventListener('click', () => setActiveView(view));
        el.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setActiveView(view);
            }
        });
    }

    bindIcon(iconMain, 'main');
    bindIcon(iconKarta, 'karta');
    setActiveView('main');

    const savedPhoto = localStorage.getItem('userPhoto');
    const savedName = localStorage.getItem('userName');
    
    // Pokud nejsou uložené informace, zobrazit setup modal
    if (!savedPhoto || !savedName) {
        const modal = document.getElementById('setup-modal');
        modal.classList.add('show');
        
        // Přidat event listenery pro validaci
        const nameInput = document.getElementById('setup-name');
        const photoFrame = document.getElementById('setup-photo-frame');
        
        // Pokud už existuje uložená fotka, zobrazit ji
        if (savedPhoto && photoFrame) {
            const img = new Image();
            img.src = savedPhoto;
            // Poměr 33:40
            img.style.width = '165px';
            img.style.height = '200px';
            img.style.objectFit = 'cover';
            img.style.borderRadius = '5px';
            photoFrame.innerHTML = '';
            photoFrame.appendChild(img);
        }
        
        // Pokud už existuje uložené jméno, zobrazit ho
        if (savedName && nameInput) {
            nameInput.value = savedName;
        }
        
        if (nameInput) {
            nameInput.addEventListener('input', checkSetupForm);
        }
        
        // Tlačítko Done
        const doneBtn = document.getElementById('setup-done-btn');
        if (doneBtn) {
            doneBtn.addEventListener('click', function() {
                const name = nameInput.value.trim();
                const currentPhoto = localStorage.getItem('userPhoto');
                
                if (name && currentPhoto) {
                    // Uložit jméno
                    localStorage.setItem('userName', name);
                    
                    // Zavřít modal
                    modal.classList.remove('show');
                    
                    // Načíst data do hlavní aplikace
                    loadSavedPhoto();
                    loadSavedName();
                    saveUserName();
                }
            });
        }
        
        // Zkontrolovat formulář při načtení (pokud už jsou nějaká data)
        checkSetupForm();
    } else {
        // Pokud jsou data uložená, načíst je normálně
        loadSavedPhoto();
        loadSavedName();
        saveUserName();
    }
    
    updateTime();
    updateValidity();
});
