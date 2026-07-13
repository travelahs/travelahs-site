(()=>{
  const config=window.TRAVELAHS_CONFIG||{blocks:[]};
  const stream=document.querySelector('[data-portfolio-stream]');
  const items=[];
  const reduceMotion=window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;
  const mediaDimensions={"media/gorge-pool-2.jpg":[1152,1536],"media/gorge-waterfall.jpg":[1152,1536],"media/cresanto-close.jpg":[1024,1536],"media/capri-lighthouse.jpg":[1024,1537],"media/altana-day.jpg":[1024,1536],"media/rustic-garden.jpg":[1152,1536],"media/rustic-sign.jpg":[1155,1536],"media/gorge-bridge.jpg":[1151,1536],"media/altana-door.jpg":[1152,1537],"media/capri-cave.jpg":[1200,1800],"media/cresanto-wide.jpg":[1023,1536],"media/santo-food.jpg":[1152,1536],"media/capri-faraglioni.jpg":[1024,1536],"media/rustic-planter.jpg":[1151,1536],"media/glacier-road.jpg":[1536,1024],"media/gorge-pool.jpg":[1151,1536],"media/jackson-poster.jpg":[512,910],"media/rustic-squid.jpg":[1151,1536],"media/altana-sunset.jpg":[1024,1536],"media/santo-beach-vertical.jpg":[1024,1536],"media/altana-wine.jpg":[864,1536],"media/rustic-interior.jpg":[1152,1536],"media/sugar-thread-poster.jpg":[720,1280],"media/parco-poster.jpg":[512,910],"media/santo-beach-wide.jpg":[1536,1023],"media/rustic-bar.jpg":[1151,1536]};
  const attrsFor=src=>{const d=mediaDimensions[src];return d?` width="${d[0]}" height="${d[1]}"`:''};
  const esc=s=>String(s||'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const register=item=>{const index=items.length;items.push(item);return index};
  function slideMarkup(m,i,title){
    return `<button class="carousel-slide" type="button" data-open-item data-index="${i}" aria-label="Open ${esc(title)} media ${i+1}">${m.type==='video'?`<video muted loop playsinline preload="metadata" poster="${esc(m.poster||'')}"${attrsFor(m.poster)} aria-label="${esc(m.alt)}"><source src="${esc(m.src)}" type="video/mp4"></video>`:`<img loading="lazy" decoding="async" src="${esc(m.src)}"${attrsFor(m.src)} alt="${esc(m.alt)}">`}</button>`;
  }
  function carouselMarkup(item,index){
    const many=item.media.length>1;
    return `<div class="carousel ${esc(item.frame||'portrait-3-4')}" data-carousel><div class="carousel-track">${item.media.map((m,i)=>slideMarkup(m,i,item.title)).join('')}</div>${many?`<button class="carousel-arrow carousel-prev" type="button" aria-label="Previous image">←</button><button class="carousel-arrow carousel-next" type="button" aria-label="Next image">→</button><div class="carousel-dots">${item.media.map((_,i)=>`<button class="carousel-dot ${i===0?'active':''}" type="button" aria-label="Show image ${i+1}" data-dot="${i}"></button>`).join('')}</div>`:''}</div>`;
  }
  function featureMarkup(block){
    const item=block.item,index=register(item);
    return `<article class="portfolio-block feature-block ${block.reverse?'reverse':''}" data-item-index="${index}"><div class="feature-media">${carouselMarkup(item,index)}</div><div class="feature-caption"><span class="meta">${esc(item.category)}</span><h3>${esc(item.title)}</h3><p class="location">${esc(item.location)}</p>${item.note?`<p class="note">${esc(item.note)}</p>`:''}</div></article>`;
  }
  function cardMarkup(item){
    const index=register(item);
    return `<figure class="portfolio-card" data-item-index="${index}">${carouselMarkup(item,index)}<figcaption><span><span class="meta">${esc(item.category)}</span><strong>${esc(item.title)}</strong></span><span>${esc(item.location)}</span></figcaption></figure>`;
  }
  function duoMarkup(block){return `<div class="portfolio-block duo-block">${block.items.map(cardMarkup).join('')}</div>`}
  function landscapeMarkup(block){
    const item=block.item,index=register(item);
    return `<div class="portfolio-block landscape-block"><figure data-item-index="${index}">${carouselMarkup(item,index)}<figcaption class="landscape-caption"><span><span class="meta">${esc(item.category)}</span><strong>${esc(item.title)}</strong></span><span>${esc(item.location)}</span></figcaption></figure></div>`;
  }
  stream.innerHTML=config.blocks.map(b=>b.kind==='feature'?featureMarkup(b):b.kind==='duo'?duoMarkup(b):landscapeMarkup(b)).join('');

  const findItemContainer=el=>el.closest('[data-item-index]');
  const move=(container,next)=>{
    const item=items[+container.dataset.itemIndex],track=container.querySelector('.carousel-track');
    let current=+container.dataset.current||0;
    current=(next+item.media.length)%item.media.length;
    container.dataset.current=current;
    track.style.transform=`translateX(-${current*100}%)`;
    container.querySelectorAll('.carousel-dot').forEach((d,i)=>d.classList.toggle('active',i===current));
  };
  document.addEventListener('click',e=>{
    const container=findItemContainer(e.target);if(!container)return;
    if(e.target.closest('.carousel-prev')){move(container,(+container.dataset.current||0)-1);return;}
    if(e.target.closest('.carousel-next')){move(container,(+container.dataset.current||0)+1);return;}
    const dot=e.target.closest('[data-dot]');if(dot){move(container,+dot.dataset.dot);return;}
    const open=e.target.closest('[data-open-item]');if(open&&!container.dataset.swiping)openLightbox(+container.dataset.itemIndex,+open.dataset.index);
  });
  document.querySelectorAll('[data-carousel]').forEach(carousel=>{
    let startX=null;
    carousel.addEventListener('pointerdown',e=>{startX=e.clientX});
    carousel.addEventListener('pointerup',e=>{if(startX===null)return;const dx=e.clientX-startX;startX=null;if(Math.abs(dx)<45)return;const container=findItemContainer(carousel);container.dataset.swiping='true';move(container,(+container.dataset.current||0)+(dx<0?1:-1));setTimeout(()=>delete container.dataset.swiping,250)});
  });
  if(!reduceMotion)document.querySelectorAll('video[muted]').forEach(v=>{const o=new IntersectionObserver(es=>es.forEach(en=>en.isIntersecting?v.play().catch(()=>{}):v.pause()),{threshold:.35});o.observe(v)});
  document.querySelectorAll('.sound-button').forEach(b=>{const v=b.parentElement.querySelector('video');b.onclick=()=>{v.muted=!v.muted;b.textContent=v.muted?'Sound on':'Sound off';v.play().catch(()=>{})}});

  const dialog=document.querySelector('[data-lightbox]'),media=document.querySelector('[data-lightbox-media]'),title=document.querySelector('[data-lightbox-title]'),location=document.querySelector('[data-lightbox-location]');
  let activeItem=0,activeIndex=0;
  function renderLightbox(){const item=items[activeItem],m=item.media[activeIndex];title.textContent=item.title;location.textContent=item.location;media.innerHTML=m.type==='video'?`<video controls autoplay muted playsinline preload="metadata" poster="${esc(m.poster||'')}"${attrsFor(m.poster)}><source src="${esc(m.src)}" type="video/mp4"></video>`:`<img src="${esc(m.src)}"${attrsFor(m.src)} alt="${esc(m.alt)}">`;document.querySelector('[data-lightbox-prev]').hidden=item.media.length<2;document.querySelector('[data-lightbox-next]').hidden=item.media.length<2}
  function openLightbox(i,j){activeItem=i;activeIndex=j;renderLightbox();dialog.showModal()}
  function lightMove(delta){const item=items[activeItem];activeIndex=(activeIndex+delta+item.media.length)%item.media.length;renderLightbox()}
  document.querySelector('[data-lightbox-prev]').onclick=()=>lightMove(-1);
  document.querySelector('[data-lightbox-next]').onclick=()=>lightMove(1);
  document.querySelector('[data-lightbox-close]').onclick=()=>dialog.close();
  dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});
  dialog.addEventListener('close',()=>media.innerHTML='');

  const menu=document.querySelector('[data-menu]'),nav=document.querySelector('[data-nav]');
  menu?.addEventListener('click',()=>{const open=nav.classList.toggle('is-open');menu.setAttribute('aria-expanded',String(open))});
  nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('is-open');menu?.setAttribute('aria-expanded','false')}));
  document.querySelector('[data-year]').textContent=new Date().getFullYear();

  const instagramWrap=document.querySelector('[data-instagram-wrap]');
  if(instagramWrap){
    const syncInstagramFallback=()=>{
      instagramWrap.classList.toggle('embed-unavailable',!instagramWrap.querySelector('iframe'));
    };
    const observer=new MutationObserver(syncInstagramFallback);
    observer.observe(instagramWrap,{childList:true,subtree:true});
    window.addEventListener('error',e=>{if(String(e.filename||'').includes('instagram.com/embed.js'))syncInstagramFallback()},true);
    setTimeout(syncInstagramFallback,3500);
  }
})();
