import Agent from '../../../lib/crawlers/agent'

describe('Crawlers', () => {
  describe('Agent', () => {
    it('should render correct contents', () => {
      const agent = new Agent('Test')
      agent.name.should.be.equal('Test')
    })
  })
})
