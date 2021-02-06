import React, { useContext } from "react"
import { CartContext } from "../context/mainContext"
import { FaTimes, FaLongArrowAltRight } from "react-icons/fa"
import { Link } from "gatsby"
import CartLink from "../components/common/CartLink"
import QuantityPicker from "../components/common/QuantityPicker"
import { makeSlug } from "../libs/stringLib"
import Image from "../components/common/Image"
import { DENOMINATION } from "../libs/constants"

export default function Cart() {
  const {
    quantityOfItems,
    items,
    removeFromCart,
    total,
    setItemQuantity,
  } = useContext(CartContext)

  const cartEmpty = quantityOfItems === Number(0)

  function increment(item) {
    item.quantity = item.quantity + 1
    setItemQuantity(item)
  }

  function decrement(item) {
    if (item.quantity === 1) return
    item.quantity = item.quantity - 1
    setItemQuantity(item)
  }

  return (
    <>
      <CartLink />
      <div className="flex flex-col items-center pb-10">
        <div
          className="
          flex flex-col w-full
          max-w-5xl
        "
        >
          <div className="pt-10 pb-8">
            <h1 className="text-5xl font-light text-primary">Your Cart</h1>
          </div>

          {cartEmpty ? (
            <h3 className="text-primary">No items in cart.</h3>
          ) : (
            <div className="flex flex-col">
              <div className="">
                {items &&
                  items.map((item) => {
                    return (
                      <div className="border-b py-10" key={item.id}>
                        {/* Responsive - Desktop */}
                        <div className="items-center hidden md:flex">
                          <Link to={makeSlug(item.name)}>
                            <Image
                              className="w-32 m-0"
                              src={item.image}
                              alt={item.name}
                            />
                          </Link>
                          <Link to={makeSlug(item.name)}>
                            <p
                              className="
                              m-0 pl-10 text-primary text-opacity-75 text-sm w-56
                              "
                            >
                              {item.name}
                            </p>
                          </Link>
                          <div className="ml-4">
                            <QuantityPicker
                              numberOfitems={item.quantity}
                              increment={() => increment(item)}
                              decrement={() => decrement(item)}
                            />
                          </div>
                          <div className="flex flex-1 justify-end">
                            <p className="m-0 pl-10 text-primary text-opacity-90 tracking-tighter font-semibold">
                              {DENOMINATION + item.price}
                            </p>
                          </div>
                          <div
                            role="button"
                            tabIndex="0"
                            onKeyDown={() => removeFromCart(item)}
                            onClick={() => removeFromCart(item)}
                            className="
                            m-0 ml-10 text-primary text-opacity-90 text-s cursor-pointer
                            "
                          >
                            <FaTimes />
                          </div>
                        </div>

                        {/* Responsive - Mobile */}
                        <div className="flex items-center md:hidden">
                          <Link to={makeSlug(item.name)}>
                            <Image
                              className="w-32 m-0"
                              src={item.image}
                              alt={item.name}
                            />
                          </Link>
                          <div>
                            <Link to={makeSlug(item.name)}>
                              <p
                                className="
                                m-0 pl-6 text-primary text-opacity-75 text-base
                                "
                              >
                                {item.name}
                              </p>
                            </Link>
                            <div className="ml-6 mt-4 mb-2">
                              <QuantityPicker
                                hideQuantityLabel
                                numberOfitems={item.quantity}
                                increment={() => increment(item)}
                                decrement={() => decrement(item)}
                              />
                            </div>
                            <div className="flex flex-1">
                              <p className="text-lg m-0 pl-6 pt-4 text-primary text-opacity-90 tracking-tighter font-semibold">
                                {DENOMINATION + item.price}
                              </p>
                            </div>
                          </div>
                          <div
                            role="button"
                            tabIndex="0"
                            onKeyDown={() => removeFromCart(item)}
                            onClick={() => removeFromCart(item)}
                            className="
                            m-0 ml-10 text-primary text-opacity-90 text-s cursor-pointer mr-2
                            "
                          >
                            <FaTimes />
                          </div>
                        </div>
                      </div>
                    )
                  })}
              </div>
            </div>
          )}
          <div className="flex flex-1 justify-end py-8">
            <p className="text-sm pr-10 text-primary">Total</p>
            <p className="font-semibold text-primary tracking-tighter">
              {DENOMINATION + total}
            </p>
          </div>
          {!cartEmpty && (
            <Link to="/checkout" className="flex flex-1 justify-end">
              <div className="cursor-pointer flex">
                <p className="text-primary text-opacity-75 text-sm mr-2">
                  Proceed to check out
                </p>
                <FaLongArrowAltRight className="text-primary text-opacity-75 mt-1" />
              </div>
            </Link>
          )}
        </div>
      </div>
    </>
  )
}
