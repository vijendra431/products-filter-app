import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import FiltersGroup from '../FiltersGroup'
import ProductCard from '../ProductCard'
import ProductsHeader from '../ProductsHeader'

import './index.css'

const categoryOptions = [
  {
    name: 'Clothing',
    categoryId: '1',
  },
  {
    name: 'Electronics',
    categoryId: '2',
  },
  {
    name: 'Appliances',
    categoryId: '3',
  },
  {
    name: 'Grocery',
    categoryId: '4',
  },
  {
    name: 'Toys',
    categoryId: '5',
  },
]

const sortbyOptions = [
  {
    optionId: 'PRICE_HIGH',
    displayText: 'Price (High-Low)',
  },
  {
    optionId: 'PRICE_LOW',
    displayText: 'Price (Low-High)',
  },
]

const ratingsList = [
  {
    ratingId: '4',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-four-stars-img.png',
  },
  {
    ratingId: '3',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-three-stars-img.png',
  },
  {
    ratingId: '2',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-two-stars-img.png',
  },
  {
    ratingId: '1',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-one-star-img.png',
  },
]

const apiStatusConstats = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  progress: 'PROGRESS',
}
class AllProductsSection extends Component {
  state = {
    productsList: [],
    isLoading: false,
    activeOptionId: sortbyOptions[0].optionId,
    searchInput: '',
    activeCategoryId: categoryOptions[0].categoryId,
    activeRatingId: ratingsList[0].ratingId,
    apiStatus: apiStatusConstats.initial,
  }

  onchangeSearch = searchInput => {
    this.setState({searchInput: searchInput}, this.getProducts)
  }

  onClickCategory = id => {
    this.setState({activeCategoryId: id}, this.getProducts)
  }

  onClickRating = id => {
    this.setState({activeRatingId: id}, this.getProducts)
  }

  clearAllSameAgain = () => {
    this.setState(
      {
        isLoading: false,
        activeOptionId: sortbyOptions[0].optionId,
        searchInput: '',
        activeCategoryId: categoryOptions[0].categoryId,
        activeRatingId: ratingsList[0].ratingId,
        apiStatus: '',
      },
      this.getProducts,
    )
  }

  componentDidMount() {
    this.getProducts()
  }

  getProducts = async () => {
    const {searchInput, activeCategoryId, activeRatingId} = this.state

    this.setState({
      isLoading: true,
    })
    const jwtToken = Cookies.get('jwt_token')

    const {activeOptionId} = this.state
    const apiUrl = `https://apis.ccbp.in/products?sort_by=${activeOptionId}&title_search=${searchInput}&category=${activeCategoryId}&rating=${activeRatingId}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.products.map(product => ({
        title: product.title,
        brand: product.brand,
        price: product.price,
        id: product.id,
        imageUrl: product.image_url,
        rating: product.rating,
      }))
      this.setState({
        productsList: updatedData,
        isLoading: false,
        apiStatus: apiStatusConstats.success,
      })
    } else if (response.ok === false) {
      this.setState({apiStatus: apiStatusConstats.failure})
    }
  }

  changeSortby = activeOptionId => {
    this.setState({activeOptionId}, this.getProducts)
  }

  renderProductsList = () => {
    const {productsList, activeOptionId} = this.state

    if (productsList.length === 0) {
      return this.renderNoProductsView()
    }

    return (
      <div className="all-products-container">
        <ProductsHeader
          activeOptionId={activeOptionId}
          sortbyOptions={sortbyOptions}
          changeSortby={this.changeSortby}
        />
        <ul className="products-list">
          {productsList.map(product => (
            <ProductCard productData={product} key={product.id} />
          ))}
        </ul>
      </div>
    )
  }

  renderLoader = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => {
    return (
      <div className="failure-container">
        <div className="failure-container2">
          <img
            src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-products-error-view.png"
            alt="products failure"
            className="failure-image"
          />
          <h2 className="failure-heading">Oops! Something Went Wrong</h2>
          <p className="para">
            We are having some trouble processing you request.
          </p>
          <p className="para">Please try again .</p>
        </div>
      </div>
    )
  }

  renderNoProductsView = () => {
    return (
      <div className="no-products-container">
        <div className="no-products-container2">
          <img
            src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-no-products-view.png"
            alt="no products"
            className="no-products-image"
          />
          <h2 className="failure-heading">No Products Found</h2>
          <p className="para">
            We could not find any products. Try other filters
          </p>
        </div>
      </div>
    )
  }

  renderAllViews = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstats.success:
        return this.renderProductsList()
      case apiStatusConstats.failure:
        return this.renderFailureView()
      case apiStatusConstats.progress:
        return this.renderLoader()
      default:
        return null
    }
  }

  render() {
    const {
      isLoading,
      activeCategoryId,
      activeRatingId,
      searchInput,
      productsList,
    } = this.state

    return (
      <div className="all-products-section">
        <FiltersGroup
          activeCategoryId={activeCategoryId}
          activeRatingId={activeRatingId}
          onchangeSearch={this.onchangeSearch}
          categoryOptions={categoryOptions}
          ratingsList={ratingsList}
          onClickCategory={this.onClickCategory}
          onClickRating={this.onClickRating}
          clearAllSameAgain={this.clearAllSameAgain}
          searchInput={searchInput}
        />

        {this.renderAllViews()}
      </div>
    )
  }
}

export default AllProductsSection
