public with sharing class TableauVFController {
    public String jwtToken { get; private set; }
    public String errorMessage { get; private set; }

    public TableauVFController() {
        try {
            jwtToken = TableauJwtService.getEmbedToken();
        } catch (Exception e) {
            jwtToken = '';
            errorMessage = e.getMessage();
        }
    }

    public Boolean getHasToken() {
        return String.isNotBlank(jwtToken);
    }
}
