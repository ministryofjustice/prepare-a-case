const { FliptClient } = require('@flipt-io/flipt-client-js');
const { settings } = require('../config');

const fliptNamespace = 'ProbationInCourt';
const fliptUpdateInterval = 60000;
const fliptUrl = settings.flipt.fliptUrl;
const fliptToken = settings.flipt.fliptToken;  

async function createEvaluator() {
  const fliptClient = await FliptClient.init({
    url: fliptUrl,
    namespace: fliptNamespace,
    updateInterval: fliptUpdateInterval,
    authentication: {
      clientToken: fliptToken
    }
  });

  return async function evaluate(codeToEval, flagKeyToEval) {
    try {
      const result = await fliptClient.evaluateBoolean({
        namespaceKey: fliptNamespace,
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
