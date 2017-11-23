const pulseDebuggerWrapper = (document, io, React, ReactDOM, ReactTransitionGroup) => {
  const socket = io('https://pulse-server-km.herokuapp.com')

  const listenForEvent = (cb) => {
    socket.on('event', (event) => {
      cb(event)
    })
  }

  const listenForConnectionCount = (cb) => {
    socket.on('connectionCount', (connectionCount) => {
      cb(connectionCount)
    })
  }

  const duration = 160;
  const defaultStyle = {
    transition: `opacity ${duration}ms ease-out`,
    opacity: 0,
    borderLeft: 'solid 10px',
    borderColor: 'rgb(171, 245, 200)',
  }
  const transitionStyles = {
    entering: { opacity: 0 },
    entered: { opacity: 1 },
  }

  const Fade = ({ inProp, children, ...props }) => (
    <ReactTransitionGroup.Transition
      in={inProp}
      timeout={duration}
    >
    {(state) => (
      <div 
      className='event'
      style={{
        ...defaultStyle,
        ...transitionStyles[state]
      }}>
        {children}
      </div>
    )}
    </ReactTransitionGroup.Transition>
  )

  const EventList = ({ events, inProp }) => {
    return (
      <div className='events-wrapper'>
        <div className='events'>
          <ReactTransitionGroup.TransitionGroup>
            {events.map((e, i) => {
              const date = (new Date(e.timestamp)).toLocaleString()
              return (
              <Fade key={e.timestamp} inProp={inProp}>
                <span className='event-type event-stat'>{(e.type).toUpperCase()}</span>
                <span className='event-value event-stat'>{e.value}</span>
                <span className='event-timestamp event-stat'>{date}</span>
              </Fade>
            )
            })}
          </ReactTransitionGroup.TransitionGroup>
        </div>
      </div>
    )
  }

  const Layout = ({ events, connectionCount, show }) => {
    return (
      <div className='layout'>
        <h1 id='title' className='title'>Pulse <span className='title-small'>debugger</span></h1>
        <h4 className='subtitle'>{connectionCount} {connectionCount === 1 ? 'connection' : 'connections'}</h4>
        <EventList events={events} inProp={show} />
      </div>
    )
  }

  class App extends React.Component {
    constructor (props) {
      super(props)
      this.state = {
        events: [],
        connectionCount: 0,
        show: false
      }
      listenForEvent(event => {
        return this.setState(state => ({
          events: (state.events.concat(event)).sort((a, b) => b.timestamp - a.timestamp),
          connectionCount: event.connectionCount,
          show: true
        }))
      })
      listenForConnectionCount(connectionCount => this.setState({connectionCount}))
    }

    render () {
      const { events, connectionCount, show } = this.state
      return (
          <Layout events={events} connectionCount={connectionCount} show={show}/>
        )
    }
  }
  document.getElementById('loader').style.display = 'none'
  ReactDOM.render(<App className='app-ready red' />, document.getElementById('app'))
}

if (window) window.PULSE_DEBUGGER_WRAPPER = pulseDebuggerWrapper
if (typeof module !== 'undefined') module.exports = pulseDebuggerWrapper