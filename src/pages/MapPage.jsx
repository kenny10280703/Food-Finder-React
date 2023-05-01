import React, { Component } from 'react'
import Header from '../components/Header';
import PageBody from '../components/pageBody/PageBody'
import { Link } from 'react-router-dom'
import GoogleMapReact from 'google-map-react';
import Marker from '../components/marker/Marker'

export default function MapPage (){
  // set the map centre to be user's current location, pass to the Map API
  const [centre, setCentre] = React.useState()
  const zoom = 17
  const [allRestaurants, setAllRestaurants] = React.useState([])
  const [filterData, setFilterData] = React.useState({
    cuisine: "none",
    price: "none",
    rating: "none",
  })


  // get user's current location when the map page first rendered
  React.useEffect(() => {
    getLocation()
  }, [])

  // make sure that only make API call when user's current location is available
  React.useEffect(() => {
    if(centre){
      getRestaurants()
    }
  }, [centre])

  React.useEffect(() => {
    updateRestaurantsShown()
  }, [filterData])


  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
        function(position) {
            setCentre([position.coords.latitude, position.coords.longitude])
        }, 
        function(error) {
            console.log(error)
        }
    )
}

  const getRestaurants = async() => {
    try{
        const res = await fetch("localhost:9090/food_finder/restaurants", 
        {
            method: "POST",
            body: JSON.stringify({lat: centre[0], lng: centre[1]})
        }
        )
        setAllRestaurants(await res.json())
        console.log(allRestaurants)
    } catch(error) {
        console.log("error")
    }
}

  function toggle(id) {
    setAllRestaurants(prevState => {
      return prevState.map(state => {
        return state.id === id ? {...state, show: true} : {...state, show: false}
      })
    })
  }
  
    // This function will be passed to Page Body component to keep unified state values in the parent
    const handleChange = (event) => {
      setFilterData(prevFilterData => {
        const { name, value } = event.target
        return {...prevFilterData, [name]: value}
      })
    }

    const updateRestaurantsShown = () => {
      setAllRestaurants(prevState => {
        return prevState.map(state => {
          if (filterData.cuisine != "none" && !(state.cuisine === filterData.cuisine)) {
            return {
              ...state,
              filtered: true
            }
          } else if(filterData.price != "none" && !inPriceRange(filterData.price, state.averageDishCost)) {
            return {
              ...state,
              filtered: true
            }
          } else if(filterData.rating != "none" && !inRatingRange(filterData.rating, state.rating)) {
            return {
              ...state,
              filtered: true
            }
          } else {
            return {
              ...state,
              filtered: false
            }
          }
          }
        )
      })
    }


    // return true if the price falls in the filter range
    const inPriceRange = (range, value) => {
      let numberRange
      if (range === "range1") {
        numberRange = {min: 1, max: 10}
      } else if (range == "range2") {
        numberRange = {min: 11, max: 20}
      } else if (range === "range3") {
        numberRange = {min: 21, max: Infinity}
      } else {
        numberRange = {min: 1, max: Infinity}
      }
      return value >= numberRange.min && value < numberRange.max
    }

    // return true if the rating of that restaurant is equal or greater than the selected rating filter
    const inRatingRange = (filterRating, restaurantRating) => {
      const roundedRating = (Number(filterRating))
      return restaurantRating >= roundedRating
    }

  return (
    <div>
      <Header />
      <PageBody
        handleChange={handleChange}
        value={filterData}
        restaurantInfo={allRestaurants}
      />
      <button><Link to={`../restaurants`}>To list page</Link></button>
      <div style={{ height: '100vh', width: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: "" }}
          center={centre}
          zoom={zoom}
          >
          {allRestaurants.map( restaurant => {
            if (!restaurant.filtered) {
              return (
                <Marker
                  key={restaurant.id}   
                  lat={restaurant.lat}
                  lng={restaurant.lng}
                  restaurantInfo={restaurant}
                  show={restaurant.show}
                  toggle={()=> toggle(restaurant.id)}
                />
              )
            }
          }
          )}
        </GoogleMapReact>
      </div>
    </div>
  )
}