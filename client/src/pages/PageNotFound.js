import React from 'react'
import Mylayout from '../components/Layout/Mylayout'
import { Link } from 'react-router-dom'

const PageNotFound = () => {
  return (
    <Mylayout title={"Not Found"}>
    <div className='pnf'>
    <h1 className='pnf-title'>404</h1>
    <h2 className='pnf-heading'>Page Not Found!</h2>
    <Link to="/" className='pnf-btn'>Go Back</Link>
    </div>
    </Mylayout>
  )
}

export default PageNotFound