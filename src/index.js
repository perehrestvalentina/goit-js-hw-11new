import './css/common.css';
import { createImageEl } from './js/markup';
import Notiflix from 'notiflix';
import { searchForm, galleryRef, loadRef }from './js/getRefs';
import { getPictures, page, query } from './js/fetchApi';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

let lightbox = new SimpleLightbox('.gallery a');

searchForm.addEventListener('submit', onSearch);
loadRef.addEventListener('click', onLoadMore);
loadRef.classList.add('is-hidden');

async function onSearch(e) {
    e.preventDefault();

    searchQuery = e.currentTarget.elements.searchQuery.value.trim().toLowerCase();

  if (!searchQuery) {    
    Notiflix.Notify.failure('Enter a search query!');
    return;}

    try {
      const searchData = await getPictures(searchQuery);
      const {hits, totalHits} = searchData;
      if (hits.length === 0){
        Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.');
      return;
    }
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
    const markup = hits.map(item => createImageEl(item)).join('');

    galleryRef.innerHTML = markup;

    if (totalHits > 40){
      loadRef.classList.remove('js-load-btn');
      page+=1;
    }
    lightbox.refresh();
  } catch(error){ 
       Notiflix.Notify.failure('Something went wrong! Please retry');
    console.log(error);
  }
}
 

async function onLoadMore() {
    
  const response = await getPictures(query);
  const { hits, totalHits }= response;
  const markup = hits.map(item => createImageEl(item)).join('');
  galleryRef.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
  const amountOfPages = totalHits / 40 - page;

  if (amountOfPages < 1) {
    loadRef.classList.add('js-load-btn');
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
  } 
  scroll();
};

function scroll() {
  const {height: cardHeight} = document.querySelector('.gallery').firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 1,
    behavior: 'smooth',
  });
};


