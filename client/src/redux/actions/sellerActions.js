import * as actionTypes from '../constants/sellerConstants'
import { logOut } from './userActions'
import axios from 'axios'

// export const getDashboardStats = () => async (dispatch, getState) => {
//     try {
//         dispatch({ type: actionTypes.GET_DASHBOARD_STATS_REQUEST })

//         const { userInfo } = getState().loginUser

//         const config = {
//             headers: {
//                 Authorization: `Bearer ${userInfo.token}`,
//             },
//         }

//         const { data } = await axios.get(
//             'http://localhost:3001/api/admin/',
//             config
//         )

//         dispatch({
//             type: actionTypes.GET_DASHBOARD_STATS_SUCCESS,
//             payload: data,
//         })
//     } catch (error) {
//         const message =
//             error.response && error.response.data.message
//                 ? error.response.data.message
//                 : error.message

//         if (message === 'Not authorized, token failed') {
//             logOut()
//         }
//         dispatch({
//             type: actionTypes.GET_DASHBOARD_STATS_FAIL,
//             payload: message,
//         })
//     }
// }

export const getsellerProducts =
    (pageNumber = '', sortKey = '', sortValue = '', filterKey = '') =>
    async (dispatch, getState) => {
        if (sortKey === 'undefined') sortKey = ''
        if (sortValue === 'undefined') sortValue = ''
        if (filterKey === 'undefined') filterKey = ''

        try {
            dispatch({ type: actionTypes.GET_SELLER_PRODUCTS_REQUEST })

            const { userInfo } = getState().loginUser
            console.log(userInfo.token)

            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            }

            const { data } = await axios.get(
                `http://localhost:3001/api/seller/products?pageNumber=${pageNumber}&sortKey=${sortKey}&sortValue=${sortValue}&filterKey=${filterKey}`,
                config
            )

            dispatch({
                type: actionTypes.GET_SELLER_PRODUCTS_SUCCESS,
                payload: data,
            })
        } catch (error) {
            const message =
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message

            if (message === 'Not authorized, token failed') {
                logOut()
            }
            dispatch({
                type: actionTypes.GET_SELLER_PRODUCTS_FAIL,
                payload: message,
            })
        }
    }

// export const getOrders =
//     (keyword = '', pageNumber = '') =>
//     async (dispatch, getState) => {
//         try {
//             dispatch({ type: actionTypes.GET_ADMIN_ORDERS_REQUEST })

//             const { userInfo } = getState().loginUser

//             const config = {
//                 headers: {
//                     Authorization: `Bearer ${userInfo.token}`,
//                 },
//             }

//             const { data } = await axios.get(
//                 `http://localhost:3001/api/admin/orders?keyword=${keyword}&pageNumber=${pageNumber}`,
//                 config
//             )

//             dispatch({
//                 type: actionTypes.GET_ADMIN_ORDERS_SUCCESS,
//                 payload: data,
//             })
//         } catch (error) {
//             const message =
//                 error.response && error.response.data.message
//                     ? error.response.data.message
//                     : error.message

//             if (message === 'Not authorized, token failed') {
//                 logOut()
//             }
//             dispatch({
//                 type: actionTypes.GET_ADMIN_ORDERS_FAIL,
//                 payload: message,
//             })
//         }
//     }

// export const updateOrderStatus = (id, status) => async (dispatch, getState) => {
//     try {
//         dispatch({ type: actionTypes.UPDATE_ORDER_REQUEST })

//         const {
//             loginUser: { userInfo },
//         } = getState()

//         const config = {
//             headers: {
//                 Authorization: `Bearer ${userInfo.token}`,
//             },
//         }

//         const { data } = await axios.put(
//             `http://localhost:3001/api/orders/${id}`,
//             status,
//             config
//         )

//         dispatch({
//             type: actionTypes.UPDATE_ORDER_SUCCESS,
//             payload: data,
//         })
//     } catch (error) {
//         const message =
//             error.response && error.response.data.message
//                 ? error.response.data.message
//                 : error.message

//         if (message === 'Not authorized, token failed') {
//             logOut()
//         }

//         dispatch({
//             type: actionTypes.UPDATE_ORDER_FAIL,
//             payload: message,
//         })
//     }
// }
