
import styles from './css/NotFound.module.css';
import {useNavigate } from 'react-router';
import CopyrightFooter from '../landingpage/Components/CopyrightFooter/CopyrightFooter';
import Footer from '../landingpage/Components/Footer/Footer';


export default function NotFound() {
    const nav  = useNavigate()
    const onNavigate = () =>{
        nav(-1);
    }
  return (
    <>
    <div className={styles.container}>
      <h1 className={styles.heading}>404 - Page Not Found</h1>
      <p className={styles.text}>Oops! The page you are looking for does not exist.</p>
      <button
        onClick={()=>onNavigate()}
        className={styles.link} >
            Go Back
      </button>
      
    </div>
    <Footer />
    <CopyrightFooter />
    </>
  )
}
