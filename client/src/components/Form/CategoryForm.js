import React from 'react'

const CategoryForm = ({handlesubmit,value,setValue}) => {
  return (
    <div >
      <form onSubmit={handlesubmit}>
  <div className="mb-3">
    <input style={{ width: '300px' }} type="text" className="form-control" placeholder='Enter Category Name' value={value} onChange={(e)=>setValue(e.target.value)} />
  </div>
  <button type="submit" className="btn btn-primary">Submit</button>
</form>
    </div>
  )
}

export default CategoryForm
