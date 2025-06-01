import React, { useEffect, useState } from 'react'
import socket from '../socket'
import ConnectionState from '../Components/ConnectionState.jsx'
import ConnectionManager from '../Components/ConnectionManager.jsx'
import Events from '../Components/Events.jsx'
import MyForm from '../Components/MyForm.jsx'

const TestSocket = () => {
  const [isConnected, setIsConnected] = useState(socket.connected)
  const [fooEvents, setFooEvents] = useState([])

  console.log(fooEvents)

  useEffect(() => {
    function onConnect() {
      setIsConnected(true)
    }

    function onDisconnect() {
      setIsConnected(false)
    }

    function onFooEvent(value) {
      setFooEvents((previous) => [...previous, value])
    }
    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)
    socket.on('foo_response', (data) => {
      console.log('Server says:', data)
    })

    return () => {
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
      socket.off('foo', onFooEvent)
    }
  }, [])
  return (
    <div className="flex flex-col space-y-3 items-center justify-center">
      <ConnectionState isConnected={isConnected} />
      <Events events={fooEvents} />
      <ConnectionManager />
      <MyForm />
    </div>
  )
}

export default TestSocket
