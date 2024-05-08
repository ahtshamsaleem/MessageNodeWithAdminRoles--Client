import React from 'react'
import './editmodal.css'
import Backdrop from '../Backdrop/Backdrop';
import Modal from '../Modal/Modal';
import Input from '../Form/Input/Input'
import { Spin } from 'antd';

const EditModal = ({onCancelModal, user, onChangeHandler, onSubmitHandler, isLoading}) => {
  return (
    <>      

            <Backdrop  />
            <Modal
                 title='Update User'
                acceptEnabled={true}
                 onCancelModal={onCancelModal}
                onAcceptModal={() => onSubmitHandler(user._id)}
                // isLoading={props.loading}
            >   
                
                <form>
                    <Input
                        id='email'
                        label='Email'
                        control='input'
                        onChange={onChangeHandler}
                       
                        // valid={state.postForm['title'].valid}
                        // touched={state.postForm['title'].touched}
                         value={user.email}
                    />

<Input
                        id='name'
                        label='Name'
                        control='input'
                        onChange={onChangeHandler}
                       
                        // valid={state.postForm['title'].valid}
                        // touched={state.postForm['title'].touched}
                         value={user.name}
                    />

<Input
                        id='status'
                        label='Status'
                        control='input'
                        onChange={onChangeHandler}
                        //onChange={postInputChangeHandler}
                       
                        // valid={state.postForm['title'].valid}
                        // touched={state.postForm['title'].touched}
                         value={user.status}
                    />
                    
                    <input type="radio" value="superAdmin" name="role" checked={user.role === 'superAdmin'} onChange={(e) => onChangeHandler(e.target.name, e.target.value)}/> Super Admin
                    <input type="radio" value="admin" name="role" checked={user.role === 'admin'} onChange={(e) => onChangeHandler(e.target.name, e.target.value)}/> Admin
                    <input type="radio" value="manager" name="role" checked={user.role === 'manager'} onChange={(e) => onChangeHandler(e.target.name, e.target.value)}/> Manager
                    <input type="radio" value="client" name="role" checked={user.role === 'client'} onChange={(e) => onChangeHandler(e.target.name, e.target.value)}/> Client
                    
                        
                    
                </form>
            </Modal>
        </>
  )
}

export default EditModal