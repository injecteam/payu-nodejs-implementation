'use strict';

// Libs
const path = require('path');
const qs = require('querystring');
const express = require('express');
const axios = require('axios').default;
// Configs
const { APPLICATION, PAYU } = require('./config');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.post('/payment', async (req, res) => {
  try {
    const authUrl = `${PAYU?.URL}/pl/standard/user/oauth/authorize`;
    const authData = {
      grant_type: PAYU?.GRANT_TYPE,
      client_id: PAYU?.CLIENT_ID,
      client_secret: PAYU?.CLIENT_SECRET,
    };
    const authConfig = {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      data: qs.stringify(authData),
      url: authUrl,
    };
    const authResult = (await axios(authConfig))?.data;

    const { access_token } = authResult;

    const body = [];
    for await (const chuck of req) body.push(chuck);
    if (!body.length) throw new Error(411);
    const reqData = JSON.parse(body?.concat());

    const orderUrl = `${PAYU?.URL}/api/v2_1/orders`;
    const orderData = {
      notifyUrl: PAYU?.NOTIFY_URL,
      customerIp: PAYU?.CUSTOMER_IP,
      merchantPosId: PAYU?.MERCHANT_POS_ID,
      description: 'Test polish market',
      currencyCode: 'PLN',
      totalAmount: reqData?.totalAmount,
      buyer: reqData?.buyer,
      products: reqData?.products,
    };
    const orderConfig = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${access_token}`,
      },
      data: orderData,
      url: orderUrl,
      maxRedirects: 0,
      validateStatus: (status) =>
        (status >= 200 && status < 300) || status === 302,
    };

    const orderResult = await axios(orderConfig);
    const orderResultData = orderResult.data;
    console.log(orderResultData);
    res.end(JSON.stringify(orderResultData));
  } catch (error) {
    console.info('/payment error');
    // console.error(error);
    res.end(JSON.stringify(error));
  }
});

app.listen(APPLICATION?.PORT, APPLICATION?.HOST);
