const sidebar = document.getElementById('sidebar');
const menuBtn = document.getElementById('menuBtn');
const themeBtn = document.getElementById('themeBtn');
const printBtn = document.getElementById('printBtn');
const searchBtn = document.getElementById('searchBtn');
const searchPanel = document.getElementById('searchPanel');
const searchInput = document.getElementById('searchInput');
const searchCount = document.getElementById('searchCount');
const progress = document.getElementById('progress');

menuBtn?.addEventListener('click', () => sidebar.classList.toggle('open'));
sidebar?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => sidebar.classList.remove('open')));

themeBtn?.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  localStorage.setItem('makalah-theme', document.body.classList.contains('dark') ? 'dark' : 'light');
});
if(localStorage.getItem('makalah-theme') === 'dark') document.body.classList.add('dark');

printBtn?.addEventListener('click', () => window.print());
searchBtn?.addEventListener('click', () => {
  searchPanel.classList.toggle('show');
  if(searchPanel.classList.contains('show')) searchInput.focus();
});

function clearMarks(){
  document.querySelectorAll('mark').forEach(m => m.replaceWith(document.createTextNode(m.textContent)));
}
searchInput?.addEventListener('input', () => {
  clearMarks();
  const q = searchInput.value.trim();
  if(!q){ searchCount.textContent='0 hasil'; return; }
  const walker = document.createTreeWalker(document.querySelector('.content'), NodeFilter.SHOW_TEXT);
  const nodes = [];
  while(walker.nextNode()){
    const n = walker.currentNode;
    if(n.parentElement.closest('script,style')) continue;
    if(n.textContent.toLowerCase().includes(q.toLowerCase())) nodes.push(n);
  }
  let count = 0;
  nodes.forEach(n => {
    const text = n.textContent, low = text.toLowerCase(), needle=q.toLowerCase();
    let pos=0, frag=document.createDocumentFragment();
    while(true){
      const i=low.indexOf(needle,pos);
      if(i<0){ frag.append(document.createTextNode(text.slice(pos))); break; }
      frag.append(document.createTextNode(text.slice(pos,i)));
      const mark=document.createElement('mark'); mark.textContent=text.slice(i,i+q.length);
      frag.append(mark); count++; pos=i+q.length;
    }
    n.parentNode.replaceChild(frag,n);
  });
  searchCount.textContent = `${count} hasil`;
});

const sections = [...document.querySelectorAll('.paper[id]')];
const links = [...document.querySelectorAll('.sidebar a')];
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#'+entry.target.id));
    }
  });
},{rootMargin:'-25% 0px -65% 0px'});
sections.forEach(s => observer.observe(s));

window.addEventListener('scroll',()=>{
  const doc = document.documentElement;
  const pct = (doc.scrollTop/(doc.scrollHeight-doc.clientHeight))*100;
  progress.style.width = `${Math.max(0,Math.min(100,pct))}%`;
});
