/* global jest, describe, it, expect */
const { get, post } = require('../../../../server/routes/manage-courts/handlers/manageCourtByState')
const { settings } = require('../../../../server/config')

describe('manageCourtsByState', () => {
    const testBasePath = '/my-courts'
    const testNonce = 'test-nonce'
    const testRequestPath = '/req-path'
    const testState = 'test-state'
    const testUsername = 'test-username'

    const defaultCourts = () => ['test-court-A', 'test-court-B']

    const redirectReturnMarker = 'redirect-return-marker'
    const mockResponse = () => ({
        render: jest.fn(),
        redirect: jest.fn(path => redirectReturnMarker),
        locals: { nonce: testNonce, user: { username: testUsername }}
    })

    describe('GET Handler', () => { 
        const expectedViewTemplate = 'edit-courts'
        const validCourt = defaultCourts()[0]
        const invalidCourt = 'test-court-nill'

        const updateSelectedCourtsMock = jest.fn(({}) => ({status: 200}))
        const updateSelectedCourtsMockFailing = jest.fn(({}) => ({status: 400}))
        const requestQueries = (queries = {}) => ({
            error: queries.error ?? false,
            remove: queries.remove ?? null,
            save: queries.save ?? false
        })
        const mockGETRequest = (state, queries, courts) => ({
            params: { state },
            query: queries,
            session: { courts },
            path: testRequestPath
        })

        const subject = get(testBasePath, updateSelectedCourtsMock)
        const subjectWithFailingUpdate = get(testBasePath, updateSelectedCourtsMockFailing)

        const expectedRenderCalledWith = (expected = {}) => ({
            formError: expected.formError ?? false,
            serverError: expected.serverError ?? false,
            state: expected.state ?? testState,
            params: {
                availableCourts: settings.availableCourts,
                chosenCourts: expected.courts ?? defaultCourts(),
                nonce: expected.nonce ?? testNonce
            }
        })

        describe('GIVEN the handler is called with a given state and no specified query parameters', () => {
            it('THEN the template is rendered with the expected default values', async () => {
                const request = mockGETRequest(testState, requestQueries(), defaultCourts())
                const response = mockResponse()

                await subject(request, response)

                expect(response.render).toHaveBeenCalledWith(expectedViewTemplate, expectedRenderCalledWith())
            })
        })

        describe('GIVEN that the error query param is flagged', () => {
            it('THEN the template is rendered is the formError template param', () => {
                const errorRequest = mockGETRequest(testState, requestQueries({error: true}), defaultCourts())
                const response = mockResponse()

                subject(errorRequest, response)

                expect(response.render).toHaveBeenCalledWith(expectedViewTemplate, expectedRenderCalledWith({formError: true}))
            })
        })

        describe('GIVEN that the remove query param is flagged', () => {
            describe('AND the current session has courts available', () => {
                describe('WHEN the selected court is found in the available courts', () => {
                    const courtFoundSuite = async () => {
                        const request = mockGETRequest(testState, requestQueries({remove: validCourt}), defaultCourts())
                        const response = mockResponse();
                        const result = await subject(request, response)
                        return { request, response, result }
                    }
                    it('THEN the selected count is removed from the session', async () => {
                        const { request } = await courtFoundSuite()

                        expect(request.session.courts.includes(validCourt)).toBe(false)
                        expect(request.session).toEqual({courts: ['test-court-B']})
                    })
                    it('AND the response is redirected to the request\'s path', async ()=> {
                        const { request, response, result } = await courtFoundSuite()

                        expect(response.redirect).toHaveBeenCalledWith(request.path)
                        expect(result).toEqual(redirectReturnMarker)
                    })
                    it('AND no render occurs', async () => {
                        const { response } = await courtFoundSuite()

                        expect(response.render).not.toHaveBeenCalled()
                    })
                })
                describe('WHEN the selected court is not found in the available courts', () => {
                    const courtNotFoundSuite = async () => {
                        const request = mockGETRequest(testState, requestQueries({remove: invalidCourt}), defaultCourts())
                        const response = mockResponse()
                        const result = await subject(request, response)
                        return {request, response, result}
                    }
                    it('THEN no redirect occurs', async () => {
                        const { response } = await courtNotFoundSuite()

                        expect(response.redirect).not.toHaveBeenCalled()
                    })
                    it('AND the default template render occurs', async () => {
                        const { response } = await courtNotFoundSuite()

                        expect(response.render).toHaveBeenCalledWith(expectedViewTemplate, expectedRenderCalledWith())
                    })
                })
            })
            describe('AND the current session does not have courts available', () => {
                const noSessionCourtsSuite = async () => {
                    const request = mockGETRequest(testState, requestQueries({remove: validCourt}), [])
                    const response = mockResponse()
                    const result = await subject(request, response)
                    return {request, response, result}
                }
                it('THEN no redirect occurs', async () => {
                    const { response } = await noSessionCourtsSuite()

                    expect(response.redirect).not.toHaveBeenCalled()
                })
                it('AND the template is rendered but with no courts', async () => {
                    const { response } = await noSessionCourtsSuite()

                    expect(response.render).toHaveBeenCalledWith(expectedViewTemplate, expectedRenderCalledWith({courts: []}))
                })
            })
        })

        describe('GIVEN that the save query param is flagged', () => {
            describe('AND the current session has courts avaialble', () => {
                it('THEN updateSelectedCourts is called with tthe expected details', async () => {
                    const request = mockGETRequest(testState, requestQueries({save: true}), defaultCourts())
                    const response = mockResponse()

                    await subject(request, response)

                    expect(updateSelectedCourtsMock).toHaveBeenCalledWith(testUsername, defaultCourts())
                })
                describe('WHEN the updateSelectedCourts called fails', () => {
                    it('THEN the template is rendered with a serverError', async () => {
                        const request = mockGETRequest(testState, requestQueries({save: true}), defaultCourts())
                        const response = mockResponse()

                        await subjectWithFailingUpdate(request, response)

                        expect(response.render).toHaveBeenCalledWith(expectedViewTemplate, expectedRenderCalledWith({serverError: true}))
                    })
                })
                describe('WHEN the updateSelectedCourts call succeeds', () => {
                    it('THEN the response is redirected to the base route', async () => {
                        const request = mockGETRequest(testState, requestQueries({save: true}), defaultCourts())
                        const response = mockResponse()

                        const result = await subject(request, response)

                        expect(response.redirect).toHaveBeenCalledWith(302, testBasePath)
                        expect(result).toEqual(redirectReturnMarker)
                    })
                })
            })
            describe('AND the current session does not have courts available', () => {
                it('THEN the template is rendered with a formError and no courts', async () => {
                    const request = mockGETRequest(testState, requestQueries({save: true}), [])
                    const response = mockResponse()

                    await subject(request, response)

                    expect(response.render).toHaveBeenCalledWith(expectedViewTemplate, expectedRenderCalledWith({formError: true, courts: []}))
                })
            })
        })
    })

    describe ('POST Handler', () => {
        const additionalCourt = 'test-court-Z'
        const existingCourt = defaultCourts()[0]

        const mockPOSTRequest = (state, courts, bodyCourt) => ({
            params: { state },
            session: { courts },
            body: { court: bodyCourt },
            path: testRequestPath
        })

        const subject = post(testBasePath)

        describe('GIVEN the handler is called with a given state', () => {
            describe('AND no court is provided in the request body', () => {
                const noCourtProvidedSuite = async () => {
                    const request = mockPOSTRequest(testState, defaultCourts(), undefined)
                    const response = mockResponse()
                    const result = await subject(request, response)
                    return { request, response, result }
                }
                it('THEN the response is redirected back to the base route', async () => {
                    const { response, result } = await noCourtProvidedSuite()

                    expect(response.redirect).toHaveBeenCalledWith(302, expect.stringContaining(testBasePath))
                    expect(result).toEqual(redirectReturnMarker)
                })
                it('AND the given state is maintained', async () => {
                    const { response, result } = await noCourtProvidedSuite()

                    expect(response.redirect).toHaveBeenCalledWith(302, expect.stringContaining(testState))
                    expect(result).toEqual(redirectReturnMarker)
                })
                it('AND the error query param is provided as true', async () => {
                    const { response, result } = await noCourtProvidedSuite()

                    expect(response.redirect).toHaveBeenCalledWith(302, expect.stringContaining('?error=true'))
                    expect(result).toEqual(redirectReturnMarker)
                })
            })
            describe('AND a court is provided in the request body', () => {
                describe('WHEN the court is not in the existing session\'s courts', () => {
                    const noCourtsTestCases = [
                        {name: 'session contains no courts', value: undefined, expectedResult: [additionalCourt]},
                        {name: 'session contains an empty courts list', value: [], expectedResult: [additionalCourt]},
                        {name: 'session contains an existing list of courts', value: defaultCourts(), expectedResult: [...defaultCourts(), additionalCourt]},
                    ]
                    noCourtsTestCases.forEach(({ name, value, expectedResult }) => {
                        describe(`- ${name}`, () => {
                            const courtNotAlreadyInSessionSuite = async () => {
                                const request = mockPOSTRequest(testState, value, additionalCourt)
                                const response = mockResponse()
                                const result = await subject(request, response)
                                return { request, response, result }
                            }
                            it('THEN the request court is added the the session\'s courts', async () => {
                                const { request } = await courtNotAlreadyInSessionSuite()

                                expect(request.session.courts).toBeDefined()
                                expect(request.session.courts).toEqual(expectedResult)
                            })
                            it('AND the response is redirected to the request\'s path', async () => {
                                const { request, response } = await courtNotAlreadyInSessionSuite()

                                expect(response.redirect).toHaveBeenCalledWith(request.path)
                            })
                        })
                    })
                })
                describe('WHEN the court already exists in the session\'s courts', () => {
                    const existingCourtSuite = async () => {
                        const request = mockPOSTRequest(testState, defaultCourts(), existingCourt)
                        const response = mockResponse()
                        const result = await subject(request, response)
                        return { request, response, result }
                    }
                    it('THEN the court is not duplicated in the session\'s courts', async () => {
                        const { request } = await existingCourtSuite()

                        expect(request.session.courts).toBeDefined()
                        expect(request.session.courts).toEqual(defaultCourts())
                    })
                    it('AND the response is redirected to the request\'s path', async () => {
                        const { request, response } = await existingCourtSuite()

                        expect(response.redirect).toHaveBeenCalledWith(request.path)
                    })
                })
            })
        })
    })
})