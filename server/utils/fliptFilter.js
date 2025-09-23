const { FliptClient } = require('@flipt-io/flipt-client-js');
const { settings } = require('../config');

async function createEvaluator() {
  const fliptClient = await FliptClient.init({
    url: settings.flipt.fliptUrl,
    namespace: 'ProbationInCourt',
    updateInterval: 60000,
    authentication: {
      clientToken: settings.flipt.fliptToken
    }
  });

  return async function evaluate(codeToEval, flagKeyToEval) {
    try {
      const result = await fliptClient.evaluateBoolean({
        namespaceKey: 'ProbationInCourt',
        flagKey: flagKeyToEval,
        entityId: codeToEval,
        context: {
          code: codeToEval
        }
      });
      return result.enabled;
    } catch (error) {
      console.error('Flipt evaluation error:', error);
      return false;
    }
  };
}

module.exports = createEvaluator;
