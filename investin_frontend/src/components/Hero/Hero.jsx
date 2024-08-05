import React from 'react'
import styles from './Hero.module.css'
import biglogo from '../../assets/biglogo.png'
import { NavLink, Link } from 'react-router-dom';

export default function Hero() {
  return (
    <div className={styles.hero}>
      <div className={styles.banner}>

        <div className={styles.content}>
          <img src={biglogo} alt="" />
          <h2>Unlock the Power of Early-Stage Investing</h2>
          <p>Connects investors with promising startups at the earliest stages, empowering you to discover and support the next big thing.</p>
          <div className={styles.cta_buttons}>
            <div>
            <Link to='/'
              // className={({isActive})=>`${classes.navlink} ${isActive?classes.activeNav:""}`
              // }
              >
                  For Investors
            </Link>   
            </div>

            <div>For Startups</div>
          </div>
        </div>
      </div>
      
    </div>
  )
}
