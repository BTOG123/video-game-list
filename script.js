const gallery = document.getElementById('gallery');
const search = document.getElementById('search');

let items = [];

async function loadData(){
  try{
    const res = await fetch('image.json', {cache:'no-cache'});
    items = await res.json();

    items.sort((a, b) => {
      return new Date(a.releaseDate) - new Date(b.releaseDate);
    });

  }catch(e){
    gallery.innerHTML = `<div style="color:#ddd;padding:20px">Error: images.json not found.</div>`;
    return;
  }

  render();
}



function render(){

  const q = search.value.trim().toLowerCase();
  let list = items.filter(it => it.title.toLowerCase().includes(q));

  gallery.innerHTML = list.map(it => `
    <button class="card" type="button" title="${it.title}" onclick="openModal('${it.filename}','${escapeHtml(it.title)}')">
      <img class="boxart" loading="lazy" decoding="async" src="images/${encodeURIComponent(it.filename)}" alt="${escapeHtml(it.title)}" />
      <div class="title">${escapeHtml(it.title)}</div>
    </button>
  `).join('');
}

function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, c => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  })[c]);
}

/* modal stuff */
const modal = document.getElementById('modal');
const modalImg = document.getElementById('modal-img');
const metaBox = document.getElementById('meta');
const closeModalBtn = document.getElementById('closeModal');

function openModal(filename, title){
  modal.setAttribute('aria-hidden','false');
  modalImg.src = `images/${encodeURIComponent(filename)}`;
  modalImg.alt = title;
  metaBox.textContent = title;
  document.body.style.overflow = 'hidden';
}
function closeModal(){
  modal.setAttribute('aria-hidden','true');
  modalImg.src = '';
  document.body.style.overflow = '';
}
closeModalBtn.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => { if(e.target === modal) closeModal(); });
document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') closeModal(); });
search.addEventListener('input', render);

loadData();
