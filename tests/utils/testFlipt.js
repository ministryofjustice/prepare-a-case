const createEvaluator = require('../../server/utils/fliptFilter.js');

(async () => {
  try {
    const courtsToTest = ['B20BL', 'C20WO', 'B52BB', 'B50AW', 'B46DB']
    const evaluate = await createEvaluator()
    for (const element of courtsToTest) {
      const result = await evaluate(element, 'pic-test')
      console.log('Feature flag result:', result)
    };
    process.exit(0)
  } catch (err) {
    console.error('Error calling evaluate:', err)
    process.exit(1)
  }
})()
