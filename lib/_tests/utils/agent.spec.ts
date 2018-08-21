import { expect, should } from 'chai'
import { TestAgent, Agent } from '../../utils/agent'
import { Response, RequestInit } from 'node-fetch'

should()

describe('Utilities', () => {
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
      const agent = new TestAgent((url: string, init?: RequestInit) => {
        const response = new Response()
        response.headers.set('set-cookie', '__cfduid=da48fc97c9ea6147d5534503f5337db821534343165; expires=Thu, 15-Aug-19 14:26:05 GMT; path=/; domain=.foobar.com; HttpOnly, XSRF-TOKEN=eyJpdiI6Imx3TXJFZ013QVRiXC9mUzFMXC9uM2NzQT09IiwidmFsdWUiOiJ5Z2V2SVJRUlpKRmQ0c0xCU0VWUDBGVzduWnBxVlwvaVhVTnlSbzdnTnJkdzlNd0M2KzFDZWVzQ3lZT1N6RkpJdkZuM0w4MkMraE5SWDN1XC9xUmlNNDJRPT0iLCJtYWMiOiI3MmE4YzEwYTY5ZGI5NTIyNWMyZTBmM2Q0YTlhZGE3Mzk2MzYyMmI1NGZiYWFmNjBlMjgxMTZjMzFkOGU3N2UxIn0%3D; expires=Wed, 15-Aug-2018 16:26:05 GMT; Max-Age=7200; path=/, laravel_session=eyJpdiI6Ikp2ckE5ME5KRFU4TlFOc0xxVUZXR2c9PSIsInZhbHVlIjoiRWRcLzRMdFJLMEM2U2dEdTdUN1FcL2w2WGZ5eGJ1VmF2ZHJYd2JoVjUzSHBWQlkzYmIzWWRzUllMcEt0Sjk3OVlaeGRLTWozNFJyVDBPZkxuT3RnVUY2dz09IiwibWFjIjoiYzg1OGY3MGY4NTEzMmJlY2E3MjhlOGM5NTM4ZmY1MjdlYjc4YjIyOTQyODFiYjdlNDcyMzY3NTQzNGRkYTU3MiJ9; expires=Wed, 15-Aug-2018 16:26:05 GMT; Max-Age=7200; path=/; httponly')
        return response
      })
      await agent.get('https://lnmtl.com')
      agent.cookies.should.have.keys('__cfduid', 'XSRF-TOKEN', 'laravel_session')
    })
  })
})
