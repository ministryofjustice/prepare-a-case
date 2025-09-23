const createEvaluator = require('../../server/utils/fliptFilter.js');

(async () => {
  try {
    const evaluate = await createEvaluator();
    const result = await evaluate("B44BA", "pic-test");
    console.log('Feature flag result:', result);
    process.exit(0);
  } catch (err) {
    console.error('Error calling evaluate:', err);
    process.exit(1);
  }
})();
