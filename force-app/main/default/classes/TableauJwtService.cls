/**
 * Mints Tableau Connected App (Direct Trust) JWTs for Embedding API v3.
 * POC: credentials are hardcoded — move to Protected Custom Metadata before production.
 */
public with sharing class TableauJwtService {
    private static final String CLIENT_ID = '0cb1caad-3240-4f35-b96e-e7d23dbb915d';
    private static final String SECRET_ID = '033b5d99-9ebf-48db-a474-7b59f8f360c8';

    /**
     * Paste the Secret Value from Tableau Cloud (shown once when the secret is generated).
     * Do not commit the real value to source control.
     */
    private static final String SECRET_VALUE = 'GaIeXT0G+7vWsWT5v2KJ4H62KvAgDBAd/f2TpK4pih8=';

    private static final String AUDIENCE = 'tableau';
    private static final Integer EXPIRY_SECONDS = 300;
    private static final String PLACEHOLDER = 'PASTE_TABLEAU_SECRET_VALUE_HERE';

    @AuraEnabled
    public static String getEmbedToken() {
        if (String.isBlank(SECRET_VALUE) || SECRET_VALUE == PLACEHOLDER) {
            throw new AuraHandledException(
                'Configure TableauJwtService.SECRET_VALUE with your Tableau Connected App secret value.'
            );
        }

        String tableauUsername = UserInfo.getUserEmail();
        if (String.isBlank(tableauUsername)) {
            throw new AuraHandledException('Current user has no email; Tableau JWT sub claim requires a username.');
        }

        return buildJwt(tableauUsername);
    }

    @TestVisible
    private static String buildJwt(String sub) {
        Long exp = DateTime.now().getTime() / 1000 + EXPIRY_SECONDS;
        String header =
            '{"alg":"HS256","typ":"JWT","kid":"' +
            String.escapeSingleQuotes(SECRET_ID) +
            '"}';
        String payload =
            '{"iss":"' +
            String.escapeSingleQuotes(CLIENT_ID) +
            '","sub":"' +
            escapeJson(sub) +
            '","aud":"' +
            AUDIENCE +
            '","exp":' +
            exp +
            ',"jti":"' +
            generateJti() +
            '","scp":["tableau:views:embed"]}';

        String encodedHeader = base64UrlEncode(Blob.valueOf(header));
        String encodedPayload = base64UrlEncode(Blob.valueOf(payload));
        String signingInput = encodedHeader + '.' + encodedPayload;

        Blob signature = Crypto.generateMac(
            'HmacSHA256',
            Blob.valueOf(signingInput),
            Blob.valueOf(SECRET_VALUE)
        );

        return signingInput + '.' + base64UrlEncode(signature);
    }

    private static String base64UrlEncode(Blob value) {
        String encoded = EncodingUtil.base64Encode(value);
        return encoded.replace('+', '-').replace('/', '_').replaceAll('=+$', '');
    }

    private static String generateJti() {
        Blob random = Crypto.generateAesKey(128);
        return EncodingUtil.convertToHex(random);
    }

    private static String escapeJson(String value) {
        return value.replace('\\', '\\\\').replace('"', '\\"');
    }
}
