/// <reference types="cypress" />
import { api } from '../../dist/schemas'

describe('TodoMVC app', () => {
  beforeEach(function resetState () {
    const resetUrl = '/reset'
    cy.request({
      method: 'POST',
      url: resetUrl,
      body: {
        todos: []
      }
    })
  })

  it('returns new item matching schema', () => {
    cy.server()
    cy.route('POST', '/todos').as('post')
    cy.visit('/')
    cy.get('.new-todo').type('Use schemas{enter}')

    // check response passes schema
    cy.get('@post')
      .its('response.body')
      .then(api.assertSchema('PostTodoResponse', '1.0.0'))

    // check response has headers with schema name and version
    cy.get('@post')
      .its('response.headers')
      .should(headers => {
        expect(headers).to.have.property('x-schema-name', 'PostTodoResponse')
        expect(headers).to.have.property('x-schema-version', '1.0.0')
      })
  })
})
