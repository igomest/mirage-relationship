import { useEffect, useState } from 'react'
import { api } from './api'
import { makeServer } from './mirage'
 
makeServer()
const Home = () => {
  const [users, setUsers] = useState([])
  const [classes, setClasses] = useState([])

  useEffect(() => {
    api.get('/users')
    .then((res) => {
      console.log(res.data.users)
      setUsers(res.data.users)
    })

    api.get('/classes/1/users')
    .then((res) => {
      console.log('Usuários da classe X', res.data)
      setClasses(res.data)
    })
  }, [])

  return (
    <></>
  )
}

export default Home
