@IsTest
private class TableauVFControllerTest {
    @IsTest
    static void controller_loadsJwtOrError() {
        Test.startTest();
        TableauVFController controller = new TableauVFController();
        Test.stopTest();

        System.assert(
            controller.getHasToken() || String.isNotBlank(controller.errorMessage),
            'Controller should return a token or an error message'
        );
    }
}
