'use strict';

let assert = require('assert'),
	AWSLambdaProxyResponse = require('../index.js');


{
	assert.doesNotThrow(
		() => {

			new AWSLambdaProxyResponse();
		},
		Error,
		'Creating new AWSLambdaProxyResponse() without argument should not throw an error'
	);

	assert.doesNotThrow(
		() => {

			new AWSLambdaProxyResponse(AWSLambdaProxyResponse.HTTP_STATUS.MOVED);
		},
		Error,
		'Creating new AWSLambdaProxyResponse() with valid HTTP status given should not throw an error'
	);

	assert.throws(
		() => {

			new AWSLambdaProxyResponse('INVALID');
		},
		Error,
		'Creating new AWSLambdaProxyResponse() with invalid HTTP status given should throw an error'
	);
}


{
	let response = new AWSLambdaProxyResponse();

	assert(
		response.getPayload().statusCode == AWSLambdaProxyResponse.HTTP_STATUS.OK,
		'New AWSLambdaProxyResponse() with no given HTTP status code should default to 200/OK'
	);

	assert(
		Object.keys(response.getPayload().headers).length == 0,
		'New AWSLambdaProxyResponse() should default to an empty HTTP header collection'
	);

	assert(
		response.getPayload().body == '',
		'New AWSLambdaProxyResponse() should default to an empty response body payload'
	);

	assert(
		response == response.setStatusCode(AWSLambdaProxyResponse.HTTP_STATUS.OK),
		'Call to instance setStatusCode() method should return self'
	);

	assert(
		response == response.addHeader({}),
		'Call to instance addHeader() method should return self'
	);

	assert(
		response == response.setBody(),
		'Call to instance setBody() method should return self'
	);
}


{
	let TEST_BODY_TEXT = 'Response body',
		TEST_BODY_OBJECT = {
			'one': 'value',
			'two': 'another'
		},
		TEST_BODY_ARRAY = {
			'one': 'value',
			'two': 'another'
		},

		response = new AWSLambdaProxyResponse();

	// HTTP status
	response.setStatusCode(AWSLambdaProxyResponse.HTTP_STATUS.BAD_GATEWAY);

	assert(
		response.getPayload().statusCode == AWSLambdaProxyResponse.HTTP_STATUS.BAD_GATEWAY,
		'Calling instance setStatusCode() method should update statusCode property to new HTTP status value'
	);

	assert.throws(
		() => {

			response.setStatusCode('INVALID');
		},
		Error,
		'Calling instance setStatusCode() with an invalid HTTP status given should throw an error'
	);

	// HTTP headers
	function testHeaderCollection(expected) {

		assert.deepEqual(
			response.getPayload().headers,
			expected,
			'Expected header collection does not match actual'
		);
	}

	assert.throws(
		() => {

			response.addHeader('x-invalid^%$#@-header','value');
		},
		Error,
		'Adding a HTTP header with invalid characters should throw an error'
	);

	assert.throws(
		() => {

			response.addHeader({
				'x-first': 'value',
				'x-second': 'value',
				'x-invalid^%$#@-header': 'value'
			});
		},
		Error,
		'Adding multiple HTTP headers with an invalid character entry should throw an error'
	);

	// note: when adding multiple headers and any one is invalid, none should be added - this next line tests that is true
	testHeaderCollection({});

	response.addHeader('x-magnetikonline','developer');
	testHeaderCollection({
		'x-magnetikonline': 'developer'
	});

	response.addHeader('Content-Type','application/json');
	testHeaderCollection({
		'Content-Type': 'application/json',
		'x-magnetikonline': 'developer'
	});

	response.addHeader({
		'x-another-header': 'value',
		'x-fourth-header': 'apples'
	});

	testHeaderCollection({
		'Content-Type': 'application/json',
		'x-another-header': 'value',
		'x-fourth-header': 'apples',
		'x-magnetikonline': 'developer'
	});

	// response body
	function testBody(expected) {

		assert(
			response.getPayload().body == expected,
			`Expected response body of [${expected}] not found`
		);
	}

	response.setBody(TEST_BODY_TEXT);
	testBody(TEST_BODY_TEXT);

	response.setBody(TEST_BODY_OBJECT);
	testBody(JSON.stringify(TEST_BODY_OBJECT));

	response.setBody(TEST_BODY_ARRAY);
	testBody(JSON.stringify(TEST_BODY_ARRAY));
}
