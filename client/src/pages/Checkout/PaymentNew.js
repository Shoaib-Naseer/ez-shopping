import React, { Fragment, useEffect, useRef } from 'react'
// import CheckoutSteps from '../Cart/CheckoutSteps';
import { useSelector, useDispatch } from 'react-redux'
// import MetaData from '../layout/MetaData';
import { Typography } from '@mui/material'
import { clearCart } from '../../redux/actions/cartActions'
import { CREATE_ORDER_RESET } from '../../redux/constants/orderConstants'

import { createOrder } from '../../redux/actions/orderActions'
import { useAlert } from 'react-alert'
import {
    CardNumberElement,
    CardCvcElement,
    CardExpiryElement,
    useStripe,
    useElements,
} from '@stripe/react-stripe-js'

import axios from 'axios'
import './payment.css'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import EventIcon from '@mui/icons-material/Event'
import VpnKeyIcon from '@mui/icons-material/VpnKey'
// import { createOrder, clearErrors } from '../../actions/orderAction';

const PaymentNew = ({ history }) => {
    const orderInfo = JSON.parse(sessionStorage.getItem('orderInfo'))

    const dispatch = useDispatch()
    const alert = useAlert()
    const stripe = useStripe()
    const elements = useElements()
    const payBtn = useRef(null)

    const { cartItems } = useSelector((state) => state.cart)
    const { userInfo } = useSelector((state) => state.loginUser)
    const { newOrder } = useSelector((state) => state.createOrder)

    const address = JSON.parse(sessionStorage.getItem('shippingAddress'))
    const { main, ...shippingAddress } = address

    const totalItemsPrice = () => {
        let total = cartItems.reduce(
            (price, item) => item.price * item.qty + price,
            0
        )
        return total
    }
    const paymentData = {
        amount: totalItemsPrice(),
    }

    const vat = () => {
        let tax = (totalItemsPrice() * 3) / 100
        return tax
    }

    const totalPrice = () => {
        let total = totalItemsPrice() + shippingFee + vat()
        console.log(total)
        return total.toFixed(2)
    }

    const shippingFee = 100
    let orderDetails = {
        shippingAddress,
        orderItems: cartItems,
        itemsPrice: totalItemsPrice(),
        shippingFee,
        taxFee: vat(),
        totalPrice: totalPrice(),
        user: userInfo._id,
    }

    const submitHandler = async (e) => {
        e.preventDefault()

        payBtn.current.disabled = true

        try {
            const { data } = await axios.post(
                'http://localhost:3001/api/payment/process',
                paymentData
            )

            const client_secret = data.client_secret

            if (!stripe || !elements) return

            const result = await stripe.confirmCardPayment(client_secret, {
                payment_method: {
                    card: elements.getElement(CardNumberElement),
                    billing_details: {
                        firstName: userInfo.firstName,
                        lastName: userInfo.lastName,
                        email: userInfo.email,
                    },
                    address: {
                        line1: shippingAddress.address,
                        city: shippingAddress.city,
                        state: shippingAddress.state,
                    },
                },
            })

            if (result.error) {
                payBtn.current.disabled = false
                console.log(result.error.message)
                console.log(userInfo.firstName)
                alert.error(result.error.message)
            } else {
                if (result.paymentIntent.status === 'succeeded') {
                    orderDetails.paymentInfo = {
                        id: result.paymentIntent.id,
                        status: result.paymentIntent.status,
                    }

                    dispatch(createOrder(orderDetails))

                    history.push('/success')
                } else {
                    alert.error("There's some issue while processing payment ")
                }
            }
        } catch (error) {
            payBtn.current.disabled = false
            alert.error(error.response.data.message)
        }
    }

    useEffect(() => {
        if (newOrder && newOrder.paymentStatus) {
            history.replace(`/account/order/${newOrder._id}`)
            dispatch({ type: CREATE_ORDER_RESET })
            dispatch(clearCart())
        }
    }, [dispatch, history, newOrder])

    // useEffect(() => {
    //     if (error) {
    //         alert.error(error)
    //         dispatch(clearErrors())
    //     }
    // }, [dispatch, error, alert])

    return (
        <Fragment>
            {/* <MetaData title="Payment" /> */}
            {/* <CheckoutSteps activeStep={2} /> */}
            <div className="paymentContainer">
                <form
                    className="paymentForm"
                    onSubmit={(e) => submitHandler(e)}
                >
                    <Typography>Card Info</Typography>
                    <div>
                        <CreditCardIcon />
                        <CardNumberElement className="paymentInput" />
                    </div>
                    <div>
                        <EventIcon />
                        <CardExpiryElement className="paymentInput" />
                    </div>
                    <div>
                        <VpnKeyIcon />
                        <CardCvcElement className="paymentInput" />
                    </div>

                    <input
                        type="submit"
                        value={`Pay - Rs ${totalItemsPrice()}`}
                        ref={payBtn}
                        className="paymentFormBtn"
                    />
                </form>
            </div>
        </Fragment>
    )
}

export default PaymentNew
