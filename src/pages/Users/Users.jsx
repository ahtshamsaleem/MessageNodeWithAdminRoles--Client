import React, { useContext, useEffect, useState } from 'react'
import User from '../../components/User/User'
import './users.css'
import axios from '../../util/axiosInstance'
import EditModal from '../../components/User/EditModal'
import ErrorHandler from '../../components/ErrorHandler/ErrorHandler'
import { useNavigate } from 'react-router-dom'

const Users = ({role, isAuth, token}) => {
        const [users, setUsers] = useState([]);
        const [error, setError] = useState('');
        const [isLoading, setIsLoading] = useState(false);

        const [editModal, setEditModal] = useState(false);
        const [editUser, setEditUser] = useState({});

        const navigate = useNavigate();
    useEffect(() => {

        
        async function getUsers() {
            try {
                const {data} = await axios.get('/admin/users', { headers: { Authorization: 'Bearer ' + token }});
                    setUsers(data.users)
            } catch(error) {
                console.log(error);
                setError(error);

                
            }
        }

        
        if(!isAuth || role !== 'superAdmin') {
            navigate('/');
            return;
        }

        getUsers();

        
    }, [])


    const editHandler = async (user) => {
        setEditModal(true);

        setEditUser(user);
        

        

        

    }


    const deleteHandler = async (id) => {
        try {
            setIsLoading(true);
            const res = await axios.delete(`/admin/delete/${id}`, { headers: { Authorization: 'Bearer ' + token }});
        
            const newArr = users.filter((el) => el._id !== id);
            setUsers(newArr);
            setIsLoading(false);
            setError('');






        } catch(error) {
            console.log(error)
        }
    }







    const onCancelModal = () => {
        setEditModal(false)
    }





    const onChangeHandler = (id, value) => {

        let  newValue = {
            ...editUser,
            [id]:value
        }

        setEditUser(newValue)
    }


    const onSubmitHandler = async (id) => {
        console.log(editUser);
        setIsLoading(true);

        try {
            const respose = await axios.put(`/admin/update/${id}`, editUser, { headers: { Authorization: 'Bearer ' + token }});

            setIsLoading(false);
            setEditModal(false);

            const newArr = [...users]

            const index = newArr.findIndex((el) => el._id === id);

            console.log(index);

            newArr[index] = editUser;




            setUsers(newArr);







            //const newArr = users.filter((el) => el._id !== id);


        } catch(error) {
            console.log(error);
            if(error.response) {
                setError(error.response.data.message)
            } else {
                setError(error.message)
            }
            setIsLoading(false);
        }



    }


    const handleError = () => {
        setError('')
    }


  return (
    <div className='outer'>

    {error ? <ErrorHandler error={{message:error.response?.data?.message}} onHandle={handleError} /> : null}
    {editModal ? <EditModal isLoading={isLoading} onChangeHandler={onChangeHandler} onSubmitHandler={onSubmitHandler} onCancelModal={onCancelModal} user={editUser} /> : null}
    {
        users.map((el) => {
            return <User isLoading={isLoading} key={el._id} user={el} id={el._id} name={el.name} email={el.email} editHandler={editHandler} deleteHandler={deleteHandler}/>
        })
    }

    </div>
  )
}

export default Users