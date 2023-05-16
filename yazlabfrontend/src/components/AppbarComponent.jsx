import React from 'react'
import { NavLink } from 'react-router-dom'
import { Navbar} from 'reactstrap'


const AppbarComponent = () => {
  return (
    <Navbar
            className="mb-2"
            color="primary"
            dark
        >
            <NavLink href="/" className="text-light text-decoration-none fs-6">
                Kelime Benzerlik
            </NavLink>
    </Navbar>
  )
}

export default AppbarComponent
