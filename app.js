/* OJO | Drive Pro GDL — app.js */

// === MOBILE MENU ===
const menuBtn = document.getElementById('menuBtn');
const nav = document.getElementById('nav');

menuBtn.addEventListener('click', () => {
    nav.classList.toggle('open');
    const open = nav.classList.contains('open');
    menuBtn.setAttribute('aria-expanded', open);
});

// Close nav on link click
nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => nav.classList.remove('open'));
});

// === SMOOTH SCROLL OFFSET FOR STICKY HEADER ===
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        const offset = 72;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
    });
});

// === TEAM FILTER ===
const filterBtns = document.querySelectorAll('.filter-btn');
const teamCards = document.querySelectorAll('.team-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        teamCards.forEach(card => {
            const match = filter === 'all' || card.dataset.category === filter;
            card.classList.toggle('hidden', !match);
        });
    });
});

// === FILE UPLOAD ===
const fileDrop = document.getElementById('fileDrop');
const fileInput = document.getElementById('fileInput');
const fileList = document.getElementById('fileList');
let selectedFiles = [];

if (fileDrop && fileInput) {
    fileDrop.addEventListener('dragover', e => {
        e.preventDefault();
        fileDrop.classList.add('drag-over');
    });
    fileDrop.addEventListener('dragleave', () => fileDrop.classList.remove('drag-over'));
    fileDrop.addEventListener('drop', e => {
        e.preventDefault();
        fileDrop.classList.remove('drag-over');
        addFiles(Array.from(e.dataTransfer.files));
    });
    fileInput.addEventListener('change', () => {
        addFiles(Array.from(fileInput.files));
        fileInput.value = '';
    });
}

function addFiles(files) {
    files.forEach(f => {
        if (!selectedFiles.find(s => s.name === f.name && s.size === f.size)) {
            selectedFiles.push(f);
        }
    });
    renderFileList();
}

function renderFileList() {
    fileList.innerHTML = '';
    selectedFiles.forEach((f, i) => {
        const li = document.createElement('li');
        const icon = getFileIcon(f.name);
        li.innerHTML = `
            <span>${icon}</span>
            <span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${f.name}</span>
            <span style="color:var(--text-3);font-size:0.78rem">${formatSize(f.size)}</span>
            <button class="file-remove" data-index="${i}" title="Quitar">✕</button>
        `;
        fileList.appendChild(li);
    });
    fileList.querySelectorAll('.file-remove').forEach(btn => {
        btn.addEventListener('click', () => {
            selectedFiles.splice(Number(btn.dataset.index), 1);
            renderFileList();
        });
    });
}

function getFileIcon(name) {
    const ext = name.split('.').pop().toLowerCase();
    if (['jpg','jpeg','png','gif','webp'].includes(ext)) return '🖼️';
    if (['mp4','mov','avi','mkv'].includes(ext)) return '🎬';
    if (['mp3','wav','ogg','m4a','aac'].includes(ext)) return '🎙️';
    if (ext === 'pdf') return '📄';
    if (['txt','csv'].includes(ext)) return '📋';
    return '📎';
}

function formatSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
}

// === REPORT FORM SUBMISSION ===
const reportForm = document.getElementById('reportForm');
const formSuccess = document.getElementById('formSuccess');
const submitBtn = document.getElementById('submitBtn');

reportForm.addEventListener('submit', e => {
    e.preventDefault();
    if (!reportForm.checkValidity()) {
        reportForm.reportValidity();
        return;
    }
    submitBtn.disabled = true;
    submitBtn.textContent = '⏳ Enviando...';
    // Simulate async submission
    setTimeout(() => {
        reportForm.style.display = 'none';
        formSuccess.style.display = 'block';
    }, 1200);
});

window.resetForm = function () {
    reportForm.reset();
    selectedFiles = [];
    renderFileList();
    submitBtn.disabled = false;
    submitBtn.innerHTML = '🔧 Enviar Reporte a OJO';
    reportForm.style.display = 'flex';
    formSuccess.style.display = 'none';
};

// === HEADER SHADOW ON SCROLL ===
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    header.style.boxShadow = window.scrollY > 10
        ? '0 2px 20px rgba(0,0,0,0.5)'
        : 'none';
}, { passive: true });

// === CARD ENTRANCE ANIMATION ===
if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.team-card, .service-card, .diag-card, .contact-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        observer.observe(el);
    });
}
