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
            const kartaName = document.getElementById('karta-name');
            if (kartaName) {
                kartaName.textContent = this.value;
            }
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

        const kartaName = document.getElementById('karta-name');
        if (kartaName) {
            kartaName.textContent = savedName;
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

// Validity na "karta" view: 04/<aktuální rok>
function updateKartaValidity() {
    const now = new Date();
    const currentYear = now.getFullYear();
    const kartaValidity = document.getElementById('karta-validity');
    if (kartaValidity) {
        kartaValidity.textContent = `04/${currentYear}`;
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
    const kartaCarousel = document.getElementById('karta-carousel');
    const kartaTrack = kartaCarousel ? kartaCarousel.querySelector('.karta-track') : null;

    function setKartaSlide(slide) {
        if (!kartaCarousel || !kartaTrack) return;
        const dots = Array.from(kartaCarousel.querySelectorAll('.karta-dot'));

        dots.forEach((d) => d.classList.toggle('is-active', d.dataset.dot === slide));

        const index = slide === 'back' ? 1 : 0;
        kartaTrack.style.transform = `translateX(-${index * 50}%)`;
    }

    function setActiveView(view) {
        if (!iconMain || !iconKarta || !cardMain || !cardKarta) return;

        const isMain = view === 'main';
        iconMain.classList.toggle('active', isMain);
        iconKarta.classList.toggle('active', !isMain);

        cardMain.classList.toggle('is-hidden', !isMain);
        cardKarta.classList.toggle('is-hidden', isMain);

        // při přepnutí na "karta" vždy začít na front
        if (!isMain) {
            setKartaSlide('front');
        }
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

    // Carousel swipe pro kartu (front/back) — přepínání vlevo/vpravo
    if (kartaCarousel) {
        const SWIPE_THRESHOLD_PX = 50;
        let startX = 0;
        let startY = 0;

        function getCurrentSlide() {
            const activeDot = kartaCarousel.querySelector('.karta-dot.is-active');
            const current = activeDot && activeDot instanceof HTMLElement ? activeDot.dataset.dot : 'front';
            return current === 'back' ? 'back' : 'front';
        }

        function handleSwipe(endX, endY) {
            const dx = endX - startX;
            const dy = endY - startY;
            if (Math.abs(dx) < SWIPE_THRESHOLD_PX) return;
            if (Math.abs(dx) < Math.abs(dy)) return; // ignorovat vertikální gesto
            const current = getCurrentSlide();
            if (dx < 0) {
                // swipe left => next (back)
                setKartaSlide('back');
            } else {
                // swipe right => prev (front)
                setKartaSlide('front');
            }
        }

        kartaCarousel.addEventListener('touchstart', (e) => {
            const t = e.changedTouches[0];
            if (!t) return;
            startX = t.clientX;
            startY = t.clientY;
        }, { passive: true });

        kartaCarousel.addEventListener('touchend', (e) => {
            const t = e.changedTouches[0];
            if (!t) return;
            handleSwipe(t.clientX, t.clientY);
        }, { passive: true });

        // fallback pro desktop (myš / trackpad)
        kartaCarousel.addEventListener('pointerdown', (e) => {
            if (e.pointerType === 'touch') return;
            startX = e.clientX;
            startY = e.clientY;
        });

        kartaCarousel.addEventListener('pointerup', (e) => {
            if (e.pointerType === 'touch') return;
            handleSwipe(e.clientX, e.clientY);
        });
    }

    const savedPhoto = localStorage.getItem('userPhoto');
    const savedName = localStorage.getItem('userName');
    const params = new URLSearchParams(window.location.search);
    const forceSetup = params.get('setup') === '1';
    
    // Pokud nejsou uložené informace, zobrazit setup modal
    if (forceSetup || !savedPhoto || !savedName) {
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

                    const kartaName = document.getElementById('karta-name');
                    if (kartaName) {
                        kartaName.textContent = name;
                    }
                    
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
    updateKartaValidity();
});
