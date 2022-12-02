import React, { useRef, useState } from 'react'
import Axios from 'axios'
import { connect } from 'react-redux'
//import { PRODUCT_SEARCH } from "../Redux/Constants";
import { IconButton } from '@mui/material'
import CameraAltIcon from '@mui/icons-material/CameraAlt'

export default function ImageSearch({ fetchProducts, executeScroll }) {
    const imageRef = useRef(null)

    const onChange = async (event) => {
        try {
            console.log('***', event.target.files[0])
            const formData = new FormData()

            formData.append('file', event.target.files[0])
            const { data } = await Axios.post(
                'http://127.0.0.1:4000/webFlaskSearchImage',
                formData
            )
            console.log('Data---', data)
            const public_ids = Object.values(data).map(
                (item) => `products/${item.split('/')[1].split('.')[0]}`
            )
            console.log('Public Ids', public_ids)
            const productData = await Axios.post(
                `http://localhost:3001/api/products/imageSearch`,
                public_ids
            )
            setTimeout(executeScroll(), 1200)

            console.log('Product Data after image search: ', productData)
            fetchProducts(productData.data)
        } catch (error) {
            console.log(error)
        }
    }
    const onImagePress = () => {
        imageRef.current.click()
    }
    return (
        <div onClick={onImagePress}>
            <IconButton
                style={{
                    backgroundColor: '#f6f9fc',
                    padding: '13px',
                    marginLeft: '15px',
                }}
            >
                <CameraAltIcon />
            </IconButton>
            <input
                ref={imageRef}
                style={{ display: 'none' }}
                type="file"
                name="file"
                onChange={(event) => onChange(event)}
            />
        </div>
    )
}
