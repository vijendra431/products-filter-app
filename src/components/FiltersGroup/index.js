import './index.css'

const FiltersGroup = props => {
  const {
    onchangeSearch,
    categoryOptions,
    ratingsList,
    onClickCategory,
    onClickRating,
    activeCategoryId,
    activeRatingId,
    clearAllSameAgain,
    searchInput,
  } = props

  const onChangeSearchInput = event => {
    onchangeSearch(event.target.value)
  }

  const onClickClearAll = () => {
    clearAllSameAgain()
  }
  return (
    <div className="filters-group-container">
      <div className="search-container">
        <input
          type="search"
          placeholder="Search"
          className="input"
          onChange={onChangeSearchInput}
          value={searchInput}
        />
      </div>
      <h2 className="category-heading">Category</h2>
      <ul className="category-list">
        {categoryOptions.map(eachCateory => (
          <li key={eachCateory.categoryId}>
            <button
              className="buttons"
              onClick={() => onClickCategory(eachCateory.categoryId)}
            >
              <p
                className={` ${
                  activeCategoryId === eachCateory.categoryId
                    ? 'active-color'
                    : ''
                }`}
              >
                {eachCateory.name}
              </p>
            </button>
          </li>
        ))}
      </ul>
      <h2 className="rating-heading">Rating</h2>
      <ul className="rating-list">
        {ratingsList.map(eachRating => (
          <li key={eachRating.ratingId} className="row">
            <button
              className={`rating-buttons buttons ${
                activeRatingId === eachRating.ratingId ? 'active-color' : ''
              }`}
              onClick={() => onClickRating(eachRating.ratingId)}
            >
              <img
                src={eachRating.imageUrl}
                alt={`rating ${eachRating.ratingId}`}
                className="rating-images"
              />
              & up
            </button>
          </li>
        ))}
      </ul>
      <button className="clear-button" onClick={onClickClearAll}>
        Clear Filters
      </button>
    </div>
  )
}
export default FiltersGroup
