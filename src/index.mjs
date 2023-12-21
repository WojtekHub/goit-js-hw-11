import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector('#search-form');
const input = document.querySelector('input[name="searchQuery"]');
const placeForImg = document.querySelector('.gallery');
const moreBtn = document.querySelector('.load-more');
const apiKey = '41167232-e4ed0bcecad469809d9012c23';
let currentPage = 1;
let searchingValue = '';
let pageLimit = 40;
let lightbox;

function searchImages(query, page = 1) {
  const apiUrl = `https://pixabay.com/api/?key=${apiKey}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${pageLimit}`;
  return axios
    .get(apiUrl)
    .then(res => {
      const data = res.data;
      if (data.hits && data.hits.length > 0) {
        const html = data.hits.map(
          ({
            largeImageURL,
            webformatURL,
            tags,
            likes,
            views,
            comments,
            downloads,
          }) => {
            return `<div class="photo-card"><a href="${largeImageURL}">
          <img src="${webformatURL}" alt="${tags}" loading="lazy" />
          <div class="info">
            <p class="info-item">
              <b>Likes: ${likes}</b>
            </p>
            <p class="info-item">
              <b>Views: ${views}</b>
            </p>
            <p class="info-item">
              <b>Comments: ${comments}</b>
            </p>
            <p class="info-item">
              <b>Downloads: ${downloads}</b>
            </p>
          </div>
          </a>
        </div>`;
          }
        );
        if (page === 1) {
          placeForImg.innerHTML = html.join('');
          creatingLightbox();
        } else {
          placeForImg.innerHTML += html.join('');
          lightbox.refresh();
        }
        if (data.totalHits <= page * pageLimit) {
          Notiflix.Notify.info(
            "We're sorry, but you've reached the end of search results."
          );
          moreBtn.style.display = 'none';
        } else {
          moreBtn.style.display = 'block';
        }
      } else {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      Notiflix.Report.failure('Error fetching data');
    });
}

form.addEventListener('submit', ev => {
  placeForImg.innerHTML = '';
  ev.preventDefault();
  searchingValue = input.value;
  currentPage = 1;
  searchImages(searchingValue, currentPage);
});
moreBtn.addEventListener('click', () => {
  moreBtn.style.display = 'none';
  currentPage++;
  searchImages(searchingValue, currentPage);
});

function creatingLightbox() {
  lightbox = new SimpleLightbox('.gallery a', {
    captions: true,
    captionsData: 'alt',
    captionDelay: 250,
  });
}
