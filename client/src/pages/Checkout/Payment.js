import { PaystackButton } from 'react-paystack'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useRef, useState } from 'react'
import { useHistory, Link } from 'react-router-dom'
import { useAlert } from 'react-alert'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import CheckoutForm from './CheckoutForm'

// REDUX ACTIONS
import { createOrder, getPaymentKey } from '../../redux/actions/orderActions'
import { clearCart } from '../../redux/actions/cartActions'
import { CREATE_ORDER_RESET } from '../../redux/constants/orderConstants'

// MUI COMPONENTS
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'

// COMPONENTS
import CustomizedSteps from '../../components/Checkout/CustomizedSteps'
import AddressCard from '../../components/Checkout/AddressCard'
import Loader from '../../components/Loader/Loader'
import Layout from '../../components/Layout/Layout'
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js'
import PaymentNew from './PaymentNew'

// STYLE
import '../../styles/Checkout.scss'
import axios from 'axios'

const stripePromise = loadStripe(
    'pk_test_51Lr422SCUj16GG00lDGT99fVRjfLehOfsbKb8PcWQ31uuTCyIjsTBVViAYVCJi5pLQSP5y4A4xxl40rXyyz8qiJW00qmWKC4Sw '
)

const Payment = () => {
    // const stripe = useStripe()
    // const elements = useElements()
    const history = useHistory()
    const alert = useAlert()
    const dispatch = useDispatch()
    const payBtn = useRef(null)
    const [clientSecret, setClientSecret] = useState('')

    /* Getting the cart items */
    const [loading, setLoading] = useState(false)
    const { cartItems } = useSelector((state) => state.cart)
    const { userInfo } = useSelector((state) => state.loginUser)
    const { newOrder } = useSelector((state) => state.createOrder)
    // const { key } = useSelector((state) => state.paymentKey)

    const address = JSON.parse(sessionStorage.getItem('shippingAddress'))
    const { main, ...shippingAddress } = address

    /* Calculate the price before and after shipping fees */

    const totalItems = () => {
        let total = cartItems.reduce((qty, item) => Number(item.qty) + qty, 0)
        return total
    }

    const shippingFee = 100

    const totalItemsPrice = () => {
        let total = cartItems.reduce(
            (price, item) => item.price * item.qty + price,
            0
        )
        return total
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

    const paymentData = {
        amount: totalPrice() * 100,
    }
    let orderDetails = {
        shippingAddress,
        orderItems: cartItems,
        itemsPrice: totalItemsPrice(),
        shippingFee,
        taxFee: vat(),
        totalPrice: totalPrice(),
        user: userInfo._id,
    }

    const clientkey = async () => {
        try {
            const { data } = await axios.post(
                'http://localhost:3001/api/payment/process',
                paymentData
            )

            setClientSecret(data.client_secret)
            sessionStorage.setItem('client_secret', data.client_secret)
        } catch (err) {
            console.log(err)
        }
    }

    const appearance = {
        theme: 'stripe',
    }
    const options = {
        clientSecret,
        appearance,
    }
    //         if (!stripe || !elements) return

    //         const result = await stripe.confirmCardPayment(client_secret, {
    //             payment_method: {
    //                 card: elements.getElement(CardNumberElement),
    //                 billing_details: {
    //                     firstName: userInfo.firstName,
    //                     lastName: userInfo.lastName,
    //                     email: userInfo.email,
    //                     address: {
    //                         line1: shippingInfo.address,
    //                         city: shippingInfo.city,
    //                         state: shippingInfo.state,
    //                         postal_code: shippingInfo.pinCode,
    //                         country: shippingInfo.country,
    //                     },
    //                 },
    //             },
    //         })
    //     // orderDetails.paymentStatus = {
    //     //     id: response.reference,
    //     //     status: response.status,
    //     // }
    //     setLoading(true)
    //     dispatch(createOrder(orderDetails))
    //     setLoading(false)
    // }

    // const paymentData = {
    //     amount: totalPrice() * 100,
    // }
    // const componentProps = {
    //     email: userInfo.email,
    //     amount: totalPrice() * 100,
    //     metadata: {
    //         name: address.firstName,
    //         phone: address.phone,
    //     },
    //     publicKey: 'key',
    //     text: `Pay Rs${totalPrice()}`,
    //     onSuccess: (response) => {
    //         handlePayment(response)
    //     },
    //     onClose: () => {
    //         alert.show('Why na, you wan collect')
    //     },
    // }

    useEffect(() => {
        clientkey()
    }, [])
    useEffect(() => {
        if (newOrder && newOrder.paymentStatus) {
            history.replace(`/account/order/${newOrder._id}`)
            dispatch({ type: CREATE_ORDER_RESET })
            dispatch(clearCart())
        }
    }, [dispatch, history, newOrder])

    if (loading) {
        return (
            <Layout>
                {' '}
                <main className="payment">
                    {' '}
                    <Loader />{' '}
                </main>
            </Layout>
        )
    }

    return (
        <Layout>
            <main className="payment">
                <div className="payment_container">
                    <CustomizedSteps activeStep={2} />
                    <section className="payment_method">
                        <div className="circle">
                            <div className="inner_circle"></div>
                        </div>
                        <h2>Pay with Stripe</h2>
                    </section>
                    <section className="payment_items_summary">
                        <div className="shipping_details">
                            <AddressCard address={address} type="payment" />
                        </div>

                        <div className="order_details">
                            <h2>Order Summary</h2>
                            <div className="order_details_header">
                                <h3>Name</h3>
                                <h3>Size</h3>
                                <h3>Qty</h3>
                                <h3>Price</h3>
                            </div>
                            <div className="item">
                                {cartItems.map((item, i) => (
                                    <div key={i}>
                                        <h3>{item.name}</h3>
                                        <h3 className="center">{item.size}</h3>
                                        <h3 className="center">{item.qty}</h3>
                                        <h3 className="right">{item.price}</h3>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section className="payment_summary">
                        <div className="order_summary_container">
                            <div className="order_summary_item">
                                <h2>Total Items</h2>
                                <h3>{totalItems()}</h3>
                            </div>
                            <div className="order_summary_item">
                                <h2>Items price</h2>
                                <h3>Rs{totalItemsPrice()}</h3>
                            </div>
                            <div className="order_summary_item">
                                <h2>VAT</h2>
                                <h3>Rs{vat()}</h3>
                            </div>
                            <div className="order_summary_item">
                                <h2>Shipping (Standard)</h2>
                                <h3>Rs{shippingFee}</h3>
                            </div>
                            <div className="order_summary_item">
                                <h2>Total Price</h2>
                                <h3>Rs{totalPrice()}</h3>
                            </div>
                            <Grid
                                container
                                rowSpacing={2}
                                columnSpacing={6}
                                sx={{ mt: 1, '& button': { width: '100%' } }}
                            >
                                <Grid>
                                    {clientSecret && (
                                        <Elements
                                            options={options}
                                            stripe={stripePromise}
                                        >
                                            <CheckoutForm
                                                orderDetails={orderDetails}
                                                clientSecret={clientSecret}
                                            />
                                        </Elements>
                                    )}
                                </Grid>

                                <Grid item xs={12} sm={6} md={12}>
                                    <Button size="large" variant="outlined">
                                        <Link to="/checkout/review">Back</Link>
                                    </Button>
                                </Grid>
                                <Grid item xs={12} sm={6} md={12}>
                                    {/* <Button ref={payBtn} className="pay_btn">
                                        Pay
                                    </Button> */}
                                </Grid>
                            </Grid>
                        </div>
                    </section>
                </div>
            </main>
        </Layout>
    )
}

export default Payment
