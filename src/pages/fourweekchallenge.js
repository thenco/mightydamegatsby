import React, { useState, useContext } from "react"
import { DENOMINATION } from "../../providers/dataProvider"
import { FaLongArrowAltLeft } from "react-icons/fa"
import { Link } from "gatsby"
import { v4 as uuid } from "uuid"
import mightyDameWithText from "../images/MightDameWithWords.png"
import { loadStripe } from "@stripe/stripe-js"
import axios from "axios"
import {
  CardElement,
  Elements,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js"
import { ThemeContext } from '../context/mainContext'

const stripePromise = loadStripe(process.env.GATSBY_PK)

// Static purchase items
//
const item1 = {
  id: uuid(),
  image: "",
  name: "Mighty Dame Fitness - Four Week Virtual Fitness Challenge",
  quantity: 1,
  price: 25,
}

const cartItems = [item1]

const completedCart = {
  cart: cartItems,
  numberOfItemsInCart: 1,
  total: item1.price * item1.quantity,
}
//
//

export default function SixWeekChallenge() {
  return <CheckoutWithContext completedCart={completedCart} />
}

function CheckoutWithContext({ completedCart }) {
  return (
    <Elements stripe={stripePromise}>
      <Checkout context={completedCart} />
    </Elements>
  )
}

const Input = ({ onChange, value, name, placeholder, tabIndex }) => (
  <input
    onChange={onChange}
    value={value}
    className="mt-2 text-sm shadow appearance-none border text-primary bg-primary placeholder-textPrimary rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
    type="text"
    placeholder={placeholder}
    name={name}
    tabIndex={tabIndex}
  />
)

const Checkout = ({ context }) => {
  const [errorMessage, setErrorMessage] = useState(null)
  const [orderCompleted, setOrderCompleted] = useState(false)
  const [receipts, setReceipts] = useState([])
  const [input, setInput] = useState({
    name: "",
    email: "",
    street: "",
    city: "",
    postal_code: "",
    province: "",
  })
  const { theme } = useContext(ThemeContext)

  const stripe = useStripe()
  const elements = useElements()

  const onChange = (e) => {
    setErrorMessage(null)
    setInput({ ...input, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const { name, email, street, city, postal_code, province } = input
    const { total, cart } = context

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return
    }

    // Validate input
    if (!name || !email | !street || !city || !postal_code || !province) {
      setErrorMessage("Please fill in the form!")
      return
    }

    const address = {
      line1: street,
      line2: "",
      city: city,
      postal_code: postal_code,
      state: province,
    }

    // Get a reference to a mounted CardElement. Elements knows how
    // to find your CardElement because there can only ever be one of
    // each type of element.
    const cardElement = elements.getElement(CardElement)

    // Use your card Element with other Stripe.js APIs
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
      billing_details: { name: name, email: email, address: address },
    })

    if (error) {
      setErrorMessage(error.message)
      return
    }

    const order = {
      id: uuid(),
      email: email,
      items: cart,
      amount: total,
      currency: "cad",
      address: address,
      payment_method_id: paymentMethod.id,
      receipt_email: email,
    }

    try {
      const data = await axios({
        method: "post",
        url: process.env.GATSBY_PAYMENT_ENDPOINT,
        data: order,
      })
      setOrderCompleted(true)
      setReceipts(data.chargeReceipts)
    } catch (err) {
      throw err.message
    }
  }

  const { total } = context

  const calculateTax = () => {
    // TODO implement different regional tax rates if needed
    // This is only for client viewing. Tax is calculated on the server
    switch (input.province) {
      case "ON":
        return total * 0.13
      default:
        return 0
    }
  }

  if (orderCompleted) {
    return (
      <div className="flex flex-col h-full items-center justify-center">
        <h3 className="font-poppins font-light text-primary">
          Thanks! Your order has been successfully processed.
        </h3>
        <Link className="font-lemon text-primary text-xl my-3" to="/">
          You are a Mighty Dame.
        </Link>
        <div className="mt-5 flex items-center justify-center">
          <p className="mb-3 text-primary">View your receipt here:</p>
          {receipts.map((receipt) => {
            return (
              <a
                className="text-primary text-sm"
                href={receipt}
                rel="noopener noreferrer"
                target="_blank"
              >
                {receipt}
              </a>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center pb-10">
      <div className="flex flex-col w-full max-w-5xl px-5">
        <div className="pt-10 pb-8">
          <h1 className="text-5xl font-light text-primary">Checkout</h1>
          <Link to="/cart">
            <div className="cursor-pointer flex">
              <FaLongArrowAltLeft className="mr-2 text-primary mt-1" />
              <p className="text-primary text-sm">Edit Cart</p>
            </div>
          </Link>
        </div>
        <div className="flex flex-col">
          <div className="">
            <div className="border-b border-accentsPrimary py-10">
              <div className="flex items-center">
                <img
                  className="w-32 m-0"
                  src={mightyDameWithText}
                  alt={item1.name}
                />
                <p className="m-0 pl-10 text-primary text-xl">{item1.name}</p>
                <div className="flex flex-1 justify-end">
                  <p className="m-0 pl-10 text-primary tracking-tighter font-semibold">
                    {DENOMINATION + item1.price}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-1 flex-col md:flex-row">
            <div className="flex flex-1 pt-8 flex-col">
              <div className="mt-4 border-t border-accentsPrimary pt-10">
                <form onSubmit={handleSubmit}>
                  <span className="text-primary">{errorMessage}</span>
                  <Input
                    onChange={onChange}
                    value={input.name}
                    name="name"
                    placeholder="Cardholder name"
                    tabIndex="1"
                  />
                  <CardElement
                    options={{
                      style: {
                        base: {
                          fontSize: "14px",
                          color: theme === 'dark' ? "#eee8df" : "#201d16",
                          "::placeholder": {
                            color: theme === 'dark' ? "#eee8df" : "#201d16",
                          },
                        },
                        invalid: {
                          color: "#9e2146",
                        },
                      },
                    }}
                    className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-primary leading-tight focus:outline-none focus:shadow-outline"
                  />
                  <Input
                    onChange={onChange}
                    value={input.email}
                    name="email"
                    placeholder="Email"
                    tabIndex="1"
                  />
                  <Input
                    onChange={onChange}
                    value={input.street}
                    name="street"
                    placeholder="Street"
                    tabIndex="1"
                  />
                  <Input
                    onChange={onChange}
                    value={input.city}
                    name="city"
                    placeholder="City"
                    tabIndex="1"
                  />
                  <Input
                    onChange={onChange}
                    value={input.province}
                    name="province"
                    placeholder="Province"
                    tabIndex="1"
                  />
                  <Input
                    onChange={onChange}
                    value={input.postal_code}
                    name="postal_code"
                    placeholder="Postal Code"
                    tabIndex="1"
                  />
                  <button
                    type="submit"
                    disabled={!stripe}
                    className="md:block bg-secondary hover:bg-buttonSecondary text-primary font-bold py-2 px-4 mt-4 rounded focus:outline-none focus:shadow-outline"
                    tabIndex="1"
                  >
                    Confirm order
                  </button>
                </form>
              </div>
            </div>
            <div className="md:pt-20">
              <div className="ml-4 pl-2 flex flex-1 justify-end pt-2 md:pt-8 pr-4">
                <p className="text-sm pr-10 text-primary">Subtotal</p>
                <p className="tracking-tighter w-38 flex justify-end text-primary">
                  {DENOMINATION + total}
                </p>
              </div>
              <div className="ml-4 pl-2 flex flex-1 justify-end pr-4">
                <p className="text-sm pr-10 text-primary">HST</p>
                <p className="tracking-tighter w-38 flex justify-end text-primary">
                  {DENOMINATION + calculateTax()}
                </p>
              </div>
              <div className="md:ml-4 pl-2 flex flex-1 justify-end bg-gray-200 pr-4 pt-6">
                <p className="text-sm pr-10 text-primary">Total</p>
                <p className="font-semibold tracking-tighter w-38 flex justify-end text-primary">
                  {DENOMINATION + (total + calculateTax())}
                </p>
              </div>
              <button
                type="submit"
                disabled={!stripe}
                className="nav:hidden bg-secondary hover:bg-buttonSecondary text-primary font-bold py-2 px-4 mt-4 rounded focus:outline-none focus:shadow-outline"
                tabIndex="1"
                onClick={handleSubmit}
              >
                Confirm order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}