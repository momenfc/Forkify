import View from '../../js/views/Veiws';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');
  _data;
  _errorMessage = 'OH! something went wrong!';

  _generateMarkup() {
    const curPage = this._data.page;

    if (this._data.pagesCount === 0) return '';

    // curPage === 1
    if (curPage === 1)
      return `
            <button class="btn--inline pagination__btn pagination__btn--next" data-page="${
              curPage + 1
            }">
                <span>Page ${curPage + 1}</span>
                <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
                </svg>
            </button>
        `;

    // curPage  === lastpage
    if (curPage === this._data.pagesCount)
      return `
            <button class="btn--inline pagination__btn pagination__btn--prev" data-page="${
              curPage - 1
            }">
                <span>Page ${curPage - 1}</span>
                <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
                </svg>
            </button>
        `;

    // curPage between first page and last page
    if (curPage > 1 && curPage < this._data.pagesCount)
      return `
            <button class="btn--inline pagination__btn pagination__btn--next" data-page="${
              curPage + 1
            }">
                <span>Page ${curPage + 1}</span>
                <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
                </svg>
            </button>
            <button class="btn--inline pagination__btn pagination__btn--prev" data-page="${
              curPage - 1
            }">
                <span>Page ${curPage - 1}</span>
                <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
                </svg>
            </button>
        `;
  }

  addHandelerRender(handeler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.pagination__btn');
      if (!btn) return;
      const page = +btn.dataset.page;
      handeler(page);
    });
  }
}

export default new PaginationView();
