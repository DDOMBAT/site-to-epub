import {expect, should} from 'chai'
import Agent from '../../../lib/utils/agent'

should()

describe('Crawlers', () => {
  describe('Agent', () => {
    it('should accept name parameter', () => {
      const agent = new Agent('Test')
      agent.name.should.be.equal('Test')
    })

    it('should contain default headers', () => {
      const agent = new Agent()
      expect(agent.headers).not.equal(null)
      agent.headers.should.have.property('User-Agent')
    })

    it('should contain default cookies', () => {
      const agent = new Agent()
      expect(agent.cookies).not.equal(null)
      Object.keys(agent.cookies).should.have.lengthOf(0)
    })

    it('should get https://lnmtl.com', async () => {
      const agent = new Agent()
      await agent.get('https://lnmtl.com')
      agent.cookies.should.have.keys('__cfduid', 'XSRF-TOKEN', 'laravel_session')
    })
  })
})
