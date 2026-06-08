// Drive Pro GDL

const menuBtn = document.getElementById('menuBtn');
const nav = document.getElementById('nav');
menuBtn.addEventListener('click', () => {
    nav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', nav.classList.contains('open'));
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => nav.classList.remove('open')));

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 72, behavior: 'smooth' });
    });
});

const filterBtns = document.querySelectorAll('.filter-btn');
const teamCards = document.querySelectorAll('.team-card');
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        teamCards.forEach(card => card.classList.toggle('hidden', filter !== 'all' && card.dataset.category !== filter));
    });
});

const fileDrop = document.getElementById('fileDrop');
const fileInput = document.getElementById('fileInput');
const fileList = document.getElementById('fileList');
let selectedFiles = [];

if (fileDrop && fileInput) {
    fileDrop.addEventListener('dragover', e => { e.preventDefault(); fileDrop.classList.add('drag-over'); });
    fileDrop.addEventListener('dragleave', () => fileDrop.classList.remove('drag-over'));
    fileDrop.addEventListener('drop', e => { e.preventDefault(); fileDrop.classList.remove('drag-over'); addFiles(Array.from(e.dataTransfer.files)); });
    fileInput.addEventListener('change', () => { addFiles(Array.from(fileInput.files)); fileInput.value = ''; });
}

function addFiles(files) {
    files.forEach(f => { if (!selectedFiles.find(s => s.name === f.name && s.size === f.size)) selectedFiles.push(f); });
    renderFileList();
}
function renderFileList() {
    fileList.innerHTML = '';
    selectedFiles.forEach((f, i) => {
        const li = document.createElement('li');
        const ext = f.name.split('.').pop().toLowerCase();
        const icon = ['jpg','jpeg','png','gif','webp'].includes(ext) ? '🖼️' : ['mp4','mov','avi'].includes(ext) ? '🎬' : ['mp3','wav','ogg','m4a'].includes(ext) ? '🎙️' : ext === 'pdf' ? '📄' : '📎';
        const size = f.size < 1048576 ? (f.size/1024).toFixed(1)+' KB' : (f.size/1048576).toFixed(1)+' MB';
        li.innerHTML = `<span>${icon}</span><span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${f.name}</span><span style="color:var(--text-3);font-size:0.78rem">${size}</span><button class="file-remove" data-index="${i}">✕</button>`;
        fileList.appendChild(li);
    });
    fileList.querySelectorAll('.file-remove').forEach(btn => btn.addEventListener('click', () => { selectedFiles.splice(Number(btn.dataset.index), 1); renderFileList(); }));
}

const reportForm = document.getElementById('reportForm');
const formSuccess = document.getElementById('formSuccess');
const submitBtn = document.getElementById('submitBtn');
reportForm.addEventListener('submit', e => {
    e.preventDefault();
    if (!reportForm.checkValidity()) { reportForm.reportValidity(); return; }
    submitBtn.disabled = true;
    submitBtn.textContent = '⏳ Enviando...';
    setTimeout(() => { reportForm.style.display = 'none'; formSuccess.style.display = 'block'; }, 1200);
});
window.resetForm = function() {
    reportForm.reset(); selectedFiles = []; renderFileList();
    submitBtn.disabled = false; submitBtn.innerHTML = '🔧 Enviar Reporte';
    reportForm.style.display = 'flex'; formSuccess.style.display = 'none';
};

const header = document.getElementById('header');
window.addEventListener('scroll', () => { header.style.boxShadow = window.scrollY > 10 ? '0 2px 20px rgba(0,0,0,0.5)' : 'none'; }, { passive: true });

if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.style.opacity='1'; e.target.style.transform='translateY(0)'; obs.unobserve(e.target); } });
    }, { threshold: 0.1 });
    document.querySelectorAll('.team-card,.service-card,.diag-card,.contact-card').forEach(el => {
        el.style.opacity='0'; el.style.transform='translateY(20px)'; el.style.transition='opacity 0.4s ease,transform 0.4s ease'; obs.observe(el);
    });
}