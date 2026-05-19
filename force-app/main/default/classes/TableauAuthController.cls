public  class TableauAuthController {

    @AuraEnabled(cacheable=false)
    public static String getTableauToken() {

        /*
         * BEST PRACTICE:
         * Move these values to:
         * - Protected Custom Metadata
         * - Named Credentials
         * - Protected Custom Settings
         */

        String clientId =
            '0cb1caad-3240-4f35-b96e-e7d23dbb915d';

        String secretId =
            '033b5d99-9ebf-48db-a474-7b59f8f360c8';

        String secretValue =
            'YOUR_SECRET_VALUE';

        /*
         * Tableau user identity
         * Must match Tableau Cloud username/email
         */

        String userEmail =
            UserInfo.getUserEmail();

        /*
         * JWT HEADER
         */

        Map<String, Object> header =
            new Map<String, Object>();

        header.put('alg', 'HS256');
        header.put('typ', 'JWT');
        header.put('kid', secretId);

        /*
         * JWT PAYLOAD
         */

        Long expirationTime =
            DateTime.now()
                .addMinutes(10)
                .getTime() / 1000;

        Map<String, Object> payload =
            new Map<String, Object>();

        payload.put('iss', clientId);

        payload.put('sub', userEmail);

        payload.put('aud', 'tableau');

        payload.put('exp', expirationTime);

        payload.put(
            'jti',
            EncodingUtil.convertToHex(
                Crypto.generateAesKey(128)
            )
        );

        payload.put(
            'scp',
            new List<String>{
                'tableau:views:embed'
            }
        );

        /*
         * BASE64 URL ENCODE
         */

        String encodedHeader =
            base64UrlEncode(
                Blob.valueOf(
                    JSON.serialize(header)
                )
            );

        String encodedPayload =
            base64UrlEncode(
                Blob.valueOf(
                    JSON.serialize(payload)
                )
            );

        /*
         * CREATE SIGNATURE
         */

        String signingInput =
            encodedHeader + '.' + encodedPayload;

        /*
         * Tableau secret is Base64 encoded
         */

         Blob secretBlob =
         Blob.valueOf(secretValue);

        Blob signatureBlob =
            Crypto.generateMac(
                'HmacSHA256',
                Blob.valueOf(signingInput),
                secretBlob
            );

        String encodedSignature =
            base64UrlEncode(signatureBlob);

        /*
         * FINAL JWT
         */

        return
            signingInput
            + '.'
            + encodedSignature;
    }

    /*
     * Helper Method:
     * Converts standard Base64
     * to Base64URL format
     */

    private static String base64UrlEncode(
        Blob input
    ) {

        String value =
            EncodingUtil.base64Encode(input);

        value =
            value.replace('+', '-');

        value =
            value.replace('/', '_');

        value =
            value.replace('=', '');

        return value;
    }
}