import React from 'react';
import { NavLink } from 'react-router-dom';

import './NavigationItems.css';

const navItems = [
  { id: 'feed', text: 'Feed', link: '/', auth: true },
  { id: 'login', text: 'Login', link: '/', auth: false},
  { id: 'signup', text: 'Signup', link: '/signup', auth: false},
  { id: 'users', text: 'Users', link: '/users', auth: true},

];

const navigationItems = props => [
  ...navItems.filter(item => item.auth === props.isAuth).map(item => {
    if(item.id === 'users') {
        if(props.role !== 'superAdmin') {
            return;
        }
        return (
            <li
        key={item.id}
        className={['navigation-item', props.mobile ? 'mobile' : ''].join(' ')}
      >
        <NavLink to={item.link} exact onClick={props.onChoose} >
          {item.text}
        </NavLink>
      </li>
        )
    } else {
        return (
            <li
      key={item.id}
      className={['navigation-item', props.mobile ? 'mobile' : ''].join(' ')}
    >
      <NavLink to={item.link} exact onClick={props.onChoose} >
        {item.text}
      </NavLink>
    </li>
        )
    }
  }),
//   (props.role === 'superAdmin' && props.isAuth === true ? (
//     <li className="navigation-item" key="logout">
//       <button><NavLink to='/users'> Users</NavLink></button>
//     </li>
//   ) : null),
  props.isAuth && (
    <li className="navigation-item" key="logout">
      <button onClick={props.onLogout}>Logout</button>
    </li>
  )
];

export default navigationItems;
