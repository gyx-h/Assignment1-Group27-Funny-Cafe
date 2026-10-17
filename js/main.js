/*Navigation: Hamburger menu*/
const menuBtn=document.getElementById('menuBtn');
const navList=document.getElementById('navList');
if(menuBtn && navList){
    menuBtn.addEventListener('click',()=>{
        const expanded=menuBtn.getAttribute('aria-expanded')==='true';
        menuBtn.setAttribute('aria-expanded',String(!expanded));
        navList.classList.toggle('active');
    });
}
/*Mobile dropdown menu*/
document.querySelectorAll('.has-dropdown > a').forEach(link=>{
    link.addEventListener('click', function (e){
        if(window.innerWidth<=900){
            e.preventDefault();
            this.parentElement.classList.toggle('open');
        }
    });
});
/*Smooth scrolling (in-page anchors)*/
document.querySelectorAll('a[href^="#"]').forEach(anchor=>{
    anchor.addEventListener('click',function (e){
        const href=this.getAttribute('href');
        if (href==='#') return;
        const target=document.querySelector(href);
        if(target){
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
            if(navList) navList.classList.remove('active');
        }
    });
});
/* Back to top*/
/* Fix note (the real reason the button did not respond):
   The original code used navTarget(#mainNav).scrollIntoView() to return to the top.
   But #mainNav (the navigation header) uses position: sticky, so it is already stuck to the top of the viewport.
   The browser considers the "target already in its intended position", so almost no scrolling occurs -> it looks like clicking does nothing.
   Change it to window.scrollTo to directly smooth-scroll to the very top of the page. */
const backTopBtn=document.getElementById('backTopBtn');
if(backTopBtn){
    // Show the button only after scrolling down more than 300px; otherwise hide it
    window.addEventListener('scroll',()=>{
        backTopBtn.style.display = window.scrollY > 300 ? 'block' : 'none';
    });
    // On click -> smoothly scroll back to the top of the page
    backTopBtn.addEventListener('click',()=>{
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}
/*Generic form submission (with in-page success message)*/
document.querySelectorAll('form[data-demo-form]').forEach(form=>{
    form.addEventListener('submit',e=>{
        e.preventDefault();
        if(!form.checkValidity()){
            form.reportValidity();
            return;
        }
        const formId=form.id;
        if(formId==='reserveForm'){
            showReserveConfirmation(form);
        } 
        else{
            showGenericSuccess(form,'Message sent! We\'ll get back to you shortly.');
        }
        form.reset();
    });
});
/*Reservation confirmation message*/
/* Fix note: The original code read #reserveTime, but that control does not exist on the reservation page at all.
   The actual fields are #reserveDate (date) and #reserveHour (time),
   so "Date & time" in the confirmation message was always empty. This now reads the fields that actually exist. */
function showReserveConfirmation(form){
    const date=form.querySelector('#reserveDate')?.value || '';
    const hour=form.querySelector('#reserveHour')?.value || '';
    const guests=form.querySelector('#guests')?.value || '';
    const msg=document.createElement('div');
    msg.setAttribute('role', 'alert');
    msg.className='form-success';
    msg.innerHTML=`
        <p><strong>Reservation confirmed!</strong></p>
        <p>Date: ${date} | Time: ${hour} | Guests: ${guests}</p>
        <p>We\'ll send a confirmation to your phone number.</p>
        <button type="button" class="btn btn-sm" aria-label="Close confirmation">OK</button>
    `;
    form.parentNode.insertBefore(msg, form.nextSibling);
    msg.querySelector('button').addEventListener('click',()=>msg.remove());
    setTimeout(()=>msg.remove(),8000);
}
/*Generic success message*/
function showGenericSuccess(form, text){
    const msg=document.createElement('div');
    msg.setAttribute('role', 'alert');
    msg.className='form-success';
    msg.innerHTML=`<p>${text}</p><button type="button" class="btn btn-sm" aria-label="Close">OK</button>`;
    form.parentNode.insertBefore(msg, form.nextSibling);
    msg.querySelector('button').addEventListener('click',()=>msg.remove());
    setTimeout(()=>msg.remove(),6000);
}
/*Photo theme reservation redirect (only takes effect on photo.html)*/
/* Fix note: The original URL was written as reserve.html#seat?theme=xxx, placing the #seat anchor before the ? query parameter.
   This is invalid: the browser treats everything after # as the anchor, so the theme parameter can never be read.
   The correct order is "query parameter ? first, anchor # second": reserve.html?theme=xxx#seat */
document.querySelectorAll('.book-theme-btn').forEach(btn=>{
    btn.addEventListener('click',()=>{
        const theme=btn.dataset.theme || 'Photo Corner Seat';
        const url=`reserve.html?theme=${encodeURIComponent(theme)}#seat`;
        window.location.href=url;
    });
});
/* If currently on reserve.html, read the URL parameter and automatically select the seat type */
if(window.location.pathname.includes('reserve.html')){
    const params=new URLSearchParams(window.location.search);
    const theme=params.get('theme');
    if(theme){
        const seatSelect=document.getElementById('seatType');
        if(seatSelect){
            for(const opt of seatSelect.options){
                if(opt.text.includes('Photo')){
                    opt.selected=true;
                    break;
                }
            }
        }
        /* Scroll to the reservation form */
        const seatSection=document.getElementById('seat');
        if(seatSection){
            setTimeout(()=>seatSection.scrollIntoView({ behavior: 'smooth' }),300);
        }
    }
}
// Share your photo modal interaction logic
const shareBtn=document.querySelector('#gallery .btn.btn-sm');
const shareOverlay=document.getElementById('customizeOverlay');
const shareCloseBtn=document.querySelector('.customize-close');
const shareSubmitBtn=document.getElementById('shareSubmitBtn');
const shareNameInput=document.getElementById('shareName');
const shareDescInput=document.getElementById('shareDesc');
if(shareBtn && shareOverlay){
    shareBtn.addEventListener('click',()=>{
        shareOverlay.classList.add('active');
    });
}
if(shareCloseBtn && shareOverlay){
    shareCloseBtn.addEventListener('click',()=>{
        shareOverlay.classList.remove('active');
    });
}
if(shareOverlay){
    shareOverlay.addEventListener('click',(e)=>{
        if(e.target===shareOverlay){
            shareOverlay.classList.remove('active');
        }
    });
}
if(shareSubmitBtn){
    shareSubmitBtn.addEventListener('click',()=>{
        const name=shareNameInput.value.trim();
        const desc=shareDescInput.value.trim();
        if(!name || !desc){
            alert('Please fill in both your name and a description.');
            return;
        }
        alert(`Thanks @${name}! Your photo has been shared.`);
        shareNameInput.value='';
        shareDescInput.value='';
        shareOverlay.classList.remove('active');
    });
}