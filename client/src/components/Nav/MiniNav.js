import React from 'react'
import { Link } from 'react-router-dom'

import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'

import '../../styles/MiniNav.scss'

const MiniNav = () => {
    return (
        <div className="mini_nav">
            <div className="container mini_container">
                <div className="mini_logo">
                    <Link to="/">
                        <h2>EZ-Shopping</h2>
                    </Link>
                </div>
                <div className="mini_contact">
                    <div className="mini-phone">
                        <LocalPhoneOutlinedIcon />
                        <a href="tel:+2348166179988">+92 313 0159250</a>
                    </div>

                    <div>
                        <EmailOutlinedIcon />
                        <a href="mailto:shoaibnaseer1111@gmail.com">
                            shoaibnaseer1111@gmail.com
                        </a>
                    </div>
                </div>
                <div className="mini_links">
                    <Link to="/">Terms</Link>
                    <Link to="/">FAQ</Link>
                    <Link to="/">FAQ</Link>
                </div>
            </div>
        </div>
    )
}

export default MiniNav
