import React, { useEffect, useState, useContext } from "react"
import { CartContext } from "../../context/mainContext"
import ButtonTwo from '../common/ButtonTwo'

export default function ProgramShowcase(props) {
  const { addToCart, setItemQty } = useContext(CartContext)
  const {
    id,
    title,
    image,
    otherImages,
    description,
    numberOfSessions,
    lengthOfSessionInHours,
    frequencyOfSessionsPerWeek,
    price,
    available,
  } = props

  const [mainImageState, setMainImageState] = useState(null)
  const [otherImagesState, setOtherImagesState] = useState([])

  useEffect(() => {
    // console.log(props)
    setMainImageState(image)
    setOtherImagesState([image, ...otherImages])
  }, [])

  const addItemToCart = () => {
    const newItem = {
      id: id,
      name: title,
      quantity: 1,
      price: price,
      image: image
    }
    addToCart(newItem)
  }

  const zoomIn = (e) => {
    // console.log(e)
    // TODO Implement zoom on mouse hover
  }

  return (
    <div className="grid cardgrid-wide cardgrid-narrow mb-20">
      <div className="min-w-88 w-auto max-w-5xl h-auto my-2 nav:ml-5 nav:mr-1 rounded-md">
        <img
          className="w-full h-full object-contain rounded-md"
          src={mainImageState}
          alt={title}
          onMouseOver={zoomIn} // ? Not sure if this is the right event to handle the zoom-on-hover
        />
      </div>
      <div className="rounded-md w-auto flex flex-nowrap nav:flex-col nav:max-h-104 nav:w-full justify-center nav:justify-start nav:pt-2 items-center">
        {otherImagesState &&
        otherImagesState[0] !== "unset" && // TODO This is a dirty hack to deal with graphql schema not building when field returns null. Change in DynamoDB as well.
          otherImagesState.map((imagePath, index) => {
            return (
              <div key={index} className={`h-20 w-auto`}>
                <img
                  className={`h-full w-auto object-contain hover:opacity-75`}
                  src={imagePath}
                  alt="other product views"
                  onClick={() => setMainImageState(imagePath)}
                />
              </div>
            )
          })}
      </div>
      <div className="flex flex-col p-5 items-center">
        <h3 className="font-lemon text-2xl text-center text-primary my-3">
          {title}
        </h3>
        <p className="my-2 text-center text-primary text-base font-light">
          {description}
        </p>

        <div className="my-2 flex flex-col items-center">
          <span className="my-1 text-primary">
            Number of Sessions: {numberOfSessions}
          </span>
          <span className="my-1 text-primary">
            Hours per Session: {lengthOfSessionInHours}
          </span>
          <span className="my-1 text-primary">
            Sessions per Week: {frequencyOfSessionsPerWeek}
          </span>
        </div>

        <div className="flex flex-col my-3 items-center">
          <span className="my-1 text-primary">{"$" + price}</span>
          <span className="my-1 text-primary">
            {available ? "" : "Coming SOON"}
          </span>
        </div>
        <ButtonTwo callBack={addItemToCart} type="button" innerText="Purchase a Spot"  />
      </div>
    </div>
  )
}
