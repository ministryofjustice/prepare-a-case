/*
 * Workflow is very early doors, the only task is prep and hence this file focuses exclusively on it
 */

const { states } = require('../data/workflow.json').tasks
  .find(({ id }) => id === 'prep')

// optimizations
const defaultState = states
  .find(state => state.isDefault)
const ids = states
  .map(({ id }) => id)

const tasks = new Map()

// add prep workflow
tasks.set('prep', {
  states: {
    getAllOrderBySequence: states, // default order
    getDefault: defaultState,
    getById: id => {
      // validations
      if (typeof id !== 'string') {
        throw new TypeError('workflow.tasks.prep.states.getById first param not a string')
      }
      if (!id) {
        throw new TypeError('workflow.tasks.prep.states.getById first param can not be blank string')
      }
      if (!ids.includes(id)) {
        throw new TypeError(`workflow.tasks.prep.states.getById first param "${id}" not recognised`)
      }
      // execute
      return states
        .find(({ id: myId }) => myId === id)
    }
  }
})

Object.freeze(tasks)

module.exports = {
  tasks
}
