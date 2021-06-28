class SearchView {
  _parentElement = document.querySelector(".search");

  getQuery() {
    const query = document.querySelector(".search__field").value;
    this._clear();
    return query;
  }
  _clear() {
    this._parentElement.querySelector(".search__field").value = "";
  }

  addHandelerRender(handler) {
    this._parentElement.addEventListener("submit", function (e) {
      e.preventDefault();
      handler();
    });
  }
}
export default new SearchView();
