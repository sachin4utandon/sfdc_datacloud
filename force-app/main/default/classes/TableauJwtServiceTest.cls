@IsTest
private class TableauJwtServiceTest {
    @IsTest
    static void getEmbedToken_returnsJwt() {
        String token = TableauJwtService.getEmbedToken();
        System.assertNotEquals(null, token, 'Token should be returned');
        System.assertEquals(2, token.countMatches('.'), 'JWT should have header, payload, and signature');
    }

    @IsTest
    static void buildJwt_hasThreeParts() {
        String token = TableauJwtService.buildJwt('test@example.com');
        System.assertEquals(2, token.countMatches('.'), 'JWT should have header, payload, and signature');
    }
}
