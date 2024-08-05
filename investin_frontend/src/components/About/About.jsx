import React from 'react'
import styles from './About.module.css'
import emerg1 from '../../assets/emerg1.jpg'
import emerg2 from '../../assets/emerg2.jpg'
import emerg3 from '../../assets/emerg3.jpg'


export default function About() {
  return (
    <div className={styles.about}>
      <div className={styles.about_text}>
        <h2>Our Vision is to be</h2>
        <h2>the leading platform</h2>
        <h2>for startup funding and investment. We envision a world where every startup has the opportunity to thrive and every investor can find the perfect match for their portfolio.</h2>
      </div>

      <div className={styles.browse_flex}> 
        <div className={styles.card}>
          <div className={styles.banner}>
            <div>Discover Emerging <p>Startups.</p></div>
          </div>
        </div>


        <div className={styles.card}>
          <h3 className={styles.title}>Browse Startups</h3>
          <h3 className={styles.subtitle}>by Industry</h3>
          <div className={styles.taglist}>
            <div className={styles.tag}>All</div>
            <div className={styles.tag}>Technology</div>
            <div className={styles.tag}>Healthcare</div>
            <div className={styles.tag}>Fintech</div>
            <div className={styles.tag}>Sports</div>
            <div className={styles.tag}>Education</div>
            <div className={styles.tag}>Beauty</div>
            <div className={styles.tag}>Lifestyle</div>
            <div className={styles.tag}>Accessories</div>
          </div>

          <h3 className={styles.subtitle}>by Stage</h3>
          <div className={styles.taglist}>
            <div className={styles.tag}>Pre Seed</div>
            <div className={styles.tag}>Seed</div>
            <div className={styles.tag}>Series A</div>
            <div className={styles.tag}>Series B</div>
            <div className={styles.tag}>Last Stage</div>
          </div>
        </div>
      </div>
      <div className={styles.emerging_flex}> 
        <div className={styles.card}>
          <div className={styles.taglist}>
              <div className={styles.tag}>Apparel</div>
              <div className={styles.tag}>Sustainability</div>
          </div>
          <h3 className={styles.title}>Eco-Friendly Apparel</h3>
          <h3 className={styles.subtitle}>Sustainable fashion brand creating eco-friendly clothing.</h3>            

          <img src={emerg1} alt="" />
        </div>

        <div className={styles.card}>
          <div className={styles.taglist}>
              <div className={styles.tag}>Logistics</div>
              <div className={styles.tag}>AI</div>
          </div>
          <h3 className={styles.title}>AI-Powered Logistics</h3>
          <h3 className={styles.subtitle}>Revolutionizing supply chain management with AI.</h3>

          <img src={emerg2} alt="" />
        </div>

        <div className={styles.card}>
          <div className={styles.taglist}>
              <div className={styles.tag}>Healthcare</div>
              <div className={styles.tag}> Nutrition</div>
          </div>
          <h3 className={styles.title}>Personalized Nutrition</h3>
          <h3 className={styles.subtitle}>Providing personalized nutrition plans based on DNA analysis.</h3>

          <img src={emerg3} alt="" />
        </div>

      </div>
    </div>
  )
}
