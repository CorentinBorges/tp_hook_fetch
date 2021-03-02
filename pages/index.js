import Head from 'next/head'
import { useEffect, useState } from 'react'
import styles from '../styles/Home.module.css'
 
function useIncrement(init, step){
  const [count, setCount]=useState(init)

  const increment =() => {
    setCount(c => c + step)
  }

  return [count, increment]
}

function useAutoincrement(init, step){
  const [count, increment]= useIncrement(init ,step)

  useEffect(() => {
    const timer=
    window.setInterval(() => {
        increment()
    }, 1000)

    return function() {
      clearInterval(timer)
    }
  }, [count])

  return [count]
}

function Compteur(){
  const [count, increment] = useIncrement(10, 1)
  const [count2]= useAutoincrement(2, 2)

    return <div>
    <button onClick={increment}>Incrémenter {count}</button>
    <button>Incrémenter {count2}</button>

    </div>

}

function useToggle (initialValue){
  const [value, setValue]=useState(initialValue)

  const toggle =(e) => {
    setValue( i => !i)
  }

  return [value, toggle]

}

function useFetch(url){
  const [state, setState]= useState({
    items: [],
    loading: true
  })

  useEffect(() => {
    (async () => {
      const response= await fetch(url)
      const responseData= await response.json()
      if (response.ok){ 
        setState({
          items: responseData,
          loading: false
        })
      } else {
        alert(JSON.stringify(responseData))
        setState(s => ({...s, loading: false}))
      }
    })()
  }, [])

    return [
      state.loading,
      state.items
    ]
}

function PostTable(){
  const [loading, items] = useFetch('https://jsonplaceholder.typicode.com/comments?_limit=10')
  return <ul>
    {items.map((i) => <li key={i.id}>Name: {i.name}, EMAIL: {i.email} , CONTENT: {i.body} </li>) }
  </ul>

}

function TodoList (){
  const [loading, items] = useFetch('https://jsonplaceholder.typicode.com/todos?_limit=80')

  return <ul>
    {items.map((t, key) => <li key={key}>{t.title}</li>) }
  </ul>
}

function App(){

  const [compteurVisible, toggleCompteur]= useToggle(true)

    return <div className={styles.container}>
      Afficher le compteur <input type="checkbox" onChange={toggleCompteur} checked={compteurVisible} />
      <br />
      {compteurVisible && <Compteur />}
      <TodoList />
      <PostTable />
    </div>
  
}

export default function Home() {
  return (
    <App />
  )
}

