import React from 'react'
import Myheader from './Myheader'
import Myfooter from './Myfooter'
import { Helmet } from 'react-helmet'
import { Toaster } from 'react-hot-toast';

const Mylayout = ({children,title,description,keywords,author}) => {
  return (
    <div>
      <Helmet>
      <meta name="description" content={description}/>
      <meta charSet="utf-8" />
      <meta name="keywords" content={keywords}/>
      <meta name="author" content={author}/>
      <title>{title}</title>
      </Helmet>
<Myheader/>
<main style={{minHeight:"70vh"}}>
<Toaster/>
    {children}
</main>
<Myfooter/>
    </div>
  )  
}
Mylayout.defaultProps={
  title:"Cloud Pharmacy",
  description:"Pharmacy",
  keywords:"pharmacy web app",
  author:"Fathy Nassef"
}
export default Mylayout
