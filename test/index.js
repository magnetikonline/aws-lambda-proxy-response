'use strict';

const assert = require('assert'),
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
	const resp = new AWSLambdaProxyResponse();

	assert(
		resp.getPayload().statusCode == AWSLambdaProxyResponse.HTTP_STATUS.OK,
		'New AWSLambdaProxyResponse() with no given HTTP status code should default to 200/OK'
	);

	assert(
		Object.keys(resp.getPayload().headers).length == 0,
		'New AWSLambdaProxyResponse() should default to an empty HTTP header collection'
	);

	assert(
		resp.getPayload().body == '',
		'New AWSLambdaProxyResponse() should default to an empty response body payload'
	);

	assert(
		resp == resp.setStatusCode(AWSLambdaProxyResponse.HTTP_STATUS.OK),
		'Call to instance setStatusCode() method should return self'
	);

	assert(
		resp == resp.addHeader({}),
		'Call to instance addHeader() method should return self'
	);

	assert(
		resp == resp.setBody(),
		'Call to instance setBody() method should return self'
	);
}


{
	const TEST_BODY_TEXT = 'Response body',
		TEST_BODY_OBJECT = {
			'one': 'value',
			'two': 'another'
		},
		TEST_BODY_ARRAY = {
			'one': 'value',
			'two': 'another'
		},

		resp = new AWSLambdaProxyResponse();

	// HTTP status
	resp.setStatusCode(AWSLambdaProxyResponse.HTTP_STATUS.BAD_GATEWAY);

	assert(
		resp.getPayload().statusCode == AWSLambdaProxyResponse.HTTP_STATUS.BAD_GATEWAY,
		'Calling instance setStatusCode() method should update statusCode property to new HTTP status value'
	);

	assert.throws(
		() => {
			resp.setStatusCode('INVALID');
		},
		Error,
		'Calling instance setStatusCode() with an invalid HTTP status given should throw an error'
	);

	// HTTP headers
	function testHeaderCollection(expected) {
		assert.deepEqual(
			resp.getPayload().headers,
			expected,
			'Expected header collection does not match actual'
		);
	}

	assert.throws(
		() => {
			resp.addHeader('x-invalid^%$#@-header','value');
		},
		Error,
		'Adding a HTTP header with invalid characters should throw an error'
	);

	assert.throws(
		() => {
			resp.addHeader({
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

	resp.addHeader('x-magnetikonline','developer');
	testHeaderCollection({
		'x-magnetikonline': 'developer'
	});

	resp.addHeader('Content-Type','application/json');
	testHeaderCollection({
		'Content-Type': 'application/json',
		'x-magnetikonline': 'developer'
	});

	resp.addHeader({
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
			resp.getPayload().body == expected,
			`Expected response body of [${expected}] not found`
		);
	}

	resp.setBody(TEST_BODY_TEXT);
	testBody(TEST_BODY_TEXT);

	resp.setBody(TEST_BODY_OBJECT);
	testBody(JSON.stringify(TEST_BODY_OBJECT));

	resp.setBody(TEST_BODY_ARRAY);
	testBody(JSON.stringify(TEST_BODY_ARRAY));
}
