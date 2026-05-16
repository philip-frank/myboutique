exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'text/xml'
  };

  try {
    const { token, itemId, transactionId, trackingNumber, carrier } = JSON.parse(event.body);

    if (!token || !itemId || !transactionId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Token, itemId, and transactionId are required' })
      };
    }

    const shipmentCarrier = carrier || 'USPS';
    const shipmentTracking = trackingNumber || '';

    const xmlBody = `<?xml version="1.0" encoding="utf-8"?>
<CompleteSaleRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials>
    <eBayAuthToken>${token}</eBayAuthToken>
  </RequesterCredentials>
  <ItemID>${itemId}</ItemID>
  <TransactionID>${transactionId}</TransactionID>
  <Shipped>true</Shipped>
  ${shipmentTracking ? `
  <Shipment>
    <ShipmentTrackingNumber>${shipmentTracking}</ShipmentTrackingNumber>
    <ShippingCarrierUsed>${shipmentCarrier}</ShippingCarrierUsed>
  </Shipment>` : ''}
</CompleteSaleRequest>`;

    const response = await fetch('https://api.ebay.com/ws/api.dll', {
      method: 'POST',
      headers: {
        'X-EBAY-API-SITEID': '0',
        'X-EBAY-API-COMPATIBILITY-LEVEL': '967',
        'X-EBAY-API-CALL-NAME': 'CompleteSale',
        'X-EBAY-API-IAF-TOKEN': token,
        'Content-Type': 'text/xml'
      },
      body: xmlBody
    });

    const text = await response.text();

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'text/xml'
      },
      body: text
    };

  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message })
    };
  }
};
