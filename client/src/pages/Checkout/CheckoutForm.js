import React, { useEffect, useState } from 'react'
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import './checkout.css'
import { useDispatch, useSelector } from 'react-redux'
import { CREATE_ORDER_RESET } from '../../redux/constants/orderConstants'
import { createOrder } from '../../redux/actions/orderActions'

export default function CheckoutForm({ orderDetails, clientSecret }) {
    const stripe = useStripe()
    const elements = useElements()
    const dispatch = useDispatch()

    const { userInfo } = useSelector((state) => state.loginUser)
    const { newOrder } = useSelector((state) => state.createOrder)

    const address = JSON.parse(sessionStorage.getItem('shippingAddress'))
    const { main, ...shippingAddress } = address

    const [message, setMessage] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (!stripe) {
            return
        }

        const clientSecret = sessionStorage.getItem('client_secret')

        if (!clientSecret) {
            return
        }

        stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
            switch (paymentIntent.status) {
                case 'succeeded':
                    setMessage('Payment succeeded!')
                    orderDetails.paymentStatus = {
                        id: paymentIntent.id,
                        status: paymentIntent.status,
                    }

                    dispatch(createOrder(orderDetails))

                    break
                case 'processing':
                    setMessage('Your payment is processing.')
                    break
                case 'requires_payment_method':
                    setMessage(
                        'Your payment was not successful, please try again.'
                    )
                    break
                default:
                    setMessage('Something went wrong.')
                    break
            }
        })
    }, [stripe])

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!stripe || !elements) {
            // Stripe.js has not yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            return
        }

        setIsLoading(true)

        const result = await stripe.confirmPayment({
            elements,
            billing_details: {
                address: {
                    city: shippingAddress.city,
                    state: shippingAddress.state,
                },
                email: userInfo.email,
            },
            confirmParams: {
                // Make sure to change this to your payment completion page
                return_url: 'http://localhost:3000',
            },
        })

        // This point will only be reaxched if there is an immediate error when
        // confirming the payment. Otherwise, your customer will be redirected to
        // your `return_url`. For some payment methods like iDEAL, your customer will
        // be redirected to an intermediate site first to authorize the payment, then
        // redirected to the `return_url`.
        // if (error.type === 'card_error' || error.type === 'validation_error') {
        //     setMessage(error.message)
        // } else {
        //     setMessage('An unexpected error occurred.')
        // }

        if (result.error) {
            console.log(result.error)
        }

        setIsLoading(false)
    }

    const paymentElementOptions = {
        layout: 'tabs',
    }

    return (
        <form
            className="checkoutForm"
            id="payment-form"
            onSubmit={handleSubmit}
        >
            <PaymentElement
                id="payment-element"
                options={paymentElementOptions}
            />
            <button
                className="checkoutButton"
                disabled={isLoading || !stripe || !elements}
                id="submit"
            >
                <span id="button-text">
                    {isLoading ? (
                        <div className="spinner" id="spinner"></div>
                    ) : (
                        'Pay now'
                    )}
                </span>
            </button>
            {/* Show any error or success messages */}
            {message && <div id="payment-message">{message}</div>}
        </form>
    )
}
