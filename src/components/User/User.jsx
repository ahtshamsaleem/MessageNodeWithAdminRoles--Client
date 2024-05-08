import React from 'react'
import './user.css'
import { Spin } from 'antd'

const User = ({id, name, email, editHandler, deleteHandler, user, isLoading}) => {
  return (
    <div className='wrapper'>
        
        <div className='div1'>
            <h4 className='name'>Name : {name}</h4>
            <h4 className='email'>Email : {email}</h4>
        </div>

        <div className='div2'>   
            <button onClick={() => editHandler(user)} className='btn1 btn'>Edit</button>
            <button onClick={() => deleteHandler(id)} className='btn2 btn'>Delete</button>
        </div>
        
    </div>
  )
}

export default User