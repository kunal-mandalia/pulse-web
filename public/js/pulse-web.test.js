const pulseWeb = require('./pulse-web')

describe(`pulse-web`, () => {
  const document = jest.fn()
  const window = {
    location: {
      pathname: '/'
    }
  }
  const emit = jest.fn()
  const on = jest.fn()
  const io = () => ({
    emit,
    on
  })

  it(`should emit page event on init`, () => {
    pulseWeb(document, window, io)
    expect(emit.mock.calls[0][1]).toEqual({type: 'page', value: '/'})
  })

  it(`Then should append PULSE_WEB to window`, () => {
    expect(typeof window.PULSE_WEB).toEqual('object')
  })

  it('should emit socket event on emitEvent', () => {
    emit.mockClear()
    const event = {event: {type: 'page', value: '/about'}}
    window.PULSE_WEB.emitEvent(event)
    expect(emit).toBeCalledWith('event', event)
  })
})
